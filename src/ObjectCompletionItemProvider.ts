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
        },
        onPreCollision: {
            kind: CompletionItemKind.Snippet,
            label: 'onPreCollision',
            insertText: new vscode.SnippetString(
                'onPreCollision = function()\n' +
                '\t$0\n' +
                'end function'
            ),
            detail: 'onPreCollision()',
            documentation: new vscode.MarkdownString(
                `Called just before collision checking occurs. Can be used to make adjustments before handling collisions.`
            )
        },
        onCollision: {
            kind: CompletionItemKind.Snippet,
            label: 'onCollision',
            insertText: new vscode.SnippetString(
                'onCollision = function(collider_name as String, other_collider_name as String, other_instance as Object)\n' +
                '\t$0\n' +
                'end function'
            ),
            detail: 'onCollision(collider_name as String, other_collider_name as String, other_instance as Object)',
            documentation: new vscode.MarkdownString(
                `Called whenever an entity collision occurs, may be called multiple times per update loop based on collisions with multiple entities and colliders.`
            )
        },
        onPostCollision: {
            kind: CompletionItemKind.Snippet,
            label: 'onPostCollision',
            insertText: new vscode.SnippetString(
                'onPostCollision = function()\n' +
                '\t$0\n' +
                'end function'
            ),
            detail: 'onPostCollision()',
            documentation: new vscode.MarkdownString(
                `Called just after collision checking occurs. Can be used to make adjustments after handling collisions.`
            )
        },
        onDrawBegin: {
            kind: CompletionItemKind.Snippet,
            label: 'onDrawBegin',
            insertText: new vscode.SnippetString(
                'onDrawBegin = function(canvas as Object)\n' +
                '\t$0\n' +
                'end function'
            ),
            detail: 'onDrawBegin(canvas as Object)',
            documentation: new vscode.MarkdownString(
                `Called before drawing images that were added with addImage. This can be used to do drawing underneath those images.`
            )
        },
        onDrawEnd: {
            kind: CompletionItemKind.Snippet,
            label: 'onDrawEnd',
            insertText: new vscode.SnippetString(
                'onDrawEnd = function(canvas as Object)\n' +
                '\t$0\n' +
                'end function'
            ),
            detail: 'onDrawEnd(canvas as Object)',
            documentation: new vscode.MarkdownString(
                `Called after drawing images that were added with addImage. This can be used to do drawing above those images.`
            )
        },
        onButton: {
            kind: CompletionItemKind.Snippet,
            label: 'onButton',
            insertText: new vscode.SnippetString(
                'onButton = function(code as Integer)\n' +
                '\t$0\n' +
                '\n' +
                '\t\' -------Button Code Reference--------\n' +
                '\t\' Pressed | Released | Held\n' +
                '\n' +
                '\t\' Back  0  100 1000\n' +
                '\t\' Up  2  102 1002\n' +
                '\t\' Down  3  103 1003\n' +
                '\t\' Left  4  104 1004\n' +
                '\t\' Right  5  105 1005\n' +
                '\t\' Select  6  106 1006\n' +
                '\t\' Instant Replay  7  107 1007\n' +
                '\t\' Rewind  8  108 1008\n' +
                '\t\' Fast  Forward  9  109 1009\n' +
                '\t\' Info  10  110 1010\n' +
                '\t\' Play  13  113 1013\n' +
                'end function'
            ),
            detail: 'onButton(code as Integer)',
            documentation: new vscode.MarkdownString(
                `Called when a button is pressed, held or released. Note that on the Roku only one button can ever be pressed at a time.`
            )
        },
        onECPKeyboard: {
            kind: CompletionItemKind.Snippet,
            label: 'onECPKeyboard',
            insertText: new vscode.SnippetString(
                'onECPKeyboard = function(char as String)\n' +
                '\t$0\n' +
                'end function'
            ),
            detail: 'onECPKeyboard(char as String)',
            documentation: new vscode.MarkdownString(
                `Called when ECP Keyboard key input has occured.`
            )
        },
        onAudioEvent: {
            kind: CompletionItemKind.Snippet,
            label: 'onAudioEvent',
            insertText: new vscode.SnippetString(
                'onAudioEvent = function(msg as Object)\n' +
                '\t$0\n' +
                'end function'
            ),
            detail: 'onAudioEvent(msg as Object)',
            documentation: new vscode.MarkdownString(
                `Called when an audio player event occured. msg will be of type roAudioPlayerEvent.`
            )
        },
        onUrlEvent: {
            kind: CompletionItemKind.Snippet,
            label: 'onUrlEvent',
            insertText: new vscode.SnippetString(
                'onUrlEvent = function(msg as Object)\n' +
                '\t$0\n' +
                'end function'
            ),
            detail: 'onUrlEvent(msg as Object)',
            documentation: new vscode.MarkdownString(
                `Called when a url event occured. msg will be of type roUrlEvent.`
            )
        },
        onGameEvent: {
            kind: CompletionItemKind.Snippet,
            label: 'onGameEvent',
            insertText: new vscode.SnippetString(
                'onGameEvent = function(event as String, data as Object)\n' +
                '\t$0\n' +
                'end function'
            ),
            detail: 'onGameEvent(event as String, data as Object)',
            documentation: new vscode.MarkdownString(
                `Called immediately on all entities when postGameEvent was triggered.`
            )
        },
        onResume: {
            kind: CompletionItemKind.Snippet,
            label: 'onResume',
            insertText: new vscode.SnippetString(
                'onResume = function(paused_time as Integer)\n' +
                '\t$0\n' +
                'end function'
            ),
            detail: 'onResume(paused_time as Integer)',
            documentation: new vscode.MarkdownString(
                `Called when a previously paused game gets resumed. paused_time is how long the game was paused in milliseconds.`
            )
        },
        onChangeRoom: {
            kind: CompletionItemKind.Snippet,
            label: 'onChangeRoom',
            insertText: new vscode.SnippetString(
                'onChangeRoom = function(new_room_name as String)\n' +
                '\t$0\n' +
                'end function'
            ),
            detail: 'onChangeRoom(new_room_name as String)',
            documentation: new vscode.MarkdownString(
                `Called immediately on all entities when changeRoom was triggered.`
            )
        },
        onDestroy: {
            kind: CompletionItemKind.Snippet,
            label: 'onDestroy',
            insertText: new vscode.SnippetString(
                'onDestroy = function()\n' +
                '\t$0\n' +
                'end function'
            ),
            detail: 'onDestroy()',
            documentation: new vscode.MarkdownString(
                `Called just before an entity gets destroyed and removed from the game loop.`
            )
        }
    };
}
