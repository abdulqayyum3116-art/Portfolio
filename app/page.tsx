import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import LogosStrip from '@/components/LogosStrip'
import LeakCards from '@/components/LeakCards'
import SignalGraphic from '@/components/SignalGraphic'
import About from '@/components/About'
import Ways from '@/components/Ways'
import CTA from '@/components/CTA'
import Footer from '@/components/Footer'

export default function HomePage() {
  return (
    <main>
      <div className="wrap">
        <Nav />
        <Hero />
      </div>
      <LogosStrip />
      <div className="wrap">
        <LeakCards />
        <SignalGraphic />
        <About />
        <Ways />
        <CTA />
        <Footer />
      </div>
    </main>
  )
}
