import type { Project, DirEntry } from '../../types'

export async function listProjects(): Promise<Project[]> {
  const r = await fetch('/api/projects')
  return r.json()
}

export async function addProject(rootPath: string): Promise<{ project?: Project; error?: string }> {
  const r = await fetch('/api/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rootPath })
  })
  const data = await r.json()
  if (!r.ok) return { error: data.error ?? 'Failed to add project' }
  return { project: data }
}

export async function removeProject(id: string): Promise<void> {
  await fetch(`/api/projects/${id}`, { method: 'DELETE' })
}

export async function setLastOpened(id: string): Promise<void> {
  await fetch(`/api/projects/${id}/lastOpened`, { method: 'PATCH' })
}

export async function readDir(absPath: string): Promise<DirEntry[]> {
  const r = await fetch(`/api/fs/dir?path=${encodeURIComponent(absPath)}`)
  if (!r.ok) return []
  return r.json()
}

export async function readFile(absPath: string): Promise<string> {
  const r = await fetch(`/api/fs/file?path=${encodeURIComponent(absPath)}`)
  const data = await r.json()
  return data.content ?? ''
}
