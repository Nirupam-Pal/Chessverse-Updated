import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Calendar, GraduationCap, MessageCircle } from 'lucide-react'

const levels = ['Beginner', 'Intermediate', 'Advanced']
const modes = ['Online', 'Offline (Agartala)']

export default function Booking() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    level: 'Beginner',
    mode: 'Online',
    preferred_time: '',
  })
  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const whatsappFallback = () => {
    const msg = `Hello ChessVerse, I want to book a free demo.%0A%0AName: ${form.name || '___'}%0APhone: ${form.phone || '___'}%0ALevel: ${form.level}%0AMode: ${form.mode}%0APreferred Time: ${form.preferred_time || '___'}`
    window.open(`https://wa.me/917629037237?text=${msg}`, '_blank')
  }

  return (
    <section id="booking" className="relative w-full bg-void section-padding overflow-hidden">
      <div className="absolute top-0 right-0 w-[520px] h-[520px] bg-royal/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold/5 rounded-full blur-[140px] pointer-events-none" />

      <div ref={ref} className="relative max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-14"
        >
          <span className="pill-tag-gold mb-5" data-testid="booking-tag">
            <Calendar className="w-3.5 h-3.5" />
            Free Demo Class
          </span>
          <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-ivory mb-5 leading-tight">
            Try a <span className="text-gradient-gold italic">Free Class</span> on Us
          </h2>
          <p className="text-ghost text-lg max-w-2xl mx-auto">
            Tell us about you and your child. Our team will reach out within 24 hours to
            schedule a free, no-obligation trial session.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="liquid-glass rounded-3xl p-6 sm:p-8 lg:p-10 relative"
        >
          <div className="space-y-6" data-testid="booking-form">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs uppercase tracking-widest text-ghost mb-2">
                  Full Name *
                </label>
                <input
                  data-testid="booking-input-name"
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  placeholder="John Doe / Parent name"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-sky/15 text-ivory text-sm placeholder:text-ghost/50 focus:border-sky focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-ghost mb-2">
                  Phone *
                </label>
                <input
                  data-testid="booking-input-phone"
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  placeholder="+91 9xxxx xxxxx"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-sky/15 text-ivory text-sm placeholder:text-ghost/50 focus:border-sky focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-ghost mb-2">
                  Email (optional)
                </label>
                <input
                  data-testid="booking-input-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-sky/15 text-ivory text-sm placeholder:text-ghost/50 focus:border-sky focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-ghost mb-2">
                  Preferred time
                </label>
                <input
                  data-testid="booking-input-time"
                  type="text"
                  value={form.preferred_time}
                  onChange={(e) => update('preferred_time', e.target.value)}
                  placeholder="e.g. Weekday 6 PM"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-sky/15 text-ivory text-sm placeholder:text-ghost/50 focus:border-sky focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs uppercase tracking-widest text-ghost mb-3">
                <GraduationCap className="w-4 h-4 text-sky" /> Skill Level
              </label>
              <div className="grid sm:grid-cols-3 gap-3">
                {levels.map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    data-testid={`booking-level-${lvl.toLowerCase()}`}
                    onClick={() => update('level', lvl)}
                    className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-300 ${
                      form.level === lvl
                        ? 'border-sky bg-sky/10 text-ivory shadow-glow'
                        : 'border-sky/15 bg-white/5 text-ghost hover:border-sky/30'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest text-ghost mb-3 block">
                Mode of Class
              </label>
              <div className="grid sm:grid-cols-2 gap-3">
                {modes.map((m) => (
                  <button
                    key={m}
                    type="button"
                    data-testid={`booking-mode-${m.split(' ')[0].toLowerCase()}`}
                    onClick={() => update('mode', m)}
                    className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-300 ${
                      form.mode === m
                        ? 'border-sky bg-sky/10 text-ivory shadow-glow'
                        : 'border-sky/15 bg-white/5 text-ghost hover:border-sky/30'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                data-testid="booking-whatsapp"
                onClick={whatsappFallback}
                className="w-full btn-primary flex justify-center items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Send via WhatsApp
              </button>
            </div>

            <p className="text-center text-xs text-ghost pt-2">
              By submitting, you agree to be contacted by ChessVerse about a free trial class.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
