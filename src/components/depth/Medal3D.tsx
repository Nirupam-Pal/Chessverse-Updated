import { useRef } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import { Crown, Star } from 'lucide-react'
import { useFinePointer } from '@/hooks/use-fine-pointer'

/*
 * A CSS 3D gold medal: two faces and a stack of thin discs for the rim, slowly spinning on its
 * vertical axis (a compositor-only CSS animation), with a pointer tilt layered on top. No WebGL,
 * so it costs almost nothing. Reduced motion: it rests at a slight angle, no spin.
 */

const RIM_LAYERS = 10 // thin discs between the faces give the coin its thickness as it turns
const SPRING = { stiffness: 120, damping: 18 }

export default function Medal3D({ className = '' }: { className?: string }) {
  const reduced = useReducedMotion() ?? false
  const fine = useFinePointer()
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const rotateX = useSpring(useTransform(py, [-1, 1], [14, -14]), SPRING)
  const rotateZ = useSpring(useTransform(px, [-1, 1], [-8, 8]), SPRING)
  const box = useRef<HTMLDivElement>(null)

  const onPointerMove = (e: React.PointerEvent) => {
    if (!fine || reduced || !box.current) return
    const r = box.current.getBoundingClientRect()
    px.set(((e.clientX - r.left) / r.width) * 2 - 1)
    py.set(((e.clientY - r.top) / r.height) * 2 - 1)
  }
  const reset = () => {
    px.set(0)
    py.set(0)
  }

  return (
    <div
      ref={box}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      aria-hidden
      className={`relative aspect-square select-none [perspective:1200px] ${className}`}
    >
      {/* warm glow + ribbon behind */}
      <div className="absolute inset-[8%] rounded-full bg-gold/25 blur-3xl" />
      <div className="absolute left-1/2 top-[-6%] h-[46%] w-[34%] -translate-x-1/2">
        <div className="absolute left-0 top-0 h-full w-1/2 origin-top -skew-x-12 bg-gradient-to-b from-royal to-sky shadow-lg" />
        <div className="absolute right-0 top-0 h-full w-1/2 origin-top skew-x-12 bg-gradient-to-b from-sky to-royal shadow-lg" />
      </div>

      <motion.div style={{ rotateX, rotateZ, transformStyle: 'preserve-3d' }} className="absolute inset-[14%]">
        <div className={`medal-spin relative h-full w-full [transform-style:preserve-3d] ${reduced ? '[transform:rotateY(-22deg)]' : ''}`}>
          {/* rim */}
          {Array.from({ length: RIM_LAYERS }, (_, i) => (
            <div
              key={i}
              className="absolute inset-0 rounded-full bg-gradient-to-br from-[#B8881C] to-[#7A5A10]"
              style={{ transform: `translateZ(${(i - RIM_LAYERS / 2) * 1.6}px)` }}
            />
          ))}

          {/* front */}
          <div
            className="absolute inset-0 grid place-items-center rounded-full [backface-visibility:hidden] bg-[radial-gradient(circle_at_32%_28%,#FFF1B8_0%,#E9C55A_30%,#C99A2B_62%,#8C6A12_100%)] shadow-[inset_0_0_0_6px_rgba(140,106,18,0.55),inset_0_0_0_10px_rgba(255,236,170,0.35)]"
            style={{ transform: `translateZ(${(RIM_LAYERS / 2) * 1.6 + 0.5}px)` }}
          >
            <div className="absolute inset-[13%] rounded-full border-2 border-dashed border-[#8C6A12]/45" />
            <div className="relative flex flex-col items-center text-[#5A420A]">
              <Crown className="h-[3.2rem] w-[3.2rem] drop-shadow-[0_2px_0_rgba(255,241,184,0.6)]" strokeWidth={1.8} />
              <span className="mt-1 font-display text-[0.7rem] font-bold uppercase tracking-[0.28em]">Star</span>
              <span className="font-display text-[0.7rem] font-bold uppercase tracking-[0.28em]">Performer</span>
            </div>
            {/* specular sweep */}
            <div className="medal-shine pointer-events-none absolute inset-0 rounded-full" />
          </div>

          {/* back */}
          <div
            className="absolute inset-0 grid place-items-center rounded-full [backface-visibility:hidden] bg-[radial-gradient(circle_at_68%_28%,#FFF1B8_0%,#E9C55A_30%,#C99A2B_62%,#8C6A12_100%)] shadow-[inset_0_0_0_6px_rgba(140,106,18,0.55)]"
            style={{ transform: `rotateY(180deg) translateZ(${(RIM_LAYERS / 2) * 1.6 + 0.5}px)` }}
          >
            <div className="flex flex-col items-center text-[#5A420A]">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <span className="mt-2 font-display text-lg font-bold">Chessverse</span>
              <span className="text-[0.6rem] font-semibold uppercase tracking-[0.3em]">Hall of Fame</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* contact shadow */}
      <div className="medal-shadow absolute bottom-[2%] left-1/2 h-[7%] w-[46%] -translate-x-1/2 rounded-[50%] bg-black/45 blur-md" />
    </div>
  )
}
