import { useRef } from 'react'
import { Link } from 'react-router'
import { motion, useInView } from 'framer-motion'
import { EASE_OUT } from '@/lib/motion'
import { ArrowRight, ChevronRight, Video, MapPin } from 'lucide-react'
import { TiltCard, TiltDepth, TiltSheen } from '@/components/depth/TiltCard'
import { courses as services, type Course } from '@/data/courses'
import { prefetchRoute } from '@/lib/routes'

function ServiceCard({ service, index }: { service: Course; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const featured = service.featured
  const levelId = service.level.toLowerCase().replace(/\s+/g, '-') // "upper-intermediate"
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
      {/* inner layer: the 3D hover (tilt toward the cursor, lift, sheen, floating icon/title) */}
      <TiltCard accent={featured ? 'gold' : 'sky'} className="relative h-full rounded-3xl">
      {/* Animated halo for featured */}
      {featured && (
        <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-gold/40 via-sky/30 to-royal/40 opacity-70 blur-sm pointer-events-none" />
      )}

      <div
        className={`relative liquid-glass rounded-3xl p-7 sm:p-8 h-full flex flex-col glow-border overflow-hidden transition-shadow duration-500 ${accentShadow} ${
          featured ? 'border-gold/40' : ''
        }`}
      >
        <TiltSheen />

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
          <TiltDepth
            className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              service.accent === 'gold'
                ? 'bg-gradient-to-br from-gold/25 to-gold/5 ring-1 ring-gold/30'
                : 'bg-gradient-to-br from-sky/25 to-royal/5 ring-1 ring-sky/25'
            }`}
          >
            <service.icon className={`w-6 h-6 ${service.accent === 'gold' ? 'text-gold' : 'text-sky'}`} />
          </TiltDepth>
        </div>

        {/* Content */}
        {/* a touch smaller in the 4-across row, so every title fits on one line and the cards align */}
        <TiltDepth depth={4}>
          <h3 className="font-display font-bold text-2xl sm:text-3xl xl:text-[1.6rem] text-ivory mb-3 leading-tight whitespace-nowrap xl:whitespace-normal">
            {service.title}
          </h3>
        </TiltDepth>
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
      </TiltCard>
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
