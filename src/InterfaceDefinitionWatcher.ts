import * as vscode from 'vscode';
import MainDefinitionWatcher from './MainDefinitionWatcher';

export default class InterfaceDefinitionWatcher {
    private static _completion_items: { [key: string]: vscode.CompletionItem[] } = {};
    public static get CompletionItems(): { [key: string]: vscode.CompletionItem[] } {
        return InterfaceDefinitionWatcher._completion_items;
    }

    private static watcher: vscode.FileSystemWatcher;

    public static Initialize() {
        vscode.workspace.findFiles('**/*.brs').then(
            (value) => {
                if (value.length > 0) {
                    value.forEach(uri => {
                        this.refreshCompletionItems(uri);
                    });
                }
            }
        );
        this.watcher = vscode.workspace.createFileSystemWatcher('**/*.brs');
        this.watcher.onDidChange((event) => this.refreshCompletionItems(event));
    }

    public static Dispose() {
        this.watcher.dispose();
    }

    private static refreshCompletionItems(uri: vscode.Uri) {
        MainDefinitionWatcher.Definitions['defineInterface'].forEach(interface_definition => {
            if (interface_definition in MainDefinitionWatcher.FunctionNames['defineInterface']) {
                let function_name = MainDefinitionWatcher.FunctionNames['defineInterface'][interface_definition];
                this.loadCompletionItems(uri, interface_definition, function_name);
            }
        });
    }

    private static loadCompletionItems(uri: vscode.Uri, definition_name: string, function_name: string) {
        vscode.workspace.openTextDocument(uri).then((document) => {
            let text = document.getText();
            let find_definition_expression = new RegExp('function (\\s*)' + function_name + '(\\s*)\\((.*)\\)', 'ig');
            let matches = text.match(find_definition_expression);
            if (matches !== null) {
                let interface_name_submatch = matches[0].match('\\((.*)\\)');
                if (interface_name_submatch !== null) {
                    let interface_name = interface_name_submatch[0].trim();
                    let completion_items = this.parseInterfacePropertiesFromText(text, interface_name);
                    this._completion_items[definition_name] = completion_items;
                }
            }
        });
    }

    private static parseInterfacePropertiesFromText(text: string, interface_name: string): vscode.CompletionItem[] {
        let completion_items: vscode.CompletionItem[] = [];
        let declaration_regex = new RegExp(interface_name + '\\.(.*)=', 'ig');
        let declaration_matches = text.match(declaration_regex);
        if (declaration_matches !== null) {
            completion_items.push(
                {
                    label: 'owner',
                    kind: vscode.CompletionItemKind.Constant
                }
            );
            declaration_matches.forEach(match => {
                let precededByChars = (match.match(new RegExp('([a-z|0-9|_])' + interface_name + '\\.', 'i')) !== null);
                if (!precededByChars) {
                    let property = match.substring(interface_name.length - 1, match.length - 1);
                    property = property.trim();
                    completion_items.push(
                        {
                            label: property,
                            kind: vscode.CompletionItemKind.Variable
                        }
                    );
                }
            });
        }

        return completion_items;
    }
}