import { marked } from 'marked'
import sanitizeHtml from 'sanitize-html'

/** Keep CMS prose and formatting, without executable HTML or inline CSS. */
export function sanitizeContent(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
    allowedAttributes: {
      a: ['href', 'title', 'target', 'rel'],
      img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
      h2: ['id'], h3: ['id'], h4: ['id'], h5: ['id'], h6: ['id'],
      th: ['colspan', 'rowspan', 'scope'], td: ['colspan', 'rowspan'],
      ol: ['start'], code: ['class'],
    },
    allowedClasses: { code: ['language-*'] },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowedSchemesByTag: { img: ['http', 'https'] },
    allowProtocolRelative: false,
    transformTags: {
      h1: 'h2',
      a: (tagName, attribs) => ({ tagName, attribs: { ...attribs, rel: 'noopener noreferrer' } }),
      img: (tagName, attribs) => ({ tagName, attribs: { ...attribs, alt: attribs.alt ?? '', loading: 'lazy' } }),
    },
  })
}

export function markdownToHtml(markdown: string): string {
  return sanitizeContent(marked.parse(markdown, { async: false, gfm: true }))
}
