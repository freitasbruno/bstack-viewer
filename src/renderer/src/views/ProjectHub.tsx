import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppHeader from '../components/AppHeader'
import { useProjects } from '../context/ProjectsContext'
import { addProject, removeProject } from '../api'
import type { Project } from '../../../types'

function formatDate(iso: string | null): string {
  if (!iso) return 'Never opened'
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

function ProjectRow({
  project,
  onOpen,
  onRemove
}: {
  project: Project
  onOpen: () => void
  onRemove: (e: React.MouseEvent) => void
}): JSX.Element {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onClick={onOpen}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex items-center gap-3 cursor-pointer transition-all"
      style={{
        padding: '12px 16px',
        background: 'var(--card-bg)',
        border: '1px solid var(--border)',
        borderRadius: 8,
        transform: hovered ? 'translateY(-1px)' : 'none',
        boxShadow: hovered ? '0 4px 12px -2px rgba(80,55,20,0.1)' : 'none'
      }}
    >
      <span style={{ fontSize: 15, flexShrink: 0 }}>📁</span>
      <div className="flex-1 min-w-0">
        <div
          className="text-sm font-semibold leading-tight mb-0.5 truncate"
          style={{ color: 'var(--text)' }}
        >
          {project.name}
        </div>
        <div
          className="text-[11px] truncate"
          style={{ color: 'var(--muted)', fontFamily: "'JetBrains Mono', monospace" }}
          title={project.rootPath}
        >
          {project.rootPath}
        </div>
      </div>
      <div className="text-[11px] flex-shrink-0 ml-4" style={{ color: 'var(--muted)' }}>
        {formatDate(project.lastOpened)}
      </div>
      {hovered && (
        <button
          onClick={onRemove}
          className="flex-shrink-0 text-[11px] px-2 py-0.5 rounded-md ml-2"
          style={{
            background: 'var(--accent-light)',
            color: 'var(--accent)',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'inherit'
          }}
        >
          Remove
        </button>
      )}
    </div>
  )
}

function AddProjectForm({
  onAdded,
  onCancel,
  compact = false
}: {
  onAdded: () => void
  onCancel?: () => void
  compact?: boolean
}): JSX.Element {
  const [path, setPath] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    if (!path.trim()) return
    setError(null)
    setLoading(true)
    try {
      const result = await addProject(path.trim())
      if (result.error) {
        setError(result.error)
      } else {
        setPath('')
        onAdded()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex gap-2 items-center">
        <input
          autoFocus
          value={path}
          onChange={(e) => setPath(e.target.value)}
          placeholder="D:\path\to\project"
          className="flex-1 text-sm rounded-md"
          style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border)',
            color: 'var(--text)',
            padding: '7px 12px',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            outline: 'none',
            minWidth: 0
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
          onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
        />
        <button
          type="submit"
          disabled={loading || !path.trim()}
          style={{
            background: 'var(--accent)',
            color: 'white',
            border: 'none',
            borderRadius: 7,
            padding: compact ? '7px 14px' : '8px 18px',
            fontSize: 13,
            fontWeight: 600,
            cursor: loading || !path.trim() ? 'default' : 'pointer',
            opacity: loading || !path.trim() ? 0.6 : 1,
            fontFamily: 'inherit',
            flexShrink: 0
          }}
        >
          Add
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            style={{
              background: 'none',
              border: '1px solid var(--border)',
              color: 'var(--muted)',
              borderRadius: 7,
              padding: compact ? '7px 12px' : '8px 14px',
              fontSize: 13,
              cursor: 'pointer',
              fontFamily: 'inherit',
              flexShrink: 0
            }}
          >
            Cancel
          </button>
        )}
      </div>
      {error && (
        <p className="text-xs mt-2" style={{ color: 'var(--accent)' }}>
          {error}
        </p>
      )}
    </form>
  )
}

export default function ProjectHub(): JSX.Element {
  const navigate = useNavigate()
  const { projects, reload } = useProjects()
  const [adding, setAdding] = useState(false)

  const handleRemove = async (e: React.MouseEvent, id: string): Promise<void> => {
    e.stopPropagation()
    await removeProject(id)
    await reload()
  }

  const handleOpen = (project: Project): void => {
    navigate(`/project/${project.id}`)
  }

  return (
    <div className="flex flex-col h-full">
      <AppHeader />

      <main
        className="flex-1 overflow-y-auto"
        style={{ padding: '32px 44px', background: 'var(--bg)' }}
      >
        {projects.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center h-full gap-4 text-center"
            style={{ paddingBottom: 60 }}
          >
            <div style={{ fontSize: 44, opacity: 0.4 }}>🗂</div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)', maxWidth: 280 }}>
              Add a BStack project folder to browse its memory files.
            </p>
            <div style={{ width: '100%', maxWidth: 420 }}>
              <AddProjectForm onAdded={reload} />
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>
                Projects
              </h2>
              {!adding && (
                <button
                  onClick={() => setAdding(true)}
                  className="flex items-center gap-1.5 rounded-md text-xs font-medium"
                  style={{
                    background: 'none',
                    border: '1px solid var(--border)',
                    color: 'var(--muted)',
                    padding: '5px 11px',
                    cursor: 'pointer',
                    fontFamily: 'inherit'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent)'
                    e.currentTarget.style.color = 'var(--accent)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)'
                    e.currentTarget.style.color = 'var(--muted)'
                  }}
                >
                  + Add project
                </button>
              )}
            </div>

            {adding && (
              <div
                className="mb-4 p-3 rounded-lg"
                style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}
              >
                <AddProjectForm
                  compact
                  onAdded={async () => {
                    await reload()
                    setAdding(false)
                  }}
                  onCancel={() => setAdding(false)}
                />
              </div>
            )}

            <div className="flex flex-col gap-2">
              {projects.map((p) => (
                <ProjectRow
                  key={p.id}
                  project={p}
                  onOpen={() => handleOpen(p)}
                  onRemove={(e) => handleRemove(e, p.id)}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
