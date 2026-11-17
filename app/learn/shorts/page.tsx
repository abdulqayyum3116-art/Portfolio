import type { Metadata } from 'next'
import LearnHero from '@/components/learn/LearnHero'
import HubTabs from '@/components/learn/HubTabs'
import styles from '@/components/learn/Learn.module.css'
import { getShorts, videoJsonLd } from '@/lib/videos'
import { jsonLdScript } from '@/lib/learn'
import { siteUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Shorts · Learning Hub · Dr. Shahzaib Hamid',
  description: '60-second tips on getting more patients from Google, AI search and social ads.',
  openGraph: {
    type: 'website', title: 'Reels ? Learning Hub', description: 'Quick tips on getting more patients from search and social media.',
    url: `${siteUrl}/learn/shorts/`, images: ['/og-image.jpg'],
  },
  twitter: { card: 'summary_large_image', title: 'Reels ? Learning Hub', description: 'Quick tips on getting more patients from search and social media.', images: ['/og-image.jpg'] },
  alternates: { canonical: `${siteUrl}/learn/shorts/` },
}

export default async function ShortsPage() {
  const shorts = await getShorts()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript({ '@context': 'https://schema.org', '@graph': videoJsonLd(shorts) })}
      />
      <LearnHero
        crumbs={[{ href: '/learn/', label: 'Learning Hub' }]}
        eyebrow="under 60 seconds"
        title="Shorts"
        sub="One idea, one minute. Quick wins you can apply to your clinic today."
      />
      <section className={styles.section}>
        <HubTabs videos={shorts} showKindTabs={false} emptyText="No Shorts yet — they're on the way." />
      </section>
    </>
  )
}
