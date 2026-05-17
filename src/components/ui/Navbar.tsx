import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLenis } from 'lenis/react'
import { useScrollProgress } from '../../hooks/useScrollProgress'
import { useStore } from '../../store/useStore'
import { useIsMobile } from '../../hooks/useMediaQuery'
import { MagneticButton } from './MagneticButton'

const NAV_LINKS = ['About', 'Skills', 'Projects', 'Experience', 'Education', 'Contact']

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
      {/* Monogram / SVG Logo */}
      <div 
        onClick={() => lenis?.scrollTo(0)} 
        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
      >
        <svg 
          width="84" 
          height="45" 
          viewBox="0 0 700 365" 
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: 'block' }}
        >
          <defs>
            {/* Glow for orange dot */}
            <filter id="softglow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="6" result="blur"/>
              <feComposite in="SourceGraphic" in2="blur" operator="over"/>
            </filter>
          </defs>

          {/* U */}
          <rect x="160" y="82" width="18" height="130" fill="#FFFFFF" rx="2"/>
          <rect x="262" y="82" width="18" height="130" fill="#FFFFFF" rx="2"/>

          <path
            d="M160 200 Q160 250 220 250 Q280 250 280 200"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="18"
            strokeLinecap="round"
          />

          {/* M */}
          <rect x="330" y="82" width="18" height="195" fill="#FFFFFF" rx="2"/>

          <path
            d="M330 82 L430 178 L530 82"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="18"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <rect x="530" y="82" width="18" height="195" fill="#FFFFFF" rx="2"/>

          {/* Orange Dot */}
          <circle
            cx="580"
            cy="92"
            r="12"
            fill="#00F5FF"
            filter="url(#softglow)"
          />

          {/* Bottom Line */}
          <line
            x1="170"
            y1="310"
            x2="520"
            y2="310"
            stroke="#00F5FF"
            strokeWidth="12"
            opacity="1.0"
          />
        </svg>
      </div>

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
                  transition={{ type: "tween", ease: [0.16, 1, 0.3, 1], duration: 0.5 }}
                  style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    height: 1, background: 'var(--accent-cyan)',
                    boxShadow: '0 0 8px var(--accent-cyan)'
                  }}
                />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Right: CV button + hamburger */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {!isMobile && (
          <MagneticButton
            outlined
            onClick={() => {
              const link = document.createElement('a')
              link.href = '/Uzair_Manzoor_Resume_ATS.pdf'
              link.download = 'Uzair_Manzoor_Resume.pdf'
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
            }}
          >
            Download CV
          </MagneticButton>
        )}
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
