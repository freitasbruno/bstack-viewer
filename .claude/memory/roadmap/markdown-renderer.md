# Markdown Renderer — inline renderer port

## Goal
Port the custom inline markdown renderer from the HTML reference into the React app as a reusable utility + component.

## Scope
Port `MD.parse()` from `memory-viewer.html` verbatim into `src/renderer/utils/md.js`.

### Block elements handled
- Headings h1–h6 (`#` syntax)
- Fenced code blocks (` ``` ` with optional language class `lang-*`)
- Blockquotes (`>`)
- Tables (with column alignment via `:---:`, `---:`)
- Unordered lists (`-`, `*`, `+`) including nested
- Ordered lists (`1.`)
- Checkboxes (`- [ ]`, `- [x]`) — rendered disabled
- Horizontal rules (`---`, `***`, `___`)
- Paragraphs (fallback)

### Inline elements handled
- Bold+italic `***`, bold `**`/`__`, italic `*`/`_`, strikethrough `~~`
- Inline code `` ` `` (protected from further processing)
- Relative links `[text](path)` → internal navigation (fires `onNavigate` prop)
- External links `[text](https://...)` → `target="_blank" rel="noopener"`
- HTML escaping for XSS safety

## Component interface
```jsx
<MarkdownView content={string} onNavigate={(relPath) => void} />
```
Renders into a `<div className="md-body">`.

## Acceptance
- All block and inline elements render correctly
- Relative links call `onNavigate` instead of opening a URL
- External links open in system browser (Electron: `shell.openExternal`)
- XSS: `<script>` in markdown is escaped, not executed
