import Link from 'next/link'
import type { LearnVideo } from '@/content/videos'
import YouTubeEmbed from './YouTubeEmbed'
import styles from './Learn.module.css'

/** The subset of a blog post that list/grid views need (keeps client payloads small). */
export type BlogSummary = {
  slug: string
  title: string
  excerpt: string
  coverImage: string | null
  tags: string[]
  publishedAt: string
  readingTime: number
}

function fmt(iso?: string) {
  if (!iso) return ''
  const d = new Date(iso)
  return isNaN(+d) ? '' : d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' })
}

export function BlogCard({ post }: { post: BlogSummary }) {
  return (
    <article className={`${styles.card} ${styles.blogCard}`}>
      <Link href={`/learn/blog/${post.slug}/`} className={styles.cardLink}>
        <div className={styles.cover}>
          {post.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.coverImage} alt="" loading="lazy" decoding="async" />
          ) : (
            <span className={`hand ${styles.coverFallback}`}>{post.tags[0] ?? 'Read'}</span>
          )}
        </div>
        <div className={styles.cardBody}>
          <span className={styles.kind}>Blog{post.tags[0] ? ` · ${post.tags[0]}` : ''}</span>
          <h3 className={styles.cardTitle}>{post.title}</h3>
          <p className={styles.excerpt}>{post.excerpt}</p>
          <span className={styles.meta}>
            {fmt(post.publishedAt)} · {post.readingTime} min read
          </span>
        </div>
      </Link>
    </article>
  )
}

export function VideoCard({ video }: { video: LearnVideo }) {
  return (
    <article className={`${styles.card} ${styles.videoCard}`}>
      <YouTubeEmbed id={video.id} title={video.title} variant="video" />
      <div className={styles.cardBody}>
        <span className={styles.kind}>Video · {video.topic}</span>
        <h3 className={styles.cardTitle}>{video.title}</h3>
        {video.description && <p className={styles.excerpt}>{video.description}</p>}
        {(video.publishedAt || video.durationSeconds) && <span className={styles.meta}>
          {video.publishedAt && fmt(video.publishedAt)}
          {video.publishedAt && video.durationSeconds ? ' | ' : ''}
          {video.durationSeconds ? `${Math.floor(video.durationSeconds / 60)}:${String(video.durationSeconds % 60).padStart(2, '0')}` : ''}
        </span>}
      </div>
    </article>
  )
}

export function ShortCard({ video }: { video: LearnVideo }) {
  return (
    <article className={`${styles.card} ${styles.shortCard}`}>
      <YouTubeEmbed id={video.id} title={video.title} variant="short" />
      <div className={styles.shortBody}>
        <span className={styles.kind}>Short · {video.topic}</span>
        <h3 className={styles.shortTitle}>{video.title}</h3>
      </div>
    </article>
  )
}
