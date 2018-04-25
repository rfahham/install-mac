"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const languageModeIds_1 = require("./languageModeIds");
/**
 * When clause context set when the current file is managed by vscode's built-in typescript extension.
 */
const isManagedFile_contextName = 'typescript.isManagedFile';
class ManagedFileContextManager {
    constructor(normalizePath) {
        this.normalizePath = normalizePath;
        this.isInManagedFileContext = false;
        this.onDidChangeActiveTextEditorSub = vscode.window.onDidChangeActiveTextEditor(this.onDidChangeActiveTextEditor, this);
        this.onDidChangeActiveTextEditor(vscode.window.activeTextEditor);
    }
    dispose() {
        this.onDidChangeActiveTextEditorSub.dispose();
    }
    onDidChangeActiveTextEditor(editor) {
        if (editor) {
            const isManagedFile = languageModeIds_1.isSupportedLanguageMode(editor.document) && this.normalizePath(editor.document.uri) !== null;
            this.updateContext(isManagedFile);
        }
    }
    updateContext(newValue) {
        if (newValue === this.isInManagedFileContext) {
            return;
        }
        vscode.commands.executeCommand('setContext', isManagedFile_contextName, newValue);
        this.isInManagedFileContext = newValue;
    }
}
exports.default = ManagedFileContextManager;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/950b8b0d37a9b7061b6f0d291837ccc4015f5ecd/extensions/typescript-language-features/out/utils/managedFileContext.js.map
