import { useEffect, useLayoutEffect, useRef } from 'react'
import { useLocation } from 'react-router'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { isLowPowerDevice, lockScroll, scrollToTarget, setLenis } from '@/lib/scroll'

/**
 * Site-wide inertial scrolling for mouse wheels and trackpads. Lenis drives the real window
 * scroll, so framer-motion's useScroll and sticky layouts keep working.
 *
 * Skipped on touch-first screens (native momentum already feels right), low-power devices and
 * for reduced motion — there, native compositor scrolling is the smoothest option available.
 * Also owns route-change scrolling: new pages start at the top, `/#section` links land on the section.
 */
export default function SmoothScroll() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    const lowPower = isLowPowerDevice()
    document.documentElement.classList.toggle('perf-lite', lowPower)

    const touchFirst = window.matchMedia('(hover: none) and (pointer: coarse)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (lowPower || touchFirst || reduced) return

    const lenis = new Lenis({
      lerp: 0.12,
      smoothWheel: true,
      anchors: true,
      allowNestedScroll: true, // scrollable panels (e.g. the chatbot) keep their own scrolling
      autoRaf: true,
    })
    setLenis(lenis)
    return () => {
      setLenis(null)
      lenis.destroy()
    }
  }, [])

  // before paint, so a new page never flashes at the previous page's scroll offset
  const prevPath = useRef(pathname)
  useLayoutEffect(() => {
    const pageChanged = prevPath.current !== pathname
    prevPath.current = pathname
    lockScroll(false) // an overlay may have been open when the route changed
    if (!hash) {
      if (pageChanged) scrollToTarget(0, { immediate: true })
      return
    }
    // Arriving from another page jumps straight to the section (the DOM is committed, so it can be
    // measured right here, before paint); same-page hash changes glide.
    scrollToTarget(hash, { immediate: pageChanged })
  }, [pathname, hash])

  return null
}
