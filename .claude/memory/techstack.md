# Tech Stack

## Runtime
- **Node.js** — backend API server (Express)
- **Browser** — renderer (standard web app, opened at localhost:5173)

## Frontend
- **React 18** — UI framework
- **Vite 5** — dev server + bundler (`vite.config.mts` — must be `.mts`, `@tailwindcss/vite` is ESM-only)
- **Tailwind CSS v4** — utility classes via `@tailwindcss/vite` plugin
- **React Router v6** — `MemoryRouter` (no server-side routing needed)

## Backend
- **Express 4** — REST API at port 3001
- **JSON file persistence** — project list stored at `~/.bstack-viewer/projects.json` (no database)
- **tsx** — runs TypeScript server directly in dev (`tsx watch server/index.ts`)

## Key dependencies
- **mermaid** — renders `\`\`\`mermaid` fenced blocks as inline SVG in MarkdownView
- **concurrently** — runs dev:server and dev:client in parallel

## Fonts (bundled via npm, not Google Fonts)
- **`@fontsource/inter`** — UI text (weights: 400, 500, 600, 700)
- **`@fontsource/jetbrains-mono`** — code blocks (weights: 400, 500)

## Design tokens
```
--accent:       #f43f5e   (rose)
--accent-light: #fff1f2
--bg:           #f5f0e8   (warm cream)
--card-bg:      #fdfaf4
--border:       #e3d9c8
--text:         #1e293b
--muted:        #7c7264
--sidebar-w:    252px
--header-h:     52px
```
Paper grain overlay: SVG fractalNoise at 6% opacity, fixed, full-bleed, z-index 0.
fadeUp animation: `from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:none }` — 0.2s ease.

## Not used
- No Electron (migrated away — too hard to debug visually)
- No SQLite (JSON file sufficient for a handful of projects)
- No CSS framework beyond Tailwind
- No external markdown library (custom inline renderer in `src/renderer/src/utils/md.ts`)
- No state management library (React context + useState sufficient)
