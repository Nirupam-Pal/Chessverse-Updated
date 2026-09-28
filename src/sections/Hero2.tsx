import { useEffect, useMemo, useRef, useState, Suspense, type ReactNode, type RefObject } from 'react'
import { Canvas, useFrame, useThree, type ThreeElements } from '@react-three/fiber'
import { Environment, Lightformer, MeshReflectorMaterial, PerformanceMonitor, Preload, Sparkles, useGLTF } from '@react-three/drei'
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
  type Variants,
} from 'framer-motion'
import {
  ArrowRight,
  Award,
  CalendarCheck,
  Crown,
  MapPin,
  MonitorPlay,
  TrendingUp,
  Trophy,
  Users,
} from 'lucide-react'
import * as THREE from 'three'
import knightGlbUrl from '@/assets/models/knight.glb?inline'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
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

type PointerRef = RefObject<{ x: number; y: number }>

const easeOut = (p: number) => 1 - Math.pow(1 - p, 3)

// fixed navbar is 72px tall; keep the 3D knight at least this far from the top edge
const NAV_SAFE_PX = 96

/* ------------------------------------------------------------------ */
/*  Geometry                                                           */
/* ------------------------------------------------------------------ */

type Profile = [number, number][]

function lathe(profile: Profile, smooth = true) {
  const raw = profile.map(([x, y]) => new THREE.Vector2(x, y))
  const pts = smooth ? new THREE.SplineCurve(raw).getPoints(160) : raw
  const geo = new THREE.LatheGeometry(pts, 96)
  geo.computeVertexNormals()
  return geo
}

// Staunton foot: flat pad, double bead, cove, then flowing into the stem
const BASE: Profile = [
  [0, 0], [0.5, 0], [0.515, 0.025], [0.5, 0.06], [0.45, 0.085], [0.455, 0.12],
  [0.43, 0.15], [0.38, 0.175], [0.33, 0.22], [0.3, 0.27],
]

const KING_GEO = lathe([
  ...BASE, [0.24, 0.42], [0.2, 0.7], [0.18, 0.98], [0.2, 1.08], [0.3, 1.14], [0.32, 1.18],
  [0.3, 1.22], [0.2, 1.26], [0.19, 1.3], [0.24, 1.42], [0.3, 1.56], [0.32, 1.64],
  [0.26, 1.69], [0.14, 1.73], [0, 1.74],
])

const QUEEN_GEO = lathe([
  ...BASE, [0.23, 0.42], [0.19, 0.7], [0.16, 0.96], [0.18, 1.04], [0.28, 1.1], [0.3, 1.14],
  [0.28, 1.18], [0.18, 1.22], [0.17, 1.26], [0.22, 1.38], [0.31, 1.54], [0.33, 1.58],
  [0.24, 1.6], [0.1, 1.6], [0, 1.6],
])

const BISHOP_GEO = lathe([
  ...BASE, [0.21, 0.42], [0.16, 0.68], [0.17, 0.76], [0.26, 0.81], [0.27, 0.85],
  [0.25, 0.88], [0.15, 0.91], [0.14, 0.95], [0.2, 1.03], [0.235, 1.14], [0.22, 1.26],
  [0.16, 1.36], [0.07, 1.42], [0, 1.43],
])

const PAWN_GEO = lathe([
  ...BASE, [0.21, 0.38], [0.15, 0.52], [0.16, 0.56], [0.26, 0.6], [0.27, 0.63],
  [0.24, 0.66], [0.12, 0.68], [0, 0.68],
])

const ROOK_GEO = lathe([
  ...BASE, [0.28, 0.42], [0.26, 0.7], [0.27, 0.84], [0.32, 0.9], [0.35, 0.95],
  [0.36, 1.08], [0.3, 1.08], [0, 1.08],
])

// top recess of the rook, in the contrasting tone
const ROOK_TOP_GEO = new THREE.CylinderGeometry(0.24, 0.24, 0.02, 64)

const CROSS_V_GEO = new RoundedBoxGeometry(0.08, 0.3, 0.08, 4, 0.03)
const CROSS_H_GEO = new RoundedBoxGeometry(0.22, 0.08, 0.08, 4, 0.03)
const MERLON_GEO = new RoundedBoxGeometry(0.13, 0.14, 0.12, 4, 0.025)

/* ------------------------------------------------------------------ */
/*  Materials                                                          */
/* ------------------------------------------------------------------ */

// polished porcelain
const IVORY_MAT = new THREE.MeshPhysicalMaterial({
  color: '#F2F5FA',
  roughness: 0.24,
  metalness: 0.02,
  clearcoat: 1,
  clearcoatRoughness: 0.06,
  sheen: 0.35,
  sheenRoughness: 0.5,
  sheenColor: new THREE.Color('#8ECAE6'),
  specularIntensity: 0.7,
})

// deep lacquer
const NAVY_MAT = new THREE.MeshPhysicalMaterial({
  color: '#0E2A52',
  roughness: 0.3,
  metalness: 0.3,
  clearcoat: 1,
  clearcoatRoughness: 0.04,
  emissive: new THREE.Color('#1F4FAE'),
  emissiveIntensity: 0.1,
})

const GOLD_MAT = new THREE.MeshPhysicalMaterial({
  color: '#D4AF37',
  metalness: 1,
  roughness: 0.16,
  clearcoat: 0.6,
  clearcoatRoughness: 0.1,
  emissive: new THREE.Color('#8A6A12'),
  emissiveIntensity: 0.3,
})

type Side = 'white' | 'black'
const matFor = (side: Side) => (side === 'white' ? IVORY_MAT : NAVY_MAT)
const accentFor = (side: Side) => (side === 'white' ? NAVY_MAT : IVORY_MAT)

/* ------------------------------------------------------------------ */
/*  Pieces                                                             */
/* ------------------------------------------------------------------ */

type PieceKind = 'king' | 'queen' | 'bishop' | 'rook' | 'pawn'
type PieceProps = { side: Side } & ThreeElements['group']

/** Thin gold ring hugging a collar of a turned piece. */
function Band({ y, r, tube = 0.016 }: { y: number; r: number; tube?: number }) {
  return (
    <mesh position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]} material={GOLD_MAT}>
      <torusGeometry args={[r, tube, 12, 96]} />
    </mesh>
  )
}

function Piece({ kind, side, ...props }: PieceProps & { kind: PieceKind }) {
  const mat = matFor(side)
  return (
    <group {...props}>
      {/* every piece shares the gold-trimmed foot */}
      <Band y={0.1} r={0.452} tube={0.014} />

      {kind === 'king' && (
        <>
          <mesh geometry={KING_GEO} material={mat} />
          <Band y={1.18} r={0.32} />
          <mesh position={[0, 1.88, 0]} geometry={CROSS_V_GEO} material={GOLD_MAT} />
          <mesh position={[0, 1.92, 0]} geometry={CROSS_H_GEO} material={GOLD_MAT} />
          <mesh position={[0, 1.75, 0]} material={GOLD_MAT}>
            <sphereGeometry args={[0.07, 32, 32]} />
          </mesh>
        </>
      )}

      {kind === 'queen' && (
        <>
          <mesh geometry={QUEEN_GEO} material={mat} />
          <Band y={1.14} r={0.3} />
          <Band y={1.57} r={0.325} tube={0.02} />
          {Array.from({ length: 10 }, (_, i) => {
            const a = (i / 10) * Math.PI * 2
            return (
              <mesh key={i} position={[Math.cos(a) * 0.3, 1.63, Math.sin(a) * 0.3]} material={GOLD_MAT}>
                <sphereGeometry args={[0.038, 20, 20]} />
              </mesh>
            )
          })}
          <mesh position={[0, 1.66, 0]} material={mat}>
            <sphereGeometry args={[0.12, 32, 32]} />
          </mesh>
          <mesh position={[0, 1.8, 0]} material={GOLD_MAT}>
            <sphereGeometry args={[0.06, 32, 32]} />
          </mesh>
        </>
      )}

      {kind === 'bishop' && (
        <>
          <mesh geometry={BISHOP_GEO} material={mat} />
          <Band y={0.85} r={0.27} />
          {/* the mitre's diagonal cut, picked out in gold */}
          <mesh position={[0, 1.2, 0]} rotation={[Math.PI / 2 - 0.55, 0, 0]} material={GOLD_MAT}>
            <torusGeometry args={[0.215, 0.014, 12, 96]} />
          </mesh>
          <mesh position={[0, 1.47, 0]} material={GOLD_MAT}>
            <sphereGeometry args={[0.065, 32, 32]} />
          </mesh>
        </>
      )}

      {kind === 'rook' && (
        <>
          <mesh geometry={ROOK_GEO} material={mat} />
          <Band y={0.93} r={0.335} />
          <mesh position={[0, 1.085, 0]} geometry={ROOK_TOP_GEO} material={accentFor(side)} />
          {Array.from({ length: 6 }, (_, i) => {
            const a = (i / 6) * Math.PI * 2
            return (
              <mesh
                key={i}
                position={[Math.cos(a) * 0.3, 1.15, Math.sin(a) * 0.3]}
                rotation={[0, -a, 0]}
                geometry={MERLON_GEO}
                material={mat}
              />
            )
          })}
        </>
      )}

      {kind === 'pawn' && (
        <>
          <mesh geometry={PAWN_GEO} material={mat} />
          <Band y={0.62} r={0.268} />
          <mesh position={[0, 0.86, 0]} material={mat}>
            <sphereGeometry args={[0.21, 48, 48]} />
          </mesh>
        </>
      )}
    </group>
  )
}

/* ---- Hero knight: glTF model ---------------------------------------- */
/* "Stylized red knight chess piece" by noamkremerpro — CC BY 4.0
   https://sketchfab.com/3d-models/stylized-red-knight-chess-piece-736b3794702644b89fc3ed3c3c42109a
   (credited on the page; see the hero's footer credit) */

// Inlined into the bundle as a data URL (~100 KB): the model arrives with the page's JS,
// so there's no separate request to stall or fail on a slow connection.
const KNIGHT_URL = knightGlbUrl
useGLTF.preload(KNIGHT_URL, false)

// model height (≈1.84) × the scale it's rendered at in the scene — used to keep its top in frame
const KNIGHT_SCALE = 2
const KNIGHT_TOP = 1.84 * KNIGHT_SCALE

// satin porcelain — matches the reference photo rather than the file's grey
const KNIGHT_MAT = new THREE.MeshPhysicalMaterial({
  color: '#EDF0F5',
  roughness: 0.38,
  metalness: 0.03,
  clearcoat: 0.6,
  clearcoatRoughness: 0.2,
  sheen: 0.2,
  sheenRoughness: 0.6,
  sheenColor: new THREE.Color('#8ECAE6'),
  side: THREE.DoubleSide, // the source mesh is authored double-sided
})

// The model is centred on its middle, Z-up, nose toward −Y. Normalise it to the
// convention the scene expects: Y-up, base at y = 0, nose toward −x, ~1.84 tall.
function useKnightGeometry() {
  const gltf = useGLTF(KNIGHT_URL, false)
  return useMemo(() => {
    let source: THREE.BufferGeometry | undefined
    gltf.scene.traverse((o) => {
      if (!source && (o as THREE.Mesh).isMesh) source = (o as THREE.Mesh).geometry
    })
    if (!source) throw new Error('knight.glb contains no mesh')
    const geo = source.clone()
    geo.rotateX(-Math.PI / 2) // Z-up → Y-up (same as the file's root node matrix)
    geo.rotateY(-Math.PI / 2) // nose from +z → −x
    geo.computeBoundingBox()
    const box = geo.boundingBox!
    geo.translate(-(box.min.x + box.max.x) / 2, -box.min.y, -(box.min.z + box.max.z) / 2)
    geo.computeBoundingBox()
    return geo
  }, [gltf])
}

function HeroKnight(props: ThreeElements['group']) {
  const geometry = useKnightGeometry()
  return (
    <group {...props}>
      <mesh geometry={geometry} material={KNIGHT_MAT} castShadow />
    </group>
  )
}

/* ------------------------------------------------------------------ */
/*  Scene                                                              */
/* ------------------------------------------------------------------ */

const ORBIT: { kind: PieceKind; side: Side }[] = [
  { kind: 'pawn', side: 'black' },
  { kind: 'rook', side: 'white' },
  { kind: 'bishop', side: 'black' },
  { kind: 'queen', side: 'white' },
  { kind: 'king', side: 'black' },
  { kind: 'bishop', side: 'white' },
  { kind: 'rook', side: 'black' },
  { kind: 'pawn', side: 'white' },
]
const ORBIT_RADIUS = 3.1

function OrbitRing({ progress, reduced }: { progress: RefObject<number>; reduced: boolean }) {
  const ring = useRef<THREE.Group>(null)
  const pieces = useRef<(THREE.Group | null)[]>([])

  useFrame(({ clock }) => {
    const t = reduced ? 0 : clock.elapsedTime
    const p = progress.current ?? 0
    if (ring.current) {
      ring.current.rotation.y = t * 0.14 + p * 1.6
      ring.current.scale.setScalar(1 + p * 0.45)
    }
    pieces.current.forEach((g, i) => {
      if (!g) return
      g.position.y = Math.sin(t * 1.1 + i * 0.8) * 0.12
      g.rotation.y = t * 0.4 + i
      g.rotation.z = Math.sin(t * 0.7 + i) * 0.12 + p * (i % 2 ? 0.5 : -0.5)
    })
  })

  return (
    <group rotation={[0.2, 0, 0.06]} position={[0, -0.55, 0]}>
      <group ref={ring}>
        {ORBIT.map((o, i) => {
          const a = (i / ORBIT.length) * Math.PI * 2
          return (
            <group key={i} position={[Math.cos(a) * ORBIT_RADIUS, 0, Math.sin(a) * ORBIT_RADIUS]}>
              <group ref={(g) => { pieces.current[i] = g }}>
                <Piece kind={o.kind} side={o.side} scale={0.46} position={[0, -0.4, 0]} />
              </group>
            </group>
          )
        })}
        {/* faint orbit path */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[ORBIT_RADIUS, 0.006, 8, 160]} />
          <meshBasicMaterial color="#8ECAE6" transparent opacity={0.35} />
        </mesh>
      </group>
    </group>
  )
}

function PedestalGlow() {
  const ring = useRef<THREE.Mesh>(null)
  const mat = useRef<THREE.MeshBasicMaterial>(null)

  useFrame(({ clock }) => {
    const k = (clock.elapsedTime % 2.8) / 2.8
    ring.current?.scale.setScalar(1 + k * 1.1)
    if (mat.current) mat.current.opacity = 0.6 * (1 - k)
  })

  return (
    <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.515, 0]}>
      <ringGeometry args={[1.5, 1.54, 96]} />
      <meshBasicMaterial ref={mat} color="#D4AF37" transparent depthWrite={false} />
    </mesh>
  )
}

function Scene({
  scroll,
  pointer,
  isLight,
  reduced,
  onReady,
}: {
  scroll: MotionValue<number>
  pointer: PointerRef
  isLight: boolean
  reduced: boolean
  onReady: () => void
}) {
  const { viewport, size } = useThree()
  const wide = viewport.aspect > 1
  const fit = Math.min(1, viewport.width / (wide ? 11 : 6.4))
  const rig = useRef<THREE.Group>(null)
  const knight = useRef<THREE.Group>(null)
  const progress = useRef(0)
  const lift = useRef(0) // ≤ 0: how far the rig is lowered to keep the knight clear of the navbar
  const top = useMemo(() => new THREE.Vector3(), [])
  // The intro is timed from the moment the scene is actually ready (shaders compiled, knight
  // loaded, frames flowing) — not from canvas creation — so a slow first frame can't make it jump.
  const readyAt = useRef<number | null>(null)
  const smoothFrames = useRef(0)
  const bg = isLight ? '#F8FAFC' : '#060B1A'

  useFrame(({ clock, camera }, rawDt) => {
    const t = clock.elapsedTime
    // clamp the step so a dropped frame eases through instead of snapping
    const dt = Math.min(rawDt, 1 / 30)

    if (readyAt.current === null) {
      const knightLoaded = (knight.current?.children.length ?? 0) > 0
      smoothFrames.current = knightLoaded && rawDt < 1 / 25 ? smoothFrames.current + 1 : 0
      if (smoothFrames.current >= 3) {
        readyAt.current = t
        onReady()
      }
    }

    progress.current = THREE.MathUtils.damp(progress.current, scroll.get(), 5, dt)
    const p = progress.current
    const intro = readyAt.current === null ? 0 : easeOut(Math.min((t - readyAt.current) / 1.8, 1))
    const chapter2 = THREE.MathUtils.smoothstep(p, 0.15, 0.42)
    const chapter3 = THREE.MathUtils.smoothstep(p, 0.52, 0.76)
    const { x: px, y: py } = reduced ? { x: 0, y: 0 } : (pointer.current ?? { x: 0, y: 0 })

    if (rig.current) {
      // desktop: knight glides right for chapter 02, then sweeps across to the left for 03
      // mobile: it rises above the panels and stays there
      rig.current.position.x = wide ? (chapter2 - 2 * chapter3) * 2.6 * fit : 0
      rig.current.position.y = (wide ? 0 : chapter2 * 1.45) - (1 - intro) * 1.2 + lift.current
      rig.current.scale.setScalar(fit * (0.8 + intro * 0.2) * (1 - chapter2 * (wide ? 0.08 : 0.45)))
    }
    if (knight.current) {
      const idle = reduced ? 0 : Math.sin(t * 0.35) * 0.3
      knight.current.rotation.y = THREE.MathUtils.damp(
        knight.current.rotation.y,
        -0.35 + idle + px * 0.35 + p * Math.PI * 1.6 - (1 - intro) * 1.4,
        4,
        dt,
      )
      knight.current.rotation.x = THREE.MathUtils.damp(knight.current.rotation.x, py * 0.06, 4, dt)
      knight.current.position.y = -1.26 + (reduced ? 0 : Math.sin(t * 1.3) * 0.04)
    }
    camera.position.set(px * 0.25, 1.1 + p * 0.4, 8.2 - p * 1.1)
    camera.lookAt(0, 0.1, 0)

    // Navbar guard: project the knight's top to the screen; if it would rise above the
    // navbar (+ margin) — the camera dollies in as you scroll — lower the rig just enough.
    if (knight.current) {
      camera.updateMatrixWorld()
      knight.current.updateWorldMatrix(true, false)
      top.set(0, KNIGHT_TOP, 0)
      knight.current.localToWorld(top)
      const dist = camera.position.distanceTo(top)
      top.project(camera)
      const limit = 1 - (2 * NAV_SAFE_PX) / size.height
      const worldPerNdc = dist * Math.tan(THREE.MathUtils.degToRad((camera as THREE.PerspectiveCamera).fov / 2))
      const desired = Math.min(0, lift.current + (limit - top.y) * worldPerNdc)
      lift.current = THREE.MathUtils.damp(lift.current, desired, 12, dt)
    }
  })

  return (
    <>
      <fog attach="fog" args={[bg, 9, 22]} />

      <ambientLight intensity={isLight ? 0.8 : 0.3} color="#8ECAE6" />
      <spotLight position={[0, 9, 3]} angle={0.42} penumbra={0.9} intensity={isLight ? 60 : 110} color="#F2F5FA" />
      <spotLight position={[-7, 3, -4]} angle={0.7} penumbra={1} intensity={70} color="#3A8DDE" />
      <spotLight position={[7, 3, -3]} angle={0.7} penumbra={1} intensity={50} color="#D4AF37" />

      <group ref={rig}>
        {/* pedestal */}
        <mesh position={[0, -1.39, 0]}>
          <cylinderGeometry args={[1.35, 1.5, 0.26, 96]} />
          <meshStandardMaterial color={isLight ? '#DCE6F3' : '#0A1836'} metalness={0.6} roughness={0.25} />
        </mesh>
        <mesh position={[0, -1.26, 0]} rotation={[Math.PI / 2, 0, 0]} material={GOLD_MAT}>
          <torusGeometry args={[1.35, 0.025, 12, 128]} />
        </mesh>
        <PedestalGlow />

        <group ref={knight}>
          <Suspense fallback={null}>
            <HeroKnight scale={KNIGHT_SCALE} />
          </Suspense>
        </group>

        <OrbitRing progress={progress} reduced={reduced} />
      </group>

      {/* mirror floor fading into the fog */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.53, 0]}>
        <planeGeometry args={[60, 60]} />
        <MeshReflectorMaterial
          blur={[300, 80]}
          resolution={256}
          mixBlur={1}
          mixStrength={isLight ? 0.6 : 1.6}
          roughness={1}
          depthScale={1.1}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color={isLight ? '#E8EEF7' : '#050A18'}
          metalness={0.6}
          mirror={0.6}
        />
      </mesh>

      <Sparkles
        count={80}
        scale={[14, 6, 8]}
        position={[0, 1, -1]}
        size={2.4}
        speed={reduced ? 0 : 0.3}
        opacity={isLight ? 0.5 : 0.8}
        color={isLight ? '#1F4FAE' : '#8ECAE6'}
      />

      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={3} position={[0, 6, -6]} scale={[14, 3, 1]} color="#8ECAE6" />
        <Lightformer form="rect" intensity={3} position={[-6, 2, 2]} rotation-y={Math.PI / 2} scale={[10, 2, 1]} color="#F2F5FA" />
        <Lightformer form="ring" intensity={3} position={[6, 3, 2]} rotation-y={-Math.PI / 2} scale={3} color="#D4AF37" />
      </Environment>
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  HTML helpers                                                       */
/* ------------------------------------------------------------------ */

const EASE = [0.16, 1, 0.3, 1] as const

function CountUp({ to, prefix = '', suffix = '', start }: { to: number; prefix?: string; suffix?: string; start: boolean }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!start) return
    // update the text node directly each frame instead of re-rendering React
    const controls = animate(0, to, {
      duration: 1.8,
      ease: EASE,
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = `${prefix}${Math.round(v)}${suffix}`
      },
    })
    return () => controls.stop()
  }, [start, to, prefix, suffix])

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}0{suffix}
    </span>
  )
}

/** Button that leans toward the cursor and springs back on leave. */
function MagneticButton({
  children,
  className,
  onClick,
  testId,
}: {
  children: ReactNode
  className: string
  onClick: () => void
  testId: string
}) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 15 })
  const sy = useSpring(y, { stiffness: 220, damping: 15 })

  return (
    <motion.button
      data-testid={testId}
      onClick={onClick}
      style={{ x: sx, y: sy }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        x.set((e.clientX - r.left - r.width / 2) * 0.3)
        y.set((e.clientY - r.top - r.height / 2) * 0.4)
      }}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
      // .btn-* use transition-all; restrict it so CSS doesn't tween framer's per-frame transforms
      className={`${className} transition-[box-shadow,background-color,border-color,color]`}
    >
      {children}
    </motion.button>
  )
}

const rise: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASE, delay: 0.25 + i * 0.1 },
  }),
}

type Stat = {
  icon: typeof Users
  to: number
  prefix?: string
  suffix: string
  label: string
  text: string
  tone: 'gold' | 'blue'
}

const featuredStat: Stat = {
  icon: Users,
  to: 1500,
  suffix: '+',
  label: 'Students trained',
  text: 'From first-time beginners to rated tournament players — online and at our Agartala academy.',
  tone: 'gold',
}

const stats: Stat[] = [
  { icon: Award, to: 12, suffix: '+', label: 'Years coaching', text: "Shaping Tripura's chess community", tone: 'blue' },
  { icon: Trophy, to: 50, suffix: '+', label: 'Tournament wins', text: 'Podium finishes by our students', tone: 'gold' },
  { icon: Crown, to: 100, suffix: '+', label: 'FIDE-rated players', text: 'Rated students and counting', tone: 'gold' },
  { icon: TrendingUp, to: 220, prefix: '+', suffix: '', label: 'Avg. ELO gain', text: 'In the first six months', tone: 'blue' },
]

function StatCard({ stat, start, featured = false, index }: { stat: Stat; start: boolean; featured?: boolean; index: number }) {
  const gold = stat.tone === 'gold'
  return (
    <motion.div
      initial={false}
      animate={start ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.96 }}
      transition={{ duration: 0.7, ease: EASE, delay: start ? index * 0.08 : 0 }}
      whileHover={{ y: -4 }}
      className={`group relative overflow-hidden rounded-2xl liquid-glass ${featured ? 'col-span-2 p-5 sm:p-6' : 'p-3.5 sm:p-4'}`}
    >
      {/* accent line + corner glow */}
      <span
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background: gold
            ? 'linear-gradient(90deg, transparent, rgba(212,175,55,0.9), transparent)'
            : 'linear-gradient(90deg, transparent, rgba(142,202,230,0.9), transparent)',
        }}
      />
      <span
        aria-hidden
        className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl opacity-60 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: gold ? 'rgba(212,175,55,0.28)' : 'rgba(58,141,222,0.3)' }}
      />

      <div className={`relative flex ${featured ? 'items-center gap-5 sm:gap-7' : 'flex-col gap-2'}`}>
        <div className={featured ? 'shrink-0' : 'flex items-center justify-between'}>
          <p
            className={`font-display font-black leading-none tracking-tight ${
              gold ? 'text-gradient-gold' : 'text-gradient'
            } ${featured ? 'text-[2.75rem] sm:text-6xl' : 'text-3xl sm:text-4xl'}`}
          >
            <CountUp to={stat.to} prefix={stat.prefix} suffix={stat.suffix} start={start} />
          </p>
          {!featured && <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${gold ? 'text-gold' : 'text-sky'}`} />}
        </div>

        <div className="min-w-0">
          <p className={`flex items-center gap-2 font-semibold text-ivory ${featured ? 'text-base sm:text-lg' : 'text-xs sm:text-sm'}`}>
            {featured && <stat.icon className="w-5 h-5 text-gold shrink-0" />}
            {stat.label}
          </p>
          <p className={`text-ghost leading-snug mt-1 ${featured ? 'hidden sm:block text-xs sm:text-sm' : 'hidden sm:block [@media(max-height:820px)]:hidden text-xs'}`}>
            {stat.text}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

const features = [
  { icon: MonitorPlay, title: 'Online & in-person', text: 'Live classes or at our Agartala academy' },
  { icon: Trophy, title: 'FIDE-rated coaching', text: '100+ rated students and counting' },
  { icon: TrendingUp, title: '+220 ELO in 6 months', text: 'Average rating growth of our students' },
]

/* ------------------------------------------------------------------ */
/*  Hero2                                                              */
/* ------------------------------------------------------------------ */

export default function Hero2() {
  const trackRef = useRef<HTMLElement>(null)
  const pointer = useRef({ x: 0, y: 0 })
  const isLight = useIsLightMode()
  const reduced = useReducedMotion() ?? false
  const inView = useInView(trackRef, { margin: '100px' })

  // Entrance waits for the 3D scene (shaders compiled, knight loaded, frames flowing) so the
  // text and the knight animate together on a free main thread. Fallback for slow devices.
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), 2500)
    return () => window.clearTimeout(id)
  }, [])

  // render resolution adapts to the device: drops when frames struggle, recovers when they don't
  const [dpr, setDpr] = useState(() => Math.min(window.devicePixelRatio || 1, 1.5))

  // the section is 340vh tall; its inner frame is pinned while this runs 0 → 1
  //   01 hero  0 – 0.2  ·  02 why  0.22 – 0.58  ·  03 numbers  0.6 – 1
  const { scrollYProgress: rawProgress } = useScroll({ target: trackRef, offset: ['start start', 'end end'] })
  // Mirror into a plain motion value: framer otherwise hands opacity transforms to a native
  // ScrollTimeline that spans the whole document, ignoring the target offsets above.
  const scrollYProgress = useMotionValue(rawProgress.get())
  useMotionValueEvent(rawProgress, 'change', (v) => scrollYProgress.set(v))
  // chapter 01
  const thinkX = useTransform(scrollYProgress, [0, 0.3], ['0vw', '-45vw'])
  const aheadX = useTransform(scrollYProgress, [0, 0.3], ['0vw', '45vw'])
  const wordsOpacity = useTransform(scrollYProgress, [0, 0.24], [1, 0])
  const barOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0])
  const barY = useTransform(scrollYProgress, [0, 0.12], [0, 50])
  const barEvents = useTransform(scrollYProgress, (v) => (v < 0.1 ? 'auto' : 'none'))

  // chapter 02 — in, hold, out
  const panelOpacity = useTransform(scrollYProgress, [0.22, 0.36, 0.5, 0.58], [0, 1, 1, 0])
  const panelY = useTransform(scrollYProgress, [0.22, 0.4, 0.5, 0.58], [60, 0, 0, -50])
  const panelEvents = useTransform(scrollYProgress, (v) => (v > 0.3 && v < 0.54 ? 'auto' : 'none'))
  const panelVisibility = useTransform(panelOpacity, (o) => (o < 0.01 ? 'hidden' : 'visible'))

  // chapter 03
  const numbersOpacity = useTransform(scrollYProgress, [0.6, 0.7], [0, 1])
  const numbersY = useTransform(scrollYProgress, [0.6, 0.74], [50, 0])
  const numbersEvents = useTransform(scrollYProgress, (v) => (v > 0.64 ? 'auto' : 'none'))
  const numbersVisibility = useTransform(numbersOpacity, (o) => (o < 0.01 ? 'hidden' : 'visible'))
  const [statsStarted, setStatsStarted] = useState(false)
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (v > 0.64 && !statsStarted) setStatsStarted(true)
  })

  // progress rail + chapter labels
  const railScale = useTransform(scrollYProgress, [0, 1], [0.06, 1])
  const ch1 = useTransform(scrollYProgress, [0.16, 0.24], [1, 0])
  const ch2 = useTransform(scrollYProgress, [0.16, 0.24, 0.52, 0.6], [0, 1, 1, 0])
  const ch3 = useTransform(scrollYProgress, [0.52, 0.6], [0, 1])

  // cursor glow
  const glowX = useSpring(useMotionValue(-1000), { stiffness: 90, damping: 20 })
  const glowY = useSpring(useMotionValue(-1000), { stiffness: 90, damping: 20 })

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1
      glowX.set(e.clientX)
      glowY.set(e.clientY)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [glowX, glowY])

  const scrollTo = (id: string) => {
    const el = document.querySelector(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const outline = {
    WebkitTextStroke: isLight ? '2.5px rgba(29,78,216,0.8)' : '2.5px rgba(142,202,230,0.85)',
    color: 'transparent',
  }

  return (
    <section ref={trackRef} data-testid="hero2" className="relative h-[340vh] bg-void">
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {/* ---------- giant typography behind the 3D ---------- */}
        <motion.div
          aria-hidden
          style={{ opacity: wordsOpacity }}
          className="absolute inset-0 z-0 pointer-events-none select-none font-display font-black leading-[0.85] tracking-tighter"
        >
          <motion.div style={{ x: thinkX }} className="absolute left-3 sm:left-8 top-[17%] sm:top-[16%]">
            <motion.span
              initial={{ x: -120, opacity: 0 }}
              animate={ready ? { x: 0, opacity: 1 } : undefined}
              transition={{ duration: 1.4, ease: EASE, delay: 0.05 }}
              className="block text-[23vw] sm:text-[16vw] lg:text-[12vw] text-ivory/90"
            >
              THINK
            </motion.span>
          </motion.div>
        </motion.div>

        {/* outlined word sits in front of the 3D — the mirror floor would hide it otherwise,
            and its hollow fill lets the knight show through */}
        <motion.div
          aria-hidden
          style={{ opacity: wordsOpacity }}
          className="absolute inset-0 z-[15] pointer-events-none select-none font-display font-black leading-[0.85] tracking-tighter"
        >
          <motion.div style={{ x: aheadX }} className="absolute right-3 sm:right-8 top-[44%] sm:top-[40%]">
            <motion.span
              initial={{ x: 120, opacity: 0 }}
              animate={ready ? { x: 0, opacity: 1 } : undefined}
              transition={{ duration: 1.4, ease: EASE, delay: 0.15 }}
              className="block text-[23vw] sm:text-[16vw] lg:text-[12vw] italic"
              style={outline}
            >
              AHEAD.
            </motion.span>
          </motion.div>
        </motion.div>

        {/* ---------- 3D ---------- */}
        <motion.div
          className="absolute inset-0 z-10 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: ready ? 1 : 0 }}
          transition={{ duration: 1.2, ease: EASE }}
          style={{
            maskImage: 'linear-gradient(to bottom, transparent 0%, #000 12%, #000 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, #000 12%, #000 100%)',
          }}
        >
          <Canvas
            dpr={dpr}
            frameloop={inView ? 'always' : 'never'}
            camera={{ position: [0, 1.1, 8.2], fov: 35, near: 0.1, far: 60 }}
            gl={{ antialias: true, powerPreference: 'high-performance' }}
          >
            <PerformanceMonitor
              flipflops={3}
              onDecline={() => setDpr(1)}
              onIncline={() => setDpr(Math.min(window.devicePixelRatio || 1, 1.5))}
              onFallback={() => setDpr(1)}
            />
            <Suspense fallback={null}>
              <Scene
                scroll={scrollYProgress}
                pointer={pointer}
                isLight={isLight}
                reduced={reduced}
                onReady={() => setReady(true)}
              />
              {/* compile every material up front instead of hitching on first sight */}
              <Preload all />
            </Suspense>
          </Canvas>
        </motion.div>

        {/* cursor glow over the scene */}
        <motion.div
          aria-hidden
          className="absolute left-0 top-0 z-10 w-[560px] h-[560px] -ml-[280px] -mt-[280px] rounded-full pointer-events-none hidden md:block"
          style={{
            x: glowX,
            y: glowY,
            background: 'radial-gradient(circle, rgba(58,141,222,0.16), transparent 60%)',
          }}
        />

        {/* ---------- chapter 01 : bottom bar ---------- */}
        <motion.div
          style={{ opacity: barOpacity, y: barY, pointerEvents: barEvents }}
          className="absolute inset-x-0 bottom-0 z-20"
        >
          <div className="max-w-7xl mx-auto px-5 sm:px-8 pb-8 sm:pb-10 grid gap-6 lg:grid-cols-[1fr_auto_1fr] lg:items-end">
            <motion.div variants={rise} initial="hidden" animate={ready ? 'show' : 'hidden'} custom={0} className="text-center lg:text-left">
              <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">
                <span className="h-px w-6 bg-gold" /> Tripura&apos;s Premier Chess Institute
              </p>
              <p className="hidden sm:block mt-3 text-sm lg:text-base text-ghost max-w-sm mx-auto lg:mx-0 leading-relaxed">
                Master the 64 squares — from your first move to your first rated tournament.
              </p>
            </motion.div>

            <motion.div
              variants={rise}
              initial="hidden"
              animate={ready ? 'show' : 'hidden'}
              custom={1}
              className="flex flex-wrap items-center justify-center gap-3"
            >
              <MagneticButton testId="hero2-cta-demo" onClick={() => scrollTo('#booking')} className="btn-gold">
                <CalendarCheck className="w-4 h-4" />
                Book Free Demo
              </MagneticButton>
              <MagneticButton testId="hero2-cta-join" onClick={() => scrollTo('#booking')} className="btn-ghost group">
                Join Now
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </MagneticButton>
            </motion.div>

            {/* scroll hint — the numbers now live in chapter 03 */}
            <motion.div
              variants={rise}
              initial="hidden"
              animate={ready ? 'show' : 'hidden'}
              custom={2}
              className="hidden lg:flex justify-end items-center gap-3"
            >
              <span className="text-right text-[11px] uppercase tracking-[0.25em] text-ghost leading-relaxed">
                Scroll to explore
                <br />
                <span className="text-ivory">3 chapters</span>
              </span>
              <span className="w-6 h-10 rounded-full border-2 border-sky/50 flex justify-center pt-1.5">
                <motion.span
                  className="w-1 h-2 rounded-full bg-gold"
                  animate={reduced ? undefined : { y: [0, 12, 0], opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                />
              </span>
            </motion.div>
          </div>
        </motion.div>

        {/* ---------- chapter 02 : feature panel ---------- */}
        <div className="absolute inset-x-0 bottom-0 lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 z-20 pointer-events-none">
          <motion.div
            style={{ opacity: panelOpacity, y: panelY, pointerEvents: panelEvents, visibility: panelVisibility }}
            className="max-w-7xl mx-auto px-5 sm:px-8 pb-8 lg:pb-0"
          >
            <div className="max-w-md mx-auto lg:mx-0 text-center lg:text-left">
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-sky">Why ChessVerse</p>
              <h2 className="mt-3 font-display font-bold text-3xl sm:text-5xl text-ivory leading-[1.05] tracking-tight">
                Train like a <span className="text-gradient-gold italic">grandmaster.</span>
              </h2>

              <ul className="mt-6 sm:mt-8 space-y-2.5 sm:space-y-3 text-left">
                {features.map((f) => (
                  <li key={f.title} className="liquid-glass rounded-2xl px-4 py-3 flex items-center gap-4">
                    <span className="grid place-items-center shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-[#3A8DDE] to-[#1F4FAE] shadow-glow">
                      <f.icon className="w-5 h-5 text-white" />
                    </span>
                    <div>
                      <p className="text-sm sm:text-base font-semibold text-ivory">{f.title}</p>
                      <p className="text-xs text-ghost mt-0.5">{f.text}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-3">
                <MagneticButton testId="hero2-cta-contact" onClick={() => scrollTo('#contact')} className="btn-primary group">
                  Talk to a coach
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </MagneticButton>
                <span className="inline-flex items-center gap-2 text-xs text-ghost">
                  <MapPin className="w-3.5 h-3.5 text-sky" /> Ramnagar 4, Agartala
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ---------- chapter 03 : by the numbers ---------- */}
        <div className="absolute inset-x-0 bottom-0 lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 z-20 pointer-events-none">
          <motion.div
            style={{ opacity: numbersOpacity, y: numbersY, pointerEvents: numbersEvents, visibility: numbersVisibility }}
            className="max-w-7xl mx-auto px-5 sm:px-8 pb-6 lg:pb-0"
          >
            <div className="max-w-xl mx-auto lg:mx-0 lg:ml-auto lg:mr-16">
              <div className="text-center lg:text-left">
                <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">
                  <span className="h-px w-6 bg-gold" /> By the numbers
                </p>
                <h2 className="mt-2 sm:mt-3 font-display font-bold text-[1.7rem] sm:text-4xl xl:text-[2.75rem] text-ivory leading-[1.05] tracking-tight">
                  A decade of{" "}<span className="text-gradient italic">winning moves.</span>
                </h2>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2.5 sm:gap-3">
                <StatCard stat={featuredStat} start={statsStarted} featured index={0} />
                {stats.map((s, i) => (
                  <StatCard key={s.label} stat={s} start={statsStarted} index={i + 1} />
                ))}
              </div>

              <div className="mt-5 flex justify-center lg:justify-start">
                <MagneticButton testId="hero2-cta-numbers" onClick={() => scrollTo('#booking')} className="btn-gold">
                  <CalendarCheck className="w-4 h-4" />
                  Be our next success story
                </MagneticButton>
              </div>
            </div>
          </motion.div>
        </div>

        {/* CC BY 4.0 attribution for the knight model */}
        <a
          href="https://sketchfab.com/3d-models/stylized-red-knight-chess-piece-736b3794702644b89fc3ed3c3c42109a"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute left-3 sm:left-5 bottom-1.5 z-20 text-[9px] sm:text-[10px] tracking-wide text-ghost/50 hover:text-ghost transition-colors"
        >
          Knight model by noamkremerpro · CC BY 4.0
        </a>

        {/* ---------- chapter rail ---------- */}
        <div className="hidden md:flex absolute right-6 lg:right-8 top-1/2 -translate-y-1/2 z-20 flex-col items-center gap-4">
          <div className="relative h-10 w-6 font-display text-sm text-ivory">
            <motion.span style={{ opacity: ch1 }} className="absolute inset-0 grid place-items-center">01</motion.span>
            <motion.span style={{ opacity: ch2 }} className="absolute inset-0 grid place-items-center text-sky">02</motion.span>
            <motion.span style={{ opacity: ch3 }} className="absolute inset-0 grid place-items-center text-gold">03</motion.span>
          </div>
          <div className="relative h-32 w-px bg-[rgba(142,202,230,0.2)] overflow-hidden">
            <motion.div
              style={{ scaleY: railScale }}
              className="absolute inset-0 origin-top bg-gradient-to-b from-[#8ECAE6] to-[#D4AF37]"
            />
          </div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-ghost [writing-mode:vertical-rl]">Scroll</span>
        </div>
      </div>
    </section>
  )
}
