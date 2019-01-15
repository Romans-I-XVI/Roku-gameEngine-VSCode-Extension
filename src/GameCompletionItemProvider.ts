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
        
        if (linePrefix.endsWith('game.')) {
            let snippet = "createInstance";
            if (MainDefinitionWatcher.definedObjects.length > 0) {
                snippet += "(${1|";
                for (let index = 0; index < MainDefinitionWatcher.definedObjects.length; index++) {
                    snippet += '"' + MainDefinitionWatcher.definedObjects[index] + '"';
                    if (index < MainDefinitionWatcher.definedObjects.length - 1) {
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

