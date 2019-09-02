import * as vscode from 'vscode';
import InterfaceDefinitionWatcher from './InterfaceDefinitionWatcher';

export default class MainDefinitionWatcher {
    private static _function_names: { [key: string]: { [key: string]: string } } = {
        defineObject: {},
        defineRoom: {},
        defineInterface: {}
    };
    public static get FunctionNames(): { [key: string]: { [key: string]: string } } {
        return MainDefinitionWatcher._function_names;
    }

    private static _definitions: { [key: string]: string[] } = {
        defineObject: [],
        defineRoom: [],
        loadFont: [],
        loadSound: [],
        loadBitmap: [],
        defineInterface: []
    };
    public static get Definitions(): { [key: string]: string[] } {
        return MainDefinitionWatcher._definitions;
    }

    public static GetDefinitionsAsCommaSeparatedStrings(key: string): string {
        let definitions = this._definitions[key];
        let s = '';
        for (let index = 0; index < definitions.length; index++) {
            s += '"' + definitions[index] + '"';
            if (index < definitions.length - 1) {
                s += ',';
            }
        }
        return s;
    }

    private static regexSuffix: string = '(.*?)\\((.*?)\\)';
    private static watcher: vscode.FileSystemWatcher;

    public static Initialize() {
        vscode.workspace.findFiles('**/*main.brs').then(
            (value) => {
                if (value.length > 0) {
                    this.refreshDefinitions(value[0]);
                }
	            InterfaceDefinitionWatcher.Initialize();
            }
        );
        this.watcher = vscode.workspace.createFileSystemWatcher('**/*main.brs');
        this.watcher.onDidChange((event) => this.refreshDefinitions(event));
    }

    public static Dispose() {
        this.watcher.dispose();
    }

    private static refreshDefinitions(uri: vscode.Uri) {
        for (let key in this._definitions) {
            this.loadDefinitions(uri, key);
        }
    }

    private static loadDefinitions(uri: vscode.Uri, key: string) {
        vscode.workspace.openTextDocument(uri).then((mainTextDocument) => {
            MainDefinitionWatcher._definitions[key] = [];
            MainDefinitionWatcher._function_names[key] = {};
            let text = mainTextDocument.getText();
            let expression = new RegExp(key + this.regexSuffix, 'ig');
            let matches = text.match(expression);
            if (matches !== null) {
                matches.forEach(match => {
                    let definition_submatches = match.match('"(.*?)"');
                    if (definition_submatches !== null) {
                        let definition_submatch = definition_submatches[0];
                        definition_submatch = definition_submatch.substring(1, definition_submatch.length - 1);
                        MainDefinitionWatcher._definitions[key].push(definition_submatch);

                        if (key === 'defineObject' || key === "defineRoom" || key === "defineInterface") {
                            let function_submatches = match.match(',(.*)\\)');
                            if (function_submatches !== null) {
                                let function_submatch = function_submatches[0];
                                function_submatch = function_submatch.substring(1, function_submatch.length - 1);
                                function_submatch = function_submatch.trim();
                                MainDefinitionWatcher._function_names[key][definition_submatch] = function_submatch;
                            }
                        }
                    }
                });
            }
        });
    }
}