import { useLayoutEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { portfolioData } from '../../data/portfolioData'
import { MagneticButton } from '../ui/MagneticButton'
import { useStore } from '../../store/useStore'

type FormState = 'idle' | 'submitting' | 'success'

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const [formState, setFormState] = useState<FormState>('idle')
  const [values, setValues] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const setFormSuccess = useStore((s) => s.setFormSuccess)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.contact-content', {
        opacity: 0, y: 60,
        scrollTrigger: { trigger: '#contact', start: 'top 70%', toggleActions: 'play none none reverse' }
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!values.name.trim()) errs.name = 'Name is required'
    if (!values.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = 'Valid email required'
    if (!values.message.trim()) errs.message = 'Message is required'
    return errs
  }

  const handleSubmit = () => {
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    setFormState('submitting')
    setTimeout(() => {
      setFormState('success')
      setFormSuccess(true)
      setTimeout(() => setFormSuccess(false), 3000)
    }, 2000)
  }

  const inputStyle = (field: string): React.CSSProperties => ({
    width: '100%', background: 'transparent', border: 'none',
    borderBottom: `1px solid ${errors[field] ? 'var(--accent-amber)' : 'var(--border-subtle)'}`,
    padding: '0.75rem 0', fontFamily: 'var(--font-body)', fontSize: '0.9rem',
    color: 'var(--text-primary)', outline: 'none', transition: 'border-color 0.2s',
  })

  return (
    <section id="contact" ref={sectionRef} style={{ minHeight: '120vh', padding: '8rem 2rem', position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center' }}>
      <motion.div initial={{ opacity: 0, y: 60, filter: 'blur(20px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] as const }} className="contact-content" style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-cyan)', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1.2rem' }}>// 005 — CONTACT</p>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>Let's build something.</h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--accent-cyan)', marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-cyan)', boxShadow: '0 0 10px var(--accent-cyan)' }} />
          Open for Work
        </p>

        {formState === 'success' ? (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '2rem', color: 'var(--accent-cyan)', marginBottom: '0.5rem' }}>✓ Message Sent</p>
            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}>I'll get back to you soon!</p>
          </motion.div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
              <input type="text" placeholder="Your Name" aria-label="Your Name" value={values.name} onChange={(e) => setValues({ ...values, name: e.target.value })} style={inputStyle('name')} />
              {errors.name && <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: 'var(--accent-amber)', marginTop: '0.25rem' }}>{errors.name}</p>}
            </div>
            <div>
              <input type="email" placeholder="Your Email" aria-label="Your Email" value={values.email} onChange={(e) => setValues({ ...values, email: e.target.value })}
                onBlur={() => { if (!values.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) setErrors({ ...errors, email: 'Valid email required' }); else { const { email: _, ...rest } = errors; setErrors(rest) } }}
                style={inputStyle('email')} />
              {errors.email && <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: 'var(--accent-amber)', marginTop: '0.25rem' }}>{errors.email}</p>}
            </div>
            <div>
              <textarea placeholder="Your Message" aria-label="Your Message" rows={4} value={values.message} onChange={(e) => setValues({ ...values, message: e.target.value })} style={{ ...inputStyle('message'), resize: 'none' as const }} />
              {errors.message && <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: 'var(--accent-amber)', marginTop: '0.25rem' }}>{errors.message}</p>}
            </div>
            <MagneticButton onClick={handleSubmit} loading={formState === 'submitting'}>
              {formState === 'submitting' ? 'Sending...' : 'SEND MESSAGE →'}
            </MagneticButton>
            <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              <a href={portfolioData.personal.github} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)', textDecoration: 'none', letterSpacing: '0.15em', textTransform: 'uppercase', transition: 'color 0.2s' }} onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-cyan)')} onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}>GitHub ↗</a>
              <a href={portfolioData.personal.linkedin} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)', textDecoration: 'none', letterSpacing: '0.15em', textTransform: 'uppercase', transition: 'color 0.2s' }} onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-cyan)')} onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}>LinkedIn ↗</a>
              <a href={`mailto:${portfolioData.personal.email}`} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)', textDecoration: 'none', letterSpacing: '0.15em', textTransform: 'uppercase', transition: 'color 0.2s' }} onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-cyan)')} onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}>Email ↗</a>
            </div>
          </div>
        )}
      </motion.div>
    </section>
  )
}
