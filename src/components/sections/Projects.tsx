// Projects.tsx — ONLY this file changed. All other sections untouched.
import { useLayoutEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { portfolioData } from '../../data/portfolioData'
import { SkillTag } from '../ui/SkillTag'
import { useStore } from '../../store/useStore'

gsap.registerPlugin(ScrollTrigger)

// ─── Animation variants ──────────────────────────────────────────────────────

// Card: even index (0,2...) → enters from center, exits/enters from right
// Card: odd index  (1,3...) → enters from center, exits/enters from left
const cardVariants = {
  initial: (isEven: boolean) => ({
    x: isEven ? '20vw' : '-20vw',
    opacity: 0,
  }),
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
  exit: (isEven: boolean) => ({
    x: isEven ? '-20vw' : '20vw',
    opacity: 0,
    transition: {
      duration: 0.4,
      ease: [0.7, 0, 0.84, 0] as const,
    },
  }),
}

const mockupVariants = {
  initial: (isEven: boolean) => ({
    x: isEven ? '-45vw' : '45vw',
    opacity: 0,
    scale: 0.8,
    rotate: isEven ? -3 : 3,
  }),
  animate: {
    x: 0,
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      duration: 1.0,
      ease: [0.16, 1, 0.3, 1] as const,
      delay: 0.05,
    },
  },
  exit: (isEven: boolean) => ({
    x: isEven ? '45vw' : '-45vw',
    opacity: 0,
    scale: 0.75,
    rotate: isEven ? 4 : -4,
    transition: {
      duration: 0.65,
      ease: [0.7, 0, 0.84, 0] as const,
    },
  }),
}

// ─── Mockup component (screenshot that flies across heading) ─────────────────
function ProjectMockup({
  project,
  isEven,
}: {
  project: (typeof portfolioData.projects)[number]
  isEven: boolean
}) {
  return (
    <motion.div
      custom={isEven}
      variants={mockupVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{
        position: 'relative',
        animation: 'float 3s ease-in-out infinite',
        // On even: mockup sits LEFT side. On odd: RIGHT side.
        // Positioning is handled by the parent flex layout.
      }}
    >
      {/* Glow behind mockup */}
      <div
        style={{
          position: 'absolute',
          inset: '-20%',
          background: `radial-gradient(ellipse at center, ${project.color}15 0%, transparent 60%)`,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Browser chrome mock */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: 'clamp(280px, 36vw, 520px)',
          borderRadius: '10px',
          overflow: 'hidden',
          border: `1px solid ${project.color}44`,
          boxShadow: `0 0 60px ${project.color}22, 0 30px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)`,
          background: '#0a0a12',
          // Perspective tilt based on side
          transform: isEven ? 'perspective(900px) rotateY(6deg) rotateX(2deg)' : 'perspective(900px) rotateY(-6deg) rotateX(2deg)',
        }}
      >
        {/* Browser bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '8px 12px',
            background: 'rgba(255,255,255,0.04)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          {['#FF5F57', '#FFBD2E', '#28C840'].map((c, i) => (
            <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.8 }} />
          ))}
          <div
            style={{
              flex: 1,
              marginLeft: 8,
              height: 18,
              borderRadius: 4,
              background: 'rgba(255,255,255,0.06)',
              fontSize: '0.6rem',
              fontFamily: 'monospace',
              color: 'rgba(255,255,255,0.3)',
              display: 'flex',
              alignItems: 'center',
              paddingLeft: 8,
              letterSpacing: '0.05em',
            }}
          >
            {project.live}
          </div>
          {/* Live badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '2px 8px',
              borderRadius: 20,
              border: `1px solid ${project.color}55`,
              background: `${project.color}11`,
              fontSize: '0.55rem',
              fontFamily: 'monospace',
              color: project.color,
              letterSpacing: '0.1em',
            }}
          >
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: '50%',
                background: project.color,
                boxShadow: `0 0 6px ${project.color}`,
              }}
            />
            LIVE
          </div>
        </div>

        {/* Screenshot area */}
        <div
          style={{
            width: '100%',
            aspectRatio: '16/10',
            background: `linear-gradient(135deg, ${project.color}18 0%, #0a0a1a 50%, ${project.color}10 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Actual screenshot image — falls back gracefully if texture missing */}
          <img
            src={`/textures/project-${project.id}.png`}
            alt={project.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.9,
              display: 'block',
            }}
            onError={(e) => {
              // If image not found, show a styled placeholder
              ; (e.target as HTMLImageElement).style.display = 'none'
            }}
          />
          {/* Overlay shimmer */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(180deg, transparent 60%, ${project.color}15 100%)`,
              pointerEvents: 'none',
            }}
          />
          {/* Fallback: project name if no image */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              pointerEvents: 'none',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-display, monospace)',
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                fontWeight: 900,
                color: project.color,
                opacity: 0.15,
                letterSpacing: '-0.04em',
              }}
            >
              {project.name}
            </span>
          </div>
        </div>
      </div>

      {/* Project color accent line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          height: 2,
          background: `linear-gradient(${isEven ? '90deg' : '270deg'}, transparent, ${project.color}, transparent)`,
          marginTop: 2,
          transformOrigin: isEven ? 'left' : 'right',
        }}
      />
    </motion.div>
  )
}

// ─── Info card component ──────────────────────────────────────────────────────
function ProjectInfoCard({
  project,
  isEven,
}: {
  project: (typeof portfolioData.projects)[number]
  isEven: boolean
}) {
  const cardRef = useRef<HTMLDivElement>(null)

  return (
    <motion.div
      ref={cardRef}
      custom={isEven}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ perspective: 1000 }}
      onMouseMove={(e) => {
        if (!cardRef.current) return
        const rect = cardRef.current.getBoundingClientRect()
        const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2)
        const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2)
        gsap.to(cardRef.current, {
          rotateX: -y * 8,
          rotateY: x * 8,
          transformPerspective: 1000,
          duration: 0.3,
          ease: 'power2.out',
        })
      }}
      onMouseLeave={() => {
        if (!cardRef.current) return
        gsap.to(cardRef.current, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.6,
          ease: 'elastic.out(1, 0.5)',
        })
      }}
    >
      <div
        style={{
          width: 'clamp(300px, 38vw, 520px)',
          padding: 'clamp(1.5rem, 2.5vw, 2.2rem)',
          background: 'rgba(10,10,18,0.98)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderTop: `1px solid ${project.color}40`,
          borderRadius: '16px',
          boxShadow: `0 0 80px ${project.color}14, 0 40px 100px rgba(0,0,0,0.5)`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Corner accent */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 80,
            height: 80,
            background: `radial-gradient(circle at top right, ${project.color}20, transparent 70%)`,
            pointerEvents: 'none',
          }}
        />

        {/* Type badge */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            color: 'rgba(255,255,255,0.4)',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            marginBottom: '0.8rem',
          }}
        >
          {project.type}
        </motion.p>

        {/* Project name */}
        <motion.h3
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: 'var(--font-display, monospace)',
            fontWeight: 800,
            fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
            color: '#ffffff',
            letterSpacing: '-0.03em',
            marginBottom: '0.2rem',
            lineHeight: 1.1,
          }}
        >
          {project.name}
          <span
            style={{
              fontSize: '0.82rem',
              fontWeight: 400,
              color: 'rgba(255,255,255,0.35)',
              marginLeft: '0.6rem',
              letterSpacing: '0',
            }}
          >
            — {project.fullName}
          </span>
        </motion.h3>

        {/* Accent line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.45, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{
            height: 1,
            background: `linear-gradient(90deg, ${project.color}, transparent)`,
            marginBottom: '1rem',
            transformOrigin: 'left',
          }}
        />

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42, duration: 0.45 }}
          style={{
            fontFamily: 'var(--font-body, sans-serif)',
            fontSize: '0.95rem',
            color: 'rgba(200,210,220,0.85)',
            lineHeight: 1.7,
            marginBottom: '1.5rem',
            fontWeight: 300,
          }}
        >
          {project.description}
        </motion.p>

        {/* Stack tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.52, duration: 0.4 }}
          style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.5rem' }}
        >
          {project.stack.map((tech, i) => (
            <motion.div
              key={tech}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.52 + i * 0.04, duration: 0.3 }}
            >
              <SkillTag label={tech} />
            </motion.div>
          ))}
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.4 }}
          style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}
        >
          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: 'var(--font-body, monospace)',
              fontSize: '0.72rem',
              color: project.color,
              letterSpacing: '0.12em',
              textDecoration: 'none',
              textTransform: 'uppercase',
              border: `1px solid ${project.color}55`,
              padding: '0.45rem 1.1rem',
              borderRadius: '6px',
              background: `${project.color}0d`,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              ; (e.currentTarget as HTMLAnchorElement).style.background = `${project.color}22`
                ; (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 0 20px ${project.color}30`
            }}
            onMouseLeave={(e) => {
              ; (e.currentTarget as HTMLAnchorElement).style.background = `${project.color}0d`
                ; (e.currentTarget as HTMLAnchorElement).style.boxShadow = 'none'
            }}
          >
            🌐 Live Demo ↗
          </a>

          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'var(--font-body, monospace)',
                fontSize: '0.72rem',
                color: 'rgba(255,255,255,0.45)',
                letterSpacing: '0.12em',
                textDecoration: 'none',
                textTransform: 'uppercase',
                border: '1px solid rgba(255,255,255,0.12)',
                padding: '0.45rem 1.1rem',
                borderRadius: '6px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                ; (e.currentTarget as HTMLAnchorElement).style.color = '#fff'
                  ; (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.3)'
              }}
              onMouseLeave={(e) => {
                ; (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.45)'
                  ; (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.12)'
              }}
            >
              GitHub ↗
            </a>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}

// ─── Main Projects section ────────────────────────────────────────────────────
export function Projects() {
  const sectionRef = useRef<HTMLElement>(null)
  const activeProjectIndex = useStore((s) => s.activeProjectIndex)
  const setProjectsActive = useStore((s) => s.setProjectsActive)
  const setActiveProjectIndex = useStore((s) => s.setActiveProjectIndex)

  const projects = portfolioData.projects
  const totalProjects = projects.length

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    let pendingIndex: number | null = null;
    let rafId: number | null = null;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: `+=${totalProjects * 45}%`,
        pin: true,
        pinSpacing: true,
        lazy: true,
        onEnter: () => setProjectsActive(true),
        onLeave: () => setProjectsActive(false),
        onEnterBack: () => setProjectsActive(true),
        onLeaveBack: () => setProjectsActive(false),
        onUpdate: (self: any) => {
          const rawIndex = Math.floor(self.progress * totalProjects * 0.99);
          const newIndex = Math.max(0, Math.min(totalProjects - 1, rawIndex));

          if (newIndex !== pendingIndex) {
            pendingIndex = newIndex;
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
              if (pendingIndex !== null) {
                setActiveProjectIndex(pendingIndex);
              }
            });
          }
        }
      } as any)
    }, sectionRef)

    return () => {
      ctx.revert();
      if (rafId) cancelAnimationFrame(rafId);
    }
  }, [setProjectsActive, setActiveProjectIndex, totalProjects])

  const currentProject = projects[activeProjectIndex]
  // Even index (0): mockup LEFT + card RIGHT
  // Odd  index (1): mockup RIGHT + card LEFT
  const isEven = activeProjectIndex % 2 === 0

  return (
    <section
      id="projects"
      ref={sectionRef}
      style={{
        height: '100vh',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 4vw',
        zIndex: 10,
        overflow: 'hidden',
      }}
    >
      {/* ── Section label + heading (stays fixed, content flies past it) ── */}
      <div
        style={{
          position: 'absolute',
          top: '5.5rem',
          left: '4vw',
          zIndex: 20,
          pointerEvents: 'none',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            color: 'var(--accent-cyan, #00e5c8)',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            marginBottom: '0.6rem',
          }}
        >
          // 003 — PROJECTS
        </p>
        <h2
          style={{
            fontFamily: 'var(--font-display, monospace)',
            fontWeight: 800,
            fontSize: 'clamp(2rem, 4.5vw, 3.2rem)',
            color: '#ffffff',
            letterSpacing: '-0.03em',
            lineHeight: 1,
          }}
        >
          Things I've built.
        </h2>
      </div>

      {/* ── Scroll hint ── */}
      <div
        style={{
          position: 'absolute',
          bottom: '2.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
          zIndex: 20,
          pointerEvents: 'none',
        }}
      >
        {/* Progress dots */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {projects.map((_, i) => (
            <motion.div
              key={i}
              animate={{
                width: i === activeProjectIndex ? 24 : 8,
                background:
                  i === activeProjectIndex
                    ? currentProject.color
                    : 'rgba(255,255,255,0.2)',
              }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              style={{ height: 8, borderRadius: 4 }}
            />
          ))}
        </div>
        {/* Scroll cue */}
        <motion.p
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            fontFamily: 'var(--font-body, monospace)',
            fontSize: '0.58rem',
            color: 'rgba(255,255,255,0.35)',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
          }}
        >
          scroll to navigate
        </motion.p>
      </div>

      {/* ── Main content: Mockup + Info card ── */}
      {/*
        Layout logic:
          isEven → row  → [mockup left] [card right]
          isOdd  → row-reverse → [card left] [mockup right]
        The AnimatePresence key forces full unmount/remount on project change,
        triggering the cross-screen flight animations.
      */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentProject.id}
          style={{
            display: 'flex',
            flexDirection: isEven ? 'row' : 'row-reverse',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'clamp(2rem, 5vw, 5rem)',
            width: '100%',
            // Push down slightly so heading has room
            marginTop: 'clamp(4rem, 8vh, 7rem)',
          }}
        >
          {/* Screenshot mockup — flies across heading text (z-index 30 > heading z-index 20) */}
          <motion.div style={{ zIndex: 30 }}>
            <ProjectMockup project={currentProject} isEven={isEven} />
          </motion.div>

          {/* Info card */}
          <motion.div style={{ zIndex: 25 }}>
            <ProjectInfoCard project={currentProject} isEven={isEven} />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </section>
  )
}
