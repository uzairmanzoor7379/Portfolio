//Scene.tsx
import { Canvas } from '@react-three/fiber'
import { Preload, AdaptiveDpr, PerformanceMonitor, Environment } from '@react-three/drei'
import { Suspense, useRef } from 'react'
import { useIsMobile } from '../../hooks/useMediaQuery'
import { useStore } from '../../store/useStore'
import { ParticleField } from './ParticleField'
import { HeroScene } from './HeroScene'
import { AboutGeometry } from './AboutGeometry'
import { SkillsOrbs } from './SkillsOrbs'
import { ProjectCarousel3D } from './ProjectCarousel3D'
import { ContactShader } from './ContactShader'
import { PostProcessing } from './PostProcessing'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

function SectionWrapper({ children, isActive, disableScale = false, position = [0, 0, 0] }: { children: React.ReactNode, isActive: boolean, disableScale?: boolean, position?: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null)
  const activeTime = useRef(0)
  useFrame((_, delta) => {
    if (!groupRef.current) return
    if (isActive) {
      activeTime.current += delta
    } else {
      activeTime.current = 0
    }

    let targetScale = 0
    if (disableScale) {
      targetScale = 1
    } else if (isActive && activeTime.current > 0.4) {
      // 0.4s delay before entering to create a clean gap
      targetScale = 1
    }
    // Fast exit (10), Normal entry (4) for a snappy clear out
    const dampSpeed = isActive ? 4 : 10
    const currentScale = groupRef.current.scale.x
    const smoothedScale = THREE.MathUtils.damp(currentScale, targetScale, dampSpeed, delta)
    groupRef.current.scale.setScalar(smoothedScale)
    // Visibility toggle to save draw calls
    if (groupRef.current.scale.x < 0.01 && !disableScale) {
      groupRef.current.visible = false
    } else {
      groupRef.current.visible = true
    }
  })

  return <group ref={groupRef} position={new THREE.Vector3(...position)}>{children}</group>
}

function SectionManager() {
  const activeSection = useStore((s) => s.activeSection)
  const isProjectsActive = useStore((s) => s.isProjectsActive)

  return (
    <>
      <ParticleField count={5000} />

      <SectionWrapper isActive={activeSection === 'hero'} disableScale={true}>
        <HeroScene />
      </SectionWrapper>

      <SectionWrapper isActive={activeSection === 'about'} position={[-2.8, 0, 0]}>
        <AboutGeometry />
      </SectionWrapper>

      <SectionWrapper isActive={activeSection === 'skills'}>
        <SkillsOrbs />
      </SectionWrapper>

      <SectionWrapper isActive={activeSection === 'projects' || (activeSection === 'projects' && isProjectsActive)}>
        <ProjectCarousel3D />
      </SectionWrapper>

      <SectionWrapper isActive={activeSection === 'experience'}>
        {null}
      </SectionWrapper>

      <SectionWrapper isActive={activeSection === 'contact'}>
        <ContactShader />
      </SectionWrapper>
    </>
  )
}

export function Scene() {
  const isMobile = useIsMobile()

  return (
    <Canvas
      dpr={[1, 1.5]} // Stable DPR range — avoids jitter during resolution shifts
      camera={{ fov: 75, near: 0.1, far: 100, position: [0, 0, 5] }}
      gl={{
        antialias: !isMobile,
        alpha: true,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
      }}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100vw', height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    >
      <PerformanceMonitor />
      <AdaptiveDpr pixelated />

      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} castShadow />
      <Environment preset="night" />

      <Suspense fallback={null}>
        <SectionManager />
      </Suspense>

      <PostProcessing />

      <Preload all />
    </Canvas>
  )
}
