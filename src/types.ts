export interface Project {
  id: string
  name: string
  rootPath: string
  lastOpened: string | null
}

export interface DirEntry {
  name: string
  kind: 'file' | 'directory'
}

