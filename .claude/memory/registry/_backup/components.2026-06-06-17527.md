# Component Registry

Reference: `.claude/memory-viewer.html` — design reference.
All components are in `src/renderer/src/`.

## Layout

### `App` — `App.tsx`
Root component. Wraps `ProjectsProvider` + `MemoryRouter`. Two routes: `/` and `/project/:projectId`.

### `AppHeader` — `components/AppHeader.tsx`
Fixed top bar (50px, `--header-h`). Props: `showProject`, `projectName`, `pathParts[]`, `moduleName`, `onRefresh`.
- Logo mark: 28×28px rose square, "BS", 7px radius, click navigates to `/`
- Title: "BStack Memory"
- Path: separator + `pathParts.join(' / ')` (hidden when `!showProject`)
- Module pill: uppercase badge, accent-light bg, rose text (hidden when no `moduleName`)
- Refresh + Projects buttons: border style, hover rose (shown when `showProject`)

## Hub screen

### `ProjectHub` — `views/ProjectHub.tsx`
Route `/`. Lists projects via `ProjectCard` grid. Add button calls `window.api.projects.add()`.
Empty state when `projects.length === 0`.

### `ProjectCard` — inline in `ProjectHub.tsx`
Card surface (card-bg, border, 8px radius). Shows name, path (truncated monospace), last opened date.
Hover: `translateY(-2px)` + shadow. Remove button appears on hover (top-right, accent-light).

## Browser screen

### `MemoryBrowser` — `views/MemoryBrowser.tsx`
Route `/project/:projectId`. Owns: `currentPath: string[]`, `isDir: boolean`, `expandedDirs: Set<string>`, `content: ContentState`.
All navigation through single `navigate(path, isDir)` function.
Renders: `AppHeader` (showProject) + `Sidebar` + main pane content.

### `Sidebar` — `components/Sidebar.tsx`
252px left panel (`--sidebar-w`), card-bg, border-right. Two sections:
- Quick Links (top, `pb-2.5`)
- Files (flex-1, border-top, `pb-5`)

### `QuickLinks` — `components/QuickLinks.tsx`
Fixed list of 5 links. Props: `activeKey`, `onNavigate`.
Active state: accent-light bg, rose text, weight 600.
Links: Roadmap → `roadmap/index.md`, WIP → `wip/` (dir), Notes → `notes.md`, Known Bugs → `known-bugs.md`, Tech Debt → `technical-debt.md`.

### `FileTree` — `components/FileTree.tsx`
Recursive tree of `memory/` contents. Props: `memoryRoot`, `activeKey`, `expandedDirs`, `onToggleDir`, `onFileClick`.
- `TreeRow` — inline sub-component: `▶`/`▼` for dirs, `📄` for files. Depth indent: `depth * 14 + 6` px.
- `DirectoryNode` — inline recursive sub-component: fetches children via IPC when opened. Dep: `[isOpen, memoryRoot, key]`.

### `BreadcrumbBar` — `components/BreadcrumbBar.tsx`
Props: `parts: string[]`. Prefixes with "memory". Last segment uses `--text` + weight 500, others `--muted`. Separator `›`.

### `MarkdownView` — `components/MarkdownView.tsx`
Props: `content: string`, `onNavigate: (relPath) => void`.
Renders `MD.parse(content)` into `<div className="md-body">` via `dangerouslySetInnerHTML`.
On mount: attaches click handlers to `[data-mdlink]` (→ `onNavigate`) and `.md-ext` (→ `shell.openExternal`).
`fadeUp` animation on mount.

### `DirListing` — `components/DirListing.tsx`
Props: `name`, `entries: DirEntry[]`, `onNavigate`, `basePath`.
`<h2>name/</h2>` + cards. Entry cards inline: `📁`/`📄` + name, hover `translateY(-1px)` + shadow.

## Context

### `ProjectsContext` — `context/ProjectsContext.tsx`
Provides `{ projects: Project[], reload: () => Promise<void> }`.
Loads on mount via `window.api.projects.list()`. Wrap with `ProjectsProvider`.
Hook: `useProjects()`.
