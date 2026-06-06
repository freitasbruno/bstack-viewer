# Schema Index

No database. All persistence uses a **JSON file** at `~/.bstack-viewer/projects.json`.

## Data model: Project

```ts
type Project = {
  id: string          // uuid — generated on add
  name: string        // display name, inferred from folder name
  rootPath: string    // absolute path to project root (parent of .claude/)
  lastOpened: string | null  // ISO timestamp
  coverTheme?: string // one of the THEMES ids in ProjectHub.tsx
  coverEmoji?: string // optional emoji shown on card banner
}
```

### Rules
- `rootPath` must point to a directory that contains `.claude/memory/`
- `id` is stable — never regenerate for an existing project
- `lastOpened` is updated each time the user opens the project
- `coverTheme` falls back to auto-assignment (hash of project name) when absent

## Architecture overview

```mermaid
flowchart LR
    subgraph Browser ["Browser (port 5173)"]
        PH["ProjectHub\n(card grid)"]
        MB["MemoryBrowser\n(sidebar + content)"]
    end

    subgraph Server ["Express (port 3001)"]
        API["/api/projects\n/api/fs/*"]
        DB["~/.bstack-viewer\n/projects.json"]
        FS["Local filesystem\n.claude/memory/"]
    end

    PH -->|"fetch POST /api/projects"| API
    MB -->|"fetch GET /api/fs/file"| API
    API --> DB
    API --> FS
```

## Content dispatch

```mermaid
flowchart TD
    Click["User clicks file"] --> Dispatch["ModuleRegistry.dispatch(fileName, relPath)"]
    Dispatch -->|".html file"| Mockup["MockupView\n(sandboxed iframe)"]
    Dispatch -->|"schema/*.md"| Schema["MarkdownView\n(badge: Schema)"]
    Dispatch -->|"*.md fallback"| Markdown["MarkdownView\n(badge: Markdown)"]
    Markdown -->|"contains lang-mermaid"| Mermaid["mermaid.render()\n→ inline SVG"]
```

## Future
- Per-project settings (custom quick links)
- Window state persistence (last active project)
