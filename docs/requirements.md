# 📋 REQUIREMENTS.MD
# Uzair Manzoor — 3D Interactive Portfolio
> Source: Resume + System Prompt (3D Portfolio Blueprint)
> Version: 3.0 — System Prompt Exact Alignment

---

## ⚠️ AI: WHERE ARE THE 3 REFERENCE FILES?

```
uzair-portfolio/
└── docs/
    ├── requirements.md   ← YOU ARE HERE — read this first
    ├── design.md         ← read this second (visual + component specs)
    └── task.md           ← read this third (Phase 0→18, step-by-step code)
```

**Reading order is mandatory:**
1. `docs/requirements.md` — this file. Get all developer data + FR list.
2. `docs/design.md` — visual design, section specs, folder structure with Spec cross-references.
3. `docs/task.md` — execute Phase by Phase. Do NOT skip Phase 18.

**Cross-reference pattern:** Every component in task.md references its spec location like:
`Spec: task.md Step 5.1 | design.md §3 Hero | requirements.md FR-03`

---

## 1. DEVELOPER PROFILE DATA

### Personal Info
```
Full Name:    Uzair Manzoor
Title:        MERN Stack Developer
Email:        uk873195@gmail.com
Phone:        +91-73798-55969
Location:     Kanpur, UP
Remote:       Open to Remote
LinkedIn:     linkedin.com/in/uzair-manzoor-8b2189385
GitHub:       github.com/uzairmanzoor7379
```

### Professional Summary (Use in About Section)
```
MERN Stack Developer with 3-month internship at Amdox. Shipped production-grade
applications including SIRP — an AI-powered incident response platform with real-time
Socket.IO dashboards (sub-50ms latency) and Google Gemini API integration. Also built
a multi-role job portal with JWT-based RBAC and MongoDB-indexed queries.
Skilled in REST API development, Redis, Cloudinary, and secure backend architecture.
```

---

## 2. TECHNICAL SKILLS DATA

### Frontend
```
React.js, Next.js, JavaScript (ES6+), Redux, HTML5, CSS3,
Tailwind CSS, SCSS, Framer Motion, GSAP, Three.js
```

### Backend
```
Node.js, Express.js, REST API Design, Socket.IO, JWT, Redis,
Multer, Helmet, bcrypt, CORS
```

### Database
```
MongoDB (indexing, denormalized schema design), Firebase
```

### Tools & Platforms
```
Git, GitHub, Postman, Vercel, Netlify, Cloudinary, MediaPipe, Figma
```

### AI & Integrations
```
Google Gemini API, node-cron, Resend (email API), OTP workflows
```

### Currently Learning
```
TypeScript, Docker, Jest (unit testing), CI/CD pipelines
```

---

## 3. WORK EXPERIENCE DATA

### Amdox — Software Development Intern
```
Period:    January 2026 – March 2026
Location:  Kanpur, UP

Achievements:
• 4+ full-stack MERN modules for internal web applications
• 6+ responsive React.js UI components integrated with RESTful APIs
  → Improved UI consistency, reduced frontend rendering issues
• REST APIs with MongoDB: CRUD + auth workflows
  → Reduced manual data-handling steps by ~30%
• JWT-based authentication, session management, debugging pipelines
• Git/GitHub collaboration in 4-member Agile dev team
• Daily standups + sprint reviews, delivered modules within sprints
```

---

## 4. PROJECTS DATA

### Project 1: SIRP — Smart Incident Response Platform
```
Type:       Hackathon Project
Team:       4 members
Role:       Full Stack
Live URL:   https://smarterresponse.xyz
GitHub:     (not listed separately)

Tech Stack:
  MERN, Socket.IO, Google Gemini 1.5 Flash, node-cron,
  Resend, Cloudinary, Redis

Key Achievements:
• Led backend architecture for AI-powered incident management platform
• Reduced manual incident triage time by ~60% via AI detection + assignment
• Google Gemini API → structured log analysis + incident classification
• Socket.IO real-time dashboards → sub-50ms live update latency
• Supports 10+ concurrent active incidents simultaneously
• Layered security: JWT + OTP (Resend) + RBAC + httpOnly cookies
  → Zero auth vulnerabilities in testing
• Automated engineer assignment logic + incident lifecycle state machine
• Public status page → reduced manual communication effort by ~70%
• Analytics dashboards: MTTR + incident frequency metrics for team leads
```

### Project 2: Job Listing Portal
```
Type:       Personal Project
Live URL:   https://job-portal-befp.onrender.com
GitHub:     github.com/uzairmanzoor7379/job-portal

Tech Stack:
  MERN, JWT, SCSS, React Context API,
  Helmet, bcrypt, MongoDB Indexing

Key Achievements:
• Full-stack job marketplace: 2 roles (Employer + Job Seeker)
• Separate dashboards + protected routing architecture
• Role-based JWT auth → secure httpOnly cookies → zero session-hijacking
• Complete job lifecycle: CRUD, resume upload (Multer), application tracking
• Multi-criteria job filtering → reduced user search time
• MongoDB indexing + denormalized schema → ~40% faster query response
• Helmet + rate limiting + CORS + bcrypt → hardened vs OWASP Top 10
```

---

## 5. EDUCATION DATA

```
Degree:       Bachelor of Arts (BA)
Institution:  P.S.P.T. College, Kanpur
Expected:     May 2026
Self-Study:   Full-Stack Web Development, Data Structures, System Design

Previous:     Intermediate (CBSE Board), Kanpur, 2023
```

---

## 6. CERTIFICATIONS DATA

```
1. AI-Powered MERN Stack Development
   Institution: Sheryians Coding School
   Expected:    June 2026

2. Full-Stack Web Development
   Institution: ASDC Kanpur
   Year:        2026
```

---

## 7. FUNCTIONAL REQUIREMENTS

### FR-01: Smooth Scrolling
- Lenis smooth scroll MUST be active on all pages
- Lenis synced with GSAP ticker (`autoRaf: false`)
- `lerp: 0.08`, `duration: 1.2`
- CRITICAL: `lenisRef.current?.lenis?.on('scroll', ScrollTrigger.update)` MUST be called to sync ScrollTrigger
- On mobile: native scroll (disable Lenis)

### FR-02: 3D Canvas
- Fixed position Three.js canvas (z-index: 0) behind all HTML
- Canvas transparent background (`alpha: true`)
- Continuous ambient animation even without user interaction
- Postprocessing: Bloom + ChromaticAberration + Vignette
- Must NOT block HTML interaction (`pointerEvents: none` on canvas)
- DPR capped at `Math.min(2, window.devicePixelRatio)` — use `dpr={[1, Math.min(2, window.devicePixelRatio)]}`

### FR-03: Mouse Interactivity
- Global mouse position tracked (normalized -1 to 1)
- Camera subtly tilts based on mouse X/Y
- 3D objects drift toward/away from cursor
- Particle field: mouse repulsion within radius 0.5 on particles near cursor
- Custom cursor: dot + ring, ring lags (GSAP lerp factor 0.12)
- Cursor state changes:
  - Default: dot=8px ring=32px
  - Over link: dot=0px ring=60px + mix-blend-mode:difference
  - Over button: ring fills cyan 20% opacity + "CLICK" label inside ring
  - Over canvas: ring becomes crosshair + glow
  - Clicking: ring scales 0.8 (spring snap)
- Magnetic buttons on CTAs and nav links
- Custom cursor hidden on mobile/touch

### FR-04: Scroll-Driven Animations
- GSAP ScrollTrigger controls all section reveals
- Each section PINNED while its animation completes
- Text split into chars/words, animated on scroll
- 3D scene transforms (scale, rotate, position) linked to scroll progress
- Horizontal project scroll while page scrolls vertically

### FR-05: Sections Required (in order)
1. Hero — 3D name + particle field (with mouse repulsion) + scroll CTA
2. About — Bio + skills overview + morphing geometry (enter scale 0→1, exit dissolve into particles)
3. Skills — Animated skill categories + orbital tech icon spheres
4. Projects — SIRP + Job Portal (horizontal 3D carousel with DepthOfField blur on inactive)
5. Experience — Amdox internship timeline + ExperienceScene (rotating torus wireframe)
6. Education & Certifications
7. Contact — Form + social links + aurora shader background
8. Footer — Social links + copyright

### FR-06: Responsiveness
- Desktop (>1024px): Full 3D experience
- Tablet (768–1024px): Basic 3D, reduced postprocessing
- Mobile (<768px): CSS 3D only, no WebGL, native scroll, no horizontal project scroll

### FR-07: Performance
- FPS ≥ 55 on mid-range laptop
- Lighthouse Performance score ≥ 85
- All 3D models compressed (Draco)
- Lazy loading for below-fold sections using React.lazy() + Suspense
- r3f-perf installed and used in development mode ONLY
- DPR capped at Math.min(2, devicePixelRatio)

### FR-08: Accessibility
- All canvas is `aria-hidden="true"`
- Real content in semantic HTML under canvas
- `prefers-reduced-motion` disables GSAP animations
- Color contrast ≥ 4.5:1 on all text
- Tab navigation reaches all interactive elements
- Form fields have associated labels or aria-label

### FR-09: Loading Screen (3D)
- Loading screen MUST use a Three.js canvas — NOT a plain DOM element
- Shows "UM" monogram as Text3D (3D text, spinning slowly)
- Particle ring orbiting the monogram
- Progress bar below canvas (thin cyan line, 0→100%)
- Label: "LOADING UZAIR'S UNIVERSE..." in DM Mono
- Exit: canvas scale 1→3 + opacity 0, main site fades in (AnimatePresence)

---

## 8. NON-FUNCTIONAL REQUIREMENTS

| Item               | Requirement                                          |
|--------------------|------------------------------------------------------|
| Framework          | React 18 + Vite 5                                    |
| Language           | **TypeScript (strict mode) — NON-NEGOTIABLE**        |
| Styling            | Tailwind CSS 4.x + global CSS variables              |
| State Management   | Zustand (mouse state, scroll progress, active section)|
| Package Manager    | npm                                                  |
| Deployment         | Vercel (recommended)                                 |
| Browser Support    | Chrome 115+, Firefox 128+, Safari 17+               |
| Font Loading       | Google Fonts via @import (preconnect)                |
| Scaffold Command   | `npm create vite@latest uzair-portfolio -- --template react-ts` |

---

## 9. CONTENT CONSTRAINTS

- NO placeholder text (lorem ipsum strictly forbidden)
- All content must come from resume data above
- Project cards must show real URLs (live + GitHub)
- Contact form must show real email (uk873195@gmail.com)
- Social links: LinkedIn + GitHub (exact URLs from resume)

---

## 10. DESIGN CONSTRAINTS (from System Prompt)

- Color Scheme: Dark cosmos — background `#050508`
- Accent: Electric cyan `#00f5ff` OR neon violet `#7B2FBE`
- Highlight: Warm amber `#FF6B35`
- NO purple-gradient-on-white aesthetics
- NO Inter/Roboto/Arial fonts
- Typography: `Syne` (display) + `DM Mono` (body/code)
- Grain noise overlay on background
- Particle count: 5000 desktop, 1000 mobile

---

## 11. COMPLETE PACKAGE LIST (Non-Negotiable)

```bash
# Core dependencies
npm install three @react-three/fiber @react-three/drei @react-three/postprocessing gsap lenis framer-motion zustand maath

# Dev dependencies
npm install -D tailwindcss @tailwindcss/vite r3f-perf

# Note: @studio-freight/lenis is the fallback — install separately if lenis/react import fails
# npm install @studio-freight/lenis
```

---

## 12. SHADERS REQUIRED

| File                        | Purpose                                   |
|-----------------------------|-------------------------------------------|
| `src/shaders/aurora.vert`   | Aurora vertex shader (Contact section)    |
| `src/shaders/aurora.frag`   | Aurora fragment shader (Contact section)  |
| `src/shaders/distort.frag`  | Distortion fragment shader (About morph)  |

---

## 13. GSAP PLUGINS TO REGISTER

```typescript
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import TextPlugin from 'gsap/TextPlugin'

gsap.registerPlugin(ScrollTrigger, TextPlugin)
```
TextPlugin is required for typewriter text effects (Hero subtitle, section labels).

---

## 14. SYSTEM PROMPT ALIGNMENT ADDITIONS (GOD MODE FIX)

### FR-10: Canvas GL Config (Exact System Prompt)
```typescript
gl={{
  antialias: true,
  alpha: true,
  powerPreference: 'high-performance',
  toneMapping: THREE.ACESFilmicToneMapping,    // REQUIRED — system prompt
  toneMappingExposure: 1.2,                    // REQUIRED — system prompt
}}
```

### FR-11: Scene Lighting (Exact System Prompt)
```typescript
// THREE lights required — NONE can be omitted:
<ambientLight intensity={0.2} />
<directionalLight position={[5, 5, 5]} intensity={1.5} castShadow />
// Plus: <Environment preset="night" /> from @react-three/drei
```

### FR-12: Particle Color Gradient (Y-based)
- Particle color must gradient from cyan (#00F5FF) at bottom to violet (#7B2FBE) at top
- Based on particle Y position: `color = mix(cyan, violet, normalizedY)`
- NOT flat cyan color for all particles

### FR-13: Particle Wind Behavior
- On scroll: particles slowly drift in a "wind direction"
- Implement by adding a scroll-linked offset to particle positions
- Drift direction: slightly diagonal (x+0.001 per scroll unit, y-0.0005)

### FR-14: SkillBar Component (REQUIRED — was completely missing)
- `src/components/ui/SkillBar.tsx` MUST exist
- Animated progress bar: 0% → actual% triggered by scroll into view
- Counter animation runs simultaneously with bar fill
- Skills with percentage values to display:
  ```
  React.js:    90%
  Node.js:     85%
  MongoDB:     80%
  Socket.IO:   80%
  GSAP/Three:  75%
  TypeScript:  60% (learning)
  Docker:      40% (learning)
  ```

### FR-15: ScrollControls Architecture (System Prompt Primary Pattern)
- System prompt uses `<ScrollControls pages={6} damping={0.3}>` from @react-three/drei
- This wraps HeroScene, AboutScene, ProjectsCarousel, ContactScene
- Alternative: Custom SectionManager (task.md Phase 17) is acceptable ONLY IF ScrollControls creates conflicts
- Document which pattern is chosen and why

### FR-16: Horizontal Project Track (Exact System Prompt Recipe)
```typescript
// EXACT system prompt implementation — must be in Projects section:
const tween = gsap.to(trackRef.current, {
  x: () => -(trackRef.current.scrollWidth - window.innerWidth) + 'px',
  ease: 'none',
  scrollTrigger: {
    trigger: containerRef.current,
    start: 'top top',
    end: () => `+=${trackRef.current.scrollWidth - window.innerWidth}`,
    pin: true,
    scrub: 1,
    invalidateOnRefresh: true,
  }
})
```

### FR-17: Magnetic Button — Exact System Prompt Formula
```typescript
// System prompt Recipe #5 — EXACT implementation:
const magneticArea = 80  // px radius — NOT simplified x*0.3

const handleMouseMove = (e: MouseEvent) => {
  const rect = btn.getBoundingClientRect()
  const btnCenterX = rect.left + rect.width / 2
  const btnCenterY = rect.top + rect.height / 2
  const distX = e.clientX - btnCenterX
  const distY = e.clientY - btnCenterY
  const dist = Math.sqrt(distX ** 2 + distY ** 2)

  if (dist < magneticArea) {
    const strength = (magneticArea - dist) / magneticArea
    gsap.to(btn, { x: distX * strength * 0.4, y: distY * strength * 0.4, duration: 0.3, ease: 'power2.out' })
  } else {
    gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' })
  }
}
```

### FR-18: Aurora Shader — Exact System Prompt GLSL
```glsl
// MUST use this exact palette function — not the simplified version:
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

### FR-19: Hero Scroll Behavior (Exact System Prompt)
```typescript
// On scroll start — ALL THREE must happen simultaneously:
// 1. name text floats back (z: -5, scale: 0.5)
// 2. camera pulls away (position.z increases)
// 3. particles scatter outward (scale sphere radius outward)
// Implemented as GSAP ScrollTrigger scrub on Hero section
```

### FR-20: Sparkles on Contact Submit
```typescript
import { Sparkles } from '@react-three/drei'
// On form success → show <Sparkles> in 3D scene OR use Framer Motion confetti
// System prompt: "success → confetti burst using <Sparkles>"
```

### FR-21: Typography Font Options
```
Display font: 'Space Grotesk' (FIRST choice) OR 'Syne' (second choice)
Body font:    'DM Mono' (FIRST choice) OR 'IBM Plex Mono' (second choice)
// Chosen: Syne + DM Mono (both acceptable per system prompt)
// Must import Space Grotesk as fallback option in globals.css
```

### FR-22: SMAA Antialiasing
```typescript
import { SMAA } from '@react-three/postprocessing'
// Add inside EffectComposer — desktop only:
<SMAA />
```

### FR-23: Assets Directory Structure
```
public/
├── fonts/
│   └── helvetiker_regular.typeface.json
├── textures/
│   ├── project-sirp.jpg          ← SIRP screenshot (1024×640 WebP)
│   └── project-jobportal.jpg     ← Job portal screenshot (1024×640 WebP)
└── models/
    └── (empty — using procedural geometry, not .glb)

src/assets/
├── models/     ← .glb files if any
└── textures/   ← Tech logo textures for skill spheres
```

### FR-24: Skill Sphere Texture Maps
- Each skill sphere needs a texture map (tech logo)
- Logos must be in `src/assets/textures/` as 256×256 PNG
- Use `useTexture` from @react-three/drei to load them
- If logos unavailable: use colored emissive spheres (current fallback is acceptable)

### FR-25: Hero Chars Animation (Exact System Prompt Recipe #1)
```typescript
// System prompt Recipe #1 — chars fall from top:
gsap.from(chars, {
  y: -200,
  opacity: 0,
  rotateX: -90,
  stagger: 0.02,
  ease: 'back.out(2)',          // NOT power4.out — back.out(2) for bounce feel
  scrollTrigger: { trigger: sectionRef.current, scrub: 1 }
})
```

### FR-26: Section Entry — Framer Motion Blur Filter
```typescript
// System prompt Recipe #4 — ALL sections use this entry pattern:
<motion.section
  initial={{ opacity: 0, y: 60, filter: 'blur(20px)' }}
  whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
  viewport={{ once: true, margin: '-100px' }}
  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
>
```

### FR-27: PostProcessing.tsx — Dedicated File
- Postprocessing MUST be extracted into `src/components/3D/PostProcessing.tsx`
- Scene.tsx imports `<PostProcessing />` component
- Keeps Scene.tsx clean and modular

### FR-28: MouseTracker.tsx — Provider Pattern
- System prompt uses `providers/MouseTracker.tsx` as a provider component
- Current hook pattern (useMouseTracker.ts) is acceptable alternative
- Document which pattern is used

### FR-29: animations.css — Keyframe Library
- `src/styles/animations.css` must exist with CSS keyframe animations
- Content: bounce, float, pulse-glow, scan-line keyframes
- Imported in main.tsx after globals.css

### FR-30: Contact Section — 3D Envelope (Primary Element)
- System prompt PRIMARY contact 3D element: "Animated 3D envelope/letter geometry that opens on scroll reveal"
- Aurora shader is the BACKGROUND, not the primary element
- Must implement one of:
  a) BoxGeometry with hinged lid (GSAP rotateX on scroll)
  b) Particle field forming email icon shape
  c) If too complex: document why aurora-only is acceptable fallback
