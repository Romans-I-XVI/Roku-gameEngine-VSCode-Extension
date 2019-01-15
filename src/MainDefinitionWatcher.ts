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

    private regexSuffix: string = '(.*?)\\((.*?)"(.*?)"';

    public constructor() {
        vscode.workspace.findFiles('**/*main.brs').then(
            (value) => {
                if (value.length > 0) {
                    this.refreshDefinitions(value[0]);
                }
            }
        );
        var watcher = vscode.workspace.createFileSystemWatcher('**/*main.brs');
        watcher.onDidChange((event) => this.refreshDefinitions(event));
    }

    private refreshDefinitions(uri: vscode.Uri) {
        for (let key in MainDefinitionWatcher._definitions) {
            this.loadDefinitions(uri, key);
        }
    }

    private loadDefinitions(uri: vscode.Uri, key: string) {
        vscode.workspace.openTextDocument(uri).then((mainTextDocument) => {
            let text = mainTextDocument.getText();
            text = text.replace(new RegExp('[\n\r]', 'g'), "");
            let expression = new RegExp(key + this.regexSuffix, 'ig');
            let matches = text.match(expression);
            if (matches !== null) {
                MainDefinitionWatcher._definitions[key] = [];
                matches.forEach(match => {
                    console.log(match);
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