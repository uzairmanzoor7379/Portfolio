import { useLayoutEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { portfolioData } from '../../data/portfolioData'

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to('.hero-content', {
        opacity: 0, y: -30,
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: '30% top',
          scrub: true,
        }
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="hero"
      ref={sectionRef}
      style={{
        height: '100vh', position: 'relative',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}
    >
      <h1 className="sr-only">{portfolioData.personal.name}</h1>

      <div className="hero-content" style={{ 
        textAlign: 'center', 
        position: 'absolute', 
        top: '75%', // Moving up slightly to give room to Scroll text
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.2rem'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{
            padding: '0.5rem 1.5rem',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '100px',
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(10px)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            color: 'var(--accent-cyan)',
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
          }}
        >
          {portfolioData.personal.title}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.9, ease: [0.16, 1, 0.3, 1] as const }}
          style={{
            padding: '0.6rem 1.4rem',
            border: '1px solid rgba(0, 245, 255, 0.2)',
            borderRadius: '100px',
            background: 'rgba(0, 245, 255, 0.05)',
            backdropFilter: 'blur(12px)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            color: 'var(--text-primary)',
            letterSpacing: '0.05em',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            📍 {portfolioData.personal.location}
          </span>
          <span style={{ width: '1px', height: '12px', background: 'rgba(255,255,255,0.2)' }} />
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-cyan)' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-cyan)', boxShadow: '0 0 8px var(--accent-cyan)' }} />
            Open for Work
          </span>
        </motion.div>
      </div>

      <div
        className="animate-bounce"
        style={{
          position: 'absolute', bottom: '1rem', // Pushing further down
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem'
        }}
      >
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-secondary)', letterSpacing: '0.2em' }}>SCROLL</p>
        <div style={{ width: '1px', height: '40px', background: 'linear-gradient(to bottom, var(--accent-cyan), transparent)' }} />
      </div>
    </section>
  )
}
