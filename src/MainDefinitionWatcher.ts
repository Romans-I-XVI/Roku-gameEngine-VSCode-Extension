import * as vscode from 'vscode';

export default class MainDefinitionWatcher {
    private static _definitions: { [key: string]: string[] } = {
        defineObject: [],
        defineRoom: [],
        loadFont: [],
        loadSound: [],
        loadBitmap: [],
    };
    public static get Definitions(): { [key: string]: string[] } {
        return MainDefinitionWatcher._definitions;
    }

    private static regexSuffix: string = '(.*?)\\((.*?)"(.*?)"';
    private static watcher: vscode.FileSystemWatcher;

    public static Initialize() {
        vscode.workspace.findFiles('**/*main.brs').then(
            (value) => {
                if (value.length > 0) {
                    this.refreshDefinitions(value[0]);
                }
            }
        );
        this.watcher = vscode.workspace.createFileSystemWatcher('**/*main.brs');
        this.watcher.onDidChange((event) => this.refreshDefinitions(event));
    }

    private static refreshDefinitions(uri: vscode.Uri) {
        for (let key in this._definitions) {
            this.loadDefinitions(uri, key);
        }
    }

    private static loadDefinitions(uri: vscode.Uri, key: string) {
        vscode.workspace.openTextDocument(uri).then((mainTextDocument) => {
            MainDefinitionWatcher._definitions[key] = [];
            let text = mainTextDocument.getText();
            let expression = new RegExp(key + this.regexSuffix, 'ig');
            let matches = text.match(expression);
            if (matches !== null) {
                matches.forEach(match => {
                    let submatches = match.match('"(.*)"');
                    if (submatches !== null) {
                        let submatch = submatches[0];
                        submatch = submatch.substring(1, submatch.length - 1);
                        MainDefinitionWatcher._definitions[key].push(submatch);
                    }
                });
            }
        });
    }
}