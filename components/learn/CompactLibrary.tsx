'use client'

import { useId, useMemo, useRef, useState } from 'react'
import type { LearnVideo } from '@/content/videos'
import { BlogCard, ShortCard, VideoCard, type BlogSummary } from './Cards'
import styles from './Learn.module.css'

type Kind = 'all' | 'blog' | 'video' | 'short'
const formats: { value: Kind; label: string }[] = [
  { value: 'all', label: 'All' }, { value: 'blog', label: 'Blogs' },
  { value: 'video', label: 'Videos' }, { value: 'short', label: 'Reels' },
]
const PAGE_SIZE = 6

export default function CompactLibrary({ posts, videos, showKindTabs = true, emptyText }: { posts: BlogSummary[]; videos: LearnVideo[]; showKindTabs?: boolean; emptyText?: string }) {
  const [kind, setKind] = useState<Kind>('all')
  const [topic, setTopic] = useState('')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const heading = useRef<HTMLHeadingElement>(null)
  const id = useId()
  const items = useMemo(() => {
    const resources = [
      ...posts.map(post => ({ key: `b-${post.slug}`, kind: 'blog' as const, title: post.title, description: post.excerpt, topics: post.tags, date: post.publishedAt, post, video: undefined })),
      ...videos.map(video => ({ key: `v-${video.id}`, kind: video.kind, title: video.title, description: video.description ?? '', topics: [video.topic], date: video.publishedAt, video, post: undefined })),
    ]
    const timestamp = (date?: string) => date ? Date.parse(date) || 0 : 0
    return resources.sort((a, b) => timestamp(b.date) - timestamp(a.date))
  }, [posts, videos])
  const byKind = items.filter(item => kind === 'all' || item.kind === kind)
  const topics = [...new Set(byKind.flatMap(item => item.topics))].filter(Boolean).sort()
  const search = query.trim().toLowerCase()
  const matches = byKind.filter(item => (!topic || item.topics.includes(topic)) &&
    `${item.title} ${item.description} ${item.topics.join(' ')}`.toLowerCase().includes(search))
  const pages = Math.max(1, Math.ceil(matches.length / PAGE_SIZE))
  const currentPage = Math.min(page, pages)
  const start = (currentPage - 1) * PAGE_SIZE
  const visible = matches.slice(start, start + PAGE_SIZE)
  const filtered = kind !== 'all' || topic !== '' || query !== ''

  function clear() {
    setKind('all'); setTopic(''); setQuery(''); setPage(1)
  }
  function changePage(next: number) {
    setPage(next)
    heading.current?.focus({ preventScroll: true })
    heading.current?.scrollIntoView({ block: 'start', behavior: 'instant' })
  }

  return (
    <div className={styles.library}>
      <div className={styles.libraryControls}>
        <div className={styles.libraryFields}>
          <label className={styles.searchField} htmlFor={`${id}-search`}>
            Search resources
            <input id={`${id}-search`} type="search" placeholder="Try SEO, ads or patient bookings…" value={query}
              onChange={event => { setQuery(event.target.value); setPage(1) }} />
          </label>
          <label htmlFor={`${id}-topic`}>
            Topic
            <select id={`${id}-topic`} value={topic} onChange={event => { setTopic(event.target.value); setPage(1) }}>
              <option value="">All topics</option>
              {topics.map(value => <option key={value} value={value}>{value}</option>)}
            </select>
          </label>
        </div>
        {showKindTabs && <div className={styles.libraryFormats} role="group" aria-label="Content format">
          {formats.map(format => <button key={format.value} type="button" aria-pressed={kind === format.value}
            className={`${styles.tab} ${kind === format.value ? styles.tabActive : ''}`}
            onClick={() => { setKind(format.value); setTopic(''); setPage(1) }}>{format.label}</button>)}
        </div>}
      </div>
      <div className={styles.libraryResults}>
        <div>
          <h2 ref={heading} tabIndex={-1}>Explore resources</h2>
          <p role="status" aria-atomic="true">{matches.length === 0 ? '0 resources' : `${start + 1}–${Math.min(start + PAGE_SIZE, matches.length)} of ${matches.length} resources`}</p>
        </div>
        {filtered && <button type="button" className={styles.clearFilters} onClick={clear}>Clear filters</button>}
      </div>
      {visible.length ? <div className={styles.libraryGrid}>
        {visible.map(item => <div key={item.key}>
          {item.post ? <BlogCard post={item.post} /> : item.video.kind === 'short' ? <ShortCard video={item.video} /> : <VideoCard video={item.video} />}
        </div>)}
      </div> : <div className={styles.libraryEmpty}>
        <h3>{filtered ? 'No matching resources' : 'New lessons are on the way'}</h3>
        <p>{filtered ? 'Try a different keyword or clear your filters to explore the library.' : (emptyText ?? 'Check back soon for practical clinic growth resources.')}</p>
      </div>}
      {pages > 1 && <nav className={styles.libraryPagination} aria-label="Resource pages">
        <button type="button" disabled={currentPage === 1} onClick={() => changePage(currentPage - 1)}>Previous</button>
        <span>Page {currentPage} of {pages}</span>
        <button type="button" disabled={currentPage === pages} onClick={() => changePage(currentPage + 1)}>Next</button>
      </nav>}
    </div>
  )
}
