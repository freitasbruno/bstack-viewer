# Utils

## `parse(text: string): string`
Location: `src/renderer/src/utils/md.ts`

Custom inline markdown-to-HTML renderer. No external dependencies. Ported from `.claude/memory-viewer.html`.

### Block handlers (in parse order)
1. Fenced code blocks (` ``` lang `) — emits `<pre><code class="lang-*">`
   - `lang-mermaid` blocks are post-processed by MarkdownView into inline SVG
2. Horizontal rules (`---`, `***`, `___`)
3. Headings `#`–`######`
4. Blockquotes `>`
5. Tables `|col|col|` with alignment row
6. Unordered lists (`-`, `*`, `+`) + checkboxes `- [ ]` / `- [x]`
7. Ordered lists `1.`
8. Blank lines (skipped)
9. Paragraphs (fallback)

### Inline handler (`inline(s)`)
1. Inline code `` ` `` — extracted first, restored last
2. Bold+italic `***`, bold `**`/`__`, italic `*`/`_`, strikethrough `~~`
3. Links: relative → `<a data-mdlink="path">`, external → `<a class="md-ext" target="_blank">`
4. HTML escape throughout via `esc()`

### XSS safety
All text is HTML-escaped via `esc()` before insertion.

---

## `ModuleRegistry`
Location: `src/renderer/src/utils/moduleRegistry.ts`

```ts
ModuleRegistry.register(module)            // add to dispatch list
ModuleRegistry.dispatch(fileName, relPath) // → first matching Module
```

Modules registered in order: MockupModule, SchemaModule, MarkdownModule.
See patterns.md for the Module interface (`name`, `type`, `canHandle`).

---

## `winJoin(...parts: string[]): string`
Location: `src/renderer/src/utils/paths.ts`

Browser-safe Windows path join. Joins with `\`, collapses duplicate separators.
Used in the renderer where Node's `path` module is unavailable.

## `memoryRoot(rootPath: string): string`
Location: `src/renderer/src/utils/paths.ts`

Returns `rootPath + '\.claude\memory'`. Used in `MemoryBrowser` to construct the absolute memory root for API calls.

---

## `readProjects() / writeProjects()`
Location: `server/db.ts`

Reads/writes `~/.bstack-viewer/projects.json`. Used by all project API endpoints.
