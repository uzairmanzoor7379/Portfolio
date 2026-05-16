import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useStore } from '../../store/useStore'
import { useIsMobile } from '../../hooks/useMediaQuery'

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()
  const [showClickLabel, setShowClickLabel] = useState(false)

  useEffect(() => {
    if (isMobile) return

    const dot = dotRef.current!
    const ring = ringRef.current!
    let rafId: number

    // Ring lerp state
    let ringX = 0, ringY = 0

    const moveDot = (e: MouseEvent) => {
      gsap.set(dot, { x: e.clientX - 4, y: e.clientY - 4 })
    }

    const animateRing = () => {
      const { mouseRawX: mx, mouseRawY: my } = useStore.getState()
      ringX += (mx - ringX - 16) * 0.12
      ringY += (my - ringY - 16) * 0.12
      gsap.set(ring, { x: ringX, y: ringY })
      rafId = requestAnimationFrame(animateRing)
    }

    window.addEventListener('mousemove', moveDot, { passive: true })
    rafId = requestAnimationFrame(animateRing)

    // STATE 2: Over link — ring expands, dot disappears, blend mode difference
    const handleLinkEnter = () => {
      setShowClickLabel(false)
      gsap.to(ring, { width: 60, height: 60, borderColor: 'rgba(0,245,255,0.6)', duration: 0.3, ease: 'power2.out' })
      gsap.to(dot, { scale: 0, opacity: 0, duration: 0.2 })
      ring.style.mixBlendMode = 'difference'
    }

    // STATE 3: Over button — ring fills cyan 20%, "CLICK" label appears
    const handleButtonEnter = () => {
      setShowClickLabel(true)
      gsap.to(ring, {
        width: 56, height: 56,
        backgroundColor: 'rgba(0,245,255,0.2)',
        borderColor: 'rgba(0,245,255,0.8)',
        duration: 0.3, ease: 'power2.out'
      })
      gsap.to(dot, { scale: 0.5, opacity: 1, duration: 0.2 })
      ring.style.mixBlendMode = 'normal'
    }

    // STATE 1: Default — reset all
    const handleLeave = () => {
      setShowClickLabel(false)
      gsap.to(ring, {
        width: 32, height: 32,
        borderColor: 'rgba(0,245,255,0.6)',
        backgroundColor: 'transparent',
        duration: 0.3, ease: 'power2.out'
      })
      gsap.to(dot, { scale: 1, opacity: 1, duration: 0.2 })
      ring.style.mixBlendMode = 'normal'
    }

    // STATE 5: Clicking — spring snap
    const handleMouseDown = () => {
      gsap.to(ring, { scale: 0.8, duration: 0.1, ease: 'power2.out' })
    }
    const handleMouseUp = () => {
      gsap.to(ring, { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.4)' })
    }

    // Attach to all interactive elements
    const attachListeners = () => {
      const links = document.querySelectorAll('a')
      const buttons = document.querySelectorAll('button, [data-magnetic]')

      links.forEach(el => {
        el.addEventListener('mouseenter', handleLinkEnter)
        el.addEventListener('mouseleave', handleLeave)
      })
      buttons.forEach(el => {
        el.addEventListener('mouseenter', handleButtonEnter)
        el.addEventListener('mouseleave', handleLeave)
      })
    }

    // Re-attach on DOM changes (lazy-loaded sections)
    attachListeners()
    const observer = new MutationObserver(() => attachListeners())
    observer.observe(document.body, { childList: true, subtree: true })

    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', moveDot)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      cancelAnimationFrame(rafId)
      observer.disconnect()
    }
  }, [isMobile])

  if (isMobile) return null

  return (
    <>
      <div
        ref={dotRef}
        style={{
          position: 'fixed', top: 0, left: 0,
          width: 8, height: 8,
          background: 'var(--accent-cyan)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9999,
        }}
      />
      <div
        ref={ringRef}
        style={{
          position: 'fixed', top: 0, left: 0,
          width: 32, height: 32,
          border: '1.5px solid rgba(0,245,255,0.6)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {showClickLabel && (
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '7px',
              color: 'var(--accent-cyan)',
              letterSpacing: '0.05em',
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          >
            CLICK
          </span>
        )}
      </div>
    </>
  )
}
