import * as vscode from 'vscode';

export default class MainDefinitionWatcher{
    private static _definedObjects: string[] = [];
    public static get definedObjects() : string[] {
        return MainDefinitionWatcher._definedObjects;
    }

    private regexSuffix: string = '(\\n*.*)\\((\\n*.*)"(.*)"';

    public constructor(){
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

    private refreshDefinitions(uri:vscode.Uri){
        this.loadDefinedObjects(uri);
    }

    private loadDefinedObjects(uri:vscode.Uri){
        vscode.workspace.openTextDocument(uri).then((mainTextDocument) => {
            let text = mainTextDocument.getText();
            let expression = new RegExp('defineObject' + this.regexSuffix, 'ig');
            let matches = text.match(expression);
            if (matches !== null) {
                MainDefinitionWatcher._definedObjects = [];
                matches.forEach(match => {
                    console.log(match);
                    let submatches = match.match('"(.*)"');
                    if (submatches !== null) {
                        let submatch = submatches[0];
                        submatch = submatch.substring(1, submatch.length - 1);
                        MainDefinitionWatcher.definedObjects.push(submatch);
                    }
                });
            }
        });
    }
}