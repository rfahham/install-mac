"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const tableOfContentsProvider_1 = require("../tableOfContentsProvider");
class MDDocumentSymbolProvider {
    constructor(engine) {
        this.engine = engine;
    }
    async provideDocumentSymbols(document) {
        const toc = await new tableOfContentsProvider_1.TableOfContentsProvider(this.engine, document).getToc();
        return toc.map(entry => {
            return new vscode.SymbolInformation('#'.repeat(entry.level) + ' ' + entry.text, vscode.SymbolKind.Namespace, '', entry.location);
        });
    }
}
exports.default = MDDocumentSymbolProvider;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/950b8b0d37a9b7061b6f0d291837ccc4015f5ecd/extensions/markdown-language-features/out/features/documentSymbolProvider.js.map
