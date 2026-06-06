interface Props {
  html: string
}

export default function MockupView({ html }: Props): JSX.Element {
  return (
    <div
      style={{
        borderRadius: 10,
        overflow: 'hidden',
        border: '1px solid var(--border)',
        boxShadow: '0 2px 12px rgba(80,55,20,0.08)',
        height: 'calc(100vh - 200px)',
        minHeight: 400,
        animation: 'fadeUp 0.2s ease both'
      }}
    >
      <iframe
        srcDoc={html}
        sandbox="allow-scripts allow-same-origin"
        style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
        title="Mockup preview"
      />
    </div>
  )
}
