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
            return this.getGameCompletionItems();
        }

        return [];
    }

    private getGameCompletionItems(): CompletionItem[]{
        let completionItems = this.getStaticCompletionItems();
        completionItems.push(this.getDynamicCompletionItem_createInstance());
        return completionItems;
    }

    private getDynamicCompletionItem_createInstance(): CompletionItem {
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

        return {
            kind: CompletionItemKind.Method,
            label: 'createInstance',
            detail: 'createInstance(object_name as String, args = {} as Object) as Dynamic',
            insertText: new vscode.SnippetString(snippet),
            documentation: new vscode.MarkdownString(
                `Spawns a new instance of a previously defined game object. Returns the new instance if it was created successfully, otherwise returns invalid.`
            )
        };
    }

    private getStaticCompletionItems(): CompletionItem[] {
        return [
            {
                kind: CompletionItemKind.Method,
                label: 'drawColliders',
                insertText: new vscode.SnippetString('drawColliders(${1:instance as Object}${2: [, color = &hFF0000FF]})'),
                detail: 'drawColliders(instance as Object, color = &hFF0000FF) as Void',
                documentation: new vscode.MarkdownString(
                    `Draws all colliders for a given object instance, should be placed in that entity's onDrawEnd method in order to draw above other images.`
                )
            },
            {
                kind: CompletionItemKind.Method,
                label: 'drawSafeZones',
                insertText: new vscode.SnippetString('drawSafeZones()'),
                detail: 'drawSafeZones() as Void',
                documentation: new vscode.MarkdownString(
                    `Draws safe zones. Needs to be refactored so it's easier to draw on top layer above all other images.`
                )
            },
        ];
    }
}

