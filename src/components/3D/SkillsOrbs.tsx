import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import { useStore } from '../../store/useStore'

const ORBS = [
  { label: 'React/Next',   color: '#61DAFB', orbitR: 2.5, speed: 0.4,  angle: 0 },
  { label: 'Node/Express', color: '#68A063', orbitR: 2.5, speed: 0.35, angle: Math.PI / 4 },
  { label: 'MongoDB',      color: '#47A248', orbitR: 3.2, speed: 0.3,  angle: Math.PI / 2 },
  { label: 'Socket.IO',    color: '#25C2A0', orbitR: 3.2, speed: 0.45, angle: (3 * Math.PI) / 4 },
  { label: 'GSAP/Three',   color: '#88CE02', orbitR: 2.8, speed: 0.25, angle: Math.PI },
  { label: 'Tailwind',     color: '#38BDF8', orbitR: 2.8, speed: 0.5,  angle: (5 * Math.PI) / 4 },
  { label: 'Redis/JWT',    color: '#FF4438', orbitR: 3.5, speed: 0.38, angle: (3 * Math.PI) / 2 },
  { label: 'Git/GitHub',   color: '#F05032', orbitR: 3.5, speed: 0.28, angle: (7 * Math.PI) / 4 },
]

export function SkillsOrbs() {
  const refs = useRef<(THREE.Mesh | null)[]>([])
  const time = useRef(0)

  useFrame((_, delta) => {
    time.current += delta
    
    // Performance optimization: Read scroll directly from store
    const state = useStore.getState()
    const rawProgress = state.scrollProgress
    const sectionSkillsProgress = Math.min(1, Math.max(0, (rawProgress - 0.25) * 8))

    const speed = 0.3 + sectionSkillsProgress * 1.2

    ORBS.forEach((orb, i) => {
      const mesh = refs.current[i]
      if (!mesh) return
      const angle = orb.angle + time.current * orb.speed * speed
      
      // Position damping
      const targetX = Math.cos(angle) * orb.orbitR
      const targetZ = Math.sin(angle) * orb.orbitR * 0.4
      const targetY = Math.sin(angle * 0.5) * 0.4
      
      mesh.position.x = THREE.MathUtils.damp(mesh.position.x, targetX, 3.5, delta)
      mesh.position.z = THREE.MathUtils.damp(mesh.position.z, targetZ, 3.5, delta)
      mesh.position.y = THREE.MathUtils.damp(mesh.position.y, targetY, 3.5, delta)
      
      mesh.rotation.y += delta * 0.5
    })
  })

  return (
    <group>
      {ORBS.map((orb, i) => (
        <mesh
          key={orb.label}
          ref={(el) => { refs.current[i] = el }}
          onPointerEnter={(e) => {
            e.stopPropagation()
            const mesh = refs.current[i]
            if (!mesh) return
            mesh.userData.originalZ = mesh.position.z
            gsap.to(mesh.position, {
              z: (mesh.userData.originalZ as number) + 1.5,
              duration: 0.4,
              ease: 'back.out(2)',
            })
            const mat = mesh.material as THREE.MeshStandardMaterial
            gsap.to(mat, { emissiveIntensity: 1.5, duration: 0.3 })
          }}
          onPointerLeave={() => {
            const mesh = refs.current[i]
            if (!mesh) return
            gsap.to(mesh.position, {
              z: (mesh.userData.originalZ as number) ?? 0,
              duration: 0.6,
              ease: 'elastic.out(1, 0.4)',
            })
            const mat = mesh.material as THREE.MeshStandardMaterial
            gsap.to(mat, { emissiveIntensity: 0.2, duration: 0.3 })
          }}
        >
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial
            color={orb.color}
            emissive={orb.color}
            emissiveIntensity={0.2}
            metalness={0.7}
            roughness={0.2}
          />
        </mesh>
      ))}
      {/* Central hub glow */}
      <mesh>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial
          color="#00F5FF"
          emissive="#00F5FF"
          emissiveIntensity={0.8}
          metalness={0.9}
          roughness={0}
        />
      </mesh>
    </group>
  )
}
