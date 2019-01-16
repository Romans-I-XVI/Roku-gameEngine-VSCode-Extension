import {
    CancellationToken,
    CompletionItem,
    CompletionItemKind,
    CompletionItemProvider,
    Position, TextDocument
} from 'vscode';

import * as vscode from 'vscode';
import MainDefinitionWatcher from './MainDefinitionWatcher';

export default class GameCompletionItemProvider implements CompletionItemProvider {

    public provideCompletionItems(document: TextDocument, position: Position, token: CancellationToken, context: vscode.CompletionContext): CompletionItem[] {
        let linePrefix = document.lineAt(position).text.substr(0, position.character);
        let completionItems: CompletionItem[] = [];
        let showObjectCompletionItems = false;

        if (linePrefix.endsWith('m.')) {
            // NOT WORKING
            // if (substring.match(new RegExp('[^a-z0-9_]m\\.', 'i')) !== null) {
            //     showObjectCompletionItems = true;
            // }
        }

        return completionItems;
    }
}