//Scene.tsx
import { Canvas } from '@react-three/fiber'
import { Preload, AdaptiveDpr, PerformanceMonitor, Environment } from '@react-three/drei'
import { Suspense, useState, useRef } from 'react'
import { useIsMobile } from '../../hooks/useMediaQuery'
import { useStore } from '../../store/useStore'
import { ParticleField } from './ParticleField'
import { HeroScene } from './HeroScene'
import { AboutGeometry } from './AboutGeometry'
import { SkillsOrbs } from './SkillsOrbs'
import { ProjectCarousel3D } from './ProjectCarousel3D'
import { ExperienceScene } from './ExperienceScene'
import { ContactShader } from './ContactShader'
import { PostProcessing } from './PostProcessing'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

function SectionWrapper({ children, isActive }: { children: React.ReactNode, isActive: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame((_, delta) => {
    if (!groupRef.current) return
    const targetScale = isActive ? 1 : 0
    
    // Soft, organic damping for the "buttery" scaling effect
    const currentScale = groupRef.current.scale.x
    const smoothedScale = THREE.MathUtils.damp(currentScale, targetScale, 4, delta)
    groupRef.current.scale.setScalar(smoothedScale)
    
    // Visibility toggle to save draw calls
    if (groupRef.current.scale.x < 0.01) {
      groupRef.current.visible = false
    } else {
      groupRef.current.visible = true
    }
  })

  return <group ref={groupRef}>{children}</group>
}

function SectionManager() {
  const activeSection = useStore((s) => s.activeSection)
  const isProjectsActive = useStore((s) => s.isProjectsActive)

  return (
    <>
      <ParticleField count={5000} />

      <SectionWrapper isActive={activeSection === 'hero'}>
        <HeroScene />
      </SectionWrapper>

      <SectionWrapper isActive={activeSection === 'about'}>
        <AboutGeometry />
      </SectionWrapper>

      <SectionWrapper isActive={activeSection === 'skills'}>
        <SkillsOrbs />
      </SectionWrapper>

      <SectionWrapper isActive={activeSection === 'projects' || (activeSection === 'projects' && isProjectsActive)}>
        <ProjectCarousel3D />
      </SectionWrapper>

      <SectionWrapper isActive={activeSection === 'experience'}>
        <ExperienceScene />
      </SectionWrapper>

      <SectionWrapper isActive={activeSection === 'contact'}>
        <ContactShader />
      </SectionWrapper>
    </>
  )
}

export function Scene() {
  const [, setDpr] = useState(Math.min(1.5, window.devicePixelRatio))
  const isMobile = useIsMobile()

  return (
    <Canvas
      dpr={[1, Math.min(2, window.devicePixelRatio)]}
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
      <PerformanceMonitor
        onDecline={() => setDpr(1)}
        onIncline={() => setDpr(Math.min(1.5, window.devicePixelRatio))}
      />
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
