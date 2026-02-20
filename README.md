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

It also adds optional runtime styling for JSDoc blocks:

- Background color for the full `/** ... */` range.
- Optional comment-italics neutralization (`fontStyle: normal`) so Markdown reads like regular text.

## Configuration

```json
{
  "jsdocMarkdownStyle.enabled": true,
  "jsdocMarkdownStyle.backgroundColor": "rgba(128, 128, 128, 0.08)",
  "jsdocMarkdownStyle.removeItalics": true,
  "jsdocMarkdownStyle.baseForegroundColor": null
}
```

Notes:

- Set `backgroundColor` to `null` or `""` to disable background fill.
- Foreground token colors are untouched, so Markdown token coloring stays theme-driven.
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
2. JSDoc text is not italic when `removeItalics` is enabled.
3. Normal block comments are unchanged.
4. Line comments are unchanged.
5. Repeat in `.jsx` and `.tsx` files.


## Optional base foreground color (without breaking Markdown token colors)

To avoid overriding Markdown token-level colors, this extension does **not** set decoration `color`.
Instead, target the injected JSDoc scope with theme token customization.

You can run the command **"JSDoc Markdown Style: Copy tokenColorCustomizations snippet"** (Command Palette) to copy a ready-to-paste JSON snippet that uses `jsdocMarkdownStyle.baseForegroundColor` when set.


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
      }
    ]
  }
}
```

Notes:
- More specific Markdown scopes (inline code, headings, bold, links, etc.) still win, so their colors remain unchanged.
- `jsdocMarkdownStyle.removeItalics` is still handled by editor decorations (`fontStyle: normal`).
- `jsdocMarkdownStyle.baseForegroundColor` is used as the foreground value in the copied snippet; apply the snippet via `editor.tokenColorCustomizations`.
