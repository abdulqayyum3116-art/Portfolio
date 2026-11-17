'use client'

import { useState } from 'react'
import styles from './Learn.module.css'

type Props = {
  id: string
  title: string
  variant?: 'video' | 'short'
}

/**
 * Lite YouTube embed: renders only a thumbnail + play button until clicked,
 * then swaps in the privacy-enhanced (youtube-nocookie) iframe with autoplay.
 * Keeps pages fast — no YouTube JS is loaded until the visitor asks for it.
 */
export default function YouTubeEmbed({ id, title, variant = 'video' }: Props) {
  const [playing, setPlaying] = useState(false)
  const [thumbFailed, setThumbFailed] = useState(false)
  const ratio = variant === 'short' ? styles.ratioShort : styles.ratioVideo

  return (
    <div className={`${styles.player} ${ratio}`}>
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          className={styles.playBtn}
          onClick={() => setPlaying(true)}
          aria-label={`Play video: ${title}`}
        >
          {!thumbFailed && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
              alt=""
              loading="lazy"
              decoding="async"
              onError={() => setThumbFailed(true)}
            />
          )}
          <span className={styles.playIcon} aria-hidden="true">
            <svg viewBox="0 0 24 24" width="26" height="26">
              <path d="M8 5v14l11-7z" fill="currentColor" />
            </svg>
          </span>
        </button>
      )}
    </div>
  )
}
