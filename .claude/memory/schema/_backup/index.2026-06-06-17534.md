# Schema Index

No database. All persistence uses **electron-store** (JSON file in app data).

## Store: projects

Managed by main process. Exposed to renderer via IPC.

```ts
type Project = {
  id: string;        // uuid — generated on add
  name: string;      // display name, inferred from folder name or user-provided
  rootPath: string;  // absolute path to project root (parent of .claude/)
  lastOpened: string | null;  // ISO timestamp
}

type Store = {
  projects: Project[]
}
```

### Rules
- `rootPath` must point to a directory that contains `.claude/memory/`
- `id` is stable — never regenerate for an existing project
- `lastOpened` is updated each time the user opens the project

## Future (not Phase 1)
- Per-project settings (e.g. custom quick links)
- Window state persistence (size, last active project)
