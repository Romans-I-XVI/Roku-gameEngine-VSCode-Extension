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

    private getGameCompletionItems(): CompletionItem[] {
        let completionItems = this.getStaticCompletionItems();
        let defineObjectString = MainDefinitionWatcher.GetDefinitionsAsCommaSeparatedStrings('defineObject');
        let defineRoomString = MainDefinitionWatcher.GetDefinitionsAsCommaSeparatedStrings('defineRoom');
        let loadFontString = MainDefinitionWatcher.GetDefinitionsAsCommaSeparatedStrings('loadFont');
        let loadSoundString = MainDefinitionWatcher.GetDefinitionsAsCommaSeparatedStrings('loadSound');
        let loadBitmapString = MainDefinitionWatcher.GetDefinitionsAsCommaSeparatedStrings('loadBitmap');

        completionItems.push(this.getDynamicCompletionItem_createInstance(defineObjectString));
        completionItems.push(this.getDynamicCompletionItem_getInstanceByName(defineObjectString));
        completionItems.push(this.getDynamicCompletionItem_getAllInstances(defineObjectString));
        completionItems.push(this.getDynamicCompletionItem_destroyAllInstances(defineObjectString));
        completionItems.push(this.getDynamicCompletionItem_instanceCount(defineObjectString));
        completionItems.push(this.getDynamicCompletionItem_changeRoom(defineRoomString));
        completionItems.push(this.getDynamicCompletionItem_getFont(loadFontString));
        completionItems.push(this.getDynamicCompletionItem_playSound(loadSoundString));
        completionItems.push(this.getDynamicCompletionItem_getBitmap(loadBitmapString));
        return completionItems;
    }

    private getDynamicCompletionItem_createInstance(definitions: string): CompletionItem {
        let snippet = 'createInstance';

        if (definitions.length > 0) {
            snippet += '(${1|';
            snippet += definitions;
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

    private getDynamicCompletionItem_getInstanceByName(definitions: string): CompletionItem {
        let snippet = 'getInstanceByName';

        if (definitions.length > 0) {
            snippet += '(${1|';
            snippet += definitions;
            snippet += '|})';
        } else {
            snippet += 'getInstanceByName(${1:object_name as String})';
        }

        return {
            kind: CompletionItemKind.Method,
            label: 'getInstanceByName',
            insertText: new vscode.SnippetString(snippet),
            detail: 'getInstanceByName(object_name as String) as Dynamic',
            documentation: new vscode.MarkdownString(
                `Returns the first instance of the given object name if one exists, otherwise returns invalid.`
            )
        };
    }

    private getDynamicCompletionItem_getAllInstances(definitions: string): CompletionItem {
        let snippet = 'getAllInstances';

        if (definitions.length > 0) {
            snippet += '(${1|';
            snippet += definitions;
            snippet += '|})';
        } else {
            snippet += 'getAllInstances(${1:object_name as String})';
        }

        return {
            kind: CompletionItemKind.Method,
            label: 'getAllInstances',
            insertText: new vscode.SnippetString(snippet),
            detail: 'getAllInstances(object_name as String) as Dynamic',
            documentation: new vscode.MarkdownString(
                `Returns an roArray of all instances with a given object name, returns invalid if no objects have been defined with that name.`
            )
        };
    }

    private getDynamicCompletionItem_destroyAllInstances(definitions: string): CompletionItem {
        let snippet = 'destroyAllInstances';

        if (definitions.length > 0) {
            snippet += '(${1|';
            snippet += definitions;
            snippet += '|})';
        } else {
            snippet += 'destroyAllInstances(${1:object_name as String})';
        }

        return {
            kind: CompletionItemKind.Method,
            label: 'destroyAllInstances',
            insertText: new vscode.SnippetString(snippet),
            detail: 'destroyAllInstances(object_name as String) as Void',
            documentation: new vscode.MarkdownString(
                `Destroys all instances of the given object name.`
            )
        };
    }

    private getDynamicCompletionItem_instanceCount(definitions: string): CompletionItem {
        let snippet = 'instanceCount';

        if (definitions.length > 0) {
            snippet += '(${1|';
            snippet += definitions;
            snippet += '|})';
        } else {
            snippet += 'instanceCount(${1:object_name as String})';
        }

        return {
            kind: CompletionItemKind.Method,
            label: 'instanceCount',
            insertText: new vscode.SnippetString(snippet),
            detail: 'instanceCount(object_name as String) as Integer',
            documentation: new vscode.MarkdownString(
                `Returns the number of instances of the given object name.`
            )
        };
    }

    private getDynamicCompletionItem_changeRoom(definitions: string): CompletionItem {
        let snippet = 'changeRoom';

        if (definitions.length > 0) {
            snippet += '(${1|';
            snippet += definitions;
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

    private getDynamicCompletionItem_getFont(definitions: string): CompletionItem {
        let snippet = 'getFont';

        if (definitions.length > 0) {
            snippet += '(${1|';
            snippet += definitions;
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

    private getDynamicCompletionItem_playSound(definitions: string): CompletionItem {
        let snippet = 'playSound';

        if (definitions.length > 0) {
            snippet += '(${1|';
            snippet += definitions;
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

    private getDynamicCompletionItem_getBitmap(definitions: string): CompletionItem {
        let snippet = 'getBitmap';

        if (definitions.length > 0) {
            snippet += '(${1|';
            snippet += definitions;
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
            {
                kind: CompletionItemKind.Method,
                label: 'Pause',
                insertText: new vscode.SnippetString('Pause()'),
                detail: 'Pause() as Void',
                documentation: new vscode.MarkdownString(
                    `Pauses the game, when game is paused and if an entity is pauseable=true (default) only onDrawBegin and onDrawEnd methods are called, as well as internal image drawing.`
                )
            },
            {
                kind: CompletionItemKind.Method,
                label: 'Resume',
                insertText: new vscode.SnippetString('Resume()'),
                detail: 'Resume() as Dynamic',
                documentation: new vscode.MarkdownString(
                    `Resumes the game if paused.`
                )
            },
            {
                kind: CompletionItemKind.Method,
                label: 'isPaused',
                insertText: new vscode.SnippetString('isPaused()'),
                detail: 'isPaused() as Boolean',
                documentation: new vscode.MarkdownString(
                    `Returns true if the game is paused.`
                )
            },
            {
                kind: CompletionItemKind.Method,
                label: 'setBackgroundColor',
                insertText: new vscode.SnippetString('setBackgroundColor(${1:color as Integer})'),
                detail: 'setBackgroundColor(color as Integer) as Void',
                documentation: new vscode.MarkdownString(
                    `Sets the color to be used in the Clear() method on the canvas/screen.`
                )
            },
            {
                kind: CompletionItemKind.Method,
                label: 'getDeltaTime',
                insertText: new vscode.SnippetString('getDeltaTime()'),
                detail: 'getDeltaTime() as Float',
                documentation: new vscode.MarkdownString(
                    `Returns the delta time that was calculated at the beginning of the current game loop.`
                )
            },
            {
                kind: CompletionItemKind.Method,
                label: 'getRoom',
                insertText: new vscode.SnippetString('getRoom()'),
                detail: 'getRoom() as Object',
                documentation: new vscode.MarkdownString(
                    `Returns the current room object instance.`
                )
            },
            {
                kind: CompletionItemKind.Method,
                label: 'getCanvas',
                insertText: new vscode.SnippetString('getCanvas()'),
                detail: 'getCanvas() as Object',
                documentation: new vscode.MarkdownString(
                    `Returns the current game canvas. This will be an roBitmap unless canvas_as_screen_if_possible is set, in which case it could potentially return the roScreen object.`
                )
            },
            {
                kind: CompletionItemKind.Method,
                label: 'getScreen',
                insertText: new vscode.SnippetString('getScreen()'),
                detail: 'getScreen() as Object',
                documentation: new vscode.MarkdownString(
                    `Returns the current roScreen object.`
                )
            },
            {
                kind: CompletionItemKind.Method,
                label: 'resetScreen',
                insertText: new vscode.SnippetString('resetScreen()'),
                detail: 'resetScreen() as Void',
                documentation: new vscode.MarkdownString(
                    `This is available because any time other screen components are used it can potentially cause glitching of the current roScreen object. As of January 2019 all other screen components have been removed however there still appears to be issues with roScreen when using the Roku_Ads library. As it stands resetScreen should still be called any time an ad is shown.`
                )
            },
            {
                kind: CompletionItemKind.Method,
                label: 'defineObject',
                insertText: new vscode.SnippetString('defineObject(${1:object_name as String}, ${2:object_creation_function as Function})'),
                detail: 'defineObject(object_name as String, object_creation_function as Function) as Void',
                documentation: new vscode.MarkdownString(
                    `Define a new game object. The object_creation_function should be a function that accepts and modifies the incoming object instance whenever a new instance is spawned.`
                )
            },
            {
                kind: CompletionItemKind.Method,
                label: 'getInstanceByID',
                insertText: new vscode.SnippetString('getInstanceByID(${1:instance_id as String})'),
                detail: 'getInstanceByID(instance_id as String) as Dynamic',
                documentation: new vscode.MarkdownString(
                    `Returns the instance with the given ID if it exists, otherwise returns invalid.`
                )
            },
            {
                kind: CompletionItemKind.Method,
                label: 'destroyInstance',
                insertText: new vscode.SnippetString('destroyInstance(${1:instance as Object}${2: [, call_onDestroy = true]})'),
                detail: 'destroyInstance(instance as Object, call_onDestroy = true as Boolean) as Void',
                documentation: new vscode.MarkdownString(
                    `Immediately destroys the given object instance, note that this instantly clears all data in that instance so any subsequent references are potentially breaking. If call_onDestroy is true the object's onDestroy method will be called before destruction occurs.`
                )
            },
            {
                kind: CompletionItemKind.Method,
                label: 'defineRoom',
                insertText: new vscode.SnippetString('defineRoom(${1:room_name as String}, ${2:room_creation_function as Function})'),
                detail: 'defineRoom(room_name as String, room_creation_function as Function) as Void',
                documentation: new vscode.MarkdownString(
                    `Define a new game room. Rooms have the same methods available to them as objects and should be defined in the same way.`
                )
            },
            {
                kind: CompletionItemKind.Method,
                label: 'resetRoom',
                insertText: new vscode.SnippetString('resetRoom()'),
                detail: 'resetRoom() as Void',
                documentation: new vscode.MarkdownString(
                    `Resets the current room. The args roAssociativeArray that was passed in originally will be passed in again so arguments stay the same as when this room was originally switched to.`
                )
            },
            {
                kind: CompletionItemKind.Method,
                label: 'loadBitmap',
                insertText: new vscode.SnippetString('loadBitmap(${1:bitmap_name as String}, ${2:path as Dynamic})'),
                detail: 'loadBitmap(bitmap_name as String, path as Dynamic) as Boolean',
                documentation: new vscode.MarkdownString(
                    `Loads the bitmap in to memory and makes it accessible via getBitmap. Path can optionally be an roAssociativeArray of {width: width as Integer, height: height as Integer, AlphaEnabled: enabled as Boolean} to create a new empty bitmap of the given width/height. Returns true if successful.`
                )
            },
            {
                kind: CompletionItemKind.Method,
                label: 'unloadBitmap',
                insertText: new vscode.SnippetString('unloadBitmap(${1:bitmap_name as String})'),
                detail: 'unloadBitmap(bitmap_name as String) as Boolean',
                documentation: new vscode.MarkdownString(
                    `Removes a previoulsy loaded bitmap. Note that freeing of allocated memory might not occur immediately. Returns false if no such bitmap was previously loaded.`
                )
            },
            {
                kind: CompletionItemKind.Method,
                label: 'registerFont',
                insertText: new vscode.SnippetString('registerFont(${1:path as String})'),
                detail: 'registerFont(path as String) as Boolean',
                documentation: new vscode.MarkdownString(
                    `Registers a new font from the given path. Note that all fonts placed within the pkg:/fonts/ folder will automatically be registered at runtime.`
                )
            },
            {
                kind: CompletionItemKind.Method,
                label: 'loadFont',
                insertText: new vscode.SnippetString('loadFont(${1:font_name as String}, ${2:font as String}, ${3:size as Integer}, ${4:italic as Boolean}, ${5:bold as Boolean})'),
                detail: 'loadFont(font_name as String, font as String, size as Integer, italic as Boolean, bold as Boolean) as Void',
                documentation: new vscode.MarkdownString(
                    `Loads a previously registered \"font\" with the given size, italic, and bold options. This makes the loaded font accessible via getFont by \"font_name\".`
                )
            },
            {
                kind: CompletionItemKind.Method,
                label: 'unloadFont',
                insertText: new vscode.SnippetString('unloadFont(${1:font_name as String})'),
                detail: 'unloadFont(font_name as String) as Void',
                documentation: new vscode.MarkdownString(
                    `Unloades a font previously loaded with loadFont.`
                )
            },
            {
                kind: CompletionItemKind.Method,
                label: 'musicPlay',
                insertText: new vscode.SnippetString('musicPlay(${1:path as String}${2: [, loop = false]})'),
                detail: 'musicPlay(path as String, loop = false as Boolean) as Boolean',
                documentation: new vscode.MarkdownString(
                    `Plays a song from the given path. Returns false if file doesn't exist.`
                )
            },
            {
                kind: CompletionItemKind.Method,
                label: 'musicStop',
                insertText: new vscode.SnippetString('musicStop()'),
                detail: 'musicStop() as Void',
                documentation: new vscode.MarkdownString(
                    `Stops the currently playing music.`
                )
            },
            {
                kind: CompletionItemKind.Method,
                label: 'musicPause',
                insertText: new vscode.SnippetString('musicPause()'),
                detail: 'musicPause() as Void',
                documentation: new vscode.MarkdownString(
                    `Pauses the currently playing music.`
                )
            },
            {
                kind: CompletionItemKind.Method,
                label: 'musicResume',
                insertText: new vscode.SnippetString('musicResume()'),
                detail: 'musicResume() as Void',
                documentation: new vscode.MarkdownString(
                    `Resumes the currently paused music.`
                )
            },
            {
                kind: CompletionItemKind.Method,
                label: 'loadSound',
                insertText: new vscode.SnippetString('loadSound(${1:sound_name as String}, ${2:path as String})'),
                detail: 'loadSound(sound_name as String, path as String) as Void',
                documentation: new vscode.MarkdownString(
                    `Loads a sound file as a roAudioResource`
                )
            },
            {
                kind: CompletionItemKind.Method,
                label: 'newAsyncUrlTransfer',
                insertText: new vscode.SnippetString('newAsyncUrlTransfer()'),
                detail: 'newAsyncUrlTransfer() as Object',
                documentation: new vscode.MarkdownString(
                    `Returns a new roUrlTransfer object to be used for async operations. When a roUrlEvent occurs on this roUrlTransfer object the event will be passed in to the onUrlEvent of all active instances, the roUrlTransfer object will then be removed.`
                )
            },
            {
                kind: CompletionItemKind.Method,
                label: 'setInputInstance',
                insertText: new vscode.SnippetString('setInputInstance(${1:instance as Object})'),
                detail: 'setInputInstance(instance as Object) as Void',
                documentation: new vscode.MarkdownString(
                    `Sets an object instance as the current input handler. When input instance is set no other instances will receive onButton calls.`
                )
            },
            {
                kind: CompletionItemKind.Method,
                label: 'unsetInputInstance',
                insertText: new vscode.SnippetString('unsetInputInstance()'),
                detail: 'unsetInputInstance() as Void',
                documentation: new vscode.MarkdownString(
                    `Unsets the current input instance if one was previously set. This makes it so onButton calls will resume normal behavior.`
                )
            },
            {
                kind: CompletionItemKind.Method,
                label: 'postGameEvent',
                insertText: new vscode.SnippetString('postGameEvent(${1:event as String}${2: [, data as Object]})'),
                detail: 'postGameEvent(event as String, data = {} as Object) as Void',
                documentation: new vscode.MarkdownString(
                    `Immediately calls onGameEvent on all active instances with the given event string and optional data object.`
                )
            }
        ];
    }
}

