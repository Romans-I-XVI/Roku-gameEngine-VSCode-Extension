import * as vscode from 'vscode';

export default class MainDefinitionWatcher{
    private static _definedObjects: string[] = [];
    public static get definedObjects() : string[] {
        return MainDefinitionWatcher._definedObjects;
    }

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
        vscode.workspace.openTextDocument(uri).then(function(mainTextDocument) {
            let text = mainTextDocument.getText();
            let matches = text.match(new RegExp('defineObject\\("(.+?)"', 'ig'));
            if (matches !== null) {
                MainDefinitionWatcher._definedObjects = [];
                matches.forEach(match => {
                    match = match.substring(14, match.length - 1);
                    MainDefinitionWatcher.definedObjects.push(match);
                    console.log(match);
                });
            }
        });
    }
}