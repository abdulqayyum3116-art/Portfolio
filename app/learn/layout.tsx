import Nav from '@/components/Nav'
import CTA from '@/components/CTA'
import Footer from '@/components/Footer'

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <div className="wrap">
        <Nav />
        {children}
        <CTA />
        <Footer />
      </div>
    </main>
  )
}
