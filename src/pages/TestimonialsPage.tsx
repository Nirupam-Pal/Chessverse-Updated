import { useEffect } from 'react'
import { Link } from 'react-router'
import { ArrowDown, ArrowRight, CalendarCheck, ChevronRight, Crown, Quote, Star, TrendingUp } from 'lucide-react'
import Reveal from '@/components/Reveal'
import LazyImage from '@/components/LazyImage'
import { TiltCard, TiltDepth, TiltSheen } from '@/components/depth/TiltCard'
import { familyTestimonials, studentTestimonials, testimonialSummary, type FamilyTestimonial } from '@/data/testimonials'
import StudentTestimonials from '@/sections/StudentTestimonials'
import { prefetchRoute, useSiteNav } from '@/lib/routes'
import { scrollToTarget } from '@/lib/scroll'

/* -------------------------------------------------------------------------- */
/* Shared bits                                                                 */
/* -------------------------------------------------------------------------- */

function Stars({ n, className = 'w-4 h-4', tone = 'gold' }: { n: number; className?: string; tone?: 'gold' | 'ink' }) {
  const on = tone === 'gold' ? 'fill-gold text-gold' : 'fill-[#0B1733] text-[#0B1733]'
  return (
    <span className="inline-flex items-center gap-1" role="img" aria-label={`${n} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className={`${className} ${i < n ? on : 'text-ghost/40'}`} />
      ))}
    </span>
  )
}

function Avatar({ src, alt, className }: { src: string; alt: string; className: string }) {
  return src.startsWith('https://images.unsplash.com/') ? (
    <div className={`relative shrink-0 overflow-hidden rounded-full ${className}`}>
      <LazyImage fill src={src} alt={alt} ratio={1} sizes="96px" />
    </div>
  ) : (
    <img src={src} alt={alt} loading="lazy" decoding="async" className={`shrink-0 rounded-full object-cover ${className}`} />
  )
}

/* -------------------------------------------------------------------------- */
/* Cards                                                                       */
/* -------------------------------------------------------------------------- */

/** Grid card with the 3D tilt. */
function StoryCard({ t }: { t: FamilyTestimonial }) {
  return (
    <TiltCard className="h-full rounded-3xl">
      <div className="relative flex h-full flex-col overflow-hidden rounded-3xl liquid-glass glow-border p-6 transition-shadow duration-500 group-hover:shadow-[0_32px_60px_-30px_rgba(31,79,174,0.6)]">
        <TiltSheen />
        <div className="flex items-start justify-between">
          <Quote className="h-8 w-8 text-sky/40" />
          <TiltDepth depth={6}>
            <span className="inline-flex items-center gap-1 rounded-full bg-sky/10 px-2.5 py-1 text-[11px] font-semibold text-sky ring-1 ring-sky/25">
              <TrendingUp className="h-3 w-3" />
              {t.improvement}
            </span>
          </TiltDepth>
        </div>
        <p className="mt-4 flex-grow text-sm leading-relaxed text-ghost">“{t.quote}”</p>
        <div className="mt-5">
          <Stars n={t.rating} />
        </div>
        <div className="mt-4 flex items-center gap-3 border-t border-sky/10 pt-4">
          <TiltDepth depth={4}>
            <Avatar src={t.image} alt={t.name} className="h-11 w-11 ring-2 ring-sky/30" />
          </TiltDepth>
          <div className="min-w-0">
            <p className="truncate font-display text-sm font-semibold text-ivory">{t.name}</p>
            <p className="truncate text-xs text-ghost">{t.role}</p>
          </div>
        </div>
      </div>
    </TiltCard>
  )
}

/* -------------------------------------------------------------------------- */
/* Page                                                                        */
/* -------------------------------------------------------------------------- */

export default function TestimonialsPage() {
  const go = useSiteNav()
  const [featured, ...otherParents] = familyTestimonials
  // outcome chips: parents' stated improvements plus students' highlights (sample students are left out)
  const outcomes = [
    ...familyTestimonials.map((t) => ({ who: t.name, label: t.improvement })),
    ...studentTestimonials.filter((t) => t.highlight && !t.placeholder).map((t) => ({ who: t.name, label: t.highlight! })),
  ]

  useEffect(() => {
    const prev = document.title
    document.title = 'Testimonials — Chessverse Chess Institute'
    return () => {
      document.title = prev
    }
  }, [])

  return (
    <>
      {/* ---------------- Hero: summary + a featured 3D quote ---------------- */}
      <section className="relative w-full overflow-hidden px-4 sm:px-6 lg:px-8 xl:px-12 pt-32 md:pt-40 pb-16 md:pb-24">
        <div className="absolute inset-0 chess-board-bg opacity-30 pointer-events-none" />
        <div className="absolute -top-24 -left-24 h-[480px] w-[480px] rounded-full bg-royal/20 blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 h-[380px] w-[380px] rounded-full bg-gold/10 blur-[130px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
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
                  Testimonials
                </li>
              </ol>
            </nav>
            <span className="pill-tag mb-6">Success Stories</span>
            <h1 className="font-display font-bold text-5xl sm:text-6xl xl:text-7xl text-ivory leading-[1.02] tracking-tight">
              In the words of <span className="text-gradient italic">our families</span>.
            </h1>
            <p className="mt-6 text-ghost text-lg md:text-xl leading-relaxed max-w-xl">
              Parents and students on what changes when a child learns to think with Chessverse: at the board, in school
              and at home.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button type="button" onClick={() => scrollToTarget('student-testimonials')} className="btn-gold">
                Read the stories
                <ArrowDown className="w-4 h-4" />
              </button>
              <button type="button" onClick={() => go('#booking')} className="btn-ghost">
                <CalendarCheck className="w-4 h-4" />
                Book a free demo
              </button>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
              <div>
                <p className="font-display text-4xl font-bold text-gradient-gold leading-none">{testimonialSummary.averageRating.toFixed(1)}</p>
                <div className="mt-2">
                  <Stars n={Math.round(testimonialSummary.averageRating)} />
                </div>
              </div>
              <div className="h-12 w-px bg-sky/15" />
              <div>
                <p className="font-display text-4xl font-bold text-ivory leading-none">{familyTestimonials.length}</p>
                <p className="mt-2 text-sm text-ghost">family stories</p>
              </div>
              <div>
                <p className="font-display text-4xl font-bold text-ivory leading-none">{studentTestimonials.length}</p>
                <p className="mt-2 text-sm text-ghost">student stories</p>
              </div>
            </div>
          </Reveal>

          {/* a featured quote on a 3D card, with floating chips */}
          <Reveal delay={0.12}>
            <TiltCard accent="gold" maxTilt={{ x: 8, y: 10 }} lift={8} className="relative mx-auto max-w-lg rounded-[32px]">
              <div className="absolute -inset-px rounded-[32px] bg-gradient-to-br from-gold/40 via-sky/25 to-royal/40 opacity-70 blur-sm pointer-events-none" />
              <div className="relative overflow-hidden rounded-[32px] border border-gold/30 liquid-glass p-8 sm:p-10">
                <TiltSheen />
                <Quote className="h-12 w-12 text-gold/60" />
                <blockquote className="mt-5 font-display text-2xl italic leading-snug text-ivory sm:text-[1.7rem]">“{featured.quote}”</blockquote>
                <div className="mt-7 flex items-center gap-4">
                  <Avatar src={featured.image} alt={featured.name} className="h-14 w-14 ring-2 ring-gold/40" />
                  <div>
                    <p className="font-display font-semibold text-ivory">{featured.name}</p>
                    <p className="text-sm text-ghost">{featured.role}</p>
                  </div>
                </div>
              </div>
              <TiltDepth depth={10} className="absolute -top-5 right-6">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-br from-[#EDCD68] to-[#C99A2B] px-4 py-2 text-xs font-bold text-[#0B1733] shadow-2xl">
                  <Stars n={featured.rating} tone="ink" className="h-3.5 w-3.5" />
                </span>
              </TiltDepth>
              <TiltDepth depth={8} className="absolute -bottom-5 left-8">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#060B1A]/90 px-4 py-2 text-xs font-semibold text-white shadow-2xl ring-1 ring-white/15">
                  <TrendingUp className="h-3.5 w-3.5 text-[#E6C766]" />
                  {featured.improvement}
                </span>
              </TiltDepth>
            </TiltCard>
          </Reveal>
        </div>
      </section>

      {/* ---------------- Students, in their own words (shared with the home page) ---------------- */}
      <StudentTestimonials tone="tinted" />

      {/* ---------------- More from parents (the hero already features the first one) ---------------- */}
      {otherParents.length > 0 && (
        <section id="parents" aria-labelledby="parents-title" className="relative w-full section-padding overflow-hidden scroll-mt-20">
          <div className="relative max-w-7xl mx-auto">
            <Reveal className="max-w-3xl mb-12 md:mb-14">
              <span className="pill-tag mb-5">From our parents</span>
              <h2 id="parents-title" className="font-display font-bold text-4xl sm:text-5xl text-ivory leading-[1.05]">
                What families <span className="text-gradient italic">notice at home</span>
              </h2>
            </Reveal>
            <div className={`grid gap-5 ${otherParents.length === 1 ? 'max-w-md' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
              {otherParents.map((t, i) => (
                <Reveal key={t.name} delay={(i % 3) * 0.06} className="h-full">
                  <StoryCard t={t} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------------- Outcomes strip (only outcomes that are actually stated) ---------------- */}
      {outcomes.length > 0 && (
        <section aria-label="Outcomes our families and students mention" className="relative w-full overflow-hidden border-y border-gold/20 bg-gradient-to-r from-midnight via-twilight to-midnight py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-6 lg:flex-row lg:justify-between">
            <p className="font-display text-xl italic text-ivory/90">What families and students tell us changed</p>
            <ul className="flex flex-wrap justify-center gap-3">
              {outcomes.map((o) => (
                <li key={o.who} className="inline-flex items-center gap-2 rounded-full border border-gold/25 bg-void/40 px-4 py-2 text-sm">
                  <Crown className="h-4 w-4 text-gold" />
                  <span className="font-semibold text-ivory">{o.label}</span>
                  <span className="text-ghost">· {o.who.split(' ')[0]}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ---------------- Closing CTA ---------------- */}
      <section className="relative w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-24 md:py-32">
        <Reveal className="relative max-w-5xl mx-auto overflow-hidden rounded-[36px] border border-gold/20 bg-gradient-to-br from-midnight via-twilight to-void p-8 sm:p-12 md:p-16 text-center">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-[520px] max-w-full rounded-full bg-gold/15 blur-[100px] pointer-events-none" />
          <p className="relative font-display italic text-gold text-lg mb-3">Every story here began with a first class.</p>
          <h2 className="relative font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-ivory leading-tight mb-4">
            Start <span className="text-gradient-gold italic">your child’s</span> story.
          </h2>
          <p className="relative text-ghost text-lg max-w-xl mx-auto mb-8">
            Book a free live class: meet a coach, see how lessons work and get an honest assessment of where your child is
            today.
          </p>
          <div className="relative flex flex-wrap justify-center gap-3">
            <button type="button" onClick={() => go('#booking')} className="btn-gold">
              Book the free class
              <ArrowRight className="w-4 h-4" />
            </button>
            <Link to="/star-performers" onMouseEnter={() => prefetchRoute('/star-performers')} className="btn-ghost">
              Meet our star performers
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  )
}
