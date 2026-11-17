import Link from 'next/link'
import { PlusSign } from '@/components/Doodles'
import styles from './Learn.module.css'

type Crumb = { href: string; label: string }

type Props = {
  eyebrow: string
  title: React.ReactNode
  sub: string
  crumbs?: Crumb[]
}

export default function LearnHero({ eyebrow, title, sub, crumbs }: Props) {
  return (
    <header className={styles.hero}>
      <PlusSign size={34} color="#F06C9B" style={{ position: 'absolute', right: '6%', top: '18%' }} />
      <PlusSign size={22} color="#0E9384" style={{ position: 'absolute', right: '18%', bottom: '8%' }} />
      {crumbs && (
        <nav aria-label="Breadcrumb" className={styles.crumbs}>
          {crumbs.map((c, i) => (
            <span key={c.href}>
              {i > 0 && <span aria-hidden="true"> / </span>}
              <Link href={c.href}>{c.label}</Link>
            </span>
          ))}
        </nav>
      )}
      <span className={`hand ${styles.eyebrow}`}>{eyebrow}</span>
      <h1 className={styles.heroTitle}>{title}</h1>
      <p className="sec-sub">{sub}</p>
    </header>
  )
}
