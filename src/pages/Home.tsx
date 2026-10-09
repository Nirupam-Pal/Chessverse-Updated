// import Hero from '../sections/Hero'
// import Hero1 from '../sections/Hero1'
import Hero2 from '../sections/Hero2'
import StatsTicker from '../sections/StatsTicker'
import About from '../sections/About'
import Services from '../sections/Services'
import Achievements from '../sections/Achievements'
import StarPerformer from '../sections/StarPerformer'
import Gallery from '../sections/Gallery'
import Testimonials from '../sections/Testimonials'
import Booking from '../sections/Booking'
import Contact from '../sections/Contact'
import ExpertTestimonials from '@/sections/Expertstestimonial'

// Navigation, Footer and the WhatsApp button live in SiteLayout (shared by every page).
// The Founder section now lives on its own page (/about); Coaches is retired from the site.
export default function Home() {
  return (
    <>
      {/* <Hero /> */}
      {/* <Hero1 /> */}
      <Hero2 />
      <StatsTicker />
      <About />
      <Services />
      <Achievements />
      <StarPerformer />
      <Gallery />
      <ExpertTestimonials />
      <Testimonials />
      <Booking />
      <Contact />
    </>
  )
}
