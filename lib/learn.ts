import type { BlogPost } from './blog'
import type { BlogSummary } from '@/components/learn/Cards'

/** Strip the heavy `content` field before passing posts to client components. */
export function toSummary(p: BlogPost): BlogSummary {
  return {
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    coverImage: p.coverImage,
    tags: p.tags,
    publishedAt: p.publishedAt,
    readingTime: p.readingTime,
  }
}

/** Serialize JSON-LD safely for a <script> tag. */
export function jsonLdScript(data: unknown) {
  return { __html: JSON.stringify(data).replace(/</g, '\\u003c') }
}
