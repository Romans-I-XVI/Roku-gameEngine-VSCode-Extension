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

    private convertDefinitionsArrayToCommaSeparatedStrings(definitions: string[]): string {
        let s = '';
        for (let index = 0; index < definitions.length; index++) {
            s += '"' + definitions[index] + '"';
            if (index < definitions.length - 1) {
                s += ',';
            }
        }
        return s;
    }

    private getGameCompletionItems(): CompletionItem[] {
        let completionItems = this.getStaticCompletionItems();
        completionItems.push(this.getDynamicCompletionItem_createInstance());
        completionItems.push(this.getDynamicCompletionItem_changeRoom());
        completionItems.push(this.getDynamicCompletionItem_getFont());
        completionItems.push(this.getDynamicCompletionItem_playSound());
        completionItems.push(this.getDynamicCompletionItem_getBitmap());
        return completionItems;
    }

    private getDynamicCompletionItem_createInstance(): CompletionItem {
        let snippet = 'createInstance';
        let definitions = MainDefinitionWatcher.Definitions['defineObject'];

        if (definitions.length > 0) {
            snippet += '(${1|';
            snippet += this.convertDefinitionsArrayToCommaSeparatedStrings(definitions);
            snippet += '|}${2: [, args as Object]})';
        } else {
            snippet += '(${1:object_name as String}${2: [, args as Object]})';
        }

        return {
            kind: CompletionItemKind.Method,
            label: 'createInstance',
            insertText: new vscode.SnippetString(snippet),
            detail: 'createInstance(object_name as String, args = {} as Object) as Dynamic',
            documentation: new vscode.MarkdownString(
                `Spawns a new instance of a previously defined game object. Returns the new instance if it was created successfully, otherwise returns invalid.`
            )
        };
    }

    private getDynamicCompletionItem_changeRoom(): CompletionItem {
        let snippet = 'changeRoom';
        let definitions = MainDefinitionWatcher.Definitions['defineRoom'];

        if (definitions.length > 0) {
            snippet += '(${1|';
            snippet += this.convertDefinitionsArrayToCommaSeparatedStrings(definitions);
            snippet += '|}${2: [, args as Object]})';
        } else {
            snippet += '(${1:room_name as String}${2: [, args as Object]})';
        }

        return {
            kind: CompletionItemKind.Method,
            label: 'changeRoom',
            insertText: new vscode.SnippetString(snippet),
            detail: 'changeRoom(room_name as String, args = {} as Object) as Boolean',
            documentation: new vscode.MarkdownString(
                `Immediately changes to the given room. When called onChangeRoom will be called on all existing object instances, those instances will then be destroyed but onDestroy will NOT be called on them. Returns false if a room of a given name has not been defined.`
            )
        };
    }

    private getDynamicCompletionItem_getFont(): CompletionItem {
        let snippet = 'getFont';
        let definitions = MainDefinitionWatcher.Definitions['loadFont'];

        if (definitions.length > 0) {
            snippet += '(${1|';
            snippet += this.convertDefinitionsArrayToCommaSeparatedStrings(definitions);
            snippet += '|})';
        } else {
            snippet += '(${1:font_name as String})';
        }

        return {
            kind: CompletionItemKind.Method,
            label: 'getFont',
            insertText: new vscode.SnippetString(snippet),
            detail: 'getFont(font_name as String) as Object',
            documentation: new vscode.MarkdownString(
                `Returns a font previously loaded with loadFont.`
            )
        };
    }

    private getDynamicCompletionItem_playSound(): CompletionItem {
        let snippet = 'playSound';
        let definitions = MainDefinitionWatcher.Definitions['loadSound'];

        if (definitions.length > 0) {
            snippet += '(${1|';
            snippet += this.convertDefinitionsArrayToCommaSeparatedStrings(definitions);
            snippet += '|}${2: [, volume = 100]})';
        } else {
            snippet += '(${1:sound_name as String}${2: [, volume = 100]})';
        }

        return {
            kind: CompletionItemKind.Method,
            label: 'playSound',
            insertText: new vscode.SnippetString(snippet),
            detail: 'playSound(sound_name as String, volume = 100) as Boolean',
            documentation: new vscode.MarkdownString(
                `Play a sound that was previously loaded with loadSound.`
            )
        };
    }

    private getDynamicCompletionItem_getBitmap(): CompletionItem {
        let snippet = 'getBitmap';
        let definitions = MainDefinitionWatcher.Definitions['loadBitmap'];

        if (definitions.length > 0) {
            snippet += '(${1|';
            snippet += this.convertDefinitionsArrayToCommaSeparatedStrings(definitions);
            snippet += '|})';
        } else {
            snippet += '(${1:bitmap_name as String})';
        }

        return {
            kind: CompletionItemKind.Method,
            label: 'getBitmap',
            insertText: new vscode.SnippetString(snippet),
            detail: 'getBitmap(bitmap_name as String) as Dynamic',
            documentation: new vscode.MarkdownString(
                `Returns a bitmap previously loaded via loadBitmap. Returns invalid if no bitmap of the given name was previously loaded.`
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

