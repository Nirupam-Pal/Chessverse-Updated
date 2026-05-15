import { useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Environment, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

function ChessPiece({
  position,
  type,
  color = 'white',
}: {
  position: [number, number, number]
  type: string
  color?: string
}) {
  const meshRef = useRef<THREE.Group>(null)
  const isWhite = color === 'white'

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3 + position[0]) * 0.1
    }
  })

  // ChessVerse brand-aligned piece colors
  const pieceColor = isWhite ? '#EAF2FB' : '#0B2545'
  const emissiveColor = isWhite ? '#8ECAE6' : '#3A8DDE'

  return (
    <group ref={meshRef} position={position}>
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5} floatingRange={[-0.1, 0.1]}>
        {type === 'king' && (
          <group>
            <mesh castShadow>
              <cylinderGeometry args={[0.35, 0.45, 1.6, 32]} />
              <meshStandardMaterial color={pieceColor} metalness={0.7} roughness={0.25} emissive={emissiveColor} emissiveIntensity={0.15} />
            </mesh>
            <mesh position={[0, 0.9, 0]} castShadow>
              <boxGeometry args={[0.5, 0.15, 0.15]} />
              <meshStandardMaterial color={pieceColor} metalness={0.7} roughness={0.25} emissive={emissiveColor} emissiveIntensity={0.2} />
            </mesh>
            <mesh position={[0, 0.9, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
              <boxGeometry args={[0.5, 0.15, 0.15]} />
              <meshStandardMaterial color={pieceColor} metalness={0.7} roughness={0.25} emissive={emissiveColor} emissiveIntensity={0.2} />
            </mesh>
            <mesh position={[0, 0.6, 0]} castShadow>
              <torusGeometry args={[0.3, 0.06, 16, 32]} />
              <meshStandardMaterial color={pieceColor} metalness={0.8} roughness={0.2} emissive="#D4AF37" emissiveIntensity={0.25} />
            </mesh>
          </group>
        )}
        {type === 'queen' && (
          <group>
            <mesh castShadow>
              <cylinderGeometry args={[0.35, 0.4, 1.5, 32]} />
              <meshStandardMaterial color={pieceColor} metalness={0.7} roughness={0.25} emissive={emissiveColor} emissiveIntensity={0.15} />
            </mesh>
            <mesh position={[0, 0.8, 0]} castShadow>
              <sphereGeometry args={[0.25, 32, 32]} />
              <meshStandardMaterial color={pieceColor} metalness={0.7} roughness={0.25} emissive={emissiveColor} emissiveIntensity={0.2} />
            </mesh>
            <mesh position={[0, 0.55, 0]} castShadow>
              <torusGeometry args={[0.28, 0.05, 16, 32]} />
              <meshStandardMaterial color={pieceColor} metalness={0.8} roughness={0.2} emissive="#D4AF37" emissiveIntensity={0.2} />
            </mesh>
          </group>
        )}
        {type === 'rook' && (
          <group>
            <mesh castShadow>
              <cylinderGeometry args={[0.3, 0.35, 1.2, 32]} />
              <meshStandardMaterial color={pieceColor} metalness={0.7} roughness={0.25} emissive={emissiveColor} emissiveIntensity={0.15} />
            </mesh>
            <mesh position={[0, 0.65, 0]} castShadow>
              <boxGeometry args={[0.6, 0.2, 0.6]} />
              <meshStandardMaterial color={pieceColor} metalness={0.7} roughness={0.25} emissive={emissiveColor} emissiveIntensity={0.2} />
            </mesh>
          </group>
        )}
        {type === 'bishop' && (
          <group>
            <mesh castShadow>
              <coneGeometry args={[0.3, 1.3, 32]} />
              <meshStandardMaterial color={pieceColor} metalness={0.7} roughness={0.25} emissive={emissiveColor} emissiveIntensity={0.15} />
            </mesh>
            <mesh position={[0, 0.05, 0]} castShadow>
              <sphereGeometry args={[0.12, 16, 16]} />
              <meshStandardMaterial color={pieceColor} metalness={0.8} roughness={0.2} emissive="#D4AF37" emissiveIntensity={0.3} />
            </mesh>
          </group>
        )}
        {type === 'knight' && (
          <group>
            <mesh castShadow rotation={[0, 0, 0.2]}>
              <boxGeometry args={[0.35, 0.9, 0.5]} />
              <meshStandardMaterial color={pieceColor} metalness={0.7} roughness={0.25} emissive={emissiveColor} emissiveIntensity={0.15} />
            </mesh>
            <mesh position={[0.15, 0.55, 0]} castShadow>
              <sphereGeometry args={[0.18, 32, 32]} />
              <meshStandardMaterial color={pieceColor} metalness={0.7} roughness={0.25} emissive={emissiveColor} emissiveIntensity={0.2} />
            </mesh>
          </group>
        )}
        {type === 'pawn' && (
          <group>
            <mesh castShadow>
              <sphereGeometry args={[0.25, 32, 32]} />
              <meshStandardMaterial color={pieceColor} metalness={0.7} roughness={0.25} emissive={emissiveColor} emissiveIntensity={0.15} />
            </mesh>
            <mesh position={[0, -0.3, 0]} castShadow>
              <cylinderGeometry args={[0.2, 0.25, 0.4, 32]} />
              <meshStandardMaterial color={pieceColor} metalness={0.7} roughness={0.25} emissive={emissiveColor} emissiveIntensity={0.15} />
            </mesh>
          </group>
        )}
      </Float>
    </group>
  )
}

function FloatingParticles() {
  const particlesRef = useRef<THREE.Points>(null)
  const count = 220
  const positions = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 22
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10 + 2
    positions[i * 3 + 2] = (Math.random() - 0.5) * 22
  }

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02
    }
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.045} color="#8ECAE6" transparent opacity={0.55} blending={THREE.AdditiveBlending} />
    </points>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.35} color="#8ECAE6" />
      <spotLight
        position={[10, 15, 5]}
        angle={Math.PI / 6}
        penumbra={0.5}
        intensity={22}
        color="#F2F5FA"
        castShadow
      />
      <spotLight position={[-8, 10, -5]} angle={Math.PI / 5} penumbra={0.5} intensity={16} color="#1F4FAE" />
      <pointLight position={[0, 3, 0]} intensity={5} color="#3A8DDE" distance={10} decay={2} />

      {/* Chess Board */}
      <group position={[0, -1.5, 0]} rotation={[0, Math.PI / 6, 0]}>
        <mesh receiveShadow position={[0, -0.25, 0]}>
          <boxGeometry args={[9, 0.5, 9]} />
          <meshStandardMaterial color="#0B2545" roughness={0.35} metalness={0.15} />
        </mesh>
        {Array.from({ length: 64 }).map((_, i) => {
          const x = (i % 8) - 3.5
          const z = Math.floor(i / 8) - 3.5
          const isLight = ((i % 8) + Math.floor(i / 8)) % 2 === 0
          return (
            <mesh key={i} position={[x * 1.0, 0.01, z * 1.0]} receiveShadow>
              <boxGeometry args={[0.95, 0.05, 0.95]} />
              <meshStandardMaterial
                color={isLight ? '#1A3567' : '#081530'}
                roughness={0.25}
                metalness={0.1}
              />
            </mesh>
          )
        })}

        <ChessPiece position={[-3.5, 0.5, -3.5]} type="rook" color="white" />
        <ChessPiece position={[-2.5, 0.5, -3.5]} type="knight" color="white" />
        <ChessPiece position={[-1.5, 0.5, -3.5]} type="bishop" color="white" />
        <ChessPiece position={[-0.5, 0.5, -3.5]} type="queen" color="white" />
        <ChessPiece position={[0.5, 0.5, -3.5]} type="king" color="white" />
        <ChessPiece position={[1.5, 0.5, -3.5]} type="bishop" color="white" />
        <ChessPiece position={[2.5, 0.5, -3.5]} type="knight" color="white" />
        <ChessPiece position={[3.5, 0.5, -3.5]} type="rook" color="white" />
        {Array.from({ length: 8 }).map((_, i) => (
          <ChessPiece key={`wp${i}`} position={[i - 3.5, 0.3, -2.5]} type="pawn" color="white" />
        ))}

        <ChessPiece position={[-3.5, 0.5, 3.5]} type="rook" color="black" />
        <ChessPiece position={[-2.5, 0.5, 3.5]} type="knight" color="black" />
        <ChessPiece position={[-1.5, 0.5, 3.5]} type="bishop" color="black" />
        <ChessPiece position={[-0.5, 0.5, 3.5]} type="queen" color="black" />
        <ChessPiece position={[0.5, 0.5, 3.5]} type="king" color="black" />
        <ChessPiece position={[1.5, 0.5, 3.5]} type="bishop" color="black" />
        <ChessPiece position={[2.5, 0.5, 3.5]} type="knight" color="black" />
        <ChessPiece position={[3.5, 0.5, 3.5]} type="rook" color="black" />
        {Array.from({ length: 8 }).map((_, i) => (
          <ChessPiece key={`bp${i}`} position={[i - 3.5, 0.3, 2.5]} type="pawn" color="black" />
        ))}
      </group>

      {/* Floating Pieces */}
      <ChessPiece position={[-5, 3, -4]} type="queen" color="white" />
      <ChessPiece position={[6, 4, -3]} type="knight" color="black" />
      <ChessPiece position={[-3, 5, 2]} type="bishop" color="white" />
      <ChessPiece position={[4, 3.5, 4]} type="rook" color="black" />
      <ChessPiece position={[0, 6, -6]} type="king" color="white" />

      <FloatingParticles />
      <ContactShadows position={[0, -2, 0]} opacity={0.45} scale={20} blur={2} far={4} />
      <Environment preset="city" />
    </>
  )
}

export default function Hero() {
  const scrollTo = (id: string) => {
    const el = document.querySelector(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-void">
      {/* 3D Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas
          shadows
          camera={{ position: [0, 6, 14], fov: 50, near: 0.1, far: 100 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 2]}
        >
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-void/60 via-transparent to-void pointer-events-none" />
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-void/85 via-void/30 to-void/60 pointer-events-none" />

      {/* Hero Content */}
      <div className="relative z-20 flex flex-col justify-center min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[72px]">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-7 sm:space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full liquid-glass text-sky text-xs sm:text-sm font-medium tracking-wide" data-testid="hero-eyebrow">
              <span className="relative flex w-2 h-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-gold opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-gold" />
              </span>
              Tripura&apos;s Premier Chess Institute
            </div>

            <h1
              data-testid="hero-headline"
              className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl xl:text-[5.4rem] text-ivory leading-[0.98] tracking-tight"
            >
              Master the
              <br />
              <span className="text-gradient italic font-semibold">64 squares.</span>
              <br />
              <span className="text-ivory">Rule the board.</span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-ghost max-w-xl leading-relaxed">
              From your very first move to your first rated tournament — learn from coaches
              who have shaped Tripura&apos;s best chess players. Online and in-person classes
              from our Agartala academy.
            </p>

            <div className="flex flex-wrap gap-3 sm:gap-4">
              <button
                data-testid="hero-cta-join"
                onClick={() => scrollTo('#booking')}
                className="btn-primary"
              >
                Join Now
              </button>
              <button
                data-testid="hero-cta-demo"
                onClick={() => scrollTo('#booking')}
                className="btn-gold"
              >
                Book Free Demo
              </button>
              <button
                data-testid="hero-cta-contact"
                onClick={() => scrollTo('#contact')}
                className="btn-ghost"
              >
                Contact Us
              </button>
            </div>

            {/* Mini Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-8 pt-6 max-w-md">
              <div data-testid="hero-stat-students">
                <p className="font-display font-bold text-2xl sm:text-3xl text-ivory">1500+</p>
                <p className="text-[11px] sm:text-xs text-ghost mt-1 leading-snug">Students Trained</p>
              </div>
              <div data-testid="hero-stat-years" className="border-x border-sky/15 px-4">
                <p className="font-display font-bold text-2xl sm:text-3xl text-ivory">12+</p>
                <p className="text-[11px] sm:text-xs text-ghost mt-1 leading-snug">Years Coaching</p>
              </div>
              <div data-testid="hero-stat-trophies">
                <p className="font-display font-bold text-2xl sm:text-3xl text-ivory">50+</p>
                <p className="text-[11px] sm:text-xs text-ghost mt-1 leading-snug">Tournament Wins</p>
              </div>
            </div>
          </div>

          {/* Right - Floating Cards */}
          <div className="hidden lg:flex flex-col items-end gap-4">
            <div className="liquid-glass rounded-2xl p-5 animate-float w-64" style={{ animationDelay: '0s' }}>
              <p className="text-ghost text-xs uppercase tracking-widest">Avg. Rating Growth</p>
              <p className="font-display font-bold text-3xl text-gradient mt-1">+220 ELO</p>
              <p className="text-ghost text-xs mt-1">in first 6 months</p>
            </div>
            <div className="liquid-glass rounded-2xl p-5 animate-float-slow mr-10 w-60" style={{ animationDelay: '1.2s' }}>
              <p className="text-ghost text-xs uppercase tracking-widest">FIDE Rated</p>
              <p className="font-display font-bold text-3xl text-gradient-gold mt-1">100+</p>
              <p className="text-ghost text-xs mt-1">Students &amp; counting</p>
            </div>
            <div className="liquid-glass rounded-2xl p-5 animate-float w-64" style={{ animationDelay: '2.4s' }}>
              <p className="text-ghost text-xs uppercase tracking-widest">Location</p>
              <p className="font-display font-semibold text-base text-ivory mt-1 leading-snug">
                Ramnagar 4, Agartala
              </p>
              <p className="text-ghost text-xs mt-0.5">opp. Suruchi Restaurant</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
        <span className="text-[10px] text-ghost uppercase tracking-[0.3em]">Scroll</span>
        <div className="w-5 h-8 rounded-full border-2 border-sky/35 flex justify-center pt-1">
          <div className="w-1 h-2 rounded-full bg-sky animate-bounce" />
        </div>
      </div>
    </section>
  )
}
