import type { Metadata } from 'next'
import HubTabs from '@/components/learn/HubTabs'
import styles from '@/components/learn/Learn.module.css'
import { getAllPosts } from '@/lib/blog'
import { getAllVideos, videoJsonLd } from '@/lib/videos'
import { jsonLdScript, toSummary } from '@/lib/learn'
import { siteUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Learning Hub · Dr. Shahzaib Hamid',
  description:
    'Free playbooks on getting clinics Found, Chosen and Booked — blogs, YouTube videos and Shorts on medical SEO, AEO, Google Ads and Meta Ads.',
  alternates: { canonical: `${siteUrl}/learn/` },
  openGraph: {
    title: 'Learning Hub · Dr. Shahzaib Hamid',
    description: 'Blogs, videos and Shorts on growing a clinic: SEO, AEO, Google Ads and Meta Ads.',
    url: `${siteUrl}/learn/`,
    images: ['/og-image.jpg'],
  },
}

export default async function LearnPage() {
  const posts = (await getAllPosts()).map(toSummary)
  const allVideos = await getAllVideos()
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Learning Hub',
    url: `${siteUrl}/learn/`,
    hasPart: videoJsonLd(allVideos),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(jsonLd)} />

      <header className={styles.libraryHero}>
        <span className={`hand ${styles.libraryEyebrow}`}>Free playbooks for clinic growth</span>
        <h1>Learning <em>Hub</em></h1>
        <p>Practical reads, videos and reels to help your clinic get found, chosen and booked.</p>
      </header>
      <section className={styles.librarySection} aria-label="Resource library">
        <HubTabs posts={posts} videos={allVideos} compactLibrary />
      </section>
    </>
  )
}
