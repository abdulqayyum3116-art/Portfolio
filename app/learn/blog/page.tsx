import type { Metadata } from 'next'
import LearnHero from '@/components/learn/LearnHero'
import HubTabs from '@/components/learn/HubTabs'
import styles from '@/components/learn/Learn.module.css'
import { getAllPosts } from '@/lib/blog'
import { toSummary } from '@/lib/learn'
import { siteUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Blog · Learning Hub · Dr. Shahzaib Hamid',
  description: 'Long-form guides on medical SEO, AEO, Google Ads, Meta Ads and patient booking for US clinics.',
  alternates: { canonical: `${siteUrl}/learn/blog/` },
}

export default async function BlogIndexPage() {
  const posts = (await getAllPosts()).map(toSummary)

  return (
    <>
      <LearnHero
        crumbs={[{ href: '/learn/', label: 'Learning Hub' }]}
        eyebrow="long reads"
        title="The Blog"
        sub="Deep dives and step-by-step playbooks for clinics, med spas, dentists and plastic surgeons."
      />
      <section className={styles.section}>
        <HubTabs posts={posts} showKindTabs={false} emptyText="No posts published yet — check back soon." />
      </section>
    </>
  )
}
