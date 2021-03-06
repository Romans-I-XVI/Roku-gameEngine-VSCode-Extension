/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

'use strict';

import * as vscode from 'vscode';

import GameCompletionItemProvider from './GameCompletionItemProvider';
import ObjectCompletionItemProvider from './ObjectCompletionItemProvider';
import MObjectCompletionItemProvider from './MObjectCompletionItemProvider';
import MainDefinitionWatcher from './MainDefinitionWatcher';

export function activate(context: vscode.ExtensionContext) {

    MainDefinitionWatcher.Initialize();

    const selector = { scheme: 'file', pattern: '**/*.{brs}' };

	context.subscriptions.push(vscode.languages.registerCompletionItemProvider(selector, new GameCompletionItemProvider(), '.'));
	context.subscriptions.push(vscode.languages.registerCompletionItemProvider(selector, new ObjectCompletionItemProvider(), '.'));
	context.subscriptions.push(vscode.languages.registerCompletionItemProvider(selector, new MObjectCompletionItemProvider(), '.'));
}

export function deactivate() {
	MainDefinitionWatcher.Dispose();
}
