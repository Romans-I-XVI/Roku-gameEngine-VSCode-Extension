import {
    CancellationToken,
    CompletionItem,
    CompletionItemKind,
    CompletionItemProvider,
    Position, TextDocument
} from 'vscode';

import * as vscode from 'vscode';

export default class ObjectCompletionItemProvider implements CompletionItemProvider {

    public provideCompletionItems(document: TextDocument, position: Position, token: CancellationToken, context: vscode.CompletionContext): CompletionItem[] {
        let linePrefix = document.lineAt(position).text.substr(0, position.character);
        let completionItems: CompletionItem[] = [];

        let endsWithObject = linePrefix.endsWith('object.');
        if (!endsWithObject) {
            return [];
        }
        let precededByChars = (linePrefix.match(new RegExp('([a-z|0-9|_])object\\.', 'i')) !== null);
        let partOfGameObject = (document.getText().match(new RegExp('object\\.onCreate', 'i')) !== null);



        if (endsWithObject && !precededByChars && partOfGameObject) {
            let existingOverrideMethods = this.getExistingOverrideMethods(document);

            for (let key in existingOverrideMethods) {
                let exists = existingOverrideMethods[key];
                if (!exists) {
                    completionItems.push(this.completionItemsDictionary[key]);
                }
            }
        }

        return completionItems;
    }

    private getExistingOverrideMethods(document: TextDocument): { [key: string]: boolean } {
        let existingOverrideMethods: { [key: string]: boolean } = {}
        for (let key in this.completionItemsDictionary) {
            existingOverrideMethods[key] = false;
        }

        for (let key in existingOverrideMethods) {
            let regex = new RegExp('object\\.' + key + '(.*)=(.*)function', 'i')
            let exists = (document.getText().match(regex) !== null);
            if (exists) {
                existingOverrideMethods[key] = true;
            }
        }

        return existingOverrideMethods;
    }

    private completionItemsDictionary: { [key: string]: CompletionItem } = {
        onUpdate: {
            kind: CompletionItemKind.Snippet,
            label: 'onUpdate',
            insertText: new vscode.SnippetString(
                'onUpdate = function(dt as Float)\n' +
                '\t$0\n' +
                'end function'
            ),
            detail: 'onUpdate(dt as Float)',
            documentation: new vscode.MarkdownString(
                `The main update loop for an entity with delta time passed in.`
            )
        }
    };
}
