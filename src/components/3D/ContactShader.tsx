import { Sparkles } from '@react-three/drei'
import { useStore } from '../../store/useStore'


export function ContactShader() {
  const formSuccess = useStore((s) => s.formSuccess)

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
