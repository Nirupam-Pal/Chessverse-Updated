import { useEffect } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

/**
 * Site-wide inertial scrolling for mouse wheels and trackpads (touch keeps its native feel).
 * Lenis drives the real window scroll, so framer-motion's useScroll and sticky layouts keep working.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      anchors: true,
      allowNestedScroll: true, // scrollable panels (e.g. the chatbot) keep their own scrolling
      autoRaf: true,
    })
    return () => lenis.destroy()
  }, [])

  return null
}
