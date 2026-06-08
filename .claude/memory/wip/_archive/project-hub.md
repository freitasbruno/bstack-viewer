# project-hub
Multi-project home screen: list, add, remove, and open BStack projects.

## Status
verifying

## Requirements
- Route: /
- ProjectHub: grid of ProjectCards + add button
- ProjectCard: name, root path, last opened; remove on hover; click → navigate('/project/:id')
- Add: triggers window.api.projects.add() → native folder picker in main → validate .claude/memory/ exists → save to store
- Remove: window.api.projects.remove(id) — no file system changes
- Empty state when projects.length === 0
- Project list persists across restarts (electron-store)
- setLastOpened called when opening a project

## Design reference
.claude/memory-viewer.html — design system reference for card style

## Technical decisions
- IPC handlers: projects:list, projects:add (includes dialog.showOpenDialog), projects:remove, projects:setLastOpened
- Validation: reject folders without .claude/memory/ — return { error: string }
- App top-level state: activeProject passed down to MemoryBrowser via route or context

## Test plan

### Automated
none

### Human verification required
- [ ] Add a valid BStack project → appears in list
- [ ] Add a non-BStack folder → shows validation error, not added
- [ ] Click project → opens memory browser
- [ ] Back button → returns to hub, project still listed
- [ ] Remove project → removed from list
- [ ] Restart app → project list persists

## Open issues
none

## Session log
- 2026-06-06 Plan approved
