import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import LearnHero from '@/components/learn/LearnHero'
import { VideoCard } from '@/components/learn/Cards'
import YouTubeEmbed from '@/components/learn/YouTubeEmbed'
import styles from '@/components/learn/Learn.module.css'
import { formatDate, getAllPosts, getPostBySlug } from '@/lib/blog'
import { markdownToHtml, sanitizeContent } from '@/lib/markdown'
import { getRelatedVideos } from '@/lib/videos'
import { jsonLdScript } from '@/lib/learn'
import { siteUrl } from '@/lib/site'

// Static export: only slugs returned below exist; anything else is a 404.
export const dynamicParams = false

// With output: 'export', at least one param is required. If Supabase returns no
// posts (or env vars are missing locally), emit a placeholder that renders a 404.
const NO_POSTS_PLACEHOLDER = '__no-posts__'

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.length ? posts.map((p) => ({ slug: p.slug })) : [{ slug: NO_POSTS_PLACEHOLDER }]
}

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}

  const url = `${siteUrl}/learn/blog/${post.slug}/`
  const images = [post.coverImage ?? '/og-image.jpg']

  return {
    title: `${post.title} · Dr. Shahzaib Hamid`,
    description: post.excerpt,
    keywords: post.tags,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      url,
      images,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author ?? 'Dr. Shahzaib Hamid'],
      tags: post.tags,
    },
    twitter: { card: 'summary_large_image', title: post.title, description: post.excerpt, images },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  const html = post.contentFormat === 'html' ? sanitizeContent(post.content) : markdownToHtml(post.content)
  const related = await getRelatedVideos(post.tags, 2, post.youtubeId)
  const url = `${siteUrl}/learn/blog/${post.slug}/`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage ?? `${siteUrl}/og-image.jpg`,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    keywords: post.tags.join(', '),
    mainEntityOfPage: url,
    url,
    author: { '@id': `${siteUrl}/#person` },
    publisher: { '@id': `${siteUrl}/#org` },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(jsonLd)} />

      <article className={styles.article}>
        <LearnHero
          crumbs={[
            { href: '/learn/', label: 'Learning Hub' },
            { href: '/learn/blog/', label: 'Blog' },
          ]}
          eyebrow={post.tags[0] ?? 'blog'}
          title={post.title}
          sub={`${formatDate(post.publishedAt)} · ${post.readingTime} min read${post.author ? ` · ${post.author}` : ''}`}
        />

        {post.youtubeId ? (
          <figure className={styles.articleCover}>
            <YouTubeEmbed id={post.youtubeId} title={post.title} />
          </figure>
        ) : (
          post.coverImage && (
            <figure className={styles.articleCover}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.coverImage} alt="" />
            </figure>
          )
        )}

        {/* Both CMS HTML and parsed Markdown are sanitized before rendering. */}
        <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />

        {post.tags.length > 0 && (
          <ul className={styles.tagList} aria-label="Tags">
            {post.tags.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        )}
      </article>

      {related.length > 0 && (
        <section className={styles.section} aria-labelledby="related-h">
          <div className={styles.sectionHead}>
            <h2 id="related-h" className={styles.sectionTitle}>
              Prefer to watch? <span className="hand">related videos</span>
            </h2>
            <Link href="/learn/videos/" className={styles.seeAll}>
              All videos →
            </Link>
          </div>
          <div className={styles.featured}>
            {related.map((v) => (
              <VideoCard key={v.id} video={v} />
            ))}
          </div>
        </section>
      )}
    </>
  )
}
