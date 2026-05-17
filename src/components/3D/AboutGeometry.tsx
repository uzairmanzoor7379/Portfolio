import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '../../store/useStore'

export function AboutGeometry() {
  const groupRef = useRef<THREE.Group>(null)
  const pointsRef = useRef<THREE.Points>(null)
  const linesRef = useRef<THREE.LineSegments>(null)
  const { viewport, mouse } = useThree()

  const particleCount = 100
  const maxDistance = 2.8

  // Initialize particles with positions and velocities
  const [particles] = useMemo(() => {
    const data = []
    for (let i = 0; i < particleCount; i++) {
      data.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 8
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01
        ),
        originalPos: new THREE.Vector3()
      })
    }
    return [data]
  }, [])

  const lineGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(particleCount * particleCount * 6), 3))
    geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(particleCount * particleCount * 6), 3))
    return geo
  }, [])

  useFrame((_, delta) => {
    if (!groupRef.current || !pointsRef.current || !linesRef.current) return

    // Read scrollY from store
    const state = useStore.getState()
    const scrollY = state.scrollY
    const viewportHeight = window.innerHeight
    const aboutProgress = Math.max(0, Math.min(1, scrollY / viewportHeight))

    const pointsAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute
    const pointsArr = pointsAttr.array as Float32Array
    const linesAttr = linesRef.current.geometry.attributes.position as THREE.BufferAttribute
    const linesArr = linesAttr.array as Float32Array
    const linesColorAttr = linesRef.current.geometry.attributes.color as THREE.BufferAttribute
    const linesColorArr = linesColorAttr.array as Float32Array

    // Convert mouse to 3D world space
    const mouseVector = new THREE.Vector3(
      (mouse.x * viewport.width) / 2,
      (mouse.y * viewport.height) / 2,
      2
    )

    let lineIndex = 0

    particles.forEach((p, i) => {
      // Basic movement
      p.position.add(p.velocity)

      // Bounding volume check (soft bounce)
      const bounds = 4
      if (Math.abs(p.position.x) > bounds) p.velocity.x *= -1
      if (Math.abs(p.position.y) > bounds) p.velocity.y *= -1
      if (Math.abs(p.position.z) > bounds) p.velocity.z *= -1

      // Mouse Repulsion
      const distToMouse = p.position.distanceTo(mouseVector)
      if (distToMouse < 2) {
        const dir = new THREE.Vector3().subVectors(p.position, mouseVector).normalize()
        const force = (2 - distToMouse) * 0.02
        p.position.add(dir.multiplyScalar(force))
      }

      pointsArr[i * 3] = p.position.x
      pointsArr[i * 3 + 1] = p.position.y
      pointsArr[i * 3 + 2] = p.position.z
    })

    // Update lines
    for (let i = 0; i < particleCount; i++) {
      for (let j = i + 1; j < particleCount; j++) {
        const dist = particles[i].position.distanceTo(particles[j].position)

        if (dist < maxDistance) {
          const alpha = 1 - dist / maxDistance

          // Line positions
          linesArr[lineIndex * 3] = particles[i].position.x
          linesArr[lineIndex * 3 + 1] = particles[i].position.y
          linesArr[lineIndex * 3 + 2] = particles[i].position.z
          linesArr[(lineIndex + 1) * 3] = particles[j].position.x
          linesArr[(lineIndex + 1) * 3 + 1] = particles[j].position.y
          linesArr[(lineIndex + 1) * 3 + 2] = particles[j].position.z

          // Line colors (electric blue)
          const mixColor = new THREE.Color('#00F5FF')

          linesColorArr[lineIndex * 3] = mixColor.r * alpha
          linesColorArr[lineIndex * 3 + 1] = mixColor.g * alpha
          linesColorArr[lineIndex * 3 + 2] = mixColor.b * alpha
          linesColorArr[(lineIndex + 1) * 3] = mixColor.r * alpha
          linesColorArr[(lineIndex + 1) * 3 + 1] = mixColor.g * alpha
          linesColorArr[(lineIndex + 1) * 3 + 2] = mixColor.b * alpha

          lineIndex += 2
        }
      }
    }

    pointsAttr.needsUpdate = true
    linesAttr.needsUpdate = true
    linesColorAttr.needsUpdate = true
    linesRef.current.geometry.setDrawRange(0, lineIndex)

    // Entry and rotation with soft damping
    // Scale up neurons sequentially after text disappears (progress > 0.40)
    let targetScale = 0
    if (aboutProgress > 0.40) {
      targetScale = Math.min(1, (aboutProgress - 0.40) / 0.60)
    }
    groupRef.current.scale.setScalar(THREE.MathUtils.damp(groupRef.current.scale.x, targetScale, 4, delta))
    groupRef.current.rotation.y += 0.001

    // Maintain consistent target position at its origin
    groupRef.current.position.x = THREE.MathUtils.damp(groupRef.current.position.x, 0, 3, delta)

    // Hide the group completely when scale is near 0 to prevent the "glowing dot" artifact
    if (groupRef.current.scale.x < 0.01) {
      groupRef.current.visible = false
    } else {
      groupRef.current.visible = true
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(particleCount * 3), 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.12}
          color="#00F5FF"
          transparent
          opacity={0.9}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      <lineSegments ref={linesRef} geometry={lineGeometry}>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.18}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      <pointLight position={[2, 2, 2]} intensity={1.5} color="#00F5FF" />
      <pointLight position={[-2, -2, 2]} intensity={1} color="#00F5FF" />
    </group>
  )
}
