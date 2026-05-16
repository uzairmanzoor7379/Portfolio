import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '../../store/useStore'

export function ProjectCarousel3D() {
  const meshRefs = useRef<(THREE.Mesh | null)[]>([])
  const groupRef = useRef<THREE.Group>(null)
  const lightRefs = useRef<(THREE.PointLight | null)[]>([])

  const [sirpTex, jobPortalTex] = useTexture([
    '/textures/project-sirp.png',
    '/textures/project-jobportal.png',
  ])

  useMemo(() => {
    sirpTex.colorSpace = THREE.SRGBColorSpace
    jobPortalTex.colorSpace = THREE.SRGBColorSpace
  }, [sirpTex, jobPortalTex])

  const STATIONS = useMemo(
    () => [
      {
        position: [-3.5, 0.3, -0.5] as [number, number, number],
        color: '#00F5FF',
        id: 'sirp',
        tex: sirpTex,
        baseRotationY: 0.08,
      },
      {
        position: [3.5, -0.2, -0.5] as [number, number, number],
        color: '#FF6B35',
        id: 'jobportal',
        tex: jobPortalTex,
        baseRotationY: -0.08,
      },
    ],
    [sirpTex, jobPortalTex]
  )

  useFrame((state, delta) => {
    const { mouseX, activeProjectIndex, scrollProgress: rawProgress } = useStore.getState()
    const sectionProjectsProgress = Math.min(1, Math.max(0, (rawProgress - 0.4) * 5))

    if (!groupRef.current) return

    // Gentle ambient drift
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.04
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.015

    // Scroll-driven depth push with soft damping
    const targetZ = -sectionProjectsProgress * 1.5
    groupRef.current.position.z = THREE.MathUtils.damp(groupRef.current.position.z, targetZ, 3, delta)

    STATIONS.forEach((station, i) => {
      const mesh = meshRefs.current[i]
      const light = lightRefs.current[i]
      if (!mesh) return

      const isActive = i === activeProjectIndex

      const targetScale = isActive ? 1.08 : 0.72
      mesh.scale.setScalar(THREE.MathUtils.damp(mesh.scale.x, targetScale, 3.5, delta))

      const mat = mesh.material as THREE.MeshStandardMaterial
      const targetEmissive = isActive ? 0.25 : 0.04
      mat.emissiveIntensity = THREE.MathUtils.damp(mat.emissiveIntensity, targetEmissive, 3.5, delta)

      if (isActive) {
        mesh.rotation.y = THREE.MathUtils.damp(mesh.rotation.y, mouseX * 0.08 + station.baseRotationY, 3.5, delta)
        mesh.rotation.x = THREE.MathUtils.damp(mesh.rotation.x, -0.03, 3.5, delta)
      } else {
        mesh.rotation.y = THREE.MathUtils.damp(mesh.rotation.y, station.baseRotationY, 3, delta)
        mesh.rotation.x = THREE.MathUtils.damp(mesh.rotation.x, 0, 3, delta)
      }

      if (light) {
        const targetIntensity = isActive ? 3.5 : 0.4
        light.intensity = THREE.MathUtils.damp(light.intensity, targetIntensity, 3.5, delta)
      }
    })
  })

  return (
    <group ref={groupRef}>
      {STATIONS.map((station, i) => (
        <group key={station.id}>
          <mesh
            ref={(el) => {
              meshRefs.current[i] = el
            }}
            position={station.position}
            visible={false}
          >
            <planeGeometry args={[4.0, 2.5]} />
            <meshStandardMaterial
              map={station.tex}
              color={0xffffff}
              emissive={new THREE.Color(station.color)}
              emissiveIntensity={0.0}
              metalness={0.12}
              roughness={0.55}
              side={THREE.DoubleSide}
              transparent
              opacity={0.0} 
            />
          </mesh>
          <pointLight
            ref={(el) => {
              lightRefs.current[i] = el
            }}
            color={station.color}
            intensity={0}
            distance={12}
            decay={2}
            position={[
              station.position[0],
              station.position[1] + 1.5,
              station.position[2] + 2,
            ]}
          />
          <pointLight
            color={station.color}
            intensity={0}
            distance={8}
            decay={2}
            position={[
              station.position[0],
              station.position[1] - 2,
              station.position[2] + 1,
            ]}
          />
        </group>
      ))}
    </group>
  )
}