interface Props {
  parts: string[]
}

export default function BreadcrumbBar({ parts }: Props): JSX.Element {
  const segments = ['memory', ...parts]
  return (
    <div className="flex items-center flex-wrap gap-1 mb-7 text-xs" style={{ color: 'var(--muted)' }}>
      {segments.map((seg, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && (
            <span style={{ color: 'var(--border)' }}>›</span>
          )}
          <span
            style={
              i === segments.length - 1
                ? { color: 'var(--text)', fontWeight: 500 }
                : undefined
            }
          >
            {seg}
          </span>
        </span>
      ))}
    </div>
  )
}
