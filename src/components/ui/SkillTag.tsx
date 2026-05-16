import { useState } from 'react'

interface SkillTagProps {
  label: string
  variant?: 'default' | 'learning'
}

export function SkillTag({ label, variant = 'default' }: SkillTagProps) {
  const [hovered, setHovered] = useState(false)
  const isLearning = variant === 'learning'

  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-block',
        padding: '0.3rem 0.7rem',
        borderRadius: '4px',
        fontFamily: 'var(--font-body)',
        fontSize: '0.7rem',
        letterSpacing: '0.05em',
        cursor: 'default',
        transition: 'all 0.2s ease',
        border: isLearning
          ? '1px dashed rgba(255,107,53,0.5)'
          : `1px solid ${hovered ? 'var(--accent-cyan)' : 'var(--border-subtle)'}`,
        background: isLearning
          ? 'rgba(255,107,53,0.05)'
          : hovered ? 'rgba(0,245,255,0.08)' : 'transparent',
        color: isLearning
          ? 'var(--accent-amber)'
          : hovered ? 'var(--accent-cyan)' : 'var(--text-secondary)',
      }}
    >
      {label}
    </span>
  )
}
