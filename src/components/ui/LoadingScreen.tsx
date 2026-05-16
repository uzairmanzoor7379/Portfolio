import { useEffect, useRef, useMemo, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Text3D, Center } from '@react-three/drei'
import { motion, AnimatePresence, useSpring } from 'framer-motion'
import * as THREE from 'three'
import { useStore } from '../../store/useStore'

function ParticleRing() {
  const ref = useRef<THREE.Points>(null)
  const positions = useMemo(() => {
    const pos = new Float32Array(150 * 3)
    for (let i = 0; i < 150; i++) {
      const angle = (i / 150) * Math.PI * 2
      const jitter = (Math.random() - 0.5) * 0.15
      pos[i * 3]     = Math.cos(angle) * (1.8 + jitter)
      pos[i * 3 + 1] = Math.sin(angle) * (1.8 + jitter)
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.2
    }
    return pos
  }, [])

  useFrame((state) => {
    if (ref.current) ref.current.rotation.z = state.clock.elapsedTime * 0.4
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#00F5FF"
        size={0.035}
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

function UMMonogram() {
  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <Center>
        <Text3D
          font="/fonts/helvetiker_regular.typeface.json"
          size={0.7}
          height={0.12}
          curveSegments={4}
        >
          UM
          <meshBasicMaterial color="#00F5FF" />
        </Text3D>
      </Center>
      <pointLight color="#00F5FF" intensity={2} position={[0, 0, 2]} />
    </Float>
  )
}

export function LoadingScreen() {
  const isLoaded = useStore((s) => s.isLoaded)
  const setLoaded = useStore((s) => s.setLoaded)
  const [rawProgress, setRawProgress] = useState(0)
  
  const smoothWidth = useSpring(0, {
    stiffness: 30,
    damping: 20
  })

  useEffect(() => {
    let current = 0
    const interval = setInterval(() => {
      current += Math.random() * 8
      if (current >= 100) {
        current = 100
        clearInterval(interval)
        setTimeout(() => setLoaded(), 600)
      }
      setRawProgress(current)
      smoothWidth.set(current / 100)
    }, 150)
    return () => clearInterval(interval)
  }, [setLoaded, smoothWidth])

  return (
    <AnimatePresence>
      {!isLoaded && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          style={{
            position: 'fixed', inset: 0,
            background: '#050508',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            zIndex: 10000,
          }}
        >
          <div style={{ width: '100%', height: '55vh' }}>
            <Canvas
              camera={{ fov: 75, position: [0, 0, 4] }}
              gl={{ 
                alpha: true, 
                antialias: false,
                powerPreference: 'high-performance' 
              }}
              dpr={[1, 1.5]}
            >
              <ambientLight intensity={0.4} />
              <UMMonogram />
              <ParticleRing />
            </Canvas>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.2rem' }}>
            <div style={{
              width: '200px', height: '1px',
              background: 'rgba(255,255,255,0.1)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <motion.div
                style={{
                  position: 'absolute', top: 0, left: 0,
                  height: '100%', width: '100%',
                  background: '#00F5FF',
                  boxShadow: '0 0 10px #00F5FF',
                  scaleX: smoothWidth,
                  transformOrigin: 'left',
                }}
              />
            </div>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '0.6rem',
              color: 'rgba(255,255,255,0.4)', letterSpacing: '0.3em',
              textTransform: 'uppercase',
            }}>
              Loading Universe {Math.round(rawProgress)}%
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
