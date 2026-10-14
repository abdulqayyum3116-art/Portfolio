'use client'

import React from 'react'
import styles from './Doodles.module.css'

/* ── PlusSign ──────────────────────────────────────────────── */
interface PlusProps {
  size?: number
  color?: string
  className?: string
  animate?: boolean
  style?: React.CSSProperties
}

export function PlusSign({
  size = 54,
  color = '#F06C9B',
  className = '',
  animate = true,
  style,
}: PlusProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 54 54"
      fill="none"
      stroke={color}
      strokeWidth="7"
      strokeLinecap="round"
      className={`${animate ? styles.spark : ''} ${className}`}
      style={style}
      aria-hidden="true"
    >
      <path d="M27 10v34M10 27h34" />
    </svg>
  )
}

/* ── ECG Pulse ─────────────────────────────────────────────── */
interface ECGProps {
  color?: string
  className?: string
  style?: React.CSSProperties
}

export function ECGPulse({ color = '#F06C9B', className = '', style }: ECGProps) {
  return (
    <svg
      width="86"
      height="40"
      viewBox="0 0 86 40"
      fill="none"
      stroke={color}
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${styles.pulse} ${className}`}
      style={style}
      aria-hidden="true"
    >
      <path d="M2 22h18l8-16 12 32 10-24 6 8h28" />
    </svg>
  )
}

/* ── Wavy Underline ────────────────────────────────────────── */
interface WavyProps {
  color?: string
  className?: string
  drawn?: boolean
}

export function WavyUnderline({ color = '#0E9384', className = '', drawn = false }: WavyProps) {
  return (
    <svg
      viewBox="0 0 200 18"
      preserveAspectRatio="none"
      className={`${styles.wavyUnderline} ${drawn ? styles.drawn : ''} ${className}`}
      fill="none"
      stroke={color}
      strokeWidth="5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path
        pathLength="1"
        d="M3 11 C 25 2, 40 17, 62 9 S 100 3, 120 10 S 165 15, 197 5"
      />
    </svg>
  )
}

/* ── Curved Arrow (hero collage) ───────────────────────────── */
interface ArrowProps {
  className?: string
  style?: React.CSSProperties
  variant?: 'up' | 'left'
}

export function CurvedArrow({ className = '', style, variant = 'up' }: ArrowProps) {
  if (variant === 'left') {
    return (
      <svg
        className={`${styles.drawArrow} ${className}`}
        style={style}
        width="200"
        height="120"
        viewBox="0 0 200 120"
        fill="none"
        stroke="#0E9384"
        strokeWidth="4"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path pathLength="1" d="M190 50 C 140 10, 90 60, 14 60" />
        <path pathLength="1" d="M14 60 L 34 46 M14 60 L 34 74" />
      </svg>
    )
  }
  return (
    <svg
      className={`${styles.drawArrow} ${className}`}
      style={style}
      width="220"
      height="200"
      viewBox="0 0 220 200"
      fill="none"
      stroke="#0E9384"
      strokeWidth="4"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path pathLength="1" d="M20 150 C 30 60, 100 20, 205 35" />
      <circle pathLength="1" cx="20" cy="158" r="8" />
    </svg>
  )
}

/* ── Dotted Arrow (between leak cards) ─────────────────────── */
interface DottedArrowProps {
  className?: string
  style?: React.CSSProperties
  drawn?: boolean
}

export function DottedArrow({ className = '', style, drawn = false }: DottedArrowProps) {
  return (
    <svg
      className={`${styles.dottedArrow} ${className}`}
      style={{
        strokeDashoffset: drawn ? 0 : 1,
        ...style,
      }}
      width="90"
      height="50"
      viewBox="0 0 90 50"
      fill="none"
      stroke="#0E9384"
      strokeWidth="5"
      strokeLinecap="round"
      strokeDasharray="1 9"
      aria-hidden="true"
    >
      <path d="M4 40 C 25 0, 60 0, 84 26 M84 26 L 66 24 M84 26 L 80 8" />
    </svg>
  )
}
