/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
!function(){const e=require("path"),o=require("module"),r=e.join(__dirname,"../node_modules"),t=r+".asar",n=o._resolveLookupPaths;o._resolveLookupPaths=function(e,o,s){const a=n(e,o,s),i=s?a:a[1];for(let e=0,o=i.length;e<o;e++)if(i[e]===r){i.splice(e,0,t);break}return a}}(),require("./bootstrap-amd").bootstrap("vs/code/node/cli");
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/950b8b0d37a9b7061b6f0d291837ccc4015f5ecd/core/cli.js.map
