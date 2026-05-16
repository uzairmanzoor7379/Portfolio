import {
  EffectComposer,
  Bloom,
  Vignette,
  Noise,
  SMAA
} from '@react-three/postprocessing'
import { useIsMobile, useIsTablet } from '../../hooks/useMediaQuery'

export function PostProcessing() {
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()

  if (isMobile) return null

  return (
    <EffectComposer multisampling={0}>
      <Bloom
        luminanceThreshold={0.6}
        luminanceSmoothing={0.9}
        intensity={isTablet ? 0.6 : 0.8}
        radius={isTablet ? 0.3 : 0.4}
      />
      {!isTablet ? <SMAA /> : <></>}
      <Vignette eskil={false} offset={0.3} darkness={0.8} />
      {!isTablet ? <Noise opacity={0.02} /> : <></>}
    </EffectComposer>
  )
}
