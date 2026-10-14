'use client'

import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import styles from './Hero.module.css'
import { PlusSign, ECGPulse, WavyUnderline, CurvedArrow } from './Doodles'

const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL ?? '#call'

/* Headline words for stagger */
const words1 = ['I', 'help', 'US', 'clinics', 'get']

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}

const wordVariants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

const stickerVariants = {
  hidden: { scale: 0, opacity: 0, rotate: 6 },
  visible: (i: number) => ({
    scale: 1,
    opacity: 1,
    rotate: [6, -2, 2, 0][i % 4],
    transition: { type: 'spring', stiffness: 340, damping: 18, delay: 0.8 + i * 0.12 },
  }),
}

const heroVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut', delay: 0.15 } },
}

export default function Hero() {
  const [underlineDrawn, setUnderlineDrawn] = useState(false)
  const [arrowsDrawn, setArrowsDrawn] = useState(false)

  /* Kick off draw sequence */
  useEffect(() => {
    const t1 = setTimeout(() => setUnderlineDrawn(true), 700)
    const t2 = setTimeout(() => setArrowsDrawn(true), 1000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  /* Collage parallax on mouse move (desktop) */
  const collageRef = useRef<HTMLDivElement>(null)
  const pX = useMotionValue(0)
  const pY = useMotionValue(0)
  const spX = useSpring(pX, { stiffness: 80, damping: 20 })
  const spY = useSpring(pY, { stiffness: 80, damping: 20 })

  /* b2 blob gets a slightly different parallax */
  const b2X = useMotionValue(0)
  const b2Y = useMotionValue(0)
  const spB2X = useSpring(b2X, { stiffness: 60, damping: 18 })
  const spB2Y = useSpring(b2Y, { stiffness: 60, damping: 18 })

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (window.innerWidth < 860) return
      const el = collageRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      pX.set((e.clientX - cx) / rect.width * 18)
      pY.set((e.clientY - cy) / rect.height * 12)
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [pX, pY])

  /* Magnetic on buttons */
  const bx = useMotionValue(0); const by = useMotionValue(0)
  const sbx = useSpring(bx, { stiffness: 300, damping: 18 })
  const sby = useSpring(by, { stiffness: 300, damping: 18 })

  function magnet(e: React.MouseEvent<HTMLAnchorElement>) {
    const r = e.currentTarget.getBoundingClientRect()
    bx.set((e.clientX - r.left - r.width / 2) * 0.3)
    by.set((e.clientY - r.top - r.height / 2) * 0.3)
  }

  return (
    <header className={styles.hero}>
      {/* ── Left column ── */}
      <motion.div
        className={styles.left}
        initial="hidden"
        animate="visible"
        variants={heroVariants}
      >
        {/* Hey label */}
        <motion.span
          className={`hand ${styles.hey}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0 }}
        >
          Hey, I&apos;m Shah{' '}
          <svg width="46" height="22" viewBox="0 0 52 26" fill="none" stroke="#F06C9B"
            strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"
            style={{ verticalAlign: '-3px' }} aria-hidden="true">
            <path d="M2 14h12l5-11 8 22 6-14 4 3h15" />
          </svg>
        </motion.span>

        {/* H1 */}
        <h1 className={styles.headline}>
          <motion.span
            className={styles.words}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            aria-label="I help US clinics get found, chosen, and booked."
          >
            {words1.map((w) => (
              <motion.span key={w} variants={wordVariants} className={styles.word}>
                {w}{' '}
              </motion.span>
            ))}
            <motion.em
              className={styles.found}
              variants={wordVariants}
            >
              found,
              <WavyUnderline className={underlineDrawn ? styles.underlineDrawn : styles.underlineHidden} />
            </motion.em>{' '}
            <motion.span variants={wordVariants} className={styles.word}>chosen,</motion.span>{' '}
            <motion.span variants={wordVariants} className={styles.word}>and</motion.span>{' '}
            <motion.span variants={wordVariants} className={styles.word}>booked.</motion.span>
          </motion.span>
        </h1>

        <motion.p
          className={styles.lead}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.6 }}
        >
          Most clinics don&apos;t have a marketing problem. They have a leak, somewhere between
          Google, the website and the front desk. I&apos;m a PhD-turned-founder, and I build
          the system that plugs it.
        </motion.p>

        <motion.div
          className={styles.buttons}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.75 }}
        >
          <motion.a
            href={bookingUrl}
            className="btn"
            style={{ x: sbx, y: sby }}
            onMouseMove={magnet}
            onMouseLeave={() => { bx.set(0); by.set(0) }}
            whileTap={{ scale: 0.96 }}
          >
            Book a Roadmap Call →
          </motion.a>
          <a
            href="https://codesquad.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="btn alt"
          >
            Explore CodeSquad
          </a>
        </motion.div>

        <motion.div
          className={styles.note}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <span className={`hand ${styles.noteText}`}>20 mins, free, no pitch deck</span>
        </motion.div>
      </motion.div>

      {/* ── Right column — Collage ── */}
      <div
        className={styles.collageWrap}
        ref={collageRef}
        aria-label="Collage of Dr. Shahzaib Hamid photos"
      >
        {/* Blob b1 — large top, stage photo */}
        <motion.div
          className={`${styles.blob} ${styles.b1}`}
          style={{ x: spX, y: spY }}
        >
          <Image
            src="/images/shah-notebook.webp"
            alt="Dr. Shahzaib Hamid holding a hand-drawn patient acquisition plan"
            fill
            sizes="(max-width: 860px) 60vw, 35vw"
            style={{ objectFit: 'cover', objectPosition: 'center top' }}
            priority
          />
        </motion.div>

        {/* Blob b2 — small circle, CodeSquad logo */}
        <motion.div
          className={`${styles.blob} ${styles.b2}`}
          style={{ x: spB2X, y: spB2Y }}
        >
          <span className={styles.csBadge} aria-label="CodeSquad">
            <Image
              src="/images/codesquad-mark.png"
              alt=""
              width={56}
              height={56}
              style={{ borderRadius: 14, background: '#fff' }}
            />
          </span>
          <small className={styles.blobLabel}>CodeSquad</small>
        </motion.div>

        {/* Blob b3 — bottom, portrait */}
        <motion.div
          className={`${styles.blob} ${styles.b3}`}
          style={{ x: spX, y: spY }}
        >
          <Image
            src="/images/search-tablet.webp"
            alt="Google search open on a tablet, where patients find clinics"
            fill
            sizes="(max-width: 860px) 55vw, 32vw"
            style={{ objectFit: 'cover', objectPosition: '65% center' }}
          />
        </motion.div>

        {/* Stickers */}
        {[
          { cls: styles.s2, content: <><span className={styles.stars}>★★★★★</span> &quot;Great experience&quot;</>, rot: '-4deg' },
          { cls: styles.s1, content: <>📅 Appointment confirmed ✓</>, rot: '3deg' },
          { cls: styles.s3, content: <>🔎 &quot;lip filler near me&quot;</>, rot: '-2deg' },
        ].map((s, i) => (
          <motion.div
            key={i}
            className={`${styles.sticker} ${s.cls}`}
            style={{ '--rot': s.rot } as React.CSSProperties}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={stickerVariants}
          >
            {s.content}
          </motion.div>
        ))}

        {/* Doodles */}
        <CurvedArrow
          variant="up"
          className={styles.arrow1}
          style={{
            left: '6%', top: '12%',
            opacity: arrowsDrawn ? 1 : 0,
            transition: 'opacity 0.5s',
          }}
        />
        <CurvedArrow
          variant="left"
          className={styles.arrow2}
          style={{
            left: '-18px', bottom: '6%',
            opacity: arrowsDrawn ? 1 : 0,
            transition: 'opacity 0.5s 0.3s',
          }}
        />
        <PlusSign
          size={46}
          style={{
            position: 'absolute', right: '30%', top: '-30px',
            opacity: arrowsDrawn ? 1 : 0,
            transition: 'opacity 0.5s 0.5s',
          }}
        />
        <ECGPulse
          style={{
            position: 'absolute', right: '-10px', bottom: '20%',
            opacity: arrowsDrawn ? 1 : 0,
            transition: 'opacity 0.5s 0.7s',
          }}
        />
      </div>
    </header>
  )
}
