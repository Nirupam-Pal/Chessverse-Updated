import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { GraduationCap, ChevronRight, Video, MapPin, Crown, Trophy } from 'lucide-react'

const services = [
  {
    level: 'Beginner',
    title: 'Pawn Starter',
    age: 'Ages 5+',
    description:
      'Perfect for those new to chess. Learn how each piece moves, master basic checkmates and start playing complete games with confidence.',
    features: ['Piece movement & rules', 'Basic checkmates', 'Simple openings', 'Fun puzzles'],
    duration: '12 weeks',
    icon: GraduationCap,
    accent: 'sky',
  },
  {
    level: 'Intermediate',
    title: 'Knight Tactician',
    age: 'For developing players',
    description:
      'For players with basic knowledge. Build a solid opening repertoire, sharpen tactics and learn how to convert winning positions.',
    features: ['Opening repertoire', 'Tactical patterns', 'Endgame essentials', 'Weekly game analysis'],
    duration: '24 weeks',
    icon: Trophy,
    accent: 'gold',
    featured: true,
  },
  {
    level: 'Advanced',
    title: 'Grandmaster Path',
    age: 'For rated / tournament players',
    description:
      'Elite training for serious competitors. Deep prep across openings, middlegame strategy, endgame technique and tournament psychology.',
    features: ['1:1 coach mentorship', 'Tournament prep', 'Advanced endgames', 'Position critiques'],
    duration: 'Ongoing',
    icon: Crown,
    accent: 'sky',
  },
]

function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const [hover, setHover] = useState(false)
  const featured = service.featured

  return (
    <motion.div
      ref={ref}
      data-testid={`service-card-${service.level.toLowerCase()}`}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`relative group rounded-3xl overflow-hidden transition-all duration-500 ${
        hover ? '-translate-y-2' : ''
      } ${featured ? 'lg:-mt-4' : ''}`}
    >
      {/* Animated halo for featured */}
      {featured && (
        <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-gold/40 via-sky/30 to-royal/40 opacity-70 blur-sm pointer-events-none" />
      )}

      <div
        className={`relative liquid-glass rounded-3xl p-7 sm:p-8 h-full flex flex-col glow-border ${
          featured ? 'border-gold/40' : ''
        }`}
      >
        {featured && (
          <span className="absolute top-5 right-5 pill-tag-gold !py-1 !px-3 !text-[10px]">
            Most Popular
          </span>
        )}

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
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              service.accent === 'gold'
                ? 'bg-gradient-to-br from-gold/25 to-gold/5 ring-1 ring-gold/30'
                : 'bg-gradient-to-br from-sky/25 to-royal/5 ring-1 ring-sky/25'
            }`}
          >
            <service.icon className={`w-6 h-6 ${service.accent === 'gold' ? 'text-gold' : 'text-sky'}`} />
          </div>
        </div>

        {/* Content */}
        <h3 className="font-display font-bold text-2xl sm:text-3xl text-ivory mb-3 leading-tight">
          {service.title}
        </h3>
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
              {f}
            </li>
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

        {/* CTA */}
        <a
          href="#booking"
          data-testid={`service-cta-${service.level.toLowerCase()}`}
          className={`w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group/btn ${
            featured
              ? 'bg-gradient-to-r from-gold to-[#B8881C] text-twilight hover:shadow-glow-gold'
              : 'bg-gradient-to-r from-sky/20 to-royal/20 text-sky hover:from-sky/30 hover:to-royal/30'
          }`}
        >
          Enroll Now
          <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </a>
      </div>
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
          transition={{ duration: 0.6 }}
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, i) => (
            <ServiceCard key={service.level} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
