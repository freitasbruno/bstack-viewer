import { useState, useEffect, useCallback } from 'react'
import { getRoots, browseDir } from '../api'

interface Props {
  onSelect: (path: string) => void
  onClose: () => void
}

function parentOf(path: string): string | null {
  const norm = path.replace(/[/\\]+$/, '')
  const sep = norm.includes('\\') ? '\\' : '/'
  const parts = norm.split(sep).filter(Boolean)
  if (parts.length <= 1) return null
  const parent = parts.slice(0, -1).join(sep)
  return parent + sep
}

export default function DirBrowser({ onSelect, onClose }: Props): JSX.Element {
  const [roots, setRoots] = useState<string[]>([])
  const [currentPath, setCurrentPath] = useState<string | null>(null)
  const [entries, setEntries] = useState<{ name: string; path: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getRoots().then(setRoots)
  }, [])

  const navigate = useCallback(async (path: string) => {
    setLoading(true)
    setError(null)
    const dirs = await browseDir(path)
    if (dirs.length === 0 && !path) {
      setError('Cannot read this directory.')
    }
    setCurrentPath(path)
    setEntries(dirs)
    setLoading(false)
  }, [])

  const goUp = (): void => {
    if (!currentPath) return
    const parent = parentOf(currentPath)
    if (parent) navigate(parent)
    else setCurrentPath(null)
  }

  // Breadcrumb segments from current path
  const segments = currentPath
    ? currentPath.replace(/[/\\]+$/, '').split(/[/\\]/).filter(Boolean)
    : []

  const navigateToSegment = (idx: number): void => {
    if (!currentPath) return
    const sep = currentPath.includes('\\') ? '\\' : '/'
    const parts = currentPath.replace(/[/\\]+$/, '').split(/[/\\]/).filter(Boolean)
    const newPath = parts.slice(0, idx + 1).join(sep) + sep
    navigate(newPath)
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: 'rgba(30,20,10,0.45)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="flex flex-col rounded-xl shadow-2xl overflow-hidden"
        style={{
          width: 480,
          maxHeight: '70vh',
          background: 'var(--card-bg)',
          border: '1px solid var(--border)'
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3 flex-shrink-0"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
            Browse for project
          </span>
          <button
            onClick={onClose}
            className="text-lg leading-none rounded"
            style={{ color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px' }}
          >
            ✕
          </button>
        </div>

        {/* Breadcrumb */}
        <div
          className="flex items-center gap-1 px-4 py-2 flex-wrap flex-shrink-0 text-xs"
          style={{ borderBottom: '1px solid var(--border)', color: 'var(--muted)', minHeight: 36 }}
        >
          <button
            onClick={() => setCurrentPath(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)', fontFamily: 'inherit', fontSize: 12, padding: 0 }}
          >
            Drives
          </button>
          {segments.map((seg, i) => (
            <span key={i} className="flex items-center gap-1">
              <span style={{ color: 'var(--border)' }}>›</span>
              <button
                onClick={() => navigateToSegment(i)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: i === segments.length - 1 ? 'var(--text)' : 'var(--accent)',
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 11, padding: 0,
                  fontWeight: i === segments.length - 1 ? 600 : 400
                }}
              >
                {seg}
              </button>
            </span>
          ))}
        </div>

        {/* Entries */}
        <div className="flex-1 overflow-y-auto" style={{ padding: '6px 8px' }}>
          {loading && (
            <div className="flex items-center justify-center py-8">
              <span className="text-sm" style={{ color: 'var(--muted)' }}>Loading…</span>
            </div>
          )}

          {!loading && currentPath === null && (
            <>
              {roots.map((drive) => (
                <button
                  key={drive}
                  onClick={() => navigate(drive)}
                  className="flex items-center gap-2.5 w-full rounded-md text-sm text-left transition-colors"
                  style={{
                    padding: '7px 10px', background: 'none', border: 'none',
                    cursor: 'pointer', fontFamily: 'inherit', color: 'var(--text)'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                >
                  <span>💾</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>{drive}</span>
                </button>
              ))}
            </>
          )}

          {!loading && currentPath !== null && (
            <>
              <button
                onClick={goUp}
                className="flex items-center gap-2.5 w-full rounded-md text-sm text-left transition-colors"
                style={{
                  padding: '7px 10px', background: 'none', border: 'none',
                  cursor: 'pointer', fontFamily: 'inherit', color: 'var(--muted)'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
              >
                <span>↑</span>
                <span>..</span>
              </button>

              {entries.length === 0 && !error && (
                <p className="text-xs px-3 py-4" style={{ color: 'var(--muted)' }}>No subdirectories</p>
              )}

              {error && (
                <p className="text-xs px-3 py-4" style={{ color: 'var(--accent)' }}>{error}</p>
              )}

              {entries.map((entry) => (
                <button
                  key={entry.path}
                  onClick={() => navigate(entry.path)}
                  className="flex items-center gap-2.5 w-full rounded-md text-sm text-left transition-colors"
                  style={{
                    padding: '7px 10px', background: 'none', border: 'none',
                    cursor: 'pointer', fontFamily: 'inherit', color: 'var(--text)'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                >
                  <span>📁</span>
                  <span className="truncate">{entry.name}</span>
                </button>
              ))}
            </>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-4 py-3 flex-shrink-0 gap-3"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <span
            className="text-xs truncate flex-1"
            style={{ color: 'var(--muted)', fontFamily: "'JetBrains Mono', monospace" }}
          >
            {currentPath ?? 'Select a drive to start'}
          </span>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={onClose}
              style={{
                background: 'none', border: '1px solid var(--border)', color: 'var(--muted)',
                borderRadius: 7, padding: '6px 14px', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit'
              }}
            >
              Cancel
            </button>
            <button
              onClick={() => currentPath && onSelect(currentPath)}
              disabled={!currentPath}
              style={{
                background: currentPath ? 'var(--accent)' : 'var(--border)',
                color: currentPath ? 'white' : 'var(--muted)',
                border: 'none', borderRadius: 7, padding: '6px 14px',
                fontSize: 13, fontWeight: 600,
                cursor: currentPath ? 'pointer' : 'default', fontFamily: 'inherit'
              }}
            >
              Add this folder
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
