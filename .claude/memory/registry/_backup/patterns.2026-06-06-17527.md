# Patterns

## IPC bridge (Electron main ↔ renderer)

All file system and store access goes through the preload bridge. The renderer never calls `fs` or `electron-store` directly.

**Preload** (`src/preload/index.js`) exposes a `window.api` object via `contextBridge.exposeInMainWorld`.

**Main** (`src/main/index.js`) registers `ipcMain.handle` listeners.

**Renderer** calls `window.api.methodName(args)` — returns a Promise.

### API surface (Phase 1)
```js
window.api.projects.list()                    // → Project[]
window.api.projects.add(rootPath)             // → Project | { error: string }
window.api.projects.remove(id)               // → void
window.api.projects.setLastOpened(id)        // → void

window.api.fs.readDir(absPath)               // → { name, kind }[]
window.api.fs.readFile(absPath)              // → string
window.api.fs.openDirPicker()               // → string | null  (native dialog)
```

## Module registry pattern

Dispatch chain: each module declares `canHandle(fileName, relPath)`. First match wins. Fallback is always `MarkdownRenderer`.

```js
const ModuleRegistry = {
  register(module) { ... },
  dispatch(fileName, relPath) { ... }  // → Module
}

// Module interface
const Module = {
  name: string,
  canHandle: (fileName, relPath) => boolean,
  render: (content: string, relPath: string) => JSX  // or HTML string
}
```

Dispatch order: MockupRenderer → SchemaVisualizer → MarkdownRenderer

## File path convention

The renderer works with **relative paths** within `memory/` — e.g. `roadmap/index.md`, `wip/`.
The main process resolves these to absolute paths using the open project's `rootPath + '/.claude/memory/'`.

The renderer never constructs absolute paths itself.

## Project validation on add

When the user picks a folder to add:
1. Main process checks: `exists(rootPath + '/.claude/memory/')`
2. If missing → return `{ error: 'No .claude/memory/ folder found' }`
3. If valid → generate uuid, save to store, return Project

## Navigation state (renderer)

`MemoryBrowser` owns:
- `currentPath: string[]` — path segments relative to memory/
- `isDir: boolean` — whether current view is a directory
- `expandedDirs: Set<string>` — for FileTree open/close state

Navigation always goes through a single `navigate(pathSegments, isDir)` function to keep breadcrumb, active highlights, and content in sync.
