import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as maath from 'maath/random'
import * as THREE from 'three'
import { useStore } from '../../store/useStore'

const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  attribute vec3 color;
  varying vec3 vColor;

  void main() {
    vColor = color;
    vec3 pos = position;

    // Apply continuous rotation in shader
    float angleX = uTime * 0.05;
    float angleY = uTime * 0.03;
    
    mat3 rotX = mat3(
      1.0, 0.0, 0.0,
      0.0, cos(angleX), -sin(angleX),
      0.0, sin(angleX), cos(angleX)
    );
    
    mat3 rotY = mat3(
      cos(angleY), 0.0, sin(angleY),
      0.0, 1.0, 0.0,
      -sin(angleY), 0.0, cos(angleY)
    );
    
    pos = rotY * rotX * pos;

    // Mouse Repulsion
    // Mouse coords are scaled roughly to match the 3D space
    vec2 scaledMouse = uMouse * 8.0;
    float dist = distance(pos.xy, scaledMouse);
    float repulsionRadius = 1.0;
    
    if (dist < repulsionRadius) {
      vec2 dir = normalize(pos.xy - scaledMouse);
      float strength = (repulsionRadius - dist) * 0.5;
      pos.xy += dir * strength;
    }

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // Size attenuation
    gl_PointSize = 40.0 * (1.0 / -mvPosition.z);
  }
`

const fragmentShader = `
  varying vec3 vColor;
  void main() {
    // Make particles circular
    vec2 xy = gl_PointCoord.xy - vec2(0.5);
    float ll = length(xy);
    if(ll > 0.5) discard;
    
    // Add soft glow edge
    float alpha = smoothstep(0.5, 0.1, ll) * 0.8;
    gl_FragColor = vec4(vColor, alpha);
  }
`

interface ParticleFieldProps {
  count?: number
}

export function ParticleField({ count = 5000 }: ParticleFieldProps) {
  const meshRef = useRef<THREE.Points>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    maath.inSphere(pos, { radius: 8 })

    const col = new Float32Array(count * 3)
    const cyan = new THREE.Color('#00F5FF')
    const violet = new THREE.Color('#7B2FBE')
    for (let i = 0; i < count; i++) {
      const y = pos[i * 3 + 1]
      const t = Math.max(0, Math.min(1, (y + 8) / 16))
      const mixed = cyan.clone().lerp(violet, t)
      col[i * 3] = mixed.r
      col[i * 3 + 1] = mixed.g
      col[i * 3 + 2] = mixed.b
    }

    return { positions: pos, colors: col }
  }, [count])

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) }
  }), [])

  useFrame((_, delta) => {
    const { mouseX, mouseY } = useStore.getState()

    // Scroll link removed to prevent jitter and maintain independent ambient motion
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += delta
      // Smoothly update mouse position for the shader
      materialRef.current.uniforms.uMouse.value.lerp(new THREE.Vector2(mouseX, mouseY), 0.1)
    }
  })

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <points ref={meshRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  )
}
