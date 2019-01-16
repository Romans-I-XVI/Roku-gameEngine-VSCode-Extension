/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

'use strict';

import * as vscode from 'vscode';

import GameCompletionItemProvider from './GameCompletionItemProvider';
import ObjectCompletionItemProvider from './ObjectCompletionItemProvider';
import MainDefinitionWatcher from './MainDefinitionWatcher';

export function activate(context: vscode.ExtensionContext) {

    const mainDefinitionWatcher = new MainDefinitionWatcher();

    const selector = { scheme: 'file', pattern: '**/*.{brs}' };

	context.subscriptions.push(vscode.languages.registerCompletionItemProvider(selector, new GameCompletionItemProvider(), '.'));
	context.subscriptions.push(vscode.languages.registerCompletionItemProvider(selector, new ObjectCompletionItemProvider(), '.'));
}