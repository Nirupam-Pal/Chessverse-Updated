import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Star, Quote, TrendingUp } from 'lucide-react'

const testimonials = [
  {
    name: 'Priyanka Dey',
    role: 'Parent of Student',
    image:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    quote:
      'My daughter joined ChessVerse two years ago. Today she is a district champion. The coaches don\'t just teach moves — they teach patience and focus.',
    rating: 5,
    improvement: 'District Champ',
  },
  {
    name: 'Rohan Chakraborty',
    role: 'Class 9 Student',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    quote:
      'I started as a beginner and now I am a FIDE rated player. The weekly analysis sessions taught me how to actually think, not just memorise openings.',
    rating: 5,
    improvement: 'FIDE Rated',
  },
  {
    name: 'Sneha Bhowmik',
    role: 'College Student',
    image:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80',
    quote:
      'Online classes from Dharmanagar — same quality as the Agartala batch. The discipline I learned here helps me beyond chess.',
    rating: 5,
    improvement: '+450 ELO',
  },
  {
    name: 'Anirban Datta',
    role: 'Parent of Student',
    image:
      'https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=300&q=80',
    quote:
      'The team is genuine. They send monthly progress reports and you can actually see your child growing — both in rating and in confidence.',
    rating: 5,
    improvement: 'State Finalist',
  },
]

export default function Testimonials() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="testimonials" className="relative w-full bg-twilight section-padding overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-royal/8 rounded-full blur-[200px] pointer-events-none" />
      <div className="absolute top-0 left-0 chess-grid-bg opacity-30 inset-0 pointer-events-none" />

      <div ref={ref} className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 md:mb-20"
        >
          <span className="pill-tag mb-5" data-testid="testimonials-tag">
            Success Stories
          </span>
          <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-ivory mb-5 leading-tight">
            What Our <span className="text-gradient italic">Families Say</span>
          </h2>
          <p className="text-ghost text-lg max-w-2xl mx-auto">
            Real stories from students and parents across Tripura who chose ChessVerse as their guide.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.name}
              data-testid={`testimonial-card-${index}`}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.12 }}
              className="group relative"
            >
              <div className="liquid-glass rounded-3xl p-6 h-full flex flex-col glow-border transition-all duration-500 group-hover:border-sky/45 group-hover:-translate-y-1">
                <Quote className="w-8 h-8 text-sky/30 mb-3" />
                <p className="text-ghost text-sm leading-relaxed mb-6 flex-grow">&ldquo;{t.quote}&rdquo;</p>

                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                  ))}
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-sky/10">
                  <img
                    src={t.image}
                    alt={t.name}
                    loading="lazy"
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-sky/30"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-semibold text-ivory text-sm truncate">{t.name}</p>
                    <p className="text-ghost text-xs truncate">{t.role}</p>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-sky/10 ring-1 ring-sky/25">
                    <TrendingUp className="w-3 h-3 text-sky" />
                    <span className="text-sky text-[11px] font-semibold whitespace-nowrap">
                      {t.improvement}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
