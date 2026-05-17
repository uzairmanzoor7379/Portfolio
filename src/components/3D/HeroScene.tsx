import { useRef, useLayoutEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text3D, Float, Center } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import { useStore } from '../../store/useStore'

export function HeroScene() {
  const lightRef = useRef<THREE.PointLight>(null)
  const localGroupRef = useRef<THREE.Group>(null)

  const isLoaded = useStore((s) => s.isLoaded)
  const introFinished = useRef(false)

  useLayoutEffect(() => {
    if (isLoaded && !introFinished.current && localGroupRef.current) {
      gsap.fromTo(localGroupRef.current.position,
        { z: 15, x: 0, y: 0 },
        {
          z: 0,
          duration: 3,
          ease: "power4.out",
          onComplete: () => { introFinished.current = true }
        }
      )
      gsap.fromTo(localGroupRef.current.rotation,
        { x: -Math.PI / 3 },
        { x: 0, duration: 2.5, ease: "power3.out" }
      )
    }
  }, [isLoaded])

  useFrame((_, delta) => {
    const { mouseX, mouseY } = useStore.getState()
    if (!localGroupRef.current || !isLoaded) return

    // Parallax and scroll movement (only fully active after intro)
    const parallaxFactor = introFinished.current ? 1 : 0.1

    // Move group based on mouse with soft organic damping
    localGroupRef.current.position.x = THREE.MathUtils.damp(localGroupRef.current.position.x, -mouseX * 0.5 * parallaxFactor, 2.5, delta)
    localGroupRef.current.position.y = THREE.MathUtils.damp(localGroupRef.current.position.y, -mouseY * 0.3 * parallaxFactor, 2.5, delta)

    // Push group away on scroll and fade out sequentially
    if (introFinished.current) {
      const { scrollY } = useStore.getState()
      const viewportHeight = window.innerHeight
      const aboutProgress = Math.max(0, Math.min(1, scrollY / viewportHeight))
      
      // "jaise text arh h waise hi gyb ho bhr hi trf hi"
      // Text stays fully stable until aboutProgress is 0.15
      // Then flies outwards slowly. Camera is at z:5, so it vanishes at z:6.
      // We stretch this over a 30% scroll range (0.15 to 0.45) for a slower, majestic effect.
      let heroZ = 0
      if (aboutProgress > 0.15) {
        const progressRatio = Math.min(1, (aboutProgress - 0.15) / 0.30)
        heroZ = progressRatio * 6
      }
      
      localGroupRef.current.position.z = THREE.MathUtils.damp(localGroupRef.current.position.z, heroZ, 5, delta)
      // Keep scale at 1, let it fly past the camera naturally
      localGroupRef.current.scale.setScalar(THREE.MathUtils.damp(localGroupRef.current.scale.x, 1, 5, delta))
    }

    // Point light follows mouse with snappy damping
    if (lightRef.current) {
      lightRef.current.position.x = THREE.MathUtils.damp(lightRef.current.position.x, mouseX * 3, 5, delta)
      lightRef.current.position.y = THREE.MathUtils.damp(lightRef.current.position.y, mouseY * 3, 5, delta)
    }
  })

  return (
    <group ref={localGroupRef}>
      <pointLight ref={lightRef} color="#00F5FF" intensity={3} position={[0, 0, 3]} />
      <ambientLight intensity={0.1} />
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
        <Center position={[0, 0.8, 0]}>
          <Text3D
            font="/fonts/helvetiker_regular.typeface.json"
            size={1.5}
            height={0.2}
            curveSegments={12}
          >
            UZAIR
            <meshStandardMaterial
              color="#00F5FF"
              metalness={0.9}
              roughness={0.1}
            />
          </Text3D>
        </Center>
        <Center position={[0, -1.0, 0]}>
          <Text3D
            font="/fonts/helvetiker_regular.typeface.json"
            size={1.5}
            height={0.2}
            curveSegments={12}
          >
            MANZOOR
            <meshStandardMaterial
              color="#00F5FF"
              metalness={0.9}
              roughness={0.1}
            />
          </Text3D>
        </Center>
      </Float>
    </group>
  )
}
