import { useEffect, type ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import {
  ArrowDown,
  ArrowRight,
  Award,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  Clock,
  HeartHandshake,
  MapPin,
  MessageCircle,
  MonitorPlay,
  Swords,
  Target,
  Timer,
  Trophy,
  UserRound,
  Users,
} from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import Reveal from '@/components/Reveal'
import LazyImage from '@/components/LazyImage'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { classFacts, courses, oneOnOne, whatsappLink, type BookingLevel, type Course } from '@/data/courses'
import { galleryCovers } from '@/data/gallery-covers'
import { prefetchRoute } from '@/lib/routes'
import { scrollToTarget } from '@/lib/scroll'

/* -------------------------------------------------------------------------- */
/* Content — facts come from elsewhere on the site (FAQs, About); keep in sync  */
/* -------------------------------------------------------------------------- */

const format = [
  { icon: MonitorPlay, title: 'Online or in person', text: 'Live video classes with an interactive board, or in person at our academy in Agartala.' },
  { icon: Users, title: 'Always live', text: 'Every class is taught live by a coach, never pre-recorded, so students can ask, try and get it wrong.' },
  { icon: Timer, title: 'Focused classes', text: `${classFacts.length}: long enough to go deep, short enough to stay sharp.` },
  { icon: CalendarDays, title: 'Timings that fit', text: `Batches run ${classFacts.hours}, so there’s a slot around school.` },
  { icon: Trophy, title: 'Real competition', text: 'Internal tournaments, plus guidance for district, state and national events.' },
  { icon: Award, title: 'Certificates', text: 'Students receive a certificate when they complete a course.' },
]

const steps = [
  { icon: CalendarCheck, title: 'Book a free demo', text: 'One live class with a coach: no fee, no commitment.' },
  { icon: Target, title: 'Get placed at the right level', text: 'The coach assesses how your child plays and recommends a program.' },
  { icon: Swords, title: 'Train live, every week', text: 'Structured lessons, puzzles and analysis of their own games.' },
  { icon: Trophy, title: 'Compete and grow', text: 'Tournaments, certificates, and the next program when they’re ready.' },
]

const faqs = [
  {
    q: 'Which course should my child start with?',
    a: 'You don’t have to decide alone. In the free demo class a coach assesses how your child plays and recommends the right program, whether they are brand new or already rated.',
  },
  {
    q: 'What is the youngest age you teach?',
    a: 'Pawn Starter is designed for children aged 5 and up, with short, playful lessons built for young learners.',
  },
  {
    q: 'Are the online and in-person courses the same?',
    a: 'Yes. Every course is available online and at our Agartala academy. Online classes are live video sessions with an interactive board, so students see every move in real time.',
  },
  {
    q: 'How long is each class, and when are classes held?',
    a: `Classes run 45 minutes to an hour, ${classFacts.hours}. You can choose the batch timing that suits you best.`,
  },
  {
    q: 'What are the fees?',
    a: 'Fees depend on the course level and duration. Message us on WhatsApp or through the contact page and we’ll share the details for the program you’re interested in.',
  },
  {
    q: 'Do students get a certificate?',
    a: 'Yes. Students receive a certificate on completing a course, and we also help them enter official chess competitions.',
  },
]

/* -------------------------------------------------------------------------- */
/* Shared bits                                                                 */
/* -------------------------------------------------------------------------- */

function SectionIntro({ tag, title, text, center = false }: { tag: string; title: ReactNode; text?: string; center?: boolean }) {
  return (
    <Reveal className={`max-w-3xl mb-12 md:mb-16 ${center ? 'mx-auto text-center' : ''}`}>
      <span className="pill-tag mb-5">{tag}</span>
      <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-ivory leading-[1.05]">{title}</h2>
      {text && <p className={`mt-5 text-ghost text-lg leading-relaxed ${center ? 'max-w-2xl mx-auto' : 'max-w-2xl'}`}>{text}</p>}
    </Reveal>
  )
}

const accentText = (c: Course) => (c.accent === 'gold' ? 'text-gold' : 'text-sky')
const accentChip = (c: Course) =>
  c.accent === 'gold' ? 'bg-gold/15 text-gold ring-1 ring-gold/30' : 'bg-sky/15 text-sky ring-1 ring-sky/30'
const accentIcon = (c: Course) =>
  c.accent === 'gold'
    ? 'bg-gradient-to-br from-gold/25 to-gold/5 ring-1 ring-gold/30'
    : 'bg-gradient-to-br from-sky/25 to-royal/5 ring-1 ring-sky/25'

/** Opens the free-demo form on the home page with this level already selected. */
function useBookDemo() {
  const navigate = useNavigate()
  return (level?: BookingLevel) => navigate(level ? `/?level=${level}#booking` : '/#booking')
}

/* -------------------------------------------------------------------------- */
/* At a glance — table from md up, stacked cards on phones                     */
/* -------------------------------------------------------------------------- */

function AtAGlance() {
  const rows: { label: string; value: (c: Course) => ReactNode }[] = [
    { label: 'Level', value: (c) => <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-[0.16em] ${accentChip(c)}`}>{c.level}</span> },
    { label: 'Who it’s for', value: (c) => c.age },
    { label: 'Duration', value: (c) => c.duration },
    { label: 'Focus', value: (c) => c.features.join(' · ') },
    { label: 'Format', value: () => 'Online & in person' },
  ]

  return (
    <>
      <Reveal className="hidden md:block overflow-hidden rounded-[28px] border border-sky/10 bg-twilight/60">
        <table className="w-full text-left">
          <caption className="sr-only">Chessverse courses compared</caption>
          <thead>
            <tr className="border-b border-sky/10">
              <th scope="col" className="w-[14%] p-6" />
              {courses.map((c) => (
                <th key={c.slug} scope="col" className="p-6 align-top">
                  <span className={`grid w-11 h-11 place-items-center rounded-2xl mb-4 ${accentIcon(c)}`}>
                    <c.icon className={`w-5 h-5 ${accentText(c)}`} />
                  </span>
                  <span className="block font-display font-bold text-2xl text-ivory">{c.title}</span>
                  <span className="mt-1 block text-sm font-normal text-ghost">{c.tagline}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className="border-b border-sky/10 last:border-0">
                <th scope="row" className="p-6 text-xs font-semibold uppercase tracking-[0.18em] text-ghost align-top">
                  {r.label}
                </th>
                {courses.map((c) => (
                  <td key={c.slug} className="p-6 text-sm text-ivory/90 leading-relaxed align-top">
                    {r.value(c)}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td />
              {courses.map((c) => (
                <td key={c.slug} className="px-6 pb-6">
                  <button
                    type="button"
                    onClick={() => scrollToTarget(c.slug)}
                    // arrow points down, so it nudges down
                    className="btn-link [--btn-nudge:0_3px]"
                  >
                    See the curriculum
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </Reveal>

      <div className="grid gap-4 md:hidden">
        {courses.map((c, i) => (
          <Reveal key={c.slug} delay={i * 0.06}>
            <button
              type="button"
              onClick={() => scrollToTarget(c.slug)}
              className="w-full text-left liquid-glass glow-border rounded-3xl p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-[0.16em] ${accentChip(c)}`}>{c.level}</span>
                  <p className="mt-3 font-display font-bold text-2xl text-ivory">{c.title}</p>
                  <p className="mt-1 text-sm text-ghost">{c.tagline}</p>
                </div>
                <span className={`grid w-11 h-11 shrink-0 place-items-center rounded-2xl ${accentIcon(c)}`}>
                  <c.icon className={`w-5 h-5 ${accentText(c)}`} />
                </span>
              </div>
              <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-xs text-ghost">For</dt>
                  <dd className="text-ivory">{c.age}</dd>
                </div>
                <div>
                  <dt className="text-xs text-ghost">Duration</dt>
                  <dd className="text-ivory">{c.duration}</dd>
                </div>
              </dl>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-sky">
                See the curriculum
                <ArrowDown className="w-4 h-4" />
              </span>
            </button>
          </Reveal>
        ))}
      </div>
    </>
  )
}

/* -------------------------------------------------------------------------- */
/* One program, in depth                                                       */
/* -------------------------------------------------------------------------- */

function CourseDetail({ course: c, index }: { course: Course; index: number }) {
  const bookDemo = useBookDemo()
  const facts = [
    { icon: UserRound, label: c.age },
    { icon: Clock, label: c.duration },
    { icon: Timer, label: classFacts.length },
    { icon: MonitorPlay, label: 'Online & in person' },
  ]

  return (
    <section
      id={c.slug}
      aria-labelledby={`${c.slug}-title`}
      className={`relative w-full section-padding overflow-hidden scroll-mt-20 ${index % 2 === 0 ? 'bg-twilight' : ''}`}
    >
      {index % 2 === 0 && <div className="absolute inset-0 chess-grid-bg opacity-30 pointer-events-none" />}
      <div className="relative max-w-7xl mx-auto">
        {/* heading */}
        <Reveal className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-5">
              <span className={`grid w-12 h-12 place-items-center rounded-2xl ${accentIcon(c)}`}>
                <c.icon className={`w-6 h-6 ${accentText(c)}`} />
              </span>
              <span className={`inline-flex px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-[0.16em] ${accentChip(c)}`}>
                {c.level} · Program {index + 1} of {courses.length}
              </span>
            </div>
            <h2 id={`${c.slug}-title`} className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-ivory leading-[1.05]">
              {c.title}
            </h2>
            <p className={`mt-3 font-display italic text-xl sm:text-2xl ${accentText(c)}`}>{c.tagline}</p>
            <p className="mt-5 text-ghost text-lg leading-relaxed">{c.overview}</p>
          </div>
          <ul className="flex flex-wrap gap-2 lg:max-w-sm lg:justify-end">
            {facts.map((f) => (
              <li key={f.label} className="inline-flex items-center gap-2 rounded-full border border-sky/15 bg-void/40 px-3.5 py-2 text-sm text-ivory">
                <f.icon className={`w-4 h-4 ${accentText(c)}`} />
                {f.label}
              </li>
            ))}
          </ul>
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          {/* who + outcomes + CTAs */}
          <Reveal className="flex flex-col gap-6">
            <div className="liquid-glass glow-border rounded-[28px] p-7">
              <h3 className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-ghost mb-4">Who it’s for</h3>
              <ul className="space-y-3">
                {c.idealFor.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-ivory/90">
                    <UserRound className={`w-4 h-4 mt-1 shrink-0 ${accentText(c)}`} />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="liquid-glass glow-border rounded-[28px] p-7">
              <h3 className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-ghost mb-4">By the end, students can</h3>
              <ul className="space-y-3">
                {c.outcomes.map((o) => (
                  <li key={o} className="flex items-start gap-3 text-ivory/90">
                    <CheckCircle2 className={`w-4 h-4 mt-1 shrink-0 ${accentText(c)}`} />
                    {o}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => bookDemo(c.bookingLevel)}
                data-testid={`course-book-${c.slug}`}
                className={`${c.featured ? 'btn-gold' : 'btn-primary'}`}
              >
                <CalendarCheck className="w-4 h-4" />
                Book a free demo
              </button>
              <a
                href={whatsappLink(`Hello Chessverse, I'd like to know more about the ${c.title} (${c.level}) course.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                <MessageCircle className="w-4 h-4" />
                Ask on WhatsApp
              </a>
            </div>
          </Reveal>

          {/* curriculum */}
          <Reveal delay={0.08}>
            <div className="rounded-[28px] border border-sky/10 bg-void/50 p-7 sm:p-8 h-full">
              <div className="flex items-baseline justify-between gap-4 mb-6">
                <h3 className="font-display font-semibold text-2xl text-ivory">What students learn</h3>
                <span className="text-sm text-ghost">{c.curriculum.length} modules</span>
              </div>
              <ol className="grid gap-4 sm:grid-cols-2">
                {c.curriculum.map((m, i) => (
                  <li key={m.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <span className={`font-display font-bold text-3xl leading-none ${c.accent === 'gold' ? 'text-gradient-gold' : 'text-gradient'}`}>
                      0{i + 1}
                    </span>
                    <p className="mt-3 font-display font-semibold text-lg text-ivory">{m.title}</p>
                    <ul className="mt-2 space-y-1.5">
                      {m.points.map((p) => (
                        <li key={p} className="flex items-start gap-2 text-sm text-ghost leading-relaxed">
                          <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${c.accent === 'gold' ? 'bg-gold' : 'bg-sky'}`} />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* Page                                                                        */
/* -------------------------------------------------------------------------- */

export default function CoursesPage() {
  const { hash } = useLocation()
  const bookDemo = useBookDemo()
  // real academy photos from the gallery (skipped if a folder is renamed)
  const workshopPhoto = galleryCovers.find((g) => g.folder.id === 'im-guest-workshop')?.cover
  const tournamentPhoto = galleryCovers.find((g) => g.folder.id === 'chessverse-open-school-rapid-chess-tournament')?.cover

  // This page is lazy-loaded, so on arrival via /courses#pawn-starter the global route-change
  // scroll ran before these sections existed: jump to the section once they're in the DOM.
  useEffect(() => {
    if (hash) scrollToTarget(hash, { immediate: true })
    // only on arrival — later hash changes are handled by SmoothScroll
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <PageHeader
        docTitle="Chess Courses — Chessverse Chess Institute"
        crumb="Courses"
        tag="Our Courses"
        title={
          <>
            A clear path from <span className="text-gradient italic">first move to tournament</span>
          </>
        }
        subtitle="Four structured programs and private 1:1 coaching, taught live by our coaches online and at our Agartala academy. Here is exactly what each one covers."
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <button type="button" onClick={() => bookDemo()} className="btn-gold">
            <CalendarCheck className="w-4 h-4" />
            Book a free demo
          </button>
          <button type="button" onClick={() => scrollToTarget('compare')} className="btn-ghost group">
            Compare the courses
            <ArrowDown className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-0.5" />
          </button>
        </div>
        <nav aria-label="Jump to a course" className="mt-8 flex flex-wrap gap-2">
          {[...courses.map((c) => ({ slug: c.slug, label: c.title, level: c.level as string })), { slug: oneOnOne.slug, label: oneOnOne.title, level: 'Private' }].map((l) => (
            <button
              key={l.slug}
              type="button"
              onClick={() => scrollToTarget(l.slug)}
              className="btn-chip"
            >
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ghost">{l.level}</span>
              {l.label}
            </button>
          ))}
        </nav>
      </PageHeader>

      {/* ---------------- At a glance ---------------- */}
      <section id="compare" className="relative w-full section-padding overflow-hidden scroll-mt-20">
        <div className="relative max-w-7xl mx-auto">
          <SectionIntro
            tag="At a glance"
            title={
              <>
                Four programs, <span className="text-gradient italic">one clear progression</span>.
              </>
            }
            text="Each program builds on the last. Not sure where your child fits? The free demo class includes an assessment, so the coach can place them at the right level."
          />
          <AtAGlance />
        </div>
      </section>

      {/* ---------------- The programs ---------------- */}
      {courses.map((c, i) => (
        <CourseDetail key={c.slug} course={c} index={i} />
      ))}

      {/* ---------------- 1:1 coaching ---------------- */}
      {/* backgrounds alternate down the page: the 4 programs end on a plain section, so this one is tinted */}
      <section id={oneOnOne.slug} aria-labelledby="one-on-one-title" className="relative w-full bg-twilight section-padding overflow-hidden scroll-mt-20">
        <div className="absolute top-1/4 -right-40 w-[480px] h-[480px] rounded-full bg-gold/10 blur-[140px] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto grid gap-10 lg:grid-cols-[1fr_1.1fr] items-center">
          <Reveal>
            <span className="pill-tag-gold mb-5">
              <HeartHandshake className="w-3.5 h-3.5" />
              Private coaching
            </span>
            <h2 id="one-on-one-title" className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-ivory leading-[1.05]">
              {oneOnOne.title}
            </h2>
            <p className="mt-3 font-display italic text-xl sm:text-2xl text-gold">{oneOnOne.tagline}</p>
            <p className="mt-5 text-ghost text-lg leading-relaxed max-w-xl">{oneOnOne.overview}</p>
            <p className="mt-4 text-ghost leading-relaxed max-w-xl">
              Available at every level, on its own or alongside a program. Grandmaster Path students get 1:1 mentorship
              as part of the course.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button type="button" onClick={() => bookDemo()} className="btn-gold">
                <CalendarCheck className="w-4 h-4" />
                Book a free demo
              </button>
              <a
                href={whatsappLink("Hello Chessverse, I'd like to know more about 1:1 private coaching.")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                <MessageCircle className="w-4 h-4" />
                Ask about 1:1 coaching
              </a>
            </div>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {oneOnOne.points.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.06}>
                <div className="h-full rounded-[24px] border border-white/10 bg-white/5 p-6">
                  <span className="font-display font-bold text-3xl text-gradient-gold leading-none">0{i + 1}</span>
                  <p className="mt-4 font-display font-semibold text-xl text-ivory">{p.title}</p>
                  <p className="mt-2 text-sm text-ghost leading-relaxed">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- How classes work ---------------- */}
      <section className="relative w-full section-padding overflow-hidden">
        <div className="absolute inset-0 chess-board-bg opacity-20 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto">
          <SectionIntro
            center
            tag="How classes work"
            title={
              <>
                The same care, <span className="text-gradient italic">in every course</span>.
              </>
            }
            text="Whichever program your child joins, this is what a week with Chessverse looks like."
          />
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] items-stretch">
            <div className="grid gap-4 sm:grid-cols-2">
              {format.map((f, i) => (
                <Reveal key={f.title} delay={(i % 2) * 0.06}>
                  <div className="h-full liquid-glass glow-border rounded-[24px] p-6">
                    <div className="w-11 h-11 rounded-2xl bg-sky/10 ring-1 ring-sky/25 flex items-center justify-center mb-5">
                      <f.icon className="w-5 h-5 text-sky" />
                    </div>
                    <p className="font-display font-semibold text-xl text-ivory">{f.title}</p>
                    <p className="mt-2 text-sm text-ghost leading-relaxed">{f.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            {workshopPhoto && (
              <Reveal delay={0.1}>
                <figure className="relative h-full min-h-[320px] overflow-hidden rounded-[28px] glow-border">
                  <LazyImage
                    fill
                    src={workshopPhoto.src}
                    srcSet={workshopPhoto.srcSet}
                    placeholder={workshopPhoto.placeholder}
                    alt="Students at a Chessverse workshop with a visiting International Master"
                    ratio={workshopPhoto.ratio}
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    // the frame is taller than the photo: keep the students, not the ceiling, in view
                    imgClassName="object-[center_85%]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060B1A]/85 via-transparent to-transparent" />
                  <figcaption className="absolute bottom-5 left-5 right-5">
                    <p className="font-display font-semibold text-white text-lg">Coaching, live and in the room</p>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-white/75">
                      <MapPin className="w-3.5 h-3.5" /> {classFacts.location}, or online from anywhere
                    </p>
                  </figcaption>
                </figure>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      {/* ---------------- Your path ---------------- */}
      <section className="relative w-full bg-twilight section-padding overflow-hidden">
        <div className="relative max-w-7xl mx-auto">
          <SectionIntro
            center
            tag="Getting started"
            title={
              <>
                Four steps to <span className="text-gradient italic">your first tournament</span>.
              </>
            }
          />
          <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.title}>
                <Reveal delay={i * 0.06} className="relative h-full rounded-[28px] border border-sky/10 bg-twilight/60 p-7">
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-gold/10 ring-1 ring-gold/25 flex items-center justify-center">
                      <s.icon className="w-5 h-5 text-gold" />
                    </div>
                    <span className="font-display text-sm text-ghost tabular-nums">Step 0{i + 1}</span>
                  </div>
                  <p className="font-display font-semibold text-xl text-ivory">{s.title}</p>
                  <p className="mt-2 text-sm text-ghost leading-relaxed">{s.text}</p>
                </Reveal>
              </li>
            ))}
          </ol>
          {tournamentPhoto && (
            <Reveal className="mt-8">
              <figure className="relative overflow-hidden rounded-[28px] glow-border">
                <LazyImage
                  src={tournamentPhoto.src}
                  srcSet={tournamentPhoto.srcSet}
                  placeholder={tournamentPhoto.placeholder}
                  alt="Students playing at the Chessverse Open School Rapid Chess Tournament"
                  ratio={21 / 9}
                  sizes="(min-width: 1280px) 1216px, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#060B1A]/85 via-[#060B1A]/30 to-transparent" />
                <figcaption className="absolute inset-y-0 left-0 flex max-w-md flex-col justify-center p-6 sm:p-10">
                  <p className="font-display font-bold text-white text-2xl sm:text-3xl leading-tight">Where training meets the clock</p>
                  <p className="mt-2 text-sm sm:text-base text-white/75">Chessverse Open School Rapid Chess Tournament</p>
                  <Link
                    to="/gallery?folder=chessverse-open-school-rapid-chess-tournament"
                    onMouseEnter={() => prefetchRoute('/gallery')}
                    // fixed light-blue/white: it sits on a dark photo overlay in both themes
                    className="btn-link mt-4 w-fit text-[#8ECAE6] hover:text-white"
                  >
                    See the tournament photos
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </figcaption>
              </figure>
            </Reveal>
          )}
        </div>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section className="relative w-full section-padding overflow-hidden">
        <div className="relative max-w-7xl mx-auto grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal>
            <span className="pill-tag mb-5">Questions</span>
            <h2 className="font-display font-bold text-4xl sm:text-5xl text-ivory leading-[1.05]">
              Choosing a <span className="text-gradient italic">course</span>.
            </h2>
            <p className="mt-5 text-ghost text-lg leading-relaxed max-w-md">
              The questions parents ask most before they enrol. Anything else, just ask us.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/contact" onMouseEnter={() => prefetchRoute('/contact')} className="btn-primary">
                Contact us
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
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
      <section className="relative w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-24 md:py-32">
        <Reveal className="relative max-w-5xl mx-auto overflow-hidden rounded-[36px] border border-gold/20 bg-gradient-to-br from-midnight via-twilight to-void p-8 sm:p-12 md:p-16 text-center">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-[520px] max-w-full rounded-full bg-gold/15 blur-[100px] pointer-events-none" />
          <p className="relative font-display italic text-gold text-lg mb-3">Not sure which course fits?</p>
          <h2 className="relative font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-ivory leading-tight mb-4">
            Let a coach <span className="text-gradient-gold italic">find the right level</span>.
          </h2>
          <p className="relative text-ghost text-lg max-w-xl mx-auto mb-8">
            One free live class: a real board, real feedback and an honest recommendation for where your child should
            start.
          </p>
          <div className="relative flex flex-wrap justify-center gap-3">
            <button type="button" onClick={() => bookDemo()} className="btn-gold">
              Book the free class
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href={whatsappLink("Hello Chessverse, I'd like help choosing the right chess course.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              <MessageCircle className="w-4 h-4" />
              Chat on WhatsApp
            </a>
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
