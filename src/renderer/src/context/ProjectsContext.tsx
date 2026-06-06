import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { Project } from '../../../types'
import { listProjects } from '../api'

interface ProjectsContextValue {
  projects: Project[]
  reload: () => Promise<void>
}

const ProjectsContext = createContext<ProjectsContextValue | null>(null)

export function ProjectsProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [projects, setProjects] = useState<Project[]>([])

  const reload = useCallback(async () => {
    setProjects(await listProjects())
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  return <ProjectsContext.Provider value={{ projects, reload }}>{children}</ProjectsContext.Provider>
}

export function useProjects(): ProjectsContextValue {
  const ctx = useContext(ProjectsContext)
  if (!ctx) throw new Error('useProjects must be used inside ProjectsProvider')
  return ctx
}
