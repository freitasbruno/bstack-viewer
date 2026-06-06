# Utils

## `MD.parse(text: string): string`
Location: `src/renderer/utils/md.js`

Custom inline markdown-to-HTML renderer. No external dependencies. Ported from `.claude/memory-viewer.html`.

### Block handlers (in parse order)
1. Fenced code blocks (` ``` lang `) — emits `<pre><code class="lang-*">`
2. Horizontal rules (`---`, `***`, `___`)
3. Headings `#`–`######`
4. Blockquotes `>`
5. Tables `|col|col|` with alignment row
6. Unordered lists (`-`, `*`, `+`) + checkboxes `- [ ]` / `- [x]`
7. Ordered lists `1.`
8. Blank lines (skipped)
9. Paragraphs (fallback)

### Inline handler (`inline(s)`)
Processing order:
1. Inline code `` ` `` — extracted to array first, restored after other passes
2. Bold+italic `***`, bold `**`/`__`, italic `*`/`_`, strikethrough `~~`
3. Links: relative `[text](path)` → `<a data-mdlink="path">`, external → `<a target="_blank">`
4. HTML escape throughout (`&`, `<`, `>`)

### XSS safety
All text content is HTML-escaped via `esc()` before insertion. User content never reaches `innerHTML` unescaped.

---

## `ModuleRegistry`
Location: `src/renderer/utils/moduleRegistry.js`

```js
ModuleRegistry.register(module)   // add to dispatch list
ModuleRegistry.dispatch(fileName, relPath)  // → first matching module
```

Modules registered in order: MockupRenderer, SchemaVisualizer, MarkdownRenderer.
See patterns.md for the Module interface.

---

## `generateId(): string`
Location: `src/main/utils/id.js`

`crypto.randomUUID()` — used when adding a new project.

---

## `resolveMemoryPath(rootPath: string, segments: string[]): string`
Location: `src/main/utils/paths.js`

Joins `rootPath + '/.claude/memory/'` with path segments. Used by all `fs.*` IPC handlers to convert relative memory paths to absolute disk paths.
