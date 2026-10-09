import type { CSSProperties } from 'react'
import { ChessKnight, ChessPawn, ChessQueen, ChessRook, Sparkle, type LucideIcon } from 'lucide-react'

type Bubble = {
  src: string
  alt: string
  /** position + size as % of the square stage */
  left: string
  top: string
  size: string
  color: string
  /** irregular radii; rotating them reads as a slow organic "morph" */
  shape: string
  ringShape: string
  icon: LucideIcon
  /** badge corner, as % offsets inside the bubble */
  badge: CSSProperties
  spin: number
  float: number
  delay: number
}

// Placeholder portraits as transparent cut-outs (square WebP, ~440px, person touching the bottom edge).
// Swap for cut-outs of real Chessverse students: the hover pop-out needs the background removed.
const bubbles: Bubble[] = [
  {
    src: '/images/students/student2-cutout.webp',
    alt: 'Chessverse student',
    left: '36%',
    top: '3%',
    size: '38%',
    color: '#D4AF37',
    shape: '58% 42% 55% 45% / 47% 58% 42% 53%',
    ringShape: '45% 55% 43% 57% / 55% 45% 58% 42%',
    icon: ChessKnight,
    badge: { right: '2%', bottom: '10%' },
    spin: 26,
    float: 6.5,
    delay: 0,
  },
  {
    src: '/images/students/student1-cutout.webp',
    alt: 'Chessverse student',
    left: '8%',
    top: '35%',
    size: '33%',
    color: '#3A8DDE',
    shape: '46% 54% 60% 40% / 52% 44% 56% 48%',
    ringShape: '57% 43% 48% 52% / 44% 57% 43% 56%',
    icon: ChessQueen,
    badge: { left: '6%', top: '6%' },
    spin: 30,
    float: 7.5,
    delay: -2,
  },
  {
    src: '/images/students/student4-cutout.webp',
    alt: 'Chessverse student',
    left: '63%',
    top: '42%',
    size: '32%',
    color: '#10B981',
    shape: '53% 47% 41% 59% / 58% 52% 48% 42%',
    ringShape: '42% 58% 55% 45% / 49% 41% 59% 51%',
    icon: ChessRook,
    badge: { right: '0%', top: '8%' },
    spin: 28,
    float: 7,
    delay: -4,
  },
  {
    src: '/images/students/student3-cutout.webp',
    alt: 'Chessverse student',
    left: '32%',
    top: '66%',
    size: '28%',
    color: '#8ECAE6',
    shape: '50% 50% 44% 56% / 45% 55% 45% 55%',
    ringShape: '58% 42% 52% 48% / 52% 58% 42% 48%',
    icon: ChessPawn,
    badge: { left: '4%', bottom: '8%' },
    spin: 24,
    float: 6,
    delay: -1,
  },
]

// small confetti accents (positions in %)
const confetti: { left: string; top: string; el: 'dot' | 'ring' | 'spark'; color: string; size: number; delay: number }[] = [
  { left: '27%', top: '11%', el: 'dot', color: '#D4AF37', size: 12, delay: 0 },
  { left: '90%', top: '30%', el: 'ring', color: '#3A8DDE', size: 22, delay: -1.2 },
  { left: '95%', top: '17%', el: 'spark', color: '#8ECAE6', size: 16, delay: -2.4 },
  { left: '3%', top: '55%', el: 'spark', color: '#D4AF37', size: 18, delay: -0.6 },
  { left: '24%', top: '92%', el: 'dot', color: '#10B981', size: 12, delay: -1.8 },
  { left: '88%', top: '94%', el: 'spark', color: '#D4AF37', size: 18, delay: -3 },
]

/**
 * Floating cluster of student portraits. Every motion is a CSS transform animation
 * (rotate / translate3d / scale) — composited on the GPU, no layout or paint per frame.
 */
export default function StudentBubbles() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[560px]">
      {/* handwritten note */}
      <div aria-hidden className="absolute left-[1%] top-[2%] z-10 text-sky -rotate-6">
        <p className="font-display italic font-semibold text-base sm:text-2xl leading-tight">
          meet our
          <br />
          champions!
        </p>
        <svg viewBox="0 0 80 40" className="mt-1 h-8 w-16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M4 26c8-12 14 10 22 0s14-10 20 2" />
          <path d="M62 4v26m-7-7 7 7 7-7" />
        </svg>
      </div>

      {confetti.map((c, i) => (
        <span
          key={i}
          aria-hidden
          className="cv-anim absolute animate-[confetti-twinkle_3.6s_ease-in-out_infinite]"
          style={{ left: c.left, top: c.top, animationDelay: `${c.delay}s`, color: c.color }}
        >
          {c.el === 'spark' ? (
            <Sparkle style={{ width: c.size, height: c.size }} fill="currentColor" strokeWidth={0} />
          ) : (
            <span
              className="block rounded-full"
              style={{
                width: c.size,
                height: c.size,
                ...(c.el === 'dot' ? { background: c.color } : { border: `2.5px solid ${c.color}` }),
              }}
            />
          )}
        </span>
      ))}

      {bubbles.map((b) => (
        // the hovered bubble rises above its neighbours so the popped-out head can overlap them
        <div key={b.src} className="group absolute hover:z-20" style={{ left: b.left, top: b.top, width: b.size }}>
          {/* float */}
          <div
            className="cv-anim animate-[bubble-float_7s_ease-in-out_infinite]"
            style={{ animationDuration: `${b.float}s`, animationDelay: `${b.delay}s` }}
          >
            {/* hover: the whole bubble swells with a slight springy overshoot */}
            <div className="relative aspect-square transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-[1.12] motion-reduce:transition-none">
              {/* outline ring, drifting the other way */}
              <div
                aria-hidden
                className="cv-anim absolute -inset-[7%] border-[2.5px] animate-[blob-spin_30s_linear_infinite_reverse]"
                style={{ borderColor: b.color, borderRadius: b.ringShape, animationDuration: `${b.spin + 6}s` }}
              />
              {/* coloured blob with a lighter splash and a dashed ring behind the student; it rotates
                  slowly so the irregular outline reads as an organic morph */}
              <div
                aria-hidden
                className="cv-anim absolute inset-0 overflow-hidden shadow-[0_24px_50px_-20px_rgba(0,0,0,0.55)] animate-[blob-spin_26s_linear_infinite]"
                style={{ background: b.color, borderRadius: b.shape, animationDuration: `${b.spin}s` }}
              >
                <div className="absolute left-[14%] right-[14%] top-[22%] bottom-[8%] bg-white/25" style={{ borderRadius: b.ringShape }} />
                <div className="absolute inset-[12%] rounded-full border-2 border-dashed border-white/40" />
              </div>
              {/* the student (a transparent cut-out) never rotates. At rest it is clipped to a circle
                  inside the blob; on hover the clip opens upwards and the student grows from the
                  bottom edge (so the base stays anchored), and the head breaks out of the frame
                  while the sides and bottom stay framed */}
              <div className="pop-clip absolute inset-0">
                <img
                  src={b.src}
                  alt={b.alt}
                  width={440}
                  height={440}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-[6%] h-[88%] w-[88%] object-contain object-bottom origin-bottom transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-[1.32] motion-reduce:transition-none"
                />
              </div>
              {/* chess-piece badge */}
              <span
                aria-hidden
                className="absolute z-10 grid h-[24%] w-[24%] min-h-9 min-w-9 place-items-center rounded-full bg-white text-[#0B1733] shadow-lg shadow-black/25"
                style={b.badge}
              >
                <b.icon className="h-1/2 w-1/2" strokeWidth={2.2} />
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
