import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router'
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring, type Variants } from 'framer-motion'
import { ArrowRight, ChevronDown, Menu, X } from 'lucide-react'
import ThemeToggle from '@/components/ThemeToggle'
import { EASE_OUT } from '@/lib/motion'
import { prefetchRoute, useSiteNav } from '@/lib/routes'
import { lockScroll } from '@/lib/scroll'

// `#id` → a landing-page section (reachable from any page); `/path` → its own page.
const navLinks = [
  { label: 'About', to: '/about' }, // the About page — includes the founder's story
  { label: 'Courses', to: '#services' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Achievements', to: '#achievements' },
  { label: 'Star Performer', to: '#star-performer' },
  { label: 'Testimonials', to: '#testimonials' },
  { label: 'Contact', to: '/contact' },
]
const SECTION_IDS = navLinks.filter((l) => l.to.startsWith('#')).map((l) => l.to.slice(1))

// Desktop bar shows the essentials; the rest live under "More" so the capsule stays airy.
// (The mobile menu lists every link.)
const MORE_LABELS = ['Achievements', 'Star Performer', 'Testimonials']
const moreLinks = navLinks.filter((l) => MORE_LABELS.includes(l.label))
const primaryBefore = navLinks.filter((l) => ['About', 'Courses', 'Gallery'].includes(l.label))
const primaryAfter = navLinks.filter((l) => l.label === 'Contact')
const MORE_BLURBS: Record<string, string> = {
  Achievements: 'Milestones & medals',
  'Star Performer': 'Our student in the spotlight',
  Testimonials: 'Stories from parents & students',
}

/** A link is active when its page is open, or (on home) when its section is in view. */
const isLinkActive = (to: string, pathname: string, section: string | null) =>
  to.startsWith('#') ? pathname === '/' && section === to.slice(1) : pathname === to

// shared easing for the capsule morph (CSS side of EASE_OUT)
const MORPH = 'duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]'
const PILL_SPRING = { type: 'spring', stiffness: 380, damping: 32 } as const

/** Scroll-spy: the section currently crossing the middle of the viewport. */
function useActiveSection(ids: string[], pathname: string) {
  const [active, setActive] = useState<string | null>(null)

  // re-observe whenever the page changes: the layout (and this navbar) outlive route changes
  // (a stale section id off home is harmless: isLinkActive only consults it on '/')
  useEffect(() => {
    const inBand = new Map<string, boolean>()
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => inBand.set(e.target.id, e.isIntersecting))
        setActive(ids.find((id) => inBand.get(id)) ?? null)
      },
      // a thin band just above the middle of the screen
      { rootMargin: '-45% 0px -50% 0px' },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [ids, pathname])

  return active
}

type NavItem = (typeof navLinks)[number]

function NavLink({
  link,
  isActive,
  hovered,
  onHover,
  onGo,
}: {
  link: NavItem
  isActive: boolean
  hovered: string | null
  onHover: (to: string) => void
  onGo: (to: string) => void
}) {
  const id = link.to
  return (
    <button
      data-testid={`nav-link-${link.label.toLowerCase()}`}
      onClick={() => onGo(link.to)}
      onMouseEnter={() => {
        onHover(id)
        prefetchRoute(link.to)
      }}
      onFocus={() => prefetchRoute(link.to)}
      aria-current={isActive ? (link.to.startsWith('/') ? 'page' : 'true') : undefined}
      className={`relative px-3.5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors duration-300 ${
        isActive ? 'text-ivory' : 'text-ghost hover:text-ivory'
      }`}
    >
      {hovered === id && (
        <motion.span layoutId="nav-hover" className="absolute inset-0 rounded-full bg-sky/10" transition={PILL_SPRING} />
      )}
      {isActive && (
        <motion.span
          layoutId="nav-active"
          className="absolute left-3.5 right-3.5 -bottom-0.5 h-[2px] rounded-full bg-gradient-to-r from-sky via-azure to-gold"
          transition={PILL_SPRING}
        />
      )}
      <span className="relative">{link.label}</span>
    </button>
  )
}

const menuList: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.045, delayChildren: 0.08 } },
}
const menuItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE_OUT } },
}

export default function Navigation() {
  const { scrollY, scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 220, damping: 32, restDelta: 0.001 })

  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [hovered, setHovered] = useState<string | null>(null)
  const [moreOpen, setMoreOpen] = useState(false)
  const { pathname } = useLocation()
  const go = useSiteNav()
  const section = useActiveSection(SECTION_IDS, pathname)
  const isActive = (to: string) => isLinkActive(to, pathname, section)
  const moreActive = moreLinks.some((l) => isActive(l.to))

  // Morph into the capsule once scrolled; tuck away while reading down, return on scroll up.
  // Distances are measured from where the scroll direction last flipped, so smooth (Lenis)
  // scrolling — a few px per frame — still triggers reliably without flicker.
  const direction = useRef<1 | -1>(1)
  const turnY = useRef(0)
  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    const dir = y > prev ? 1 : y < prev ? -1 : direction.current
    if (dir !== direction.current) {
      direction.current = dir
      turnY.current = prev
    }
    setScrolled(y > 40)
    if (y < 240) setHidden(false)
    else if (dir === 1 && y - turnY.current > 80) setHidden(true)
    else if (dir === -1 && turnY.current - y > 24) setHidden(false)
  })

  useEffect(() => {
    if (!mobileOpen && !moreOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setMobileOpen(false)
      setMoreOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mobileOpen, moreOpen])

  // keep the page still behind the open mobile menu
  useEffect(() => {
    if (!mobileOpen) return
    lockScroll(true)
    return () => lockScroll(false)
  }, [mobileOpen])

  const scrollTo = (to: string) => {
    setMobileOpen(false)
    setMoreOpen(false)
    lockScroll(false) // release now: a stopped Lenis ignores scrollTo, and the effect cleanup runs too late
    go(to)
  }

  const isHidden = hidden && !mobileOpen

  return (
    <>
      {/* dim + blur the page behind the open mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="nav-backdrop"
            className="fixed inset-0 z-40 bg-void/40 backdrop-blur-sm xl:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.nav
        data-testid="main-nav"
        className="fixed inset-x-0 top-0 z-50 pointer-events-none"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: isHidden ? '-130%' : 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: EASE_OUT }}
      >
        {/* outer: width + margin morph (full-width bar → centred capsule) */}
        <div className={`mx-auto pointer-events-auto transition-all ${MORPH} ${scrolled ? 'max-w-6xl px-3 pt-3' : 'max-w-7xl px-0 pt-0'}`}>
          {/* inner: the bar / capsule itself */}
          <div
            className={`relative flex items-center justify-between transition-all ${MORPH} ${
              scrolled
                ? 'h-[68px] rounded-full pl-5 pr-4 bg-twilight/70 backdrop-blur-xl backdrop-saturate-150 border border-sky/15 light:border-slate-200/90 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.55)] light:shadow-[0_14px_40px_-16px_rgba(11,23,51,0.28)]'
                : 'h-[80px] rounded-none px-4 sm:px-6 lg:px-8 bg-transparent border border-transparent'
            }`}
          >
            {/* Logo */}
            <button
              data-testid="nav-logo"
              onClick={() => scrollTo('/')}
              className="flex items-center gap-3 group shrink-0"
              aria-label={pathname === '/' ? 'Chessverse — back to top' : 'Chessverse — home'}
            >
              <div
                className={`relative rounded-xl overflow-hidden bg-ivory light:bg-white ring-1 ring-sky/30 shadow-md shadow-royal/30 transition-all ${MORPH} group-hover:scale-105 group-hover:rotate-[-4deg] ${
                  scrolled ? 'w-10 h-10 rounded-full' : 'w-11 h-11'
                }`}
              >
                <img src="/images/chessverse-logo.jpg" alt="Chessverse" className="absolute inset-0 w-full h-full object-cover" />
              </div>
              <div className="flex flex-col leading-none text-left">
                <span className="font-display font-bold text-lg sm:text-xl text-ivory tracking-tight group-hover:text-sky transition-colors">
                  Chessverse
                </span>
                {/* subtitle folds away in the capsule */}
                <span
                  className={`hidden sm:block overflow-hidden text-[10px] tracking-[0.22em] uppercase text-ghost transition-all ${MORPH} ${
                    scrolled ? 'max-h-0 opacity-0 mt-0' : 'max-h-4 opacity-100 mt-1'
                  }`}
                >
                  Chess Institute
                </span>
              </div>
            </button>

            {/* Desktop links — hover pill + active underline both glide between links */}
            <div className="hidden xl:flex items-center gap-1" onMouseLeave={() => setHovered(null)}>
              {primaryBefore.map((link) => (
                <NavLink key={link.to} link={link} isActive={isActive(link.to)} hovered={hovered} onHover={setHovered} onGo={scrollTo} />
              ))}

              {/* "More" — secondary sections in a compact dropdown */}
              <div
                className="relative"
                onMouseEnter={() => {
                  setHovered('more')
                  setMoreOpen(true)
                }}
                onMouseLeave={() => setMoreOpen(false)}
              >
                <button
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={moreOpen}
                  onClick={() => setMoreOpen((o) => !o)}
                  className={`relative flex items-center gap-1 px-3.5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors duration-300 ${
                    moreActive ? 'text-ivory' : 'text-ghost hover:text-ivory'
                  }`}
                >
                  {hovered === 'more' && (
                    <motion.span layoutId="nav-hover" className="absolute inset-0 rounded-full bg-sky/10" transition={PILL_SPRING} />
                  )}
                  {moreActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute left-3.5 right-3.5 -bottom-0.5 h-[2px] rounded-full bg-gradient-to-r from-sky via-azure to-gold"
                      transition={PILL_SPRING}
                    />
                  )}
                  <span className="relative">More</span>
                  <ChevronDown className={`relative w-3.5 h-3.5 transition-transform duration-300 ${moreOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {moreOpen && (
                    // outer div positions (and bridges the hover gap); inner card animates
                    <div className="absolute left-1/2 top-full -translate-x-1/2 pt-3 w-60">
                      <motion.div
                        role="menu"
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.98 }}
                        transition={{ duration: 0.22, ease: EASE_OUT }}
                        className="origin-top rounded-2xl bg-twilight light:bg-white border border-sky/15 light:border-slate-200 shadow-2xl shadow-void/40 light:shadow-[0_20px_50px_-20px_rgba(11,23,51,0.3)] p-1.5"
                      >
                        {moreLinks.map((link) => {
                          const linkActive = isActive(link.to)
                          return (
                            <button
                              key={link.to}
                              role="menuitem"
                              data-testid={`nav-link-${link.label.toLowerCase()}`}
                              onClick={() => scrollTo(link.to)}
                              className="group w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-sky/10 transition-colors"
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full shrink-0 transition-colors ${
                                  linkActive ? 'bg-gold' : 'bg-sky/30 group-hover:bg-sky'
                                }`}
                              />
                              <span className="min-w-0">
                                <span className={`block text-sm font-medium ${linkActive ? 'text-ivory' : 'text-ivory/90'}`}>{link.label}</span>
                                <span className="block text-xs text-ghost">{MORE_BLURBS[link.label]}</span>
                              </span>
                            </button>
                          )
                        })}
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {primaryAfter.map((link) => (
                <NavLink key={link.to} link={link} isActive={isActive(link.to)} hovered={hovered} onHover={setHovered} onGo={scrollTo} />
              ))}
            </div>

            {/* Right cluster */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="hidden lg:block">
                <ThemeToggle size="sm" />
              </div>
              <button
                data-testid="nav-cta-demo"
                onClick={() => scrollTo('#booking')}
                className={`group relative hidden sm:inline-flex shrink-0 whitespace-nowrap btn-primary overflow-hidden text-sm transition-all ${MORPH} ${
                  scrolled
                    ? '!py-2 !px-4 !shadow-[0_8px_20px_-10px_rgba(31,79,174,0.75)] hover:!scale-100'
                    : '!py-2.5 !px-5'
                }`}
              >
                {/* periodic sheen */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 bg-gradient-to-r from-transparent via-white/35 to-transparent animate-[nav-sheen_4.5s_ease-in-out_infinite] motion-reduce:hidden"
                />
                <span className="relative">Book Free Demo</span>
                <ArrowRight className="relative w-4 h-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5" />
              </button>

              {/* Mobile / tablet toggle */}
              <button
                data-testid="nav-mobile-toggle"
                onClick={() => setMobileOpen((o) => !o)}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
                className="xl:hidden relative grid place-items-center w-10 h-10 rounded-full text-ivory border border-sky/20 bg-sky/5 hover:bg-sky/10 transition-colors"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={mobileOpen ? 'close' : 'open'}
                    initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
                    transition={{ duration: 0.2 }}
                    className="grid place-items-center"
                  >
                    {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                  </motion.span>
                </AnimatePresence>
              </button>
            </div>

            {/* reading-progress line along the bottom of the capsule */}
            <div
              aria-hidden
              className={`absolute left-8 right-8 -bottom-px h-[2px] overflow-hidden rounded-full transition-opacity duration-500 ${
                scrolled ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <motion.div
                style={{ scaleX: progress }}
                className="h-full origin-left bg-gradient-to-r from-sky via-azure to-gold"
              />
            </div>
          </div>

          {/* Mobile menu — a floating card, kept outside the blurred capsule (nested backdrop-filters misrender) */}
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                key="nav-mobile-menu"
                initial={{ opacity: 0, y: -12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.35, ease: EASE_OUT }}
                className={`xl:hidden origin-top mt-2 rounded-3xl bg-twilight light:bg-white border border-sky/15 light:border-slate-200 shadow-2xl shadow-void/30 overflow-y-auto max-h-[calc(100svh-6rem)] ${
                  scrolled ? '' : 'mx-3'
                }`}
              >
                <motion.div variants={menuList} initial="hidden" animate="show" className="p-5 flex flex-col">
                  <motion.div variants={menuItem} className="lg:hidden mb-3">
                    <ThemeToggle />
                  </motion.div>
                  {navLinks.map((link, i) => {
                    const linkActive = isActive(link.to)
                    return (
                      <motion.button
                        key={link.to}
                        variants={menuItem}
                        data-testid={`nav-mobile-link-${link.label.toLowerCase()}`}
                        onClick={() => scrollTo(link.to)}
                        onTouchStart={() => prefetchRoute(link.to)}
                        aria-current={linkActive ? (link.to.startsWith('/') ? 'page' : 'true') : undefined}
                        className={`group flex items-center justify-between py-3.5 border-b border-sky/10 last:border-0 text-left text-base font-medium transition-colors ${
                          linkActive ? 'text-ivory' : 'text-ghost hover:text-ivory'
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <span className="font-display text-xs text-gold tabular-nums w-5">{String(i + 1).padStart(2, '0')}</span>
                          {link.label}
                        </span>
                        <ArrowRight
                          className={`w-4 h-4 transition-all duration-300 ${
                            linkActive ? 'text-sky opacity-100' : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'
                          }`}
                        />
                      </motion.button>
                    )
                  })}
                  <motion.button
                    variants={menuItem}
                    data-testid="nav-mobile-cta"
                    onClick={() => scrollTo('#booking')}
                    className="btn-primary mt-5 justify-center"
                  >
                    Book Free Demo
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>
    </>
  )
}
