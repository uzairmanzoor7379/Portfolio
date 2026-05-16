import { ReactLenis } from 'lenis/react'
import type { LenisRef } from 'lenis/react'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import TextPlugin from 'gsap/TextPlugin'

// Register ALL GSAP plugins here — do it once, globally
gsap.registerPlugin(ScrollTrigger, TextPlugin)

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<LenisRef>(null)

  useEffect(() => {
    // GSAP drives the RAF loop — NOT Lenis
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000)
    }
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)

    // CRITICAL: Sync ScrollTrigger with Lenis scroll events
    const lenis = lenisRef.current?.lenis
    if (lenis) {
      lenis.on('scroll', () => {
        ScrollTrigger.update()
      })
    }

    return () => {
      gsap.ticker.remove(update)
      if (lenis) lenis.off('scroll', ScrollTrigger.update)
    }
  }, [])

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        autoRaf: false,
        lerp: 0.07,
        duration: 1.5,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1.1,
        touchMultiplier: 1.5,
      }}
    >
      {children}
    </ReactLenis>
  )
}
