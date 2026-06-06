// Inline markdown-to-HTML renderer — ported from memory-viewer.html
// No external dependencies. XSS-safe: all text runs through esc() before innerHTML.

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function inline(s: string): string {
  s = esc(s)
  const codes: string[] = []
  s = s.replace(/`([^`]+)`/g, (_, c) => {
    codes.push(c)
    return `\x00CODE${codes.length - 1}\x00`
  })
  s = s.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
  s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  s = s.replace(/__(.+?)__/g, '<strong>$1</strong>')
  s = s.replace(/\*([^*\n]+)\*/g, '<em>$1</em>')
  s = s.replace(/_([^_\n]+)_/g, '<em>$1</em>')
  s = s.replace(/~~(.+?)~~/g, '<del>$1</del>')
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, url: string) => {
    const safeUrl = url.replace(/"/g, '&quot;')
    return /^https?:\/\//.test(url)
      ? `<a class="md-ext" href="${safeUrl}" target="_blank" rel="noopener">${text}</a>`
      : `<a class="md-link" href="#" data-mdlink="${safeUrl}">${text}</a>`
  })
  s = s.replace(/\x00CODE(\d+)\x00/g, (_, i) => `<code>${esc(codes[+i])}</code>`)
  return s
}

function parseTable(lines: string[]): string | null {
  if (lines.length < 2 || !/^[\s|:-]+$/.test(lines[1])) return null
  const row = (l: string): string[] =>
    l
      .replace(/^\||\|$/g, '')
      .split('|')
      .map((c) => c.trim())
  const aligns = row(lines[1]).map((c) => {
    if (c.startsWith(':') && c.endsWith(':')) return ' style="text-align:center"'
    if (c.endsWith(':')) return ' style="text-align:right"'
    return ''
  })
  let h = '<table><thead><tr>'
  row(lines[0]).forEach((c, i) => {
    h += `<th${aligns[i] ?? ''}>${inline(c)}</th>`
  })
  h += '</tr></thead><tbody>'
  for (let i = 2; i < lines.length; i++) {
    if (!lines[i].trim()) continue
    h += '<tr>'
    row(lines[i]).forEach((c, j) => {
      h += `<td${aligns[j] ?? ''}>${inline(c)}</td>`
    })
    h += '</tr>'
  }
  return h + '</tbody></table>'
}

export function parse(text: string): string {
  const lines = text.split('\n')
  let out = ''
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (/^```/.test(line)) {
      const lang = line.slice(3).trim()
      let code = ''
      i++
      while (i < lines.length && !/^```/.test(lines[i])) {
        code += lines[i] + '\n'
        i++
      }
      i++
      out += `<pre><code${lang ? ` class="lang-${lang}"` : ''}>${esc(code.trimEnd())}</code></pre>`
      continue
    }

    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) {
      out += '<hr>'
      i++
      continue
    }

    const hm = line.match(/^(#{1,6})\s+(.*)/)
    if (hm) {
      out += `<h${hm[1].length}>${inline(hm[2])}</h${hm[1].length}>`
      i++
      continue
    }

    if (/^>\s?/.test(line)) {
      let bq = ''
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        bq += lines[i].replace(/^>\s?/, '') + '\n'
        i++
      }
      out += `<blockquote>${inline(bq.trim())}</blockquote>`
      continue
    }

    if (/^\|/.test(line)) {
      const tl: string[] = []
      while (i < lines.length && /^\|/.test(lines[i])) {
        tl.push(lines[i])
        i++
      }
      out += parseTable(tl) ?? tl.map((l) => `<p>${inline(l)}</p>`).join('')
      continue
    }

    if (/^[\-*+]\s/.test(line)) {
      let li = ''
      while (i < lines.length && /^[\-*+]\s/.test(lines[i])) {
        const t = lines[i].replace(/^[\-*+]\s/, '')
        const cb = t.match(/^\[([ x])\]\s(.*)/i)
        if (cb) {
          li += `<li><input type="checkbox"${cb[1].toLowerCase() === 'x' ? ' checked' : ''} disabled> ${inline(cb[2])}</li>`
        } else {
          li += `<li>${inline(t)}</li>`
        }
        i++
      }
      out += `<ul>${li}</ul>`
      continue
    }

    if (/^\d+\.\s/.test(line)) {
      let li = ''
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        li += `<li>${inline(lines[i].replace(/^\d+\.\s/, ''))}</li>`
        i++
      }
      out += `<ol>${li}</ol>`
      continue
    }

    if (!line.trim()) {
      i++
      continue
    }

    let p = ''
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^(#{1,6}\s|>|```|[\-*+]\s|\d+\.\s|\|)/.test(lines[i]) &&
      !/^(-{3,}|\*{3,}|_{3,})$/.test(lines[i].trim())
    ) {
      p += (p ? ' ' : '') + lines[i]
      i++
    }
    if (p) out += `<p>${inline(p)}</p>`
  }
  return out
}
