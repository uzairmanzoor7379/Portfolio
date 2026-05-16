import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLenis } from 'lenis/react'
import { useScrollProgress } from '../../hooks/useScrollProgress'
import { useStore } from '../../store/useStore'
import { useIsMobile } from '../../hooks/useMediaQuery'
import { MagneticButton } from './MagneticButton'

const NAV_LINKS = ['About', 'Skills', 'Projects', 'Experience', 'Contact']

export function Navbar() {
  const scrollProgress = useScrollProgress()
  const activeSection = useStore((s) => s.activeSection)
  const isMobile = useIsMobile()
  const [menuOpen, setMenuOpen] = useState(false)
  const lenis = useLenis()

  const scrollTo = (section: string) => {
    lenis?.scrollTo(`#${section.toLowerCase()}`, { duration: 1.2 })
    setMenuOpen(false)
  }

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0,
      height: 64, zIndex: 100,
      background: 'rgba(5,5,8,0.6)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border-subtle)',
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
    }}>
      {/* Monogram */}
      <span style={{
        fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem',
        color: 'var(--accent-cyan)', letterSpacing: '-0.02em',
        cursor: 'pointer', textShadow: '0 0 20px rgba(0,245,255,0.4)',
      }} onClick={() => lenis?.scrollTo(0)}>UM</span>

      {/* Desktop Nav Links */}
      {!isMobile && (
        <div style={{ display: 'flex', gap: '2rem' }}>
          {NAV_LINKS.map((link) => (
            <button
              key={link}
              onClick={() => scrollTo(link)}
              data-magnetic
              style={{
                background: 'none', border: 'none', cursor: 'none',
                fontFamily: 'var(--font-body)', fontSize: '0.75rem',
                letterSpacing: '0.15em', textTransform: 'uppercase',
                color: activeSection === link.toLowerCase() ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                transition: 'color 0.2s',
                position: 'relative',
                padding: '0.5rem 0',
              }}
            >
              {link}
              {activeSection === link.toLowerCase() && (
                <motion.div
                  layoutId="nav-underline"
                  style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    height: 1, background: 'var(--accent-cyan)',
                  }}
                />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Right: CV button + hamburger */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {!isMobile && <MagneticButton outlined>Download CV</MagneticButton>}
        {isMobile && (
          <button onClick={() => setMenuOpen(!menuOpen)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-primary)', fontSize: '1.4rem',
          }}>
            <span style={{ fontFamily: 'var(--font-body)', color: 'var(--accent-cyan)' }}>
              {menuOpen ? '✕' : '☰'}
            </span>
          </button>
        )}
      </div>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed', inset: 0, top: 64,
              background: 'rgba(5,5,8,0.97)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: '2rem',
              zIndex: 99,
            }}
          >
            {NAV_LINKS.map((link, i) => (
              <motion.button
                key={link}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                onClick={() => scrollTo(link)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '2rem',
                  color: 'var(--text-primary)', letterSpacing: '-0.02em',
                }}
              >
                {link}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll progress bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0,
        height: 1,
        width: `${scrollProgress * 100}%`,
        background: 'var(--accent-cyan)',
        transition: 'width 0.1s linear',
      }} />
    </nav>
  )
}
