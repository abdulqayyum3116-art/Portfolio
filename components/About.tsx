'use client'

import { useRef } from 'react'
import { motion, useInView, type Variants } from 'framer-motion'
import Image from 'next/image'
import styles from './About.module.css'
import { PlusSign } from './Doodles'

const beliefs = [
  {
    icon: '✏️',
    title: 'Teach, don\'t discount',
    body: 'Patients choose the clinic that helped them understand, not the one shouting 50% off.',
  },
  {
    icon: '⚡',
    title: 'Speed beats spend',
    body: 'A 60-second reply does more than another $1,000 in ads.',
  },
  {
    icon: '🪑',
    title: 'Measure the booked patient',
    body: "If it isn't tracked to the chair, it's a guess.",
  },
  {
    icon: '🩺',
    title: 'Your doctor is the brand',
    body: 'Real faces and results beat stock photos every time.',
  },
]

const beliefVariants: Variants = {
  hidden: { opacity: 0, y: 32, rotate: 0 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotate: i % 2 === 0 ? -1.5 : 1.5,
    transition: { type: 'spring', stiffness: 200, damping: 22, delay: i * 0.1 },
  }),
}

export default function About() {
  const beliefRef = useRef<HTMLDivElement>(null)
  const beliefInView = useInView(beliefRef, { once: true, margin: '-80px' })
  const aboutRef = useRef<HTMLDivElement>(null)
  const aboutInView = useInView(aboutRef, { once: true, margin: '-80px' })

  return (
    <section id="about" style={{ paddingTop: '60px' }}>
      {/* Two-column about */}
      <motion.div
        className={styles.about}
        ref={aboutRef}
        initial={{ opacity: 0, y: 32 }}
        animate={aboutInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* Portrait column */}
        <div className={styles.portrait}>
          <div className={styles.portraitBlob}>
            <Image
              src="/images/shah-portrait.webp"
              alt="Dr. Shahzaib Hamid, Founder & CEO of CodeSquad"
              fill
              sizes="(max-width: 860px) 90vw, 40vw"
              style={{ objectFit: 'cover', objectPosition: 'center top', borderRadius: 'inherit' }}
            />
          </div>

          {/* Credential stickers */}
          <div className={`sticker ${styles.credSticker1}`}>🎓 PhD, Computer Vision</div>
          <div className={`sticker ${styles.credSticker2}`}>🦷 Dentists in my family</div>

          {/* Plus doodle */}
          <PlusSign
            size={44}
            style={{ position: 'absolute', right: '10px', top: '-16px' }}
          />
        </div>

        {/* Text column */}
        <div className={styles.text}>
          <h2 className="sec-h" style={{ fontSize: 'clamp(32px, 4.6vw, 50px)' }}>
            Hi, I&apos;m Shah. Both my parents are doctors.
          </h2>
          <p style={{ marginTop: '22px' }}>
            I grew up watching brilliant clinicians struggle to get patients through the door,
            not because their care was worse, but because someone else answered first. A
            dentist in my family runs her own clinic, and I saw how hard it is.
          </p>
          <p>
            So I took what I learned finding patterns in noisy data and started{' '}
            <b>CodeSquad</b>: SEO, AEO, Google Ads and Meta Ads for med spas, dentists,
            doctors and plastic surgeons. I&apos;m not here to sell you &quot;AI&quot; or a shiny tool.
            I&apos;m here to get more of the right patients booked and show you the numbers that
            prove it.
          </p>
          <blockquote className={styles.pull}>
            A practice rarely has one big problem. It has a handful of small leaks.
          </blockquote>
          <div className={styles.chips}>
            {['SEO & AEO', 'Google Ads', 'Meta Ads', 'Med spas', 'Dentists', 'Plastic surgeons'].map((c) => (
              <span key={c} className={styles.chip}>{c}</span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Beliefs grid */}
      <div className={styles.beliefs} ref={beliefRef}>
        {beliefs.map((b, i) => (
          <motion.div
            key={b.title}
            className={styles.belief}
            custom={i}
            initial="hidden"
            animate={beliefInView ? 'visible' : 'hidden'}
            variants={beliefVariants}
            whileHover={{
              y: -6,
              transition: { type: 'spring', stiffness: 400, damping: 20 },
            }}
          >
            <span aria-hidden="true">{b.icon}</span>
            <b>{b.title}</b>
            <p>{b.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
