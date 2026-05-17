import { ReactLenis } from 'lenis/react'
import type { LenisRef } from 'lenis/react'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import TextPlugin from 'gsap/TextPlugin'

// Register ALL GSAP plugins here — do it once, globally
gsap.registerPlugin(ScrollTrigger, TextPlugin)

// Optimize GSAP for mobile and high-performance scroll
ScrollTrigger.config({ ignoreMobileResize: true })
// ScrollTrigger.normalizeScroll(true) — Removed because it causes jitter in Three.js backgrounds

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<LenisRef>(null)

  useEffect(() => {
    let lenisInitialized = false

    // GSAP drives the RAF loop — NOT Lenis
    function update(time: number) {
      const lenis = lenisRef.current?.lenis
      if (lenis) {
        lenis.raf(time * 1000)

        // Initialize scrollerProxy once lenis is fully instantiated
        if (!lenisInitialized) {
          lenisInitialized = true

          // Tell ScrollTrigger to use Lenis's scroll position
          ScrollTrigger.scrollerProxy(document.body, {
            scrollTop(value) {
              if (arguments.length && value !== undefined) {
                lenis.scrollTo(value, { immediate: true })
              }
              return lenis.scroll
            },
            getBoundingClientRect() {
              return {
                top: 0,
                left: 0,
                width: window.innerWidth,
                height: window.innerHeight,
              }
            },
            pinType: document.body.style.transform ? 'transform' : 'fixed',
          })

          // Update ScrollTrigger on scroll
          lenis.on('scroll', ScrollTrigger.update)
        }
      }
    }

    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(update)
      lenisRef.current?.lenis?.off('scroll', ScrollTrigger.update)
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
