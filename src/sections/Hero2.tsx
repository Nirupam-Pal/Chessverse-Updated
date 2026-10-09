import { lazy, useEffect, useRef, useState, Suspense, type ReactNode } from 'react'
import { useSiteNav } from '@/lib/routes'
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from 'framer-motion'
import {
  ArrowRight,
  Award,
  CalendarCheck,
  Crown,
  MapPin,
  MonitorPlay,
  TrendingUp,
  Trophy,
  Users,
} from 'lucide-react'

// The 3D stage is its own chunk (three.js + r3f + drei), fetched only after the headline paints.
const HeroScene = lazy(() => import('./hero/HeroScene'))

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function useIsLightMode() {
  const [isLight, setIsLight] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    const update = () => setIsLight(root.classList.contains('light'))
    update()
    const observer = new MutationObserver(update)
    observer.observe(root, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  return isLight
}

/* ------------------------------------------------------------------ */
/*  HTML helpers                                                       */
/* ------------------------------------------------------------------ */

const EASE = [0.16, 1, 0.3, 1] as const
// Shared size for both headline lines. At lg "CRAFTING" (~5.4em) spans ~43vw from its 6vw inset,
// ending before the knight, which the 3D layer shifts right at that breakpoint.
const WORD_SIZE = 'text-[15vw] sm:text-[9.5vw] lg:text-[8vw]'

function CountUp({ to, prefix = '', suffix = '', start }: { to: number; prefix?: string; suffix?: string; start: boolean }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!start) return
    // update the text node directly each frame instead of re-rendering React
    const controls = animate(0, to, {
      duration: 1.8,
      ease: EASE,
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = `${prefix}${Math.round(v)}${suffix}`
      },
    })
    return () => controls.stop()
  }, [start, to, prefix, suffix])

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}0{suffix}
    </span>
  )
}

/** Button that leans toward the cursor and springs back on leave. */
function MagneticButton({
  children,
  className,
  onClick,
  testId,
}: {
  children: ReactNode
  className: string
  onClick: () => void
  testId: string
}) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 15 })
  const sy = useSpring(y, { stiffness: 220, damping: 15 })

  return (
    <motion.button
      data-testid={testId}
      onClick={onClick}
      style={{ x: sx, y: sy }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        x.set((e.clientX - r.left - r.width / 2) * 0.3)
        y.set((e.clientY - r.top - r.height / 2) * 0.4)
      }}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
      // .btn-* use transition-all; restrict it so CSS doesn't tween framer's per-frame transforms
      className={`${className} transition-[box-shadow,background-color,border-color,color]`}
    >
      {children}
    </motion.button>
  )
}

/** Eyebrow + one-line pitch. Brand-level wording (no region), so it travels as the academy grows. */
function HeroIntro({ className = '', centered = false }: { className?: string; centered?: boolean }) {
  return (
    <div className={className}>
      <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-gold">
        World-Class Chess Coaching
      </p>
      <p
        className={`hidden sm:block mt-3 text-sm lg:text-lg text-ghost leading-relaxed ${
          centered ? 'max-w-sm mx-auto' : 'max-w-md'
        }`}
      >
        Master the 64 squares — from your first move to your first rated tournament.
      </p>
    </div>
  )
}

const rise: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASE, delay: 0.25 + i * 0.1 },
  }),
}

type Stat = {
  icon: typeof Users
  to: number
  prefix?: string
  suffix: string
  label: string
  text: string
  tone: 'gold' | 'blue'
}

const featuredStat: Stat = {
  icon: Users,
  to: 1500,
  suffix: '+',
  label: 'Students trained',
  text: 'From first-time beginners to rated tournament players — online and at our Agartala academy.',
  tone: 'gold',
}

const stats: Stat[] = [
  { icon: Award, to: 12, suffix: '+', label: 'Years coaching', text: "Shaping Tripura's chess community", tone: 'blue' },
  { icon: Trophy, to: 50, suffix: '+', label: 'Tournament wins', text: 'Podium finishes by our students', tone: 'gold' },
  { icon: Crown, to: 100, suffix: '+', label: 'FIDE-rated players', text: 'Rated students and counting', tone: 'gold' },
  { icon: TrendingUp, to: 220, prefix: '+', suffix: '', label: 'Avg. ELO gain', text: 'In the first six months', tone: 'blue' },
]

function StatCard({ stat, start, featured = false, index }: { stat: Stat; start: boolean; featured?: boolean; index: number }) {
  const gold = stat.tone === 'gold'
  return (
    <motion.div
      initial={false}
      animate={start ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.96 }}
      transition={{ duration: 0.7, ease: EASE, delay: start ? index * 0.08 : 0 }}
      whileHover={{ y: -4 }}
      className={`group relative overflow-hidden rounded-2xl liquid-glass ${featured ? 'col-span-2 p-5 sm:p-6' : 'p-3.5 sm:p-4'}`}
    >
      {/* accent line + corner glow */}
      <span
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background: gold
            ? 'linear-gradient(90deg, transparent, rgba(212,175,55,0.9), transparent)'
            : 'linear-gradient(90deg, transparent, rgba(142,202,230,0.9), transparent)',
        }}
      />
      <span
        aria-hidden
        className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl opacity-60 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: gold ? 'rgba(212,175,55,0.28)' : 'rgba(58,141,222,0.3)' }}
      />

      <div className={`relative flex ${featured ? 'items-center gap-5 sm:gap-7' : 'flex-col gap-2'}`}>
        <div className={featured ? 'shrink-0' : 'flex items-center justify-between'}>
          <p
            className={`font-display font-black leading-none tracking-tight ${
              gold ? 'text-gradient-gold' : 'text-gradient'
            } ${featured ? 'text-[2.75rem] sm:text-6xl' : 'text-3xl sm:text-4xl'}`}
          >
            <CountUp to={stat.to} prefix={stat.prefix} suffix={stat.suffix} start={start} />
          </p>
          {!featured && <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${gold ? 'text-gold' : 'text-sky'}`} />}
        </div>

        <div className="min-w-0">
          <p className={`flex items-center gap-2 font-semibold text-ivory ${featured ? 'text-base sm:text-lg' : 'text-xs sm:text-sm'}`}>
            {featured && <stat.icon className="w-5 h-5 text-gold shrink-0" />}
            {stat.label}
          </p>
          <p className={`text-ghost leading-snug mt-1 ${featured ? 'hidden sm:block text-xs sm:text-sm' : 'hidden sm:block [@media(max-height:820px)]:hidden text-xs'}`}>
            {stat.text}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

const features = [
  { icon: MonitorPlay, title: 'Online & in-person', text: 'Live classes or at our Agartala academy' },
  { icon: Trophy, title: 'FIDE-rated coaching', text: '100+ rated students and counting' },
  { icon: TrendingUp, title: '+220 ELO in 6 months', text: 'Average rating growth of our students' },
]

/* ------------------------------------------------------------------ */
/*  Hero2                                                              */
/* ------------------------------------------------------------------ */

export default function Hero2() {
  const trackRef = useRef<HTMLElement>(null)
  const pointer = useRef({ x: 0, y: 0 })
  const isLight = useIsLightMode()
  const reduced = useReducedMotion() ?? false
  const inView = useInView(trackRef, { margin: '100px' })

  // Load order, so a refresh never shows a blank or janky hero:
  //  1. first paint: headline, copy and CTAs (plain DOM + CSS) — their entrance starts on the next
  //     frame and never waits for the 3D;
  //  2. once the browser is idle after that paint: fetch + mount the 3D chunk (three.js, the knight);
  //  3. the scene fades in by itself when it reports smooth frames (or after a fallback timeout).
  const [ready, setReady] = useState(false)
  const [loadScene, setLoadScene] = useState(false)
  const [sceneReady, setSceneReady] = useState(false)
  useEffect(() => {
    // Start the entrance once the display fonts are in (capped at 700ms on slow networks): the
    // headline is still invisible while Fraunces swaps in, so the swap's reflow is never seen.
    // Then a double rAF, so the hidden initial state paints first and the entrance is a real transition.
    let cancelled = false
    let raf1 = 0
    let raf2 = 0
    // fonts.load() requests the exact faces the headline uses (fonts.ready alone can resolve
    // before the browser has even asked for them)
    const fontsIn = document.fonts
      ? Promise.all([document.fonts.load('900 1em Fraunces'), document.fonts.load('italic 900 1em Fraunces')]).catch(() => {})
      : Promise.resolve()
    Promise.race([fontsIn, new Promise((r) => setTimeout(r, 700))]).then(() => {
      if (cancelled) return
      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => setReady(true))
      })
    })
    // Safari has no requestIdleCallback; a short timeout after paint does the same job there
    const hasIdle = typeof window.requestIdleCallback === 'function'
    const idle = hasIdle
      ? window.requestIdleCallback(() => setLoadScene(true), { timeout: 1200 })
      : window.setTimeout(() => setLoadScene(true), 300)
    const fallback = window.setTimeout(() => setSceneReady(true), 6000)
    return () => {
      cancelled = true
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
      if (hasIdle) window.cancelIdleCallback(idle)
      else window.clearTimeout(idle)
      window.clearTimeout(fallback)
    }
  }, [])

  // the section is 340vh tall; its inner frame is pinned while this runs 0 → 1
  //   01 hero  0 – 0.2  ·  02 why  0.22 – 0.58  ·  03 numbers  0.6 – 1
  const { scrollYProgress: rawProgress } = useScroll({ target: trackRef, offset: ['start start', 'end end'] })
  // Mirror into a plain motion value: framer otherwise hands opacity transforms to a native
  // ScrollTimeline that spans the whole document, ignoring the target offsets above.
  const scrollYProgress = useMotionValue(rawProgress.get())
  useMotionValueEvent(rawProgress, 'change', (v) => scrollYProgress.set(v))
  // chapter 01
  // both lines exit left, the second a touch faster for a slight shear
  const thinkX = useTransform(scrollYProgress, [0, 0.3], ['0vw', '-45vw'])
  const aheadX = useTransform(scrollYProgress, [0, 0.3], ['0vw', '-60vw'])
  const wordsOpacity = useTransform(scrollYProgress, [0, 0.24], [1, 0])
  // 3D offset (lg only, via --scene-shift): right for chapters 01–02, centred by chapter 03
  const sceneX = useTransform(scrollYProgress, [0.5, 0.64], [1, 0], { clamp: true })
  const sceneShift = useTransform(sceneX, (k) => `calc(var(--scene-shift) * ${k.toFixed(4)})`)
  const barOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0])
  const barY = useTransform(scrollYProgress, [0, 0.12], [0, 50])
  const barEvents = useTransform(scrollYProgress, (v) => (v < 0.1 ? 'auto' : 'none'))

  // chapter 02 — in, hold, out
  const panelOpacity = useTransform(scrollYProgress, [0.22, 0.36, 0.5, 0.58], [0, 1, 1, 0])
  const panelY = useTransform(scrollYProgress, [0.22, 0.4, 0.5, 0.58], [60, 0, 0, -50])
  const panelEvents = useTransform(scrollYProgress, (v) => (v > 0.3 && v < 0.54 ? 'auto' : 'none'))
  const panelVisibility = useTransform(panelOpacity, (o) => (o < 0.01 ? 'hidden' : 'visible'))

  // chapter 03
  const numbersOpacity = useTransform(scrollYProgress, [0.6, 0.7], [0, 1])
  const numbersY = useTransform(scrollYProgress, [0.6, 0.74], [50, 0])
  const numbersEvents = useTransform(scrollYProgress, (v) => (v > 0.64 ? 'auto' : 'none'))
  const numbersVisibility = useTransform(numbersOpacity, (o) => (o < 0.01 ? 'hidden' : 'visible'))
  const [statsStarted, setStatsStarted] = useState(false)
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (v > 0.64 && !statsStarted) setStatsStarted(true)
  })

  // progress rail + chapter labels
  const railScale = useTransform(scrollYProgress, [0, 1], [0.06, 1])
  const ch1 = useTransform(scrollYProgress, [0.16, 0.24], [1, 0])
  const ch2 = useTransform(scrollYProgress, [0.16, 0.24, 0.52, 0.6], [0, 1, 1, 0])
  const ch3 = useTransform(scrollYProgress, [0.52, 0.6], [0, 1])

  // cursor glow
  const glowX = useSpring(useMotionValue(-1000), { stiffness: 90, damping: 20 })
  const glowY = useSpring(useMotionValue(-1000), { stiffness: 90, damping: 20 })

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1
      glowX.set(e.clientX)
      glowY.set(e.clientY)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [glowX, glowY])

  const go = useSiteNav() // page links (contact now lives on /contact)
  const scrollTo = (id: string) => {
    const el = document.querySelector(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const outline = {
    WebkitTextStroke: isLight ? '2.5px rgba(30,64,175,0.85)' : '2.5px rgba(142,202,230,0.85)',
    color: 'transparent',
  }

  return (
    <section ref={trackRef} data-testid="hero2" className="relative h-[340vh] bg-void">
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {/* ---------- headline: a two-line stack in its own column ----------
            lg+: left column, with the 3D shifted right so the two never overlap.
            Below lg: stacked above the knight. Front layer (z-15) so the mirror floor can't hide it. */}
        <motion.div
          style={{ opacity: wordsOpacity }}
          className="absolute inset-0 z-[15] pointer-events-none select-none"
        >
          <div className="absolute left-4 sm:left-8 lg:left-[6vw] top-[13%] sm:top-[12%] lg:top-1/2 lg:-translate-y-[55%]">
            <h1 aria-label="Crafting minds." className="font-display font-black leading-[0.88] tracking-tighter">
              <motion.span style={{ x: thinkX }} className="block">
                <motion.span
                  initial={{ x: -120, opacity: 0 }}
                  animate={ready ? { x: 0, opacity: 1 } : undefined}
                  transition={{ duration: 1.4, ease: EASE, delay: 0.05 }}
                  className={`block will-change-transform ${WORD_SIZE} text-ivory/90`}
                >
                  CRAFTING
                </motion.span>
              </motion.span>
              <motion.span style={{ x: aheadX }} className="block">
                <motion.span
                  initial={{ x: -120, opacity: 0 }}
                  animate={ready ? { x: 0, opacity: 1 } : undefined}
                  transition={{ duration: 1.4, ease: EASE, delay: 0.2 }}
                  className={`block will-change-transform ${WORD_SIZE} italic pr-[0.08em]`}
                  style={outline}
                >
                  MINDS.
                </motion.span>
              </motion.span>
            </h1>

            {/* lg+: intro copy sits directly under the headline, sharing its left edge.
                Below lg the knight sits right under the stack, so this copy lives in the bottom bar. */}
            <motion.div style={{ x: aheadX }} className="hidden lg:block mt-8 xl:mt-10 max-w-md">
              <motion.div variants={rise} initial="hidden" animate={ready ? 'show' : 'hidden'} custom={2}>
                <HeroIntro />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* ---------- 3D ---------- */}
        <motion.div
          // lg+: the scene sits 13vw right (clearing the left-hand headline and chapter-02 panel), then
          // glides back to centre for chapter 03, whose panel is on the right. It overhangs both
          // edges by 15vw so the shift never reveals a seam.
          className="absolute inset-y-0 inset-x-0 lg:-inset-x-[15vw] z-10 pointer-events-none [--scene-shift:0vw] lg:[--scene-shift:13vw]"
          initial={{ opacity: 0 }}
          animate={{ opacity: sceneReady ? 1 : 0 }}
          transition={{ duration: 1.2, ease: EASE }}
          style={{
            x: sceneShift,
            maskImage: 'linear-gradient(to bottom, transparent 0%, #000 12%, #000 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, #000 12%, #000 100%)',
          }}
        >
          {loadScene && (
            <Suspense fallback={null}>
              <HeroScene
                scroll={scrollYProgress}
                pointer={pointer}
                isLight={isLight}
                reduced={reduced}
                active={inView}
                onReady={() => setSceneReady(true)}
              />
            </Suspense>
          )}
        </motion.div>

        {/* cursor glow over the scene */}
        <motion.div
          aria-hidden
          className="absolute left-0 top-0 z-10 w-[560px] h-[560px] -ml-[280px] -mt-[280px] rounded-full pointer-events-none hidden md:block"
          style={{
            x: glowX,
            y: glowY,
            background: 'radial-gradient(circle, rgba(58,141,222,0.16), transparent 60%)',
          }}
        />

        {/* ---------- chapter 01 : bottom bar ---------- */}
        <motion.div
          style={{ opacity: barOpacity, y: barY, pointerEvents: barEvents }}
          className="absolute inset-x-0 bottom-0 z-20"
        >
          {/* lg+: full-width with the headline's 6vw inset, so the eyebrow and copy line up with
              the left edge of "CRAFTING / MINDS." at every desktop width */}
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:max-w-none lg:px-[6vw] pb-8 sm:pb-10 grid gap-6 lg:grid-cols-[1fr_auto_1fr] lg:items-end">
            {/* below lg: the intro, centred. lg+: an empty spacer cell (the intro moves up under the
                headline) that keeps the CTAs centred in the 1fr/auto/1fr grid */}
            <motion.div variants={rise} initial="hidden" animate={ready ? 'show' : 'hidden'} custom={0} className="text-center">
              <HeroIntro className="lg:hidden" centered />
            </motion.div>

            <motion.div
              variants={rise}
              initial="hidden"
              animate={ready ? 'show' : 'hidden'}
              custom={1}
              className="flex flex-wrap items-center justify-center gap-3"
            >
              <MagneticButton testId="hero2-cta-demo" onClick={() => scrollTo('#booking')} className="btn-gold">
                <CalendarCheck className="w-4 h-4" />
                Book Free Demo
              </MagneticButton>
              <MagneticButton testId="hero2-cta-join" onClick={() => scrollTo('#booking')} className="btn-ghost group">
                Join Now
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </MagneticButton>
            </motion.div>

            {/* scroll hint — the numbers now live in chapter 03 */}
            <motion.div
              variants={rise}
              initial="hidden"
              animate={ready ? 'show' : 'hidden'}
              custom={2}
              className="hidden lg:flex justify-end items-center gap-3"
            >
              {/* <span className="text-right text-[11px] uppercase tracking-[0.25em] text-ghost leading-relaxed">
                Scroll to explore
                <br />
                <span className="text-ivory">3 chapters</span>
              </span> */}
              {/* <span className="w-6 h-10 rounded-full border-2 border-sky/50 flex justify-center pt-1.5">
                <motion.span
                  className="w-1 h-2 rounded-full bg-gold"
                  animate={reduced ? undefined : { y: [0, 12, 0], opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                />
              </span> */}
            </motion.div>
          </div>
        </motion.div>

        {/* ---------- chapter 02 : feature panel ---------- */}
        <div className="absolute inset-x-0 bottom-0 lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 z-20 pointer-events-none">
          <motion.div
            style={{ opacity: panelOpacity, y: panelY, pointerEvents: panelEvents, visibility: panelVisibility }}
            className="max-w-7xl mx-auto px-5 sm:px-8 pb-8 lg:pb-0"
          >
            <div className="max-w-md mx-auto lg:mx-0 text-center lg:text-left">
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-sky">Why Chessverse</p>
              <h2 className="mt-3 font-display font-bold text-3xl sm:text-5xl text-ivory leading-[1.05] tracking-tight">
                Train like a <span className="text-gradient-gold italic">grandmaster.</span>
              </h2>

              <ul className="mt-6 sm:mt-8 space-y-2.5 sm:space-y-3 text-left">
                {features.map((f) => (
                  <li key={f.title} className="liquid-glass rounded-2xl px-4 py-3 flex items-center gap-4">
                    <span className="grid place-items-center shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-sky to-royal shadow-glow">
                      <f.icon className="w-5 h-5 text-white" />
                    </span>
                    <div>
                      <p className="text-sm sm:text-base font-semibold text-ivory">{f.title}</p>
                      <p className="text-xs text-ghost mt-0.5">{f.text}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-3">
                <MagneticButton testId="hero2-cta-contact" onClick={() => go('/contact')} className="btn-primary group">
                  Talk to a coach
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </MagneticButton>
                <span className="inline-flex items-center gap-2 text-xs text-ghost">
                  <MapPin className="w-3.5 h-3.5 text-sky" /> Ramnagar 4, Agartala
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ---------- chapter 03 : by the numbers ---------- */}
        <div className="absolute inset-x-0 bottom-0 lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 z-20 pointer-events-none">
          <motion.div
            style={{ opacity: numbersOpacity, y: numbersY, pointerEvents: numbersEvents, visibility: numbersVisibility }}
            className="max-w-7xl mx-auto px-5 sm:px-8 pb-6 lg:pb-0"
          >
            <div className="max-w-xl mx-auto lg:mx-0 lg:ml-auto lg:mr-16">
              <div className="text-center lg:text-left">
                <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">
                  <span className="h-px w-6 bg-gold" /> By the numbers
                </p>
                <h2 className="mt-2 sm:mt-3 font-display font-bold text-[1.7rem] sm:text-4xl xl:text-[2.75rem] text-ivory leading-[1.05] tracking-tight">
                  A decade of{" "}<span className="text-gradient italic">winning moves.</span>
                </h2>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2.5 sm:gap-3">
                <StatCard stat={featuredStat} start={statsStarted} featured index={0} />
                {stats.map((s, i) => (
                  <StatCard key={s.label} stat={s} start={statsStarted} index={i + 1} />
                ))}
              </div>

              <div className="mt-5 flex justify-center lg:justify-start">
                <MagneticButton testId="hero2-cta-numbers" onClick={() => scrollTo('#booking')} className="btn-gold">
                  <CalendarCheck className="w-4 h-4" />
                  Be our next success story
                </MagneticButton>
              </div>
            </div>
          </motion.div>
        </div>

        {/* CC BY 4.0 attribution for the knight model */}
        <a
          href="https://sketchfab.com/3d-models/stylized-red-knight-chess-piece-736b3794702644b89fc3ed3c3c42109a"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute left-3 sm:left-5 bottom-1.5 z-20 text-[9px] sm:text-[10px] tracking-wide text-ghost hover:text-ivory transition-colors"
        >
          Knight model by noamkremerpro · CC BY 4.0
        </a>

        {/* ---------- chapter rail ---------- */}
        <div className="hidden md:flex absolute right-6 lg:right-8 top-1/2 -translate-y-1/2 z-20 flex-col items-center gap-4">
          <div className="relative h-10 w-6 font-display text-sm text-ivory">
            <motion.span style={{ opacity: ch1 }} className="absolute inset-0 grid place-items-center">01</motion.span>
            <motion.span style={{ opacity: ch2 }} className="absolute inset-0 grid place-items-center text-sky">02</motion.span>
            <motion.span style={{ opacity: ch3 }} className="absolute inset-0 grid place-items-center text-gold">03</motion.span>
          </div>
          <div className="relative h-32 w-px bg-sky/20 overflow-hidden">
            <motion.div
              style={{ scaleY: railScale }}
              className="absolute inset-0 origin-top bg-gradient-to-b from-azure to-gold"
            />
          </div>
          {/* scroll mouse — a direct child of the rail (not inside the old vertical-text label, whose
              writing-mode swapped the flex axes and pushed the dot off-centre) */}
          <span aria-hidden className="flex h-10 w-6 shrink-0 justify-center rounded-full border-2 border-sky/50 pt-1.5">
            <motion.span
              className="block h-2 w-1 rounded-full bg-gold"
              animate={reduced ? undefined : { y: [0, 12, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            />
          </span>
        </div>
      </div>
    </section>
  )
}
