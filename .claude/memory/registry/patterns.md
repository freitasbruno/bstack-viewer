# Patterns

## API client pattern (renderer → server)

All filesystem and project access goes through `src/renderer/src/api.ts`.
The renderer calls typed async functions that `fetch('/api/...')` under the hood.
No `window.api`, no IPC, no Electron.

```ts
// src/renderer/src/api.ts
export async function listProjects(): Promise<Project[]>
export async function addProject(rootPath: string): Promise<{ project?: Project; error?: string }>
export async function removeProject(id: string): Promise<void>
export async function setLastOpened(id: string): Promise<void>
export async function updateProject(id: string, patch: { coverTheme?: string; coverEmoji?: string }): Promise<void>

export async function getRoots(): Promise<string[]>
export async function browseDir(absPath: string): Promise<{ name: string; path: string }[]>
export async function readDir(absPath: string): Promise<DirEntry[]>
export async function readFile(absPath: string): Promise<string>
```

## Server API endpoints

```
GET    /api/projects
POST   /api/projects                  body: { rootPath }
DELETE /api/projects/:id
PATCH  /api/projects/:id/lastOpened
PATCH  /api/projects/:id              body: { coverTheme?, coverEmoji? }

GET    /api/fs/roots                  → string[] (drive letters on Windows)
GET    /api/fs/browse?path=X          → { name, path }[] (directories only)
GET    /api/fs/dir?path=X             → DirEntry[] (files + dirs)
GET    /api/fs/file?path=X            → { content: string }
```

## Module registry pattern

Dispatch chain: each module declares `canHandle(fileName, relPath)` and a `type`.
First match wins. Fallback is always `MarkdownModule`.

```ts
interface Module {
  name: string
  type: 'markdown' | 'mockup'   // determines which viewer component is used
  canHandle(fileName: string, relPath: string): boolean
}
```

Dispatch order: MockupModule → SchemaModule → MarkdownModule

`MemoryBrowser` checks `mod.type` to decide between `<MarkdownView>` and `<MockupView>`.

## File path convention

The renderer works with **relative path segments** within `memory/` — e.g. `['roadmap', 'index.md']`, `['wip']`.
The server resolves these to absolute paths using the project's `rootPath + '/.claude/memory/'`.
The renderer constructs absolute paths via `winJoin(memoryRoot, ...segments)` from `utils/paths.ts` — needed for direct API calls.

## Project validation on add

When the user picks a folder:
1. Server checks: `existsSync(rootPath + '/.claude/memory/')`
2. If missing → `400 { error: 'No .claude/memory/ folder found…' }`
3. If already in list → `400 { error: 'This project is already in your list.' }`
4. If valid → generate uuid, append to JSON file, return Project

## Navigation state (renderer)

`MemoryBrowser` owns:
- `currentPath: string[]` — path segments relative to memory/
- `isDir: boolean` — whether current view is a directory
- `expandedDirs: Set<string>` — FileTree open/close state

Navigation always goes through a single `navigate(pathSegments, isDir)` function to keep breadcrumb, active highlights, and content in sync.
