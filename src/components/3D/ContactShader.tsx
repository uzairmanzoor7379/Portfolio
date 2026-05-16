import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '../../store/useStore'


export function ContactShader() {
  const matRef = useRef<THREE.ShaderMaterial>(null)
  const formSuccess = useStore((s) => s.formSuccess)

  useFrame((_, delta) => {
    if (!matRef.current) return
    matRef.current.uniforms.uTime.value += delta
    const { mouseX, mouseY } = useStore.getState()
    matRef.current.uniforms.uMouse.value.set(mouseX, mouseY)
  })

  return (
    <>
      {/* Sparkles on form submit success */}
      {formSuccess && (
        <Sparkles
          count={60}
          scale={[6, 6, 6]}
          size={2}
          speed={0.5}
          opacity={0.8}
          color="#00F5FF"
          position={[0, 0, 0]}
        />
      )}
    </>
  )
}
