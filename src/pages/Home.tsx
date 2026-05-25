import Navigation from '../sections/Navigation'
import Hero from '../sections/Hero'
import StatsTicker from '../sections/StatsTicker'
import About from '../sections/About'
import Services from '../sections/Services'
import Achievements from '../sections/Achievements'
import Coaches from '../sections/Coaches'
import Gallery from '../sections/Gallery'
import Testimonials from '../sections/Testimonials'
import Booking from '../sections/Booking'
import Contact from '../sections/Contact'
import Footer from '../sections/Footer'
import WhatsAppButton from '../components/WhatsAppButton'

export default function Home() {
  return (
    <main className="relative min-h-screen bg-background transition-colors duration-500">
      <Navigation />
      <Hero />
      <StatsTicker />
      <About />
      <Services />
      <Achievements />
      <Coaches />
      <Gallery />
      <Testimonials />
      <Booking />
      <Contact />
      <Footer />
      <WhatsAppButton />
    </main>
  )
}
