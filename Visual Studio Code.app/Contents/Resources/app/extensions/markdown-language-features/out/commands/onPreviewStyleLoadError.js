"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
const nls = require("vscode-nls");
const localize = nls.loadMessageBundle(__filename);
const vscode = require("vscode");
class OnPreviewStyleLoadErrorCommand {
    constructor() {
        this.id = '_markdown.onPreviewStyleLoadError';
    }
    execute(resources) {
        vscode.window.showWarningMessage(localize(0, null, resources.join(', ')));
    }
}
exports.OnPreviewStyleLoadErrorCommand = OnPreviewStyleLoadErrorCommand;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/950b8b0d37a9b7061b6f0d291837ccc4015f5ecd/extensions/markdown-language-features/out/commands/onPreviewStyleLoadError.js.map
