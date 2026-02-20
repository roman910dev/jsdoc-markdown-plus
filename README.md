# JSDoc Markdown MVP

A minimal VS Code extension that injects Markdown syntax highlighting **only** inside JSDoc block comments (`/** ... */`) for:

- JavaScript (`.js`, `.mjs`, `.cjs`)
- TypeScript (`.ts`)
- JavaScript React (`.jsx`)
- TypeScript React (`.tsx`)

## What it does

Inside JSDoc comments, common Markdown constructs are highlighted using VS Code's built-in Markdown TextMate grammar, including:

- Inline code: `` `code` ``
- Fenced code blocks: ```` ```ts ````
- Emphasis: `*italic*`, `**bold**`
- Links and lists

It also adds optional runtime background styling for JSDoc blocks:

- Background color for the full `/** ... */` range.

## Configuration

```json
{
  "jsdocMarkdownStyle.backgroundColor": "rgba(0, 0, 0, 0.1)"
}
```

Notes:

- Set `backgroundColor` to `null` or `""` to disable background fill.
- JSDoc detection is a lightweight text scan (`/**` ... `*/`), so comment-like sequences inside strings may still be matched in edge cases.

## Scope behavior

- ✅ `/** ... */` (JSDoc) receives Markdown highlighting and optional style decoration.
- ❌ `/* ... */` (normal block comments) are unchanged.
- ❌ `// ...` (line comments) are unchanged.

## Run locally (Extension Development Host)

1. Open this folder in VS Code.
2. Run `npm install`.
3. Run `npm run build`.
4. Press `F5` to launch the Extension Development Host.
5. In the Dev Host window, open a `.js`, `.ts`, `.jsx`, or `.tsx` file.

## Manual validation checklist

Use a sample file and verify all items:

1. JSDoc comment highlights Markdown and has background.
2. Normal block comments are unchanged.
3. Line comments are unchanged.
4. Repeat in `.jsx` and `.tsx` files.


## Styling via token colors

Foreground color and italics are best configured directly via `editor.tokenColorCustomizations`.
Use these selectors:

- `meta.jsdoc.markdown`: base JSDoc markdown text color/style.
- `punctuation.definition.comment.jsdoc.leading`: the leading `*` markers in multi-line JSDoc blocks.

```json
{
  "editor.tokenColorCustomizations": {
    "textMateRules": [
      {
        "scope": "meta.jsdoc.markdown",
        "settings": {
          "foreground": "#AABBCC",
          "fontStyle": ""
        }
      },
      {
        "scope": "punctuation.definition.comment.jsdoc.leading",
        "settings": {
          "foreground": "#6A737D"
        }
      }
    ]
  }
}
```

Notes:
- Set `fontStyle` to `""` to remove italics.
- More specific Markdown scopes (inline code, headings, bold, links, etc.) still win, so their colors remain unchanged.
