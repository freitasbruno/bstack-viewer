# memory-browser
Per-project memory file browser: sidebar file tree + main content pane, full IPC file system access.

## Status
verifying

## Requirements
- Route: /project/:projectId
- AppHeader: logo mark, title, breadcrumb path, module pill, refresh button, back-to-hub button
- Sidebar: QuickLinks (5 fixed) + FileTree (recursive expand/collapse)
- MainPane: MarkdownView for .md files, DirListing for directories, empty state when nothing selected
- Navigation state owned by MemoryBrowser: currentPath[], isDir, expandedDirs Set
- All navigation through single navigate() function (keeps breadcrumb + active highlights in sync)
- Module dispatch: MockupRenderer → SchemaVisualizer → MarkdownRenderer (first two fall back to markdown in Phase 1)
- Relative link navigation inside rendered markdown
- Refresh re-reads current file/dir from disk

## Design reference
.claude/memory-viewer.html — full UI reference

## Technical decisions
- IPC handlers: fs:readDir (returns {name, kind}[]), fs:readFile (returns string)
- resolveMemoryPath(rootPath, segments) in main process — renderer passes relative segments only
- Dirs sorted before files, both alphabetical
- FileTree depth indent: depth * 14px + 6px left padding (CSS var --d)

## Test plan

### Automated
none

### Human verification required
- [ ] Open a BStack project → memory/ tree renders in sidebar
- [ ] Click a .md file → renders in main pane with correct styling
- [ ] Click a directory → shows DirListing with card entries
- [ ] Quick Links navigate to correct files/dirs
- [ ] Breadcrumb updates on every navigation
- [ ] Module pill shows renderer name
- [ ] Relative link in markdown navigates within app
- [ ] Refresh re-reads current file
- [ ] Back button returns to hub (/)

## Open issues
none

## Session log
- 2026-06-06 Plan approved
