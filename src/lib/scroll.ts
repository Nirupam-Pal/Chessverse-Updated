import type Lenis from 'lenis'

/**
 * One place for programmatic scrolling. When Lenis is running it owns the scroll position, so
 * native `scrollIntoView`/`window.scrollTo` would fight its interpolation; when it isn't
 * (touch, low-end devices, reduced motion) we fall back to the browser's own scrolling.
 */
let lenis: Lenis | null = null

export const setLenis = (instance: Lenis | null) => {
  lenis = instance
}

export function scrollToTarget(target: string | HTMLElement | 0, { immediate = false } = {}) {
  const el = typeof target === 'string' ? document.getElementById(target.replace(/^#/, '')) : target
  if (el === null) return

  if (lenis) {
    // Lenis clamps to a cached page height that refreshes on a debounce; right after a route
    // change it still holds the previous page's height, so re-measure before scrolling.
    lenis.resize()
    lenis.scrollTo(el, { immediate, force: true, duration: immediate ? undefined : 1.1 })
    return
  }
  const behavior: ScrollBehavior = immediate ? 'instant' : 'smooth'
  if (el === 0) window.scrollTo({ top: 0, behavior })
  else el.scrollIntoView({ behavior })
}

/** Freeze page scrolling while an overlay (lightbox, mobile menu) is open. */
export function lockScroll(locked: boolean) {
  if (lenis) {
    if (locked) lenis.stop()
    else lenis.start()
  }
  document.documentElement.style.overflow = locked ? 'hidden' : ''
}

/**
 * Low-spec or data-saving devices: skip JS-driven smooth scrolling (native scrolling runs on the
 * compositor thread and can't be starved by a busy main thread) and drop the costliest effects.
 */
export function isLowPowerDevice() {
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } }
  return (
    (nav.hardwareConcurrency ?? 8) <= 2 ||
    (nav.deviceMemory ?? 8) < 4 ||
    nav.connection?.saveData === true
  )
}
