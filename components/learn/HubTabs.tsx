'use client'

import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { LearnVideo } from '@/content/videos'
import { BlogCard, ShortCard, VideoCard, type BlogSummary } from './Cards'
import styles from './Learn.module.css'
import CompactLibrary from './CompactLibrary'

type Kind = 'all' | 'blog' | 'video' | 'short'

type Item =
  | { kind: 'blog'; key: string; date?: string; topics: string[]; post: BlogSummary }
  | { kind: 'video' | 'short'; key: string; date?: string; topics: string[]; video: LearnVideo }

type Props = {
  posts?: BlogSummary[]
  videos?: LearnVideo[]
  /** Show the All / Blogs / Videos / Shorts tabs (hub page). Off on single-type pages. */
  showKindTabs?: boolean
  emptyText?: string
  compactLibrary?: boolean
}

const KIND_LABELS: Record<Kind, string> = { all: 'All', blog: 'Blogs', video: 'Videos', short: 'Reels' }

export default function HubTabs({ compactLibrary = false, ...props }: Props) {
  return compactLibrary ? <CompactLibrary posts={props.posts ?? []} videos={props.videos ?? []} /> : <ArchiveTabs {...props} />
}

function ArchiveTabs({ posts = [], videos = [], showKindTabs = true, emptyText }: Props) {
  const [kind, setKind] = useState<Kind>('all')
  const [topic, setTopic] = useState<string | null>(null)

  const items = useMemo<Item[]>(() => {
    const all: Item[] = [
      ...posts.map((post) => ({ kind: 'blog' as const, key: `b-${post.slug}`, date: post.publishedAt, topics: post.tags, post })),
      ...videos.map((video) => ({ kind: video.kind, key: `v-${video.id}`, date: video.publishedAt, topics: [video.topic], video })),
    ]
    // Dated items newest-first; undated items (e.g. Shorts) follow in their original order.
    const ts = (d?: string) => (d ? +new Date(d) || 0 : 0)
    return all.sort((a, b) => ts(b.date) - ts(a.date))
  }, [posts, videos])

  const kindsPresent = useMemo(() => {
    const present = new Set(items.map((i) => i.kind))
    return (['all', 'blog', 'video', 'short'] as Kind[]).filter((k) => k === 'all' || present.has(k as Item['kind']))
  }, [items])

  const byKind = kind === 'all' ? items : items.filter((i) => i.kind === kind)

  const topics = useMemo(() => {
    const counts = new Map<string, number>()
    byKind.forEach((i) => i.topics.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)))
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([t]) => t)
  }, [byKind])

  const visible = topic ? byKind.filter((i) => i.topics.includes(topic)) : byKind

  return (
    <div>
      {showKindTabs && kindsPresent.length > 2 && (
        <div className={styles.tabs} role="tablist" aria-label="Content type">
          {kindsPresent.map((k) => (
            <button
              key={k}
              type="button"
              role="tab"
              aria-selected={kind === k}
              className={`${styles.tab} ${kind === k ? styles.tabActive : ''}`}
              onClick={() => {
                setKind(k)
                setTopic(null)
              }}
            >
              {KIND_LABELS[k]}
            </button>
          ))}
        </div>
      )}

      {topics.length > 1 && (
        <div className={styles.chips} aria-label="Filter by topic">
          <button
            type="button"
            aria-pressed={topic === null}
            className={`${styles.chip} ${topic === null ? styles.chipActive : ''}`}
            onClick={() => setTopic(null)}
          >
            Everything
          </button>
          {topics.map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={topic === t}
              className={`${styles.chip} ${topic === t ? styles.chipActive : ''}`}
              onClick={() => setTopic(topic === t ? null : t)}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      {visible.length === 0 ? (
        <p className={styles.empty}>{emptyText ?? 'Nothing here yet — new lessons are on the way.'}</p>
      ) : (
        <motion.div layout className={styles.grid}>
          <AnimatePresence mode="popLayout">
            {visible.map((item, i) => (
              <motion.div
                key={item.key}
                layout
                className={item.kind === 'short' ? styles.gridShort : undefined}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 260, damping: 26, delay: Math.min(i, 8) * 0.04 }}
              >
                {item.kind === 'blog' ? (
                  <BlogCard post={item.post} />
                ) : item.kind === 'video' ? (
                  <VideoCard video={item.video} />
                ) : (
                  <ShortCard video={item.video} />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}
