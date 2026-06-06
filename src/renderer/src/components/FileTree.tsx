import { useState, useEffect } from 'react'
import type { DirEntry } from '../../../types'
import { readDir } from '../api'

interface TreeNode {
  name: string
  kind: 'file' | 'directory'
  path: string[]
}

interface Props {
  memoryRoot: string
  activeKey: string
  expandedDirs: Set<string>
  onToggleDir: (key: string) => void
  onFileClick: (path: string[]) => void
}

function TreeRow({
  node,
  depth,
  isActive,
  isOpen,
  onToggle,
  onClick
}: {
  node: TreeNode
  depth: number
  isActive: boolean
  isOpen?: boolean
  onToggle?: () => void
  onClick?: () => void
}): JSX.Element {
  const isDir = node.kind === 'directory'
  const paddingLeft = depth * 16 + 6

  return (
    <div
      onClick={isDir ? onToggle : onClick}
      className="flex items-center rounded-[5px] text-[12.5px] cursor-pointer select-none transition-colors"
      style={{
        gap: 6,
        paddingTop: 6,
        paddingBottom: 6,
        paddingLeft,
        paddingRight: 8,
        color: isActive ? 'var(--accent)' : 'var(--text)',
        background: isActive ? 'var(--accent-light)' : 'transparent',
        fontWeight: isActive ? 600 : 400
      }}
      onMouseEnter={(e) => {
        if (!isActive) e.currentTarget.style.background = 'var(--bg)'
      }}
      onMouseLeave={(e) => {
        if (!isActive) e.currentTarget.style.background = 'transparent'
      }}
    >
      <span
        className="w-3.5 flex-shrink-0 text-[11px]"
        style={{ color: isActive ? 'var(--accent)' : 'var(--muted)' }}
      >
        {isDir ? (isOpen ? '▼' : '▶') : '📄'}
      </span>
      <span>{node.name}</span>
    </div>
  )
}

function DirectoryNode({
  node,
  depth,
  memoryRoot,
  activeKey,
  expandedDirs,
  onToggleDir,
  onFileClick
}: {
  node: TreeNode
  depth: number
  memoryRoot: string
  activeKey: string
  expandedDirs: Set<string>
  onToggleDir: (key: string) => void
  onFileClick: (path: string[]) => void
}): JSX.Element {
  const key = node.path.join('/')
  const isOpen = expandedDirs.has(key)
  const [children, setChildren] = useState<DirEntry[]>([])

  useEffect(() => {
    if (!isOpen) return
    const absPath = [memoryRoot, ...node.path].join('\\')
    readDir(absPath).then(setChildren).catch(() => setChildren([]))
  }, [isOpen, memoryRoot, key])

  return (
    <>
      <TreeRow
        node={node}
        depth={depth}
        isActive={false}
        isOpen={isOpen}
        onToggle={() => onToggleDir(key)}
      />
      {isOpen &&
        children.map((child) =>
          child.kind === 'directory' ? (
            <DirectoryNode
              key={child.name}
              node={{ name: child.name, kind: 'directory', path: [...node.path, child.name] }}
              depth={depth + 1}
              memoryRoot={memoryRoot}
              activeKey={activeKey}
              expandedDirs={expandedDirs}
              onToggleDir={onToggleDir}
              onFileClick={onFileClick}
            />
          ) : (
            <TreeRow
              key={child.name}
              node={{ name: child.name, kind: 'file', path: [...node.path, child.name] }}
              depth={depth + 1}
              isActive={activeKey === [...node.path, child.name].join('/')}
              onClick={() => onFileClick([...node.path, child.name])}
            />
          )
        )}
    </>
  )
}

export default function FileTree({
  memoryRoot,
  activeKey,
  expandedDirs,
  onToggleDir,
  onFileClick
}: Props): JSX.Element {
  const [roots, setRoots] = useState<DirEntry[]>([])

  useEffect(() => {
    readDir(memoryRoot).then(setRoots).catch(() => setRoots([]))
  }, [memoryRoot])

  return (
    <div>
      {roots.map((entry) =>
        entry.kind === 'directory' ? (
          <DirectoryNode
            key={entry.name}
            node={{ name: entry.name, kind: 'directory', path: [entry.name] }}
            depth={0}
            memoryRoot={memoryRoot}
            activeKey={activeKey}
            expandedDirs={expandedDirs}
            onToggleDir={onToggleDir}
            onFileClick={onFileClick}
          />
        ) : (
          <TreeRow
            key={entry.name}
            node={{ name: entry.name, kind: 'file', path: [entry.name] }}
            depth={0}
            isActive={activeKey === entry.name}
            onClick={() => onFileClick([entry.name])}
          />
        )
      )}
    </div>
  )
}
