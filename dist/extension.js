"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
const vscode = __importStar(require("vscode"));
const SUPPORTED_LANGUAGES = new Set([
    'javascript',
    'typescript',
    'javascriptreact',
    'typescriptreact'
]);
const CONFIG_NAMESPACE = 'jsdocMarkdownStyle';
const DEBOUNCE_MS = 150;
let decorationType;
const pendingUpdates = new Map();
function activate(context) {
    decorationType = createDecorationType();
    const triggerUpdate = (editor) => {
        if (!editor) {
            return;
        }
        const key = editor.document.uri.toString();
        const existing = pendingUpdates.get(key);
        if (existing) {
            clearTimeout(existing);
        }
        const timer = setTimeout(() => {
            pendingUpdates.delete(key);
            applyDecorations(editor);
        }, DEBOUNCE_MS);
        pendingUpdates.set(key, timer);
    };
    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor) {
        triggerUpdate(activeEditor);
    }
    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor((editor) => {
        triggerUpdate(editor);
    }), vscode.workspace.onDidChangeTextDocument((event) => {
        const editor = vscode.window.activeTextEditor;
        if (!editor || event.document !== editor.document) {
            return;
        }
        triggerUpdate(editor);
    }), vscode.workspace.onDidChangeConfiguration((event) => {
        if (!event.affectsConfiguration(CONFIG_NAMESPACE)) {
            return;
        }
        if (decorationType) {
            decorationType.dispose();
        }
        decorationType = createDecorationType();
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            triggerUpdate(editor);
        }
    }));
    context.subscriptions.push({
        dispose: () => {
            for (const timer of pendingUpdates.values()) {
                clearTimeout(timer);
            }
            pendingUpdates.clear();
            decorationType?.dispose();
            decorationType = undefined;
        }
    });
}
function createDecorationType() {
    const config = vscode.workspace.getConfiguration(CONFIG_NAMESPACE);
    const backgroundColor = normalizeString(config.get('backgroundColor'));
    const removeItalics = config.get('removeItalics', true);
    const options = {};
    if (backgroundColor) {
        options.backgroundColor = backgroundColor;
    }
    if (removeItalics) {
        options.fontStyle = 'normal';
    }
    return vscode.window.createTextEditorDecorationType(options);
}
function applyDecorations(editor) {
    if (!decorationType) {
        return;
    }
    const config = vscode.workspace.getConfiguration(CONFIG_NAMESPACE);
    const enabled = config.get('enabled', true);
    if (!enabled || !SUPPORTED_LANGUAGES.has(editor.document.languageId)) {
        editor.setDecorations(decorationType, []);
        return;
    }
    const ranges = findJSDocRanges(editor.document);
    editor.setDecorations(decorationType, ranges);
}
function findJSDocRanges(document) {
    const text = document.getText();
    const ranges = [];
    let cursor = 0;
    while (cursor < text.length) {
        const start = text.indexOf('/**', cursor);
        if (start === -1) {
            break;
        }
        const endToken = text.indexOf('*/', start + 3);
        if (endToken === -1) {
            break;
        }
        const startPos = document.positionAt(start);
        const endPos = document.positionAt(endToken + 2);
        ranges.push(new vscode.Range(startPos, endPos));
        cursor = endToken + 2;
    }
    return ranges;
}
function normalizeString(value) {
    if (typeof value !== 'string') {
        return undefined;
    }
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
}
//# sourceMappingURL=extension.js.map