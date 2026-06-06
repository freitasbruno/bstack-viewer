# Environments

## Development
- **API server**: `npm run dev:server` — runs `tsx watch server/index.ts` on port 3001
- **Frontend**: `npm run dev:client` — runs Vite dev server on port 5173
- **Both together**: `npm run dev` — uses concurrently
- Open: `http://localhost:5173`
- Vite proxies `/api/*` requests to `http://localhost:3001`

### Important
Always kill all node processes before restarting to avoid stale Vite module graphs.
Multiple running node processes cause the browser to get old cached code even after hard refresh.

## Production
- `npm run build` → Vite builds frontend to `dist/`
- `npm start` → `NODE_ENV=production tsx server/index.ts` (serves `dist/` + API)

## Data location
- Project list: `~/.bstack-viewer/projects.json` (created on first run)

## Repository
- GitHub: https://github.com/freitasbruno/bstack-viewer
- Branch strategy: `main` is the ship target

## No staging / no CI
Local developer tool — no deployment pipeline.
