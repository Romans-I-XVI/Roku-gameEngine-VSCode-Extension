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
            let variableCompletionItems = this.getStandardObjectVariableCompletionItems();
            variableCompletionItems.forEach(element => {
                completionItems.push(element);
            });
            let methodCompletionItems = this.getStandardObjectMethodCompletionItems();
            methodCompletionItems.forEach(element => {
                completionItems.push(element);
            });
        }

        return completionItems;
    }

    private getStandardObjectVariableCompletionItems(): CompletionItem[] {
        return [
            {
                kind: CompletionItemKind.Constant,
                label: 'name'
            },
            {
                kind: CompletionItemKind.Constant,
                label: 'id'
            },
            {
                kind: CompletionItemKind.Constant,
                label: 'game'
            },
            {
                kind: CompletionItemKind.Variable,
                label: 'enabled'
            },
            {
                kind: CompletionItemKind.Variable,
                label: 'persistent'
            },
            {
                kind: CompletionItemKind.Variable,
                label: 'pauseable'
            },
            {
                kind: CompletionItemKind.Variable,
                label: 'depth'
            },
            {
                kind: CompletionItemKind.Variable,
                label: 'x'
            },
            {
                kind: CompletionItemKind.Variable,
                label: 'y'
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
                insertText: new vscode.SnippetString('addImage(${1:image as Object}${2: [, image_args as Object]})'),
                detail: 'addImage(image as Object, images_args as Object) as Boolean',
                documentation: new vscode.MarkdownString(
                    `Adds an image to the entity. Image must be of type roBitmap or roRegion. Image args are optional and should be an roAssociativeArray of valid properties. Returns true if successful.`
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