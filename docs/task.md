# ✅ TASK.MD
# Uzair Manzoor — 3D Portfolio · AI Build Instructions
> Version: 3.0 — System Prompt Exact Alignment + Full File Reference Map
> Step-by-step execution plan. Complete EACH step fully, verify it works, THEN move to next.
> NEVER skip verification. NEVER hallucinate library APIs — check exact imports from docs.

---

## ⚠️ AI: READ THESE 3 FILES BEFORE WRITING ANY CODE

```
uzair-portfolio/
└── docs/
    ├── requirements.md   ← READ FIRST  — all developer data, FR-01 to FR-30, packages
    ├── design.md         ← READ SECOND — colors, typography, sections, component specs
    └── task.md           ← YOU ARE HERE — execute Phase 0 → Phase 18 step by step
```

**Mandatory reading order:**
```
1. cat docs/requirements.md    → understand who Uzair is, what to build, package list
2. cat docs/design.md          → understand how it looks, section-by-section visual spec
3. cat docs/task.md            → NOW start Phase 0. One step at a time. Never skip.
```

**Spec cross-reference format used in this file:**
Every step references its source like: `Spec: design.md §3 Hero | requirements.md FR-03`
When in doubt about a value, go back to that spec location.

**Content rule:** ALL portfolio content (name, skills, projects, URLs, achievements) comes from
`docs/requirements.md §1–6` → `src/data/portfolioData.ts`. Never hardcode or invent content.

---

## ⚠️ CRITICAL RULES (READ BEFORE STARTING)

1. **Complete one step at a time.** Do not scaffold the whole project at once.
2. **After each step, verify** by running the dev server and checking the listed verification criteria.
3. **If a step fails,** debug and fix before moving forward. Never proceed on a broken step.
4. **No placeholder content.** Use ONLY the data from `docs/requirements.md`.
5. **No lorem ipsum** anywhere — ever.
6. **Use TypeScript throughout.** All files use `.tsx` or `.ts`. Template is `react-ts`.
7. **Read the API reference** for Three.js / GSAP / Lenis / R3F before using any method you are unsure about.
8. **After every file is created,** mentally trace the data flow from top to bottom.
9. **GSAP cleanup:** every `useEffect`/`useLayoutEffect` with GSAP MUST return `() => ctx.revert()` or `() => tween.kill()`.
10. **Phase 18 is NOT optional.** It fixes system prompt alignment — skip it and portfolio is incomplete.

---

## PHASE 0 — PROJECT SETUP

---

### STEP 0.1 — Scaffold Project (TypeScript — NON-NEGOTIABLE)

**Action:** Run this exact command sequence:
```bash
npm create vite@latest uzair-portfolio -- --template react-ts
cd uzair-portfolio
```

> ⚠️ FIX v2: Template MUST be `react-ts` NOT `react`. TypeScript strict mode is non-negotiable per system prompt.

**Action:** Create `docs/` folder and copy the 3 reference files into it:
```bash
mkdir -p docs

# Copy your 3 reference files into docs/
# (replace the source paths with wherever your files actually are)
cp /path/to/requirements.md docs/requirements.md
cp /path/to/design.md       docs/design.md
cp /path/to/task.md         docs/task.md
```

After this, your project root looks like:
```
uzair-portfolio/
├── docs/
│   ├── requirements.md   ← AI reads this first
│   ├── design.md         ← AI reads this second
│   └── task.md           ← AI follows this (you are here)
├── src/
├── public/
├── package.json
└── vite.config.ts
```

> ⚠️ Every component step in this file has a `Spec:` reference pointing back to design.md section and requirements.md FR number. When uncertain about any value, open that spec file.

**Install ALL dependencies in one command:**
```bash
npm install three @react-three/fiber @react-three/drei @react-three/postprocessing gsap lenis framer-motion zustand maath
npm install -D tailwindcss @tailwindcss/vite r3f-perf
npm install -D @types/three
```

> ⚠️ FIX v2: `r3f-perf` is now installed as devDependency. `@types/three` added for TypeScript support.

**Verification:**
- [ ] `docs/` folder exists with all 3 files inside
- [ ] `npm run dev` starts without errors
- [ ] Browser shows default Vite React template at localhost:5173
- [ ] `node_modules/three`, `node_modules/gsap`, `node_modules/lenis` all exist
- [ ] `node_modules/r3f-perf` exists
- [ ] TypeScript: `tsconfig.json` present with `"strict": true`
- [ ] No unresolved peer dependency warnings

---

### STEP 0.2 — Configure Tailwind CSS + Vite

**Action:** Update `vite.config.ts`:
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  assetsInclude: ['**/*.glb', '**/*.gltf', '**/*.hdr'],
})
```

Create `src/styles/globals.css`:
```css
@import "tailwindcss";

@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,400&display=swap');

:root {
  --bg-base:        #050508;
  --bg-surface:     #0D0D14;
  --bg-elevated:    #12121E;
  --accent-cyan:    #00F5FF;
  --accent-violet:  #7B2FBE;
  --accent-amber:   #FF6B35;
  --text-primary:   #F0F0FF;
  --text-secondary: #8888AA;
  --text-accent:    #00F5FF;
  --border-subtle:  rgba(0, 245, 255, 0.08);
  --border-glow:    rgba(0, 245, 255, 0.3);
  --glow-cyan:      0 0 40px rgba(0, 245, 255, 0.4);
  --glow-violet:    0 0 40px rgba(123, 47, 190, 0.4);
  --glow-amber:     0 0 20px rgba(255, 107, 53, 0.3);
  --font-display:   'Syne', sans-serif;
  --font-body:      'DM Mono', monospace;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

html, body {
  background: var(--bg-base);
  color: var(--text-primary);
  font-family: var(--font-body);
  overflow-x: hidden;
  cursor: none;
}

body::after {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  opacity: 0.04;
  mix-blend-mode: overlay;
  pointer-events: none;
  z-index: 9998;
}
```

In `src/main.tsx`, import globals:
```tsx
import './styles/globals.css'
```

**Verification:**
- [ ] Background is `#050508` (near-black)
- [ ] Syne + DM Mono fonts load (check Network tab → Fonts)
- [ ] No Tailwind CSS errors in console
- [ ] OS cursor is hidden (`cursor: none` working)

---

### STEP 0.3 — Create Portfolio Data File (TypeScript)

**Action:** Create `src/data/portfolioData.ts`:
```ts
export const portfolioData = {
  personal: {
    name: "Uzair Manzoor",
    title: "MERN Stack Developer",
    email: "uk873195@gmail.com",
    phone: "+91-73798-55969",
    location: "Kanpur, UP",
    remote: "Open to Remote",
    linkedin: "https://linkedin.com/in/uzair-manzoor-8b2189385",
    github: "https://github.com/uzairmanzoor7379",
  },
  summary: "MERN Stack Developer with a 3-month internship at Amdox and a track record of shipping production-grade applications. Built SIRP — an AI-powered incident response platform with real-time Socket.IO dashboards (sub-50ms latency) and Google Gemini API integration — and a multi-role job portal featuring JWT-based RBAC and MongoDB-indexed queries. Skilled in REST API development, Redis, Cloudinary, and secure backend architecture using Helmet and bcrypt.",
  stats: [
    { value: "3", label: "Months @ Amdox" },
    { value: "2", label: "Major Projects" },
    { value: "<50ms", label: "Realtime Latency" },
  ],
  skills: {
    frontend: ["React.js", "Next.js", "JavaScript (ES6+)", "Redux", "HTML5", "CSS3", "Tailwind CSS", "SCSS", "Framer Motion", "GSAP", "Three.js"],
    backend: ["Node.js", "Express.js", "REST API Design", "Socket.IO", "JWT", "Redis", "Multer", "Helmet", "bcrypt", "CORS"],
    database: ["MongoDB", "Firebase", "Cloudinary"],
    tools: ["Git", "GitHub", "Postman", "Vercel", "Netlify", "MediaPipe", "Figma"],
    ai: ["Google Gemini API", "node-cron", "Resend", "OTP workflows"],
    learning: ["TypeScript", "Docker", "Jest", "CI/CD pipelines"],
  },
  experience: [
    {
      role: "Software Development Intern",
      company: "Amdox",
      location: "Kanpur, UP",
      period: "Jan 2026 – March 2026",
      points: [
        "Developed 4+ full-stack MERN modules for internal web applications used by the core team.",
        "Built 6+ responsive React.js UI components integrated with RESTful APIs, improving UI consistency and reducing frontend rendering issues.",
        "Designed and integrated REST APIs with MongoDB implementing CRUD operations and authentication workflows — reduced manual data-handling steps by ~30%.",
        "Implemented JWT-based authentication, session management, and debugging pipelines; collaborated using Git and GitHub with a 4-member Agile dev team.",
        "Participated in daily standups and sprint reviews, delivering assigned modules within planned sprints.",
      ],
    },
  ],
  projects: [
    {
      id: "sirp",
      name: "SIRP",
      fullName: "Smart Incident Response Platform",
      type: "Hackathon Project · Team of 4 · Full Stack",
      description: "AI-powered incident management platform reducing manual triage time by ~60% through automated detection and assignment workflows.",
      achievements: [
        "Reduced manual incident triage time by ~60% via AI-based detection and assignment",
        "Real-time dashboards via Socket.IO with sub-50ms live update latency",
        "Supports 10+ concurrent active incidents simultaneously",
        "Zero auth vulnerabilities: JWT + OTP + RBAC + httpOnly cookies",
        "Reduced manual status communication effort by ~70% via automated public status page",
        "MTTR and incident frequency analytics dashboards for team leads",
      ],
      stack: ["MERN", "Socket.IO", "Google Gemini 1.5 Flash", "node-cron", "Resend", "Cloudinary", "Redis"],
      live: "https://smarterresponse.xyz",
      github: null as string | null,
      color: "#00F5FF",
    },
    {
      id: "jobportal",
      name: "Job Listing Portal",
      fullName: "Job Listing Portal",
      type: "Personal Project · Full Stack",
      description: "Full-stack job marketplace with 2-role RBAC, JWT auth, resume upload, and 40% faster queries via MongoDB indexing. OWASP Top 10 hardened.",
      achievements: [
        "2-role system (Employer + Job Seeker) with separate dashboards and protected routing",
        "Zero session-hijacking vulnerabilities in internal testing",
        "Complete job lifecycle: CRUD, resume upload (Multer), application tracking",
        "~40% faster query response via MongoDB indexing + denormalized schema",
        "Hardened against OWASP Top 10 via Helmet, rate limiting, CORS, bcrypt",
      ],
      stack: ["MERN", "JWT", "SCSS", "React Context API", "Helmet", "bcrypt", "MongoDB Indexing"],
      live: "https://job-portal-befp.onrender.com",
      github: "https://github.com/uzairmanzoor7379/job-portal",
      color: "#FF6B35",
    },
  ],
  education: [
    {
      degree: "Bachelor of Arts (BA)",
      institution: "P.S.P.T. College, Kanpur",
      period: "Expected May 2026",
      notes: "Self-study: Full-Stack Web Development, Data Structures, System Design Fundamentals",
      selfStudy: ["Full-Stack Web Dev", "Data Structures", "System Design"],
    },
    {
      degree: "Intermediate (CBSE Board)",
      institution: "Kanpur",
      period: "2023",
      notes: null as string | null,
      selfStudy: [],
    },
  ],
  certifications: [
    {
      name: "AI-Powered MERN Stack Development",
      institution: "Sheryians Coding School",
      period: "Expected June 2026",
    },
    {
      name: "Full-Stack Web Development",
      institution: "ASDC Kanpur",
      period: "2026",
    },
  ],
} as const
```

**Verification:**
- [ ] File has no TypeScript errors (`npm run dev` still works)
- [ ] All resume data present — cross-check each field
- [ ] No placeholder text or lorem ipsum
- [ ] `github: null` for SIRP (correct — no GitHub link)

---

### STEP 0.4 — Create Zustand Store (TypeScript)

**Action:** Create `src/store/useStore.ts`:
```ts
import { create } from 'zustand'

interface StoreState {
  mouseX: number
  mouseY: number
  mouseRawX: number
  mouseRawY: number
  isHovering: boolean
  hoverTarget: string | null
  scrollProgress: number
  activeSection: string
  isLoaded: boolean
  isProjectsActive: boolean
  activeProjectIndex: number
  setMouse: (x: number, y: number, rawX: number, rawY: number) => void
  setHover: (isHovering: boolean, hoverTarget?: string | null) => void
  setScrollProgress: (progress: number) => void
  setActiveSection: (section: string) => void
  setLoaded: () => void
  setProjectsActive: (active: boolean) => void
  setActiveProjectIndex: (index: number) => void
}

export const useStore = create<StoreState>((set) => ({
  mouseX: 0,
  mouseY: 0,
  mouseRawX: 0,
  mouseRawY: 0,
  isHovering: false,
  hoverTarget: null,
  scrollProgress: 0,
  activeSection: 'hero',
  isLoaded: false,
  isProjectsActive: false,
  activeProjectIndex: 0,
  setMouse: (x, y, rawX, rawY) => set({ mouseX: x, mouseY: y, mouseRawX: rawX, mouseRawY: rawY }),
  setHover: (isHovering, hoverTarget = null) => set({ isHovering, hoverTarget }),
  setScrollProgress: (progress) => set({ scrollProgress: progress }),
  setActiveSection: (section) => set({ activeSection: section }),
  setLoaded: () => set({ isLoaded: true }),
  setProjectsActive: (active) => set({ isProjectsActive: active }),
  setActiveProjectIndex: (index) => set({ activeProjectIndex: index }),
}))
```

**Verification:**
- [ ] No TypeScript errors
- [ ] Store can be imported in any component

---

### STEP 0.5 — Smooth Scroll Provider (Lenis + GSAP + TextPlugin)

> ⚠️ FIX v2: Added `ScrollTrigger.update` sync line (was missing). Added TextPlugin registration.
> ⚠️ FIX v2: Confirmed `lerp: 0.08` (NOT 0.1 — 0.08 is the correct value from system prompt Lenis Config section).

**Action:** Create `src/components/providers/SmoothScroll.tsx`:
```tsx
import { ReactLenis, useLenis } from 'lenis/react'
import type { LenisRef } from 'lenis/react'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import TextPlugin from 'gsap/TextPlugin'

// Register ALL GSAP plugins here — do it once, globally
gsap.registerPlugin(ScrollTrigger, TextPlugin)

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<LenisRef>(null)

  useEffect(() => {
    // GSAP drives the RAF loop — NOT Lenis
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000)
    }
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)

    // CRITICAL FIX: Sync ScrollTrigger with Lenis scroll events
    // Without this, ScrollTrigger animations jerk and desync from smooth scroll
    lenisRef.current?.lenis?.on('scroll', ScrollTrigger.update)

    return () => {
      gsap.ticker.remove(update)
      lenisRef.current?.lenis?.off('scroll', ScrollTrigger.update)
    }
  }, [])

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        autoRaf: false,       // GSAP controls RAF — NEVER set to true when using GSAP
        lerp: 0.08,           // CORRECT value (NOT 0.1) — smoother feel
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1.0,
        touchMultiplier: 2.0,
        syncTouch: false,
      }}
    >
      {children}
    </ReactLenis>
  )
}

export { useLenis }
```

**Verification:**
- [ ] Dev server starts without errors
- [ ] No "Cannot find module 'lenis/react'" error
- [ ] Scroll feels buttery smooth (Lenis working)
- [ ] NO "autoRaf conflict" warnings
- [ ] Console: no "ScrollTrigger not synced" warnings

---

### STEP 0.6 — Hooks: Mouse Tracker, Scroll Progress, Media Query

**Action:** Create `src/hooks/useMouseTracker.ts`:
```ts
import { useEffect } from 'react'
import { useStore } from '../store/useStore'

export function useMouseTracker() {
  const setMouse = useStore((s) => s.setMouse)

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = -(e.clientY / window.innerHeight) * 2 + 1
      setMouse(x, y, e.clientX, e.clientY)
    }
    window.addEventListener('mousemove', handleMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMove)
  }, [setMouse])
}
```

**Action:** Create `src/hooks/useScrollProgress.ts`:
> ⚠️ FIX v2: This is now a DEDICATED FILE, not embedded inside Navbar.

```ts
import { useEffect } from 'react'
import { useStore } from '../store/useStore'

export function useScrollProgress() {
  const setScrollProgress = useStore((s) => s.setScrollProgress)

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement
      const progress = scrollTop / (scrollHeight - clientHeight)
      setScrollProgress(Math.min(1, Math.max(0, progress)))
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [setScrollProgress])

  return useStore((s) => s.scrollProgress)
}
```

**Action:** Create `src/hooks/useMediaQuery.ts`:
```ts
import { useState, useEffect } from 'react'

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false
  )
  useEffect(() => {
    const mq = window.matchMedia(query)
    setMatches(mq.matches)
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [query])
  return matches
}

export const useIsMobile = () => useMediaQuery('(max-width: 767px)')
export const useIsTablet = () => useMediaQuery('(max-width: 1024px)')
```

**Verification:**
- [ ] `useMouseTracker` hook file exists at `src/hooks/useMouseTracker.ts`
- [ ] `useScrollProgress` hook file exists at `src/hooks/useScrollProgress.ts` (DEDICATED — not inside Navbar)
- [ ] `useMediaQuery` hook file exists at `src/hooks/useMediaQuery.ts`
- [ ] No TypeScript errors in any hook file

---

## PHASE 1 — CUSTOM CURSOR

---

### STEP 1.1 — Custom Cursor (All 5 States + CLICK Label)

> ⚠️ FIX v2: Added "CLICK" label inside ring on button hover (was missing). Added all 5 cursor states.

**Action:** Create `src/components/ui/CustomCursor.tsx`:
```tsx
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useStore } from '../../store/useStore'
import { useIsMobile } from '../../hooks/useMediaQuery'

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const isMobile = useIsMobile()
  const [showClickLabel, setShowClickLabel] = useState(false)

  useEffect(() => {
    if (isMobile) return

    const dot = dotRef.current!
    const ring = ringRef.current!
    let rafId: number

    // Ring lerp state
    let ringX = 0, ringY = 0

    const moveDot = (e: MouseEvent) => {
      gsap.set(dot, { x: e.clientX - 4, y: e.clientY - 4 })
    }

    const animateRing = () => {
      const { mouseRawX: mx, mouseRawY: my } = useStore.getState()
      ringX += (mx - ringX - 16) * 0.12
      ringY += (my - ringY - 16) * 0.12
      gsap.set(ring, { x: ringX, y: ringY })
      rafId = requestAnimationFrame(animateRing)
    }

    window.addEventListener('mousemove', moveDot, { passive: true })
    rafId = requestAnimationFrame(animateRing)

    // STATE 2: Over link — ring expands, dot disappears, blend mode difference
    const handleLinkEnter = () => {
      setShowClickLabel(false)
      gsap.to(ring, { width: 60, height: 60, borderColor: 'rgba(0,245,255,0.6)', duration: 0.3, ease: 'power2.out' })
      gsap.to(dot, { scale: 0, opacity: 0, duration: 0.2 })
      ring.style.mixBlendMode = 'difference'
    }

    // STATE 3: Over button — ring fills cyan 20%, "CLICK" label appears inside
    const handleButtonEnter = () => {
      setShowClickLabel(true)
      gsap.to(ring, {
        width: 56, height: 56,
        backgroundColor: 'rgba(0,245,255,0.2)',
        borderColor: 'rgba(0,245,255,0.8)',
        duration: 0.3, ease: 'power2.out'
      })
      gsap.to(dot, { scale: 0.5, opacity: 1, duration: 0.2 })
      ring.style.mixBlendMode = 'normal'
    }

    // STATE 1: Default — reset all
    const handleLeave = () => {
      setShowClickLabel(false)
      gsap.to(ring, {
        width: 32, height: 32,
        borderColor: 'rgba(0,245,255,0.6)',
        backgroundColor: 'transparent',
        duration: 0.3, ease: 'power2.out'
      })
      gsap.to(dot, { scale: 1, opacity: 1, duration: 0.2 })
      ring.style.mixBlendMode = 'normal'
    }

    // STATE 5: Clicking — spring snap
    const handleMouseDown = () => {
      gsap.to(ring, { scale: 0.8, duration: 0.1, ease: 'power2.out' })
    }
    const handleMouseUp = () => {
      gsap.to(ring, { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.4)' })
    }

    // Attach to all interactive elements
    const links = document.querySelectorAll('a')
    const buttons = document.querySelectorAll('button, [data-magnetic]')

    links.forEach(el => {
      el.addEventListener('mouseenter', handleLinkEnter)
      el.addEventListener('mouseleave', handleLeave)
    })
    buttons.forEach(el => {
      el.addEventListener('mouseenter', handleButtonEnter)
      el.addEventListener('mouseleave', handleLeave)
    })
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', moveDot)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      cancelAnimationFrame(rafId)
    }
  }, [isMobile])

  if (isMobile) return null

  return (
    <>
      <div
        ref={dotRef}
        style={{
          position: 'fixed', top: 0, left: 0,
          width: 8, height: 8,
          background: 'var(--accent-cyan)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9999,
        }}
      />
      <div
        ref={ringRef}
        style={{
          position: 'fixed', top: 0, left: 0,
          width: 32, height: 32,
          border: '1.5px solid rgba(0,245,255,0.6)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background-color 0.2s',
        }}
      >
        {/* CLICK label inside ring — appears on button hover */}
        {showClickLabel && (
          <span
            ref={labelRef}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '7px',
              color: 'var(--accent-cyan)',
              letterSpacing: '0.05em',
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          >
            CLICK
          </span>
        )}
      </div>
    </>
  )
}
```

**Verification:**
- [ ] OS cursor fully hidden
- [ ] Cyan dot follows mouse instantly
- [ ] Ring follows with smooth lag (lerp 0.12)
- [ ] Hovering a link: dot disappears, ring expands to 60px, mix-blend-mode difference
- [ ] Hovering a button: ring fills cyan 20%, "CLICK" appears inside ring
- [ ] Clicking: ring snaps to 0.8 scale then springs back
- [ ] Mobile: no custom cursor (default OS cursor)

---

## PHASE 2 — THREE.JS CANVAS FOUNDATION

---

### STEP 2.1 — Main Scene Canvas (DPR Capped Correctly)

> ⚠️ FIX v2: DPR now uses `Math.min(2, window.devicePixelRatio)` as per system prompt performance checklist.

**Action:** Create `src/components/3D/Scene.tsx`:
```tsx
import { Canvas } from '@react-three/fiber'
import { Preload, AdaptiveDpr, PerformanceMonitor } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration, Vignette, Noise } from '@react-three/postprocessing'
import { Suspense, useState } from 'react'
import { useIsMobile, useIsTablet } from '../../hooks/useMediaQuery'
import { ParticleField } from './ParticleField'

// r3f-perf — development only
let Perf: React.ComponentType<{ position?: string }> | null = null
if (import.meta.env.DEV) {
  import('r3f-perf').then((m) => { Perf = m.Perf })
}

export function Scene() {
  const [dpr, setDpr] = useState(Math.min(1.5, window.devicePixelRatio))
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()

  return (
    <Canvas
      dpr={[1, Math.min(2, window.devicePixelRatio)]}
      camera={{ fov: 75, near: 0.1, far: 100, position: [0, 0, 5] }}
      gl={{
        antialias: !isMobile,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100vw', height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    >
      {/* r3f-perf: development mode only */}
      {import.meta.env.DEV && Perf && <Perf position="top-left" />}

      <PerformanceMonitor
        onDecline={() => setDpr(1)}
        onIncline={() => setDpr(Math.min(1.5, window.devicePixelRatio))}
      />
      <AdaptiveDpr pixelated />

      <ambientLight intensity={0.15} />

      <Suspense fallback={null}>
        <ParticleField count={isMobile ? 1000 : 5000} />
      </Suspense>

      {/* Postprocessing — full on desktop, reduced on tablet, none on mobile */}
      {!isMobile && (
        <EffectComposer>
          <Bloom luminanceThreshold={0.6} luminanceSmoothing={0.9} intensity={0.8} radius={0.4} />
          <ChromaticAberration offset={[0.0005, 0.0005]} />
          <Vignette eskil={false} offset={0.3} darkness={0.8} />
          {!isTablet && <Noise opacity={0.02} />}
        </EffectComposer>
      )}

      <Preload all />
    </Canvas>
  )
}
```

**Verification:**
- [ ] Canvas renders behind HTML (position fixed, z-index 0)
- [ ] `aria-hidden="true"` on canvas element
- [ ] DPR: `Math.min(2, devicePixelRatio)` — not hardcoded 1.5
- [ ] r3f-perf monitor visible in top-left ONLY in dev mode
- [ ] No WebGL context errors
- [ ] Mobile: EffectComposer skipped entirely

---

### STEP 2.2 — Particle Field with Mouse Repulsion

> ⚠️ FIX v2: Added mouse repulsion physics (was missing — particles now react to cursor).

**Action:** Create `src/components/3D/ParticleField.tsx`:
```tsx
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as maath from 'maath/random'
import * as THREE from 'three'
import { useStore } from '../../store/useStore'

interface ParticleFieldProps {
  count?: number
}

export function ParticleField({ count = 5000 }: ParticleFieldProps) {
  const ref = useRef<THREE.Points>(null)

  // Store original positions for repulsion lerp-back
  const { positions, originalPositions } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    maath.inSphere(pos, { radius: 8 })
    const original = new Float32Array(pos)
    return { positions: pos, originalPositions: original }
  }, [count])

  useFrame((_, delta) => {
    if (!ref.current) return
    // Continuous rotation
    ref.current.rotation.x -= delta / 30
    ref.current.rotation.y -= delta / 20

    // Mouse repulsion
    const { mouseX, mouseY } = useStore.getState()
    const posArray = (ref.current.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array
    const REPULSION_RADIUS = 0.5
    const REPULSION_STRENGTH = 0.02

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const dx = posArray[i3] - mouseX * 4
      const dy = posArray[i3 + 1] - mouseY * 4
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < REPULSION_RADIUS && dist > 0) {
        const strength = (REPULSION_RADIUS - dist) / REPULSION_RADIUS * REPULSION_STRENGTH
        posArray[i3] += (dx / dist) * strength
        posArray[i3 + 1] += (dy / dist) * strength
      }

      // Lerp back to original position
      posArray[i3] += (originalPositions[i3] - posArray[i3]) * 0.02
      posArray[i3 + 1] += (originalPositions[i3 + 1] - posArray[i3 + 1]) * 0.02
      posArray[i3 + 2] += (originalPositions[i3 + 2] - posArray[i3 + 2]) * 0.02
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points
        ref={ref}
        positions={positions}
        stride={3}
        frustumCulled={false}
      >
        <PointMaterial
          transparent
          color="#00F5FF"
          size={0.008}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  )
}
```

Add `<Scene />` to `App.tsx` — this comes before SmoothScrollProvider:
```tsx
import { Scene } from './components/3D/Scene'
// In JSX: <Scene /> as first child of root div, before SmoothScrollProvider
```

**Verification:**
- [ ] Cyan particles visible, rotating continuously
- [ ] Moving mouse: particles near cursor gently push away
- [ ] Particles drift back to original position after cursor moves away
- [ ] On mobile: 1000 particles (count prop works)
- [ ] Canvas stays behind HTML (z-index 0)
- [ ] FPS above 55 (check with r3f-perf in dev mode)

---

## PHASE 3 — NAVBAR

---

### STEP 3.1 — Navbar Component

**Action:** Create `src/components/ui/Navbar.tsx`:

Navbar MUST include:
- Left: "UM" monogram in `var(--accent-cyan)`, Syne 700
- Center: Nav links — `['About', 'Skills', 'Projects', 'Experience', 'Contact']`
- Right: "Download CV" button (outlined, magnetic)
- Bottom: 1px scroll progress bar in cyan (use `useScrollProgress` hook from its dedicated file)
- Background: `rgba(5,5,8,0.6)`, `backdropFilter: blur(20px)`
- Border-bottom: `1px solid var(--border-subtle)`
- Active section: Link gets cyan underline (animated width 0→100%)
- Links use `useLenis` from `lenis/react` for smooth programmatic scroll
- Mobile: hamburger → fullscreen overlay with Framer Motion AnimatePresence

```tsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLenis } from 'lenis/react'
import { useScrollProgress } from '../../hooks/useScrollProgress'
import { useStore } from '../../store/useStore'
import { useIsMobile } from '../../hooks/useMediaQuery'
import { MagneticButton } from './MagneticButton'

const NAV_LINKS = ['About', 'Skills', 'Projects', 'Experience', 'Contact']

export function Navbar() {
  const scrollProgress = useScrollProgress()
  const activeSection = useStore((s) => s.activeSection)
  const isMobile = useIsMobile()
  const [menuOpen, setMenuOpen] = useState(false)
  const lenis = useLenis()

  const scrollTo = (section: string) => {
    lenis?.scrollTo(`#${section.toLowerCase()}`, { duration: 1.2 })
    setMenuOpen(false)
  }

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0,
      height: 64, zIndex: 100,
      background: 'rgba(5,5,8,0.6)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border-subtle)',
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
    }}>
      {/* Monogram */}
      <span style={{
        fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem',
        color: 'var(--accent-cyan)', letterSpacing: '-0.02em',
        cursor: 'pointer', textShadow: 'var(--glow-cyan)',
      }} onClick={() => lenis?.scrollTo(0)}>UM</span>

      {/* Desktop Nav Links */}
      {!isMobile && (
        <div style={{ display: 'flex', gap: '2rem' }}>
          {NAV_LINKS.map((link) => (
            <button
              key={link}
              onClick={() => scrollTo(link)}
              data-magnetic
              style={{
                background: 'none', border: 'none', cursor: 'none',
                fontFamily: 'var(--font-body)', fontSize: '0.75rem',
                letterSpacing: '0.15em', textTransform: 'uppercase',
                color: activeSection === link.toLowerCase() ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                transition: 'color 0.2s',
                position: 'relative',
              }}
            >
              {link}
              {activeSection === link.toLowerCase() && (
                <motion.div
                  layoutId="nav-underline"
                  style={{
                    position: 'absolute', bottom: -4, left: 0, right: 0,
                    height: 1, background: 'var(--accent-cyan)',
                  }}
                />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Right: CV button + hamburger */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {!isMobile && <MagneticButton outlined>Download CV</MagneticButton>}
        {isMobile && (
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}>
            <span style={{ fontFamily: 'var(--font-body)', color: 'var(--accent-cyan)' }}>
              {menuOpen ? '✕' : '☰'}
            </span>
          </button>
        )}
      </div>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed', inset: 0, top: 64,
              background: 'rgba(5,5,8,0.97)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: '2rem',
              zIndex: 99,
            }}
          >
            {NAV_LINKS.map((link, i) => (
              <motion.button
                key={link}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                onClick={() => scrollTo(link)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '2rem',
                  color: 'var(--text-primary)', letterSpacing: '-0.02em',
                }}
              >
                {link}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll progress bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0,
        height: 1,
        width: `${scrollProgress * 100}%`,
        background: 'var(--accent-cyan)',
        transition: 'width 0.1s linear',
      }} />
    </nav>
  )
}
```

**Verification:**
- [ ] Navbar fixed at top, visible above all content
- [ ] Glassmorphism: dark tint + blur visible
- [ ] All 5 nav links render (About, Skills, Projects, Experience, Contact)
- [ ] Scroll progress bar grows as page scrolls
- [ ] "Download CV" button visible on desktop
- [ ] Mobile: hamburger at <768px, fullscreen overlay menu opens
- [ ] `useScrollProgress` imported from its DEDICATED hook file

---

## PHASE 4 — LOADING SCREEN (3D CANVAS)

---

### STEP 4.1 — Loading Screen with 3D Canvas

> ⚠️ FIX v2: Loading screen MUST use a Three.js canvas with 3D "UM" monogram + particle ring.
> The original plain DOM "UM" text is NOT acceptable — violates system prompt quality standard #6.

**Action:** Create `src/components/ui/LoadingScreen.tsx`:
```tsx
import { useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Float, Text3D } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import * as THREE from 'three'
import { useStore } from '../../store/useStore'
import { useFrame } from '@react-three/fiber'
import { useMemo } from 'react'

// Particle ring orbiting the monogram — 200 particles in torus path
function ParticleRing() {
  const ref = useRef<THREE.Points>(null)
  const positions = useMemo(() => {
    const pos = new Float32Array(200 * 3)
    for (let i = 0; i < 200; i++) {
      const angle = (i / 200) * Math.PI * 2
      const jitter = (Math.random() - 0.5) * 0.2
      pos[i * 3]     = Math.cos(angle) * (1.8 + jitter)
      pos[i * 3 + 1] = Math.sin(angle) * (1.8 + jitter)
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.3
    }
    return pos
  }, [])

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * 0.5
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#00F5FF"
        size={0.04}
        transparent
        opacity={0.8}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// 3D UM Monogram
function UMMonogram() {
  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.4}>
      <Text3D
        font="/fonts/helvetiker_regular.typeface.json"
        size={0.8}
        height={0.15}
        curveSegments={12}
        position={[-0.85, -0.4, 0]}
      >
        UM
        <meshStandardMaterial
          color="#00F5FF"
          metalness={0.9}
          roughness={0.1}
          emissive="#00F5FF"
          emissiveIntensity={0.3}
        />
      </Text3D>
      <pointLight color="#00F5FF" intensity={3} position={[0, 0, 2]} />
    </Float>
  )
}

export function LoadingScreen() {
  const isLoaded = useStore((s) => s.isLoaded)
  const setLoaded = useStore((s) => s.setLoaded)
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!progressRef.current) return
    gsap.to(progressRef.current, {
      width: '100%',
      duration: 2.5,
      ease: 'power1.inOut',
      onComplete: () => setTimeout(() => setLoaded(), 300),
    })
  }, [setLoaded])

  return (
    <AnimatePresence>
      {!isLoaded && (
        <motion.div
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'fixed', inset: 0,
            background: 'var(--bg-base)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            zIndex: 10000,
          }}
        >
          {/* 3D Canvas — UM monogram + particle ring */}
          <div style={{ width: '100%', height: '60vh' }}>
            <Canvas
              camera={{ fov: 75, position: [0, 0, 5] }}
              gl={{ alpha: true, antialias: true }}
            >
              <ambientLight intensity={0.2} />
              <UMMonogram />
              <ParticleRing />
            </Canvas>
          </div>

          {/* Progress bar + label */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginTop: '2rem' }}>
            <div style={{
              width: '200px', height: '1px',
              background: 'var(--border-subtle)',
              position: 'relative',
            }}>
              <div
                ref={progressRef}
                style={{
                  position: 'absolute', top: 0, left: 0,
                  height: '100%', width: '0%',
                  background: 'var(--accent-cyan)',
                  boxShadow: 'var(--glow-cyan)',
                }}
              />
            </div>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.7rem',
              color: 'var(--text-secondary)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}>
              Loading Uzair's Universe...
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

**IMPORTANT — Download font file:**
```bash
# Run this command to get the 3D font for Text3D
curl -o public/fonts/helvetiker_regular.typeface.json \
  https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/helvetiker_regular.typeface.json
```
Create `public/fonts/` directory first: `mkdir -p public/fonts`

**Verification:**
- [ ] Loading screen appears on first load
- [ ] 3D "UM" text visible and floating (not a plain DOM div)
- [ ] Particle ring orbits the monogram
- [ ] Progress bar grows 0% → 100% over ~2.5s
- [ ] After completion: screen exits with scale+opacity animation
- [ ] Main content visible after exit
- [ ] z-index is 10000 (above cursor, above everything)

---

## PHASE 5 — HERO SECTION

---

### STEP 5.1 — Hero 3D Scene

**Action:** Create `src/components/3D/HeroScene.tsx`:
> File name is `HeroScene.tsx` (NOT `HeroText3D.tsx` — design.md and task.md agree on HeroScene).

```tsx
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text3D, Float } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '../../store/useStore'

interface HeroSceneProps {
  groupRef?: React.RefObject<THREE.Group>
}

export function HeroScene({ groupRef }: HeroSceneProps) {
  const lightRef = useRef<THREE.PointLight>(null)

  useFrame((state) => {
    const { mouseX, mouseY } = useStore.getState()

    // Camera tilt based on mouse
    state.camera.position.x += (mouseX * 0.5 - state.camera.position.x) * 0.03
    state.camera.position.y += (mouseY * 0.3 - state.camera.position.y) * 0.03
    state.camera.lookAt(0, 0, 0)

    // Point light follows mouse
    if (lightRef.current) {
      lightRef.current.position.x += (mouseX * 3 - lightRef.current.position.x) * 0.05
      lightRef.current.position.y += (mouseY * 3 - lightRef.current.position.y) * 0.05
    }
  })

  return (
    <group ref={groupRef}>
      <pointLight ref={lightRef} color="#00F5FF" intensity={3} position={[0, 0, 3]} />
      <ambientLight intensity={0.1} />
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
        <Text3D
          font="/fonts/helvetiker_regular.typeface.json"
          size={0.55}
          height={0.12}
          curveSegments={12}
          position={[-2.2, 0.3, 0]}
        >
          UZAIR
          <meshStandardMaterial
            color="#00F5FF"
            metalness={0.9}
            roughness={0.1}
          />
        </Text3D>
        <Text3D
          font="/fonts/helvetiker_regular.typeface.json"
          size={0.55}
          height={0.12}
          curveSegments={12}
          position={[-2.6, -0.4, 0]}
        >
          MANZOOR
          <meshStandardMaterial
            color="#00F5FF"
            metalness={0.9}
            roughness={0.1}
          />
        </Text3D>
      </Float>
    </group>
  )
}
```

Add `<HeroScene />` inside `<Scene />` canvas (inside Suspense):
```tsx
// In Scene.tsx, inside <Suspense fallback={null}>:
import { HeroScene } from './HeroScene'
// ...
<HeroScene groupRef={heroGroupRef} />
```

**Verification:**
- [ ] "UZAIR MANZOOR" renders in 3D (metallic cyan) — centered in viewport
- [ ] Text floats gently (Float component working)
- [ ] Moving mouse tilts camera (max ±0.5 on x/y)
- [ ] No "font not found" 404 errors (font downloaded in Phase 4)
- [ ] Text does NOT block pointer events (canvas has `pointerEvents: none`)

---

### STEP 5.2 — Hero Section DOM

**Action:** Create `src/sections/Hero.tsx`:
```tsx
import { useLayoutEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

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
      <div className="hero-content" style={{ textAlign: 'center', position: 'relative', zIndex: 10 }}>
        {/* Invisible spacer — 3D text is the visual name */}
        <div style={{ height: '140px' }} aria-hidden="true" />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-sub)',
            color: 'var(--text-secondary)',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
          }}
        >
          MERN Stack Developer
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{
            marginTop: '1rem',
            padding: '0.4rem 1rem',
            border: '1px solid var(--border-glow)',
            borderRadius: '100px',
            background: 'rgba(0,245,255,0.05)',
            display: 'inline-block',
            fontFamily: 'var(--font-body)',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
          }}
        >
          📍 Kanpur, UP · Open to Remote
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        style={{
          position: 'absolute', bottom: '2rem',
          fontFamily: 'var(--font-body)',
          fontSize: '0.7rem',
          color: 'var(--accent-amber)',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
        }}
      >
        ↓ SCROLL TO EXPLORE
      </motion.div>
    </section>
  )
}
```

**Verification:**
- [ ] "MERN Stack Developer" appears with delayed fade-in
- [ ] Location chip appears after subtitle
- [ ] Scroll indicator bounces continuously
- [ ] Scrolling: DOM text fades out smoothly (scrub works)
- [ ] Section height exactly 100vh

---

## PHASE 6 — ABOUT SECTION

---

### STEP 6.1 — About 3D Geometry (Morphing Icosahedron + Dissolve Exit)

> ⚠️ FIX v2: Dissolve-into-particles exit animation is now REQUIRED (was missing in v1).

**Action:** Create `src/components/3D/AboutGeometry.tsx`:
```tsx
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '../../store/useStore'

interface AboutGeometryProps {
  scrollProgress: number   // 0→1 from About section's ScrollTrigger
}

export function AboutGeometry({ scrollProgress }: AboutGeometryProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const pointsRef = useRef<THREE.Points>(null)
  const groupRef = useRef<THREE.Group>(null)

  // Build dissolve particles from icosahedron vertices
  const dissolvePositions = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1.5, 4)
    return geo.attributes.position.array as Float32Array
  }, [])

  useFrame((_, delta) => {
    if (!meshRef.current || !pointsRef.current) return
    const { mouseX, mouseY } = useStore.getState()

    // Mesh floats + reacts to mouse
    meshRef.current.rotation.y += delta * 0.3
    meshRef.current.rotation.x += (mouseY * 0.2 - meshRef.current.rotation.x) * 0.05

    // DISSOLVE: Progress 0→0.6 = solid mesh; 0.6→1.0 = dissolve into particles
    const dissolveStart = 0.6
    if (scrollProgress < dissolveStart) {
      // Solid mesh phase
      meshRef.current.visible = true
      pointsRef.current.visible = false
      const mat = meshRef.current.material as any
      if (mat.distort !== undefined) {
        mat.distort = (scrollProgress / dissolveStart) * 0.6
      }
      // Scale in on enter
      const enterScale = Math.min(1, scrollProgress * 5)
      groupRef.current!.scale.setScalar(enterScale)
    } else {
      // Dissolve phase
      const dissolveProgress = (scrollProgress - dissolveStart) / (1 - dissolveStart) // 0→1
      meshRef.current.visible = dissolveProgress < 0.5
      pointsRef.current.visible = true

      // Mesh fades
      const meshMat = meshRef.current.material as THREE.Material
      meshMat.opacity = 1 - dissolveProgress * 2
      meshMat.transparent = true

      // Points opacity and scatter
      const ptMat = pointsRef.current.material as THREE.PointsMaterial
      ptMat.opacity = dissolveProgress
      const pos = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute
      const arr = pos.array as Float32Array
      for (let i = 0; i < arr.length; i++) {
        arr[i] = dissolvePositions[i] * (1 + dissolveProgress * 0.5)
      }
      pos.needsUpdate = true
    }
  })

  return (
    <group ref={groupRef} scale={0} position={[-1, 0, 0]}>
      {/* Main morphing mesh */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.5, 4]} />
        <MeshDistortMaterial
          color="#7B2FBE"
          distort={0}
          speed={2}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>

      {/* Dissolve particle cloud */}
      <points ref={pointsRef} visible={false}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[dissolvePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#7B2FBE"
          size={0.04}
          transparent
          opacity={0}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  )
}
```

Add `<AboutGeometry />` to `Scene.tsx`, inside Suspense. Pass `scrollProgress` from useStore.

**Verification:**
- [ ] Icosahedron renders (violet, metallic) left side of screen
- [ ] As About section scrolls: distort increases (mesh warps)
- [ ] Past 60% scroll: mesh fades, particles appear and scatter outward
- [ ] Mouse moves: mesh rotates on X axis toward cursor

---

### STEP 6.2 — About Section DOM

**Action:** Create `src/sections/About.tsx`:
```tsx
import { useLayoutEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { portfolioData } from '../data/portfolioData'
import { MagneticButton } from '../components/ui/MagneticButton'

export function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLParagraphElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Pin section for 150vh scroll distance
      ScrollTrigger.create({
        trigger: '#about',
        start: 'top top',
        end: '+=150%',
        pin: true,
        scrub: 1,
      })

      // Word-by-word stagger reveal
      if (textRef.current) {
        const words = portfolioData.summary.split(' ')
        textRef.current.innerHTML = words
          .map(w => `<span style="opacity:0;display:inline-block;margin-right:0.3em">${w}</span>`)
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

      // Stats cards stagger in
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
      <div style={{
        maxWidth: '1200px', margin: '0 auto',
        display: 'grid', gridTemplateColumns: '45% 55%',
        gap: '4rem', alignItems: 'center',
        width: '100%',
      }}>
        {/* Left: 3D scene placeholder (actual 3D is in Scene.tsx) */}
        <div style={{ height: '400px' }} aria-hidden="true" />

        {/* Right: Content */}
        <div>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '0.7rem',
            color: 'var(--accent-cyan)', letterSpacing: '0.2em',
            textTransform: 'uppercase', marginBottom: '1rem',
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

          <p
            ref={textRef}
            style={{
              fontFamily: 'var(--font-body)', fontSize: '0.9rem',
              color: 'var(--text-secondary)', lineHeight: 1.7,
              marginBottom: '2rem',
            }}
          >
            {portfolioData.summary}
          </p>

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
                  fontFamily: 'var(--font-body)', fontSize: '0.7rem',
                  color: 'var(--text-secondary)', letterSpacing: '0.1em',
                  textTransform: 'uppercase', marginTop: '0.25rem',
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          <MagneticButton onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}>
            View Projects ↓
          </MagneticButton>
        </div>
      </div>
    </section>
  )
}
```

**Verification:**
- [ ] Section pinned while content reveals (ScrollTrigger pin working)
- [ ] Summary text reveals word by word on scroll
- [ ] 3 stat cards appear with stagger
- [ ] "// 001 — ABOUT" label correct
- [ ] "View Projects ↓" button is magnetic

---

## PHASE 7 — SKILLS SECTION

---

### STEP 7.1 — Skills Orbs (Orbital 3D Spheres)

**Action:** Create `src/components/3D/SkillsOrbs.tsx`:
```tsx
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const ORBS = [
  { label: 'React/Next',  color: '#61DAFB', orbitR: 2.5, speed: 0.4, angle: 0 },
  { label: 'Node/Express',color: '#68A063', orbitR: 2.5, speed: 0.35, angle: Math.PI / 4 },
  { label: 'MongoDB',     color: '#47A248', orbitR: 3.2, speed: 0.3,  angle: Math.PI / 2 },
  { label: 'Socket.IO',   color: '#010101', orbitR: 3.2, speed: 0.45, angle: (3 * Math.PI) / 4 },
  { label: 'GSAP/Three',  color: '#88CE02', orbitR: 2.8, speed: 0.25, angle: Math.PI },
  { label: 'Tailwind',    color: '#38BDF8', orbitR: 2.8, speed: 0.5,  angle: (5 * Math.PI) / 4 },
  { label: 'Redis/JWT',   color: '#FF4438', orbitR: 3.5, speed: 0.38, angle: (3 * Math.PI) / 2 },
  { label: 'Git/GitHub',  color: '#F05032', orbitR: 3.5, speed: 0.28, angle: (7 * Math.PI) / 4 },
]

export function SkillsOrbs({ scrollProgress = 0 }: { scrollProgress?: number }) {
  const refs = useRef<(THREE.Mesh | null)[]>([])
  const time = useRef(0)

  useFrame((_, delta) => {
    time.current += delta
    // Speed scales with scroll progress: 0.3 → 1.5
    const speed = 0.3 + scrollProgress * 1.2

    ORBS.forEach((orb, i) => {
      const mesh = refs.current[i]
      if (!mesh) return
      const angle = orb.angle + time.current * orb.speed * speed
      mesh.position.x = Math.cos(angle) * orb.orbitR
      mesh.position.z = Math.sin(angle) * orb.orbitR * 0.4
      mesh.position.y = Math.sin(angle * 0.5) * 0.4
      mesh.rotation.y += delta * 0.5
    })
  })

  return (
    <group>
      {ORBS.map((orb, i) => (
        <mesh
          key={orb.label}
          ref={(el) => { refs.current[i] = el }}
          onPointerEnter={(e) => {
            e.stopPropagation()
            const mesh = refs.current[i]
            if (mesh) {
              const mat = mesh.material as THREE.MeshStandardMaterial
              mat.emissiveIntensity = 1
            }
          }}
          onPointerLeave={() => {
            const mesh = refs.current[i]
            if (mesh) {
              const mat = mesh.material as THREE.MeshStandardMaterial
              mat.emissiveIntensity = 0.2
            }
          }}
        >
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial
            color={orb.color}
            emissive={orb.color}
            emissiveIntensity={0.2}
            metalness={0.7}
            roughness={0.2}
          />
        </mesh>
      ))}
      {/* Central hub glow */}
      <mesh>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial
          color="#00F5FF"
          emissive="#00F5FF"
          emissiveIntensity={0.8}
          metalness={0.9}
          roughness={0}
        />
      </mesh>
    </group>
  )
}
```

Add `<SkillsOrbs />` to Scene.tsx with scrollProgress from useStore. Show only when activeSection === 'skills'.

**Verification:**
- [ ] 8 colored spheres orbit in elliptical paths
- [ ] Central cyan hub visible
- [ ] Hovering a sphere: glow intensifies
- [ ] Scroll through Skills section: orbit speed increases

---

### STEP 7.2 — Skills Section DOM + SkillTag Component

> ⚠️ FIX v2: `SkillTag.tsx` is now a DEDICATED component file.

**Action:** Create `src/components/ui/SkillTag.tsx`:
```tsx
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
```

**Action:** Create `src/sections/Skills.tsx`:
```tsx
import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { portfolioData } from '../data/portfolioData'
import { SkillTag } from '../components/ui/SkillTag'

const SKILL_GROUPS = [
  { title: 'Frontend Development', skills: portfolioData.skills.frontend, variant: 'default' as const },
  { title: 'Backend Development', skills: portfolioData.skills.backend, variant: 'default' as const },
  { title: 'Database & Storage', skills: portfolioData.skills.database, variant: 'default' as const },
  { title: 'Tools & Platforms', skills: portfolioData.skills.tools, variant: 'default' as const },
  { title: 'AI & Integrations', skills: portfolioData.skills.ai, variant: 'default' as const },
  { title: 'Currently Learning', skills: portfolioData.skills.learning, variant: 'learning' as const },
]

export function Skills() {
  const sectionRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.skill-group', {
        opacity: 0, y: 40, stagger: 0.12,
        scrollTrigger: {
          trigger: '#skills',
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        }
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="skills"
      ref={sectionRef}
      style={{
        minHeight: '120vh', padding: '8rem 2rem',
        position: 'relative', zIndex: 10,
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: '0.7rem',
          color: 'var(--accent-cyan)', letterSpacing: '0.2em',
          textTransform: 'uppercase', marginBottom: '1rem',
        }}>
          // 002 — SKILLS
        </p>

        <h2 style={{
          fontFamily: 'var(--font-display)', fontWeight: 700,
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          color: 'var(--text-primary)', letterSpacing: '-0.02em',
          marginBottom: '4rem',
        }}>
          What I work with.
        </h2>

        {/* 3D orbs spacer (actual 3D above in canvas) */}
        <div style={{ height: '300px' }} aria-hidden="true" />

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2.5rem',
        }}>
          {SKILL_GROUPS.map((group) => (
            <div key={group.title} className="skill-group">
              <h3 style={{
                fontFamily: 'var(--font-body)', fontSize: '0.75rem',
                color: 'var(--text-secondary)', letterSpacing: '0.15em',
                textTransform: 'uppercase', marginBottom: '0.75rem',
              }}>
                {group.title}
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {group.skills.map((skill) => (
                  <SkillTag key={skill} label={skill} variant={group.variant} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

**Verification:**
- [ ] `SkillTag.tsx` exists as its own dedicated file in `src/components/ui/`
- [ ] All 6 skill groups render with correct labels
- [ ] "Currently Learning" tags are amber + dashed border
- [ ] Hovering any tag: cyan border + bg
- [ ] Skill groups stagger in on scroll
- [ ] "// 002 — SKILLS" label correct

---

## PHASE 8 — PROJECTS SECTION

---

### STEP 8.1 — Projects 3D Carousel (DepthOfField on Inactive)

> ⚠️ FIX v2: DepthOfField on inactive project cards is now REQUIRED (was missing in v1).

**Action:** Create `src/components/3D/ProjectCarousel3D.tsx`:
```tsx
import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { DepthOfField, EffectComposer } from '@react-three/postprocessing'
import * as THREE from 'three'
import { useStore } from '../../store/useStore'

const STATIONS = [
  { position: [-4, 0, 0] as [number, number, number], color: '#00F5FF', id: 'sirp' },
  { position: [4, 0, 0] as [number, number, number],  color: '#FF6B35', id: 'jobportal' },
]

interface ProjectCarousel3DProps {
  scrollProgress: number   // 0→1 from Projects ScrollTrigger
}

export function ProjectCarousel3D({ scrollProgress }: ProjectCarousel3DProps) {
  const meshRefs = useRef<(THREE.Mesh | null)[]>([])
  const { setActiveProjectIndex } = useStore.getState()

  useFrame((state) => {
    const { mouseX } = useStore.getState()
    // Camera travels from x:-6 → x:+6 based on scroll
    const targetX = -6 + scrollProgress * 12
    state.camera.position.x += (targetX - state.camera.position.x) * 0.05
    state.camera.lookAt(targetX, 0, 0)

    // Determine active station (closest to camera)
    const activeIdx = state.camera.position.x < 0 ? 0 : 1
    setActiveProjectIndex(activeIdx)

    STATIONS.forEach((station, i) => {
      const mesh = meshRefs.current[i]
      if (!mesh) return
      const isActive = i === activeIdx
      const targetScale = isActive ? 1.05 : 0.9
      mesh.scale.setScalar(mesh.scale.x + (targetScale - mesh.scale.x) * 0.05)
      // Subtle mouse tilt on active
      if (isActive) {
        mesh.rotation.y += (mouseX * 0.1 - mesh.rotation.y) * 0.05
      }
    })
  })

  return (
    <>
      {STATIONS.map((station, i) => (
        <mesh
          key={station.id}
          ref={(el) => { meshRefs.current[i] = el }}
          position={station.position}
        >
          <planeGeometry args={[4, 2.5]} />
          <meshStandardMaterial
            color={station.color}
            emissive={station.color}
            emissiveIntensity={0.15}
            metalness={0.3}
            roughness={0.7}
          />
        </mesh>
      ))}
    </>
  )
}
```

**DepthOfField Integration in Scene.tsx:**
```tsx
// In Scene.tsx — add conditional DepthOfField inside EffectComposer
import { DepthOfField } from '@react-three/postprocessing'
import { useStore } from '../../store/useStore'

// Inside <EffectComposer> (desktop only):
const isProjectsActive = useStore((s) => s.isProjectsActive)
const activeProjectIndex = useStore((s) => s.activeProjectIndex)
// focusDistance: 0.003 for near station, 0.012 for far station
{isProjectsActive && (
  <DepthOfField
    focusDistance={activeProjectIndex === 0 ? 0.003 : 0.012}
    focalLength={0.02}
    bokehScale={3}
  />
)}
```

**Verification:**
- [ ] Two colored planes visible (cyan SIRP, amber Job Portal)
- [ ] Camera travels horizontally as Projects section scrolls
- [ ] Active card: scale 1.05; Inactive: scale 0.9 + blurred (DepthOfField)
- [ ] Active station determined by camera.position.x < 0

---

### STEP 8.2 — Projects Section DOM (Horizontal Scroll Cards)

**Action:** Create `src/sections/Projects.tsx`:
```tsx
import { useLayoutEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { portfolioData } from '../data/portfolioData'
import { SkillTag } from '../components/ui/SkillTag'
import { useStore } from '../store/useStore'

export function Projects() {
  const sectionRef = useRef<HTMLElement>(null)
  const activeProjectIndex = useStore((s) => s.activeProjectIndex)
  const setProjectsActive = useStore((s) => s.setProjectsActive)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Horizontal scroll: pin for 300vh
      ScrollTrigger.create({
        trigger: '#projects',
        start: 'top top',
        end: '+=300%',
        pin: true,
        onEnter: () => setProjectsActive(true),
        onLeave: () => setProjectsActive(false),
        onEnterBack: () => setProjectsActive(true),
        onLeaveBack: () => setProjectsActive(false),
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const currentProject = portfolioData.projects[activeProjectIndex]

  return (
    <section
      id="projects"
      ref={sectionRef}
      style={{
        height: '100vh', position: 'relative',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'flex-end', padding: '0 0 3rem',
        zIndex: 10,
      }}
    >
      {/* Section label at top */}
      <div style={{ position: 'absolute', top: '6rem', left: '2rem' }}>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: '0.7rem',
          color: 'var(--accent-cyan)', letterSpacing: '0.2em',
          textTransform: 'uppercase', marginBottom: '0.5rem',
        }}>
          // 003 — PROJECTS
        </p>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontWeight: 700,
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          color: 'var(--text-primary)', letterSpacing: '-0.02em',
        }}>
          Things I've built.
        </h2>
      </div>

      {/* Project card — appears at bottom, changes with active project */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentProject.id}
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{
            maxWidth: '540px',
            margin: '0 auto',
            padding: '2rem',
            background: 'rgba(13,13,20,0.85)',
            backdropFilter: 'blur(20px)',
            border: '1px solid var(--border-glow)',
            borderRadius: '16px',
          }}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2)
            const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2)
            gsap.to(e.currentTarget, {
              rotateX: -y * 10, rotateY: x * 10,
              transformPerspective: 1000, duration: 0.3, ease: 'power2.out',
            })
          }}
          onMouseLeave={(e) => {
            gsap.to(e.currentTarget, {
              rotateX: 0, rotateY: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)',
            })
          }}
        >
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '0.65rem',
            color: 'var(--text-secondary)', letterSpacing: '0.15em',
            textTransform: 'uppercase', marginBottom: '0.5rem',
          }}>
            {currentProject.type}
          </p>

          <h3 style={{
            fontFamily: 'var(--font-display)', fontWeight: 700,
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            color: 'var(--text-primary)', letterSpacing: '-0.02em',
            marginBottom: '0.75rem',
          }}>
            {currentProject.name}
            <span style={{ fontSize: '0.9rem', fontWeight: 400, color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>
              — {currentProject.fullName}
            </span>
          </h3>

          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '0.85rem',
            color: 'var(--text-secondary)', lineHeight: 1.6,
            marginBottom: '1rem',
          }}>
            {currentProject.description}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
            {currentProject.stack.map((tech) => (
              <SkillTag key={tech} label={tech} />
            ))}
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <a
              href={currentProject.live}
              target="_blank" rel="noopener noreferrer"
              style={{
                fontFamily: 'var(--font-body)', fontSize: '0.8rem',
                color: 'var(--accent-cyan)', letterSpacing: '0.1em',
                textDecoration: 'none', textTransform: 'uppercase',
                border: '1px solid var(--border-glow)',
                padding: '0.4rem 1rem', borderRadius: '4px',
                transition: 'background 0.2s',
              }}
            >
              🌐 Live Demo ↗
            </a>
            {currentProject.github && (
              <a
                href={currentProject.github}
                target="_blank" rel="noopener noreferrer"
                style={{
                  fontFamily: 'var(--font-body)', fontSize: '0.8rem',
                  color: 'var(--text-secondary)', letterSpacing: '0.1em',
                  textDecoration: 'none', textTransform: 'uppercase',
                  border: '1px solid var(--border-subtle)',
                  padding: '0.4rem 1rem', borderRadius: '4px',
                  transition: 'all 0.2s',
                }}
              >
                GitHub ↗
              </a>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dots indicator */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
        {portfolioData.projects.map((_, i) => (
          <div key={i} style={{
            width: i === activeProjectIndex ? '24px' : '8px',
            height: '8px', borderRadius: '4px',
            background: i === activeProjectIndex ? 'var(--accent-cyan)' : 'var(--border-subtle)',
            transition: 'all 0.3s ease',
          }} />
        ))}
      </div>
    </section>
  )
}
```

**Verification:**
- [ ] Section pins for 300vh of scroll
- [ ] "// 003 — PROJECTS" label correct
- [ ] SIRP card shows first (live URL: smarterresponse.xyz, no GitHub)
- [ ] Job Portal shows second (both live + GitHub links)
- [ ] Card changes with AnimatePresence (smooth swap)
- [ ] Card 3D tilt on mouse hover
- [ ] Dot indicator updates with active project

---

## PHASE 9 — EXPERIENCE SECTION

---

### STEP 9.1 — ExperienceScene 3D (Rotating Torus Wireframe)

> ⚠️ FIX v2: This ENTIRE component was MISSING in v1. Now required.

**Action:** Create `src/components/3D/ExperienceScene.tsx`:
```tsx
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '../../store/useStore'

export function ExperienceScene() {
  const ringRef = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (!ringRef.current) return
    const { mouseX, mouseY } = useStore.getState()

    // Continuous rotation
    ringRef.current.rotation.x += delta * 0.3
    ringRef.current.rotation.y += delta * 0.2

    // Mouse tilt
    ringRef.current.rotation.x += (mouseY * 0.5 - ringRef.current.rotation.x) * 0.05
    ringRef.current.rotation.y += (mouseX * 0.5 - ringRef.current.rotation.y) * 0.05
  })

  return (
    <mesh ref={ringRef} position={[2.5, 0, 0]} scale={1.5}>
      <torusGeometry args={[1.2, 0.015, 100, 200]} />
      <meshBasicMaterial color="#7B2FBE" wireframe />
    </mesh>
  )
}
```

Add `<ExperienceScene />` to Scene.tsx — show only when activeSection === 'experience'.

**Verification:**
- [ ] `ExperienceScene.tsx` file exists at `src/components/3D/ExperienceScene.tsx`
- [ ] Rotating torus ring visible (violet wireframe)
- [ ] Torus tilts toward cursor
- [ ] Only visible during Experience section scroll position

---

### STEP 9.2 — Experience Section DOM (Timeline)

**Action:** Create `src/sections/Experience.tsx`:
```tsx
import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { portfolioData } from '../data/portfolioData'

export function Experience() {
  const sectionRef = useRef<HTMLElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Timeline line grows from top on scroll
      gsap.fromTo(lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: 'top center',
          ease: 'none',
          scrollTrigger: {
            trigger: '#experience',
            start: 'top 60%',
            end: 'bottom 40%',
            scrub: 1,
          }
        }
      )

      // Each bullet point slides in from left
      gsap.from('.exp-bullet', {
        opacity: 0, x: -30,
        stagger: 0.1,
        scrollTrigger: {
          trigger: '#experience',
          start: 'top 50%',
          toggleActions: 'play none none reverse',
        }
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="experience"
      ref={sectionRef}
      style={{
        minHeight: '120vh', padding: '8rem 2rem',
        position: 'relative', zIndex: 10,
      }}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: '0.7rem',
          color: 'var(--accent-cyan)', letterSpacing: '0.2em',
          textTransform: 'uppercase', marginBottom: '1rem',
        }}>
          // 003 — EXPERIENCE
        </p>

        <h2 style={{
          fontFamily: 'var(--font-display)', fontWeight: 700,
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          color: 'var(--text-primary)', letterSpacing: '-0.02em',
          marginBottom: '4rem',
        }}>
          Where I've worked.
        </h2>

        <div style={{ position: 'relative', paddingLeft: '2rem' }}>
          {/* Growing timeline line */}
          <div
            ref={lineRef}
            style={{
              position: 'absolute', left: 0, top: 0, bottom: 0,
              width: '2px', background: 'var(--accent-cyan)',
              transformOrigin: 'top center',
            }}
          />
          {/* Dot */}
          <div style={{
            position: 'absolute', left: '-5px', top: 0,
            width: '12px', height: '12px',
            borderRadius: '50%', background: 'var(--accent-cyan)',
            boxShadow: 'var(--glow-cyan)',
          }} />

          {portfolioData.experience.map((job) => (
            <div key={job.company} style={{ marginBottom: '3rem' }}>
              <div style={{ marginBottom: '0.5rem' }}>
                <span style={{
                  fontFamily: 'var(--font-display)', fontWeight: 700,
                  fontSize: '1.4rem', color: 'var(--text-primary)',
                }}>
                  {job.company}
                </span>
                <span style={{
                  fontFamily: 'var(--font-body)', fontSize: '0.9rem',
                  color: 'var(--accent-cyan)', marginLeft: '0.75rem',
                }}>
                  — {job.role}
                </span>
              </div>

              <p style={{
                fontFamily: 'var(--font-body)', fontSize: '0.75rem',
                color: 'var(--text-secondary)', letterSpacing: '0.1em',
                marginBottom: '1.5rem',
              }}>
                {job.period} · {job.location}
              </p>

              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {job.points.map((point, i) => (
                  <li key={i} className="exp-bullet" style={{
                    fontFamily: 'var(--font-body)', fontSize: '0.875rem',
                    color: 'var(--text-secondary)', lineHeight: 1.6,
                    display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
                  }}>
                    <span style={{ color: 'var(--accent-cyan)', flexShrink: 0, marginTop: '0.1rem' }}>•</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

**Verification:**
- [ ] "// 003 — EXPERIENCE" label correct
- [ ] Amdox internship renders with all 5 bullet points from portfolioData
- [ ] Timeline line grows from top to bottom on scroll (scaleY animation)
- [ ] Cyan dot at top of timeline
- [ ] Each bullet slides in from left on scroll
- [ ] Period: "Jan 2026 – March 2026 · Kanpur, UP"

---

## PHASE 10 — EDUCATION SECTION

---

### STEP 10.1 — Education Section DOM

**Action:** Create `src/sections/Education.tsx`:
```tsx
import { useLayoutEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { portfolioData } from '../data/portfolioData'
import { SkillTag } from '../components/ui/SkillTag'

export function Education() {
  const sectionRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.edu-card', {
        opacity: 0, y: 40, stagger: 0.15,
        scrollTrigger: {
          trigger: '#education',
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        }
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="education"
      ref={sectionRef}
      style={{
        minHeight: '100vh', padding: '8rem 2rem',
        position: 'relative', zIndex: 10,
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: '0.7rem',
          color: 'var(--accent-cyan)', letterSpacing: '0.2em',
          textTransform: 'uppercase', marginBottom: '1rem',
        }}>
          // 004 — EDUCATION
        </p>

        <h2 style={{
          fontFamily: 'var(--font-display)', fontWeight: 700,
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          color: 'var(--text-primary)', letterSpacing: '-0.02em',
          marginBottom: '4rem',
        }}>
          Learning never stops.
        </h2>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2.5rem',
        }}>
          {/* Education Cards */}
          <div>
            <h3 style={{
              fontFamily: 'var(--font-body)', fontSize: '0.7rem',
              color: 'var(--text-secondary)', letterSpacing: '0.2em',
              textTransform: 'uppercase', marginBottom: '1.5rem',
            }}>
              Education
            </h3>
            {portfolioData.education.map((edu) => (
              <motion.div
                key={edu.degree}
                className="edu-card"
                whileHover={{ y: -4, borderColor: 'var(--border-glow)' }}
                style={{
                  padding: '1.5rem',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px', marginBottom: '1rem',
                  transition: 'border-color 0.2s',
                }}
              >
                <p style={{
                  fontFamily: 'var(--font-display)', fontWeight: 700,
                  fontSize: '1.1rem', color: 'var(--text-primary)',
                  marginBottom: '0.25rem',
                }}>
                  {edu.degree}
                </p>
                <p style={{
                  fontFamily: 'var(--font-body)', fontSize: '0.85rem',
                  color: 'var(--accent-cyan)', marginBottom: '0.25rem',
                }}>
                  {edu.institution}
                </p>
                <p style={{
                  fontFamily: 'var(--font-body)', fontSize: '0.75rem',
                  color: 'var(--text-secondary)', marginBottom: '0.75rem',
                }}>
                  {edu.period}
                </p>
                {edu.selfStudy.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {edu.selfStudy.map((s) => <SkillTag key={s} label={s} />)}
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Certifications */}
          <div>
            <h3 style={{
              fontFamily: 'var(--font-body)', fontSize: '0.7rem',
              color: 'var(--text-secondary)', letterSpacing: '0.2em',
              textTransform: 'uppercase', marginBottom: '1.5rem',
            }}>
              Certifications
            </h3>
            {portfolioData.certifications.map((cert) => (
              <motion.div
                key={cert.name}
                className="edu-card"
                whileHover={{ y: -4, borderColor: 'var(--border-glow)' }}
                style={{
                  padding: '1.5rem',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px', marginBottom: '1rem',
                  transition: 'border-color 0.2s',
                }}
              >
                <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>🎓</p>
                <p style={{
                  fontFamily: 'var(--font-display)', fontWeight: 700,
                  fontSize: '1.05rem', color: 'var(--text-primary)',
                  marginBottom: '0.25rem',
                }}>
                  {cert.name}
                </p>
                <p style={{
                  fontFamily: 'var(--font-body)', fontSize: '0.85rem',
                  color: 'var(--accent-cyan)', marginBottom: '0.25rem',
                }}>
                  {cert.institution}
                </p>
                <p style={{
                  fontFamily: 'var(--font-body)', fontSize: '0.75rem',
                  color: 'var(--text-secondary)',
                }}>
                  {cert.period}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
```

**Verification:**
- [ ] "// 004 — EDUCATION" label correct
- [ ] Both education entries render: BA + Intermediate
- [ ] Self-study tags show on BA card
- [ ] Both certifications render with 🎓 icon
- [ ] Cards lift on hover (y: -4px)
- [ ] Cards stagger in on scroll

---

## PHASE 11 — CONTACT SECTION

---

### STEP 11.1 — Aurora Shader Files

**Action:** Create `src/shaders/aurora.vert`:
```glsl
uniform float uTime;
uniform vec2 uMouse;
varying vec2 vUv;
varying float vElevation;

void main() {
  vUv = uv;
  vec3 pos = position;
  float elevation = sin(pos.x * 2.0 + uTime * 0.5) * 0.15
                  + cos(pos.y * 3.0 + uTime * 0.3) * 0.1
                  + sin((pos.x + uMouse.x) * 1.5 + uTime * 0.7) * 0.05;
  pos.z += elevation;
  vElevation = elevation;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
```

**Action:** Create `src/shaders/aurora.frag`:
```glsl
uniform float uTime;
uniform float uOpacity;
varying vec2 vUv;
varying float vElevation;

void main() {
  float r = sin(vUv.x * 3.14159 + uTime * 0.4 + vElevation * 5.0) * 0.5 + 0.5;
  float g = sin(vUv.y * 3.14159 + uTime * 0.3 + vElevation * 4.0) * 0.5 + 0.5;
  float b = sin((vUv.x + vUv.y) * 3.14159 + uTime * 0.5) * 0.5 + 0.5;

  vec3 cyan   = vec3(0.0, 0.96, 1.0);
  vec3 violet = vec3(0.48, 0.18, 0.75);
  vec3 amber  = vec3(1.0, 0.42, 0.21);

  vec3 color = mix(cyan, violet, r);
  color = mix(color, amber, g * 0.3);

  gl_FragColor = vec4(color, uOpacity * 0.35);
}
```

> ⚠️ FIX v2: Create `src/shaders/distort.frag` (was missing in v1):

**Action:** Create `src/shaders/distort.frag`:
```glsl
uniform float uTime;
uniform float uDistort;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  float noise = sin(uv.x * 10.0 + uTime) * cos(uv.y * 10.0 + uTime) * uDistort;
  uv.x += noise * 0.05;
  uv.y += noise * 0.05;

  vec3 color1 = vec3(0.48, 0.18, 0.75);   // violet
  vec3 color2 = vec3(0.0, 0.96, 1.0);      // cyan
  vec3 color = mix(color1, color2, uv.x + noise);

  gl_FragColor = vec4(color, 1.0);
}
```

**Verification:**
- [ ] `src/shaders/aurora.vert` created
- [ ] `src/shaders/aurora.frag` created
- [ ] `src/shaders/distort.frag` created ← was missing in v1
- [ ] No syntax errors (GLSL is picky — double-check semicolons and types)

---

### STEP 11.2 — ContactShader 3D + Contact Section DOM

**Action:** Create `src/components/3D/ContactShader.tsx`:
```tsx
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '../../store/useStore'
import auroraVert from '../../shaders/aurora.vert?raw'
import auroraFrag from '../../shaders/aurora.frag?raw'

export function ContactShader() {
  const meshRef = useRef<THREE.Mesh>(null)
  const matRef = useRef<THREE.ShaderMaterial>(null)

  useFrame((_, delta) => {
    if (!matRef.current) return
    matRef.current.uniforms.uTime.value += delta
    const { mouseX, mouseY } = useStore.getState()
    matRef.current.uniforms.uMouse.value.set(mouseX, mouseY)
  })

  return (
    <mesh ref={meshRef} position={[0, 0, -2]}>
      <planeGeometry args={[20, 20, 32, 32]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={auroraVert}
        fragmentShader={auroraFrag}
        transparent
        uniforms={{
          uTime: { value: 0 },
          uMouse: { value: new THREE.Vector2(0, 0) },
          uOpacity: { value: 1.0 },
        }}
      />
    </mesh>
  )
}
```

**Action:** Create `src/sections/Contact.tsx`:
```tsx
import { useLayoutEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { portfolioData } from '../data/portfolioData'
import { MagneticButton } from '../components/ui/MagneticButton'

type FormState = 'idle' | 'submitting' | 'success'

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const [formState, setFormState] = useState<FormState>('idle')
  const [values, setValues] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.contact-content', {
        opacity: 0, y: 60,
        scrollTrigger: {
          trigger: '#contact',
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        }
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
    setTimeout(() => setFormState('success'), 2000)
  }

  const inputStyle = (field: string) => ({
    width: '100%',
    background: 'transparent',
    border: 'none',
    borderBottom: `1px solid ${errors[field] ? 'var(--accent-amber)' : 'var(--border-subtle)'}`,
    padding: '0.75rem 0',
    fontFamily: 'var(--font-body)',
    fontSize: '0.9rem',
    color: 'var(--text-primary)',
    outline: 'none',
    transition: 'border-color 0.2s',
  })

  return (
    <section
      id="contact"
      ref={sectionRef}
      style={{
        minHeight: '120vh', padding: '8rem 2rem',
        position: 'relative', zIndex: 10,
        display: 'flex', alignItems: 'center',
      }}
    >
      <div className="contact-content" style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: '0.7rem',
          color: 'var(--accent-cyan)', letterSpacing: '0.2em',
          textTransform: 'uppercase', marginBottom: '1rem',
        }}>
          // 005 — CONTACT
        </p>

        <h2 style={{
          fontFamily: 'var(--font-display)', fontWeight: 700,
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          color: 'var(--text-primary)', letterSpacing: '-0.02em',
          marginBottom: '0.5rem',
        }}>
          Let's build something.
        </h2>

        <p style={{
          fontFamily: 'var(--font-body)', fontSize: '0.85rem',
          color: 'var(--text-secondary)', marginBottom: '3rem',
        }}>
          {portfolioData.personal.email} · Open to remote opportunities
        </p>

        {formState === 'success' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: 'center', padding: '3rem' }}
          >
            <p style={{
              fontFamily: 'var(--font-display)', fontWeight: 700,
              fontSize: '2rem', color: 'var(--accent-cyan)',
              marginBottom: '0.5rem',
            }}>
              ✓ Message Sent
            </p>
            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}>
              I'll get back to you soon!
            </p>
          </motion.div>
        ) : (
          /* NO <form> element — using div wrapper as required */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
              <input
                type="text"
                placeholder="Your Name"
                aria-label="Your Name"
                value={values.name}
                onChange={(e) => setValues({ ...values, name: e.target.value })}
                style={inputStyle('name')}
              />
              {errors.name && (
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: 'var(--accent-amber)', marginTop: '0.25rem' }}>
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <input
                type="email"
                placeholder="Your Email"
                aria-label="Your Email"
                value={values.email}
                onChange={(e) => setValues({ ...values, email: e.target.value })}
                onBlur={() => {
                  if (!values.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
                    setErrors({ ...errors, email: 'Valid email required' })
                  else setErrors({ ...errors, email: '' })
                }}
                style={inputStyle('email')}
              />
              {errors.email && (
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: 'var(--accent-amber)', marginTop: '0.25rem' }}>
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <textarea
                placeholder="Your Message"
                aria-label="Your Message"
                rows={4}
                value={values.message}
                onChange={(e) => setValues({ ...values, message: e.target.value })}
                style={{ ...inputStyle('message'), resize: 'none', fontFamily: 'var(--font-body)' }}
              />
              {errors.message && (
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: 'var(--accent-amber)', marginTop: '0.25rem' }}>
                  {errors.message}
                </p>
              )}
            </div>

            <MagneticButton
              onClick={handleSubmit}
              loading={formState === 'submitting'}
            >
              {formState === 'submitting' ? 'Sending...' : 'SEND MESSAGE →'}
            </MagneticButton>

            {/* Social Links */}
            <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem' }}>
              <a
                href={portfolioData.personal.github}
                target="_blank" rel="noopener noreferrer"
                style={{
                  fontFamily: 'var(--font-body)', fontSize: '0.75rem',
                  color: 'var(--text-secondary)', textDecoration: 'none',
                  letterSpacing: '0.2em', textTransform: 'uppercase',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-cyan)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
              >
                GitHub ↗
              </a>
              <a
                href={portfolioData.personal.linkedin}
                target="_blank" rel="noopener noreferrer"
                style={{
                  fontFamily: 'var(--font-body)', fontSize: '0.75rem',
                  color: 'var(--text-secondary)', textDecoration: 'none',
                  letterSpacing: '0.2em', textTransform: 'uppercase',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-cyan)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
              >
                LinkedIn ↗
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
```

**Verification:**
- [ ] "// 005 — CONTACT" label correct
- [ ] Email shown: `uk873195@gmail.com`
- [ ] Form uses `<div>` wrapper (NOT `<form>` element)
- [ ] All fields have aria-label
- [ ] Empty submit → amber error messages appear
- [ ] Email blur → inline validation
- [ ] Submit → 2s "Sending..." → "✓ Message Sent" success state
- [ ] GitHub + LinkedIn links at bottom — correct URLs from portfolioData
- [ ] Aurora shader visible as animated background behind form

---

## PHASE 12 — FOOTER

---

### STEP 12.1 — Footer Component

**Action:** Create `src/components/ui/Footer.tsx`:
```tsx
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
        © 2026 Uzair Manzoor
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
```

**Verification:**
- [ ] "© 2026 Uzair Manzoor" on left
- [ ] "Built with React, Three.js & GSAP" centered
- [ ] GitHub + LinkedIn links on right — real URLs
- [ ] Top border: cyan subtle
- [ ] Links turn cyan on hover

---

## PHASE 13 — MAGNETIC BUTTON

---

### STEP 13.1 — MagneticButton Component

**Action:** Create `src/components/ui/MagneticButton.tsx`:
```tsx
import { useRef } from 'react'
import gsap from 'gsap'

interface MagneticButtonProps {
  children: React.ReactNode
  onClick?: () => void
  outlined?: boolean
  loading?: boolean
}

export function MagneticButton({ children, onClick, outlined = false, loading = false }: MagneticButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = btnRef.current!
    const rect = btn.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    gsap.to(btn, {
      x: x * 0.3, y: y * 0.3,
      duration: 0.3, ease: 'power2.out',
    })
  }

  const handleMouseLeave = () => {
    gsap.to(btnRef.current, {
      x: 0, y: 0,
      duration: 0.5, ease: 'elastic.out(1, 0.4)',
    })
  }

  return (
    <button
      ref={btnRef}
      data-magnetic
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      disabled={loading}
      style={{
        padding: '0.75rem 2rem',
        fontFamily: 'var(--font-body)',
        fontSize: '0.8rem',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        cursor: loading ? 'not-allowed' : 'none',
        background: outlined ? 'transparent' : 'var(--accent-cyan)',
        color: outlined ? 'var(--accent-cyan)' : 'var(--bg-base)',
        border: outlined
          ? '1px solid var(--border-glow)'
          : '1px solid var(--accent-cyan)',
        borderRadius: '4px',
        transition: 'background 0.2s, box-shadow 0.2s',
        opacity: loading ? 0.7 : 1,
        boxShadow: outlined ? 'none' : 'var(--glow-cyan)',
      }}
      onMouseEnter={(e) => {
        if (!outlined) {
          (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 60px rgba(0,245,255,0.6)'
        }
      }}
    >
      {children}
    </button>
  )
}
```

**Verification:**
- [ ] Button moves toward cursor (magnetic effect, x*0.3, y*0.3)
- [ ] Mouse leave: elastic.out spring back to center
- [ ] `outlined` prop: transparent bg + cyan border
- [ ] `loading` prop: opacity 0.7, disabled
- [ ] `data-magnetic` attribute present (custom cursor uses this)

---

## PHASE 14 — APP ASSEMBLY

---

### STEP 14.1 — App.tsx (Root Assembly with React.lazy)

> ⚠️ FIX v2: All sections now use React.lazy() for code splitting (was missing in v1).

**Action:** Replace `src/App.tsx` with:
```tsx
import { lazy, Suspense, useEffect } from 'react'
import { Scene } from './components/3D/Scene'
import { CustomCursor } from './components/ui/CustomCursor'
import { Navbar } from './components/ui/Navbar'
import { LoadingScreen } from './components/ui/LoadingScreen'
import { Footer } from './components/ui/Footer'
import { SmoothScrollProvider } from './components/providers/SmoothScroll'
import { useMouseTracker } from './hooks/useMouseTracker'
import { useStore } from './store/useStore'
import { useIsMobile } from './hooks/useMediaQuery'

// React.lazy for code splitting — below-fold sections load on demand
const Hero       = lazy(() => import('./sections/Hero').then(m => ({ default: m.Hero })))
const About      = lazy(() => import('./sections/About').then(m => ({ default: m.About })))
const Skills     = lazy(() => import('./sections/Skills').then(m => ({ default: m.Skills })))
const Projects   = lazy(() => import('./sections/Projects').then(m => ({ default: m.Projects })))
const Experience = lazy(() => import('./sections/Experience').then(m => ({ default: m.Experience })))
const Education  = lazy(() => import('./sections/Education').then(m => ({ default: m.Education })))
const Contact    = lazy(() => import('./sections/Contact').then(m => ({ default: m.Contact })))

function AppContent() {
  useMouseTracker()
  const isMobile = useIsMobile()
  const isLoaded = useStore((s) => s.isLoaded)

  return (
    <>
      <LoadingScreen />

      {/* Fixed 3D canvas — always behind everything */}
      {!isMobile && <Scene />}

      {/* Custom cursor */}
      <CustomCursor />

      {/* Main site — visible after loading */}
      <div style={{ opacity: isLoaded ? 1 : 0, transition: 'opacity 0.5s ease' }}>
        <Navbar />
        <main style={{ position: 'relative', zIndex: 10 }}>
          <Suspense fallback={null}>
            <Hero />
            <About />
            <Skills />
            <Projects />
            <Experience />
            <Education />
            <Contact />
          </Suspense>
        </main>
        <Footer />
      </div>
    </>
  )
}

export default function App() {
  return (
    <SmoothScrollProvider>
      <AppContent />
    </SmoothScrollProvider>
  )
}
```

**Verification:**
- [ ] All 7 sections render in order: Hero, About, Skills, Projects, Experience, Education, Contact
- [ ] Footer renders after Contact
- [ ] LoadingScreen appears first, then content fades in
- [ ] Scene (3D canvas) only on non-mobile
- [ ] Sections use React.lazy (check Network tab — section chunks load on demand)
- [ ] SmoothScrollProvider wraps everything
- [ ] useMouseTracker called at root (mouse state global)

---

## PHASE 15 — ACCESSIBILITY + FINAL POLISH

---

### STEP 15.1 — Accessibility Pass

**Action:** Add to `src/styles/globals.css`:
```css
/* Accessibility: reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Focus visible for keyboard nav */
:focus-visible {
  outline: 2px solid var(--accent-cyan);
  outline-offset: 4px;
  border-radius: 4px;
}

/* Skip to content link (accessibility) */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--accent-cyan);
  color: var(--bg-base);
  padding: 8px;
  text-decoration: none;
  font-family: var(--font-body);
  z-index: 99999;
}
.skip-link:focus { top: 0; }
```

Add to `src/main.tsx` (in JSX, above `<App />`):
```tsx
<a href="#hero" className="skip-link">Skip to content</a>
```

In App.tsx, add GSAP reduced motion check:
```tsx
useEffect(() => {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  if (mq.matches) {
    gsap.globalTimeline.timeScale(0)
  }
}, [])
```

**Verification:**
- [ ] Canvas has `aria-hidden="true"` (set in Scene.tsx Step 2.1)
- [ ] Main sections use semantic HTML (`<section>`, `<nav>`, `<main>`, `<footer>`)
- [ ] All form fields have aria-label
- [ ] `prefers-reduced-motion`: all GSAP animations pause
- [ ] Tab key navigates all interactive elements in logical order
- [ ] Skip-to-content link appears on first Tab press

---

### STEP 15.2 — ScrollTrigger Resize Handler

**Action:** In `App.tsx`, add inside `AppContent`:
```tsx
useEffect(() => {
  const handleResize = () => {
    ScrollTrigger.refresh()
  }
  window.addEventListener('resize', handleResize)
  return () => window.removeEventListener('resize', handleResize)
}, [])
```

**Verification:**
- [ ] Resize window: ScrollTrigger animations recompute correctly
- [ ] No "stuck" pinned sections after resize

---

### STEP 15.3 — Final Cross-Check Checklist

Run through each item before calling the project complete:

#### Content Accuracy
- [ ] Name: "Uzair Manzoor" (3D text + DOM)
- [ ] Title: "MERN Stack Developer"
- [ ] Email: `uk873195@gmail.com` (contact section)
- [ ] Phone: `+91-73798-55969` (footer or contact, optional)
- [ ] LinkedIn: exact URL from portfolioData
- [ ] GitHub: exact URL from portfolioData
- [ ] SIRP: live URL `https://smarterresponse.xyz`, NO GitHub link shown
- [ ] Job Portal: both live + GitHub URLs shown
- [ ] Amdox: all 5 bullet points present
- [ ] Both certifications: Sheryians + ASDC Kanpur
- [ ] No lorem ipsum anywhere
- [ ] No placeholder text anywhere

#### Section Labels (exact strings)
- [ ] `// 001 — ABOUT`
- [ ] `// 002 — SKILLS`
- [ ] `// 003 — PROJECTS`
- [ ] `// 003 — EXPERIENCE` (note: intentionally same number as Projects — matches design.md)
- [ ] `// 004 — EDUCATION`
- [ ] `// 005 — CONTACT`

#### Technical
- [ ] TypeScript: all files `.tsx` or `.ts`, no `.jsx` or `.js`
- [ ] Lenis `lerp: 0.08` (NOT 0.1)
- [ ] `ScrollTrigger.update` sync with Lenis scroll event ✓
- [ ] GSAP plugins: `ScrollTrigger` + `TextPlugin` both registered
- [ ] `r3f-perf`: visible in dev mode only
- [ ] All GSAP effects: `ctx.revert()` cleanup
- [ ] `aria-hidden="true"` on Canvas
- [ ] `cursor: none` on html/body
- [ ] `pointer-events: none` on canvas
- [ ] DPR: `Math.min(2, window.devicePixelRatio)` in Scene

#### 3D Components
- [ ] HeroScene.tsx — Text3D + Float + mouse light ✓
- [ ] ParticleField.tsx — rotation + mouse repulsion ✓
- [ ] AboutGeometry.tsx — IcosahedronGeometry + MeshDistortMaterial + dissolve exit ✓
- [ ] SkillsOrbs.tsx — 8 spheres in elliptical orbit + hover glow ✓
- [ ] ProjectCarousel3D.tsx — camera travel + DepthOfField on inactive ✓
- [ ] ExperienceScene.tsx — rotating torus wireframe (violet) ✓ ← was missing
- [ ] ContactShader.tsx — aurora GLSL shader ✓
- [ ] LoadingScreen.tsx — 3D canvas with UM monogram + particle ring ✓ ← was plain DOM

#### Shaders
- [ ] `src/shaders/aurora.vert` ✓
- [ ] `src/shaders/aurora.frag` ✓
- [ ] `src/shaders/distort.frag` ✓ ← was missing

#### Custom Cursor — All 5 States
- [ ] Default: dot 8px + ring 32px
- [ ] Over link: ring 60px + mix-blend-mode:difference
- [ ] Over button: ring fills cyan 20% + "CLICK" label inside ← was missing
- [ ] Over canvas: crosshair + glow (implement in CustomCursor via canvas pointer events)
- [ ] Clicking: ring scale 0.8 → spring back

#### Files (all must exist)
- [ ] `src/hooks/useMouseTracker.ts` (dedicated file)
- [ ] `src/hooks/useScrollProgress.ts` (dedicated file ← was embedded in Navbar)
- [ ] `src/hooks/useMediaQuery.ts`
- [ ] `src/components/ui/SkillTag.tsx` (dedicated file ← was inline)
- [ ] `src/components/3D/ExperienceScene.tsx` ← was entirely missing
- [ ] `src/shaders/distort.frag` ← was entirely missing
- [ ] `public/fonts/helvetiker_regular.typeface.json` (downloaded in Step 4.1)

---

## PHASE 16 — BUILD & DEPLOYMENT

---

### STEP 16.1 — Production Build Check

```bash
npm run build
```

Expected output:
- No TypeScript errors
- No unresolved imports
- Chunk sizes reasonable (Three.js will be large — expected)
- `dist/` folder created

Fix any type errors before proceeding.

### STEP 16.2 — Performance Audit (Lighthouse)

```bash
npm run preview   # serves the production build locally
```

Open Chrome DevTools → Lighthouse → run Performance audit.

**Targets:**
- Performance: ≥ 85
- Accessibility: ≥ 90
- Best Practices: ≥ 90

If Performance < 85:
1. Check r3f-perf is NOT included in production bundle (it should only be in dev)
2. Check React.lazy is working (sections load lazily)
3. Reduce particle count on mobile
4. Reduce Bloom intensity

### STEP 16.3 — Vercel Deployment

```bash
npm install -g vercel
vercel --prod
```

Or connect GitHub repo to Vercel dashboard (recommended).

Framework preset: **Vite** (auto-detected)
Build command: `npm run build`
Output directory: `dist`

**Verification:**
- [ ] Production build completes with zero errors
- [ ] Preview URL works in Chrome + Firefox + Safari
- [ ] 3D canvas renders on production (WebGL enabled)
- [ ] Smooth scroll works on production
- [ ] All real links open correctly
- [ ] Mobile view: CSS only, no WebGL, native scroll

---

## PHASE 17 — MISSING WIRING (COMPLETION STEPS)

> These steps were missing from previous phases. Complete them BEFORE building any section.
> Without these, TypeScript will throw errors and shaders will not import.

---

### STEP 17.1 — tsconfig.json (Strict Mode — NON-NEGOTIABLE)

**Action:** Replace the generated `tsconfig.json` with this exact config:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

**Action:** Create `src/vite-env.d.ts` (for `?raw` shader imports):
```ts
/// <reference types="vite/client" />

declare module '*.vert?raw' {
  const content: string
  export default content
}

declare module '*.frag?raw' {
  const content: string
  export default content
}

declare module '*.glsl?raw' {
  const content: string
  export default content
}
```

**Verification:**
- [ ] `strict: true` is in tsconfig.json
- [ ] `noUnusedLocals: true` — catches dead imports early
- [ ] `vite-env.d.ts` exists — `?raw` imports no longer throw TS errors
- [ ] Run `npx tsc --noEmit` — zero errors

---

### STEP 17.2 — vite.config.ts — Shader ?raw Import Support

Vite supports `?raw` imports out of the box, but the config must have `assetsInclude` for `.vert` and `.frag` files so they are NOT processed as assets.

**Action:** Update `vite.config.ts` to final version:
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  assetsInclude: ['**/*.glb', '**/*.gltf', '**/*.hdr'],
  // Note: .vert and .frag are NOT in assetsInclude — they use ?raw import
  // which is handled natively by Vite without any extra config.
  server: {
    port: 5173,
    open: true,
  },
  build: {
    rollupOptions: {
      output: {
        // Split Three.js into its own chunk to reduce initial bundle size
        manualChunks: {
          three: ['three'],
          r3f: ['@react-three/fiber', '@react-three/drei', '@react-three/postprocessing'],
          gsap: ['gsap'],
          framer: ['framer-motion'],
        },
      },
    },
  },
})
```

**Verification:**
- [ ] `npm run dev` works with no Vite config errors
- [ ] Importing `import auroraVert from '../../shaders/aurora.vert?raw'` in ContactShader.tsx gives a string (not 404)
- [ ] `npm run build` produces separate chunks: three, r3f, gsap, framer in dist/assets/

---

### STEP 17.3 — main.tsx — Complete File

**Action:** Replace `src/main.tsx` with this exact content:
```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import App from './App'

const root = document.getElementById('root')
if (!root) throw new Error('Root element not found')

createRoot(root).render(
  <StrictMode>
    <a href="#hero" className="skip-link">Skip to content</a>
    <App />
  </StrictMode>
)
```

**Update `index.html`** — set correct title and meta:
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Uzair Manzoor — MERN Stack Developer portfolio. 3D interactive portfolio showcasing projects built with React, Node.js, and MongoDB." />
    <meta name="keywords" content="Uzair Manzoor, MERN Stack, React Developer, Portfolio, Kanpur" />
    <meta name="author" content="Uzair Manzoor" />
    <!-- Open Graph -->
    <meta property="og:title" content="Uzair Manzoor — MERN Stack Developer" />
    <meta property="og:description" content="3D interactive portfolio. SIRP · Job Portal · MERN Stack." />
    <meta property="og:type" content="website" />
    <title>Uzair Manzoor — MERN Stack Developer</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

**Verification:**
- [ ] Tab title shows "Uzair Manzoor — MERN Stack Developer"
- [ ] `skip-link` renders above App (Tab key → skip link appears)
- [ ] StrictMode enabled (double-renders in dev — expected)
- [ ] `root` element found, no throw

---

### STEP 17.4 — Scene.tsx — Complete Wiring (Section Switching)

> This is the most critical missing step. Scene.tsx must show/hide 3D components
> based on which section is active. Without this, all 3D elements render simultaneously
> causing massive GPU load and visual chaos.

**Action:** Replace `src/components/3D/Scene.tsx` with the COMPLETE wiring version:
```tsx
import { Canvas, useFrame } from '@react-three/fiber'
import { Preload, AdaptiveDpr, PerformanceMonitor } from '@react-three/drei'
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Vignette,
  Noise,
  DepthOfField,
} from '@react-three/postprocessing'
import { Suspense, useState, useEffect, useRef } from 'react'
import { useIsMobile, useIsTablet } from '../../hooks/useMediaQuery'
import { useStore } from '../../store/useStore'
import { ParticleField } from './ParticleField'
import { HeroScene } from './HeroScene'
import { AboutGeometry } from './AboutGeometry'
import { SkillsOrbs } from './SkillsOrbs'
import { ProjectCarousel3D } from './ProjectCarousel3D'
import { ExperienceScene } from './ExperienceScene'
import { ContactShader } from './ContactShader'
import * as THREE from 'three'

// Tracks which section is visible and passes scroll progress to 3D components
function SectionManager() {
  const activeSection = useStore((s) => s.activeSection)
  const scrollProgress = useStore((s) => s.scrollProgress)
  const isProjectsActive = useStore((s) => s.isProjectsActive)

  // Compute section-local scroll progress (0→1 within each section)
  // These are approximations — fine-tune based on actual section heights
  const sectionProgress: Record<string, number> = {
    hero:       Math.min(1, scrollProgress * 10),
    about:      Math.min(1, Math.max(0, (scrollProgress - 0.1) * 7)),
    skills:     Math.min(1, Math.max(0, (scrollProgress - 0.25) * 8)),
    projects:   Math.min(1, Math.max(0, (scrollProgress - 0.4) * 5)),
    experience: Math.min(1, Math.max(0, (scrollProgress - 0.6) * 8)),
    contact:    Math.min(1, Math.max(0, (scrollProgress - 0.8) * 10)),
  }

  return (
    <>
      {/* ParticleField: always visible, fades by section */}
      <ParticleField count={3000} />

      {/* Hero: visible on hero + about */}
      {(activeSection === 'hero' || activeSection === 'about') && (
        <HeroScene />
      )}

      {/* About geometry: visible on about section */}
      {activeSection === 'about' && (
        <AboutGeometry scrollProgress={sectionProgress.about} />
      )}

      {/* Skills orbs: visible on skills section */}
      {activeSection === 'skills' && (
        <SkillsOrbs scrollProgress={sectionProgress.skills} />
      )}

      {/* Project carousel: visible on projects section */}
      {(activeSection === 'projects' || isProjectsActive) && (
        <ProjectCarousel3D scrollProgress={sectionProgress.projects} />
      )}

      {/* Experience torus: visible on experience section */}
      {activeSection === 'experience' && (
        <ExperienceScene />
      )}

      {/* Contact aurora: visible on contact section */}
      {activeSection === 'contact' && (
        <ContactShader />
      )}
    </>
  )
}

export function Scene() {
  const [dpr, setDpr] = useState(Math.min(1.5, window.devicePixelRatio))
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()
  const isProjectsActive = useStore((s) => s.isProjectsActive)
  const activeProjectIndex = useStore((s) => s.activeProjectIndex)

  return (
    <Canvas
      dpr={[1, Math.min(2, window.devicePixelRatio)]}
      camera={{ fov: 75, near: 0.1, far: 100, position: [0, 0, 5] }}
      gl={{
        antialias: !isMobile,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100vw', height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    >
      {/* r3f-perf: development only — tree-shaken in production */}
      {import.meta.env.DEV && <DevPerf />}

      <PerformanceMonitor
        onDecline={() => setDpr(1)}
        onIncline={() => setDpr(Math.min(1.5, window.devicePixelRatio))}
      />
      <AdaptiveDpr pixelated />

      <ambientLight intensity={0.15} />

      <Suspense fallback={null}>
        <SectionManager />
      </Suspense>

      {/* Postprocessing — tiered by device */}
      {!isMobile && (
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.6}
            luminanceSmoothing={0.9}
            intensity={0.8}
            radius={0.4}
          />
          {!isTablet && (
            <ChromaticAberration offset={[0.0005, 0.0005]} />
          )}
          <Vignette eskil={false} offset={0.3} darkness={0.8} />
          {!isTablet && <Noise opacity={0.02} />}
          {/* DepthOfField: only during Projects section */}
          {isProjectsActive && (
            <DepthOfField
              focusDistance={activeProjectIndex === 0 ? 0.003 : 0.012}
              focalLength={0.02}
              bokehScale={3}
            />
          )}
        </EffectComposer>
      )}

      <Preload all />
    </Canvas>
  )
}

// r3f-perf dynamically imported — only in dev
function DevPerf() {
  const [Perf, setPerf] = useState<React.ComponentType<{ position?: string }> | null>(null)
  useEffect(() => {
    import('r3f-perf').then((m) => setPerf(() => m.Perf))
  }, [])
  return Perf ? <Perf position="top-left" /> : null
}
```

**Verification:**
- [ ] Only 1-2 3D components active at a time (check r3f-perf in dev — draw calls low)
- [ ] Scrolling to 'about': AboutGeometry appears
- [ ] Scrolling to 'skills': SkillsOrbs appears, AboutGeometry disappears
- [ ] Scrolling to 'projects': ProjectCarousel3D appears
- [ ] Scrolling to 'experience': ExperienceScene torus appears
- [ ] Scrolling to 'contact': ContactShader aurora appears
- [ ] FPS stays above 55 throughout (r3f-perf monitor)

---

### STEP 17.5 — activeSection Tracking (ScrollTrigger → Zustand)

> The `activeSection` in Zustand must update as the user scrolls. This is what
> drives SectionManager in Scene.tsx. Without this, activeSection is always 'hero'.

**Action:** Add to `src/App.tsx`, inside `AppContent`, after `useMouseTracker()`:
```tsx
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useStore } from './store/useStore'

// Inside AppContent():
const setActiveSection = useStore((s) => s.setActiveSection)

useLayoutEffect(() => {
  const sections = ['hero', 'about', 'skills', 'projects', 'experience', 'education', 'contact']
  const triggers: ScrollTrigger[] = []

  sections.forEach((id) => {
    const el = document.getElementById(id)
    if (!el) return
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 60%',
      end: 'bottom 40%',
      onEnter: () => setActiveSection(id),
      onEnterBack: () => setActiveSection(id),
    })
    triggers.push(trigger)
  })

  return () => triggers.forEach((t) => t.kill())
}, [setActiveSection])
```

**Important:** This `useLayoutEffect` runs AFTER the DOM is rendered. Because sections use `React.lazy`, they may not be in the DOM immediately. Use `setTimeout(() => ScrollTrigger.refresh(), 500)` after lazy sections load if triggers don't fire correctly.

**Verification:**
- [ ] Open Zustand devtools (or add `console.log(activeSection)` temporarily)
- [ ] Scroll to About: `activeSection` = 'about'
- [ ] Scroll to Skills: `activeSection` = 'skills'
- [ ] Scroll to Projects: `activeSection` = 'projects'
- [ ] All 7 sections update correctly

---

### STEP 17.6 — Complete App.tsx (Final Version with All Wiring)

**Action:** Replace `src/App.tsx` completely with this final version:
```tsx
import { lazy, Suspense, useLayoutEffect, useEffect } from 'react'
import { Scene } from './components/3D/Scene'
import { CustomCursor } from './components/ui/CustomCursor'
import { Navbar } from './components/ui/Navbar'
import { LoadingScreen } from './components/ui/LoadingScreen'
import { Footer } from './components/ui/Footer'
import { SmoothScrollProvider } from './components/providers/SmoothScroll'
import { useMouseTracker } from './hooks/useMouseTracker'
import { useStore } from './store/useStore'
import { useIsMobile } from './hooks/useMediaQuery'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

// React.lazy — all sections load on demand (code splitting)
const Hero       = lazy(() => import('./sections/Hero').then(m => ({ default: m.Hero })))
const About      = lazy(() => import('./sections/About').then(m => ({ default: m.About })))
const Skills     = lazy(() => import('./sections/Skills').then(m => ({ default: m.Skills })))
const Projects   = lazy(() => import('./sections/Projects').then(m => ({ default: m.Projects })))
const Experience = lazy(() => import('./sections/Experience').then(m => ({ default: m.Experience })))
const Education  = lazy(() => import('./sections/Education').then(m => ({ default: m.Education })))
const Contact    = lazy(() => import('./sections/Contact').then(m => ({ default: m.Contact })))

function AppContent() {
  useMouseTracker()

  const isMobile = useIsMobile()
  const isLoaded = useStore((s) => s.isLoaded)
  const setActiveSection = useStore((s) => s.setActiveSection)

  // Global reduced motion check
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) {
      gsap.globalTimeline.timeScale(0)
    }
  }, [])

  // ScrollTrigger resize refresh
  useEffect(() => {
    const handleResize = () => ScrollTrigger.refresh()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // activeSection tracking — drives SectionManager in Scene.tsx
  useLayoutEffect(() => {
    if (!isLoaded) return  // Don't set up triggers until site is visible

    const sections = ['hero', 'about', 'skills', 'projects', 'experience', 'education', 'contact']
    const triggers: ScrollTrigger[] = []

    // Delay to allow lazy-loaded sections to mount
    const timer = setTimeout(() => {
      sections.forEach((id) => {
        const el = document.getElementById(id)
        if (!el) return
        const trigger = ScrollTrigger.create({
          trigger: el,
          start: 'top 60%',
          end: 'bottom 40%',
          onEnter: () => setActiveSection(id),
          onEnterBack: () => setActiveSection(id),
        })
        triggers.push(trigger)
      })
      ScrollTrigger.refresh()
    }, 600)

    return () => {
      clearTimeout(timer)
      triggers.forEach((t) => t.kill())
    }
  }, [isLoaded, setActiveSection])

  return (
    <>
      {/* Loading screen — always rendered, exits via AnimatePresence */}
      <LoadingScreen />

      {/* Fixed 3D canvas — desktop only */}
      {!isMobile && <Scene />}

      {/* Custom cursor — desktop only (hidden on mobile inside component) */}
      <CustomCursor />

      {/* Main site — fades in after loading */}
      <div
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.6s ease',
          pointerEvents: isLoaded ? 'auto' : 'none',
        }}
      >
        <Navbar />

        <main
          id="main-content"
          style={{ position: 'relative', zIndex: 10 }}
          role="main"
        >
          <Suspense fallback={null}>
            <Hero />
            <About />
            <Skills />
            <Projects />
            <Experience />
            <Education />
            <Contact />
          </Suspense>
        </main>

        <Footer />
      </div>
    </>
  )
}

export default function App() {
  return (
    <SmoothScrollProvider>
      <AppContent />
    </SmoothScrollProvider>
  )
}
```

**Verification:**
- [ ] No TypeScript errors in App.tsx
- [ ] Loading screen appears → content fades in after ~2.5s
- [ ] Navbar, all 7 sections, Footer render in correct order
- [ ] `isLoaded` gates pointer events (can't click through loading screen)
- [ ] activeSection tracking starts AFTER `isLoaded` (600ms delay for lazy sections)
- [ ] ScrollTrigger refreshes on window resize
- [ ] Reduced motion: GSAP timeline paused on `prefers-reduced-motion`
- [ ] Mobile: Scene (WebGL) skipped entirely, Lenis disabled by SmoothScrollProvider

---

### STEP 17.7 — Final File Existence Verification

Before running the build, confirm EVERY file exists. Run this in terminal:
```bash
echo "=== Checking all required files ===" && \
ls src/components/3D/Scene.tsx && \
ls src/components/3D/ParticleField.tsx && \
ls src/components/3D/HeroScene.tsx && \
ls src/components/3D/AboutGeometry.tsx && \
ls src/components/3D/SkillsOrbs.tsx && \
ls src/components/3D/ProjectCarousel3D.tsx && \
ls src/components/3D/ExperienceScene.tsx && \
ls src/components/3D/ContactShader.tsx && \
ls src/components/sections/Hero.tsx && \
ls src/components/sections/About.tsx && \
ls src/components/sections/Skills.tsx && \
ls src/components/sections/Projects.tsx && \
ls src/components/sections/Experience.tsx && \
ls src/components/sections/Education.tsx && \
ls src/components/sections/Contact.tsx && \
ls src/components/ui/Navbar.tsx && \
ls src/components/ui/CustomCursor.tsx && \
ls src/components/ui/MagneticButton.tsx && \
ls src/components/ui/SkillTag.tsx && \
ls src/components/ui/LoadingScreen.tsx && \
ls src/components/ui/Footer.tsx && \
ls src/components/providers/SmoothScroll.tsx && \
ls src/store/useStore.ts && \
ls src/hooks/useMouseTracker.ts && \
ls src/hooks/useScrollProgress.ts && \
ls src/hooks/useMediaQuery.ts && \
ls src/shaders/aurora.vert && \
ls src/shaders/aurora.frag && \
ls src/shaders/distort.frag && \
ls src/data/portfolioData.ts && \
ls src/styles/globals.css && \
ls src/vite-env.d.ts && \
ls src/App.tsx && \
ls src/main.tsx && \
ls public/fonts/helvetiker_regular.typeface.json && \
echo "=== ALL FILES PRESENT ===" || echo "=== MISSING FILES ABOVE ==="
```

If any file is missing — create it before proceeding to build.

**Verification:**
- [ ] All 35 files listed above exist
- [ ] `public/fonts/helvetiker_regular.typeface.json` downloaded (curl command in Step 4.1)
- [ ] No file uses `.jsx` or `.js` extension — TypeScript only
- [ ] `npx tsc --noEmit` → zero errors
- [ ] `npm run build` → zero errors
- [ ] `npm run preview` → site works end to end

---

## ✅ TASK COMPLETE — FINAL SUMMARY

### What was built (3 files, fully corrected):

**requirements.md** — Developer profile, all skill/project/experience data, functional requirements FR-01 to FR-09, complete package list, TypeScript enforced as strict + non-negotiable.

**design.md** — Complete visual spec: color system, typography, 8 sections fully designed, all 3D components specced (including ExperienceScene + LoadingScreen 3D), cursor with all 5 states including CLICK label, Lenis lerp conflict resolved (0.08), complete folder structure with all 35 files listed, all 3 shaders.

**task.md** — 17 Phases, 35+ Steps, every step has:
- Exact code to write
- Precise verification checklist
- Fix tags showing what was wrong in v1 and why it's fixed now

### All 14 Failures Fixed:
1. ✅ TypeScript `react-ts` template (was `react`)
2. ✅ `ScrollTrigger.update` sync line added to Lenis
3. ✅ `r3f-perf` installed as devDependency
4. ✅ `TextPlugin` registered with GSAP
5. ✅ `ExperienceScene.tsx` created (Phase 9.1)
6. ✅ LoadingScreen uses 3D canvas (Phase 4.1)
7. ✅ About dissolve-into-particles exit (Phase 6.1)
8. ✅ DepthOfField on inactive project cards (Phase 8.1)
9. ✅ Mouse repulsion on particles (Phase 2.2)
10. ✅ `distort.frag` shader created (Phase 11.1)
11. ✅ LoadingScreen 3D: UM monogram + particle ring (Phase 4.1)
12. ✅ `useScrollProgress.ts` as dedicated file (Phase 0.6)
13. ✅ `SkillTag.tsx` as dedicated file (Phase 7.2)
14. ✅ React.lazy() for code splitting (Phase 14.1)

### All 9 Conflicts Resolved:
1. ✅ TypeScript vs JS → TypeScript strict enforced
2. ✅ lerp 0.08 vs 0.1 → 0.08 correct, documented
3. ✅ HeroText3D vs HeroScene → HeroScene everywhere
4. ✅ Experience/Education not in system prompt → added via requirements.md, noted
5. ✅ Tailwind v4 config → `@tailwindcss/vite` correct approach
6. ✅ Project textures → colored planes with note to add screenshots
7. ✅ Contact form `<form>` → `<div>` wrapper, documented
8. ✅ DPR pattern → `Math.min(2, window.devicePixelRatio)` exact
9. ✅ Section switching in Scene.tsx → SectionManager component (Phase 17.4)

---

## PHASE 18 — SYSTEM PROMPT ALIGNMENT (GOD MODE FIXES)

> These steps fix all 21 missing + 8 conflict items found in GOD MODE brutal check.
> Complete these AFTER Phase 17. Every step references exact system prompt text.

---

### STEP 18.1 — Scene.tsx: toneMapping + directionalLight + Environment

> System prompt Canvas: `toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2`
> System prompt Scene: `<directionalLight position={[5,5,5]} intensity={1.5} castShadow />`
> System prompt Scene: `<Environment preset="night" />`

**Action:** Update `src/components/3D/Scene.tsx` gl prop and lights:
```tsx
import { Canvas } from '@react-three/fiber'
import { Preload, AdaptiveDpr, PerformanceMonitor, Environment } from '@react-three/drei'
import * as THREE from 'three'
import { PostProcessing } from './PostProcessing'

// Inside <Canvas>:
<Canvas
  dpr={[1, Math.min(2, window.devicePixelRatio)]}
  camera={{ fov: 75, near: 0.1, far: 100, position: [0, 0, 5] }}
  gl={{
    antialias: !isMobile,
    alpha: true,
    powerPreference: 'high-performance',
    toneMapping: THREE.ACESFilmicToneMapping,    // ← ADDED
    toneMappingExposure: 1.2,                    // ← ADDED
  }}
  style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0, pointerEvents: 'none' }}
  aria-hidden="true"
>
  {/* Lighting — system prompt exact */}
  <ambientLight intensity={0.2} />
  <directionalLight position={[5, 5, 5]} intensity={1.5} castShadow />  {/* ← ADDED */}
  <Environment preset="night" />                                         {/* ← ADDED */}

  <PostProcessing />   {/* ← Extracted to dedicated file */}

  {/* ... rest of scene */}
</Canvas>
```

**Verification:**
- [ ] `THREE.ACESFilmicToneMapping` imported and set on gl
- [ ] `toneMappingExposure: 1.2` set
- [ ] `directionalLight` renders (creates directional shadow on 3D objects)
- [ ] `Environment preset="night"` provides HDR lighting
- [ ] `PostProcessing` is now a separate import, not inline

---

### STEP 18.2 — PostProcessing.tsx — Dedicated File (System Prompt Folder)

> System prompt folder structure: `components/3D/PostProcessing.tsx — Bloom, aberration, etc.`
> Was embedded inside Scene.tsx — must be extracted.

**Action:** Create `src/components/3D/PostProcessing.tsx`:
```tsx
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Vignette,
  Noise,
  DepthOfField,
  SMAA,
} from '@react-three/postprocessing'
import { useStore } from '../../store/useStore'
import { useIsMobile, useIsTablet } from '../../hooks/useMediaQuery'

export function PostProcessing() {
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()
  const isProjectsActive = useStore((s) => s.isProjectsActive)
  const activeProjectIndex = useStore((s) => s.activeProjectIndex)

  if (isMobile) return null

  return (
    <EffectComposer>
      <Bloom
        luminanceThreshold={0.6}
        luminanceSmoothing={0.9}
        intensity={isTablet ? 0.6 : 0.8}
        radius={isTablet ? 0.3 : 0.4}
      />
      {!isTablet && <ChromaticAberration offset={[0.0005, 0.0005]} />}
      <Vignette eskil={false} offset={0.3} darkness={0.8} />
      {!isTablet && <Noise opacity={0.02} />}
      {!isTablet && <SMAA />}
      {isProjectsActive && (
        <DepthOfField
          focusDistance={activeProjectIndex === 0 ? 0.003 : 0.012}
          focalLength={0.02}
          bokehScale={3}
        />
      )}
    </EffectComposer>
  )
}
```

**Verification:**
- [ ] File exists at `src/components/3D/PostProcessing.tsx`
- [ ] SMAA imported and used (desktop only)
- [ ] DepthOfField conditional on isProjectsActive
- [ ] Tablet: Bloom only (ChromaticAberration + Noise + SMAA skipped)
- [ ] Mobile: null returned (no EffectComposer overhead)

---

### STEP 18.3 — ParticleField.tsx: Y-gradient Colors + Wind Drift

> System prompt: "Color: gradient from cyan to violet based on Y position"
> System prompt: "Scroll: particles slowly drift in wind direction"

**Action:** Update `src/components/3D/ParticleField.tsx` — add colors and wind:
```tsx
// Add to useMemo (after positions):
const colors = useMemo(() => {
  const col = new Float32Array(count * 3)
  const cyan = new THREE.Color('#00F5FF')
  const violet = new THREE.Color('#7B2FBE')
  for (let i = 0; i < count; i++) {
    const y = positions[i * 3 + 1]         // raw Y (-8 to +8)
    const t = Math.max(0, Math.min(1, (y + 8) / 16))  // normalize 0→1
    const mixed = cyan.clone().lerp(violet, t)
    col[i * 3]     = mixed.r
    col[i * 3 + 1] = mixed.g
    col[i * 3 + 2] = mixed.b
  }
  return col
}, [count, positions])

// Update Points JSX — add colors bufferAttribute, use vertexColors:
<Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
  <bufferAttribute attach="attributes-color" args={[colors, 3]} />
  <PointMaterial
    transparent
    vertexColors                           // ← use vertex colors (Y gradient)
    size={0.008}
    sizeAttenuation
    depthWrite={false}
    blending={THREE.AdditiveBlending}
  />
</Points>

// Add wind drift in useFrame (before repulsion loop):
useFrame((_, delta) => {
  if (!ref.current) return
  const { scrollProgress } = useStore.getState()

  // Wind drift linked to scroll
  ref.current.position.x += scrollProgress * 0.001 * delta * 60
  ref.current.position.y -= scrollProgress * 0.0005 * delta * 60

  // Existing rotation
  ref.current.rotation.x -= delta / 30
  ref.current.rotation.y -= delta / 20

  // ... mouse repulsion code unchanged
})
```

**Verification:**
- [ ] Particles show gradient: cyan at bottom, violet at top (not flat cyan)
- [ ] Scrolling: particles slowly drift diagonally (wind effect)
- [ ] Repulsion still works after changes
- [ ] No performance regression (FPS ≥ 55)

---

### STEP 18.4 — MagneticButton.tsx: Exact System Prompt Formula

> System prompt Recipe #5: magneticArea=80px radius, dist check, strength formula.
> Current implementation uses simplified `x * 0.3` — WRONG.

**Action:** Replace `src/components/ui/MagneticButton.tsx` with:
```tsx
import { useRef, useEffect } from 'react'
import gsap from 'gsap'

interface MagneticButtonProps {
  children: React.ReactNode
  onClick?: () => void
  outlined?: boolean
  loading?: boolean
}

const MAGNETIC_AREA = 80  // px radius — EXACT from system prompt

export function MagneticButton({ children, onClick, outlined = false, loading = false }: MagneticButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const btn = btnRef.current
    if (!btn) return

    // System prompt: attach to window mousemove for approach detection
    const handleMouseMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect()
      const btnCenterX = rect.left + rect.width / 2
      const btnCenterY = rect.top + rect.height / 2
      const distX = e.clientX - btnCenterX
      const distY = e.clientY - btnCenterY
      const dist = Math.sqrt(distX ** 2 + distY ** 2)

      if (dist < MAGNETIC_AREA) {
        const strength = (MAGNETIC_AREA - dist) / MAGNETIC_AREA
        gsap.to(btn, {
          x: distX * strength * 0.4,
          y: distY * strength * 0.4,
          duration: 0.3,
          ease: 'power2.out',
        })
      } else {
        gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <button
      ref={btnRef}
      data-magnetic
      onClick={onClick}
      disabled={loading}
      style={{
        padding: '0.75rem 2rem',
        fontFamily: 'var(--font-body)',
        fontSize: '0.8rem',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        cursor: loading ? 'not-allowed' : 'none',
        background: outlined ? 'transparent' : 'var(--accent-cyan)',
        color: outlined ? 'var(--accent-cyan)' : 'var(--bg-base)',
        border: outlined ? '1px solid var(--border-glow)' : '1px solid var(--accent-cyan)',
        borderRadius: '4px',
        opacity: loading ? 0.7 : 1,
        boxShadow: outlined ? 'none' : 'var(--glow-cyan)',
        transition: 'opacity 0.2s',
      }}
    >
      {children}
    </button>
  )
}
```

**Verification:**
- [ ] Moving mouse NEAR button (within 80px): button floats toward cursor
- [ ] Formula: `strength = (80 - dist) / 80`, movement = `distX * strength * 0.4`
- [ ] Mouse leaves 80px area: elastic spring-back
- [ ] Window-level listener (not just onMouseMove on button)

---

### STEP 18.5 — aurora.frag: Replace with Exact System Prompt GLSL

> System prompt provides EXACT palette() function. Previous aurora.frag is NOT aligned.

**Action:** Replace `src/shaders/aurora.frag` COMPLETELY:
```glsl
uniform float uTime;
uniform vec2 uMouse;
varying vec2 vUv;

vec3 palette(float t) {
  vec3 a = vec3(0.5, 0.5, 0.5);
  vec3 b = vec3(0.5, 0.5, 0.5);
  vec3 c = vec3(1.0, 1.0, 1.0);
  vec3 d = vec3(0.263, 0.416, 0.557);
  return a + b * cos(6.28318 * (c * t + d));
}

void main() {
  vec2 uv = vUv - 0.5;
  uv += uMouse * 0.1;
  float len = length(uv);
  float angle = atan(uv.y, uv.x);
  float noise = sin(angle * 5.0 + uTime * 0.5) * 0.5 + 0.5;
  vec3 color = palette(len * 2.0 - uTime * 0.2 + noise * 0.3);
  gl_FragColor = vec4(color, 0.6);
}
```

Update ContactShader.tsx uniforms to match — remove `uOpacity` (not in this shader):
```tsx
uniforms={{
  uTime:  { value: 0 },
  uMouse: { value: new THREE.Vector2(0, 0) },
  // uOpacity removed — opacity is hardcoded 0.6 in shader
}}
```

**Verification:**
- [ ] palette() function present with exact a,b,c,d vectors from system prompt
- [ ] Aurora colors shift: cyan → violet → amber (palette output)
- [ ] uMouse affects UV offset (mouse shifts the aurora)
- [ ] gl_FragColor alpha = 0.6 (semi-transparent)

---

### STEP 18.6 — SkillBar.tsx: New Component (Was Completely Missing)

> System prompt: "Skill bars with counter animation (0% → actual %)"
> This component DID NOT EXIST. Create it now.

**Action:** Create `src/components/ui/SkillBar.tsx` (full code in design.md Section 11.5).

**Action:** Update `src/sections/Skills.tsx` to import and use SkillBar:
```tsx
import { SkillBar } from '../components/ui/SkillBar'

// Add SKILL_BARS data array:
const SKILL_BARS = [
  { label: 'React.js / Next.js', pct: 90, color: '#61DAFB' },
  { label: 'Node.js / Express',  pct: 85, color: '#68A063' },
  { label: 'MongoDB',            pct: 80, color: '#47A248' },
  { label: 'Socket.IO / Redis',  pct: 80, color: '#00F5FF' },
  { label: 'GSAP / Three.js',    pct: 75, color: '#88CE02' },
  { label: 'TypeScript',         pct: 60, color: '#FF6B35' },
  { label: 'Docker / CI-CD',     pct: 40, color: '#FF6B35' },
]

// Add below skill tag grid in Skills section JSX:
<div style={{ marginTop: '3rem', maxWidth: '500px' }}>
  <h3 style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: 'var(--text-secondary)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
    Proficiency
  </h3>
  {SKILL_BARS.map(s => (
    <SkillBar key={s.label} label={s.label} percentage={s.pct} color={s.color} />
  ))}
</div>
```

**Verification:**
- [ ] `src/components/ui/SkillBar.tsx` exists
- [ ] Bars start at 0% width on scroll into view
- [ ] Bar fills to actual% with GSAP (duration 1.2s, power2.out)
- [ ] Counter number increments simultaneously with bar fill
- [ ] Color matches skill category
- [ ] ScrollTrigger cleanup (ctx.revert)

---

### STEP 18.7 — SkillsOrbs: Float Toward Camera on Hover

> System prompt: "Mouse hover → a sphere breaks orbit and floats toward camera"
> Current: only emissive intensity change. Missing z-axis camera float.

**Action:** Update `src/components/3D/SkillsOrbs.tsx` onPointerEnter/Leave:
```tsx
onPointerEnter={(e) => {
  e.stopPropagation()
  const mesh = refs.current[i]
  if (!mesh) return
  // Store original z
  mesh.userData.originalZ = mesh.position.z
  // Float toward camera
  gsap.to(mesh.position, {
    z: mesh.userData.originalZ + 1.5,
    duration: 0.4,
    ease: 'back.out(2)',
  })
  const mat = mesh.material as THREE.MeshStandardMaterial
  gsap.to(mat, { emissiveIntensity: 1.5, duration: 0.3 })
}}
onPointerLeave={() => {
  const mesh = refs.current[i]
  if (!mesh) return
  gsap.to(mesh.position, {
    z: mesh.userData.originalZ ?? 0,
    duration: 0.6,
    ease: 'elastic.out(1, 0.4)',
  })
  const mat = mesh.material as THREE.MeshStandardMaterial
  gsap.to(mat, { emissiveIntensity: 0.2, duration: 0.3 })
}}
```

**Verification:**
- [ ] Hovering any sphere: it pops toward camera by +1.5 units on z
- [ ] Pointer events must work — canvas needs `pointerEvents: 'auto'` during Skills section OR use raycasting
- [ ] Leave: elastic spring-back to original z
- [ ] Other spheres continue orbiting while one is hovered

---

### STEP 18.8 — Hero Section: Chars Animation + Camera Pull-Away

> System prompt Recipe #1: `y:-200, rotateX:-90, stagger:0.02, ease:'back.out(2)'`
> Current: `opacity:0, y:-30` — wrong values, wrong ease.

**Action:** Update `src/sections/Hero.tsx`:
```tsx
// 1. Split hero DOM title into chars
// Add a span per char in the DOM for the aria-hidden hero label:
<div
  className="hero-title"
  aria-hidden="true"
  style={{ position: 'absolute', top: '8rem', width: '100%', textAlign: 'center' }}
>
  {'UZAIR MANZOOR'.split('').map((char, i) => (
    <span
      key={i}
      style={{
        display: 'inline-block',
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(3.5rem, 10vw, 9rem)',
        fontWeight: 800,
        color: 'var(--accent-cyan)',
        letterSpacing: '-0.03em',
        whiteSpace: char === ' ' ? 'pre' : 'normal',
      }}
    >
      {char}
    </span>
  ))}
</div>

// 2. GSAP animation — system prompt exact:
useLayoutEffect(() => {
  const ctx = gsap.context(() => {
    const chars = document.querySelectorAll('.hero-title span')

    // Chars fall from top on load (not scroll-triggered for hero)
    gsap.from(chars, {
      y: -200,
      opacity: 0,
      rotateX: -90,
      stagger: 0.02,
      duration: 1.2,
      ease: 'back.out(2)',          // ← SYSTEM PROMPT EXACT
      delay: 0.3,
    })

    // Camera pull-away + scatter on scroll
    gsap.to('.hero-title', {
      opacity: 0, y: -50,
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: '20% top',
        scrub: true,
      }
    })
  }, sectionRef)
  return () => ctx.revert()
}, [])
```

**Verification:**
- [ ] On page load: chars animate from y:-200, rotateX:-90 with stagger
- [ ] Ease is `back.out(2)` (has overshoot bounce)
- [ ] On scroll: title fades + moves up (camera pull-away effect)
- [ ] 3D text in canvas moves simultaneously (coordinated)

---

### STEP 18.9 — Section Entry: blur(20px) Framer Motion

> System prompt Recipe #4: `initial={{ filter: 'blur(20px)' }}`
> Current sections: no blur filter on entry.

**Action:** Wrap the inner content div of EACH section with motion.div:
```tsx
// Apply this pattern in: About.tsx, Skills.tsx, Experience.tsx, Education.tsx, Contact.tsx
import { motion } from 'framer-motion'

// Wrap section content (NOT the <section> tag itself — keep section for ScrollTrigger):
<section id="about" ref={sectionRef} style={{ minHeight: '100vh', ... }}>
  <motion.div
    initial={{ opacity: 0, y: 60, filter: 'blur(20px)' }}
    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
    viewport={{ once: true, margin: '-100px' }}
    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    style={{ maxWidth: '1200px', margin: '0 auto', ... }}
  >
    {/* section content */}
  </motion.div>
</section>
```

Note: `filter: 'blur(20px)'` has GPU cost. If performance drops below 55fps, reduce to `blur(8px)`.

**Verification:**
- [ ] Scrolling to About: content blurs in (0px after transition)
- [ ] Same for Skills, Experience, Education, Contact
- [ ] Hero does NOT use this pattern (has custom chars animation)
- [ ] FPS stays ≥ 55 with blur transitions

---

### STEP 18.10 — Contact: Sparkles on Form Submit

> System prompt: "success → confetti burst using <Sparkles>"

**Action:** Add Sparkles to ContactShader.tsx via Zustand state:
```tsx
// In useStore.ts — add:
formSuccess: boolean
setFormSuccess: (v: boolean) => void

// In ContactShader.tsx:
import { Sparkles } from '@react-three/drei'
const formSuccess = useStore((s) => s.formSuccess)

// Inside Canvas return:
{formSuccess && (
  <Sparkles
    count={60}
    scale={[6, 6, 6]}
    size={2}
    speed={0.5}
    opacity={0.8}
    color="#00F5FF"
    position={[0, 0, 0]}
  />
)}

// In Contact.tsx handleSubmit success:
const setFormSuccess = useStore((s) => s.setFormSuccess)
setTimeout(() => {
  setFormState('success')
  setFormSuccess(true)
  // Auto-reset after 3s
  setTimeout(() => setFormSuccess(false), 3000)
}, 2000)
```

**Verification:**
- [ ] Form submit → 2s → success state shows
- [ ] Sparkles burst appears in 3D scene (cyan particles scatter)
- [ ] Sparkles disappear after 3s
- [ ] formSuccess state in Zustand

---

### STEP 18.11 — animations.css: Create File

> System prompt folder: `styles/animations.css — Keyframe library`
> File was MISSING.

**Action:** Create `src/styles/animations.css` (full content in design.md Section 11.13).

**Action:** Import in `src/main.tsx`:
```tsx
import './styles/globals.css'
import './styles/animations.css'    // ← ADD
```

**Verification:**
- [ ] `src/styles/animations.css` exists
- [ ] `.animate-float`, `.animate-glow`, `.animate-bounce` classes work
- [ ] Scroll indicator in Hero uses `.animate-bounce` class

---

### STEP 18.12 — assets/ Directory Structure

> System prompt folder: `assets/models/` + `assets/textures/`

**Action:**
```bash
mkdir -p src/assets/models
mkdir -p src/assets/textures
touch src/assets/models/.gitkeep
touch src/assets/textures/.gitkeep
```

Add `.gitkeep` so empty directories are tracked in git.

If project screenshots are available:
```bash
# Place at:
public/textures/project-sirp.webp       # SIRP screenshot, 1024×640
public/textures/project-jobportal.webp   # Job portal screenshot, 1024×640
```

**Verification:**
- [ ] `src/assets/models/` exists
- [ ] `src/assets/textures/` exists
- [ ] `public/textures/` exists for project screenshots

---

### STEP 18.13 — Final System Prompt Alignment Checklist

Run through ALL system prompt elements — final verification:

#### Canvas & Scene
- [ ] `THREE.ACESFilmicToneMapping` in gl config
- [ ] `toneMappingExposure: 1.2` in gl config
- [ ] `<directionalLight position={[5,5,5]} intensity={1.5} castShadow />`
- [ ] `<Environment preset="night" />`
- [ ] `<PostProcessing />` as dedicated component
- [ ] `<SMAA />` in EffectComposer (desktop)

#### Particles
- [ ] Y-based color gradient (cyan bottom → violet top)
- [ ] Wind drift on scroll
- [ ] Mouse repulsion radius 0.5

#### Hero
- [ ] Chars: `y:-200, rotateX:-90, stagger:0.02, ease:'back.out(2)'`
- [ ] Scroll: camera pull-away + particles scatter

#### Skills
- [ ] SkillBar component with counter 0%→actual%
- [ ] Skill sphere floats toward camera on hover (z+1.5)

#### Projects
- [ ] Camera bezier path (or well-documented linear alternative)
- [ ] Active card Bloom emissive glow
- [ ] DepthOfField on inactive cards

#### Contact
- [ ] `aurora.frag` uses exact system prompt `palette()` GLSL
- [ ] `<Sparkles>` on form submit success
- [ ] uMouse shifts UV in shader

#### Animations
- [ ] Section entry: `filter: blur(20px)` Framer Motion
- [ ] MagneticButton: `magneticArea=80px` radius formula
- [ ] `animations.css` keyframe library exists

#### Files
- [ ] `PostProcessing.tsx` dedicated file
- [ ] `SkillBar.tsx` dedicated file
- [ ] `animations.css` exists
- [ ] `src/assets/models/` + `src/assets/textures/` exist
- [ ] `aurora.frag` = exact system prompt shader

#### Typography (acceptable choices made)
- [ ] Display: Syne (system prompt first choice: Space Grotesk, second: Syne — Syne chosen ✓)
- [ ] Body: DM Mono (system prompt first choice: DM Mono ✓)
