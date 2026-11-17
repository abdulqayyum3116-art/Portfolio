import Link from 'next/link'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <span>© 2026 Dr. Shahzaib Hamid · Founder &amp; CEO, CodeSquad</span>
      <span className={styles.links}>
        <Link href="/learn/" className={styles.link}>
          Learning Hub
        </Link>
        <a
          href="https://codesquad.ai"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          codesquad.ai
        </a>
      </span>
    </footer>
  )
}
