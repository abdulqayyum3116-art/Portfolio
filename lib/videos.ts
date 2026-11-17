import { hiddenVideoIds, videos as curated, type LearnVideo } from '@/content/videos'
import { getAllPosts } from './blog'

// Dated entries newest-first; undated entries go after them and keep list order (sort is stable).
const ts = (d?: string) => (d ? +new Date(d) || 0 : 0)
const byNewest = (a: LearnVideo, b: LearnVideo) => ts(b.publishedAt) - ts(a.publishedAt)
const isValidId = (id: string) => /^[\w-]{11}$/.test(id)

/**
 * All hub videos = hand-curated entries in content/videos.ts (placeholders with
 * invalid IDs are skipped) + every YouTube video linked from a Supabase blog post.
 * Curated entries win when the same ID appears in both.
 */
export async function getAllVideos(): Promise<LearnVideo[]> {
  const list = curated.filter((v) => isValidId(v.id) && !hiddenVideoIds.has(v.id))
  const seen = new Set(list.map((v) => v.id))

  for (const p of await getAllPosts()) {
    if (!p.youtubeId || seen.has(p.youtubeId)) continue
    seen.add(p.youtubeId)
    list.push({
      id: p.youtubeId,
      title: p.title,
      kind: 'video',
      topic: p.tags[0] ?? 'General',
      publishedAt: p.publishedAt,
      description: p.excerpt,
    })
  }

  return list.sort(byNewest)
}

export async function getVideos(): Promise<LearnVideo[]> {
  return (await getAllVideos()).filter((v) => v.kind === 'video')
}

export async function getShorts(): Promise<LearnVideo[]> {
  return (await getAllVideos()).filter((v) => v.kind === 'short')
}

/** Videos whose topic matches any of the given tags (case-insensitive), newest first. */
export async function getRelatedVideos(tags: string[], limit = 3, excludeId?: string | null): Promise<LearnVideo[]> {
  const wanted = new Set(tags.map((t) => t.toLowerCase()))
  const pool = (await getVideos()).filter((v) => v.id !== excludeId)
  const related = pool.filter((v) => wanted.has(v.topic.toLowerCase()))
  return (related.length ? related : pool).slice(0, limit)
}

export function thumbnailUrl(v: Pick<LearnVideo, 'id' | 'kind'>) {
  // hqdefault exists for every video (480×360); Shorts get cropped to 9:16 via CSS object-fit.
  return `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`
}

export function watchUrl(v: Pick<LearnVideo, 'id' | 'kind'>) {
  return v.kind === 'short' ? `https://www.youtube.com/shorts/${v.id}` : `https://www.youtube.com/watch?v=${v.id}`
}

export function embedUrl(id: string) {
  return `https://www.youtube-nocookie.com/embed/${id}`
}

export function videoJsonLd(list: LearnVideo[]) {
  return list.map((v) => ({
    '@type': 'VideoObject',
    name: v.title,
    description: v.description ?? v.title,
    thumbnailUrl: thumbnailUrl(v),
    ...(v.publishedAt ? { uploadDate: v.publishedAt } : {}),
    embedUrl: embedUrl(v.id),
    contentUrl: watchUrl(v),
  }))
}
