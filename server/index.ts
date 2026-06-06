import express from 'express'
import { join } from 'path'
import { existsSync } from 'fs'
import { readdir, readFile } from 'fs/promises'
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
