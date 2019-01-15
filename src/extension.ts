/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

'use strict';

import * as vscode from 'vscode';

import GameCompletionItemProvider from './GameCompletionItemProvider';

export function activate(context: vscode.ExtensionContext) {

    const selector = { scheme: 'file', pattern: '**/*.{brs}' };

	context.subscriptions.push(vscode.languages.registerCompletionItemProvider(selector, new GameCompletionItemProvider(), '.'));
}