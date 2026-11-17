import Link from 'next/link'
import type { LearnVideo } from '@/content/videos'
import { ShortCard } from './Cards'
import styles from './Learn.module.css'

export default function ShortsRail({ shorts }: { shorts: LearnVideo[] }) {
  if (!shorts.length) return null
  return (
    <section className={styles.railSection} aria-labelledby="shorts-rail-h">
      <div className={styles.sectionHead}>
        <h2 id="shorts-rail-h" className={styles.sectionTitle}>
          Quick hits <span className="hand">under 60 seconds</span>
        </h2>
        <Link href="/learn/shorts/" className={styles.seeAll}>
          All reels →
        </Link>
      </div>
      <div className={styles.rail}>
        {shorts.map((s) => (
          <div key={s.id} className={styles.railItem}>
            <ShortCard video={s} />
          </div>
        ))}
      </div>
    </section>
  )
}
