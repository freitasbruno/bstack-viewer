import QuickLinks from './QuickLinks'
import FileTree from './FileTree'

interface Props {
  projectName: string
  memoryRoot: string
  activeKey: string
  expandedDirs: Set<string>
  onToggleDir: (key: string) => void
  onNavigate: (path: string[], isDir: boolean) => void
}

export default function Sidebar({
  projectName,
  memoryRoot,
  activeKey,
  expandedDirs,
  onToggleDir,
  onNavigate
}: Props): JSX.Element {
  return (
    <aside
      className="flex flex-col overflow-y-auto flex-shrink-0"
      style={{
        width: 'var(--sidebar-w)',
        background: 'var(--card-bg)',
        borderRight: '1px solid var(--border)'
      }}
    >
      {/* Project name header */}
      <div
        style={{
          padding: '14px 16px 12px',
          borderBottom: '1px solid var(--border)',
          flexShrink: 0
        }}
      >
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 14, flexShrink: 0 }}>📁</span>
          <span
            className="text-sm font-semibold truncate"
            style={{ color: 'var(--text)' }}
            title={projectName}
          >
            {projectName}
          </span>
        </div>
      </div>
      <div style={{ padding: '16px 12px 12px' }}>
        <div
          className="text-[10px] font-bold uppercase"
          style={{ letterSpacing: '0.08em', color: 'var(--muted)', marginBottom: 8, paddingLeft: 6 }}
        >
          Quick Links
        </div>
        <QuickLinks
          activeKey={activeKey}
          onNavigate={onNavigate}
        />
      </div>

      <div style={{ padding: '16px 12px 24px', flex: 1, borderTop: '1px solid var(--border)' }}>
        <div
          className="text-[10px] font-bold uppercase"
          style={{ letterSpacing: '0.08em', color: 'var(--muted)', marginBottom: 8, paddingLeft: 6 }}
        >
          Files
        </div>
        <FileTree
          memoryRoot={memoryRoot}
          activeKey={activeKey}
          expandedDirs={expandedDirs}
          onToggleDir={onToggleDir}
          onFileClick={(path) => onNavigate(path, false)}
        />
      </div>
    </aside>
  )
}
