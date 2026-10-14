'use client'

import { motion, useMotionValue, useSpring } from 'framer-motion'
import styles from './Ways.module.css'

const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL ?? '#call'

function MagneticBtn({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 300, damping: 20 })
  const sy = useSpring(y, { stiffness: 300, damping: 20 })

  function onMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const r = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - r.left - r.width / 2) * 0.3)
    y.set((e.clientY - r.top - r.height / 2) * 0.3)
  }

  return (
    <motion.a
      href={href}
      className={className ?? 'btn'}
      style={{ x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={() => { x.set(0); y.set(0) }}
      whileTap={{ scale: 0.96 }}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
    >
      {children}
    </motion.a>
  )
}

export default function Ways() {
  return (
    <section id="work" style={{ paddingTop: '60px', paddingBottom: '30px' }}>
      <h2 className="sec-h">Two ways I help.</h2>
      <p className="sec-sub">
        Every engagement starts with a Roadmap Call. If we&apos;re not a fit, you still leave
        with the plan.
      </p>

      <div className={styles.ways}>
        {/* The Build */}
        <motion.div
          className={styles.way}
          initial={{ opacity: 0, x: -32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        >
          <span className="hand" style={{ color: 'var(--lav)', fontSize: '26px' }}>step 1</span>
          <h3>The Build</h3>
          <p>I install the full Found → Chosen → Booked engine in your clinic.</p>
          <ul>
            <li>Full leak audit across Google, social, ads, site and front desk</li>
            <li>Google Business Profile &amp; local SEO rebuild</li>
            <li>Single-treatment landing pages</li>
            <li>60-second replies and booking links</li>
          </ul>
          <MagneticBtn href={bookingUrl}>Book a Roadmap Call →</MagneticBtn>
        </motion.div>

        {/* Growth Retainer */}
        <motion.div
          className={`${styles.way} ${styles.dark}`}
          initial={{ opacity: 0, x: 32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55, ease: 'easeOut', delay: 0.12 }}
        >
          <span className={styles.tag}>most popular</span>
          <span className="hand" style={{ fontSize: '26px' }}>step 2</span>
          <h3>Growth Retainer</h3>
          <p>We run and improve the engine every month so it keeps compounding.</p>
          <ul>
            <li>Weekly posts and review management</li>
            <li>Ongoing SEO, AEO and content</li>
            <li>Ad creative and page testing</li>
            <li>Monthly report: leads, bookings, cost per patient</li>
          </ul>
          <p style={{ margin: '18px 0 0' }}>
            <MagneticBtn
              href="https://codesquad.ai"
              className={styles.workBtn}
            >
              Work with me at codesquad.ai →
            </MagneticBtn>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
