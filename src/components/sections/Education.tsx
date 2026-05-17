import { useRef } from 'react'
import { motion } from 'framer-motion'
import { portfolioData } from '../../data/portfolioData'
import { SkillTag } from '../ui/SkillTag'

export function Education() {
  const sectionRef = useRef<HTMLElement>(null)

  // Entry animations managed by Framer Motion directly on the elements

  return (
    <section id="education" ref={sectionRef} style={{ minHeight: '80vh', padding: '4rem 2rem 8rem 2rem', position: 'relative', zIndex: 10 }}>
      <motion.div initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] as const }} style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-cyan)', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1.2rem' }}>// 005 — EDUCATION</p>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '4rem' }}>Learning never stops.</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>Education</h3>
            {portfolioData.education.map((edu, index) => (
              <motion.div 
                key={edu.degree} 
                className="edu-card" 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                whileHover={{ x: 10, backgroundColor: 'rgba(0, 245, 255, 0.05)' }} 
                style={{ 
                  padding: '2rem 2.5rem', 
                  background: 'linear-gradient(90deg, rgba(13, 13, 20, 0.8) 0%, rgba(13, 13, 20, 0.4) 100%)', 
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.03)', 
                  borderLeft: '4px solid var(--accent-cyan)',
                  borderRadius: '0 20px 20px 0', 
                  marginBottom: '1.5rem', 
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: '10px 10px 30px rgba(0, 0, 0, 0.4)'
                }}
              >
                <div style={{ position: 'relative' }}>
                  <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '0.4rem', letterSpacing: '-0.01em' }}>{edu.degree}</p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--accent-cyan)', marginBottom: '0.4rem', fontWeight: 500 }}>{edu.institution}</p>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginBottom: '1.2rem' }}>{edu.period}</p>
                  {edu.selfStudy.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {edu.selfStudy.map((s) => <SkillTag key={s} label={s} />)}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <div>
            <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>Certifications</h3>
            {portfolioData.certifications.map((cert, index) => (
              <motion.div 
                key={cert.name} 
                className="edu-card" 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                // Delay certifications slightly after education for a cascading effect
                transition={{ duration: 0.5, delay: (portfolioData.education.length + index) * 0.15 }}
                whileHover={{ x: 10, backgroundColor: 'rgba(0, 245, 255, 0.05)' }} 
                style={{ 
                  padding: '2rem 2.5rem', 
                  background: 'linear-gradient(90deg, rgba(13, 13, 20, 0.8) 0%, rgba(13, 13, 20, 0.4) 100%)', 
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.03)', 
                  borderLeft: '4px solid var(--accent-cyan)',
                  borderRadius: '0 20px 20px 0', 
                  marginBottom: '1.5rem', 
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: '10px 10px 30px rgba(0, 0, 0, 0.4)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                  <div style={{ 
                    width: '45px', height: '45px', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(0, 245, 255, 0.1)', borderRadius: '10px',
                    border: '1px solid rgba(0, 245, 255, 0.2)'
                  }}>
                    <span style={{ fontSize: '1.2rem' }}>🎓</span>
                  </div>
                  <div>
                    <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)', margin: 0 }}>{cert.name}</p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--accent-cyan)', marginTop: '0.2rem', fontWeight: 500 }}>{cert.institution}</p>
                  </div>
                </div>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '1rem', marginLeft: '3.7rem' }}>{cert.period}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
