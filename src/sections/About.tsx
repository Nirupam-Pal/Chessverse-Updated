import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'


export default function About() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="about" className="relative w-full bg-twilight section-padding overflow-hidden">
      <div className="absolute top-0 right-0 w-[520px] h-[520px] rounded-full bg-royal/15 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[420px] h-[420px] rounded-full bg-gold/5 blur-[120px] pointer-events-none" />

      <div ref={ref} className="relative max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative rounded-[28px] overflow-hidden aspect-[4/5] shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1606503153255-59d8b8b82176?auto=format&fit=crop&w=900&q=80"
                alt="ChessVerse classroom"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-void via-void/30 to-transparent" />

              {/* Logo medallion */}
              <div className="absolute top-5 left-5 px-3.5 py-2 rounded-full liquid-glass flex items-center gap-2">
                <img
                  src="/images/chessverse-logo.jpg"
                  alt="ChessVerse"
                  className="w-7 h-7 rounded-md object-cover"
                />
                <span className="font-display font-semibold text-sm text-ivory">ChessVerse</span>
              </div>

              {/* Floating stat card */}
              <div className="absolute bottom-5 left-5 right-5 liquid-glass rounded-2xl p-5">
                <p className="text-xs uppercase tracking-widest text-sky mb-1">Since 2013</p>
                <p className="font-display font-semibold text-ivory text-lg leading-snug">
                  Shaping Tripura's brightest chess minds from Agartala — one move at a time.
                </p>
              </div>
            </div>

            {/* Decorative frames */}
            <div className="absolute -top-5 -right-5 w-28 h-28 border border-sky/25 rounded-3xl pointer-events-none" />
            <div className="absolute -bottom-6 -left-6 w-36 h-36 border border-gold/20 rounded-3xl pointer-events-none" />
          </motion.div>

          {/* Content side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="space-y-8"
          >
            <div>
              <span className="pill-tag mb-5" data-testid="about-tag">
                About ChessVerse
              </span>
              <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-ivory leading-tight mb-5">
                Where every player learns to <span className="text-gradient italic">think like a king</span>.
              </h2>
              <p className="text-ghost text-lg leading-relaxed">
                ChessVerse is Tripura's largest dedicated chess academy. From quiet
                first lessons in Ramnagar to roaring tournament wins, our students
                grow with patience, structure and a coach beside them at every step.
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="relative rounded-[32px] border border-white/10 bg-white/10 p-6 sm:p-8 shadow-[0_24px_70px_-30px_rgba(59,130,246,0.45)] backdrop-blur-xl dark:border-slate-700 dark:bg-slate-950/70">
                <div className="absolute -top-8 right-8 h-24 w-24 rounded-full bg-sky/20 blur-3xl" />
                <span className="relative inline-flex rounded-full bg-sky/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky">
                  Why Chess?
                </span>
                <h3 className="mt-5 font-display text-3xl font-bold text-slate-950 dark:text-ivory leading-tight">
                  The game that sharpens minds, builds character and unlocks new moves.
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300 max-w-xl">
                  Chess is the training ground for focus, patience and bold decisions. Every board becomes a lab for learning how to think ahead.
                </p>
                <ul className="mt-6 space-y-3">
                  {[
                    'Practice sharp thinking under pressure.',
                    'Turn setbacks into smarter next moves.',
                    'Build confidence through every win and lesson.',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-sky" />
                      <span className="text-sm text-slate-600 dark:text-slate-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative rounded-[32px] border border-white/10 bg-white/10 p-6 sm:p-8 shadow-[0_24px_70px_-30px_rgba(252,211,77,0.3)] backdrop-blur-xl dark:border-slate-700 dark:bg-slate-950/80">
                <div className="absolute -bottom-8 left-8 h-24 w-24 rounded-full bg-gold/20 blur-3xl" />
                <span className="relative inline-flex rounded-full bg-gold/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
                  Why Chessverse?
                </span>
                <h3 className="mt-5 font-display text-3xl font-bold text-ivory leading-tight">
                  A bold academy where every learner is seen, trained and celebrated.
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-slate-300 max-w-xl">
                  We pair expert coaching with a warm community, tournament momentum and progress plans that keep students excited about every next move.
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-400 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300">
                    <p className="uppercase tracking-[0.18em] text-xs text-ghost mb-2">Proven path</p>
                    <p className="font-semibold text-ivory">12+ years of coaching excellence.</p>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-400 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300">
                    <p className="uppercase tracking-[0.18em] text-xs text-ghost mb-2">Built for growth</p>
                    <p className="font-semibold text-ivory">Community, contests and progress tracking.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* <div className="grid sm:grid-cols-2 gap-4">
              {pillars.map((p, i) => (
                <motion.div
                  key={p.title}
                  data-testid={`about-pillar-${i}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  className="liquid-glass glow-border rounded-2xl p-5 hover:-translate-y-1 transition-transform duration-300"
                >
                  <div className="w-10 h-10 rounded-xl bg-sky/10 ring-1 ring-sky/25 flex items-center justify-center mb-3">
                    <p.icon className="w-5 h-5 text-sky" />
                  </div>
                  <h4 className="font-display font-semibold text-ivory text-base mb-1.5">
                    {p.title}
                  </h4>
                  <p className="text-ghost text-xs leading-relaxed">{p.description}</p>
                </motion.div>
              ))}
            </div> */}

            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="#booking"
                data-testid="about-cta-demo"
                className="btn-primary"
              >
                Book a Free Demo
              </a>
              <a
                href="#contact"
                data-testid="about-cta-contact"
                className="btn-ghost"
              >
                Talk to Us
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
