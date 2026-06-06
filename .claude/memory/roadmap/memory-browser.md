# Memory Browser — per-project file browser

## Goal
The main viewing experience: sidebar file tree + main content pane for a single open project, matching the HTML reference UX exactly.

## Scope
- Header: logo mark, "BStack Memory" title, breadcrumb path, module pill, refresh button, back-to-hub button
- Sidebar: Quick Links section + Files section (expandable file tree of `.claude/memory/`)
- Main pane: empty/prompt state → file/dir content when something is selected
- Breadcrumb navigation
- Quick Links: Roadmap, WIP, Notes, Known Bugs, Tech Debt (fixed shortcuts into memory/)
- File tree: directories expand/collapse, files open in main pane
- Directory view: card listing of directory contents
- Relative link navigation (clicking `[text](../path.md)` in rendered markdown navigates within the app)
- Refresh button: re-reads current file/dir from disk

## File system access
- All file reads go through IPC to main process (no renderer-side `fs`)
- Main exposes: `readDir(absPath)`, `readFile(absPath)` via preload bridge

## Module dispatch
Dispatch order: MockupRenderer → SchemaVisualizer → MarkdownRenderer
Both MockupRenderer and SchemaVisualizer fall back to MarkdownRenderer in Phase 1.
Active renderer: MarkdownRenderer (handles all `.md` files).

## Acceptance
- Opening a project shows its memory/ tree in the sidebar
- Clicking a file renders its content in the main pane
- Quick Links navigate to the correct files/dirs
- Breadcrumb updates on navigation
- Module pill shows renderer name
- Refresh re-reads the current file
- Back button returns to project hub
