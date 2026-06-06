import { useEffect, useRef } from 'react'
import { parse } from '../utils/md'

interface Props {
  content: string
  onNavigate: (relPath: string) => void
}

export default function MarkdownView({ content, onNavigate }: Props): JSX.Element {
  const ref = useRef<HTMLDivElement>(null)
  const html = parse(content)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const handlers: Array<() => void> = []

    el.querySelectorAll<HTMLAnchorElement>('[data-mdlink]').forEach((a) => {
      const handler = (): void => {
        const rel = a.dataset.mdlink
        if (rel) onNavigate(rel)
      }
      a.addEventListener('click', handler)
      handlers.push(() => a.removeEventListener('click', handler))
    })

    el.querySelectorAll<HTMLAnchorElement>('a.md-ext').forEach((a) => {
      const handler = (e: MouseEvent): void => {
        e.preventDefault()
        const href = a.getAttribute('href')
        if (href) window.open(href, '_blank', 'noopener,noreferrer')
      }
      a.addEventListener('click', handler)
      handlers.push(() => a.removeEventListener('click', handler))
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
