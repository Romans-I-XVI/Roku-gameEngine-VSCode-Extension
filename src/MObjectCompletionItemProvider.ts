import {
    CancellationToken,
    CompletionItem,
    CompletionItemKind,
    CompletionItemProvider,
    Position, TextDocument
} from 'vscode';

import * as vscode from 'vscode';

export default class MObjectCompletionItemProvider implements CompletionItemProvider {

    public provideCompletionItems(document: TextDocument, position: Position, token: CancellationToken, context: vscode.CompletionContext): CompletionItem[] {
        let linePrefix = document.lineAt(position).text.substr(0, position.character);
        let completionItems: CompletionItem[] = [];

        let endsWithM = linePrefix.endsWith('m.');
        if (!endsWithM) {
            return [];
        }
        let precededByChars = (linePrefix.match(new RegExp('([a-z|0-9|_])m\\.', 'i')) !== null);
        let partOfGameObject = (document.getText().match(new RegExp('object\\.onCreate(\\s*)=(\\s*)function', 'i')) !== null);


        if (endsWithM && !precededByChars && partOfGameObject) {
            let variableCompletionItems = this.getStandardObjectVariableCompletionItems();
            variableCompletionItems.forEach(element => {
                completionItems.push(element);
            });
        }

        return completionItems;
    }

    private getStandardObjectVariableCompletionItems(): CompletionItem[] {
        return [
            {
                kind: CompletionItemKind.Constant,
                label: 'name'
            },
            {
                kind: CompletionItemKind.Constant,
                label: 'id'
            },
            {
                kind: CompletionItemKind.Constant,
                label: 'game'
            },
            {
                kind: CompletionItemKind.Variable,
                label: 'enabled'
            },
            {
                kind: CompletionItemKind.Variable,
                label: 'persistent'
            },
            {
                kind: CompletionItemKind.Variable,
                label: 'pauseable'
            },
            {
                kind: CompletionItemKind.Variable,
                label: 'depth'
            },
            {
                kind: CompletionItemKind.Variable,
                label: 'x'
            },
            {
                kind: CompletionItemKind.Variable,
                label: 'y'
            }
        ];
    }
}