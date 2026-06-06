# Scaffold — electron-vite + React project setup

## Goal
Bootstrap the Electron + React + Vite project structure so all subsequent features build on a clean foundation.

## Scope
- Init electron-vite project (React template)
- Configure electron-builder for Windows x64
- Install electron-store
- Wire up IPC bridge in preload (expose `projects` API surface)
- Apply global CSS design tokens and paper grain overlay
- Load Inter + JetBrains Mono fonts
- Confirm `npm run dev` launches the app window

## Out of scope
- No actual UI beyond a blank window confirming the stack works
- No business logic

## Acceptance
- `npm run dev` opens an Electron window
- Window shows warm cream background (#f5f0e8)
- No console errors
