import { Users, Trophy, Clock, BookOpen, Target, Crown, Sparkles } from 'lucide-react'

const stats = [
  { label: '1500+ Students Trained', icon: Users },
  { label: 'FIDE Aligned Curriculum', icon: BookOpen },
  { label: '12+ Years Experience', icon: Clock },
  { label: 'State Champion Coaches', icon: Crown },
  { label: 'Online + Offline Classes', icon: Target },
  { label: 'Tournament Mentorship', icon: Trophy },
  { label: 'Personalised Coaching', icon: Sparkles },
]

export default function StatsTicker() {
  const doubledStats = [...stats, ...stats]

  return (
    <section className="relative w-full bg-void py-7 overflow-hidden border-y border-sky/10 mask-fade-edges">
      <div className="flex animate-marquee whitespace-nowrap">
        {doubledStats.map((stat, i) => (
          <div key={i} className="flex items-center gap-3 mx-7 md:mx-12">
            <stat.icon className="w-5 h-5 text-sky flex-shrink-0" />
            <span className="font-display font-semibold text-base md:text-lg text-ivory tracking-wide">
              {stat.label}
            </span>
            <span className="text-gold/60 text-lg">&#9670;</span>
          </div>
        ))}
      </div>
    </section>
  )
}
