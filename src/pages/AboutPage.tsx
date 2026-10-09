import { useEffect, useRef, type ReactNode } from 'react'
import { Link } from 'react-router'
import { motion, useScroll } from 'framer-motion'
import {
  ArrowDown,
  ArrowRight,
  Award,
  Brain,
  ChevronRight,
  Compass,
  Crown,
  Eye,
  Flame,
  HeartHandshake,
  Medal,
  MessagesSquare,
  Quote,
  Shield,
  Sparkles,
  Target,
  Users,
} from 'lucide-react'
import Reveal from '@/components/Reveal'
import LazyImage from '@/components/LazyImage'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { prefetchRoute, useSiteNav } from '@/lib/routes'
import { scrollToTarget } from '@/lib/scroll'

/* -------------------------------------------------------------------------- */
/* Content — every figure here comes from elsewhere on the site; keep in sync  */
/* -------------------------------------------------------------------------- */

const heroStats = [
  { value: '1,500+', label: 'students trained' },
  { value: '12+', label: 'years of coaching' },
  { value: '50+', label: 'tournament winners' },
]

const band = [
  { value: '1,500+', label: 'students trained' },
  { value: '12+ years', label: 'of live coaching' },
  { value: '100+', label: 'FIDE-rated players' },
  { value: '50+', label: 'tournament winners' },
  { value: '14', label: 'state medals in 2024' },
  { value: '7', label: 'national qualifiers in 2023' },
  { value: 'Online', label: '& in-person classes' },
]

const reasons = [
  {
    icon: Brain,
    title: 'A coach sees the thinking',
    text: 'Software can flag a bad move. A coach asks why it felt right, and fixes the reasoning behind it.',
  },
  {
    icon: MessagesSquare,
    title: 'Learning is a conversation',
    text: 'Every class is live. Students ask, try, get it wrong and try again, with someone right there to guide them.',
  },
  {
    icon: Eye,
    title: 'Attention changes everything',
    text: 'Coaches follow each student’s games, habits and progress over months, not just a single lesson.',
  },
]

const journey = [
  {
    year: '2013',
    title: 'Where it started',
    text: 'Chessverse opens as a single classroom with one goal: serious, structured chess coaching that any child can access.',
  },
  {
    year: '2020',
    title: 'Going online',
    text: 'Live online classes take the Chessverse method beyond one classroom, reaching students wherever they are.',
  },
  {
    year: '2022',
    title: '100 FIDE-rated players',
    text: 'The academy crosses a hundred FIDE-rated players, a benchmark for structured, long-term training.',
  },
  {
    year: '2023',
    title: 'National qualifiers',
    text: 'Seven Chessverse students qualify for the National Schools Chess Championship.',
  },
  {
    year: '2024',
    title: 'Fourteen state medals',
    text: 'Students bring home 14 medals from the State Chess Championship across age categories.',
  },
  {
    year: 'Today',
    title: 'And the next move',
    text: '1,500+ students trained, with live classes online and in person, and a community that keeps growing.',
  },
]

const credentials = [
  { icon: Award, label: 'FIDE Trainer' },
  { icon: Crown, label: 'Former State Champion' },
  { icon: Medal, label: '12+ years coaching' },
  { icon: Users, label: '1,500+ students trained' },
]

const beliefs = [
  {
    title: 'Chess education is only as good as the coach.',
    text: 'Curriculum matters, but a coach who watches how a student thinks, and corrects it in the moment, matters more.',
  },
  {
    title: 'Every student deserves to be seen.',
    text: 'Coaching starts from how each child actually plays, not from a fixed syllabus that treats everyone the same.',
  },
  {
    title: 'Parents should see the progress.',
    text: 'You should know what your child is learning, where they are improving and what comes next.',
  },
  {
    title: 'The habits outlast the game.',
    text: 'Focus, patience and good decisions under pressure are what students carry long after the board is packed away.',
  },
]

const habits = [
  { icon: Target, title: 'Focus', text: 'Holding attention on one problem long enough to really solve it.' },
  { icon: Compass, title: 'Curiosity', text: 'Looking deeper for the better move instead of settling for the first one.' },
  { icon: Flame, title: 'Courage', text: 'Weighing the risks, trusting their own calculation and committing to a plan.' },
  { icon: Shield, title: 'Composure', text: 'Staying calm and clear-headed with the clock running and the position changing.' },
]

const faqs = [
  {
    q: 'When was Chessverse founded, and by whom?',
    a: 'In 2013, by Pratik Debnath, a FIDE Trainer and former State Chess Champion who still leads the coaching as Head Coach.',
  },
  {
    q: 'Are classes online or in person?',
    a: 'Both. Students can join live online classes from anywhere, or train in person at our academy. Every class is live, never pre-recorded.',
  },
  {
    q: 'Which programs do you offer?',
    a: 'Three levels: Pawn Starter for beginners (ages 5+), Knight Tactician for developing players, and Grandmaster Path for rated and tournament players, plus 1:1 coaching.',
  },
  {
    q: 'Does my child need any chess experience?',
    a: 'No. Many students start from zero. We assess every new student in a free demo class and place them at the right level.',
  },
  {
    q: 'How do we get started?',
    a: 'Book a free demo class. You will meet a coach, see how lessons work and get an honest assessment of where your child is today.',
  },
]

/* -------------------------------------------------------------------------- */
/* Shared bits                                                                 */
/* -------------------------------------------------------------------------- */

function SectionIntro({ tag, title, text, center = false }: { tag: string; title: ReactNode; text?: string; center?: boolean }) {
  return (
    <Reveal className={`max-w-3xl mb-14 md:mb-16 ${center ? 'mx-auto text-center' : ''}`}>
      <span className="pill-tag mb-5">{tag}</span>
      <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-ivory leading-[1.05]">{title}</h2>
      {text && <p className={`mt-5 text-ghost text-lg leading-relaxed ${center ? 'max-w-2xl mx-auto' : 'max-w-2xl'}`}>{text}</p>}
    </Reveal>
  )
}

/** Vertical timeline whose gold rail fills as you scroll (a scaleY transform; no layout work). */
function Timeline() {
  const ref = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 60%'] })

  return (
    <ol ref={ref} className="relative max-w-4xl mx-auto">
      {/* rail: track + scroll-driven fill */}
      <div aria-hidden className="absolute left-[19px] md:left-1/2 top-2 bottom-2 w-px -translate-x-1/2 bg-sky/15" />
      <motion.div
        aria-hidden
        style={{ scaleY: scrollYProgress }}
        className="absolute left-[19px] md:left-1/2 top-2 bottom-2 w-[2px] -translate-x-1/2 origin-top bg-gradient-to-b from-gold via-gold to-sky"
      />
      {journey.map((step, i) => {
        const right = i % 2 === 1
        return (
          <li key={step.year} className="relative pl-14 md:pl-0 pb-12 last:pb-0 md:grid md:grid-cols-2 md:gap-16">
            {/* node */}
            <span
              aria-hidden
              className="absolute left-[19px] md:left-1/2 top-1.5 h-4 w-4 -translate-x-1/2 rounded-full bg-void ring-2 ring-gold shadow-glow-gold"
            />
            <Reveal className={right ? 'md:col-start-2' : 'md:text-right'} y={20}>
              <p className="font-display font-bold text-2xl text-gold leading-none">{step.year}</p>
              <h3 className="mt-3 font-display font-semibold text-2xl text-ivory">{step.title}</h3>
              <p className={`mt-2 text-ghost leading-relaxed max-w-md ${right ? '' : 'md:ml-auto'}`}>{step.text}</p>
            </Reveal>
          </li>
        )
      })}
    </ol>
  )
}

/* -------------------------------------------------------------------------- */
/* Page                                                                        */
/* -------------------------------------------------------------------------- */

export default function AboutPage() {
  const go = useSiteNav()

  useEffect(() => {
    const prev = document.title
    document.title = 'About Us — The Story of Chessverse'
    return () => {
      document.title = prev
    }
  }, [])

  return (
    <>
      {/* ---------------- Hero: story + photo collage ---------------- */}
      <section className="relative w-full overflow-hidden px-4 sm:px-6 lg:px-8 xl:px-12 pt-32 md:pt-40 pb-16 md:pb-24">
        <div className="absolute inset-0 chess-board-bg opacity-30 pointer-events-none" />
        <div className="absolute -top-24 -left-24 h-[480px] w-[480px] rounded-full bg-royal/20 blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 h-[380px] w-[380px] rounded-full bg-gold/10 blur-[130px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-16 items-center">
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
                  About Us
                </li>
              </ol>
            </nav>
            <span className="pill-tag-gold mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Our story · Est. 2013
            </span>
            <h1 className="font-display font-bold text-5xl sm:text-6xl xl:text-7xl text-ivory leading-[1.02] tracking-tight">
              From one classroom to <span className="text-gradient italic">minds everywhere</span>.
            </h1>
            <p className="mt-6 text-ghost text-lg md:text-xl leading-relaxed max-w-xl">
              What began as a single classroom in 2013 has grown into an academy of 1,500+ students, learning
              through live, personal coaching online and in person.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button type="button" onClick={() => go('#booking')} className="btn-gold">
                Book a free demo
                <ArrowRight className="w-4 h-4" />
              </button>
              <button type="button" onClick={() => scrollToTarget('story')} className="btn-ghost group">
                Read the whole story
                <ArrowDown className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-0.5" />
              </button>
            </div>
            <div className="mt-10 grid grid-cols-3 max-w-lg divide-x divide-sky/15">
              {heroStats.map((s) => (
                <div key={s.label} className="px-4 first:pl-0">
                  <p className="font-display font-bold text-3xl sm:text-4xl text-ivory leading-none">{s.value}</p>
                  <p className="mt-2 text-xs sm:text-sm text-ghost">{s.label}</p>
                </div>
              ))}
            </div>
          </Reveal>

          {/* collage */}
          <Reveal delay={0.1} className="grid grid-cols-2 gap-3 sm:gap-4">
            <figure className="relative col-span-2 overflow-hidden rounded-[28px] glow-border">
              <LazyImage src="/images/coaching.jpg" alt="A Chessverse coach and student mid-game" ratio={16 / 9} priority />
              <div className="absolute inset-0 bg-gradient-to-t from-[#060B1A]/85 via-transparent to-transparent" />
              <figcaption className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5">
                <p className="font-display font-semibold text-white text-lg">Every class is live</p>
                <p className="text-white/70 text-sm">Coaching the thinking, move by move</p>
              </figcaption>
            </figure>
            <figure className="relative overflow-hidden rounded-[24px] glow-border">
              <LazyImage
                src="/images/founder-1200.jpg"
                alt="Pratik Debnath, founder of Chessverse"
                ratio={4 / 5}
                sizes="(min-width: 1024px) 25vw, 50vw"
                imgClassName="object-[center_70%]"
                priority
              />
              <figcaption className="absolute bottom-3 left-3 rounded-full bg-[#060B1A]/70 px-3 py-1.5 text-xs font-medium text-white">
                Our founder
              </figcaption>
            </figure>
            <figure className="relative overflow-hidden rounded-[24px] glow-border">
              <LazyImage
                src="https://images.unsplash.com/photo-1529699211952-734e80c4d42b"
                alt="Chess pieces set for a tournament round"
                ratio={4 / 5}
                sizes="(min-width: 1024px) 25vw, 50vw"
              />
              <figcaption className="absolute bottom-3 left-3 rounded-full bg-[#060B1A]/70 px-3 py-1.5 text-xs font-medium text-white">
                Tournament day
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* ---------------- Stats band (CSS marquee: one GPU transform loop) ---------------- */}
      <section aria-label="Chessverse in numbers" className="relative w-full overflow-hidden border-y border-gold/20 bg-gradient-to-r from-midnight via-twilight to-midnight py-6">
        <div className="mask-fade-edges">
          <div className="flex w-max animate-marquee hover:[animation-play-state:paused] motion-reduce:animate-none">
            {[0, 1].map((copy) => (
              <ul key={copy} aria-hidden={copy === 1} className="flex shrink-0 items-center">
                {band.map((b) => (
                  <li key={b.label} className="flex items-center gap-3 px-8 sm:px-10">
                    <span className="font-display font-bold text-2xl sm:text-3xl text-gradient-gold whitespace-nowrap">{b.value}</span>
                    <span className="text-sm text-ghost whitespace-nowrap">{b.label}</span>
                    <span aria-hidden className="ml-8 sm:ml-10 h-1.5 w-1.5 rotate-45 bg-sky/50" />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Why we exist ---------------- */}
      <section className="relative w-full bg-twilight section-padding overflow-hidden">
        <div className="absolute inset-0 chess-grid-bg opacity-40 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto">
          <SectionIntro
            center
            tag="Why we exist"
            title={
              <>
                Chess teaches more <span className="text-gradient italic">with a great coach</span>.
              </>
            }
            text="Anyone can play a thousand games. Real progress comes from understanding why a move works, why it fails, and what to try next time."
          />
          <div className="grid gap-5 md:grid-cols-3">
            {reasons.map((r, i) => (
              <Reveal key={r.title} delay={i * 0.08}>
                <div className="h-full liquid-glass glow-border rounded-[28px] p-7 sm:p-8">
                  <div className="w-12 h-12 rounded-2xl bg-sky/10 ring-1 ring-sky/25 flex items-center justify-center mb-6">
                    <r.icon className="w-5 h-5 text-sky" />
                  </div>
                  <h3 className="font-display font-semibold text-2xl text-ivory mb-3">{r.title}</h3>
                  <p className="text-ghost leading-relaxed">{r.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-12 text-center">
            <p className="font-display text-xl sm:text-2xl text-ivory/90 italic max-w-3xl mx-auto leading-snug">
              That is the gap Chessverse was built to close: turning children who play chess into children who
              learn to think.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------------- Journey ---------------- */}
      <section id="story" className="relative w-full section-padding overflow-hidden scroll-mt-24">
        <div className="absolute top-1/4 -right-40 w-[480px] h-[480px] rounded-full bg-sky/10 blur-[140px] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto">
          <SectionIntro
            center
            tag="Our journey"
            title={
              <>
                Twelve years, <span className="text-gradient italic">one move at a time</span>.
              </>
            }
            text="Every stage of our journey has been shaped by one goal: better chess education for every child."
          />
          <Timeline />
        </div>
      </section>

      {/* ---------------- Meet the founder ---------------- */}
      <section id="founder" className="relative w-full bg-twilight section-padding overflow-hidden">
        <div className="absolute inset-0 chess-board-bg opacity-20 pointer-events-none" />
        <div className="absolute -top-10 left-1/3 h-[420px] w-[620px] rounded-full bg-gold/10 blur-[160px] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto grid gap-12 lg:grid-cols-[0.9fr_1.1fr] items-center">
          <Reveal className="relative">
            <div className="relative overflow-hidden rounded-[32px] glow-border">
              <LazyImage
                src="/images/founder-1200.jpg"
                alt="Pratik Debnath, founder and head coach of Chessverse"
                ratio={4 / 5}
                sizes="(min-width: 1024px) 40vw, 100vw"
                imgClassName="object-[center_70%]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#060B1A]/80 via-transparent to-transparent" />
              <ul className="absolute bottom-5 left-5 right-5 flex flex-wrap gap-2">
                {credentials.map((c) => (
                  <li key={c.label} className="inline-flex items-center gap-1.5 rounded-full bg-[#060B1A]/70 px-3 py-1.5 text-xs font-medium text-white ring-1 ring-white/15">
                    <c.icon className="h-3.5 w-3.5 text-[#E6C766]" />
                    {c.label}
                  </li>
                ))}
              </ul>
            </div>
            <div aria-hidden className="absolute -bottom-6 -right-6 hidden sm:block w-32 h-32 border border-gold/25 rounded-3xl pointer-events-none" />
          </Reveal>

          <Reveal delay={0.1}>
            <span className="pill-tag-gold mb-5">Meet the founder</span>
            <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-ivory leading-[1.05]">Pratik Debnath</h2>
            <p className="mt-2 text-sm uppercase tracking-[0.22em] text-ghost">Founder & Head Coach</p>
            <div className="mt-7 space-y-4 text-ghost text-lg leading-relaxed">
              <p>
                A former State Chess Champion and FIDE Trainer, Pratik founded Chessverse in 2013 with a conviction
                that chess is more than a game: it builds discipline, leadership and a mindset for lifelong success.
              </p>
              <p>
                Over twelve years he has coached more than 1,500 students, from first lessons to rated tournaments,
                and built a method around one idea: see each student first, then teach.
              </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-xs uppercase tracking-[0.22em] font-semibold text-sky mb-2">Vision</p>
                <p className="text-ghost text-sm leading-relaxed">
                  To make chess accessible, joyful and transformative for every learner, wherever they are.
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-xs uppercase tracking-[0.22em] font-semibold text-gold mb-2">Mission</p>
                <p className="text-ghost text-sm leading-relaxed">
                  To train students with confidence, coach them with care and inspire them to think strategically,
                  ethically and creatively.
                </p>
              </div>
            </div>

            <figure className="mt-8 border-l-2 border-gold/60 pl-6">
              <Quote className="w-6 h-6 text-gold mb-3" />
              <blockquote className="font-display text-xl sm:text-2xl text-ivory italic leading-snug">
                “Every student has unique potential. We nurture talent, strengthen values through chess, and
                celebrate every achievement while building champions on and off the board.”
              </blockquote>
              <figcaption className="mt-4 text-sm text-ghost">
                <span className="text-ivory font-semibold">Pratik Debnath</span> · Founder, Chessverse
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* ---------------- What we believe ---------------- */}
      <section className="relative w-full section-padding overflow-hidden">
        <div className="relative max-w-7xl mx-auto">
          <SectionIntro
            tag="What we believe"
            title={
              <>
                Four things we <span className="text-gradient italic">never compromise on</span>.
              </>
            }
            text="Chess teaches more than how to play. It builds habits of thinking, learning and growing that stay long after the game."
          />
          <div className="grid gap-px overflow-hidden rounded-[32px] border border-sky/10 bg-sky/10 md:grid-cols-2">
            {beliefs.map((b, i) => (
              <Reveal key={b.title} delay={(i % 2) * 0.08} className="bg-void">
                <div className="h-full p-8 sm:p-10 transition-colors duration-300 hover:bg-twilight/60">
                  <span className="font-display font-bold text-5xl text-gradient-gold leading-none">0{i + 1}</span>
                  <h3 className="mt-6 font-display font-semibold text-2xl text-ivory leading-snug">{b.title}</h3>
                  <p className="mt-3 text-ghost leading-relaxed">{b.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- What your child leaves with ---------------- */}
      <section className="relative w-full bg-twilight section-padding overflow-hidden">
        <div className="absolute inset-0 chess-grid-bg opacity-40 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto">
          <SectionIntro
            center
            tag="What your child leaves with"
            title={
              <>
                Four habits that <span className="text-gradient italic">outlast the game</span>.
              </>
            }
            text="Few of our students will play chess professionally. All of them carry these habits into school, work and life."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {habits.map((h, i) => (
              <Reveal key={h.title} delay={i * 0.06}>
                <div className="group h-full rounded-[28px] border border-white/10 bg-white/5 p-7 transition-transform duration-300 hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-gold/10 ring-1 ring-gold/25 flex items-center justify-center">
                      <h.icon className="w-5 h-5 text-gold" />
                    </div>
                    <span className="font-display text-sm text-ghost tabular-nums">0{i + 1}</span>
                  </div>
                  <h3 className="font-display font-semibold text-2xl text-ivory mb-2">{h.title}</h3>
                  <p className="text-ghost leading-relaxed text-sm">{h.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section className="relative w-full section-padding overflow-hidden">
        <div className="relative max-w-7xl mx-auto grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal>
            <span className="pill-tag mb-5">Questions</span>
            <h2 className="font-display font-bold text-4xl sm:text-5xl text-ivory leading-[1.05]">
              What people ask about <span className="text-gradient italic">Chessverse</span>.
            </h2>
            <p className="mt-5 text-ghost text-lg leading-relaxed max-w-md">
              The short version of who we are, how we teach and what it means for your child.
            </p>
            <button type="button" onClick={() => go('#booking')} className="btn-primary mt-8">
              Book a free demo
              <ArrowRight className="w-4 h-4" />
            </button>
          </Reveal>
          <Reveal delay={0.08}>
            <Accordion type="single" collapsible defaultValue="faq-0" className="rounded-[28px] border border-sky/10 bg-twilight/60 px-6 sm:px-8">
              {faqs.map((f, i) => (
                <AccordionItem key={f.q} value={`faq-${i}`} className="border-sky/10">
                  <AccordionTrigger className="py-6 font-display text-lg sm:text-xl font-semibold text-ivory hover:no-underline hover:text-sky [&>svg]:text-gold">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 text-base text-ghost leading-relaxed">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>

      {/* ---------------- Closing CTA ---------------- */}
      <section className="relative w-full px-4 sm:px-6 lg:px-8 xl:px-12 pb-24 md:pb-32">
        <Reveal className="relative max-w-5xl mx-auto overflow-hidden rounded-[36px] border border-gold/20 bg-gradient-to-br from-midnight via-twilight to-void p-8 sm:p-12 md:p-16 text-center">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-[520px] max-w-full rounded-full bg-gold/15 blur-[100px] pointer-events-none" />
          <p className="relative font-display italic text-gold text-lg mb-3">It started in one classroom.</p>
          <h2 className="relative font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-ivory leading-tight mb-4">
            The next move is <span className="text-gradient-gold italic">your child’s</span>.
          </h2>
          <p className="relative text-ghost text-lg max-w-xl mx-auto mb-8">
            One free live class with a Chessverse coach: a real board, real feedback and an honest assessment of
            where your child is today.
          </p>
          <div className="relative flex flex-wrap justify-center gap-3">
            <button type="button" onClick={() => go('#booking')} className="btn-gold">
              Book the free class
              <ArrowRight className="w-4 h-4" />
            </button>
            <Link to="/gallery" onMouseEnter={() => prefetchRoute('/gallery')} className="btn-ghost">
              See the gallery
            </Link>
          </div>
          <p className="relative mt-5 text-xs text-ghost inline-flex items-center gap-1.5">
            <HeartHandshake className="w-3.5 h-3.5 text-gold" />
            No commitment, just a first move
          </p>
        </Reveal>
      </section>
    </>
  )
}
