/**
 * Tiny, dependency-free Markdown → HTML converter for blog bodies stored as
 * Markdown. Covers headings, paragraphs, lists, blockquotes, fenced code,
 * images, links, bold/italic/inline code and horizontal rules.
 * All text is HTML-escaped first, so raw HTML inside Markdown is NOT rendered.
 */

function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function safeUrl(url: string) {
  const u = url.trim()
  return /^(https?:|mailto:|\/|#)/i.test(u) ? u : '#'
}

function inline(s: string) {
  let out = escapeHtml(s)
  out = out.replace(/`([^`]+)`/g, '<code>$1</code>')
  out = out.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+&quot;[^&]*&quot;)?\)/g, (_, alt, src) => `<img src="${safeUrl(src)}" alt="${alt}" loading="lazy" />`)
  out = out.replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+&quot;[^&]*&quot;)?\)/g, (_, text, href) => {
    const url = safeUrl(href)
    const ext = /^https?:/i.test(url) ? ' target="_blank" rel="noopener noreferrer"' : ''
    return `<a href="${url}"${ext}>${text}</a>`
  })
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/__([^_]+)__/g, '<strong>$1</strong>')
  out = out.replace(/(^|[^*])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>').replace(/(^|\W)_([^_\s][^_]*)_(?=\W|$)/g, '$1<em>$2</em>')
  return out
}

export function markdownToHtml(md: string): string {
  const lines = md.replace(/\r\n?/g, '\n').split('\n')
  const html: string[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (/^\s*$/.test(line)) { i++; continue }

    // Fenced code
    const fence = line.match(/^```(\w*)/)
    if (fence) {
      const buf: string[] = []
      i++
      while (i < lines.length && !/^```/.test(lines[i])) buf.push(lines[i++])
      i++
      html.push(`<pre><code${fence[1] ? ` class="language-${fence[1]}"` : ''}>${escapeHtml(buf.join('\n'))}</code></pre>`)
      continue
    }

    const h = line.match(/^(#{1,6})\s+(.*)$/)
    if (h) {
      // Post title is the page <h1>, so shift body headings down one level.
      const level = Math.min(6, h[1].length + 1)
      html.push(`<h${level}>${inline(h[2])}</h${level}>`)
      i++
      continue
    }

    if (/^(\*\s*\*\s*\*|-\s*-\s*-|_\s*_\s*_)[\s*_-]*$/.test(line)) { html.push('<hr />'); i++; continue }

    if (/^>\s?/.test(line)) {
      const buf: string[] = []
      while (i < lines.length && /^>\s?/.test(lines[i])) buf.push(lines[i++].replace(/^>\s?/, ''))
      html.push(`<blockquote>${markdownToHtml(buf.join('\n'))}</blockquote>`)
      continue
    }

    if (/^\s*([-*+]|\d+[.)])\s+/.test(line)) {
      const ordered = /^\s*\d+[.)]\s+/.test(line)
      const items: string[] = []
      while (i < lines.length && /^\s*([-*+]|\d+[.)])\s+/.test(lines[i])) {
        items.push(`<li>${inline(lines[i].replace(/^\s*([-*+]|\d+[.)])\s+/, ''))}</li>`)
        i++
      }
      html.push(ordered ? `<ol>${items.join('')}</ol>` : `<ul>${items.join('')}</ul>`)
      continue
    }

    const para: string[] = []
    while (
      i < lines.length &&
      !/^\s*$/.test(lines[i]) &&
      !/^(#{1,6}\s|```|>\s?|\s*([-*+]|\d+[.)])\s+)/.test(lines[i])
    ) para.push(lines[i++])
    html.push(`<p>${inline(para.join(' '))}</p>`)
  }

  return html.join('\n')
}
