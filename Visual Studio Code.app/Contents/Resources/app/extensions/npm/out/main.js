/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const httpRequest = require("request-light");
const vscode = require("vscode");
const nls = require("vscode-nls");
const minimatch = require("minimatch");
const localize = nls.loadMessageBundle(__filename);
const jsonContributions_1 = require("./features/jsonContributions");
let taskProvider;
function activate(context) {
    if (!vscode.workspace.workspaceFolders) {
        return;
    }
    taskProvider = vscode.workspace.registerTaskProvider('npm', {
        provideTasks: () => {
            return provideNpmScripts();
        },
        resolveTask(_task) {
            return undefined;
        }
    });
    configureHttpRequest();
    vscode.workspace.onDidChangeConfiguration(() => configureHttpRequest());
    context.subscriptions.push(jsonContributions_1.addJSONProviders(httpRequest.xhr));
}
exports.activate = activate;
function configureHttpRequest() {
    const httpSettings = vscode.workspace.getConfiguration('http');
    httpRequest.configure(httpSettings.get('proxy', ''), httpSettings.get('proxyStrictSSL', true));
}
function deactivate() {
    if (taskProvider) {
        taskProvider.dispose();
    }
}
exports.deactivate = deactivate;
function exists(file) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, _reject) => {
            fs.exists(file, (value) => {
                resolve(value);
            });
        });
    });
}
function readFile(file) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            fs.readFile(file, (err, data) => {
                if (err) {
                    reject(err);
                }
                resolve(data.toString());
            });
        });
    });
}
const buildNames = ['build', 'compile', 'watch'];
function isBuildTask(name) {
    for (let buildName of buildNames) {
        if (name.indexOf(buildName) !== -1) {
            return true;
        }
    }
    return false;
}
const testNames = ['test'];
function isTestTask(name) {
    for (let testName of testNames) {
        if (name === testName) {
            return true;
        }
    }
    return false;
}
function isNotPreOrPostScript(script) {
    return !(script.startsWith('pre') || script.startsWith('post'));
}
function provideNpmScripts() {
    return __awaiter(this, void 0, void 0, function* () {
        let emptyTasks = [];
        let allTasks = [];
        let folders = vscode.workspace.workspaceFolders;
        if (!folders) {
            return emptyTasks;
        }
        try {
            for (let i = 0; i < folders.length; i++) {
                let folder = folders[i];
                if (isEnabled(folder)) {
                    let relativePattern = new vscode.RelativePattern(folder, '**/package.json');
                    let paths = yield vscode.workspace.findFiles(relativePattern, '**/node_modules/**');
                    for (let j = 0; j < paths.length; j++) {
                        if (!isExcluded(folder, paths[j])) {
                            let tasks = yield provideNpmScriptsForFolder(paths[j]);
                            allTasks.push(...tasks);
                        }
                    }
                }
            }
            return allTasks;
        }
        catch (error) {
            return Promise.reject(error);
        }
    });
}
function isEnabled(folder) {
    return vscode.workspace.getConfiguration('npm', folder.uri).get('autoDetect') === 'on';
}
function isExcluded(folder, packageJsonUri) {
    function testForExclusionPattern(path, pattern) {
        return minimatch(path, pattern, { dot: true });
    }
    let exclude = vscode.workspace.getConfiguration('npm', folder.uri).get('exclude');
    if (exclude) {
        if (Array.isArray(exclude)) {
            for (let pattern of exclude) {
                if (testForExclusionPattern(packageJsonUri.fsPath, pattern)) {
                    return true;
                }
            }
        }
        else if (testForExclusionPattern(packageJsonUri.fsPath, exclude)) {
            return true;
        }
    }
    return false;
}
function provideNpmScriptsForFolder(packageJsonUri) {
    return __awaiter(this, void 0, void 0, function* () {
        let emptyTasks = [];
        if (packageJsonUri.scheme !== 'file') {
            return emptyTasks;
        }
        let packageJson = packageJsonUri.fsPath;
        if (!(yield exists(packageJson))) {
            return emptyTasks;
        }
        let folder = vscode.workspace.getWorkspaceFolder(packageJsonUri);
        if (!folder) {
            return emptyTasks;
        }
        try {
            var contents = yield readFile(packageJson);
            var json = JSON.parse(contents);
            if (!json.scripts) {
                return emptyTasks;
            }
            const result = [];
            Object.keys(json.scripts).filter(isNotPreOrPostScript).forEach(each => {
                const task = createTask(each, `run ${each}`, folder, packageJsonUri);
                const lowerCaseTaskName = each.toLowerCase();
                if (isBuildTask(lowerCaseTaskName)) {
                    task.group = vscode.TaskGroup.Build;
                }
                else if (isTestTask(lowerCaseTaskName)) {
                    task.group = vscode.TaskGroup.Test;
                }
                result.push(task);
            });
            // always add npm install (without a problem matcher)
            // result.push(createTask('install', 'install', rootPath, folder, []));
            return result;
        }
        catch (e) {
            let localizedParseError = localize(0, null, packageJsonUri);
            throw new Error(localizedParseError);
        }
    });
}
function createTask(script, cmd, folder, packageJsonUri, matcher) {
    function getTaskName(script, file) {
        if (file.length) {
            return `${script} - ${file.substring(0, file.length - 1)}`;
        }
        return script;
    }
    function getCommandLine(folder, cmd) {
        let packageManager = vscode.workspace.getConfiguration('npm', folder.uri).get('packageManager', 'npm');
        if (vscode.workspace.getConfiguration('npm', folder.uri).get('runSilent')) {
            return `${packageManager} --silent ${cmd}`;
        }
        return `${packageManager} ${cmd}`;
    }
    function getRelativePath(folder, packageJsonUri) {
        let rootUri = folder.uri;
        let absolutePath = packageJsonUri.path.substring(0, packageJsonUri.path.length - 'package.json'.length);
        return absolutePath.substring(rootUri.path.length + 1);
    }
    let kind = {
        type: 'npm',
        script: script
    };
    let relativePackageJson = getRelativePath(folder, packageJsonUri);
    if (relativePackageJson.length) {
        kind.path = getRelativePath(folder, packageJsonUri);
    }
    let taskName = getTaskName(script, relativePackageJson);
    let cwd = path.dirname(packageJsonUri.fsPath);
    return new vscode.Task(kind, folder, taskName, 'npm', new vscode.ShellExecution(getCommandLine(folder, cmd), { cwd: cwd }), matcher);
}
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/950b8b0d37a9b7061b6f0d291837ccc4015f5ecd/extensions/npm/out/main.js.map
