# Component Registry

All components are in `src/renderer/src/`.

## Layout

### `App` — `App.tsx`
Root component. Wraps `ProjectsProvider` + `MemoryRouter`. Two routes: `/` → `ProjectHub`, `/project/:projectId` → `MemoryBrowser`.

### `AppHeader` — `components/AppHeader.tsx`
Fixed top bar (52px). Props: `showProject`, `pathParts[]`, `moduleName`, `onRefresh`.
- Logo: 28×28px rose square, "BS", click navigates to `/`
- Title: "BStack Memory"
- Path separator + `pathParts.join(' / ')` (hidden when `!showProject`)
- Module pill: uppercase badge, accent-light bg, rose text
- Refresh + Projects buttons (shown when `showProject`)
- No drag regions (web app, not Electron)

## Hub screen

### `ProjectHub` — `views/ProjectHub.tsx`
Route `/`. Card grid layout (`auto-fill, minmax(220px, 1fr)`). Add button opens `DirBrowser` modal.
Empty state: centered icon + description + "Browse for project" button.

### `ProjectCard` — inline in `ProjectHub.tsx`
Props: `project`, `onOpen`, `onRemove`, `onCoverChange`.
- **Cover banner** (80px): gradient from `THEMES[]`, auto-assigned by hashing project name, click cycles to next theme
- **Emoji overlay**: shows `project.coverEmoji` or `📁` default. Hover banner to reveal ✏️ (edit emoji inline) and 🎨 (cycle color) buttons
- **Body**: name, truncated monospace path, last opened date, Remove button on hover
- Hover: `translateY(-3px)` + shadow

### `DirBrowser` — `components/DirBrowser.tsx`
Modal filesystem browser for picking a project root folder. Props: `onSelect(path)`, `onClose()`.
- Starts at drives list (from `/api/fs/roots`)
- Navigate into directories via `/api/fs/browse`
- Breadcrumb navigation (click segment to jump back up)
- "Add this folder" confirms selection, "Cancel" closes
- Renders as fixed overlay with backdrop

## Browser screen

### `MemoryBrowser` — `views/MemoryBrowser.tsx`
Route `/project/:projectId`. Owns: `currentPath: string[]`, `isDir: boolean`, `expandedDirs: Set<string>`, `content: ContentState`.
ContentState union: `empty | loading | markdown | mockup | dir | error`.
Dispatches to `<MarkdownView>` or `<MockupView>` based on `mod.type`.

### `Sidebar` — `components/Sidebar.tsx`
252px left panel (`--sidebar-w`), card-bg, border-right. Two sections with `padding: 16px 12px`:
- **Quick Links** (top)
- **Files** (flex-1, border-top)

### `QuickLinks` — `components/QuickLinks.tsx`
5 fixed links: Roadmap → `roadmap/index.md`, WIP → `wip/` (dir), Notes → `notes.md`, Known Bugs → `known-bugs.md`, Tech Debt → `technical-debt.md`.
Active state: accent-light bg, rose text, weight 600.

### `FileTree` — `components/FileTree.tsx`
Recursive tree of `memory/` contents. Fetches via `readDir()` (api.ts) when a directory is expanded.
Depth indent: `depth * 16 + 6` px.

### `BreadcrumbBar` — `components/BreadcrumbBar.tsx`
Props: `parts: string[]`. Prefixes with "memory". Last segment bold `--text`, others `--muted`. Separator `›`.

### `MarkdownView` — `components/MarkdownView.tsx`
Props: `content: string`, `onNavigate: (relPath) => void`.
Renders `parse(content)` into `.md-body` div. On mount:
- Attaches click handlers to `[data-mdlink]` → `onNavigate`
- External links `.md-ext` → `window.open(..., 'noopener,noreferrer')`
- Finds `<code class="lang-mermaid">` blocks → renders as inline SVG via mermaid.js

### `MockupView` — `components/MockupView.tsx`
Props: `html: string`. Renders a sandboxed `<iframe srcDoc={html}>` at full panel height.
Used for `.html` files in `mockups/`.

### `DirListing` — `components/DirListing.tsx`
Props: `name`, `entries: DirEntry[]`, `onNavigate`, `basePath`.
`<h2>name/</h2>` + entry cards. Hover: `translateY(-1px)` + shadow.

## Context

### `ProjectsContext` — `context/ProjectsContext.tsx`
Provides `{ projects: Project[], reload: () => Promise<void> }`.
Loads on mount via `listProjects()` (api.ts). Hook: `useProjects()`.
