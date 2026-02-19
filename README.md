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

## What it does not do (MVP limitations)

- No background color setting for JSDoc blocks.
- No dimming setting for non-Markdown text.
- No Markdown preview/hover changes.
- No language server behavior changes.
- No custom parser; this extension is grammar-injection only.

## Scope behavior

- ✅ `/** ... */` (JSDoc) receives Markdown highlighting.
- ❌ `/* ... */` (normal block comments) are unchanged.
- ❌ `// ...` (line comments) are unchanged.

## Run locally (Extension Development Host)

1. Open this folder in VS Code.
2. Press `F5` to launch the Extension Development Host.
3. In the Dev Host window, open a `.js`, `.ts`, `.jsx`, or `.tsx` file.
4. Add a JSDoc block and verify Markdown highlighting appears only there.

## Manual validation checklist

Use a sample file and verify all items:

1. JSDoc comment highlights Markdown:

```ts
/**
 * **bold** item
 * `inline code`
 * - list item
 * [link](https://example.com)
 */
function demo() {}
```

2. Normal block comment is unchanged:

```ts
/* **bold** should stay plain comment-colored here */
```

3. Line comment is unchanged:

```ts
// `inline code` should stay plain comment-colored here
```

4. Repeat in `.jsx` and `.tsx` files.

## Before/after screenshot instructions

To document visual differences:

1. Open the same file before enabling/installing this extension and capture a screenshot.
2. Enable/install the extension, reload window, and capture the same region.
3. Compare JSDoc sections only; non-JSDoc comments should look unchanged.

## Optional color customization

You can customize specific injected scopes in your `settings.json`:

```json
{
  "editor.tokenColorCustomizations": {
    "textMateRules": [
      {
        "scope": [
          "meta.embedded.block.jsdoc-markdown markup.bold",
          "meta.embedded.block.jsdoc-markdown markup.italic",
          "meta.embedded.block.jsdoc-markdown markup.inline.raw",
          "meta.embedded.block.jsdoc-markdown markup.fenced_code.block"
        ],
        "settings": {
          "foreground": "#c586c0"
        }
      }
    ]
  }
}
```

## Notes

- This extension is intentionally minimal and contains no runtime activation code.
- Cursor support is best-effort and depends on compatibility with standard VS Code extension grammar injection.
