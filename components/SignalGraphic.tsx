'use client'

import { useRef } from 'react'
import { motion, useInView, type Variants } from 'framer-motion'
import styles from './SignalGraphic.module.css'

const fadeIn = (delay = 0) => ({
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.7, delay } },
})

const drawPath: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 2, ease: 'easeInOut', delay: 0.6 },
  },
}

const popIn: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: 'spring', stiffness: 350, damping: 18, delay: 2.2 },
  },
}

export default function SignalGraphic() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-120px' })

  return (
    <section style={{ paddingTop: '50px', paddingBottom: '90px' }}>
      <div className={styles.signal} ref={ref}>
        {/* Left text */}
        <div>
          <span className="hand" style={{ color: '#FFE29A', fontSize: '26px' }}>
            why gait analysis?
          </span>
          <h2 className={styles.heading}>
            I spent my PhD teaching computers how people walk.
          </h2>
          <p className={styles.body}>
            Thousands of frames, tiny signals, one pattern most people miss. Fixing a
            clinic&apos;s growth is the same job: a handful of small leaks that quietly cost
            a fortune.
          </p>
        </div>

        {/* SVG graphic */}
        <motion.svg
          className={styles.sigsvg}
          viewBox="0 0 520 260"
          fill="none"
          strokeLinecap="round"
          role="img"
          aria-label="Noisy data resolving into one clear teal pattern with the leak highlighted"
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {/* Noise lines */}
          <motion.g
            stroke="#5b5b8a"
            strokeWidth="2"
            variants={fadeIn(0)}
          >
            <path d="M10 130 l18 -40 l16 70 l14 -90 l18 100 l14 -30 l16 -60 l18 80 l14 -70 l16 50 l18 -20 l14 -50 l16 70 l14 -30 l18 20 l14 -60 l18 50 l16 -10 l14 -30 l14 20" />
            <path d="M10 170 l22 30 l16 -50 l18 60 l20 -70 l14 40 l20 20 l16 -60 l18 50 l16 -20 l20 -30 l16 40 l16 -10 l20 -20 l14 30 l20 -50 l16 30 l14 -10 l12 20" />
          </motion.g>

          {/* Teal pattern line drawing */}
          <motion.path
            stroke="#5EEAD4"
            strokeWidth="6"
            d="M10 150 C 70 150, 80 60, 140 60 S 210 200, 270 200 S 340 70, 400 70 S 460 130, 510 100"
            variants={drawPath}
          />

          {/* Leak circle */}
          <motion.g variants={popIn}>
            <circle cx="270" cy="200" r="13" stroke="#FFE29A" strokeWidth="4" />
            <text
              x="290"
              y="238"
              fill="#FFE29A"
              fontFamily="var(--font-caveat), cursive"
              fontSize="28"
              fontWeight="700"
            >
              ← the leak
            </text>
          </motion.g>

          {/* Labels */}
          <motion.text
            x="10"
            y="30"
            fill="#CFCFE8"
            fontFamily="var(--font-caveat), cursive"
            fontSize="26"
            fontWeight="700"
            variants={fadeIn(0)}
          >
            noise
          </motion.text>
          <motion.text
            x="440"
            y="40"
            fill="#5EEAD4"
            fontFamily="var(--font-caveat), cursive"
            fontSize="26"
            fontWeight="700"
            variants={fadeIn(2.4)}
          >
            pattern ✦
          </motion.text>
        </motion.svg>
      </div>
    </section>
  )
}
