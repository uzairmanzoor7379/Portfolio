import { useLayoutEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { portfolioData } from '../../data/portfolioData'

export function Experience() {
  const sectionRef = useRef<HTMLElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(lineRef.current, { scaleY: 0 }, {
        scaleY: 1, transformOrigin: 'top center', ease: 'none',
        scrollTrigger: { trigger: '#experience', start: 'top 60%', end: 'bottom 40%', scrub: 1 }
      })
      gsap.from('.exp-bullet', {
        opacity: 0, x: -30, stagger: 0.1,
        scrollTrigger: { trigger: '#experience', start: 'top 50%', toggleActions: 'play none none reverse' }
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="experience" ref={sectionRef} style={{ minHeight: '115vh', padding: '8rem 2rem 4rem 2rem', position: 'relative', zIndex: 10 }}>
      <motion.div initial={{ opacity: 0, y: 60, filter: 'blur(20px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] as const }} style={{ maxWidth: '800px', margin: '0 auto' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-cyan)', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1.2rem' }}>// 003 — EXPERIENCE</p>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '4rem' }}>Where I've worked.</h2>

        <div style={{ position: 'relative', paddingLeft: '2rem' }}>
          <div ref={lineRef} style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '2px', background: 'var(--accent-cyan)', transformOrigin: 'top center' }} />
          <div style={{ position: 'absolute', left: '-5px', top: 0, width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent-cyan)', boxShadow: 'var(--glow-cyan)' }} />

          {portfolioData.experience.map((job) => (
            <div key={job.company} style={{ marginBottom: '3rem' }}>
              <div style={{
                background: 'rgba(13, 13, 20, 0.5)',
                backdropFilter: 'blur(16px)',
                padding: '2.5rem',
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderTop: '1px solid rgba(0, 245, 255, 0.3)',
                marginBottom: '2.5rem',
                boxShadow: '0 30px 60px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.02)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Subtle inner glow */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: '100px',
                  background: 'linear-gradient(to bottom, rgba(0, 245, 255, 0.03), transparent)',
                  pointerEvents: 'none'
                }} />
                <div style={{ marginBottom: '0.5rem' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.4rem', color: 'var(--text-primary)' }}>{job.company}</span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--accent-cyan)', marginLeft: '0.75rem' }}>— {job.role}</span>
                </div>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>{job.period} · {job.location}</p>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {job.points.map((point, i) => (
                    <li key={i} className="exp-bullet" style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: '#ffffffe8', lineHeight: 1.7, display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                      <span style={{ color: 'var(--accent-cyan)', flexShrink: 0, marginTop: '0.25rem' }}>•</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
