import { useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import ThemeToggle from '@/components/ThemeToggle'

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Courses', href: '#services' },
  { label: 'Achievements', href: '#achievements' },
  { label: 'Coaches', href: '#coaches' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
]

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (href: string) => {
    setMobileOpen(false)
    const el = document.querySelector(href)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav
      ref={navRef}
      data-testid="main-nav"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-twilight/85 backdrop-blur-xl border-b border-sky/15 shadow-lg shadow-void/30 light:bg-white/95 light:border-slate-200'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <button
            data-testid="nav-logo"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 group"
          >
            <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-ivory ring-1 ring-sky/30 shadow-md shadow-royal/30 transition-transform duration-300 group-hover:scale-105">
              <img
                src="/images/chessverse-logo.jpg"
                alt="ChessVerse"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display font-bold text-lg sm:text-xl text-ivory tracking-tight group-hover:text-sky transition-colors">
                Chessverse
              </span>
              <span className="hidden sm:block text-[10px] tracking-[0.22em] uppercase text-ghost mt-1">
                Chess Institute
              </span>
            </div>
          </button>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <button
                key={link.href}
                data-testid={`nav-link-${link.label.toLowerCase()}`}
                onClick={() => scrollTo(link.href)}
                className="text-sm font-medium text-ghost hover:text-ivory transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-sky to-azure group-hover:w-full transition-all duration-300" />
              </button>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />
            <button
              data-testid="nav-cta-demo"
              onClick={() => scrollTo('#booking')}
              className="btn-primary py-2.5 px-5 text-sm"
            >
              Book Free Demo
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            data-testid="nav-mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-ivory"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
          className={`lg:hidden absolute top-[72px] left-0 right-0 bg-twilight/95 backdrop-blur-xl border-b border-sky/15 transition-all duration-300 overflow-hidden light:bg-white/95 light:border-slate-200 ${
          mobileOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 py-6 flex flex-col gap-4">
          <ThemeToggle />
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                data-testid={`nav-mobile-link-${link.label.toLowerCase()}`}
                onClick={() => scrollTo(link.href)}
                className="text-left text-base font-medium text-ghost hover:text-ivory transition-colors py-3 border-b border-sky/10 last:border-0"
              >
                {link.label}
              </button>
            ))}
          </div>
          <button
            data-testid="nav-mobile-cta"
            onClick={() => scrollTo('#booking')}
            className="btn-primary mt-4 justify-center"
          >
            Book Free Demo
          </button>
        </div>
      </div>
    </nav>
  )
}
