import type { DirEntry } from '../../../types'

interface Props {
  name: string
  entries: DirEntry[]
  onNavigate: (path: string[], isDir: boolean) => void
  basePath: string[]
}

export default function DirListing({ name, entries, onNavigate, basePath }: Props): JSX.Element {
  return (
    <div>
      <h2 className="text-[18px] font-semibold mb-4" style={{ color: 'var(--text)' }}>
        {name}/
      </h2>
      <div className="flex flex-col gap-1.5">
        {entries.map((entry) => (
          <div
            key={entry.name}
            onClick={() => onNavigate([...basePath, entry.name], entry.kind === 'directory')}
            className="flex items-center gap-2.5 px-4 py-3 rounded-lg text-[13.5px] cursor-pointer transition-all"
            style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--border)',
              color: 'var(--text)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)'
              e.currentTarget.style.boxShadow = '0 4px 12px -2px rgba(80,55,20,0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            {entry.kind === 'directory' ? '📁' : '📄'} {entry.name}
          </div>
        ))}
        {entries.length === 0 && (
          <p className="text-[13.5px] py-5" style={{ color: 'var(--muted)' }}>
            Empty directory
          </p>
        )}
      </div>
    </div>
  )
}
