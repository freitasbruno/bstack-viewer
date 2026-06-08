interface Props {
  absPath: string
  path: string[]
}

export default function MockupView({ absPath, path }: Props): JSX.Element {
  const fileName = path[path.length - 1] ?? ''
  const previewUrl = `/api/fs/preview?path=${encodeURIComponent(absPath)}`

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div
        className="flex items-center gap-2 flex-shrink-0 text-xs"
        style={{
          padding: '8px 16px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--card-bg)',
          color: 'var(--muted)'
        }}
      >
        <span>{path.slice(0, -1).join(' / ')}</span>
        {path.length > 1 && <span style={{ color: 'var(--border)' }}>›</span>}
        <span style={{ color: 'var(--text)', fontWeight: 500 }}>{fileName}</span>
        <span
          className="ml-auto text-[10px] font-bold uppercase rounded-full px-2 py-0.5"
          style={{ background: 'var(--accent-light)', color: 'var(--accent)', letterSpacing: '0.04em' }}
        >
          Mockup
        </span>
      </div>

      {/* iframe with real src URL so relative assets resolve correctly */}
      <iframe
        key={absPath}
        src={previewUrl}
        sandbox="allow-scripts allow-same-origin"
        style={{ flex: 1, border: 'none', display: 'block', width: '100%' }}
        title="Mockup preview"
      />
    </div>
  )
}
