'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import styles from './CategoryCards.module.css'

type Counts = { blogs: number; videos: number; shorts: number }

const MotionLink = motion.create(Link)

function plural(n: number, one: string, many: string) {
  return `${n} ${n === 1 ? one : many}`
}

export default function CategoryCards({ counts }: { counts: Counts }) {
  const cards = [
    {
      href: '/learn/blog/',
      ico: '📝',
      title: 'Blogs',
      body: 'Step-by-step playbooks and deep dives you can read, save and share with your team.',
      note: counts.blogs ? plural(counts.blogs, 'article', 'articles') : 'long reads',
      cta: 'Start reading',
      cls: styles.card1,
      tilt: -2,
    },
    {
      href: '/learn/videos/',
      ico: '▶️',
      title: 'YouTube',
      body: 'Walkthroughs, ad teardowns and strategy breakdowns. Grab a coffee and press play.',
      note: counts.videos ? plural(counts.videos, 'video', 'videos') : 'deep dives',
      cta: 'Watch videos',
      cls: styles.card2,
      tilt: 1.5,
    },
    {
      href: '/learn/shorts/',
      ico: '⚡',
      title: 'Reels',
      body: 'One idea, sixty seconds. Quick wins you can apply to your clinic today.',
      note: counts.shorts ? plural(counts.shorts, 'reel', 'reels') : 'under 60s',
      cta: 'Watch reels',
      cls: styles.card3,
      tilt: -1.2,
    },
  ]

  return (
    <section className={styles.section} aria-labelledby="pick-format-h">
      <h2 id="pick-format-h" className={styles.heading}>
        How do you like to learn? <span className="hand">pick one</span>
      </h2>

      <div className={styles.three}>
        {cards.map((c, i) => (
          <MotionLink
            key={c.href}
            href={c.href}
            className={`${styles.card} ${c.cls}`}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ type: 'spring', stiffness: 200, damping: 24, delay: i * 0.12 }}
            whileHover={{ rotateZ: c.tilt, y: -8, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
            whileTap={{ scale: 0.98 }}
          >
            <div className={styles.top}>
              <span className={styles.ico} aria-hidden="true">{c.ico}</span>
              <span className={`hand ${styles.note}`}>{c.note}</span>
            </div>
            <h3 className={styles.title}>{c.title}</h3>
            <p className={styles.body}>{c.body}</p>
            <span className={styles.cta}>
              {c.cta} <span aria-hidden="true" className={styles.arrow}>→</span>
            </span>
          </MotionLink>
        ))}
      </div>
    </section>
  )
}
