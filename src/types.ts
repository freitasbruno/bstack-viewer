export interface Project {
  id: string
  name: string
  rootPath: string
  lastOpened: string | null
  coverTheme?: string
  coverEmoji?: string
}

export interface DirEntry {
  name: string
  kind: 'file' | 'directory'
}

