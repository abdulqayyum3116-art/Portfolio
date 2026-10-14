'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import styles from './Nav.module.css'

const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL ?? '#call'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Magnetic effect on Book a Call button */
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 300, damping: 20 })
  const springY = useSpring(y, { stiffness: 300, damping: 20 })

  function handleMagnet(e: React.MouseEvent<HTMLAnchorElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    x.set((e.clientX - cx) * 0.35)
    y.set((e.clientY - cy) * 0.35)
  }

  function resetMagnet() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.nav
      className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <Link href="/" className={styles.logo} aria-label="Shahzaib Hamid — home">
        <b aria-hidden="true">SH</b>
        <span>Shahzaib Hamid</span>
      </Link>

      <div className={styles.links}>
        <a href="#system" className={styles.navLink}>The system</a>
        <a href="#about" className={styles.navLink}>About</a>
        <a
          href="https://codesquad.ai"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.navLink}
        >
          Work with me
        </a>
        <motion.a
          href={bookingUrl}
          className={`btn ${styles.callBtn}`}
          style={{ x: springX, y: springY }}
          onMouseMove={handleMagnet}
          onMouseLeave={resetMagnet}
          whileTap={{ scale: 0.96 }}
        >
          Book a call
        </motion.a>
      </div>
    </motion.nav>
  )
}
