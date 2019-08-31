import {
    CancellationToken,
    CompletionItem,
    CompletionItemKind,
    CompletionItemProvider,
    Position, TextDocument
} from 'vscode';

import * as vscode from 'vscode';
import MainDefinitionWatcher from './MainDefinitionWatcher';

export default class MObjectCompletionItemProvider implements CompletionItemProvider {

    public provideCompletionItems(document: TextDocument, position: Position, token: CancellationToken, context: vscode.CompletionContext): CompletionItem[] {
        let linePrefix = document.lineAt(position).text.substr(0, position.character);
        let completionItems: CompletionItem[] = [];

        let endsWithM = linePrefix.endsWith('m.');
        if (!endsWithM) {
            return [];
        }
        let precededByChars = (linePrefix.match(new RegExp('([a-z|0-9|_])m\\.', 'i')) !== null);
        let partOfGameObject = false;
        let onCreateLineMatch = document.getText().match(new RegExp('([a-z|0-9|_]*)\\.onCreate(\\s*)=(\\s*)function', 'i'));
        let definitionPassInString = "";
        if (onCreateLineMatch !== null) {
            partOfGameObject = true;
            definitionPassInString = onCreateLineMatch[1];
        }

        if (endsWithM && !precededByChars && partOfGameObject) {
            let defineInterfaceString = MainDefinitionWatcher.GetDefinitionsAsCommaSeparatedStrings('defineInterface');
            completionItems.push(this.getDynamicCompletionItem_addInterface(defineInterfaceString));
            completionItems.push(this.getDynamicCompletionItem_hasInterface(defineInterfaceString));

            let variableCompletionItems = this.getStandardObjectVariableCompletionItems();
            variableCompletionItems.forEach(element => {
                completionItems.push(element);
            });
            let methodCompletionItems = this.getStandardObjectMethodCompletionItems();
            methodCompletionItems.forEach(element => {
                completionItems.push(element);
            });

            let userDataCompletionItems = this.getUserDataCompletionItems(document, definitionPassInString);
            userDataCompletionItems.forEach(element => {
                let should_add = true;
                completionItems.forEach(other_element => {
                    if (element.label === other_element.label) {
                        should_add = false;
                    }
                });
                if (should_add) {
                    completionItems.push(element);
                }
            });
        }

        return completionItems;
    }

    private getUserDataCompletionItems(document: TextDocument, prefix: string): CompletionItem[] {
        let completion_items: CompletionItem[] = [];
        let definition_matches = document.getText().match(new RegExp(prefix + '\\.(.*)=(.*)', 'ig'));
        if (definition_matches !== null) {
            definition_matches.forEach(element => {
                let submatch = element.match(new RegExp(prefix + '\\.(.*?)=', 'i'));
                if (submatch !== null) {
                    let name = submatch[1].trim();
                    let kind = CompletionItemKind.Variable;
                    if (element.match(new RegExp('(.*)=(.*)function(\\s*)\\(', 'i')) !== null) {
                        kind = CompletionItemKind.Method;
                    }
                    completion_items.push({
                        label: name,
                        kind: kind
                    });
                }
            });
        }

        return completion_items;
    }

    private getDynamicCompletionItem_addInterface(definitions: string): CompletionItem {
        let snippet = 'addInterface';

        if (definitions.length > 0) {
            snippet += '(${1|';
            snippet += definitions;
            snippet += '|})';
        } else {
            snippet += '(${1:interface_name as String})';
        }

        return {
            kind: CompletionItemKind.Method,
            label: 'addInterface',
            insertText: new vscode.SnippetString(snippet),
            detail: 'addInterface(interface_name as String) as Void',
            documentation: new vscode.MarkdownString(
                `Adds a previously defined interface to the object instance.`
            )
        };
    }

    private getDynamicCompletionItem_hasInterface(definitions: string): CompletionItem {
        let snippet = 'hasInterface';

        if (definitions.length > 0) {
            snippet += '(${1|';
            snippet += definitions;
            snippet += '|})';
        } else {
            snippet += '(${1:interface_name as String})';
        }

        return {
            kind: CompletionItemKind.Method,
            label: 'hasInterface',
            insertText: new vscode.SnippetString(snippet),
            detail: 'hasInterface(interface_name as String) as Void',
            documentation: new vscode.MarkdownString(
                `Returns true if the given interface has been added to this object instance.`
            )
        };
    }

    private getStandardObjectVariableCompletionItems(): CompletionItem[] {
        return [
            {
                kind: CompletionItemKind.Constant,
                label: 'name',
                detail: 'String',
                documentation: 'The name of the game object as defined by defineObject'
            },
            {
                kind: CompletionItemKind.Constant,
                label: 'id',
                detail: 'String',
                documentation: 'The ID of this individual game object instance.'
            },
            {
                kind: CompletionItemKind.Constant,
                label: 'game',
                detail: 'Object',
                documentation: 'A reference to the game root.'
            },
            {
                kind: CompletionItemKind.Variable,
                label: 'enabled',
                detail: 'Boolean',
                documentation: 'Determines whether or not this instance will get processed by the game loop. Defaults to true.'
            },
            {
                kind: CompletionItemKind.Variable,
                label: 'persistent',
                detail: 'Boolean',
                documentation: 'Determines whether this instance will persist through room changes. Defaults to false.'
            },
            {
                kind: CompletionItemKind.Variable,
                label: 'pauseable',
                detail: 'Boolean',
                documentation: 'Determines whether this instances gets processed when the game is paused. Defaults to false.'
            },
            {
                kind: CompletionItemKind.Variable,
                label: 'depth',
                detail: 'Integer',
                documentation: 'Sets the order for processing of objects in the game loop. Objects with a higher number get processed first.'
            },
            {
                kind: CompletionItemKind.Variable,
                label: 'x',
                detail: 'Float',
                documentation: 'The x position of the instance.'
            },
            {
                kind: CompletionItemKind.Variable,
                label: 'y',
                detail: 'Float',
                documentation: 'The y position of the instance.'
            },
            {
                kind: CompletionItemKind.Variable,
                label: 'xspeed',
                detail: 'Float',
                documentation: 'The x speed of the instance. Speed is multiplied by delta time before adjusting position.'
            },
            {
                kind: CompletionItemKind.Variable,
                label: 'yspeed',
                detail: 'Float',
                documentation: 'The y speed of the instance. Speed is multiplied by delta time before adjusting position.'
            }
        ];
    }

    private getStandardObjectMethodCompletionItems(): CompletionItem[] {
        return [
            {
                kind: CompletionItemKind.Method,
                label: 'addColliderCircle',
                insertText: new vscode.SnippetString('addColliderCircle(${1:collider_name as String}, ${2:radius as Integer}${3: [, offset_x = 0, offset_y = 0]})'),
                detail: 'addColliderCircle(collider_name as String, radius as Integer, offset_x as Integer, offset_y as Integer) as Void',
                documentation: new vscode.MarkdownString(
                    `Adds a circle collider to the entity.`
                )
            },
            {
                kind: CompletionItemKind.Method,
                label: 'addColliderRectangle',
                insertText: new vscode.SnippetString('addColliderRectangle(${1:collider_name as String}, ${2:offset_x as Integer}, ${3:offset_y as Integer}, ${4:width as Integer}, ${5:height as Integer})'),
                detail: 'addColliderRectangle(collider_name as String, offset_x as Integer, offset_y as Integer) as Void',
                documentation: new vscode.MarkdownString(
                    `Adds a rectangle collider to the entity.`
                )
            },
            {
                kind: CompletionItemKind.Method,
                label: 'getCollider',
                insertText: new vscode.SnippetString('getCollider(${1:collider_name as String})'),
                detail: 'getCollider(collider_name as String) as Object',
                documentation: new vscode.MarkdownString(
                    `Returns a previously added collider.`
                )
            },
            {
                kind: CompletionItemKind.Method,
                label: 'removeCollider',
                insertText: new vscode.SnippetString('removeCollider(${1:collider_name as String})'),
                detail: 'removeCollider(collider_name as String) as Void',
                documentation: new vscode.MarkdownString(
                    `Removes a previously added collider.`
                )
            },
            {
                kind: CompletionItemKind.Method,
                label: 'addImage',
                insertText: new vscode.SnippetString('addImage(${1:name as Object}, ${2:region as Object}${3: [, image_args as Object]})'),
                detail: 'addImage(name as String, region as Object, images_args as Object) as Boolean',
                documentation: new vscode.MarkdownString(
                    `Adds an image to the entity. Region must be of type roRegion. Image args are optional and should be an roAssociativeArray of valid properties. Returns true if successful.`
                )
            },
            {
                kind: CompletionItemKind.Method,
                label: 'addAnimatedImage',
                insertText: new vscode.SnippetString('addAnimatedImage(${1:name as Object}, ${2:regions as Object}${3: [, image_args as Object]})'),
                detail: 'addAnimatedImage(name as String, regions as Object, images_args as Object) as Boolean',
                documentation: new vscode.MarkdownString(
                    `Adds an animated image to the entity. Regions must be an array of roRegion obects. Image args are optional and should be an roAssociativeArray of valid properties. Returns true if successful.`
                )
            },
            {
                kind: CompletionItemKind.Method,
                label: 'getImage',
                insertText: new vscode.SnippetString('getImage(${1:[image_name = \"main\"]})'),
                detail: 'getImage(image_name as String) as Object',
                documentation: new vscode.MarkdownString(
                    `Returns an image object previously created with addImage.`
                )
            },
            {
                kind: CompletionItemKind.Method,
                label: 'removeImage',
                insertText: new vscode.SnippetString('removeImage(${1:[image_name = \"main\"]})'),
                detail: 'removeImage(image_name as String) as Void',
                documentation: new vscode.MarkdownString(
                    `Removes an image object previously created with addImage.`
                )
            },
            {
                kind: CompletionItemKind.Method,
                label: 'getStaticVariable',
                insertText: new vscode.SnippetString('getStaticVariable(${1:static_variable_name as String})'),
                detail: 'getStaticVariable(static_variable_name as String) as Dynamic',
                documentation: new vscode.MarkdownString(
                    `Returns a value previously set with setStaticVariable.`
                )
            },
            {
                kind: CompletionItemKind.Method,
                label: 'setStaticVariable',
                insertText: new vscode.SnippetString('setStaticVariable(${1:static_variable_name as String}, ${2:static_variable_value as Dynamic})'),
                detail: 'setStaticVariable(static_variable_name as String, static_variable_value as Dynamic) as Void',
                documentation: new vscode.MarkdownString(
                    `Sets a \"static\" variable for an object which is accessible with getStaticVariable. This makes it so multiple instances can access and modify a variable that is persistent between all instances of that object type. This is an attempt to emulate static variables such as you would find in Classes in other programming languages.`
                )
            }
        ];
    }
}