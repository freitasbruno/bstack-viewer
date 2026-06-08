import express from 'express'
import { join, dirname } from 'path'
import { existsSync } from 'fs'
import { readdir, readFile } from 'fs/promises'
import { execSync } from 'child_process'
import { randomUUID } from 'crypto'
import { readProjects, writeProjects } from './db'

const app = express()
app.use(express.json())

// Serve built frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, '../dist')))
}

// ── Projects ──────────────────────────────────────────────────────────────────

app.get('/api/projects', (_req, res) => {
  res.json(readProjects())
})

app.post('/api/projects', (req, res) => {
  const { rootPath } = req.body as { rootPath: string }
  if (!rootPath?.trim()) {
    return res.status(400).json({ error: 'Path is required.' })
  }

  const memoryPath = join(rootPath, '.claude', 'memory')
  if (!existsSync(memoryPath)) {
    return res.status(400).json({ error: 'No .claude/memory/ folder found in that directory.' })
  }

  const projects = readProjects()
  if (projects.some((p) => p.rootPath === rootPath)) {
    return res.status(400).json({ error: 'This project is already in your list.' })
  }

  const project = {
    id: randomUUID(),
    name: rootPath.split(/[\\/]/).pop() ?? rootPath,
    rootPath,
    lastOpened: null as string | null
  }
  writeProjects([...projects, project])
  res.json(project)
})

app.delete('/api/projects/:id', (req, res) => {
  writeProjects(readProjects().filter((p) => p.id !== req.params.id))
  res.json({ ok: true })
})

app.patch('/api/projects/:id/lastOpened', (req, res) => {
  const now = new Date().toISOString()
  writeProjects(readProjects().map((p) => (p.id === req.params.id ? { ...p, lastOpened: now } : p)))
  res.json({ ok: true })
})

app.patch('/api/projects/:id', (req, res) => {
  const { coverTheme, coverEmoji } = req.body as { coverTheme?: string; coverEmoji?: string }
  writeProjects(
    readProjects().map((p) =>
      p.id === req.params.id
        ? {
            ...p,
            ...(coverTheme !== undefined && { coverTheme }),
            ...(coverEmoji !== undefined && { coverEmoji })
          }
        : p
    )
  )
  res.json({ ok: true })
})

// ── Filesystem browsing ───────────────────────────────────────────────────────

app.get('/api/fs/roots', (_req, res) => {
  if (process.platform === 'win32') {
    try {
      const out = execSync('wmic logicaldisk get name', { encoding: 'utf-8' })
      const drives = out
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => /^[A-Z]:$/.test(l))
        .map((l) => l + '\\')
      return res.json(drives.length ? drives : ['C:\\'])
    } catch {
      return res.json(['C:\\', 'D:\\'])
    }
  }
  res.json(['/'])
})

app.get('/api/fs/browse', async (req, res) => {
  const absPath = req.query.path as string
  if (!absPath) return res.status(400).json({ error: 'path required' })
  try {
    const entries = await readdir(absPath, { withFileTypes: true })
    res.json(
      entries
        .filter((e) => e.isDirectory())
        .map((e) => ({ name: e.name, path: join(absPath, e.name) }))
        .sort((a, b) => a.name.localeCompare(b.name))
    )
  } catch {
    res.status(404).json({ error: 'Cannot read directory' })
  }
})

// ── Mockup preview (serves HTML file with base-tag injection + asset proxy) ───

const MIME: Record<string, string> = {
  css: 'text/css', js: 'application/javascript',
  png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg',
  gif: 'image/gif', svg: 'image/svg+xml', webp: 'image/webp',
  woff: 'font/woff', woff2: 'font/woff2', ttf: 'font/ttf',
  ico: 'image/x-icon', json: 'application/json', html: 'text/html'
}

async function serveFile(filePath: string, res: express.Response): Promise<void> {
  const ext = filePath.split('.').pop()?.toLowerCase() ?? ''
  const data = await readFile(filePath)
  res.setHeader('Content-Type', MIME[ext] ?? 'application/octet-stream')
  res.send(data)
}

app.get('/api/fs/preview', async (req, res) => {
  const filePath = req.query.path as string
  if (!filePath) return res.status(400).send('path required')
  try {
    let content = await readFile(filePath, 'utf-8')

    // Detect project root (parent of .claude/)
    const normalized = filePath.replace(/\\/g, '/')
    const dotClaudeIdx = normalized.indexOf('/.claude/')
    const projectRoot = dotClaudeIdx > 0 ? filePath.slice(0, dotClaudeIdx) : dirname(filePath)
    const encodedRoot = Buffer.from(projectRoot).toString('base64url')

    // Virtual serving path: strip .claude/memory/ so mockups authored with ../public/
    // correctly reach <projectRoot>/public/ rather than <projectRoot>/.claude/memory/public/
    const relDir = normalized
      .slice(dotClaudeIdx + 1, normalized.lastIndexOf('/'))
      .replace(/^\.claude\/memory\//, '')

    // Rewrite absolute paths (/foo) first — before injecting base tag to avoid double-rewriting
    content = content.replace(
      /((?:src|href|action)=["'])\/(?![/]|http|data:)/gi,
      `$1/api/fs/preview-root/${encodedRoot}/`
    )

    // Base href: <projectRoot>/<relDir>/ so ../public/ reaches <projectRoot>/public/
    const baseHref = `/api/fs/preview-root/${encodedRoot}/${relDir}/`
    content = content.replace(/(<head[^>]*>)/i, `$1<base href="${baseHref}">`)

    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.send(content)
  } catch {
    res.status(404).send('File not found')
  }
})

// Serves all mockup assets — relPath is resolved from the project root.
// Fallback: also tries <root>/.claude/memory/<relPath> so same-directory files
// (CSS, JS) still resolve even though base href is shifted up to project root level.
app.get('/api/fs/preview-root/:encodedRoot/:relPath(*)', async (req, res) => {
  const root = Buffer.from(req.params.encodedRoot, 'base64url').toString()
  const relPath = req.params.relPath
  const candidates = [
    join(root, relPath),
    join(root, '.claude', 'memory', relPath)
  ]
  for (const candidate of candidates) {
    try {
      await serveFile(candidate, res)
      return
    } catch {
      // try next candidate
    }
  }
  res.status(404).send('Asset not found')
})

// ── Filesystem ────────────────────────────────────────────────────────────────

app.get('/api/fs/dir', async (req, res) => {
  const absPath = req.query.path as string
  if (!absPath) return res.status(400).json({ error: 'path required' })
  try {
    const entries = await readdir(absPath, { withFileTypes: true })
    res.json(
      entries
        .map((e) => ({ name: e.name, kind: e.isDirectory() ? 'directory' : 'file' } as const))
        .sort((a, b) => {
          if (a.kind !== b.kind) return a.kind === 'directory' ? -1 : 1
          return a.name.localeCompare(b.name)
        })
    )
  } catch {
    res.status(404).json({ error: 'Cannot read directory' })
  }
})

app.get('/api/fs/file', async (req, res) => {
  const absPath = req.query.path as string
  if (!absPath) return res.status(400).json({ error: 'path required' })
  try {
    res.json({ content: await readFile(absPath, 'utf-8') })
  } catch {
    res.status(404).json({ error: 'Cannot read file' })
  }
})

// In production, serve index.html for all non-API routes
if (process.env.NODE_ENV === 'production') {
  app.get('*', (_req, res) => {
    res.sendFile(join(__dirname, '../dist/index.html'))
  })
}

const port = Number(process.env.PORT ?? 3001)
app.listen(port, () => {
  console.log(`BStack Memory Viewer API running at http://localhost:${port}`)
})
