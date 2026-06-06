# Project Hub — multi-project home screen

## Goal
A home screen where the user manages their BStack project list and opens a project to browse its memory files.

## Scope
- List all saved projects (name, root path, last opened)
- Add project: native folder picker → validate `.claude/memory/` exists → save to electron-store
- Remove project: remove from list (does not touch the file system)
- Open project: navigate to memory browser view for that project
- Empty state when no projects added yet

## Data
- Reads/writes `projects[]` via IPC (main process → electron-store)
- See schema/index.md for Project shape

## UI reference
- Same design system as HTML reference (cream bg, card surfaces, rose accent)
- Project cards: name, path, last opened timestamp
- Add button opens native `dialog.showOpenDialog` (directory picker, main process)

## Acceptance
- Can add a project by selecting its root folder
- Validation: rejects folders without `.claude/memory/`
- Can remove a project from the list
- Can open a project → transitions to memory browser
- Project list persists across app restarts
