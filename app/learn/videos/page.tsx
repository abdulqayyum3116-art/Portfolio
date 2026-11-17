import type { Metadata } from 'next'
import LearnHero from '@/components/learn/LearnHero'
import HubTabs from '@/components/learn/HubTabs'
import styles from '@/components/learn/Learn.module.css'
import { getVideos, videoJsonLd } from '@/lib/videos'
import { jsonLdScript } from '@/lib/learn'
import { siteUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Videos · Learning Hub · Dr. Shahzaib Hamid',
  description: 'YouTube deep dives on clinic growth: SEO, AEO, Google Ads, Meta Ads and faster bookings.',
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
        sub="Walkthroughs, teardowns and strategy breakdowns. Grab a coffee."
      />
      <section className={styles.section}>
        <HubTabs videos={videos} showKindTabs={false} emptyText="No videos yet — subscribe on YouTube to catch the first one." />
      </section>
    </>
  )
}
