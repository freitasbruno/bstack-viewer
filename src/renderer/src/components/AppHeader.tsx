import { useNavigate } from 'react-router-dom'

interface Props {
  showProject?: boolean
  pathParts?: string[]
  moduleName?: string
  onRefresh?: () => void
}

export default function AppHeader({
  showProject = false,
  pathParts = [],
  moduleName,
  onRefresh
}: Props): JSX.Element {
  const navigate = useNavigate()

  return (
    <header
      className="flex items-center gap-2.5 flex-shrink-0"
      style={{
        height: 52,
        background: 'var(--card-bg)',
        borderBottom: '1px solid var(--border)',
        paddingLeft: 16,
        paddingRight: 16
      }}
    >
      <div
        className="flex items-center justify-center flex-shrink-0 rounded-[7px] text-white cursor-pointer"
        style={{
          width: 28,
          height: 28,
          background: 'var(--accent)',
          fontSize: 10,
          fontWeight: 800,
          letterSpacing: '-0.5px'
        }}
        onClick={() => navigate('/')}
      >
        BS
      </div>

      <span className="text-sm font-semibold flex-shrink-0" style={{ color: 'var(--text)' }}>
        BStack Memory
      </span>

      {showProject && pathParts.length > 0 && (
        <>
          <span style={{ color: 'var(--border)', padding: '0 2px' }}>/</span>
          <span className="text-xs truncate" style={{ color: 'var(--muted)', maxWidth: 400 }}>
            {pathParts.join(' / ')}
          </span>
        </>
      )}

      <div className="flex-1" />

      {moduleName && (
        <span
          className="flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase"
          style={{
            background: 'var(--accent-light)',
            color: 'var(--accent)',
            letterSpacing: '0.04em'
          }}
        >
          {moduleName}
        </span>
      )}

      {showProject && (
        <>
          <HeaderButton onClick={onRefresh}>↺ Refresh</HeaderButton>
          <HeaderButton onClick={() => navigate('/')}>← Projects</HeaderButton>
        </>
      )}
    </header>
  )
}

function HeaderButton({
  onClick,
  children
}: {
  onClick?: () => void
  children: React.ReactNode
}): JSX.Element {
  return (
    <button
      onClick={onClick}
      className="flex-shrink-0 flex items-center gap-1 rounded-md text-xs font-medium"
      style={{
        background: 'none',
        border: '1px solid var(--border)',
        color: 'var(--muted)',
        padding: '5px 11px',
        cursor: 'pointer',
        fontFamily: 'inherit',
        transition: 'border-color 0.15s, color 0.15s'
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
      {children}
    </button>
  )
}
