/**
 * Blog data layer — reads posts from Supabase at BUILD TIME only.
 *
 * The site is a static export (output: 'export'), so these functions run during
 * `next build` and every post is prerendered. New posts appear after a rebuild
 * (see README → "Publishing a new blog post").
 *
 * Uses Supabase's REST API (PostgREST) directly via fetch — no client SDK needed.
 *
 * Env vars (read at build time):
 *   SUPABASE_URL      or NEXT_PUBLIC_SUPABASE_URL       e.g. https://xyzcompany.supabase.co
 *   SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY  anon key (RLS must allow reading posts)
 *   SUPABASE_POSTS_TABLE    optional, defaults to "posts"
 */

import { hiddenVideoIds } from '@/content/videos'

export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  content: string
  contentFormat: 'html' | 'markdown'
  coverImage: string | null
  tags: string[]
  publishedAt: string
  updatedAt: string
  readingTime: number
  author: string | null
  /** YouTube video ID linked to the post (from the `youtube` column), if valid */
  youtubeId: string | null
}

type Row = Record<string, unknown>

const SUPABASE_URL = (process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL)?.replace(/\/$/, '')
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const TABLE = process.env.SUPABASE_POSTS_TABLE ?? 'posts'

/** Return the first non-empty value among candidate column names. */
function pick<T = unknown>(row: Row, keys: string[]): T | undefined {
  for (const k of keys) {
    const v = row[k]
    if (v !== undefined && v !== null && v !== '') return v as T
  }
  return undefined
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function stripTags(s: string) {
  return s.replace(/<[^>]+>/g, ' ').replace(/[#*_`>\[\]()!-]/g, ' ').replace(/\s+/g, ' ').trim()
}

/** Extracts an 11-char YouTube ID from youtu.be / watch?v= / shorts / embed URLs, else null. */
export function parseYouTubeId(v: unknown): string | null {
  if (typeof v !== 'string') return null
  const s = v.trim()
  if (/^[\w-]{11}$/.test(s)) return s
  const m = s.match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/))([\w-]{11})/)
  return m ? m[1] : null
}

/** Parses dates like "July 6, 2026" or ISO strings into ISO; returns null if invalid. */
function toIso(v: unknown): string | null {
  if (typeof v !== 'string' && typeof v !== 'number') return null
  // Calendar-only dates ("July 6, 2026", "2026-07-06") are read as UTC so they
  // don't shift a day depending on the build machine's timezone.
  const dateOnly = typeof v === 'string' && !/\d:\d/.test(v)
  const d = new Date(dateOnly && !/^\d{4}-\d{2}-\d{2}$/.test(v.trim()) ? `${v} UTC` : v)
  return isNaN(+d) ? null : d.toISOString()
}

/** Post titles are the page <h1>, so demote any <h1> inside the stored HTML body. */
function normalizeHtml(html: string) {
  return html.replace(/<(\/?)h1(\s|>)/gi, '<$1h2$2')
}

function toTags(v: unknown): string[] {
  if (Array.isArray(v)) return v.map(String).filter(Boolean)
  if (typeof v === 'string') return v.split(',').map((t) => t.trim()).filter(Boolean)
  return []
}

/**
 * Maps a Supabase row to a BlogPost. Accepts the most common column names so it
 * works with typical blog schemas — adjust the key lists if your table differs.
 */
export function mapRow(row: Row): BlogPost | null {
  const title = pick<string>(row, ['title', 'name', 'heading'])
  if (!title) return null

  const raw = String(pick(row, ['content', 'body', 'content_html', 'html', 'markdown', 'body_md']) ?? '')
  const contentFormat: BlogPost['contentFormat'] = /^\s*</.test(raw) ? 'html' : 'markdown'
  const content = contentFormat === 'html' ? normalizeHtml(raw) : raw
  const plain = stripTags(content)
  const words = plain ? plain.split(' ').length : 0

  const excerpt =
    pick<string>(row, ['excerpt', 'summary', 'description', 'meta_description', 'subtitle']) ??
    (plain.length > 180 ? plain.slice(0, 177).trimEnd() + '…' : plain)

  const publishedAt =
    toIso(pick(row, ['published_at', 'publish_date', 'date'])) ??
    toIso(row.created_at) ??
    new Date().toISOString()
  const linkedId = parseYouTubeId(pick(row, ['youtube', 'youtube_url', 'video_url', 'video']))
  const youtubeId = linkedId && !hiddenVideoIds.has(linkedId) ? linkedId : null

  return {
    slug: String(pick(row, ['slug', 'permalink']) ?? slugify(title)),
    title,
    excerpt,
    content,
    contentFormat,
    coverImage:
      pick<string>(row, ['cover_image', 'cover_image_url', 'cover', 'featured_image', 'image', 'image_url', 'thumbnail']) ??
      (youtubeId ? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg` : null),
    tags: toTags(pick(row, ['tags', 'categories', 'category', 'topic'])),
    publishedAt,
    updatedAt: toIso(pick(row, ['updated_at', 'modified_at'])) ?? publishedAt,
    readingTime: Number(pick(row, ['reading_time', 'read_time'])) || Math.max(1, Math.round(words / 220)),
    author: pick<string>(row, ['author', 'author_name']) ?? null,
    youtubeId,
  }
}

/** True when a row should be visible. Rows without a status/published column are treated as published. */
function isPublished(row: Row) {
  if ('published' in row && row.published === false) return false
  if ('is_published' in row && row.is_published === false) return false
  if ('draft' in row && row.draft === true) return false
  if (typeof row.status === 'string' && row.status.toLowerCase() !== 'published') return false
  return true
}

let cache: Promise<BlogPost[]> | null = null

async function fetchPosts(): Promise<BlogPost[]> {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('[blog] Production builds require SUPABASE_URL and SUPABASE_ANON_KEY.')
    }
    console.warn('[blog] Supabase URL / anon key not set — building Learning Hub without blog posts.')
    return []
  }

  const res = await fetch(`${SUPABASE_URL}/rest/v1/${encodeURIComponent(TABLE)}?select=*`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    // Default fetch is fresh during each static build; the promise below deduplicates within the worker.
    signal: AbortSignal.timeout(30000),
  })

  if (!res.ok) {
    throw new Error(`[blog] Supabase request failed: ${res.status} ${res.statusText} — ${await res.text()}`)
  }

  const rows = (await res.json()) as Row[]
  const posts = rows.filter(isPublished).map(mapRow).filter((p): p is BlogPost => p !== null)

  // De-duplicate slugs so generateStaticParams never emits the same route twice.
  const seen = new Set<string>()
  return posts
    .filter((p) => (seen.has(p.slug) ? false : (seen.add(p.slug), true)))
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt))
}

export function getAllPosts(): Promise<BlogPost[]> {
  cache ??= fetchPosts()
  return cache
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  return (await getAllPosts()).find((p) => p.slug === slug)
}

export function formatDate(iso: string) {
  const d = new Date(iso)
  return isNaN(+d) ? '' : d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' })
}
