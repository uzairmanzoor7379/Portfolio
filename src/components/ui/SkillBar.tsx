import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface SkillBarProps {
  label: string
  percentage: number
  color?: string
}

export function SkillBar({ label, percentage, color = '#00F5FF' }: SkillBarProps) {
  const barRef = useRef<HTMLDivElement>(null)
  const numRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const obj = { val: 0 }
      gsap.to(obj, {
        val: percentage,
        duration: 1.2,
        ease: 'power2.out',
        onUpdate: () => {
          if (numRef.current) numRef.current.textContent = Math.round(obj.val) + '%'
          if (barRef.current) barRef.current.style.width = obj.val + '%'
        },
        scrollTrigger: {
          trigger: barRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        }
      })
    })
    return () => ctx.revert()
  }, [percentage])

  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--text-primary)' }}>
          {label}
        </span>
        <span ref={numRef} style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color }}>
          0%
        </span>
      </div>
      <div style={{
        width: '100%', height: '2px',
        background: 'var(--border-subtle)',
        borderRadius: '1px', overflow: 'hidden',
      }}>
        <div
          ref={barRef}
          style={{
            width: '0%', height: '100%',
            background: color,
            boxShadow: `0 0 8px ${color}`,
            borderRadius: '1px',
            transition: 'none',
          }}
        />
      </div>
    </div>
  )
}
