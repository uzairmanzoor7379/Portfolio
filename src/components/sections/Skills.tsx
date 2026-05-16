import { useRef } from 'react'
import { motion } from 'framer-motion'
import { portfolioData } from '../../data/portfolioData'

const SKILL_CATEGORIES = [
  { id: 'frontend', title: 'Frontend', skills: portfolioData.skills.frontend, color: 'var(--accent-cyan)' },
  { id: 'backend', title: 'Backend', skills: portfolioData.skills.backend, color: '#7B2FBE' },
  { id: 'database', title: 'Data & Cloud', skills: portfolioData.skills.database, color: '#FF6B35' },
  { id: 'tools', title: 'Dev Tools', skills: portfolioData.skills.tools, color: '#00F5FF' },
  { id: 'ai', title: 'AI & Misc', skills: portfolioData.skills.ai, color: '#7DF9FF' },
]

export function Skills() {
  const sectionRef = useRef<HTMLElement>(null)

  return (
    <section
      id="skills"
      ref={sectionRef}
      style={{
        minHeight: '100vh',
        padding: '11rem 2rem 10rem',
        position: 'relative',
        zIndex: 10,
        background: 'linear-gradient(to bottom, transparent, rgba(5,5,8,0.8), transparent)'
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '5rem' }}>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
              color: 'var(--accent-cyan)', letterSpacing: '0.35em',
              textTransform: 'uppercase', marginBottom: '1.2rem',
            }}>
            // 002 — TECHNICAL EXPERTISE
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            style={{
              fontFamily: 'var(--font-display)', fontWeight: 700,
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              color: 'var(--text-primary)', letterSpacing: '-0.03em',
              lineHeight: 1,
            }}>
            Modern stack for <br />
            <span style={{
              color: 'transparent',
              WebkitTextStroke: '1px var(--accent-cyan)',
              opacity: 0.8
            }}>modern solutions.</span>
          </motion.h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
        }}>
          {SKILL_CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ 
                y: -10,
                scale: 1.02,
                borderColor: cat.color,
                boxShadow: `0 15px 35px ${cat.color}15`
              }}
              viewport={{ once: true }}
              style={{
                padding: '2.5rem',
                background: 'rgba(13,13,20,0.4)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '24px',
                position: 'relative',
                overflow: 'hidden',
                transition: 'border-color 0.4s ease, box-shadow 0.4s ease'
              }}
            >
              {/* Decorative accent light */}
              <div style={{
                position: 'absolute', top: '-20%', right: '-20%',
                width: '150px', height: '150px',
                background: cat.color, filter: 'blur(100px)',
                opacity: 0.15, pointerEvents: 'none'
              }} />

              <h3 style={{
                fontFamily: 'var(--font-display)', fontSize: '1.2rem',
                color: 'var(--text-primary)', marginBottom: '1.5rem',
                display: 'flex', alignItems: 'center', gap: '0.8rem'
              }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: cat.color, boxShadow: `0 0 10px ${cat.color}` }} />
                {cat.title}
              </h3>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
                {cat.skills.map((skill) => (
                  <motion.span
                    key={skill}
                    whileHover={{ scale: 1.1, y: -2 }}
                    style={{
                      padding: '0.5rem 1rem',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '8px',
                      color: 'var(--text-secondary)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      cursor: 'default',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--text-primary)';
                      e.currentTarget.style.borderColor = cat.color;
                      e.currentTarget.style.background = `${cat.color}10`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--text-secondary)';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                      e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                    }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
