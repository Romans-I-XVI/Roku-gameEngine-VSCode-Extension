import {
    CancellationToken,
    CompletionItem,
    CompletionItemKind,
    CompletionItemProvider,
    Position, TextDocument
} from 'vscode';

import * as vscode from 'vscode';

export default class GameCompletionItemProvider implements CompletionItemProvider {

    public provideCompletionItems(document: TextDocument, position: Position, token: CancellationToken, context: vscode.CompletionContext): CompletionItem[] {
        let linePrefix = document.lineAt(position).text.substr(0, position.character);
        let completionItems: CompletionItem[] = [];

        let endsWithObject = linePrefix.endsWith('object.');
        let precededByChars = (linePrefix.match(new RegExp('([a-z|0-9|_])object\\.', 'i')) !== null);
        let partOfGameObject = (document.getText().match(new RegExp('object\\.onCreate', 'i')) !== null);

        if (endsWithObject && !precededByChars && partOfGameObject) {
            completionItems.push(
                {
                    kind: CompletionItemKind.Method,
                    label: "testing"
                }
            );
        }

        return completionItems;
    }
}