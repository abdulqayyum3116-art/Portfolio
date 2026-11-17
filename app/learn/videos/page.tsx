import type { Metadata } from 'next'
import LearnHero from '@/components/learn/LearnHero'
import HubTabs from '@/components/learn/HubTabs'
import styles from '@/components/learn/Learn.module.css'
import { getVideos, videoJsonLd } from '@/lib/videos'
import { jsonLdScript } from '@/lib/learn'
import { siteUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Videos · Learning Hub · Dr. Shahzaib Hamid',
  description: 'YouTube deep dives on AI, software development, clinic growth, SEO and marketing.',
  openGraph: {
    type: 'website', title: 'Videos - Learning Hub', description: 'Video walkthroughs on AI, coding, SEO and clinic growth.',
    url: `${siteUrl}/learn/videos/`, images: ['/og-image.jpg'],
  },
  twitter: { card: 'summary_large_image', title: 'Videos - Learning Hub', description: 'Video walkthroughs on AI, coding, SEO and clinic growth.', images: ['/og-image.jpg'] },
  alternates: { canonical: `${siteUrl}/learn/videos/` },
}

export default async function VideosPage() {
  const videos = await getVideos()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript({ '@context': 'https://schema.org', '@graph': videoJsonLd(videos) })}
      />
      <LearnHero
        crumbs={[{ href: '/learn/', label: 'Learning Hub' }]}
        eyebrow="press play"
        title="Videos"
        sub="Explore AI tutorials, coding walkthroughs and clinic growth strategies from my YouTube channel."
      />
      <section className={styles.section}>
        <HubTabs videos={videos} showKindTabs={false} emptyText="No videos yet — subscribe on YouTube to catch the first one." />
      </section>
    </>
  )
}
