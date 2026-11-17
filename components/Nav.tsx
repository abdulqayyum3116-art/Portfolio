'use client'

import Link from 'next/link'
import { useState, useEffect, useRef, useId } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import styles from './Nav.module.css'

import { bookingUrl } from '@/lib/booking'

export default function Nav() {
  const [open, setOpen] = useState(false)
  const toggle = useRef<HTMLButtonElement>(null)
  const menuId = useId()
  const reducedMotion = useReducedMotion()
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
    if (reducedMotion) return
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
      aria-label="Main navigation"
      onKeyDown={event => {
        if (event.key === 'Escape' && open) { setOpen(false); toggle.current?.focus() }
      }}
      onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false)
      }}
      className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <Link href="/" className={styles.logo} aria-label="Shahzaib Hamid — home">
        <b aria-hidden="true">SH</b>
        <span>Shahzaib Hamid</span>
      </Link>

      <button ref={toggle} type="button" className={styles.menuToggle}
        aria-expanded={open} aria-controls={menuId} onClick={() => setOpen(!open)}>
        {open ? 'Close' : 'Menu'}
      </button>
      <div id={menuId} className={`${styles.links} ${open ? styles.linksOpen : ''}`}
        onClick={event => { if ((event.target as HTMLElement).closest('a')) setOpen(false) }}>

        <Link href="/#system" className={styles.navLink}>The system</Link>
        <Link href="/#about" className={styles.navLink}>About</Link>
        <Link href="/learn/" className={styles.navLink}>Learn</Link>
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
          style={{ x: reducedMotion ? 0 : springX, y: reducedMotion ? 0 : springY }}
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
