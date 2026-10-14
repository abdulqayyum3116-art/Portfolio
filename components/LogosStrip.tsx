'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion'
import styles from './LogosStrip.module.css'

const logos = ['Harmony MedSpa', 'Dr. Thad', 'CareInn', 'Harmony MedSpa', 'Dr. Thad', 'CareInn']

function CountUp({ target }: { target: number }) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const count = useMotionValue(0)
  const springCount = useSpring(count, { stiffness: 60, damping: 20 })
  const [display, setDisplay] = useState('0')

  useEffect(() => {
    if (!inView) return
    count.set(target)
  }, [inView, count, target])

  useEffect(() => {
    return springCount.on('change', (v) => {
      const rounded = Math.round(v)
      setDisplay(rounded >= 1000 ? `${(rounded / 1000).toFixed(0)}K+` : String(rounded))
    })
  }, [springCount])

  return <b ref={ref}>{display}</b>
}

export default function LogosStrip() {
  return (
    <>
      {/* Logos marquee */}
      <div className={styles.logosOuter} role="region" aria-label="Worked with">
        <div className={styles.logosInner}>
          <div className={styles.track}>
            {[...logos, ...logos].map((name, i) => (
              <span key={i} className={styles.logoItem}>{name}</span>
            ))}
          </div>
        </div>
        <div className={styles.label}>
          <span className="hand" style={{ fontSize: '24px' }}>worked with →</span>
        </div>
      </div>

      {/* Followers */}
      <div className="wrap">
        <div className={styles.follow}>
          <span className="hand" style={{ fontSize: '26px' }}>join the community →</span>
          <motion.a
            className={styles.f}
            href="https://codesquad.ai"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.04 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <CountUp target={15000} />
            <span>followers</span>
          </motion.a>
        </div>
      </div>
    </>
  )
}
