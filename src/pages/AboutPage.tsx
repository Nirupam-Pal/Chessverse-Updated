import { Link } from 'react-router'
import { ArrowRight, Award, Crown, Eye, Flag, HeartHandshake, Medal, Sparkles, Users } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import Reveal from '@/components/Reveal'
import Founder from '@/sections/Founder'
import { prefetchRoute, useSiteNav } from '@/lib/routes'

const credentials = [
  { icon: Award, value: 'FIDE Trainer', label: 'Internationally recognised coaching credential' },
  { icon: Crown, value: 'State Champion', label: 'Former Tripura State Chess Champion' },
  { icon: Medal, value: '12+ years', label: 'Coaching players from beginner to rated' },
  { icon: Users, value: '1,500+', label: 'Students trained at ChessVerse' },
]

const journey = [
  {
    year: '2013',
    title: 'ChessVerse is founded',
    text: 'A small classroom in Ramnagar, Agartala, with one goal: serious, structured chess coaching for Tripura.',
  },
  {
    year: '2020',
    title: 'The online academy opens',
    text: 'Live online classes bring the ChessVerse method to students across all eight districts and beyond.',
  },
  {
    year: '2022',
    title: '100 FIDE-rated players',
    text: 'The academy crosses a hundred FIDE-rated players, a benchmark for chess training in the region.',
  },
  {
    year: '2024',
    title: '14 state medals',
    text: 'Students bring home 14 medals from the Tripura State Chess Championship across age categories.',
  },
]

const philosophy = [
  {
    icon: Eye,
    title: 'See the student first',
    text: 'Every learner thinks differently. Coaching starts with how a child plays, not with a fixed syllabus.',
  },
  {
    icon: Flag,
    title: 'Think before you move',
    text: 'Calculation, patience and accountability, the habits chess builds, carry far beyond the board.',
  },
  {
    icon: HeartHandshake,
    title: 'Celebrate every step',
    text: 'A first checkmate matters as much as a first trophy. Progress is noticed, named and celebrated.',
  },
]

export default function FounderPage() {
  const go = useSiteNav()

  return (
    <>
      <PageHeader
        docTitle="Our Founder — ChessVerse Chess Institute"
        crumb="Our Founder"
        tag="Our Founder"
        title={
          <>
            The mind behind <span className="text-gradient italic">ChessVerse</span>
          </>
        }
        subtitle="Pratik Debnath built ChessVerse on a simple belief: given patient coaching and a clear path, any child can learn to think like a champion."
      />

      {/* the founder's vision, mission and note */}
      <Founder />

      {/* Credentials */}
      <section aria-labelledby="credentials-heading" className="relative w-full bg-twilight px-4 sm:px-6 lg:px-8 xl:px-12 py-16 md:py-20">
        <div className="max-w-7xl mx-auto">
          <h2 id="credentials-heading" className="sr-only">
            Credentials
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {credentials.map((c, i) => (
              <Reveal key={c.value} delay={i * 0.06}>
                <div className="h-full liquid-glass glow-border rounded-3xl p-5 sm:p-7">
                  <div className="w-11 h-11 rounded-2xl bg-gold/10 ring-1 ring-gold/25 flex items-center justify-center mb-5">
                    <c.icon className="w-5 h-5 text-gold" />
                  </div>
                  <p className="font-display font-bold text-2xl sm:text-3xl text-ivory leading-tight">{c.value}</p>
                  <p className="mt-2 text-sm text-ghost leading-relaxed">{c.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Journey */}
      <section aria-labelledby="journey-heading" className="relative w-full section-padding overflow-hidden">
        <div className="absolute top-1/3 -left-40 w-[480px] h-[480px] rounded-full bg-sky/10 blur-[140px] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto">
          <Reveal className="max-w-2xl mb-14 md:mb-16">
            <span className="pill-tag-gold mb-5">
              <Sparkles className="w-3.5 h-3.5" />
              The Journey
            </span>
            <h2 id="journey-heading" className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-ivory leading-tight mb-5">
              From one classroom to <span className="text-gradient italic">Tripura's largest</span> academy.
            </h2>
            <p className="text-ghost text-lg leading-relaxed">
              A decade of steady, patient growth, built one student and one tournament at a time.
            </p>
          </Reveal>

          <ol className="relative grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* connecting rail (desktop) */}
            <div aria-hidden className="hidden lg:block absolute left-0 right-0 top-[22px] h-px bg-gradient-to-r from-gold/50 via-sky/40 to-transparent" />
            {journey.map((step, i) => (
              <li key={step.year} className="relative">
                <Reveal delay={i * 0.08}>
                  <div className="relative z-10 mb-6 inline-flex h-11 items-center rounded-full bg-void px-4 ring-1 ring-gold/40 font-display font-bold text-gold">
                    {step.year}
                  </div>
                  <h3 className="font-display font-semibold text-xl text-ivory mb-2">{step.title}</h3>
                  <p className="text-ghost leading-relaxed">{step.text}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Philosophy */}
      <section aria-labelledby="philosophy-heading" className="relative w-full bg-twilight section-padding overflow-hidden">
        <div className="absolute inset-0 chess-grid-bg opacity-40 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto">
          <Reveal className="text-center max-w-2xl mx-auto mb-14 md:mb-16">
            <span className="pill-tag mb-5">Coaching Philosophy</span>
            <h2 id="philosophy-heading" className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-ivory leading-tight">
              Three principles, <span className="text-gradient italic">every lesson</span>.
            </h2>
          </Reveal>
          <div className="grid gap-5 md:grid-cols-3">
            {philosophy.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <div className="h-full rounded-[28px] border border-white/10 bg-white/5 p-7 sm:p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-sky/10 ring-1 ring-sky/25 flex items-center justify-center">
                      <p.icon className="w-5 h-5 text-sky" />
                    </div>
                    <span className="font-display text-sm text-ghost tabular-nums">0{i + 1}</span>
                  </div>
                  <h3 className="font-display font-semibold text-2xl text-ivory mb-3">{p.title}</h3>
                  <p className="text-ghost leading-relaxed">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-20 md:py-28">
        <Reveal className="relative max-w-5xl mx-auto overflow-hidden rounded-[36px] border border-gold/20 bg-gradient-to-br from-midnight via-twilight to-void p-8 sm:p-12 md:p-16 text-center">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-[520px] max-w-full rounded-full bg-gold/15 blur-[100px] pointer-events-none" />
          <h2 className="relative font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-ivory leading-tight mb-4">
            Make your first move with <span className="text-gradient-gold italic">ChessVerse</span>.
          </h2>
          <p className="relative text-ghost text-lg max-w-xl mx-auto mb-8">
            Book a free demo class and see the coaching approach for yourself.
          </p>
          <div className="relative flex flex-wrap justify-center gap-3">
            <button type="button" onClick={() => go('#booking')} className="btn-gold">
              Book a Free Demo
              <ArrowRight className="w-4 h-4" />
            </button>
            <Link to="/gallery" onMouseEnter={() => prefetchRoute('/gallery')} className="btn-ghost">
              See the gallery
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  )
}
