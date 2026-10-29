import { useRef, useSyncExternalStore } from 'react'
import { Link } from 'react-router'
import {
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion'
import { EASE_OUT } from '@/lib/motion'
import { ArrowRight, ChevronRight, Video, MapPin } from 'lucide-react'
import { courses as services, type Course } from '@/data/courses'
import { prefetchRoute } from '@/lib/routes'

// 3D tilt only where there's a real hover: a mouse or trackpad, not touch
const FINE_POINTER = '(hover: hover) and (pointer: fine)'
const subscribePointer = (onChange: () => void) => {
  const mq = window.matchMedia(FINE_POINTER)
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}
const useFinePointer = () =>
  useSyncExternalStore(subscribePointer, () => window.matchMedia(FINE_POINTER).matches, () => false)

const TILT = { x: 7, y: 9 } // max degrees around each axis
const SPRING = { stiffness: 220, damping: 22, mass: 0.6 }

function ServiceCard({ service, index }: { service: Course; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const featured = service.featured
  const levelId = service.level.toLowerCase().replace(/\s+/g, '-') // "upper-intermediate"

  // ---- 3D hover: the card tilts toward the cursor, lifts, and a light sheen follows the pointer.
  // Pointer position lives in motion values (0–1 across the card), so moving the mouse never
  // re-renders React; everything animates on springs and touches only transform and opacity.
  const reduced = useReducedMotion() ?? false
  const canTilt = useFinePointer() && !reduced
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const hovered = useMotionValue(0)
  const rotateX = useSpring(useTransform(py, [0, 1], [TILT.x, -TILT.x]), SPRING)
  const rotateY = useSpring(useTransform(px, [0, 1], [-TILT.y, TILT.y]), SPRING)
  const lift = useSpring(useTransform(hovered, [0, 1], [0, -6]), SPRING)
  const scale = useSpring(useTransform(hovered, [0, 1], [1, 1.02]), SPRING)
  // depth: icon and title drift a little with the cursor, as if they sat above the card
  const depthX = useSpring(useTransform(px, [0, 1], [-5, 5]), SPRING)
  const depthY = useSpring(useTransform(py, [0, 1], [-4, 4]), SPRING)
  const sheenOpacity = useSpring(hovered, SPRING)
  const sheenX = useTransform(px, (v) => `${v * 100}%`)
  const sheenY = useTransform(py, (v) => `${v * 100}%`)
  const sheenColor = featured ? 'rgba(243, 216, 122, 0.16)' : 'rgba(142, 202, 230, 0.13)'
  const sheen = useMotionTemplate`radial-gradient(420px circle at ${sheenX} ${sheenY}, ${sheenColor}, transparent 55%)`
  const rect = useRef<DOMRect | null>(null)

  const onPointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!canTilt || e.pointerType !== 'mouse') return
    rect.current = e.currentTarget.getBoundingClientRect() // measured once per hover, not per move
    hovered.set(1)
  }
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!canTilt || e.pointerType !== 'mouse') return
    const r = rect.current ?? (rect.current = e.currentTarget.getBoundingClientRect())
    px.set(Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)))
    py.set(Math.min(1, Math.max(0, (e.clientY - r.top) / r.height)))
    hovered.set(1)
  }
  const onPointerLeave = () => {
    rect.current = null
    px.set(0.5)
    py.set(0.5)
    hovered.set(0)
  }
  const accentShadow = featured
    ? 'group-hover:shadow-[0_32px_60px_-28px_rgba(166,128,26,0.55)]'
    : 'group-hover:shadow-[0_32px_60px_-28px_rgba(31,79,174,0.6)]'

  return (
    // outer layer: the scroll-in entrance (and the gold cards' raised position)
    <motion.div
      ref={ref}
      data-testid={`service-card-${levelId}`}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15, ease: EASE_OUT }}
      className={`relative ${featured ? 'xl:-mt-4' : ''}`}
    >
      {/* inner layer: the 3D hover */}
      <motion.div
        onPointerEnter={onPointerEnter}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        style={canTilt ? { rotateX, rotateY, y: lift, scale, transformPerspective: 1100 } : undefined}
        className="relative group h-full rounded-3xl"
      >
      {/* Animated halo for featured */}
      {featured && (
        <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-gold/40 via-sky/30 to-royal/40 opacity-70 blur-sm pointer-events-none" />
      )}

      <div
        className={`relative liquid-glass rounded-3xl p-7 sm:p-8 h-full flex flex-col glow-border overflow-hidden transition-shadow duration-500 ${accentShadow} ${
          featured ? 'border-gold/40' : ''
        }`}
      >
        {/* light sheen following the cursor */}
        {canTilt && (
          <motion.div
            aria-hidden
            style={{ background: sheen, opacity: sheenOpacity }}
            className="pointer-events-none absolute inset-0 rounded-3xl"
          />
        )}
        {/* {featured && (
          <span className="absolute top-2 right-1 pill-tag-gold !py-1 !px-3 !text-[10px]">
            Most Popular
          </span>
        )} */}

        {/* Level + age */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <span
              className={`inline-flex px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-[0.16em] ${
                service.accent === 'gold'
                  ? 'bg-gold/15 text-gold ring-1 ring-gold/30'
                  : 'bg-sky/15 text-sky ring-1 ring-sky/30'
              }`}
            >
              {service.level}
            </span>
            <p className="text-ghost text-xs mt-2">{service.age}</p>
          </div>
          <motion.div
            style={canTilt ? { x: depthX, y: depthY } : undefined}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              service.accent === 'gold'
                ? 'bg-gradient-to-br from-gold/25 to-gold/5 ring-1 ring-gold/30'
                : 'bg-gradient-to-br from-sky/25 to-royal/5 ring-1 ring-sky/25'
            }`}
          >
            <service.icon className={`w-6 h-6 ${service.accent === 'gold' ? 'text-gold' : 'text-sky'}`} />
          </motion.div>
        </div>

        {/* Content */}
        {/* a touch smaller in the 4-across row, so every title fits on one line and the cards align */}
        <motion.h3
          style={canTilt ? { x: depthX } : undefined}
          className="font-display font-bold text-2xl sm:text-3xl xl:text-[1.6rem] text-ivory mb-3 leading-tight whitespace-nowrap xl:whitespace-normal"
        >
          {service.title}
        </motion.h3>
        <p className="text-ghost text-sm leading-relaxed mb-6 flex-grow">{service.description}</p>

        {/* Features */}
        <ul className="space-y-2 mb-6">
          {service.features.map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm text-ghost">
              <span
                className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                  service.accent === 'gold' ? 'bg-gold' : 'bg-sky'
                }`}
              />
              {f}            </li>
          ))}
        </ul>

        {/* Meta */}
        <div className="flex items-center justify-between text-xs text-ghost mb-5 pt-4 border-t border-sky/10">
          <span className="inline-flex items-center gap-1.5">
            <Video className="w-3.5 h-3.5" /> Online
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" /> Offline
          </span>
          <span className="font-semibold text-ivory">{service.duration}</span>
        </div>

        <Link
          to={`/courses#${service.slug}`}
          onMouseEnter={() => prefetchRoute('/courses')}
          onFocus={() => prefetchRoute('/courses')}
          data-testid={`service-details-${levelId}`}
          className="btn-link mb-4 self-center"
        >
          Full course details
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        {/* CTA */}
        <a
          href="#booking"
          data-testid={`service-cta-${levelId}`}
          // gold cards get the gold CTA, blue cards the quieter soft-blue one (see the button system in index.css)
          className={`${featured ? 'btn-gold' : 'btn-soft'} group/btn w-full`}
        >
          Enroll Now
          <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
        </a>
      </div>
      </motion.div>
    </motion.div>
  )
}

export default function Services() {
  const headerRef = useRef<HTMLDivElement>(null)
  const isHeaderInView = useInView(headerRef, { once: true, margin: '-50px' })

  return (
    <section id="services" className="relative w-full bg-void section-padding overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-royal/10 blur-[160px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 40 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE_OUT }}
          className="text-center mb-14 md:mb-20"
        >
          <span className="pill-tag mb-5" data-testid="services-tag">
            Our Courses
          </span>
          <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-ivory mb-5 leading-tight">
            Choose Your <span className="text-gradient italic">Path</span>
          </h2>
          <p className="text-ghost text-lg max-w-2xl mx-auto">
            From your first move to rated tournaments — we have a program for every level.
            All courses are available <span className="text-ivory font-medium">online</span> and{' '}
            <span className="text-ivory font-medium">in-person</span> in Agartala.
          </p>
        </motion.div>

        {/* 2×2 until there's room for all four in one row; the gold cards only rise in that row */}
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
          {services.map((service, i) => (
            <ServiceCard key={service.slug} service={service} index={i} />
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            to="/courses"
            onMouseEnter={() => prefetchRoute('/courses')}
            onFocus={() => prefetchRoute('/courses')}
            data-testid="services-all-courses"
            className="btn-ghost group"
          >
            Explore every course in detail
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
