import { useEffect, useRef, useState, Suspense, type ReactNode, type RefObject } from 'react'
import { Canvas, useFrame, useThree, type ThreeElements } from '@react-three/fiber'
import { ContactShadows, Environment, Float, Lightformer, Sparkles } from '@react-three/drei'
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from 'framer-motion'
import { ArrowRight, Award, CalendarCheck, MapPin, Phone, TrendingUp, Trophy, Users } from 'lucide-react'
import * as THREE from 'three'

/* ------------------------------------------------------------------ */
/*  Theme + pointer helpers                                            */
/* ------------------------------------------------------------------ */

function useIsLightMode() {
  const [isLight, setIsLight] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    const update = () => setIsLight(root.classList.contains('light'))
    update()
    const observer = new MutationObserver(update)
    observer.observe(root, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  return isLight
}

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const update = () => setIsDesktop(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return isDesktop
}

type PointerRef = RefObject<{ x: number; y: number }>

/* ------------------------------------------------------------------ */
/*  Geometry — turned (lathe) pieces for a Staunton silhouette         */
/* ------------------------------------------------------------------ */

type Profile = [number, number][]

function lathe(profile: Profile) {
  const pts = new THREE.SplineCurve(profile.map(([x, y]) => new THREE.Vector2(x, y))).getPoints(96)
  const geo = new THREE.LatheGeometry(pts, 64)
  geo.computeVertexNormals()
  return geo
}

const BASE: Profile = [
  [0, 0], [0.5, 0], [0.5, 0.07], [0.42, 0.12], [0.44, 0.18], [0.32, 0.26],
]

const KING_GEO = lathe([
  ...BASE, [0.24, 0.45], [0.19, 0.95], [0.18, 1.12], [0.3, 1.18], [0.3, 1.24],
  [0.19, 1.28], [0.23, 1.42], [0.31, 1.6], [0.29, 1.68], [0.12, 1.74], [0, 1.75],
])

const QUEEN_GEO = lathe([
  ...BASE, [0.23, 0.45], [0.17, 0.95], [0.16, 1.08], [0.28, 1.14], [0.28, 1.2],
  [0.18, 1.24], [0.22, 1.38], [0.32, 1.56], [0.28, 1.6], [0.12, 1.58], [0, 1.58],
])

const BISHOP_GEO = lathe([
  ...BASE, [0.2, 0.5], [0.15, 0.78], [0.26, 0.84], [0.26, 0.88], [0.15, 0.92],
  [0.21, 1.02], [0.24, 1.16], [0.17, 1.32], [0.07, 1.4], [0, 1.41],
])

const PAWN_GEO = lathe([
  ...BASE, [0.2, 0.4], [0.15, 0.56], [0.26, 0.6], [0.26, 0.64], [0.1, 0.68], [0, 0.68],
])

const KNIGHT_BASE_GEO = lathe([...BASE, [0.3, 0.32], [0.3, 0.36], [0, 0.36]])

const KNIGHT_HEAD_GEO = (() => {
  const s = new THREE.Shape()
  s.moveTo(-0.3, 0)
  s.lineTo(0.34, 0)
  s.quadraticCurveTo(0.26, 0.3, 0.36, 0.55)
  s.quadraticCurveTo(0.46, 0.85, 0.3, 1.12)
  s.lineTo(0.14, 1.3) // ear tip
  s.lineTo(0.04, 1.16)
  s.quadraticCurveTo(-0.14, 1.14, -0.3, 0.98) // forehead
  s.quadraticCurveTo(-0.44, 0.84, -0.44, 0.76) // muzzle
  s.quadraticCurveTo(-0.42, 0.66, -0.3, 0.68) // mouth
  s.quadraticCurveTo(-0.14, 0.7, -0.08, 0.6) // jaw
  s.quadraticCurveTo(-0.28, 0.4, -0.3, 0)
  const geo = new THREE.ExtrudeGeometry(s, {
    depth: 0.3,
    bevelEnabled: true,
    bevelThickness: 0.06,
    bevelSize: 0.05,
    bevelSegments: 5,
    curveSegments: 28,
  })
  geo.translate(0, 0, -0.15)
  geo.computeVertexNormals()
  return geo
})()

/* ------------------------------------------------------------------ */
/*  Materials                                                          */
/* ------------------------------------------------------------------ */

const IVORY_MAT = new THREE.MeshPhysicalMaterial({
  color: '#EEF3FA',
  roughness: 0.2,
  metalness: 0.1,
  clearcoat: 1,
  clearcoatRoughness: 0.08,
})

const NAVY_MAT = new THREE.MeshPhysicalMaterial({
  color: '#0E2A52',
  roughness: 0.22,
  metalness: 0.55,
  clearcoat: 1,
  clearcoatRoughness: 0.1,
  emissive: new THREE.Color('#1F4FAE'),
  emissiveIntensity: 0.12,
})

const GOLD_MAT = new THREE.MeshStandardMaterial({
  color: '#D4AF37',
  metalness: 1,
  roughness: 0.22,
  emissive: new THREE.Color('#8A6A12'),
  emissiveIntensity: 0.35,
})

type Side = 'white' | 'black'
const matFor = (side: Side) => (side === 'white' ? IVORY_MAT : NAVY_MAT)

/* ------------------------------------------------------------------ */
/*  Pieces                                                             */
/* ------------------------------------------------------------------ */

type PieceProps = { side: Side } & ThreeElements['group']

function King({ side, ...props }: PieceProps) {
  return (
    <group {...props}>
      <mesh geometry={KING_GEO} material={matFor(side)} castShadow />
      <mesh position={[0, 1.21, 0]} rotation={[Math.PI / 2, 0, 0]} material={GOLD_MAT}>
        <torusGeometry args={[0.3, 0.022, 12, 48]} />
      </mesh>
      <mesh position={[0, 1.93, 0]} material={GOLD_MAT} castShadow>
        <boxGeometry args={[0.09, 0.34, 0.09]} />
      </mesh>
      <mesh position={[0, 1.96, 0]} material={GOLD_MAT} castShadow>
        <boxGeometry args={[0.26, 0.09, 0.09]} />
      </mesh>
    </group>
  )
}

function Queen({ side, ...props }: PieceProps) {
  const crown = Array.from({ length: 8 }, (_, i) => (i / 8) * Math.PI * 2)
  return (
    <group {...props}>
      <mesh geometry={QUEEN_GEO} material={matFor(side)} castShadow />
      {crown.map((a) => (
        <mesh key={a} position={[Math.cos(a) * 0.28, 1.62, Math.sin(a) * 0.28]} material={GOLD_MAT}>
          <sphereGeometry args={[0.045, 16, 16]} />
        </mesh>
      ))}
      <mesh position={[0, 1.7, 0]} material={GOLD_MAT}>
        <sphereGeometry args={[0.09, 24, 24]} />
      </mesh>
    </group>
  )
}

function Bishop({ side, ...props }: PieceProps) {
  return (
    <group {...props}>
      <mesh geometry={BISHOP_GEO} material={matFor(side)} castShadow />
      <mesh position={[0, 1.47, 0]} material={GOLD_MAT}>
        <sphereGeometry args={[0.07, 20, 20]} />
      </mesh>
    </group>
  )
}

function Pawn({ side, ...props }: PieceProps) {
  return (
    <group {...props}>
      <mesh geometry={PAWN_GEO} material={matFor(side)} castShadow />
      <mesh position={[0, 0.84, 0]} material={matFor(side)} castShadow>
        <sphereGeometry args={[0.21, 32, 32]} />
      </mesh>
    </group>
  )
}

function Knight({ side, ...props }: PieceProps) {
  return (
    <group {...props}>
      <mesh geometry={KNIGHT_BASE_GEO} material={matFor(side)} castShadow />
      <mesh geometry={KNIGHT_HEAD_GEO} position={[0, 0.3, 0]} material={matFor(side)} castShadow />
      <mesh position={[-0.16, 1.22, 0.2]} material={GOLD_MAT}>
        <sphereGeometry args={[0.035, 12, 12]} />
      </mesh>
      <mesh position={[-0.16, 1.22, -0.2]} material={GOLD_MAT}>
        <sphereGeometry args={[0.035, 12, 12]} />
      </mesh>
    </group>
  )
}

/* ------------------------------------------------------------------ */
/*  Board + a knight hopping round a closed 4-move loop                */
/* ------------------------------------------------------------------ */

const SQ = 0.9
const BOARD = SQ * 8 + 0.5
const toWorld = (col: number, row: number): [number, number] => [(col - 3.5) * SQ, (row - 3.5) * SQ]

const KNIGHT_TOUR: [number, number][] = [[2, 5], [3, 3], [5, 4], [4, 6]]
const KING_SQ: [number, number] = [4, 1]
const HOP_CYCLE = 3.2
const HOP_REST = 2.2

const easeInOut = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2)

function hopState(t: number) {
  const step = Math.floor(t / HOP_CYCLE)
  const local = t - step * HOP_CYCLE
  const from = KNIGHT_TOUR[step % KNIGHT_TOUR.length]
  const to = KNIGHT_TOUR[(step + 1) % KNIGHT_TOUR.length]
  const p = local < HOP_REST ? 0 : easeInOut((local - HOP_REST) / (HOP_CYCLE - HOP_REST))
  return { from, to, p, rest: Math.min(local / HOP_REST, 1) }
}

const sqKey = ([c, r]: [number, number]) => `${c}-${r}`
const GLOW_KEYS = new Set([...KNIGHT_TOUR.map(sqKey), sqKey(KING_SQ)])

function Board({ isLight }: { isLight: boolean }) {
  const glowMats = useRef(new Map<string, THREE.MeshStandardMaterial>())
  const lightSq = isLight ? '#E6EEF9' : '#1A3567'
  const darkSq = isLight ? '#9DB6D8' : '#0A1836'
  const frame = isLight ? '#C8D6EB' : '#070F24'

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    const { to, p, rest } = hopState(t)
    glowMats.current.forEach((mat, key) => {
      let target = 0
      if (key === sqKey(to)) target = 0.2 + rest * 0.6 + p * 0.5
      else if (key === sqKey(KING_SQ)) target = 0.3 + Math.sin(t * 1.4) * 0.12
      mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, target, 0.08)
    })
  })

  return (
    <group>
      <mesh position={[0, -0.2, 0]} receiveShadow>
        <boxGeometry args={[BOARD, 0.36, BOARD]} />
        <meshStandardMaterial color={frame} roughness={0.35} metalness={0.4} />
      </mesh>
      <mesh position={[0, -0.015, 0]} material={GOLD_MAT}>
        <boxGeometry args={[SQ * 8 + 0.12, 0.02, SQ * 8 + 0.12]} />
      </mesh>

      {Array.from({ length: 64 }, (_, i) => {
        const col = i % 8
        const row = Math.floor(i / 8)
        const [x, z] = toWorld(col, row)
        const key = `${col}-${row}`
        return (
          <mesh key={key} position={[x, 0, z]} receiveShadow>
            <boxGeometry args={[SQ, 0.04, SQ]} />
            <meshStandardMaterial
              ref={(m) => {
                if (m && GLOW_KEYS.has(key)) glowMats.current.set(key, m)
              }}
              color={(col + row) % 2 === 0 ? darkSq : lightSq}
              roughness={0.28}
              metalness={0.2}
              emissive={key === sqKey(KING_SQ) ? '#D4AF37' : '#3A8DDE'}
              emissiveIntensity={0}
            />
          </mesh>
        )
      })}
    </group>
  )
}

function HoppingKnight({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    const g = ref.current
    if (!g) return
    const { from, to, p } = reduced
      ? { from: KNIGHT_TOUR[0], to: KNIGHT_TOUR[1], p: 0 }
      : hopState(clock.elapsedTime)
    const [fx, fz] = toWorld(...from)
    const [tx, tz] = toWorld(...to)
    g.position.set(
      THREE.MathUtils.lerp(fx, tx, p),
      0.02 + Math.sin(Math.PI * p) * 0.9,
      THREE.MathUtils.lerp(fz, tz, p),
    )
    // nose points along -x; turn to face the next square
    const heading = Math.atan2(tz - fz, -(tx - fx))
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, heading, 0.06)
    g.rotation.z = Math.sin(Math.PI * p) * 0.18
  })

  return (
    <group ref={ref}>
      <Knight side="black" scale={0.62} />
    </group>
  )
}

/** Pulsing gold halo on the board under the king. */
function KingHalo() {
  const ring = useRef<THREE.Mesh>(null)
  const mat = useRef<THREE.MeshBasicMaterial>(null)

  useFrame(({ clock }) => {
    const k = (clock.elapsedTime % 2.4) / 2.4
    ring.current?.scale.setScalar(0.8 + k * 0.9)
    if (mat.current) mat.current.opacity = 0.55 * (1 - k)
  })

  return (
    <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.035, 0]}>
      <ringGeometry args={[0.42, 0.47, 64]} />
      <meshBasicMaterial ref={mat} color="#D4AF37" transparent depthWrite={false} />
    </mesh>
  )
}

/* ------------------------------------------------------------------ */
/*  Scene                                                              */
/* ------------------------------------------------------------------ */

// Horizontal footprint of the board at its widest yaw, plus breathing room.
// A square of side B rotated by θ spans B·(|cos θ| + |sin θ|).
const BASE_YAW = -0.4
const YAW_RANGE = 0.14
const MAX_YAW = Math.abs(BASE_YAW) + YAW_RANGE
const FOOTPRINT = BOARD * (Math.cos(MAX_YAW) + Math.sin(MAX_YAW)) + 0.8

function Rig({ pointer, reduced, children }: { pointer: PointerRef; reduced: boolean; children: ReactNode }) {
  const ref = useRef<THREE.Group>(null)
  const { viewport } = useThree()
  // fit to whichever axis is tighter so the board never clips
  const fit = Math.min(viewport.width / FOOTPRINT, viewport.height / 6, 1)

  useFrame(({ clock }, dt) => {
    const g = ref.current
    if (!g) return
    const t = clock.elapsedTime
    const intro = easeInOut(Math.min(t / 1.8, 1))
    const { x, y } = reduced ? { x: 0, y: 0 } : (pointer.current ?? { x: 0, y: 0 })
    const sway = reduced ? 0 : Math.sin(t * 0.2) * 0.05
    const yaw = BASE_YAW + THREE.MathUtils.clamp(x * 0.1 + sway, -YAW_RANGE, YAW_RANGE)
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, yaw - (1 - intro) * 0.7, 2.5, dt)
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, y * 0.04, 2.5, dt)
    g.position.y = -0.75 - (1 - intro) * 0.8
    g.scale.setScalar(fit * (0.9 + intro * 0.1))
  })

  return <group ref={ref}>{children}</group>
}

function Scene({ isLight, pointer, reduced }: { isLight: boolean; pointer: PointerRef; reduced: boolean }) {
  const [kx, kz] = toWorld(...KING_SQ)
  const [qx, qz] = toWorld(2, 1)
  const [bx, bz] = toWorld(6, 2)
  const [px, pz] = toWorld(6, 5)
  const [dx, dz] = toWorld(1, 4)
  const speed = reduced ? 0 : 1

  return (
    <>
      <ambientLight intensity={isLight ? 0.7 : 0.35} color="#8ECAE6" />
      <directionalLight position={[4, 9, 6]} intensity={isLight ? 2.2 : 1.8} color="#F2F5FA" />
      <spotLight position={[-6, 6, -6]} angle={0.6} penumbra={0.8} intensity={55} color="#3A8DDE" />
      <pointLight position={[kx, 2.4, kz]} intensity={3} distance={5} color="#D4AF37" />

      <Rig pointer={pointer} reduced={reduced}>
        <Board isLight={isLight} />

        <group position={[kx, 0.02, kz]}>
          <KingHalo />
          <King side="white" scale={1.12} />
        </group>
        <Queen side="black" position={[qx, 0.02, qz]} scale={0.82} />
        <Bishop side="white" position={[bx, 0.02, bz]} scale={0.72} />
        <Pawn side="white" position={[px, 0.02, pz]} scale={0.62} />
        <Pawn side="black" position={[dx, 0.02, dz]} scale={0.62} />
        <HoppingKnight reduced={reduced} />

        {/* two small pieces drifting behind the board, kept inside the footprint */}
        <Float speed={1.4 * speed} rotationIntensity={0.6} floatIntensity={0.8}>
          <Bishop side="black" position={[-2.4, 2.6, -2.6]} rotation={[0.25, 0.3, -0.3]} scale={0.6} />
        </Float>
        <Float speed={1.7 * speed} rotationIntensity={0.7} floatIntensity={0.9}>
          <Pawn side="white" position={[2.6, 2.2, -2.2]} rotation={[-0.2, 0, 0.35]} scale={0.6} />
        </Float>

        <ContactShadows
          position={[0, 0.025, 0]}
          scale={8}
          opacity={isLight ? 0.3 : 0.5}
          blur={2.6}
          far={3}
          resolution={512}
          color="#020617"
        />
      </Rig>

      <Sparkles
        count={45}
        scale={[8, 4, 6]}
        position={[0, 1.2, 0]}
        size={2}
        speed={0.3 * speed}
        opacity={isLight ? 0.5 : 0.75}
        color={isLight ? '#1F4FAE' : '#8ECAE6'}
      />

      {/* self-contained studio lighting (no HDR download) */}
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={2.5} position={[0, 5, -6]} scale={[12, 3, 1]} color="#8ECAE6" />
        <Lightformer form="rect" intensity={3} position={[-6, 2, 1]} rotation-y={Math.PI / 2} scale={[10, 2, 1]} color="#F2F5FA" />
        <Lightformer form="ring" intensity={2.5} position={[6, 3, 2]} rotation-y={-Math.PI / 2} scale={3} color="#D4AF37" />
      </Environment>
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  HTML layer                                                         */
/* ------------------------------------------------------------------ */

const EASE = [0.16, 1, 0.3, 1] as const

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11, delayChildren: 0.1 } },
}

const rise: Variants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.9, ease: EASE } },
}

const lineReveal: Variants = {
  hidden: { y: '105%' },
  show: { y: '0%', transition: { duration: 1.1, ease: EASE } },
}

function CountUp({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, to, {
      duration: 2,
      delay: 0.8,
      ease: EASE,
      onUpdate: (v) => setValue(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, to])

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  )
}

const stats = [
  { id: 'students', icon: Users, to: 1500, suffix: '+', label: 'Students Trained' },
  { id: 'years', icon: Award, to: 12, suffix: '+', label: 'Years Coaching' },
  { id: 'trophies', icon: Trophy, to: 50, suffix: '+', label: 'Tournament Wins' },
]

function FloatCard({ className, delay, children }: { className: string; delay: number; children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.9, ease: EASE }}
      className={`hidden sm:block absolute z-10 ${className}`}
    >
      {children}
    </motion.div>
  )
}

export default function Hero1() {
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const pointer = useRef({ x: 0, y: 0 })
  const isLight = useIsLightMode()
  const isDesktop = useIsDesktop()
  const reduced = useReducedMotion() ?? false
  const stageInView = useInView(stageRef, { margin: '200px' })

  // cursor spotlight
  const spotX = useMotionValue(-1000)
  const spotY = useMotionValue(-1000)
  const smoothX = useSpring(spotX, { stiffness: 120, damping: 20 })
  const smoothY = useSpring(spotY, { stiffness: 120, damping: 20 })

  // scroll parallax (desktop only — on mobile the copy and stage are stacked and would collide)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const parallax = isDesktop && !reduced
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 140])
  const stageY = useTransform(scrollYProgress, [0, 1], [0, -60])
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0])

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1
      const rect = sectionRef.current?.getBoundingClientRect()
      if (rect) {
        spotX.set(e.clientX - rect.left)
        spotY.set(e.clientY - rect.top)
      }
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [spotX, spotY])

  const scrollTo = (id: string) => {
    const el = document.querySelector(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section ref={sectionRef} data-testid="hero1" className="relative w-full min-h-screen overflow-hidden bg-void">
      {/* ---------- backdrop ---------- */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute -top-48 -left-40 w-[40rem] h-[40rem] rounded-full blur-3xl opacity-70"
          style={{ background: 'radial-gradient(circle, rgba(58,141,222,0.28), transparent 65%)' }}
          animate={reduced ? undefined : { x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-[-20%] right-[-10%] w-[38rem] h-[38rem] rounded-full blur-3xl opacity-50"
          style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.2), transparent 65%)' }}
          animate={reduced ? undefined : { x: [0, -40, 0], y: [0, -30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* receding chess-grid floor */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 overflow-hidden [perspective:900px]">
          <div
            className="absolute inset-x-[-50%] bottom-[-10%] h-[160%] chess-grid-bg origin-bottom"
            style={{
              transform: 'rotateX(64deg)',
              maskImage: 'linear-gradient(to top, #000 5%, transparent 70%)',
              WebkitMaskImage: 'linear-gradient(to top, #000 5%, transparent 70%)',
            }}
          />
        </div>

        {/* cursor spotlight */}
        <motion.div
          className="absolute w-[520px] h-[520px] -ml-[260px] -mt-[260px] rounded-full hidden md:block"
          style={{
            x: smoothX,
            y: smoothY,
            background: 'radial-gradient(circle, rgba(142,202,230,0.12), transparent 60%)',
          }}
        />
      </div>

      {/* top padding clears the fixed 72px navbar at every viewport height */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-28 sm:pt-32 lg:pt-32 pb-16 lg:pb-20 min-h-[100svh] grid lg:grid-cols-[1fr_1.1fr] items-center gap-12 lg:gap-8">
        {/* ---------- copy ---------- */}
        <motion.div
          style={parallax ? { y: copyY, opacity: fade } : undefined}
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-xl mx-auto lg:mx-0 text-center lg:text-left"
        >
          <motion.div
            variants={rise}
            data-testid="hero-eyebrow"
            className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full liquid-glass text-sky text-[11px] sm:text-xs font-semibold uppercase tracking-[0.16em]"
          >
            <span className="relative flex w-2 h-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-gold opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-gold" />
            </span>
            Tripura&apos;s Premier Chess Institute
          </motion.div>

          {/* size tracks both width and height so short laptop screens don't overflow */}
          <h1
            data-testid="hero-headline"
            className="mt-6 font-display font-bold text-[2.6rem] leading-[1.04] sm:text-6xl lg:text-[clamp(3rem,min(4.6vw,8vh),4.4rem)] text-ivory tracking-tight"
          >
            {[
              <>Master the</>,
              <span className="text-gradient italic font-semibold pr-2">64 squares.</span>,
              <>
                Rule the <span className="text-gradient-gold">board.</span>
              </>,
            ].map((line, i) => (
              <span key={i} className="block overflow-hidden pb-1">
                <motion.span variants={lineReveal} className="block">
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            variants={rise}
            className="mt-5 text-base lg:text-lg text-ghost leading-relaxed max-w-md mx-auto lg:mx-0"
          >
            Learn from the coaches behind Tripura&apos;s top players — from your first move to
            your first rated tournament.
          </motion.p>

          <motion.div
            variants={rise}
            className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-3"
          >
            <button
              data-testid="hero-cta-join"
              onClick={() => scrollTo('#booking')}
              className="btn-primary group px-6 sm:px-7"
            >
              Join Now
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <button
              data-testid="hero-cta-demo"
              onClick={() => scrollTo('#booking')}
              className="btn-gold px-6 sm:px-7"
            >
              <CalendarCheck className="w-4 h-4" />
              Book Free Demo
            </button>
            <button
              data-testid="hero-cta-contact"
              onClick={() => scrollTo('#contact')}
              className="group inline-flex items-center gap-2 px-3 py-3 text-sm font-semibold text-ghost hover:text-sky transition-colors"
            >
              <span className="grid place-items-center w-8 h-8 rounded-full border border-sky/25 group-hover:border-sky/60 transition-colors">
                <Phone className="w-3.5 h-3.5" />
              </span>
              Contact
            </button>
          </motion.div>

          {/* stats — open layout separated by a hairline, not a boxed card */}
          <motion.div variants={rise} className="mt-10 pt-8 border-t border-sky/10 max-w-lg mx-auto lg:mx-0">
            <div className="grid grid-cols-3">
              {stats.map((s, i) => (
                <div
                  key={s.id}
                  data-testid={`hero-stat-${s.id}`}
                  className={`text-center lg:text-left ${i > 0 ? 'border-l border-sky/10 pl-3 sm:pl-6' : 'pr-3 sm:pr-6'}`}
                >
                  <p className="font-display font-bold text-2xl sm:text-[1.9rem] text-ivory tabular-nums leading-none">
                    <CountUp to={s.to} suffix={s.suffix} />
                  </p>
                  <p className="mt-2 inline-flex items-center gap-1.5 text-[11px] sm:text-xs text-ghost">
                    <s.icon className="hidden sm:block w-3.5 h-3.5 text-gold shrink-0" />
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* ---------- 3D stage ---------- */}
        <motion.div
          ref={stageRef}
          style={parallax ? { y: stageY } : undefined}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, ease: EASE, delay: 0.25 }}
          className="relative w-full h-[360px] sm:h-[500px] lg:h-[min(80vh,700px)]"
        >
          {/* glowing ring + halo behind the board */}
          <div aria-hidden className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className="absolute w-[78%] aspect-square rounded-full blur-2xl"
              style={{ background: 'radial-gradient(circle, rgba(58,141,222,0.3), transparent 68%)' }}
            />
            <div
              className="absolute w-[72%] aspect-square rounded-full animate-spin-slow opacity-70"
              style={{
                background:
                  'conic-gradient(from 0deg, transparent 0deg, rgba(142,202,230,0.55) 60deg, transparent 120deg, transparent 180deg, rgba(212,175,55,0.55) 240deg, transparent 300deg)',
                WebkitMask: 'radial-gradient(circle, transparent 69.5%, #000 70%, #000 70.6%, transparent 71%)',
                mask: 'radial-gradient(circle, transparent 69.5%, #000 70%, #000 70.6%, transparent 71%)',
              }}
            />
            <div className="absolute w-[56%] aspect-square rounded-full border border-dashed border-sky/15" />
          </div>

          <Canvas
            dpr={[1, 1.75]}
            frameloop={stageInView ? 'always' : 'never'}
            camera={{ position: [0, 4.8, 9.2], fov: 36, near: 0.1, far: 60 }}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            onCreated={({ camera }) => camera.lookAt(0, 0.35, 0)}
            className="!absolute inset-0"
          >
            <Suspense fallback={null}>
              <Scene isLight={isLight} pointer={pointer} reduced={reduced} />
            </Suspense>
          </Canvas>

          {/* info cards sit in the empty corners around the board */}
          <FloatCard className="top-[6%] left-0" delay={1.1}>
            <div className="liquid-glass rounded-2xl px-4 py-3 flex items-center gap-3 animate-float">
              <span className="grid place-items-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#3A8DDE] to-[#1F4FAE] shadow-glow">
                <TrendingUp className="w-5 h-5 text-white" />
              </span>
              <div>
                <p className="font-display font-bold text-xl text-gradient leading-none">+220 ELO</p>
                <p className="text-ghost text-[11px] mt-1">avg. growth in 6 months</p>
              </div>
            </div>
          </FloatCard>

          <FloatCard className="bottom-[10%] left-0" delay={1.3}>
            <div className="liquid-glass rounded-2xl px-4 py-3 flex items-center gap-3 animate-float-slow">
              <span className="grid place-items-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#F3D87A] to-[#D4AF37] shadow-glow-gold">
                <Trophy className="w-5 h-5 text-[#0B1733]" />
              </span>
              <div>
                <p className="font-display font-bold text-xl text-gradient-gold leading-none">100+</p>
                <p className="text-ghost text-[11px] mt-1">FIDE-rated students</p>
              </div>
            </div>
          </FloatCard>

          {/* address pill */}
          <div className="absolute z-10 bottom-0 inset-x-0 flex justify-center sm:justify-end sm:right-2">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.9, ease: EASE }}
              className="liquid-glass rounded-full pl-3 pr-4 py-2 flex items-center gap-2 whitespace-nowrap"
            >
              <MapPin className="w-4 h-4 text-sky shrink-0" />
              <span className="text-xs sm:text-sm text-ivory font-medium">Ramnagar 4, Agartala</span>
              <span className="hidden sm:inline text-xs text-ghost">· opp. Suruchi Restaurant</span>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* scroll cue */}
      <motion.div
        style={parallax ? { opacity: fade } : undefined}
        className="hidden lg:flex absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex-col items-center gap-2">
        <span className="text-[10px] text-ghost uppercase tracking-[0.3em]">Scroll</span>
        <div className="w-5 h-8 rounded-full border-2 border-sky/50 flex justify-center pt-1">
          <motion.div
            className="w-1 h-2 rounded-full bg-gold"
            animate={reduced ? undefined : { y: [0, 10, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </section>
  )
}
