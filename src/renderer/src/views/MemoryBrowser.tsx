import { useState, useCallback, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { winJoin, memoryRoot as getMemoryRoot } from '../utils/paths'
import { readDir, readFile, setLastOpened } from '../api'
import AppHeader from '../components/AppHeader'
import Sidebar from '../components/Sidebar'
import BreadcrumbBar from '../components/BreadcrumbBar'
import MarkdownView from '../components/MarkdownView'
import DirListing from '../components/DirListing'
import { ModuleRegistry } from '../utils/moduleRegistry'
import { useProjects } from '../context/ProjectsContext'
import type { DirEntry } from '../../../types'

type ContentState =
  | { type: 'empty' }
  | { type: 'loading' }
  | { type: 'markdown'; content: string; moduleName: string }
  | { type: 'dir'; entries: DirEntry[]; name: string }
  | { type: 'error'; message: string }

function resolveRelPath(current: string[], relPath: string): string[] {
  const base = current.length > 1 ? current.slice(0, -1) : []
  const resolved: string[] = []
  for (const seg of [...base, ...relPath.split('/')]) {
    if (seg === '..') resolved.pop()
    else if (seg && seg !== '.') resolved.push(seg)
  }
  return resolved
}

export default function MemoryBrowser(): JSX.Element {
  const { projectId } = useParams<{ projectId: string }>()
  const { projects } = useProjects()
  const project = projects.find((p) => p.id === projectId)

  const [currentPath, setCurrentPath] = useState<string[]>([])
  const [isDir, setIsDir] = useState(false)
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set())
  const [content, setContent] = useState<ContentState>({ type: 'empty' })

  const memoryRoot = project ? getMemoryRoot(project.rootPath) : ''

  const navigate = useCallback(
    async (path: string[], dir: boolean) => {
      if (!memoryRoot) return
      setCurrentPath(path)
      setIsDir(dir)
      setContent({ type: 'loading' })

      const absPath = path.length > 0 ? winJoin(memoryRoot, ...path) : memoryRoot

      try {
        if (dir) {
          const entries = await readDir(absPath)
          setContent({
            type: 'dir',
            entries,
            name: path.length > 0 ? path[path.length - 1] : 'memory'
          })
        } else {
          const fileName = path[path.length - 1] ?? ''
          const relPath = path.join('/')
          const mod = ModuleRegistry.dispatch(fileName, relPath)
          const text = await readFile(absPath)
          setContent({ type: 'markdown', content: text, moduleName: mod.name })
        }
      } catch {
        setContent({ type: 'error', message: `Could not read: ${path.join('/')}` })
      }
    },
    [memoryRoot]
  )

  const handleToggleDir = useCallback((key: string) => {
    setExpandedDirs((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }, [])

  const handleRelNav = useCallback(
    (relPath: string) => {
      const resolved = resolveRelPath(currentPath, relPath)
      navigate(resolved, false)
    },
    [currentPath, navigate]
  )

  const handleRefresh = useCallback(() => {
    navigate(currentPath, isDir)
  }, [currentPath, isDir, navigate])

  useEffect(() => {
    if (project?.id) setLastOpened(project.id)
  }, [project?.id])

  const activeKey = currentPath.join('/')
  const moduleName = content.type === 'markdown' ? content.moduleName : undefined

  if (!project) {
    return (
      <div className="flex h-full items-center justify-center" style={{ background: 'var(--bg)' }}>
        <p style={{ color: 'var(--muted)' }} className="text-sm">
          Project not found.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <AppHeader
        showProject
        pathParts={currentPath}
        moduleName={moduleName}
        onRefresh={handleRefresh}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          memoryRoot={memoryRoot}
          activeKey={activeKey}
          expandedDirs={expandedDirs}
          onToggleDir={handleToggleDir}
          onNavigate={navigate}
        />
        <main
          className="flex-1 overflow-y-auto"
          style={{ padding: '32px 44px', background: 'var(--bg)' }}
        >
          {content.type === 'empty' && (
            <div className="flex flex-col items-center justify-center h-full gap-3.5 text-center">
              <span style={{ fontSize: 44, opacity: 0.4 }}>🗂</span>
              <p className="text-sm max-w-[260px] leading-relaxed" style={{ color: 'var(--muted)' }}>
                Select a file from the sidebar to view it here.
              </p>
            </div>
          )}

          {content.type === 'loading' && (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm" style={{ color: 'var(--muted)' }}>
                Loading…
              </p>
            </div>
          )}

          {(content.type === 'markdown' || content.type === 'dir' || content.type === 'error') && (
            <>
              <BreadcrumbBar parts={currentPath} />
              {content.type === 'markdown' && (
                <MarkdownView content={content.content} onNavigate={handleRelNav} />
              )}
              {content.type === 'dir' && (
                <DirListing
                  name={content.name}
                  entries={content.entries}
                  basePath={currentPath}
                  onNavigate={navigate}
                />
              )}
              {content.type === 'error' && (
                <p className="text-[13.5px]" style={{ color: 'var(--muted)' }}>
                  {content.message}
                </p>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
