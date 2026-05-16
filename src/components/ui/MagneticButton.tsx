import { useRef, useEffect } from 'react'
import gsap from 'gsap'

interface MagneticButtonProps {
  children: React.ReactNode
  onClick?: () => void
  outlined?: boolean
  loading?: boolean
}

const MAGNETIC_AREA = 80 // px radius — EXACT from system prompt

export function MagneticButton({ children, onClick, outlined = false, loading = false }: MagneticButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const btn = btnRef.current
    if (!btn) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect()
      const btnCenterX = rect.left + rect.width / 2
      const btnCenterY = rect.top + rect.height / 2
      const distX = e.clientX - btnCenterX
      const distY = e.clientY - btnCenterY
      const dist = Math.sqrt(distX ** 2 + distY ** 2)

      if (dist < MAGNETIC_AREA) {
        const strength = (MAGNETIC_AREA - dist) / MAGNETIC_AREA
        gsap.to(btn, {
          x: distX * strength * 0.4,
          y: distY * strength * 0.4,
          duration: 0.3,
          ease: 'power2.out',
        })
      } else {
        gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <button
      ref={btnRef}
      data-magnetic
      onClick={onClick}
      disabled={loading}
      style={{
        padding: '0.75rem 2rem',
        fontFamily: 'var(--font-body)',
        fontSize: '0.8rem',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        cursor: loading ? 'not-allowed' : 'none',
        background: outlined ? 'transparent' : 'var(--accent-cyan)',
        color: outlined ? 'var(--accent-cyan)' : 'var(--bg-base)',
        border: outlined ? '1px solid var(--border-glow)' : '1px solid var(--accent-cyan)',
        borderRadius: '4px',
        opacity: loading ? 0.7 : 1,
        boxShadow: outlined ? 'none' : 'var(--glow-cyan)',
        transition: 'opacity 0.2s',
      }}
    >
      {children}
    </button>
  )
}
