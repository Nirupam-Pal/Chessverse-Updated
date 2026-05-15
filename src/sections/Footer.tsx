import { ChevronUp, MapPin, Phone, Mail, Facebook, Instagram } from 'lucide-react'

interface FooterLink {
  label: string;
  href: string;
  external?: boolean; // The '?' means this is optional
}

const links: Record<string, FooterLink[]> = {
  Courses: [
    { label: 'Beginner — Pawn Starter', href: '#services' },
    { label: 'Intermediate — Knight Tactician', href: '#services' },
    { label: 'Advanced — Grandmaster Path', href: '#services' },
    { label: '1:1 Coaching', href: '#booking' },
  ],
  Institute: [
    { label: 'About Us', href: '#about' },
    { label: 'Our Coaches', href: '#coaches' },
    { label: 'Achievements', href: '#achievements' },
    { label: 'Gallery', href: '#gallery' },
  ],
  Connect: [
    { label: 'Book Free Demo', href: '#booking' },
    { label: 'Contact Us', href: '#contact' },
    { label: 'WhatsApp', href: 'https://wa.me/917629037237', external: true },
    { label: 'Testimonials', href: '#testimonials' },
  ],
}

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer className="relative w-full bg-void border-t border-sky/10 overflow-hidden">
      {/* Subtle radial */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-royal/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-ivory ring-1 ring-sky/30 shadow-md shadow-royal/30">
                <img
                  src="/images/chessverse-logo.jpg"
                  alt="ChessVerse"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-display font-bold text-xl text-ivory leading-none">ChessVerse</p>
                <p className="text-[10px] uppercase tracking-[0.22em] text-ghost mt-1.5">
                  Chess Institute • Tripura
                </p>
              </div>
            </div>
            <p className="text-ghost text-sm leading-relaxed mb-6 max-w-xs">
              Tripura&apos;s premier chess academy. Shaping disciplined thinkers and
              tournament champions since 2013.
            </p>

            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3 text-ghost">
                <MapPin className="w-4 h-4 text-sky mt-0.5 shrink-0" />
                <span>Ramnagar 4, opposite Suruchi Restaurant, Agartala, Tripura</span>
              </li>
              <li>
                <a
                  href="tel:+917629037237"
                  className="flex items-center gap-3 text-ghost hover:text-ivory transition-colors"
                  data-testid="footer-phone"
                >
                  <Phone className="w-4 h-4 text-sky shrink-0" />
                  +91 76290 37237
                </a>
              </li>
              <li>
                <a
                  href="mailto:chessverse07@gmail.com"
                  className="flex items-center gap-3 text-ghost hover:text-ivory transition-colors"
                  data-testid="footer-email"
                >
                  <Mail className="w-4 h-4 text-sky shrink-0" />
                  chessverse07@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="font-display font-semibold text-ivory mb-4 text-base">{category}</h4>
              <ul className="space-y-2.5">
                {items.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      target={l.external ? '_blank' : undefined}
                      rel={l.external ? 'noopener noreferrer' : undefined}
                      className="text-ghost text-sm hover:text-sky transition-colors"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-6 border-t border-sky/10 flex flex-col sm:flex-row items-center justify-between gap-5">
          <p className="text-ghost text-xs text-center sm:text-left">
            &copy; {new Date().getFullYear()} ChessVerse Chess Institute. All rights reserved.
          </p>

          <div className="flex items-center gap-3">
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
                className="w-9 h-9 rounded-full liquid-glass flex items-center justify-center text-ghost hover:text-sky hover:border-sky/50 transition-all duration-300"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
            <button
              onClick={scrollToTop}
              data-testid="footer-scroll-top"
              aria-label="Back to top"
              className="ml-2 w-9 h-9 rounded-full bg-gradient-to-br from-sky to-royal text-ivory flex items-center justify-center hover:shadow-glow transition-all duration-300 hover:-translate-y-0.5"
            >
              <ChevronUp className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
