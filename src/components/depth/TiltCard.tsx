import { createContext, useContext, useRef, type CSSProperties, type ReactNode } from 'react'
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { useFinePointer } from '@/hooks/use-fine-pointer'

/*
 * Cursor-driven 3D card: tilts toward the pointer, lifts, and lets children add a light sheen
 * (<TiltSheen/>) or float above the surface (<TiltDepth/>). Pointer position lives in motion
 * values, so moving the mouse never re-renders React; everything runs on springs and touches
 * only transform and opacity. Off on touch screens and for reduced motion (static card).
 */

const SPRING = { stiffness: 220, damping: 22, mass: 0.6 }
const SHEEN = { gold: 'rgba(243, 216, 122, 0.16)', sky: 'rgba(142, 202, 230, 0.13)' }

type TiltContext = { enabled: boolean; px: MotionValue<number>; py: MotionValue<number>; hovered: MotionValue<number>; accent: 'gold' | 'sky' }
const Ctx = createContext<TiltContext | null>(null)

export function TiltCard({
  children,
  className = '',
  style,
  accent = 'sky',
  maxTilt = { x: 7, y: 9 },
  lift = 6,
  scale = 1.02,
  perspective = 1100,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
  accent?: 'gold' | 'sky'
  /** max degrees around each axis */
  maxTilt?: { x: number; y: number }
  /** px the card rises on hover */
  lift?: number
  scale?: number
  perspective?: number
}) {
  const reduced = useReducedMotion() ?? false
  const enabled = useFinePointer() && !reduced
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const hovered = useMotionValue(0)
  const rotateX = useSpring(useTransform(py, [0, 1], [maxTilt.x, -maxTilt.x]), SPRING)
  const rotateY = useSpring(useTransform(px, [0, 1], [-maxTilt.y, maxTilt.y]), SPRING)
  const y = useSpring(useTransform(hovered, [0, 1], [0, -lift]), SPRING)
  const s = useSpring(useTransform(hovered, [0, 1], [1, scale]), SPRING)
  const rect = useRef<DOMRect | null>(null)

  const onPointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!enabled || e.pointerType !== 'mouse') return
    rect.current = e.currentTarget.getBoundingClientRect() // measured once per hover, not per move
    hovered.set(1)
  }
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!enabled || e.pointerType !== 'mouse') return
    const r = rect.current ?? (rect.current = e.currentTarget.getBoundingClientRect())
    px.set(Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)))
    py.set(Math.min(1, Math.max(0, (e.clientY - r.top) / r.height)))
    hovered.set(1)
  }
  const onPointerLeave = () => {
    rect.current = null
    px.set(0.5)
    py.set(0.5)
    hovered.set(0)
  }

  return (
    <Ctx.Provider value={{ enabled, px, py, hovered, accent }}>
      <motion.div
        onPointerEnter={onPointerEnter}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        style={enabled ? { ...style, rotateX, rotateY, y, scale: s, transformPerspective: perspective } : style}
        className={`group ${className}`}
      >
        {children}
      </motion.div>
    </Ctx.Provider>
  )
}

/** A soft light that follows the cursor. Place it inside the card's clipped (overflow-hidden) surface. */
export function TiltSheen({ className = '' }: { className?: string }) {
  const ctx = useContext(Ctx)
  const { px, py, hovered } = useTiltValues(ctx)
  const x = useTransform(px, (v) => `${v * 100}%`)
  const y = useTransform(py, (v) => `${v * 100}%`)
  const opacity = useSpring(hovered, SPRING)
  const color = SHEEN[ctx?.accent ?? 'sky']
  const background = useMotionTemplate`radial-gradient(420px circle at ${x} ${y}, ${color}, transparent 55%)`
  if (!ctx?.enabled) return null
  return <motion.div aria-hidden style={{ background, opacity }} className={`pointer-events-none absolute inset-0 rounded-[inherit] ${className}`} />
}

/** Content that floats a little above the card, drifting with the cursor (depth in px). */
export function TiltDepth({ children, depth = 5, className = '' }: { children: ReactNode; depth?: number; className?: string }) {
  const ctx = useContext(Ctx)
  const { px, py } = useTiltValues(ctx)
  const x = useSpring(useTransform(px, [0, 1], [-depth, depth]), SPRING)
  const y = useSpring(useTransform(py, [0, 1], [-depth * 0.8, depth * 0.8]), SPRING)
  return (
    <motion.div style={ctx?.enabled ? { x, y } : undefined} className={className}>
      {children}
    </motion.div>
  )
}

// Hooks must run unconditionally: outside a <TiltCard>, bind to inert local values instead.
function useTiltValues(ctx: TiltContext | null) {
  const fallbackX = useMotionValue(0.5)
  const fallbackY = useMotionValue(0.5)
  const fallbackHover = useMotionValue(0)
  return { px: ctx?.px ?? fallbackX, py: ctx?.py ?? fallbackY, hovered: ctx?.hovered ?? fallbackHover }
}
