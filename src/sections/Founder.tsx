import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Globe, HeartHandshake, Sparkles, Quote } from 'lucide-react'

export default function Founder() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-120px' })

  return (
    <section id="founder" className="relative w-full  section-padding overflow-hidden">
      <div className="absolute inset-0 chess-board-bg opacity-20 pointer-events-none" />
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 h-[520px] w-[700px] rounded-full bg-gold/8 blur-[160px] pointer-events-none" />
      <div className="absolute bottom-8 right-0 h-[320px] w-[320px] rounded-full bg-sky/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-12 left-6 h-24 w-24 rounded-full border border-gold/20 bg-gold/5 blur-3xl pointer-events-none" />

      <div ref={ref} className="relative max-w-7xl mx-auto">
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.75 }}
            className="space-y-8"
          >
            <div className="max-w-2xl">
              <span className="pill-tag mb-5" data-testid="founder-tag">
                <Sparkles className="w-3.5 h-3.5" />
                Founder’s Vision
              </span>
              <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-ivory leading-tight mb-5">
                Building confident young minds through chess.
              </h2>
              <p className="text-ghost text-lg leading-relaxed">
                At ChessVerse, we believe chess is more than a game—it builds discipline, leadership, and a mindset for lifelong success. </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.65, delay: 0.1 }}
                className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_30px_80px_-48px_rgba(255,255,255,0.2)] backdrop-blur-xl"
              >
                <div className="inline-flex items-center gap-3 mb-4 text-sky">
                  <Globe className="w-5 h-5" />
                  <span className="text-xs uppercase tracking-[0.22em] font-semibold">Vision</span>
                </div>
                <p className="text-ghost leading-relaxed">
                  To be the trusted academy that makes chess accessible, joyful and transformative for every learner in Tripura and beyond.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.65, delay: 0.2 }}
                className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_30px_80px_-48px_rgba(252,211,77,0.28)] backdrop-blur-xl"
              >
                <div className="inline-flex items-center gap-3 mb-4 text-gold">
                  <HeartHandshake className="w-5 h-5" />
                  <span className="text-xs uppercase tracking-[0.22em] font-semibold">Mission</span>
                </div>
                <p className="text-ghost leading-relaxed">
                  To train students with confidence, coach them with care and inspire them to think strategically, ethically and creatively.
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.3 }}
              className="rounded-[32px] border border-white/10 bg-void/50 p-8 shadow-2xl backdrop-blur-xl"
            >
              <div className="flex items-start gap-5 sm:items-center sm:gap-6">
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gold/10 ring-1 ring-gold/25">
                  <img
                    src="/images/coach-pratik.jpg"
                    alt="Founder of ChessVerse"
                    className="h-20 w-20 rounded-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-display text-xl font-semibold text-ivory">Pratik Debnath</p>
                  <p className="text-ghost text-sm">Founder & Head Coach</p>
                </div>
              </div>
              <div className="mt-6 border-t border-white/10 pt-6">
                <div className="flex gap-4 items-center text-gold mb-4">
                  <Quote className="w-5 h-5" />
                  <span className="font-display text-sm uppercase tracking-[0.24em]">Founder’s note</span>
                </div>
                <p className="text-ghost leading-relaxed text-base sm:text-lg">
                  "Every student has unique potential. We nurture talent, strengthen values through chess, and celebrate every achievement while building champions on and off the board"
                </p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.75, delay: 0.15 }}
            className="relative"
          >
            <div className="relative rounded-[32px] overflow-hidden shadow-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
              <img
                src="/images/founder.jpg"
                alt="Founder portrait"
                className="h-full w-full min-h-[420px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-void via-void/10 to-transparent" />
              <div className="absolute left-5 bottom-5 rounded-3xl border border-white/10 bg-void/70 p-4 backdrop-blur-md">
                <p className="text-ghost text-xs uppercase tracking-[0.24em] mb-2">Our promise</p>
                <p className="font-display font-semibold text-ivory">
                  Personal coaching, trusted support, lasting confidence.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
