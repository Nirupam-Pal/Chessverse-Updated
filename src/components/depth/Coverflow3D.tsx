import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

/*
 * 3D "coverflow" carousel: the active card faces the viewer, neighbours fan out in perspective
 * (rotated, pushed back, dimmed). Arrow buttons, dots, ←/→ keys, swipe/drag and clicking a side
 * card all navigate; it loops. Optional autoplay pauses on hover/focus and when the tab is
 * hidden. Reduced motion: the same layout without rotation or depth, cross-fading instead.
 * Only transform and opacity animate.
 */
export default function Coverflow3D<T>({
  items,
  getKey,
  getLabel,
  renderItem,
  index: controlled,
  onIndexChange,
  label,
  itemClassName = 'w-[78vw] max-w-[340px] sm:w-[340px]',
  className = 'h-[460px]',
  autoplayMs,
  accent = 'sky',
}: {
  items: T[]
  getKey: (item: T) => string
  /** accessible name of each item (dots, side-card buttons) */
  getLabel: (item: T) => string
  renderItem: (item: T, state: { active: boolean }) => ReactNode
  index?: number
  onIndexChange?: (i: number) => void
  /** accessible name of the carousel */
  label: string
  /** width of one card */
  itemClassName?: string
  /** height of the stage */
  className?: string
  autoplayMs?: number
  accent?: 'gold' | 'sky'
}) {
  const reduced = useReducedMotion() ?? false
  const [own, setOwn] = useState(0)
  const active = controlled ?? own
  const n = items.length
  const go = (i: number) => {
    const next = ((i % n) + n) % n
    if (controlled === undefined) setOwn(next)
    onIndexChange?.(next)
  }

  // autoplay, paused while the visitor is interacting
  const [paused, setPaused] = useState(false)
  useEffect(() => {
    if (!autoplayMs || paused || reduced || n < 2) return
    const t = window.setTimeout(() => {
      if (document.visibilityState === 'visible') go(active + 1)
    }, autoplayMs)
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- re-arm after every move
  }, [active, autoplayMs, paused, reduced, n])

  // swipe / drag
  const start = useRef<number | null>(null)
  const onPointerDown = (e: React.PointerEvent) => {
    start.current = e.clientX
  }
  const onPointerUp = (e: React.PointerEvent) => {
    if (start.current === null) return
    const dx = e.clientX - start.current
    start.current = null
    if (Math.abs(dx) > 45) go(active + (dx < 0 ? 1 : -1))
  }

  // shortest signed distance from the active card, so the ring loops
  const offsetOf = (i: number) => {
    let d = i - active
    if (d > n / 2) d -= n
    if (d < -n / 2) d += n
    return d
  }
  const dot = accent === 'gold' ? 'bg-gold' : 'bg-sky'

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(active + 1)
        else if (e.key === 'ArrowLeft') go(active - 1)
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="relative rounded-[32px] outline-none focus-visible:ring-2 focus-visible:ring-sky/50"
    >
      <div
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (start.current = null)}
        className={`relative touch-pan-y select-none [perspective:1400px] ${className}`}
      >
        {items.map((item, i) => {
          const d = offsetOf(i)
          const abs = Math.abs(d)
          const isActive = d === 0
          const visible = abs <= 2
          return (
            <motion.div
              key={getKey(item)}
              // side cards: a click brings them to the front (their content is inert until then)
              onClick={isActive ? undefined : () => go(i)}
              aria-hidden={!isActive}
              initial={false}
              animate={
                reduced
                  ? { x: `${d * 105}%`, opacity: isActive ? 1 : visible ? 0.35 : 0, scale: isActive ? 1 : 0.9 }
                  : {
                      x: `${d * 62}%`,
                      z: -abs * 160,
                      rotateY: d * -32,
                      opacity: isActive ? 1 : visible ? 0.55 - (abs - 1) * 0.25 : 0,
                      scale: isActive ? 1 : 0.92,
                    }
              }
              transition={{ type: 'spring', stiffness: 170, damping: 24, mass: 0.9 }}
              // centred with inset-x-0 + mx-auto (framer owns `x`, so no translate-based centring)
              style={{ zIndex: 20 - abs, pointerEvents: visible ? 'auto' : 'none' }}
              className={`absolute inset-y-0 inset-x-0 mx-auto ${isActive ? '' : 'cursor-pointer'} ${itemClassName}`}
            >
              <div inert={!isActive} className="h-full">
                {renderItem(item, { active: isActive })}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* controls */}
      <div className="mt-8 flex items-center justify-center gap-5">
        <button type="button" onClick={() => go(active - 1)} aria-label="Previous" className="btn-ghost !min-h-0 !p-0 h-11 w-11">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          {items.map((item, i) => (
            <button
              key={getKey(item)}
              type="button"
              onClick={() => go(i)}
              aria-label={`Show ${getLabel(item)}`}
              aria-current={i === active}
              className="group grid h-6 place-items-center px-0.5"
            >
              <span
                className={`block h-2 rounded-full transition-[width,background-color] duration-300 ${
                  i === active ? `w-7 ${dot}` : 'w-2 bg-ghost/40 group-hover:bg-ghost'
                }`}
              />
            </button>
          ))}
        </div>
        <button type="button" onClick={() => go(active + 1)} aria-label="Next" className="btn-ghost !min-h-0 !p-0 h-11 w-11">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      <p className="sr-only" aria-live="polite">
        {getLabel(items[active])}, {active + 1} of {n}
      </p>
    </div>
  )
}
