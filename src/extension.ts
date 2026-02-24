import * as vscode from 'vscode'

const SUPPORTED_LANGUAGES = new Set([
	'javascript',
	'typescript',
	'javascriptreact',
	'typescriptreact',
])

const CONFIG_NAMESPACE = 'jsdocMarkdownPlus'
const DEBOUNCE_MS = 150

let decorationType: vscode.TextEditorDecorationType | undefined
const pendingUpdates = new Map<string, ReturnType<typeof setTimeout>>()

export function activate(context: vscode.ExtensionContext): void {
	decorationType = createDecorationType()

	const triggerUpdate = (editor: vscode.TextEditor | undefined): void => {
		if (!editor) return

		const key = editor.document.uri.toString()
		const existing = pendingUpdates.get(key)
		if (existing) clearTimeout(existing)

		const timer = setTimeout(() => {
			pendingUpdates.delete(key)
			applyDecorations(editor)
		}, DEBOUNCE_MS)

		pendingUpdates.set(key, timer)
	}

	const clearPendingTimerForDocument = (
		document: vscode.TextDocument,
	): void => {
		const key = document.uri.toString()
		const timer = pendingUpdates.get(key)
		if (timer) clearTimeout(timer)
		pendingUpdates.delete(key)
	}

	const triggerUpdateForVisibleEditors = (
		document: vscode.TextDocument,
	): void => {
		for (const editor of vscode.window.visibleTextEditors)
			if (editor.document === document) triggerUpdate(editor)
	}

	const triggerUpdateForAllVisibleEditors = (): void => {
		for (const editor of vscode.window.visibleTextEditors)
			triggerUpdate(editor)
	}

	triggerUpdateForAllVisibleEditors()

	context.subscriptions.push(
		vscode.window.onDidChangeActiveTextEditor((editor) => {
			triggerUpdate(editor)
		}),
		vscode.workspace.onDidChangeTextDocument((event) => {
			triggerUpdateForVisibleEditors(event.document)
		}),
		vscode.workspace.onDidCloseTextDocument((document) => {
			clearPendingTimerForDocument(document)
		}),
		vscode.workspace.onDidChangeConfiguration((event) => {
			if (!event.affectsConfiguration(CONFIG_NAMESPACE)) return

			decorationType?.dispose()
			decorationType = createDecorationType()
			triggerUpdateForAllVisibleEditors()
		}),
	)

	context.subscriptions.push({
		dispose: () => {
			for (const timer of pendingUpdates.values()) clearTimeout(timer)
			pendingUpdates.clear()
			decorationType?.dispose()
			decorationType = undefined
		},
	})
}

function createDecorationType(): vscode.TextEditorDecorationType {
	const config = vscode.workspace.getConfiguration(CONFIG_NAMESPACE)
	const backgroundColor = normalizeString(
		config.get<string | null>('backgroundColor'),
	)

	const options: vscode.DecorationRenderOptions = { isWholeLine: true }
	if (backgroundColor) options.backgroundColor = backgroundColor

	return vscode.window.createTextEditorDecorationType(options)
}

function applyDecorations(editor: vscode.TextEditor): void {
	if (!decorationType) return

	if (!SUPPORTED_LANGUAGES.has(editor.document.languageId)) {
		editor.setDecorations(decorationType, [])
		return
	}

	const config = vscode.workspace.getConfiguration(CONFIG_NAMESPACE)
	const includeDelimiterLines = config.get<boolean>(
		'backgroundIncludeDelimiterLines',
		false,
	)
	const blockRanges = findJSDocRanges(editor.document)
	const lineRanges = expandToWholeLineRanges(
		editor.document,
		blockRanges,
		includeDelimiterLines,
	)
	editor.setDecorations(decorationType, lineRanges)
}

function expandToWholeLineRanges(
	document: vscode.TextDocument,
	blockRanges: vscode.Range[],
	includeDelimiterLines: boolean,
): vscode.Range[] {
	const lineRanges: vscode.Range[] = []

	for (const blockRange of blockRanges) {
		if (blockRange.start.line === blockRange.end.line) continue // we don't yet support single-line jsdocs

		const offset = includeDelimiterLines ? 1 : 0

		const firstContentLine = blockRange.start.line + offset
		const lastContentLine = blockRange.end.line - offset
		if (firstContentLine > lastContentLine) continue

		for (let line = firstContentLine; line <= lastContentLine; line += 1)
			lineRanges.push(document.lineAt(line).range)
	}

	return lineRanges
}

function findJSDocRanges(document: vscode.TextDocument): vscode.Range[] {
	const text = document.getText()
	const ranges: vscode.Range[] = []

	let cursor = 0
	while (cursor < text.length) {
		const start = text.indexOf('/**', cursor)
		if (start === -1) break

		if (start > 0) {
			const previous = text[start - 1]
			if (previous === '"' || previous === "'" || previous === '`') {
				cursor = start + 3
				continue
			}
		}

		const endToken = text.indexOf('*/', start + 3)
		if (endToken === -1) break

		const startPos = document.positionAt(start)
		const endPos = document.positionAt(endToken + 2)
		ranges.push(new vscode.Range(startPos, endPos))

		cursor = endToken + 2
	}

	return ranges
}

function normalizeString(value: string | null | undefined): string | undefined {
	if (typeof value !== 'string') return undefined

	const trimmed = value.trim()
	return trimmed.length > 0 ? trimmed : undefined
}
