import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router'
import { AnimatePresence, animate, motion, useInView } from 'framer-motion'
import {
  ArrowDown,
  ArrowRight,
  Award,
  CalendarCheck,
  ChevronDown,
  ChevronRight,
  Crown,
  Flame,
  HeartHandshake,
  Medal,
  Repeat,
  Sparkles,
  TrendingUp,
  Trophy,
} from 'lucide-react'
import Reveal from '@/components/Reveal'
import StudentPhoto from '@/components/StudentPhoto'
import Coverflow3D from '@/components/depth/Coverflow3D'
import Medal3D from '@/components/depth/Medal3D'
import { TiltCard, TiltDepth, TiltSheen } from '@/components/depth/TiltCard'
import {
  meritoriousStudents,
  starPerformers,
  starPerformerTotals,
  type MeritoriousStudent,
  type StarPerformer,
} from '@/data/starPerformers'
import { EASE_OUT } from '@/lib/motion'
import { prefetchRoute, useSiteNav } from '@/lib/routes'
import { scrollToTarget } from '@/lib/scroll'

/* -------------------------------------------------------------------------- */
/* Content                                                                     */
/* -------------------------------------------------------------------------- */

// what the academy looks for — general, not claims about any one student
const qualities = [
  { icon: Repeat, title: 'Consistency', text: 'Showing up every week, finishing the homework and playing the long game, not just the next one.' },
  { icon: Flame, title: 'Effort', text: 'Turning losses into lessons: reviewing games honestly and fixing what went wrong.' },
  { icon: HeartHandshake, title: 'Sportsmanship', text: 'Shaking hands win or lose, respecting opponents and helping younger players along.' },
  { icon: TrendingUp, title: 'Growth', text: 'Measurable progress over time, in rating, results and the quality of their thinking.' },
]

/* -------------------------------------------------------------------------- */
/* Shared bits                                                                 */
/* -------------------------------------------------------------------------- */

function SectionIntro({ tag, title, text, center = false, gold = false }: { tag: ReactNode; title: ReactNode; text?: string; center?: boolean; gold?: boolean }) {
  return (
    <Reveal className={`max-w-3xl mb-12 md:mb-16 ${center ? 'mx-auto text-center' : ''}`}>
      <span className={`${gold ? 'pill-tag-gold' : 'pill-tag'} mb-5`}>{tag}</span>
      <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-ivory leading-[1.05]">{title}</h2>
      {text && <p className={`mt-5 text-ghost text-lg leading-relaxed ${center ? 'max-w-2xl mx-auto' : 'max-w-2xl'}`}>{text}</p>}
    </Reveal>
  )
}

/** Counts up from 0 when scrolled into view; writes the text node directly (no re-renders). */
function CountUp({ value, className = '' }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  // vertical inset only: a narrow number near the screen's left edge (e.g. "3" on a phone) would
  // sit entirely inside a horizontal inset and never count as visible
  const inView = useInView(ref, { once: true, margin: '-40px 0px' })
  const target = Number(value.replace(/\D/g, ''))
  const numeric = /^\d+$/.test(value) && target > 0
  useEffect(() => {
    if (!inView || !numeric) return
    const controls = animate(0, target, {
      duration: 1.4,
      ease: EASE_OUT,
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = String(Math.round(v))
      },
    })
    return () => controls.stop()
  }, [inView, numeric, target])
  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {numeric ? '0' : value}
    </span>
  )
}

/* -------------------------------------------------------------------------- */
/* Spotlight: 3D carousel + live detail panel                                  */
/* -------------------------------------------------------------------------- */

function PortraitCard({ p, active }: { p: StarPerformer; active: boolean }) {
  return (
    <div className={`relative h-full overflow-hidden rounded-[28px] border ${active ? 'border-gold/45 shadow-[0_40px_80px_-40px_rgba(166,128,26,0.6)]' : 'border-white/10'} bg-midnight`}>
      <StudentPhoto name={p.name} src={p.image} sizes="340px" initialsClassName="text-7xl" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#060B1A] via-[#060B1A]/30 to-transparent" />
      {p.period && (
        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-[#060B1A]/65 px-3 py-1.5 text-[11px] font-semibold text-[#E6C766] ring-1 ring-[#E6C766]/40 backdrop-blur-sm">
          <Crown className="h-3.5 w-3.5" />
          {p.period}
        </span>
      )}
      <div className="absolute inset-x-0 bottom-0 p-6">
        <p className="font-display text-2xl font-bold text-white">{p.name}</p>
        <p className="mt-1 text-sm text-white/70">{p.age}</p>
        {p.rating && (
          <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white ring-1 ring-white/20">
            <TrendingUp className="h-3.5 w-3.5 text-[#E6C766]" />
            {p.rating}
          </p>
        )}
      </div>
    </div>
  )
}

function Spotlight() {
  const [index, setIndex] = useState(0)
  if (!starPerformers.length) return null
  const p = starPerformers[Math.min(index, starPerformers.length - 1)]

  return (
    <section id="spotlight" className="relative w-full bg-twilight section-padding overflow-hidden scroll-mt-20">
      <div className="absolute inset-0 chess-board-bg opacity-25 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gold/8 rounded-full blur-[180px] pointer-events-none" />
      <div className="relative max-w-7xl mx-auto">
        <SectionIntro
          gold
          tag={
            <>
              <Sparkles className="w-3.5 h-3.5" /> Spotlight
            </>
          }
          title={
            <>
              Champions <span className="text-gradient-gold italic">in the making</span>
            </>
          }
          text="Swipe through our star performers, or use the arrows. Each one started where your child might be today."
        />
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
          <Reveal>
            <Coverflow3D
              label="Star performers"
              items={starPerformers}
              getKey={(s) => s.slug}
              getLabel={(s) => s.name}
              index={index}
              onIndexChange={setIndex}
              accent="gold"
              className="h-[440px] sm:h-[480px]"
              itemClassName="w-[70vw] max-w-[320px] sm:w-[320px]"
              renderItem={(s, { active }) => <PortraitCard p={s} active={active} />}
            />
          </Reveal>

          {/* the selected performer, with a jump to their full card below */}
          <div className="relative min-h-[420px]" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.div
                key={p.slug}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: EASE_OUT }}
              >
                {p.period && <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">{p.period}</p>}
                <h3 className="mt-3 font-display text-4xl font-bold text-ivory sm:text-5xl">{p.name}</h3>
                <p className="mt-2 text-ghost">{p.age}</p>
                {p.title && (
                  <p className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gold/10 px-4 py-2 font-display font-semibold text-gold ring-1 ring-gold/30">
                    <Trophy className="h-4 w-4 shrink-0" />
                    {p.title}
                  </p>
                )}
                {p.quote && (
                  <blockquote className="mt-6 border-l-2 border-gold/50 pl-5 text-lg italic leading-relaxed text-ghost">“{p.quote}”</blockquote>
                )}
                {/* every achievement lives here — the carousel is the only star-performer showcase */}
                {!!p.achievements?.length && (
                  <ul className="mt-6 space-y-2.5" aria-label={`${p.name}’s achievements`}>
                    {p.achievements.map((a) => (
                      <li key={a} className="flex items-start gap-3 text-ivory/90">
                        <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-gold/10 ring-1 ring-gold/25">
                          <Medal className="h-3.5 w-3.5 text-gold" />
                        </span>
                        <span className="pt-0.5">{a}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {!!p.stats?.length && (
                  <div className="mt-7 grid grid-cols-3 gap-3">
                    {p.stats.map((s) => (
                      <div key={s.label} className="rounded-2xl border border-sky/15 bg-void/40 p-4 text-center">
                        <p className="font-display text-3xl font-bold text-ivory">
                          <CountUp value={s.value} />
                        </p>
                        <p className="mt-1 text-[11px] leading-snug text-ghost">{s.label}</p>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* Meritorious students — compact cards                                        */
/* -------------------------------------------------------------------------- */

const MERIT_INITIAL = 10 // two rows on wide screens; the rest behind "Show all"

function MeritCard({ s }: { s: MeritoriousStudent }) {
  return (
    <article className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-twilight/60 transition-[translate,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:border-sky/30 hover:shadow-[0_22px_44px_-28px_rgba(0,0,0,0.7)] motion-reduce:hover:translate-y-0">
      <div className="relative aspect-square overflow-hidden">
        <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none">
          <StudentPhoto name={s.name} src={s.image} sizes="(min-width: 1280px) 220px, (min-width: 640px) 30vw, 45vw" initialsClassName="text-3xl" />
        </div>
        {s.rating && (
          <span className="absolute right-2.5 top-2.5 rounded-full bg-[#060B1A]/70 px-2 py-1 text-[10px] font-semibold text-white ring-1 ring-white/15 backdrop-blur-sm">
            {s.rating}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="truncate font-display text-base font-semibold text-ivory">{s.name}</h3>
        <p className="mt-0.5 truncate text-xs text-ghost">{s.age}</p>
        {s.highlight && (
          <p className="mt-2.5 flex items-start gap-1.5 text-xs leading-snug text-azure">
            <Award className="mt-px h-3.5 w-3.5 shrink-0" />
            <span className="line-clamp-2">{s.highlight}</span>
          </p>
        )}
      </div>
    </article>
  )
}

function MeritSection() {
  const [expanded, setExpanded] = useState(false)
  // hidden until real students are added to meritoriousStudents (src/data/starPerformers.ts)
  if (!meritoriousStudents.length) return null
  const shown = expanded ? meritoriousStudents : meritoriousStudents.slice(0, MERIT_INITIAL)
  const hiddenCount = meritoriousStudents.length - MERIT_INITIAL
  return (
    <section id="meritorious" aria-labelledby="merit-title" className="relative w-full section-padding overflow-hidden scroll-mt-20">
      <div className="relative max-w-7xl mx-auto">
        <Reveal className="mb-10 flex flex-col gap-4 md:mb-12 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <span className="pill-tag mb-5">
              <Award className="w-3.5 h-3.5" /> Meritorious students
            </span>
            <h2 id="merit-title" className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-ivory leading-[1.08]">
              More students <span className="text-gradient italic">making their mark</span>
            </h2>
            <p className="mt-4 text-ghost text-lg leading-relaxed">
              Every one of them is putting in the work, and their results show it.
            </p>
          </div>
          <div className="flex flex-col items-start gap-2 md:items-end">
            {/* invented stand-ins are labelled, so they can't be mistaken for real students */}
            {meritoriousStudents.some((s) => s.sample) && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-sky/20 bg-sky/10 px-3 py-1 text-xs font-medium text-azure">
                <Sparkles className="h-3.5 w-3.5" />
                Sample profiles · real students coming soon
              </span>
            )}
            <p className="text-sm tabular-nums text-ghost">
              {meritoriousStudents.length} {meritoriousStudents.length === 1 ? 'student' : 'students'}
            </p>
          </div>
        </Reveal>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          <AnimatePresence initial={false}>
            {shown.map((s, i) => (
              <motion.li
                key={s.slug}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: EASE_OUT, delay: i >= MERIT_INITIAL ? (i - MERIT_INITIAL) * 0.03 : 0 }}
              >
                <MeritCard s={s} />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
        {hiddenCount > 0 && (
          <div className="mt-10 flex justify-center">
            <button type="button" onClick={() => setExpanded((e) => !e)} aria-expanded={expanded} className="btn-ghost">
              {expanded ? 'Show fewer' : `Show all ${meritoriousStudents.length} students`}
              <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* Page                                                                        */
/* -------------------------------------------------------------------------- */

export default function StarPerformersPage() {
  const go = useSiteNav()

  useEffect(() => {
    const prev = document.title
    document.title = 'Star Performers — Chessverse Chess Institute'
    return () => {
      document.title = prev
    }
  }, [])

  const heroStats = [
    { value: String(starPerformerTotals.students), label: 'students in the spotlight' },
    { value: String(starPerformerTotals.medals), label: 'medals between them' },
    { value: String(starPerformerTotals.topRating), label: 'highest FIDE rating' },
  ]

  return (
    <>
      {/* ---------------- Hero: headline + 3D medal ---------------- */}
      <section className="relative w-full overflow-hidden px-4 sm:px-6 lg:px-8 xl:px-12 pt-32 md:pt-40 pb-16 md:pb-24">
        <div className="absolute inset-0 chess-board-bg opacity-30 pointer-events-none" />
        <div className="absolute -top-24 right-0 h-[480px] w-[480px] rounded-full bg-gold/15 blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 -left-24 h-[380px] w-[380px] rounded-full bg-royal/20 blur-[130px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center gap-1.5 text-sm text-ghost">
                <li>
                  <Link to="/" className="hover:text-ivory transition-colors">
                    Home
                  </Link>
                </li>
                <li aria-hidden>
                  <ChevronRight className="w-3.5 h-3.5" />
                </li>
                <li aria-current="page" className="text-ivory">
                  Star Performers
                </li>
              </ol>
            </nav>
            <span className="pill-tag-gold mb-6">
              <Crown className="w-3.5 h-3.5" />
              Hall of Fame
            </span>
            <h1 className="font-display font-bold text-5xl sm:text-6xl xl:text-7xl text-ivory leading-[1.02] tracking-tight">
              Where <span className="text-gradient-gold italic">champions</span> are forged.
            </h1>
            <p className="mt-6 text-ghost text-lg md:text-xl leading-relaxed max-w-xl">
              Meet the Chessverse students whose discipline, practice and love of the game turned into medals, ratings and
              titles. Every one of them started with a first lesson.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button type="button" onClick={() => scrollToTarget('spotlight')} className="btn-gold">
                Meet our stars
                <ArrowDown className="w-4 h-4" />
              </button>
              <button type="button" onClick={() => go('#booking')} className="btn-ghost">
                <CalendarCheck className="w-4 h-4" />
                Book a free demo
              </button>
            </div>
            <div className="mt-10 grid grid-cols-3 max-w-lg divide-x divide-sky/15">
              {heroStats.map((s) => (
                <div key={s.label} className="px-4 first:pl-0">
                  <p className="font-display font-bold text-3xl sm:text-4xl text-gradient-gold leading-none">
                    <CountUp value={s.value} />
                  </p>
                  <p className="mt-2 text-xs sm:text-sm text-ghost">{s.label}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.12} className="mx-auto w-full max-w-[420px]">
            <Medal3D className="w-full" />
          </Reveal>
        </div>
      </section>

      {/* two tiers from the data: featured star performers, then the wider group of deserving students */}
      <Spotlight />
      <MeritSection />

      {/* ---------------- What makes a star ---------------- */}
      {/* backgrounds alternate: tinted spotlight → plain merit section (when present) → this one */}
      <section className={`relative w-full section-padding overflow-hidden ${meritoriousStudents.length ? 'bg-twilight' : ''}`}>
        <div className="relative max-w-7xl mx-auto">
          <SectionIntro
            center
            gold
            tag="How we choose"
            title={
              <>
                What makes a <span className="text-gradient-gold italic">Star Performer</span>
              </>
            }
            text="Trophies matter, but they are not the whole story. Our coaches recognise students who show these four qualities, season after season."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {qualities.map((q, i) => (
              <Reveal key={q.title} delay={i * 0.06} className="h-full">
                <TiltCard accent="gold" className="h-full rounded-[28px]">
                  <div className="relative h-full overflow-hidden rounded-[28px] border border-white/10 bg-white/5 p-7 transition-[border-color] duration-300 group-hover:border-gold/35">
                    <TiltSheen />
                    <div className="flex items-center justify-between mb-8">
                      <TiltDepth className="w-12 h-12 rounded-2xl bg-gold/10 ring-1 ring-gold/25 flex items-center justify-center">
                        <q.icon className="w-5 h-5 text-gold" />
                      </TiltDepth>
                      <span className="font-display text-sm text-ghost tabular-nums">0{i + 1}</span>
                    </div>
                    <h3 className="font-display font-semibold text-2xl text-ivory mb-2">{q.title}</h3>
                    <p className="text-ghost leading-relaxed text-sm">{q.text}</p>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Closing CTA ---------------- */}
      <section className="relative w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-24 md:py-32">
        <Reveal className="relative max-w-5xl mx-auto overflow-hidden rounded-[36px] border border-gold/20 bg-gradient-to-br from-midnight via-twilight to-void p-8 sm:p-12 md:p-16 text-center">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-[520px] max-w-full rounded-full bg-gold/15 blur-[100px] pointer-events-none" />
          <p className="relative font-display italic text-gold text-lg mb-3">Every star started with one move.</p>
          <h2 className="relative font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-ivory leading-tight mb-4">
            Your child could be <span className="text-gradient-gold italic">next</span>.
          </h2>
          <p className="relative text-ghost text-lg max-w-xl mx-auto mb-8">
            One free live class with a Chessverse coach: a real board, real feedback and an honest assessment of where your
            child is today.
          </p>
          <div className="relative flex flex-wrap justify-center gap-3">
            <button type="button" onClick={() => go('#booking')} className="btn-gold">
              Book the free class
              <ArrowRight className="w-4 h-4" />
            </button>
            <Link to="/testimonials" onMouseEnter={() => prefetchRoute('/testimonials')} className="btn-ghost">
              Read family stories
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  )
}
