import Navigation from '../sections/Navigation'
// import Hero from '../sections/Hero'
// import Hero1 from '../sections/Hero1'
import Hero2 from '../sections/Hero2'
import StatsTicker from '../sections/StatsTicker'
import About from '../sections/About'
import Services from '../sections/Services'
import Founder from '../sections/Founder'
import Achievements from '../sections/Achievements'
import StarPerformer from '../sections/StarPerformer'
import Coaches from '../sections/Coaches'
import Gallery from '../sections/Gallery'
import Testimonials from '../sections/Testimonials'
import Booking from '../sections/Booking'
import Contact from '../sections/Contact'
import Footer from '../sections/Footer'
import WhatsAppButton from '../components/WhatsAppButton'
import ExpertTestimonials from '@/sections/Expertstestimonial'

export default function Home() {
  return (
    <main className="relative min-h-screen bg-background transition-colors duration-500">
      <Navigation />
      {/* <Hero /> */}
      {/* <Hero1 /> */}
      <Hero2 />
      <StatsTicker />
      <About />
      <Founder />
      <Services />
      <Achievements />
      <StarPerformer />
      <Coaches />
      <Gallery />
      <ExpertTestimonials />
      <Testimonials />
      <Booking />
      <Contact />
      <Footer />
      <WhatsAppButton />
    </main>
  )
}
