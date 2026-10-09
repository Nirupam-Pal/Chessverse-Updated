import { useRef } from 'react'
import { Link } from 'react-router'
import { motion, useInView } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { EASE_OUT } from '@/lib/motion'
import { prefetchRoute, useSiteNav } from '@/lib/routes'
import StudentBubbles from '@/components/StudentBubbles'

const highlights = [
  { value: '1,500+', label: 'Students trained' },
  { value: '12+', label: 'Years of coaching' },
  { value: '#1', label: 'Academy in Tripura' },
]

// Landing-page overview; the full story (founder, journey, beliefs) lives on /about (AboutPage).
export default function About() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const go = useSiteNav()

  return (
    <section id="about" className="relative w-full bg-twilight section-padding overflow-hidden">
      <div className="absolute top-0 right-0 w-[520px] h-[520px] rounded-full bg-royal/15 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[420px] h-[420px] rounded-full bg-gold/5 blur-[120px] pointer-events-none" />

      <div ref={ref} className="relative max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Animated student cluster */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE_OUT }}
            className="relative"
          >
            <StudentBubbles />
          </motion.div>

          {/* Content side */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.12, ease: EASE_OUT }}
            className="space-y-9"
          >
            <div>
              <span className="pill-tag mb-5" data-testid="about-tag">
                About Chessverse
              </span>
              <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-ivory leading-tight mb-5">
                Where every player learns to <span className="text-gradient italic">think like a king</span>.
              </h2>
              <p className="text-ghost text-lg leading-relaxed max-w-xl">
                Tripura's largest dedicated chess academy. From first lessons in Ramnagar to
                tournament podiums, every student grows with structure, patience and a coach
                beside them at every step.
              </p>
            </div>

            <div className="grid grid-cols-3 divide-x divide-sky/15 border-y border-sky/15 py-6">
              {highlights.map((h) => (
                <div key={h.label} className="px-3 first:pl-0 sm:px-6">
                  <p className="font-display font-bold text-3xl sm:text-4xl text-gradient-gold leading-none">{h.value}</p>
                  <p className="mt-2 text-xs sm:text-sm text-ghost">{h.label}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={() => go('#booking')} data-testid="about-cta-demo" className="btn-primary">
                Book a Free Demo
              </button>
              <Link
                to="/about"
                data-testid="about-cta-story"
                onMouseEnter={() => prefetchRoute('/about')}
                onFocus={() => prefetchRoute('/about')}
                className="btn-ghost group"
              >
                Read our story
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
