import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Award, Star, Trophy, Users } from 'lucide-react'

const coaches = [
  {
    name: 'Coach Arijit Debbarma',
    title: 'Founder & Head Coach',
    rating: 'FIDE Trainer',
    image: '/images/coach-arijit.jpg',
    specialization: 'Opening Theory & Strategy',
    achievements: [
      'Tripura State Champion',
      '12+ years coaching experience',
      'Trained 1500+ students',
    ],
    students: '1,500+',
    ratingStars: 5,
    featured: true,
  },
  {
    name: 'Coach Riya Saha',
    title: 'Senior Instructor',
    rating: 'AICF Rated',
    image:
      'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80',
    specialization: 'Junior Coaching & Tactics',
    achievements: [
      'Womens State Finalist',
      'Specialist in early-age training',
      'Best Coach Award 2023',
    ],
    students: '600+',
    ratingStars: 5,
  },
  {
    name: 'Coach Subhajit Roy',
    title: 'Tournament Mentor',
    rating: 'FIDE Rated 1900+',
    image:
      'https://images.unsplash.com/photo-1542178243-bc20204b769f?auto=format&fit=crop&w=600&q=80',
    specialization: 'Endgame Mastery',
    achievements: [
      'North East Open medallist',
      'Authored opening guides',
      'Online & offline coaching',
    ],
    students: '450+',
    ratingStars: 5,
  },
  {
    name: 'Coach Anushka Paul',
    title: 'Junior Coach',
    rating: 'State Player',
    image:
      'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=600&q=80',
    specialization: 'Beginner Foundations',
    achievements: [
      'U-14 District Champion',
      'Patient, child-focused coaching',
      'Loves chess puzzles',
    ],
    students: '300+',
    ratingStars: 5,
  },
]

function CoachCard({ coach, index }: { coach: typeof coaches[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      data-testid={`coach-card-${index}`}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12 }}
      className="group relative"
    >
      {coach.featured && (
        <div className="absolute -inset-px rounded-[26px] bg-gradient-to-br from-gold/40 via-sky/30 to-royal/30 blur-sm opacity-70 pointer-events-none" />
      )}
      <div
        className={`relative liquid-glass rounded-3xl overflow-hidden glow-border transition-all duration-500 group-hover:border-sky/45 ${
          coach.featured ? 'border-gold/40' : ''
        }`}
      >
        {/* Image */}
        <div className="relative h-64 overflow-hidden">
          <img
            src={coach.image}
            alt={coach.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-twilight via-twilight/40 to-transparent" />
          <div
            className={`absolute top-4 right-4 px-3 py-1 rounded-full backdrop-blur-sm ${
              coach.featured ? 'bg-gold/20 ring-1 ring-gold/40' : 'bg-sky/20 ring-1 ring-sky/35'
            }`}
          >
            <span className={`text-xs font-semibold ${coach.featured ? 'text-gold' : 'text-sky'}`}>
              {coach.rating}
            </span>
          </div>
          {coach.featured && (
            <div className="absolute top-4 left-4 pill-tag-gold !py-1 !px-3 !text-[10px]">
              Founder
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <h3 className="font-display font-bold text-xl text-ivory mb-1 leading-tight">
              {coach.name}
            </h3>
            <p className={`text-sm font-medium ${coach.featured ? 'text-gold' : 'text-sky'}`}>
              {coach.title}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-sky" />
            <span className="text-ghost text-sm">{coach.specialization}</span>
          </div>

          <ul className="space-y-1.5">
            {coach.achievements.map((a, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-ghost">
                <Trophy className={`w-3 h-3 mt-0.5 flex-shrink-0 ${coach.featured ? 'text-gold' : 'text-sky'}`} />
                {a}
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-between pt-4 border-t border-sky/10">
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-ghost" />
              <span className="text-sm text-ghost">{coach.students} students</span>
            </div>
            <div className="flex items-center gap-1">
              {Array.from({ length: coach.ratingStars }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${coach.featured ? 'fill-gold text-gold' : 'fill-sky text-sky'}`}
                />
              ))}
            </div>
          </div>

          <a
            href="#booking"
            data-testid={`coach-cta-${index}`}
            className="w-full inline-flex items-center justify-center py-3 rounded-xl bg-gradient-to-r from-sky/20 to-royal/20 text-sky font-semibold text-sm hover:from-sky/30 hover:to-royal/30 transition-all duration-300"
          >
            Book a Session
          </a>
        </div>
      </div>
    </motion.div>
  )
}

export default function Coaches() {
  const headerRef = useRef<HTMLDivElement>(null)
  const isHeaderInView = useInView(headerRef, { once: true, margin: '-50px' })

  return (
    <section id="coaches" className="relative w-full bg-void section-padding overflow-hidden">
      <div className="absolute top-1/4 -right-32 w-[440px] h-[440px] rounded-full bg-sky/8 blur-[140px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 40 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 md:mb-20"
        >
          <span className="pill-tag mb-5" data-testid="coaches-tag">
            Our Coaches
          </span>
          <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-ivory mb-5 leading-tight">
            Meet the <span className="text-gradient italic">Minds</span> Behind ChessVerse
          </h2>
          <p className="text-ghost text-lg max-w-2xl mx-auto">
            FIDE-aligned trainers, state players and patient mentors — each
            of our coaches has helped shape the chess landscape of Tripura.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7">
          {coaches.map((coach, index) => (
            <CoachCard key={coach.name} coach={coach} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
