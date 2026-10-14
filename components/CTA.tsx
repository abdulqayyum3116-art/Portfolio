'use client'

import { motion, useMotionValue, useSpring } from 'framer-motion'
import styles from './CTA.module.css'
import { PlusSign } from './Doodles'

const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL ?? '#call'

export default function CTA() {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 300, damping: 20 })
  const sy = useSpring(y, { stiffness: 300, damping: 20 })

  function magnet(e: React.MouseEvent<HTMLAnchorElement>) {
    const r = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - r.left - r.width / 2) * 0.3)
    y.set((e.clientY - r.top - r.height / 2) * 0.3)
  }

  return (
    <section id="call" style={{ paddingTop: '30px' }}>
      <motion.div
        className={styles.cta}
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* Plus doodles */}
        <PlusSign
          size={48}
          color="#D6336C"
          style={{ position: 'absolute', left: '8%', top: '14%' }}
        />
        <PlusSign
          size={32}
          color="#0B6B66"
          style={{ position: 'absolute', right: '12%', bottom: '18%' }}
        />
        <PlusSign
          size={24}
          color="#D6336C"
          style={{ position: 'absolute', right: '6%', top: '22%', opacity: 0.5 }}
        />

        <span className="hand" style={{ color: '#0B6B66', fontSize: '32px', position: 'relative' }}>
          ready when you are
        </span>
        <h2 className={styles.heading}>Let&apos;s find your leak.</h2>
        <p className={styles.body}>
          In 20 minutes I&apos;ll walk through your Google presence, website and response time,
          and show you the three fixes that would book the most patients. You keep the
          roadmap either way.
        </p>
        <motion.a
          href={bookingUrl}
          className={`btn ${styles.ctaBtn}`}
          style={{ x: sx, y: sy, position: 'relative' }}
          onMouseMove={magnet}
          onMouseLeave={() => { x.set(0); y.set(0) }}
          whileTap={{ scale: 0.96 }}
          target={bookingUrl.startsWith('http') ? '_blank' : undefined}
          rel={bookingUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
        >
          Book a Roadmap Call →
        </motion.a>
      </motion.div>
    </section>
  )
}
