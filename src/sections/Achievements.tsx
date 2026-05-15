import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Trophy, Medal, Award, Crown, Users, GraduationCap } from 'lucide-react'

const stats = [
  { value: '1500+', label: 'Students Trained', icon: Users },
  { value: '50+', label: 'Tournament Winners', icon: Trophy },
  { value: '12+', label: 'Years of Excellence', icon: Medal },
  { value: '#1', label: 'Chess Institute in Tripura', icon: Crown },
]

const milestones = [
  {
    year: '2024',
    title: 'State Champions',
    description:
      'Our students brought home 14 medals from the Tripura State Chess Championship across age categories.',
    icon: Trophy,
    accent: 'gold',
  },
  {
    year: '2023',
    title: 'National Qualifiers',
    description:
      'Seven ChessVerse students qualified for the National Schools Chess Championship — a record from the Northeast.',
    icon: Medal,
    accent: 'sky',
  },
  {
    year: '2022',
    title: 'FIDE Rated Players',
    description:
      'We crossed 100 FIDE-rated players coming out of our academy — a benchmark for serious chess training in the region.',
    icon: Award,
    accent: 'sky',
  },
  {
    year: '2020',
    title: 'Online Academy Launched',
    description:
      'Built an online classroom that now serves students across all eight districts of Tripura and beyond.',
    icon: GraduationCap,
    accent: 'gold',
  },
]

export default function Achievements() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="achievements" className="relative w-full bg-void section-padding overflow-hidden">
      {/* Decorative chess board pattern */}
      <div className="absolute inset-0 chess-board-bg opacity-30 pointer-events-none" />
      <div className="absolute top-20 -right-32 w-[480px] h-[480px] rounded-full bg-royal/10 blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-20 -left-32 w-[420px] h-[420px] rounded-full bg-gold/5 blur-[140px] pointer-events-none" />

      <div ref={ref} className="relative max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 md:mb-20"
        >
          <span className="pill-tag-gold mb-5" data-testid="achievements-tag">
            <Trophy className="w-3.5 h-3.5" />
            Our Achievements
          </span>
          <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-ivory mb-5 leading-tight">
            A Legacy of <span className="text-gradient-gold italic">Champions</span>
          </h2>
          <p className="text-ghost text-lg max-w-2xl mx-auto leading-relaxed">
            From district trophies to national stages — every move our students make
            is backed by years of disciplined, joyful coaching.
          </p>
        </motion.div>

        {/* Stat grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-20">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              data-testid={`achievement-stat-${i}`}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="liquid-glass glow-border rounded-2xl p-5 sm:p-6 text-center hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-sky/10 ring-1 ring-sky/25 mb-3">
                <stat.icon className="w-5 h-5 text-sky" />
              </div>
              <p className="font-display font-bold text-3xl sm:text-4xl text-ivory mb-1">
                {stat.value}
              </p>
              <p className="text-ghost text-xs sm:text-sm leading-snug">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Milestone timeline */}
        <div className="relative">
          {/* Vertical line on lg */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 -translate-x-px w-px bg-gradient-to-b from-transparent via-sky/30 to-transparent" />

          <div className="space-y-10 lg:space-y-16">
            {milestones.map((m, i) => {
              const left = i % 2 === 0
              return (
                <motion.div
                  key={m.year}
                  data-testid={`milestone-${m.year}`}
                  initial={{ opacity: 0, x: left ? -40 : 40 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.12 }}
                  className={`relative lg:grid lg:grid-cols-2 lg:gap-12 items-center ${
                    left ? '' : 'lg:[&>*:first-child]:order-2'
                  }`}
                >
                  {/* Card */}
                  <div className={`liquid-glass glow-border rounded-3xl p-7 sm:p-8 ${left ? 'lg:text-right' : ''}`}>
                    <div className={`flex items-center gap-3 mb-3 ${left ? 'lg:justify-end' : ''}`}>
                      <span className="font-display font-semibold text-sm text-sky tracking-widest">
                        {m.year}
                      </span>
                      <span className="h-px w-10 bg-sky/30" />
                    </div>
                    <h3 className="font-display font-bold text-2xl sm:text-3xl text-ivory mb-3">
                      {m.title}
                    </h3>
                    <p className="text-ghost leading-relaxed">{m.description}</p>
                  </div>

                  {/* Center dot */}
                  <div className="hidden lg:flex justify-center">
                    <div
                      className={`relative w-16 h-16 rounded-full flex items-center justify-center ${
                        m.accent === 'gold' ? 'bg-gold/15 ring-1 ring-gold/40' : 'bg-sky/15 ring-1 ring-sky/40'
                      }`}
                    >
                      <m.icon
                        className={`w-7 h-7 ${m.accent === 'gold' ? 'text-gold' : 'text-sky'}`}
                      />
                      <span
                        className={`absolute inset-0 rounded-full ${
                          m.accent === 'gold' ? 'shadow-glow-gold' : 'shadow-glow'
                        }`}
                      />
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
