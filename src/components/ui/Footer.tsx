import { portfolioData } from '../../data/portfolioData'

export function Footer() {
  return (
    <footer style={{
      padding: '1.5rem 2rem',
      background: 'var(--bg-base)',
      borderTop: '1px solid var(--border-subtle)',
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem',
      position: 'relative', zIndex: 10,
    }}>
      <p style={{
        fontFamily: 'var(--font-body)', fontSize: '0.75rem',
        color: 'var(--text-secondary)',
      }}>
        © 2026 {portfolioData.personal.name}
      </p>

      <p style={{
        fontFamily: 'var(--font-body)', fontSize: '0.7rem',
        color: 'var(--text-secondary)', letterSpacing: '0.05em',
      }}>
        Built with React, Three.js & GSAP
      </p>

      <div style={{ display: 'flex', gap: '1.5rem' }}>
        {[
          { label: 'GitHub', href: portfolioData.personal.github },
          { label: 'LinkedIn', href: portfolioData.personal.linkedin },
        ].map(({ label, href }) => (
          <a
            key={label}
            href={href}
            target="_blank" rel="noopener noreferrer"
            style={{
              fontFamily: 'var(--font-body)', fontSize: '0.75rem',
              color: 'var(--text-secondary)', textDecoration: 'none',
              letterSpacing: '0.1em', textTransform: 'uppercase',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-cyan)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            {label} ↗
          </a>
        ))}
      </div>
    </footer>
  )
}
