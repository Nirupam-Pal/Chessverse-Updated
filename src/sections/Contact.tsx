import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, MessageCircle } from 'lucide-react'

const contactInfo = [
  {
    icon: MapPin,
    label: 'Visit Us',
    value: 'Ramnagar 4, opposite Suruchi Restaurant, Agartala, Tripura',
    href: 'https://www.google.com/maps/search/?api=1&query=Ramnagar+4+Agartala',
  },
  {
    icon: Phone,
    label: 'Call / WhatsApp',
    value: '+91 76290 37237',
    href: 'tel:+917629037237',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'chessverse07@gmail.com',
    href: 'mailto:chessverse07@gmail.com',
  },
  {
    icon: Clock,
    label: 'Class Hours',
    value: 'Mon - Sat: 6 AM - 9 PM',
  },
]

export default function Contact() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })

  const whatsappFallback = () => {
    const msg = `Hello ChessVerse,%0A%0AName: ${form.name || '___'}%0AEmail: ${form.email || '___'}%0APhone: ${form.phone || '___'}%0A%0AMessage:%0A${form.message || '___'}`
    window.open(`https://wa.me/917629037237?text=${msg}`, '_blank')
  }

  return (
    <section id="contact" className="relative w-full bg-twilight section-padding overflow-hidden">
      <div className="absolute top-0 left-0 w-[480px] h-[480px] bg-royal/12 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-sky/8 rounded-full blur-[140px] pointer-events-none" />

      <div ref={ref} className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 md:mb-16"
        >
          <span className="pill-tag mb-5" data-testid="contact-tag">
            Get in Touch
          </span>
          <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-ivory mb-5 leading-tight">
            We&apos;d love to <span className="text-gradient italic">hear from you</span>
          </h2>
          <p className="text-ghost text-lg max-w-2xl mx-auto">
            Have questions about classes, fees or batches? Drop us a message — we usually reply within a few hours.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <div className="liquid-glass rounded-3xl p-6 sm:p-8">
              <div className="space-y-5" data-testid="contact-form">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-ghost mb-2">
                      Your Name *
                    </label>
                    <input
                      data-testid="contact-input-name"
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-sky/15 text-ivory text-sm placeholder:text-ghost/50 focus:border-sky focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-ghost mb-2">
                        Email
                      </label>
                      <input
                        data-testid="contact-input-email"
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-sky/15 text-ivory text-sm placeholder:text-ghost/50 focus:border-sky focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-ghost mb-2">
                        Phone
                      </label>
                      <input
                        data-testid="contact-input-phone"
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+91"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-sky/15 text-ivory text-sm placeholder:text-ghost/50 focus:border-sky focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-ghost mb-2">
                      Message *
                    </label>
                    <textarea
                      data-testid="contact-input-message"
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Tell us about your chess goals..."
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-sky/15 text-ivory text-sm placeholder:text-ghost/50 focus:border-sky focus:outline-none transition-colors resize-none"
                    />
                  </div>

              <button
                    type="button"
                    data-testid="contact-submit"
                    onClick={whatsappFallback}
                    className="w-full btn-primary justify-center flex items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Send via WhatsApp
                  </button>
              </div>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              {contactInfo.map((info, i) => {
                const inner = (
                  <>
                    <div className="w-10 h-10 rounded-xl bg-sky/10 ring-1 ring-sky/25 flex items-center justify-center mb-3">
                      <info.icon className="w-5 h-5 text-sky" />
                    </div>
                    <p className="text-ghost text-[10px] uppercase tracking-widest mb-1">{info.label}</p>
                    <p className="text-ivory text-sm font-medium leading-snug">{info.value}</p>
                  </>
                )
                return info.href ? (
                  <a
                    key={info.label}
                    href={info.href}
                    target={info.href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    data-testid={`contact-info-${i}`}
                    className="liquid-glass rounded-2xl p-5 glow-border block hover:-translate-y-1 transition-transform duration-300"
                  >
                    {inner}
                  </a>
                ) : (
                  <div
                    key={info.label}
                    data-testid={`contact-info-${i}`}
                    className="liquid-glass rounded-2xl p-5 glow-border"
                  >
                    {inner}
                  </div>
                )
              })}
            </div>

            {/* Map */}
            <div className="relative rounded-2xl overflow-hidden h-[260px] liquid-glass">
              <iframe
                title="ChessVerse Location"
                src="https://www.google.com/maps?q=Ramnagar+4+Agartala+Tripura&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'grayscale(40%) contrast(95%)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* WhatsApp banner */}
            <a
              href="https://wa.me/917629037237?text=Hello%2C%20I%20want%20to%20know%20more%20about%20your%20chess%20classes."
              target="_blank"
              rel="noopener noreferrer"
              data-testid="contact-whatsapp-banner"
              className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#128C7E]/20 to-[#25D366]/15 border border-[#25D366]/35 hover:border-[#25D366]/70 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center text-ivory shrink-0 group-hover:scale-110 transition-transform">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="font-display font-semibold text-ivory">Chat with us on WhatsApp</p>
                <p className="text-xs text-ghost">Usually replies in under 30 minutes</p>
              </div>
              <span className="text-[#25D366] text-sm font-semibold">Open →</span>
            </a>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <span className="text-ghost text-sm mr-1">Follow us</span>
              {[
                {
                  Icon: Facebook,
                  name: 'Facebook',
                  href: 'https://www.facebook.com/share/1FrEKo5cdU/?mibextid=wwXIfr',
                },
                {
                  Icon: Instagram,
                  name: 'Instagram',
                  href: 'https://www.instagram.com/chessverseofficial',
                },
              ].map(({ Icon, name, href }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  data-testid={`social-${name.toLowerCase()}`}
                  className="w-10 h-10 rounded-full liquid-glass flex items-center justify-center text-ghost hover:text-sky hover:border-sky/50 transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
