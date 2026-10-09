/**
 * The hero's 3D stage (three.js + react-three-fiber + drei). Lives in its own chunk, loaded by
 * Hero2 only after the headline has painted, so the main bundle and first paint never wait on it.
 */
import { useEffect, useMemo, useRef, useState, Suspense, type RefObject } from 'react'
import { Canvas, useFrame, useThree, type ThreeElements } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer, MeshReflectorMaterial, PerformanceMonitor, Preload, Sparkles, useGLTF } from '@react-three/drei'
import type { MotionValue } from 'framer-motion'
import * as THREE from 'three'
// a separate, cacheable asset (not inlined into the JS bundle as base64)
import knightGlbUrl from '@/assets/models/knight.glb?url'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'

type PointerRef = RefObject<{ x: number; y: number }>

const easeOut = (p: number) => 1 - Math.pow(1 - p, 3)

// fixed navbar is 80px tall at the top of the page (a 68px capsule, 12px from the top, once scrolled);
// keep the 3D knight at least this far from the top edge
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
  lite,
  onReady,
}: {
  scroll: MotionValue<number>
  pointer: PointerRef
  isLight: boolean
  reduced: boolean
  /** low-power device: skip the mirror floor's extra render pass, fewer particles */
  lite: boolean
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
  const bg = isLight ? '#FAF8F3' : '#060B1A'

  // Light mode: a white knight and ivory pieces disappear against porcelain, so re-tone the shared
  // materials — navy-lacquer knight, pearl (not white) ivory pieces.
  useEffect(() => {
    KNIGHT_MAT.color.set(isLight ? '#16264D' : '#EDF0F5')
    KNIGHT_MAT.roughness = isLight ? 0.3 : 0.38
    KNIGHT_MAT.clearcoat = isLight ? 1 : 0.6
    KNIGHT_MAT.sheenColor.set(isLight ? '#D4AF37' : '#8ECAE6')
    IVORY_MAT.color.set(isLight ? '#E4DED0' : '#F2F5FA')
  }, [isLight])

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

      <ambientLight intensity={isLight ? 0.9 : 0.3} color={isLight ? '#FFFFFF' : '#8ECAE6'} />
      <spotLight position={[0, 9, 3]} angle={0.42} penumbra={0.9} intensity={isLight ? 60 : 110} color="#F2F5FA" />
      <spotLight position={[-7, 3, -4]} angle={0.7} penumbra={1} intensity={70} color="#3A8DDE" />
      <spotLight position={[7, 3, -3]} angle={0.7} penumbra={1} intensity={50} color="#D4AF37" />

      <group ref={rig}>
        {/* pedestal */}
        <mesh position={[0, -1.39, 0]}>
          <cylinderGeometry args={[1.35, 1.5, 0.26, 96]} />
          <meshStandardMaterial color={isLight ? '#E6DFD0' : '#0A1836'} metalness={isLight ? 0.2 : 0.6} roughness={isLight ? 0.35 : 0.25} />
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

      {/* floor fading into the fog — dark: blurred mirror; light: matte porcelain.
          The reflector blends a reflection pass rendered over a transparent-black backdrop,
          which greys out a light floor at any strength, so light mode doesn't use it. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.53, 0]}>
        <planeGeometry args={[60, 60]} />
        {isLight ? (
          // toneMapped off: ACES would darken it, leaving a seam against the identical CSS page colour
          <meshBasicMaterial color={bg} toneMapped={false} />
        ) : lite ? (
          // the reflector re-renders the whole scene every frame; a plain dark floor costs nothing
          <meshStandardMaterial color="#050A18" metalness={0.6} roughness={0.5} />
        ) : (
          <MeshReflectorMaterial
            blur={[300, 80]}
            resolution={256}
            mixBlur={1}
            mixStrength={1.6}
            roughness={1}
            depthScale={1.1}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#050A18"
            metalness={0.6}
            mirror={0.6}
          />
        )}
      </mesh>
      {/* light mode grounds the pieces with soft contact shadows instead of a reflection */}
      {isLight && (
        <ContactShadows position={[0, -1.52, 0]} scale={14} blur={2.6} far={4} opacity={0.35} color="#0B1733" resolution={lite ? 256 : 512} />
      )}

      <Sparkles
        count={lite ? 30 : 80}
        scale={[14, 6, 8]}
        position={[0, 1, -1]}
        size={2.4}
        speed={reduced ? 0 : 0.3}
        opacity={isLight ? 0.5 : 0.8}
        color={isLight ? '#8C6A12' : '#8ECAE6'}
      />

      {/* keyed on theme: the env map renders once (frames=1), so rebuild it when the theme flips */}
      <Environment key={isLight ? 'light' : 'dark'} resolution={256} frames={1}>
        {/* light: a bright studio wrap so metals reflect porcelain, not black */}
        {isLight && (
          <>
            <Lightformer form="rect" intensity={1.4} position={[0, 0, 10]} scale={[40, 20, 1]} color="#FFFFFF" />
            <Lightformer form="rect" intensity={1} position={[0, 0, -10]} rotation-y={Math.PI} scale={[40, 20, 1]} color="#F6F1E6" />
          </>
        )}
        <Lightformer form="rect" intensity={3} position={[0, 6, -6]} scale={[14, 3, 1]} color="#8ECAE6" />
        <Lightformer form="rect" intensity={3} position={[-6, 2, 2]} rotation-y={Math.PI / 2} scale={[10, 2, 1]} color="#F2F5FA" />
        <Lightformer form="ring" intensity={3} position={[6, 3, 2]} rotation-y={-Math.PI / 2} scale={3} color="#D4AF37" />
      </Environment>
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  Canvas                                                             */
/* ------------------------------------------------------------------ */

export default function HeroScene({
  scroll,
  pointer,
  isLight,
  reduced,
  active,
  onReady,
}: {
  scroll: MotionValue<number>
  pointer: PointerRef
  isLight: boolean
  reduced: boolean
  /** render frames only while the hero is on screen */
  active: boolean
  onReady: () => void
}) {
  // low-power devices (flagged by SmoothScroll): cap resolution and skip the costliest passes
  const [lite] = useState(() => document.documentElement.classList.contains('perf-lite'))
  const maxDpr = lite ? 1 : Math.min(window.devicePixelRatio || 1, 1.5)
  // render resolution adapts to the device: drops when frames struggle, recovers when they don't
  const [dpr, setDpr] = useState(maxDpr)

  return (
    <Canvas
      dpr={dpr}
      frameloop={active ? 'always' : 'never'}
      camera={{ position: [0, 1.1, 8.2], fov: 35, near: 0.1, far: 60 }}
      gl={{ antialias: !lite, powerPreference: 'high-performance' }}
    >
      <PerformanceMonitor
        flipflops={3}
        onDecline={() => setDpr(1)}
        onIncline={() => setDpr(maxDpr)}
        onFallback={() => setDpr(1)}
      />
      <Suspense fallback={null}>
        <Scene scroll={scroll} pointer={pointer} isLight={isLight} reduced={reduced} lite={lite} onReady={onReady} />
        {/* compile every material up front instead of hitching on first sight */}
        <Preload all />
      </Suspense>
    </Canvas>
  )
}
