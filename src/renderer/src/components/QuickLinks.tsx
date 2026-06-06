interface QuickLink {
  label: string
  icon: string
  path: string[]
  isDir?: boolean
}

const QUICK_LINKS: QuickLink[] = [
  { label: 'Roadmap', icon: '🗺', path: ['roadmap', 'index.md'] },
  { label: 'WIP', icon: '🔄', path: ['wip'], isDir: true },
  { label: 'Notes', icon: '📝', path: ['notes.md'] },
  { label: 'Known Bugs', icon: '🐛', path: ['known-bugs.md'] },
  { label: 'Tech Debt', icon: '🔧', path: ['technical-debt.md'] }
]

interface Props {
  activeKey: string
  onNavigate: (path: string[], isDir: boolean) => void
}

export default function QuickLinks({ activeKey, onNavigate }: Props): JSX.Element {
  return (
    <div>
      {QUICK_LINKS.map((link) => {
        const key = link.path.join('/')
        const isActive = activeKey === key
        return (
          <div
            key={key}
            onClick={() => onNavigate(link.path, !!link.isDir)}
            className="flex items-center rounded-md text-sm cursor-pointer transition-colors"
            style={{
              gap: 10,
              padding: '7px 10px',
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
            <span className="w-[18px] text-center flex-shrink-0 text-[13px]">{link.icon}</span>
            {link.label}
          </div>
        )
      })}
    </div>
  )
}
