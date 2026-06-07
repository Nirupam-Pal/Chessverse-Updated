import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Crown, Star, Trophy, TrendingUp, Medal, Sparkles } from 'lucide-react'

const starPerformers = [
  {
    name: 'Rohan Chakraborty',
    age: 'Class 9 · Agartala',
    image:
      'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=800&q=80',
    period: 'Star Performer · 2024',
    title: 'Tripura State U-14 Gold Medallist',
    rating: 'FIDE 1847',
    quote:
      'ChessVerse taught me to stay calm under pressure. Winning state gold felt like the natural next step on a journey I started here as a complete beginner.',
    achievements: [
      'National Schools Championship Qualifier',
      'District Champion — 3 consecutive years',
      '+420 ELO growth in 18 months',
    ],
    stats: [
      { label: 'FIDE Rating', value: '1847' },
      { label: 'Medals Won', value: '12' },
      { label: 'Years at ChessVerse', value: '3' },
    ],
  },
  {
    name: 'Ananya Das',
    age: 'Class 6 · Udaipur',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    period: 'Rising Star · 2024',
    title: 'North East Open U-10 Silver',
    rating: 'FIDE 1520',
    quote:
      'My coaches break every game into puzzles I can understand. I love coming to class — every week I feel stronger on the board.',
    achievements: [
      'Youngest FIDE-rated girl from Tripura',
      'Inter-district U-10 Champion',
      'Perfect score in district rapid',
    ],
    stats: [
      { label: 'FIDE Rating', value: '1520' },
      { label: 'Medals Won', value: '8' },
      { label: 'Years at ChessVerse', value: '2' },
    ],
  },
  {
    name: 'Debojyoti Nath',
    age: 'Class 11 · Dharmanagar',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    period: 'Star Performer · 2023',
    title: 'National Sub-Junior Finalist',
    rating: 'FIDE 1962',
    quote:
      'Online classes from Dharmanagar never felt distant. The analysis sessions here are as sharp as any academy in the mainland.',
    achievements: [
      'Tripura State Open Champion',
      'Represented NE at Nationals',
      'Top board for school team',
    ],
    stats: [
      { label: 'FIDE Rating', value: '1962' },
      { label: 'Medals Won', value: '18' },
      { label: 'Years at ChessVerse', value: '4' },
    ],
  },
]

export default function StarPerformer() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const [active, setActive] = useState(0)
  const performer = starPerformers[active]
  const maxIndex = starPerformers.length - 1

  const handlePrev = () => setActive((current) => Math.max(0, current - 1))
  const handleNext = () => setActive((current) => Math.min(maxIndex, current + 1))

  return (
    <section id="star-performer" className="relative w-full bg-twilight section-padding overflow-hidden">
      <div className="absolute inset-0 chess-board-bg opacity-25 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gold/6 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-24 w-[480px] h-[480px] rounded-full bg-royal/12 blur-[140px] pointer-events-none" />

      <div ref={ref} className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 md:mb-20"
        >
          <span className="pill-tag-gold mb-5" data-testid="star-performer-tag">
            <Sparkles className="w-3.5 h-3.5" />
            Star Performer
          </span>
          <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-ivory mb-5 leading-tight">
            Where <span className="text-gradient-gold italic">Champions</span> Are Forged
          </h2>
          <p className="text-ghost text-lg max-w-2xl mx-auto leading-relaxed">
            Our brightest students — proof that disciplined coaching and relentless practice
            turn young minds into tournament-ready champions.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative"
        >
          <div className="absolute -inset-px rounded-[32px] bg-gradient-to-br from-gold/35 via-sky/20 to-royal/25 blur-md opacity-60 pointer-events-none" />

          <div className="relative liquid-glass glow-border rounded-[32px] overflow-hidden border-gold/25">
            <button
              type="button"
              onClick={handlePrev}
              disabled={active === 0}
              className="absolute left-4 top-1/2 z-20 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-full bg-void/80 text-ghost shadow-lg shadow-void/20 transition hover:bg-void focus:outline-none focus:ring-2 focus:ring-gold disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={active === maxIndex}
              className="absolute right-4 top-1/2 z-20 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-full bg-void/80 text-ghost shadow-lg shadow-void/20 transition hover:bg-void focus:outline-none focus:ring-2 focus:ring-gold disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="grid lg:grid-cols-5 gap-0">
              {/* Photo panel */}
              <div className="lg:col-span-2 relative min-h-[340px] sm:min-h-[420px] lg:min-h-full">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={performer.image}
                    src={performer.image}
                    alt={performer.name}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.45 }}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-void via-void/50 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-void/20 lg:to-void/90" />

                {/* Floating crown badge */}
                <div className="absolute top-5 left-5 pill-tag-gold !py-2 !px-4 shadow-glow-gold">
                  <Crown className="w-4 h-4" />
                  {performer.period}
                </div>

                {/* Rating chip */}
                <div className="absolute bottom-5 left-5 right-5 lg:right-auto flex flex-wrap gap-2">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-void/70 backdrop-blur-md ring-1 ring-gold/40">
                    <TrendingUp className="w-4 h-4 text-gold" />
                    <span className="font-display font-bold text-ivory text-sm">{performer.rating}</span>
                  </div>
                </div>

                {/* Decorative ring */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] rounded-full border border-gold/15 animate-spin-slow pointer-events-none hidden sm:block" />
              </div>

              {/* Content panel */}
              <div className="lg:col-span-3 p-7 sm:p-10 lg:p-12 flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={performer.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.35 }}
                  >
                    <div className="flex items-center gap-1 mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                      ))}
                    </div>

                    <h3
                      className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-ivory mb-2 leading-tight"
                      data-testid="star-performer-name"
                    >
                      {performer.name}
                    </h3>
                    <p className="text-ghost text-sm mb-4">{performer.age}</p>

                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gold/10 ring-1 ring-gold/30 mb-6">
                      <Trophy className="w-4 h-4 text-gold shrink-0" />
                      <span className="font-display font-semibold text-gold text-sm sm:text-base">
                        {performer.title}
                      </span>
                    </div>

                    <blockquote className="text-ghost text-base sm:text-lg leading-relaxed mb-8 border-l-2 border-gold/40 pl-5 italic">
                      &ldquo;{performer.quote}&rdquo;
                    </blockquote>

                    <ul className="space-y-2.5 mb-8">
                      {performer.achievements.map((item) => (
                        <li key={item} className="flex items-start gap-3 text-sm text-ghost">
                          <Medal className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>

                    <div className="grid grid-cols-3 gap-3 sm:gap-4">
                      {performer.stats.map((stat) => (
                        <div
                          key={stat.label}
                          className="rounded-2xl bg-void/40 ring-1 ring-sky/15 p-4 text-center hover:ring-gold/30 transition-colors duration-300"
                        >
                          <p className="font-display font-bold text-2xl sm:text-3xl text-ivory mb-1">
                            {stat.value}
                          </p>
                          <p className="text-ghost text-[10px] sm:text-xs leading-snug">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Performer selector */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-8 flex flex-col items-center gap-4"
        >
          <div className="flex items-center gap-3 overflow-x-auto px-1 py-1 scrollbar-hide">
            {starPerformers.map((p, i) => (
              <button
                key={p.name}
                data-testid={`star-performer-tab-${i}`}
                onClick={() => setActive(i)}
                className={`group relative flex min-w-[220px] items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-300 ${
                  active === i
                    ? 'liquid-glass glow-border border-gold/40 ring-1 ring-gold/25 scale-[1.02]'
                    : 'liquid-glass-light glow-border hover:border-sky/35'
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    className={`w-14 h-14 rounded-full object-cover ring-2 transition-all duration-300 ${
                      active === i ? 'ring-gold/60' : 'ring-sky/25 group-hover:ring-sky/45'
                    }`}
                  />
                  {active === i && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gold flex items-center justify-center">
                      <Star className="w-3 h-3 fill-void text-void" />
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className={`font-display font-semibold text-sm truncate ${active === i ? 'text-gold' : 'text-ivory'}`}>
                    {p.name}
                  </p>
                  <p className="text-ghost text-xs truncate">{p.title}</p>
                </div>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            {starPerformers.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Show student ${index + 1}`}
                className={`h-3 w-3 rounded-full transition-all duration-300 ${
                  active === index ? 'bg-gold scale-110 shadow-[0_0_0_8px_rgba(255,205,91,0.12)]' : 'bg-ghost/40 hover:bg-ghost'
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
