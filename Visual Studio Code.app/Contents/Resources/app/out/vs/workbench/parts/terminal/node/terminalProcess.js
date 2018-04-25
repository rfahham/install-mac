/*!--------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
(function(){var e=["vs/workbench/parts/terminal/node/terminalProcess","require","exports","os","path","node-pty"];define(e[0],function(n){for(var s=[],t=0,o=n.length;t<o;t++)s[t]=e[n[t]];return s}([1,2,3,4,5]),function(e,n,s,t,o){"use strict";function r(){P&&clearTimeout(P),P=setTimeout(function(){l.kill(),process.exit(E)},250)}function c(){process.send({type:"title",content:l.process}),T=l.process}Object.defineProperty(n,"__esModule",{value:!0});var i;i="win32"===s.platform()?t.basename(process.env.PTYSHELL):"xterm-256color";var p=process.env.PTYSHELL,a=function(){if(process.env.PTYSHELLCMDLINE)return process.env.PTYSHELLCMDLINE;for(var e=[],n=0;process.env["PTYSHELLARG"+n];)e.push(process.env["PTYSHELLARG"+n]),n++;return e}(),v=process.env.PTYCWD,L=process.env.PTYCOLS,u=process.env.PTYROWS,T="";!function(e){setInterval(function(){try{process.kill(e,0)}catch(e){process.exit()}},5e3)}(process.env.PTYPID),function(){
["AMD_ENTRYPOINT","ELECTRON_NO_ASAR","ELECTRON_RUN_AS_NODE","GOOGLE_API_KEY","PTYCWD","PTYPID","PTYSHELL","PTYCOLS","PTYROWS","PTYSHELLCMDLINE","VSCODE_LOGS"].forEach(function(e){process.env[e]&&delete process.env[e]});for(var e=0;process.env["PTYSHELLARG"+e];)delete process.env["PTYSHELLARG"+e],e++}();var f={name:i,cwd:v};L&&u&&(f.cols=parseInt(L,10),f.rows=parseInt(u,10));var P,E,l=o.fork(p,a,f);l.on("data",function(e){process.send({type:"data",content:e}),P&&(clearTimeout(P),r())}),l.on("exit",function(e){E=e,r()}),process.on("message",function(e){"input"===e.event?l.write(e.data):"resize"===e.event?l.resize(Math.max(e.cols,1),Math.max(e.rows,1)):"shutdown"===e.event&&r()}),process.send({type:"pid",content:l.pid}),c(),setInterval(function(){T!==l.process&&c()},200)})}).call(this);
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/950b8b0d37a9b7061b6f0d291837ccc4015f5ecd/core/vs/workbench/parts/terminal/node/terminalProcess.js.map
