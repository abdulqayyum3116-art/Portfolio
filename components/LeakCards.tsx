'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './LeakCards.module.css'

const cards = [
  {
    ico: '🔎',
    title: 'Found',
    body: 'Can a patient searching "lip filler near me" actually see you? Google Maps, local video, AI search answers.',
    note: 'leak: a dead Google profile',
    cls: styles.card1,
  },
  {
    ico: '⭐',
    title: 'Chosen',
    body: 'Once they find you, do they trust you over the next three tabs? Real results, doctor credentials, clear pricing.',
    note: 'leak: coupons & stock photos',
    cls: styles.card2,
  },
  {
    ico: '📅',
    title: 'Booked',
    body: 'When they raise a hand, how fast does someone answer? Instant replies, calendar links, warm follow-up.',
    note: 'leak: 6-hour replies',
    cls: styles.card3,
  },
]

const cardVariants = {
  hidden: { opacity: 0, y: 48, rotate: 0 },
  visible: (i: number) => ({
    opacity: 1,
    y: [24, 0][i % 2 ? 1 : 0],
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 24,
      delay: i * 0.14,
    },
  }),
}

const arrowVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 1.2, ease: 'easeInOut', delay: 0.6 },
  },
}

export default function LeakCards() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="system" className={styles.section}>
      <h2 className="sec-h">
        Your clinic isn&apos;t short on patients. It&apos;s leaking them.
      </h2>
      <p className="sec-sub">
        Every patient takes the same three steps before they sit in your chair.
        Lose them at any one, and the ads, reviews and beautiful website don&apos;t matter.
      </p>

      <div className={styles.three} ref={ref}>
        {cards.map((card, i) => (
          <motion.article
            key={card.title}
            className={`${styles.leak} ${card.cls}`}
            custom={i}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={cardVariants}
            whileHover={{
              rotateZ: i === 0 ? -2.5 : i === 1 ? 1.5 : -1.2,
              y: -8,
              boxShadow: '0 24px 40px -12px rgba(27,27,58,0.25)',
              transition: { type: 'spring', stiffness: 400, damping: 20 },
            }}
          >
            <div className={styles.ico} aria-hidden="true">{card.ico}</div>
            <h3>{card.title}</h3>
            <p>{card.body}</p>
            <span className={`hand ${styles.leakNote}`}>{card.note}</span>
          </motion.article>
        ))}

        {/* Dotted arrows between cards */}
        {[{ left: '29%' }, { left: '63%' }].map((pos, i) => (
          <svg
            key={i}
            className={styles.arrowGap}
            style={{ left: pos.left }}
            viewBox="0 0 90 50"
            fill="none"
            stroke="#0E9384"
            strokeWidth="5"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <motion.path
              d="M4 40 C 25 0, 60 0, 84 26 M84 26 L 66 24 M84 26 L 80 8"
              strokeDasharray="1 9"
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              variants={arrowVariants}
            />
          </svg>
        ))}
      </div>
    </section>
  )
}
