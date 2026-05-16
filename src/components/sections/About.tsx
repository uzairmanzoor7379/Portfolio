import { useLayoutEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { portfolioData } from '../../data/portfolioData'
import { MagneticButton } from '../ui/MagneticButton'
import { useLenis } from 'lenis/react'

export function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLParagraphElement>(null)
  const lenis = useLenis()

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: '#about',
        start: 'top top',
        end: '+=150%',
        pin: true,
        scrub: 1,
        anticipatePin: 1, // Smooths out the pinning jolt
      })

      // Word-by-word stagger reveal
      if (textRef.current) {
        const words = portfolioData.summary.split(' ')
        textRef.current.innerHTML = words
          .map(w => `<span class="word-span" style="opacity:0;display:inline-block;margin-right:0.3em">${w}</span>`)
          .join('')

        gsap.to('#about .word-span', {
          opacity: 1, y: 0,
          stagger: 0.03,
          scrollTrigger: {
            trigger: '#about',
            start: 'top top',
            end: '+=80%',
            scrub: 1,
          }
        })
      }

      gsap.from('.stat-card', {
        opacity: 0, y: 40, stagger: 0.1,
        scrollTrigger: {
          trigger: '.stats-row',
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        }
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="about"
      ref={sectionRef}
      style={{
        minHeight: '100vh', position: 'relative',
        display: 'flex', alignItems: 'center',
        padding: '6rem 2rem 4rem',
        zIndex: 10,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] as const }}
        style={{
          maxWidth: '1200px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: '45% 55%',
          gap: '4rem', alignItems: 'center',
          width: '100%',
        }}
      >
        {/* Left: 3D scene placeholder */}
        <div style={{ height: '400px' }} aria-hidden="true" />

        {/* Right: Content */}
        <div>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
            color: 'var(--accent-cyan)', letterSpacing: '0.25em',
            textTransform: 'uppercase', marginBottom: '1.2rem',
          }}>
            // 001 — ABOUT
          </p>

          <h2 style={{
            fontFamily: 'var(--font-display)', fontWeight: 700,
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            color: 'var(--text-primary)', lineHeight: 1.1,
            letterSpacing: '-0.02em', marginBottom: '1.5rem',
          }}>
            Building systems<br />that scale.
          </h2>

          <div style={{
            background: 'transparent',
            backdropFilter: 'blur(4px)',
            padding: '1.5rem',
            marginBottom: '3rem',
          }}>
            <p
              ref={textRef}
              style={{
                fontFamily: 'var(--font-body)', fontSize: '1.1rem',
                color: 'var(--text-primary)', lineHeight: 1.8,
                fontWeight: 300,
                margin: 0,
              }}
            >
              {portfolioData.summary}
            </p>
          </div>

          {/* Stats Row */}
          <div className="stats-row" style={{ display: 'flex', gap: '1.5rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
            {portfolioData.stats.map((stat) => (
              <div key={stat.label} className="stat-card" style={{
                padding: '1rem 1.5rem',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px', textAlign: 'center',
              }}>
                <div style={{
                  fontFamily: 'var(--font-display)', fontWeight: 700,
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  color: 'var(--accent-cyan)',
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
                  color: 'var(--text-secondary)', letterSpacing: '0.12em',
                  textTransform: 'uppercase', marginTop: '0.35rem',
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          <MagneticButton onClick={() => lenis?.scrollTo('#projects', { duration: 1.2 })}>
            View Projects ↓
          </MagneticButton>
        </div>
      </motion.div>
    </section>
  )
}
