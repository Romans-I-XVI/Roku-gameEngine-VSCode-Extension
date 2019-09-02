import {
    CancellationToken,
    CompletionItem,
    CompletionItemProvider,
    Position, TextDocument
} from 'vscode';

import * as vscode from 'vscode';
import InterfaceDefinitionWatcher from './InterfaceDefinitionWatcher';

export default class InterfaceCompletionItemProvider implements CompletionItemProvider {

    public provideCompletionItems(document: TextDocument, position: Position, token: CancellationToken, context: vscode.CompletionContext): CompletionItem[] {
        let linePrefix = document.lineAt(position).text.substr(0, position.character);
        let completionItems: CompletionItem[] = [];

        for (let key in InterfaceDefinitionWatcher.CompletionItems) {
            console.log('.' + key + '.');
            if (linePrefix.endsWith('.' + key + '.')) {
                return InterfaceDefinitionWatcher.CompletionItems[key];
            }
        }

        return completionItems;
    }
}
