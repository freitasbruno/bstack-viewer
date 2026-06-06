import { join } from 'path'
import { homedir } from 'os'
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'fs'
import type { Project } from '../src/types'

const dataDir = join(homedir(), '.bstack-viewer')
const dataFile = join(dataDir, 'projects.json')

mkdirSync(dataDir, { recursive: true })
if (!existsSync(dataFile)) writeFileSync(dataFile, '[]', 'utf-8')

export function readProjects(): Project[] {
  try {
    return JSON.parse(readFileSync(dataFile, 'utf-8'))
  } catch {
    return []
  }
}

export function writeProjects(projects: Project[]): void {
  writeFileSync(dataFile, JSON.stringify(projects, null, 2), 'utf-8')
}
