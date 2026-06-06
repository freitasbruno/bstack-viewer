# Component Registry

Reference: `.claude/memory-viewer.html` — all components derived from this design.

## Layout

### `App`
Root component. Manages top-level view state: `hub` | `browser`.
Renders `AppHeader` + either `ProjectHub` or `MemoryBrowser`.

### `AppHeader`
Fixed top bar (50px). Contains:
- `LogoMark` — 28px rose square, "BS" label, 7px radius
- Title: "BStack Memory"
- `HeaderPath` — separator + breadcrumb path (hidden on hub screen)
- `ModulePill` — uppercase badge showing active renderer name (hidden on hub screen)
- `RefreshButton` — "↺ Refresh", border style, hover rose

### `Sidebar`
252px left panel. Two sections separated by border:
- `QuickLinks` section (top)
- `FileTree` section (flex: 1, scrollable)

## Hub screen

### `ProjectHub`
Home screen. Lists all projects via `ProjectCard`. Contains add-project button.
Empty state when `projects.length === 0`.

### `ProjectCard`
Card surface (card-bg, border, 8px radius). Shows project name, root path, last opened.
Hover: `translateY(-1px)` + shadow. Click → open project.
Actions: remove button (shown on hover).

## Browser screen

### `MemoryBrowser`
Per-project view. Owns: current file/dir state, expanded tree nodes.
Renders `Sidebar` + `MainPane`.

### `QuickLinks`
Fixed list of 5 links in sidebar:
- Roadmap → `roadmap/index.md`
- WIP → `wip/` (directory)
- Notes → `notes.md`
- Known Bugs → `known-bugs.md`
- Tech Debt → `technical-debt.md`

`.qlink` rows: 6px 8px padding, 6px radius, icon + label. Active state: accent-light bg, rose text.

### `FileTree`
Recursive expandable tree of `.claude/memory/` contents.
- Directories: `▶` / `▼` toggle, expand on click
- Files: `📄` icon, open on click
- Active row: accent-light bg, rose text
- Depth indent: `depth * 14px + 6px` left padding

### `MainPane`
Right content area (flex: 1, overflow-y auto, 32px 44px padding).
Two states:
- `OpenState` — centered empty state with icon, label, (no open button — project already selected)
- `ContentPane` — `BreadcrumbBar` + `ContentArea`

### `BreadcrumbBar`
Path segments separated by `›`. Last segment bold/text color, others muted.
Prefixed with "memory".

### `ContentArea`
Renders one of:
- `MarkdownView` — for `.md` files
- `DirListing` — for directories
- Error/empty message

### `MarkdownView`
`<div className="md-body">` with parsed HTML from `MD.parse()`.
Intercepts `[data-mdlink]` clicks → calls `onNavigate`.
Applies `fadeUp` animation on mount.

### `DirListing`
`<h2>dirname/</h2>` + list of `DirEntry` cards.

### `DirEntry`
Card row: `📁` or `📄` + name. Hover: `translateY(-1px)` + shadow. Click → navigate.

## Shared

### `LogoMark`
28×28px rose square, "BS", 7px radius, white text, weight 800.

### `ModulePill`
Small uppercase badge. Hidden when no module active.
Background: accent-light. Text: accent. 10px font, 0.04em letter-spacing.
