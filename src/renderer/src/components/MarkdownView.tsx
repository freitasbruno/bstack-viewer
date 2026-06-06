import { useEffect, useRef } from 'react'
import mermaid from 'mermaid'
import { parse } from '../utils/md'

mermaid.initialize({
  startOnLoad: false,
  theme: 'neutral',
  themeVariables: {
    primaryColor: '#fdfaf4',
    primaryBorderColor: '#e3d9c8',
    lineColor: '#7c7264',
    textColor: '#1e293b',
    fontSize: '13px'
  }
})

interface Props {
  content: string
  onNavigate: (relPath: string) => void
}

let mermaidCounter = 0

export default function MarkdownView({ content, onNavigate }: Props): JSX.Element {
  const ref = useRef<HTMLDivElement>(null)
  const html = parse(content)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const handlers: Array<() => void> = []

    // Internal markdown links
    el.querySelectorAll<HTMLAnchorElement>('[data-mdlink]').forEach((a) => {
      const handler = (): void => {
        const rel = a.dataset.mdlink
        if (rel) onNavigate(rel)
      }
      a.addEventListener('click', handler)
      handlers.push(() => a.removeEventListener('click', handler))
    })

    // External links
    el.querySelectorAll<HTMLAnchorElement>('a.md-ext').forEach((a) => {
      const handler = (e: MouseEvent): void => {
        e.preventDefault()
        const href = a.getAttribute('href')
        if (href) window.open(href, '_blank', 'noopener,noreferrer')
      }
      a.addEventListener('click', handler)
      handlers.push(() => a.removeEventListener('click', handler))
    })

    // Mermaid diagrams — find <code class="lang-mermaid"> inside <pre>
    el.querySelectorAll<HTMLElement>('code.lang-mermaid').forEach(async (codeEl) => {
      const definition = codeEl.textContent ?? ''
      const pre = codeEl.closest('pre')
      if (!pre || !definition.trim()) return
      try {
        const id = `mermaid-${++mermaidCounter}`
        const { svg } = await mermaid.render(id, definition)
        const wrapper = document.createElement('div')
        wrapper.className = 'mermaid-diagram'
        wrapper.innerHTML = svg
        pre.replaceWith(wrapper)
      } catch {
        // Leave as code block if mermaid fails
      }
    })

    return () => handlers.forEach((fn) => fn())
  }, [html, onNavigate])

  return (
    <div
      ref={ref}
      className="md-body"
      style={{ animation: 'fadeUp 0.2s ease both' }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
