import {
    CancellationToken,
    CompletionItem,
    CompletionItemKind,
    CompletionItemProvider,
    Position, TextDocument
} from 'vscode';

import * as vscode from 'vscode';

export default class GameCompletionItemProvider implements CompletionItemProvider {
    private static defined_objects:string[] = [];

    public provideCompletionItems(document: TextDocument, position: Position, token: CancellationToken, context: vscode.CompletionContext): CompletionItem[] {
        let linePrefix = document.lineAt(position).text.substr(0, position.character);
        
        if (linePrefix.endsWith('game.')) {
            let res = vscode.workspace.findFiles('**/*main.brs');

            res.then(function(value) {
                if (value.length > 0) {
                    vscode.workspace.openTextDocument(value[0]).then(function(mainTextDocument) {
                        let text = mainTextDocument.getText();
                        let matches = text.match(new RegExp('defineObject\\("(.+?)"', 'ig'));
                        if (matches !== null) {
                            GameCompletionItemProvider.defined_objects = [];
                            matches.forEach(match => {
                                match = match.substring(14, match.length - 1);
                                GameCompletionItemProvider.defined_objects.push(match);
                                console.log(match);
                            });
                        }
                    });
                }
            });

            let snippet = "createInstance";
            if (GameCompletionItemProvider.defined_objects.length > 0) {
                snippet += "(${1|";
                for (let index = 0; index < GameCompletionItemProvider.defined_objects.length; index++) {
                    snippet += '"' + GameCompletionItemProvider.defined_objects[index] + '"';
                    if (index < GameCompletionItemProvider.defined_objects.length - 1) {
                        snippet += ",";
                    }
                }
                snippet += "|}${2: [, args as Object]})";
            } else {
                snippet += '(${1:object_name as String}${2: [, args as Object]})';
            }

            let test:CompletionItem[] = [
                {
                    label: 'createInstance',
                    kind: CompletionItemKind.Method,
                    insertText: new vscode.SnippetString(snippet),
                    documentation: 'Does something magical'
                }
            ]
            return test;
        }

        return [];
    }
}

