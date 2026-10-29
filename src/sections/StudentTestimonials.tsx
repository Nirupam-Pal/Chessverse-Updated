import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { Link } from 'react-router'
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { ArrowRight, GraduationCap, Quote, Sparkles, TrendingUp } from 'lucide-react'
import Reveal from '@/components/Reveal'
import StudentPhoto from '@/components/StudentPhoto'
import { courses } from '@/data/courses'
import { studentTestimonials, type StudentTestimonial } from '@/data/testimonials'
import { prefetchRoute } from '@/lib/routes'

/*
 * Student Testimonials — students in their own words. One featured testimonial beside a grid of
 * smaller cards; everything comes from `studentTestimonials` (src/data/testimonials.ts), whose first
 * entry is the featured one. Used on the home page and on /testimonials.
 *
 * variant="scroll" (home page) pins the section and stacks the cards as you scroll: each one slides up
 * over the last, with a progress bar and dots beside them. Reduced motion gets the grid instead.
 */

// a testimonial's course, when it names one of ours, links to that course's section on /courses
const courseSlug = (title?: string) => courses.find((c) => c.title === title)?.slug

function Avatar({ t, className }: { t: StudentTestimonial; className: string }) {
  return (
    <div className={`relative shrink-0 overflow-hidden rounded-full ring-2 ring-sky/25 ${className}`}>
      <StudentPhoto name={t.name} src={t.image} sizes="96px" initialsClassName="text-sm" />
    </div>
  )
}

function Meta({ t, size }: { t: StudentTestimonial; size: 'lg' | 'sm' }) {
  const slug = courseSlug(t.course)
  return (
    <div className="flex flex-wrap items-center gap-2">
      {t.course &&
        (slug ? (
          <Link
            to={`/courses#${slug}`}
            onMouseEnter={() => prefetchRoute('/courses')}
            className="inline-flex items-center gap-1 rounded-full bg-sky/10 px-2.5 py-1 text-[11px] font-semibold text-sky ring-1 ring-sky/20 transition-colors hover:bg-sky/15"
          >
            <GraduationCap className="h-3 w-3" />
            {t.course}
          </Link>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-sky/10 px-2.5 py-1 text-[11px] font-semibold text-sky ring-1 ring-sky/20">
            <GraduationCap className="h-3 w-3" />
            {t.course}
          </span>
        ))}
      {t.highlight && (
        <span className={`inline-flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-1 font-semibold text-ivory/85 ring-1 ring-white/10 ${size === 'lg' ? 'text-xs' : 'text-[11px]'}`}>
          <TrendingUp className="h-3 w-3 text-sky" />
          {t.highlight}
        </span>
      )}
    </div>
  )
}

function FeaturedCard({ t }: { t: StudentTestimonial }) {
  return (
    <figure className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-sky/15 bg-gradient-to-br from-twilight via-twilight/90 to-midnight/70 p-8 transition-[border-color,box-shadow,translate] duration-300 hover:-translate-y-1 hover:border-sky/30 hover:shadow-[0_30px_60px_-34px_rgba(0,0,0,0.7)] motion-reduce:hover:translate-y-0 sm:p-10">
      <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-sky/10 blur-3xl" />
      <Quote aria-hidden className="h-10 w-10 text-sky/45" />
      <blockquote className="relative mt-6 flex-grow font-display text-2xl italic leading-snug text-ivory/95 sm:text-[1.75rem]">
        “{t.quote}”
      </blockquote>
      <figcaption className="relative mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-sky/10 pt-6">
        <div className="flex items-center gap-4">
          <Avatar t={t} className="h-14 w-14" />
          <div>
            <p className="font-display text-lg font-semibold text-ivory">{t.name}</p>
            <p className="text-sm text-ghost">{t.detail}</p>
          </div>
        </div>
        <Meta t={t} size="lg" />
      </figcaption>
    </figure>
  )
}

function CompactCard({ t }: { t: StudentTestimonial }) {
  return (
    <figure className="group flex h-full flex-col rounded-3xl border border-white/10 bg-twilight/60 p-6 transition-[border-color,box-shadow,translate] duration-300 hover:-translate-y-1 hover:border-sky/30 hover:shadow-[0_24px_48px_-30px_rgba(0,0,0,0.7)] motion-reduce:hover:translate-y-0">
      <Quote aria-hidden className="h-6 w-6 text-sky/40" />
      <blockquote className="mt-3 flex-grow text-sm leading-relaxed text-ghost">“{t.quote}”</blockquote>
      <figcaption className="mt-5 space-y-3 border-t border-sky/10 pt-4">
        <div className="flex items-center gap-3">
          <Avatar t={t} className="h-10 w-10" />
          <div className="min-w-0">
            <p className="truncate font-display text-sm font-semibold text-ivory">{t.name}</p>
            <p className="truncate text-xs text-ghost">{t.detail}</p>
          </div>
        </div>
        {(t.course || t.highlight) && <Meta t={t} size="sm" />}
      </figcaption>
    </figure>
  )
}

/* -------------------------------------------------------------------------- */
/* Scroll stack                                                                */
/* -------------------------------------------------------------------------- */

// share of each card's scroll segment spent handing over to the next card
const SWAP_FRAC = 0.5
// the fixed navbar; the pinned panel sits below it
const NAV_OFFSET = 64

const LG_QUERY = '(min-width: 1024px)'
const subscribeLg = (onChange: () => void) => {
  const mq = window.matchMedia(LG_QUERY)
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}
const useIsDesktop = () => useSyncExternalStore(subscribeLg, () => window.matchMedia(LG_QUERY).matches, () => true)

function StackedCard({ t, index, total, progress }: { t: StudentTestimonial; index: number; total: number; progress: MotionValue<number> }) {
  // card i takes over from card i - 1 around the boundary i / total: it slides up over it while the
  // old one settles back and fades, so the stage is never empty. The first starts in place, the last stays.
  const seg = 1 / total
  const half = (seg * SWAP_FRAC) / 2
  const inStart = index * seg - half
  const inEnd = index * seg + half
  const outStart = (index + 1) * seg - half
  const outEnd = (index + 1) * seg + half
  const first = index === 0
  const last = index === total - 1
  const y = useTransform(progress, [inStart, inEnd, outStart, outEnd], [first ? '0vh' : '70vh', '0vh', '0vh', last ? '0vh' : '-4vh'])
  const opacity = useTransform(
    progress,
    [inStart, inStart + (inEnd - inStart) * 0.4, outStart + (outEnd - outStart) * 0.3, outEnd],
    [first ? 1 : 0, 1, 1, last ? 1 : 0],
  )
  const scale = useTransform(progress, [inStart, inEnd, outStart, outEnd], [first ? 1 : 0.96, 1, 1, last ? 1 : 0.92])

  return (
    <motion.div style={{ y, opacity, scale, zIndex: index + 1 }} className="absolute inset-0 flex items-center will-change-transform">
      <figure className="group relative w-full overflow-hidden rounded-[22px] border border-white/10 bg-twilight p-6 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.75)] transition-[border-color,box-shadow] duration-300 hover:border-gold/30 hover:shadow-[0_30px_70px_-30px_rgba(166,128,26,0.35)] sm:rounded-[28px] sm:p-9 lg:p-10">
        <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-sky/10 blur-3xl" />
        {/* watermark number */}
        <span aria-hidden className="pointer-events-none absolute right-6 top-4 hidden select-none font-display text-7xl font-extrabold leading-none text-gold/[0.07] sm:block lg:text-8xl">
          {String(index + 1).padStart(2, '0')}
        </span>

        <figcaption className="relative flex items-center gap-4">
          <Avatar t={t} className="h-14 w-14 sm:h-[72px] sm:w-[72px]" />
          <div className="min-w-0">
            <p className="font-display text-lg font-bold leading-tight text-ivory sm:text-xl">{t.name}</p>
            <p className="mt-0.5 text-sm text-ghost">{t.detail}</p>
            {(t.course || t.highlight) && (
              <div className="mt-2">
                <Meta t={t} size="sm" />
              </div>
            )}
          </div>
        </figcaption>

        <div className="relative my-5 h-px bg-gradient-to-r from-gold/30 to-transparent sm:my-6" />
        <Quote aria-hidden className="relative h-7 w-7 text-gold/50 sm:h-8 sm:w-8" />
        <blockquote className="relative mt-3 font-display text-lg italic leading-relaxed text-ivory/90 sm:text-2xl sm:leading-snug">
          “{t.quote}”
        </blockquote>

        {/* small board watermark */}
        <svg aria-hidden viewBox="0 0 60 60" className="pointer-events-none absolute bottom-4 right-4 hidden h-12 w-12 opacity-20 transition-opacity duration-300 group-hover:opacity-50 sm:block">
          {Array.from({ length: 36 }, (_, k) => {
            const r = Math.floor(k / 6)
            const c = k % 6
            return <rect key={k} x={c * 10} y={r * 10} width={10} height={10} fill={(r + c) % 2 === 0 ? 'rgba(212,168,67,.22)' : 'rgba(212,168,67,.05)'} />
          })}
        </svg>
      </figure>
    </motion.div>
  )
}

function ScrollStack({ showMoreLink, hasSamples }: { showMoreLink: boolean; hasSamples: boolean }) {
  const ref = useRef<HTMLElement>(null)
  const isDesktop = useIsDesktop()
  const total = studentTestimonials.length
  // progress runs while the panel is pinned: from the section reaching the navbar to its end
  const { scrollYProgress } = useScroll({ target: ref, offset: [`start ${NAV_OFFSET}px`, 'end end'] })
  const [active, setActive] = useState(0)

  useEffect(
    () => scrollYProgress.on('change', (v) => setActive(Math.max(0, Math.min(total - 1, Math.floor(v * total))))),
    [scrollYProgress, total],
  )

  return (
    <section
      ref={ref}
      id="student-testimonials"
      aria-labelledby="student-testimonials-title"
      style={{ height: `${(total + (isDesktop ? 0.5 : 1)) * 100}vh` }}
      className="relative w-full bg-void"
    >
      <div className="sticky flex overflow-hidden" style={{ top: NAV_OFFSET, height: `calc(100vh - ${NAV_OFFSET}px)` }}>
        <div className="absolute inset-0 chess-grid-bg opacity-30 pointer-events-none" />
        <div className="absolute -left-32 top-1/3 h-[420px] w-[420px] rounded-full bg-royal/12 blur-[150px] pointer-events-none" />
        <div className="absolute -right-24 top-10 h-[320px] w-[320px] rounded-full bg-gold/[0.06] blur-[130px] pointer-events-none" />

        <div className="relative mx-auto flex h-full w-full max-w-7xl flex-col px-4 sm:px-6 lg:flex-row lg:px-8 xl:px-12">
          {/* left: heading, progress and dots */}
          <div className="relative flex shrink-0 flex-col justify-center border-b border-white/[0.06] pb-4 pt-6 lg:w-[38%] lg:max-w-[420px] lg:border-b-0 lg:py-0 lg:pr-12">
            <span className="pill-tag mb-4 lg:mb-6">Student Testimonials</span>
            <h2 id="student-testimonials-title" className="font-display text-3xl font-bold leading-[1.05] text-ivory sm:text-4xl lg:text-5xl xl:text-6xl">
              Real stories. <span className="text-gradient italic">Real progress.</span>
            </h2>
            <p className="mt-5 hidden max-w-sm leading-relaxed text-ghost lg:block">
              Our students, in their own words: what they learned, the support they got from their coaches and how their
              game changed along the way.
            </p>
            {hasSamples && (
              <span className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full border border-sky/20 bg-sky/10 px-3 py-1 text-[11px] font-medium text-azure lg:mt-6 lg:text-xs">
                <Sparkles className="h-3.5 w-3.5" />
                Sample testimonials · real stories coming soon
              </span>
            )}

            <div aria-hidden className="mt-4 lg:mt-8">
              <div className="h-0.5 overflow-hidden rounded-full bg-white/10">
                <motion.div style={{ scaleX: scrollYProgress }} className="h-full origin-left rounded-full bg-gradient-to-r from-gold to-[#E8C96A]" />
              </div>
              <div className="mt-3 flex items-center justify-between gap-4">
                <div className="flex gap-1.5">
                  {studentTestimonials.map((t, i) => (
                    <motion.span
                      key={t.slug}
                      animate={{ width: i === active ? 20 : 7, opacity: i === active ? 1 : 0.35 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                      className="h-[7px] rounded-full bg-gold"
                    />
                  ))}
                </div>
                <span className="font-mono text-[11px] tabular-nums text-ghost">
                  {active + 1} / {total}
                </span>
              </div>
            </div>

            {showMoreLink && (
              <Link to="/testimonials" onMouseEnter={() => prefetchRoute('/testimonials')} className="btn-link mt-6 hidden w-fit lg:inline-flex">
                Read every story
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
            <span aria-hidden className="pointer-events-none absolute -left-3 bottom-[6%] hidden select-none font-display text-[150px] leading-none text-gold/[0.04] lg:block">
              ♔
            </span>
          </div>

          {/* right: the card stage */}
          <div className="relative min-h-0 flex-1 overflow-hidden py-4 lg:py-8">
            {studentTestimonials.map((t, i) => (
              <StackedCard key={t.slug} t={t} index={i} total={total} progress={scrollYProgress} />
            ))}
          </div>

          {showMoreLink && (
            <Link to="/testimonials" onMouseEnter={() => prefetchRoute('/testimonials')} className="btn-link mb-5 w-fit self-center lg:hidden">
              Read every story
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}

export default function StudentTestimonials({
  showMoreLink = false,
  tone = 'plain',
  variant = 'grid',
}: {
  /** a "Read every story" link to /testimonials (for the home page) */
  showMoreLink?: boolean
  /** background, so the section alternates with its neighbours on each page */
  tone?: 'plain' | 'tinted'
  /** 'scroll' pins the section and stacks the cards as you scroll (home page) */
  variant?: 'grid' | 'scroll'
}) {
  const reduceMotion = useReducedMotion()
  if (!studentTestimonials.length) return null
  const [featured, ...rest] = studentTestimonials
  const hasSamples = studentTestimonials.some((t) => t.placeholder)
  if (variant === 'scroll' && rest.length > 0 && !reduceMotion) return <ScrollStack showMoreLink={showMoreLink} hasSamples={hasSamples} />

  return (
    <section
      id="student-testimonials"
      aria-labelledby="student-testimonials-title"
      className={`relative w-full section-padding overflow-hidden scroll-mt-20 ${tone === 'tinted' ? 'bg-twilight' : 'bg-void'}`}
    >
      <div className="absolute inset-0 chess-grid-bg opacity-30 pointer-events-none" />
      <div className="absolute -left-32 top-1/3 h-[420px] w-[420px] rounded-full bg-royal/12 blur-[150px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        <Reveal className="mb-12 flex flex-col gap-6 md:mb-14 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="pill-tag mb-5">Student Testimonials</span>
            <h2 id="student-testimonials-title" className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-ivory leading-[1.05]">
              Real stories. <span className="text-gradient italic">Real progress.</span>
            </h2>
            <p className="mt-5 text-ghost text-lg leading-relaxed">
              Our students, in their own words: what they learned, the support they got from their coaches and how their
              game changed along the way.
            </p>
          </div>
          <div className="flex flex-col items-start gap-3 lg:items-end">
            {/* demo entries are labelled, so they can't be mistaken for real feedback */}
            {hasSamples && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-sky/20 bg-sky/10 px-3 py-1 text-xs font-medium text-azure">
                <Sparkles className="h-3.5 w-3.5" />
                Sample testimonials · real student stories coming soon
              </span>
            )}
            {showMoreLink && (
              <Link to="/testimonials" onMouseEnter={() => prefetchRoute('/testimonials')} className="btn-link">
                Read every story
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </Reveal>

        {rest.length === 0 ? (
          <Reveal className="mx-auto max-w-3xl">
            <FeaturedCard t={featured} />
          </Reveal>
        ) : (
          <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr] lg:gap-6">
            <Reveal className="h-full">
              <FeaturedCard t={featured} />
            </Reveal>
            <div className="grid gap-5 sm:grid-cols-2">
              {rest.map((t, i) => (
                // an odd last card spans both columns, so the grid never shows a gap
                <Reveal
                  key={t.slug}
                  delay={(i % 2) * 0.06}
                  className={`h-full ${rest.length % 2 === 1 && i === rest.length - 1 ? 'sm:col-span-2' : ''}`}
                >
                  <CompactCard t={t} />
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
