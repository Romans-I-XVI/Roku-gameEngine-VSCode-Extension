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
            completionItems.push(
                {
                    kind: CompletionItemKind.Method,
                    label: "Mtesting"
                }
            );
        }

        return completionItems;
    }
}