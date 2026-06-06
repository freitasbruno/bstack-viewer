# scaffold
Bootstrap electron-vite + React + TypeScript project with Tailwind CSS v4, React Router, IPC bridge skeleton, and design tokens.

## Status
verifying

## Requirements
- Init with electron-vite React + TypeScript template
- Install: electron-store@8, tailwindcss v4, react-router-dom v6
- Global CSS: design tokens as CSS custom properties, Inter + JetBrains Mono, paper grain overlay
- Preload: contextBridge exposes `window.api` with correct TypeScript types (.d.ts)
- Main: electron-store instance, empty ipcMain handler stubs
- Shared types: `Project` interface in `src/types.ts`
- Window: 1280×800, min 960×640, title "BStack Memory Viewer"
- `MemoryRouter` + `Routes` wired in `App.tsx` (two stub routes)

## Design reference
none

## Technical decisions
- electron-store@8 (CJS, compatible with Electron main process)
- Tailwind v4 CSS custom property approach for design tokens
- MemoryRouter for Electron (no server, no URL bar)
- window.api types in `src/renderer/src/env.d.ts`
- If Tailwind v4 has vite plugin issues, fall back to v3

## Test plan

### Automated
none

### Human verification required
- [ ] `npm run dev` opens Electron window — no console errors
- [ ] Window background is warm cream (#f5f0e8)
- [ ] Window title is "BStack Memory Viewer"

## Open issues
none

## Session log
- 2026-06-06 Plan approved
