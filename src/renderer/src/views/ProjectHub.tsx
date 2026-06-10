import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppHeader from '../components/AppHeader'
import DirBrowser from '../components/DirBrowser'
import { useProjects } from '../context/ProjectsContext'
import { addProject, removeProject, updateProject } from '../api'
import type { Project } from '../../../types'

// ── Cover themes ──────────────────────────────────────────────────────────────

const THEMES = [
  { id: 'rose',    gradient: 'linear-gradient(135deg, #f43f5e 0%, #fb7185 100%)' },
  { id: 'amber',   gradient: 'linear-gradient(135deg, #d97706 0%, #fbbf24 100%)' },
  { id: 'sky',     gradient: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)' },
  { id: 'emerald', gradient: 'linear-gradient(135deg, #059669 0%, #34d399 100%)' },
  { id: 'violet',  gradient: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)' },
  { id: 'coral',   gradient: 'linear-gradient(135deg, #dc2626 0%, #fb923c 100%)' },
  { id: 'teal',    gradient: 'linear-gradient(135deg, #0d9488 0%, #22d3ee 100%)' },
  { id: 'slate',   gradient: 'linear-gradient(135deg, #475569 0%, #94a3b8 100%)' },
]

function hashName(s: string): number {
  let h = 0
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) & 0xffff
  return h
}

function getTheme(project: Project) {
  const id = project.coverTheme
  return THEMES.find((t) => t.id === id) ?? THEMES[hashName(project.name) % THEMES.length]
}

function nextTheme(project: Project): string {
  const current = getTheme(project)
  const idx = THEMES.findIndex((t) => t.id === current.id)
  return THEMES[(idx + 1) % THEMES.length].id
}

// ── Utilities ─────────────────────────────────────────────────────────────────

function formatDate(iso: string | null): string {
  if (!iso) return 'Never opened'
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

// ── ProjectCard ───────────────────────────────────────────────────────────────

function ProjectCard({
  project,
  onOpen,
  onRemove,
  onCoverChange
}: {
  project: Project
  onOpen: () => void
  onRemove: (e: React.MouseEvent) => void
  onCoverChange: () => void
}): JSX.Element {
  const [hovered, setHovered] = useState(false)
  const [bannerHovered, setBannerHovered] = useState(false)
  const [editingEmoji, setEditingEmoji] = useState(false)
  const [emojiInput, setEmojiInput] = useState(project.coverEmoji ?? '')
  const theme = getTheme(project)

  const handleEmojiSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    e.stopPropagation()
    await updateProject(project.id, { coverEmoji: emojiInput.trim() || undefined })
    setEditingEmoji(false)
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setBannerHovered(false) }}
      className="flex flex-col rounded-xl overflow-hidden cursor-pointer transition-all"
      style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--border)',
        transform: hovered ? 'translateY(-3px)' : 'none',
        boxShadow: hovered ? '0 8px 24px -4px rgba(80,55,20,0.14)' : '0 1px 3px rgba(80,55,20,0.06)',
        transition: 'transform 0.15s, box-shadow 0.15s'
      }}
    >
      {/* Cover banner */}
      <div
        className="relative flex items-center justify-center flex-shrink-0"
        style={{ height: 80, background: theme.gradient }}
        onMouseEnter={() => setBannerHovered(true)}
        onMouseLeave={() => setBannerHovered(false)}
        onClick={(e) => { e.stopPropagation(); onCoverChange() }}
        title="Click to change color"
      >
        {editingEmoji ? (
          <form onSubmit={handleEmojiSubmit} onClick={(e) => e.stopPropagation()}>
            <input
              autoFocus
              value={emojiInput}
              onChange={(e) => setEmojiInput(e.target.value)}
              onBlur={() => setEditingEmoji(false)}
              maxLength={2}
              className="text-center rounded"
              style={{
                width: 48, fontSize: 28, background: 'rgba(255,255,255,0.2)',
                border: '2px solid rgba(255,255,255,0.6)', color: 'white',
                outline: 'none', padding: '2px 4px'
              }}
            />
          </form>
        ) : (
          <span style={{ fontSize: 32, lineHeight: 1, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>
            {project.coverEmoji || '📁'}
          </span>
        )}

        {/* Banner actions (visible on hover) */}
        {bannerHovered && !editingEmoji && (
          <div
            className="absolute inset-0 flex items-center justify-end gap-1 px-3"
            style={{ background: 'rgba(0,0,0,0.18)' }}
          >
            <button
              onClick={(e) => { e.stopPropagation(); setEmojiInput(project.coverEmoji ?? ''); setEditingEmoji(true) }}
              className="text-xs rounded-md"
              style={{
                background: 'rgba(255,255,255,0.25)', color: 'white', border: 'none',
                padding: '3px 8px', cursor: 'pointer', fontFamily: 'inherit', backdropFilter: 'blur(4px)'
              }}
              title="Edit emoji"
            >
              ✏️
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onCoverChange() }}
              className="text-xs rounded-md"
              style={{
                background: 'rgba(255,255,255,0.25)', color: 'white', border: 'none',
                padding: '3px 8px', cursor: 'pointer', fontFamily: 'inherit', backdropFilter: 'blur(4px)'
              }}
              title="Next color"
            >
              🎨
            </button>
          </div>
        )}
      </div>

      {/* Card body */}
      <div
        className="flex flex-col flex-1"
        style={{ padding: '14px 16px 14px' }}
        onClick={onOpen}
      >
        <div className="flex items-start justify-between gap-2 mb-1">
          <span
            className="text-sm font-semibold leading-snug truncate"
            style={{ color: 'var(--text)' }}
          >
            {project.name}
          </span>
          {hovered && (
            <button
              onClick={onRemove}
              className="flex-shrink-0 text-[11px] rounded-md"
              style={{
                background: 'var(--accent-light)', color: 'var(--accent)',
                border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                padding: '2px 7px', marginTop: 1
              }}
            >
              Remove
            </button>
          )}
        </div>
        <p
          className="text-[11px] truncate mb-3"
          style={{ color: 'var(--muted)', fontFamily: "'JetBrains Mono', monospace" }}
          title={project.rootPath}
        >
          {project.rootPath}
        </p>
        <p className="text-[11px] mt-auto" style={{ color: 'var(--muted)' }}>
          {formatDate(project.lastOpened)}
        </p>
      </div>
    </div>
  )
}

// ── ProjectHub ────────────────────────────────────────────────────────────────

export default function ProjectHub(): JSX.Element {
  const navigate = useNavigate()
  const { projects, reload } = useProjects()
  const [showBrowser, setShowBrowser] = useState(false)
  const [addError, setAddError] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)

  const handleSelect = async (path: string): Promise<void> => {
    setAddError(null)
    setAdding(true)
    setShowBrowser(false)
    try {
      const result = await addProject(path)
      if (result.error) {
        setAddError(result.error)
      } else {
        await reload()
      }
    } finally {
      setAdding(false)
    }
  }

  const handleRemove = async (e: React.MouseEvent, id: string): Promise<void> => {
    e.stopPropagation()
    await removeProject(id)
    await reload()
  }

  const handleCoverChange = async (project: Project): Promise<void> => {
    await updateProject(project.id, { coverTheme: nextTheme(project) })
    await reload()
  }

  return (
    <div className="flex flex-col h-full">
      <AppHeader />

      {showBrowser && (
        <DirBrowser
          onSelect={handleSelect}
          onClose={() => setShowBrowser(false)}
        />
      )}

      <main
        className="flex-1 overflow-y-auto"
        style={{ padding: '36px 44px', background: 'var(--bg)' }}
      >
        {projects.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center h-full gap-4 text-center"
            style={{ paddingBottom: 60 }}
          >
            <div style={{ fontSize: 48, opacity: 0.35 }}>🗂</div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)', maxWidth: 260 }}>
              Add a BStack project folder to browse its memory files.
            </p>
            <button
              onClick={() => setShowBrowser(true)}
              style={{
                background: 'var(--accent)', color: 'white', border: 'none',
                borderRadius: 8, padding: '10px 22px', fontSize: 13.5,
                fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit'
              }}
            >
              Browse for project
            </button>
            {addError && <p className="text-xs" style={{ color: 'var(--accent)' }}>{addError}</p>}
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>Projects</h2>
              <button
                onClick={() => { setAddError(null); setShowBrowser(true) }}
                disabled={adding}
                className="flex items-center gap-1.5 rounded-md text-xs font-medium"
                style={{
                  background: 'none', border: '1px solid var(--border)', color: 'var(--muted)',
                  padding: '6px 13px', cursor: 'pointer', fontFamily: 'inherit'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)' }}
              >
                + Add project
              </button>
            </div>

            {addError && (
              <div
                className="mb-4 px-3 py-2 rounded-lg text-xs"
                style={{ background: 'var(--accent-light)', color: 'var(--accent)', border: '1px solid var(--accent)' }}
              >
                {addError}
              </div>
            )}

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: 16
              }}
            >
              {[...projects].sort((a, b) => a.name.localeCompare(b.name)).map((p) => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  onOpen={() => navigate(`/project/${p.id}`)}
                  onRemove={(e) => handleRemove(e, p.id)}
                  onCoverChange={() => handleCoverChange(p)}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
