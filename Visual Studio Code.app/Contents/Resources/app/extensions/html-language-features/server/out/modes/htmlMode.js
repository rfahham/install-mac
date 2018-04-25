/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var languageModelCache_1 = require("../languageModelCache");
var htmlFolding_1 = require("./htmlFolding");
var pathCompletion_1 = require("./pathCompletion");
function getHTMLMode(htmlLanguageService, workspace) {
    var htmlDocuments = languageModelCache_1.getLanguageModelCache(10, 60, function (document) { return htmlLanguageService.parseHTMLDocument(document); });
    return {
        getId: function () {
            return 'html';
        },
        doComplete: function (document, position, settings, completionParticipants) {
            if (settings === void 0) { settings = workspace.settings; }
            var options = settings && settings.html && settings.html.suggest;
            var doAutoComplete = settings && settings.html && settings.html.autoClosingTags;
            if (doAutoComplete) {
                options.hideAutoCompleteProposals = true;
            }
            var pathCompletionProposals = [];
            var participants = [pathCompletion_1.getPathCompletionParticipant(document, workspace.folders, pathCompletionProposals)];
            if (completionParticipants) {
                participants.push.apply(participants, completionParticipants);
            }
            htmlLanguageService.setCompletionParticipants(participants);
            var htmlDocument = htmlDocuments.get(document);
            var completionList = htmlLanguageService.doComplete(document, position, htmlDocument, options);
            (_a = completionList.items).push.apply(_a, pathCompletionProposals);
            return completionList;
            var _a;
        },
        doHover: function (document, position) {
            return htmlLanguageService.doHover(document, position, htmlDocuments.get(document));
        },
        findDocumentHighlight: function (document, position) {
            return htmlLanguageService.findDocumentHighlights(document, position, htmlDocuments.get(document));
        },
        findDocumentLinks: function (document, documentContext) {
            return htmlLanguageService.findDocumentLinks(document, documentContext);
        },
        findDocumentSymbols: function (document) {
            return htmlLanguageService.findDocumentSymbols(document, htmlDocuments.get(document));
        },
        format: function (document, range, formatParams, settings) {
            if (settings === void 0) { settings = workspace.settings; }
            var formatSettings = settings && settings.html && settings.html.format;
            if (formatSettings) {
                formatSettings = merge(formatSettings, {});
            }
            else {
                formatSettings = {};
            }
            if (formatSettings.contentUnformatted) {
                formatSettings.contentUnformatted = formatSettings.contentUnformatted + ',script';
            }
            else {
                formatSettings.contentUnformatted = 'script';
            }
            formatSettings = merge(formatParams, formatSettings);
            return htmlLanguageService.format(document, range, formatSettings);
        },
        getFoldingRanges: function (document, range) {
            return htmlFolding_1.getHTMLFoldingRegions(htmlLanguageService, document, range);
        },
        doAutoClose: function (document, position) {
            var offset = document.offsetAt(position);
            var text = document.getText();
            if (offset > 0 && text.charAt(offset - 1).match(/[>\/]/g)) {
                return htmlLanguageService.doTagComplete(document, position, htmlDocuments.get(document));
            }
            return null;
        },
        onDocumentRemoved: function (document) {
            htmlDocuments.onDocumentRemoved(document);
        },
        dispose: function () {
            htmlDocuments.dispose();
        }
    };
}
exports.getHTMLMode = getHTMLMode;
function merge(src, dst) {
    for (var key in src) {
        if (src.hasOwnProperty(key)) {
            dst[key] = src[key];
        }
    }
    return dst;
}
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/950b8b0d37a9b7061b6f0d291837ccc4015f5ecd/extensions/html-language-features/server/out/modes/htmlMode.js.map
