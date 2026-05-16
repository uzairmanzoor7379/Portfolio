# 🎨 DESIGN.MD
# Uzair Manzoor — 3D Portfolio Visual & Interaction Design Spec
> Version: 2.0 — All brutal-check gaps resolved

---

## 1. VISUAL IDENTITY

### Color System
```css
:root {
  /* Backgrounds */
  --bg-base:        #050508;   /* Deep space black */
  --bg-surface:     #0D0D14;   /* Card / overlay surface */
  --bg-elevated:    #12121E;   /* Elevated panels */

  /* Brand Accents */
  --accent-cyan:    #00F5FF;   /* Primary — electric cyan */
  --accent-violet:  #7B2FBE;   /* Secondary — neon violet */
  --accent-amber:   #FF6B35;   /* Highlight — warm amber */

  /* Text */
  --text-primary:   #F0F0FF;   /* Near white */
  --text-secondary: #8888AA;   /* Muted */
  --text-accent:    #00F5FF;   /* Cyan labels */

  /* Borders / Dividers */
  --border-subtle:  rgba(0, 245, 255, 0.08);
  --border-glow:    rgba(0, 245, 255, 0.3);

  /* Glow Effects */
  --glow-cyan:   0 0 40px rgba(0, 245, 255, 0.4);
  --glow-violet: 0 0 40px rgba(123, 47, 190, 0.4);
  --glow-amber:  0 0 20px rgba(255, 107, 53, 0.3);
}
```

### Typography
```css
/* Google Fonts Import */
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,400&display=swap');

/* Scale */
--font-display:  'Syne', sans-serif;       /* Hero name, section titles */
--font-body:     'DM Mono', monospace;     /* Body text, labels, code */

/* Sizes */
--text-hero:    clamp(3.5rem, 10vw, 9rem);   /* "UZAIR MANZOOR" */
--text-title:   clamp(2rem, 5vw, 4rem);      /* Section headings */
--text-sub:     clamp(1rem, 2vw, 1.3rem);    /* Subheadings */
--text-body:    0.9rem;                       /* Body copy */
--text-label:   0.75rem;                      /* Tags, labels */

/* Letter Spacing */
--tracking-hero:  -0.03em;
--tracking-title: -0.02em;
--tracking-label: 0.15em;                    /* Uppercase labels */
```

### Texture & Atmosphere
```css
/* Grain noise overlay — applied on <body>::after */
background-image: url("data:image/svg+xml,...");  /* SVG noise */
opacity: 0.04;
mix-blend-mode: overlay;

/* Scanlines on sections (optional, subtle) */
background: repeating-linear-gradient(
  0deg,
  transparent,
  transparent 2px,
  rgba(0,0,0,0.03) 2px,
  rgba(0,0,0,0.03) 4px
);
```

---

## 2. LAYOUT ARCHITECTURE

### Overall Page Structure
```
┌─────────────────────────────────────────────────────┐
│  <canvas> — Fixed, full viewport, z-index: 0        │
│  (Three.js scene — always behind everything)        │
├─────────────────────────────────────────────────────┤
│  <CustomCursor> — Fixed, z-index: 9999              │
├─────────────────────────────────────────────────────┤
│  <Navbar> — Fixed top, z-index: 100                 │
│  [UZAIR]  [About] [Skills] [Projects] [Contact]     │
├─────────────────────────────────────────────────────┤
│  <main> — Scrollable, z-index: 10                   │
│  (Transparent background — canvas shows through)    │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │  Section: Hero          (100vh pinned)        │  │
│  │  Section: About         (150vh pinned)        │  │
│  │  Section: Skills        (120vh)               │  │
│  │  Section: Projects      (300vh horizontal)    │  │
│  │  Section: Experience    (120vh)               │  │
│  │  Section: Education     (100vh)               │  │
│  │  Section: Contact       (120vh)               │  │
│  └───────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────┤
│  <Footer>                                           │
└─────────────────────────────────────────────────────┘
```

### Navbar Design
```
Position: fixed top-0, full width
Height: 64px
Background: rgba(5, 5, 8, 0.6) + backdrop-blur(20px)
Border-bottom: 1px solid var(--border-subtle)

Left:  "UM" monogram in cyan — font: Syne 700, 1.2rem
       On hover → glows with var(--glow-cyan)

Center: Nav links — [About] [Skills] [Projects] [Experience] [Contact]
        Font: DM Mono, 0.75rem, letter-spacing: 0.15em, UPPERCASE
        Active state: cyan underline (animated width 0→100%)
        Hover: cyan color + slight translateY(-2px)

Right:  [Download CV] button — magnetic, outlined
        + Scroll progress bar at very bottom of navbar (1px line, cyan)

Mobile: Hamburger → fullscreen overlay menu with staggered link reveal
```

---

## 3. SECTION-BY-SECTION DESIGN

---

### SECTION 1: HERO

#### Layout
```
Full viewport (100vh), centered content
Background: Three.js canvas showing through
```

#### 3D Scene (Three.js)
```
Component: <HeroScene />  ← file: src/components/3D/HeroScene.tsx

1. PARTICLE FIELD (background layer)
   - 5000 points in sphere distribution (radius: 8)
   - Color: #00F5FF (cyan), size: 0.008
   - Blending: THREE.AdditiveBlending
   - Continuous slow rotation on X and Y axes
   - Mouse repulsion: particles within radius 0.5 of cursor gently repel
     Implementation: in useFrame, for each particle, compute distance to
     mouseX/mouseY (normalized), if dist < 0.5 push particle away with
     strength = (0.5 - dist) / 0.5 * 0.02, lerp back to original position
     over time

2. FLOATING NAME — "UZAIR MANZOOR" in 3D
   - Component: <Text3D> from @react-three/drei
   - Font: helvetiker_regular.typeface.json (place in public/fonts/)
   - Material: MeshStandardMaterial, color: #00F5FF, metalness: 0.9, roughness: 0.1
   - Float animation: <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
   - Point light (color: #00F5FF, intensity: 3) follows mouse — creates moving shadow

3. CAMERA BEHAVIOR
   - Mouse X/Y → camera.position.x/y lerp (factor: 0.03)
   - camera.lookAt(0, 0, 0) always

4. SCROLL EXIT BEHAVIOR
   - On scroll start: Text3D group z → -5, scale → 0.5 (GSAP, handled in Hero.tsx)
   - Particles scatter outward (scale the sphere radius outward)
```

#### DOM Content (over canvas)
```
Position: absolute center
Layout: flex-col, items-center, text-center

Line 1: invisible spacer (3D text is visual name, DOM has aria placeholder only)

Line 2: "MERN Stack Developer"
         Font: DM Mono, --text-sub, color: --text-secondary
         Letter-spacing: 0.3em, uppercase
         Framer Motion: initial opacity:0, y:20 → animate opacity:1, y:0 (delay: 0.8s)

Line 3: Location chip: "📍 Kanpur, UP · Open to Remote"
         Pill shape, border: var(--border-glow), bg: rgba(0,245,255,0.05)
         Framer Motion: fade in delay: 1s

Line 4 (bottom): Scroll indicator
         "↓ SCROLL TO EXPLORE" — DM Mono, 0.7rem, amber color
         Animated bouncing arrow (CSS keyframe)
         Position: absolute bottom: 2rem

SCROLL TRIGGER ACTION:
  On scroll start → DOM text fades out (opacity: 0, y: -30, scrub)
  3D name floats back into z-space (z: -5, scale: 0.5)
  Particles scatter outward
```

---

### SECTION 2: ABOUT

#### Layout
```
Height: 150vh (pinned while animation plays)
Split: Left 45% (3D) | Right 55% (text)
On mobile: stacked, 3D on top
```

#### 3D Scene
```
Component: <AboutGeometry />  ← file: src/components/3D/AboutGeometry.tsx

Geometry: IcosahedronGeometry (radius: 1.5, detail: 4)
Material: MeshDistortMaterial (from @react-three/drei)
  - color: #7B2FBE (violet)
  - distort: controlled by scroll progress (0 → 0.6)
  - speed: 2
  - roughness: 0.1
  - metalness: 0.8

Lighting:
  - pointLight #00F5FF position left, intensity 2
  - pointLight #FF6B35 position right-bottom, intensity 1.5

SCROLL BEHAVIOR:
  - Enter: scale 0 → 1 (spring easing, GSAP back.out(2))
  - Progress 0→50%: rotates slowly, distort increases (0 → 0.6)
  - Progress 50→100%: geometry DISSOLVES INTO PARTICLES
    Implementation:
      • Create a second Points mesh with same icosahedron vertex positions
      • On exit trigger: animate mesh opacity 1→0 and Points opacity 0→1
      • Simultaneously animate Points positions outward (multiply by 1.5)
      • Use GSAP timeline: { opacity to 0, scale to 1.5 } over 0.6s, power2.in
```

#### DOM Content (right side)
```
Section label: "// 001 — ABOUT"
  DM Mono, 0.7rem, cyan, letter-spacing: 0.2em

Heading: "Building systems that scale."
  Syne 700, --text-title

Body text (staggered word reveal on scroll):
  "MERN Stack Developer with a 3-month internship at Amdox..."
  [full summary from portfolioData.summary]
  Split by word → each word wrapped in <span>, GSAP stagger

Stats row (3 cards):
  ┌──────────┐  ┌──────────┐  ┌──────────┐
  │ 3 months │  │ 2 major  │  │ sub-50ms │
  │ @ Amdox  │  │ projects │  │ latency  │
  └──────────┘  └──────────┘  └──────────┘
  Each card: bg var(--bg-surface), border var(--border-subtle)
  Number: Syne 700, --text-title, cyan
  Label: DM Mono, --text-label, muted

CTA Button: [View Projects ↓] — MagneticButton component
```

---

### SECTION 3: SKILLS

#### Layout
```
Height: 120vh
Full width, centered
```

#### 3D Scene
```
Component: <SkillsOrbs />  ← file: src/components/3D/SkillsOrbs.tsx

8-10 spheres (one per skill category) arranged in elliptical orbit paths:
  - React.js / Next.js  (position 1)
  - Node.js / Express   (position 2)
  - MongoDB             (position 3)
  - Socket.IO           (position 4)
  - GSAP / Three.js     (position 5)
  - Tailwind / SCSS     (position 6)
  - Redis / JWT         (position 7)
  - Git / GitHub        (position 8)

Each sphere:
  - MeshStandardMaterial, unique color per category
  - Small size (radius: 0.15), wireframe: false
  - Bloom glow via postprocessing
  - Continuous orbit using sin/cos in useFrame:
    mesh.position.x = Math.cos(angle + time * speed) * orbitRadius
    mesh.position.z = Math.sin(angle + time * speed) * orbitRadius * 0.4

Mouse hover on sphere:
  - onPointerEnter: sphere lerps toward camera by +1 unit on z
  - emissive intensity increases to 1 (glow burst)
  - onPointerLeave: returns to orbit

SCROLL BEHAVIOR:
  Orbit speed: slow (0.3) → fast (1.5) as section scrolls through
  (Read scrollProgress from Zustand store, map to speed)
```

#### DOM Content
```
Section Label: "// 002 — SKILLS"
Heading: "What I work with."

Two-column grid of skill categories:
  LEFT COLUMN:
    Frontend Development
    [React.js] [Next.js] [JavaScript ES6+] [Redux]
    [Tailwind CSS] [SCSS] [Framer Motion] [GSAP] [Three.js]

    Backend Development
    [Node.js] [Express.js] [Socket.IO] [REST API]
    [JWT] [Redis] [Multer] [Helmet] [bcrypt]

  RIGHT COLUMN:
    Database & Storage
    [MongoDB] [Firebase] [Cloudinary]

    Tools & Platforms
    [Git] [GitHub] [Postman] [Vercel] [Netlify] [Figma]

    AI & Integrations
    [Google Gemini API] [node-cron] [Resend] [MediaPipe]

    Currently Learning
    [TypeScript] [Docker] [Jest] [CI/CD]

Skill tags: pill shape, monospace font, 0.7rem
  Default: border var(--border-subtle), bg transparent, text muted
  Hover: border cyan, bg rgba(0,245,255,0.08), text cyan
  "Currently Learning" tags: amber color + dashed border
```

---

### SECTION 4: PROJECTS

#### Layout
```
Height: 300vh (horizontal scroll container)
Pinned while camera travels horizontally
```

#### 3D Scene
```
Component: <ProjectCarousel3D />  ← file: src/components/3D/ProjectCarousel3D.tsx

Two project stations in 3D space:
  Station 1 — SIRP (x: -4, y: 0, z: 0)
  Station 2 — Job Portal (x: +4, y: 0, z: 0)

Each station:
  - PlaneGeometry (4:2.5 ratio) as a screen/frame
  - MeshStandardMaterial with color (SIRP: #00F5FF tinted, JobPortal: #FF6B35 tinted)
  - Screenshot texture: place project screenshots in public/textures/ and apply as map
    (If screenshot unavailable: use solid color plane — acceptable fallback)
  - Surrounded by point light (cyan for SIRP, amber for JobPortal)

DEPTH OF FIELD on inactive station — REQUIRED:
  - Use DepthOfField from @react-three/postprocessing
  - Active station: focusDistance targets that station's z
  - Inactive station: appears blurred (bokeh effect)
  - Toggle based on camera x position proximity

SCROLL BEHAVIOR:
  scrub: 1 (linked to scroll position)
  Camera x: -6 → +6 (passes through both stations)
  Active station: emissive glow increases, scale: 1 → 1.05
  Inactive: scale 1 → 0.9

Mouse hover over active station:
  Mesh rotates slightly (rotateY ±5° via lerp in useFrame)
```

#### DOM Content (overlaid, per project)
```
PROJECT CARD — position: absolute, bottom of screen
Triggered by: which station is active (camera.position.x proximity)

SIRP CARD:
┌─────────────────────────────────────────────────────┐
│ HACKATHON PROJECT · TEAM OF 4 · FULL STACK          │
│                                                     │
│  SIRP                                               │
│  Smart Incident Response Platform                   │
│                                                     │
│  AI-powered incident management reducing triage     │
│  time by ~60%. Sub-50ms real-time dashboards.       │
│                                                     │
│  [MERN] [Socket.IO] [Gemini API] [Redis] [JWT]     │
│                                                     │
│  [🌐 Live Demo ↗]   (no GitHub for this project)   │
└─────────────────────────────────────────────────────┘

JOB PORTAL CARD:
┌─────────────────────────────────────────────────────┐
│ PERSONAL PROJECT · FULL STACK                       │
│                                                     │
│  Job Listing Portal                                 │
│                                                     │
│  Full-stack marketplace with 2-role RBAC, JWT auth, │
│  resume upload, and 40% faster queries.             │
│                                                     │
│  [MERN] [JWT] [MongoDB] [Helmet] [bcrypt]          │
│                                                     │
│  [🌐 Live Demo ↗]  [GitHub ↗]                      │
└─────────────────────────────────────────────────────┘

Card bg: var(--bg-surface) + backdrop-blur
Border: 1px solid var(--border-glow)
Card enters: y: 80 → 0, opacity 0→1 (Framer Motion AnimatePresence)
Card 3D tilt: onMouseMove → rotateX/Y (CSS perspective)
```

---

### SECTION 5: EXPERIENCE

#### Layout
```
Height: 120vh
Vertical timeline layout, centered
```

#### 3D Scene  ← REQUIRED (was missing in v1)
```
Component: <ExperienceScene />  ← file: src/components/3D/ExperienceScene.tsx

Geometry: TorusGeometry (radius: 1.2, tube: 0.015, radialSegments: 100, tubularSegments: 200)
Material: MeshBasicMaterial, color: #7B2FBE, wireframe: true
Animation in useFrame:
  - ring.rotation.x += delta * 0.3
  - ring.rotation.y += delta * 0.2
Mouse reaction:
  - ring tilts toward cursor:
    ring.rotation.x += (mouseY * 0.5 - ring.rotation.x) * 0.05
    ring.rotation.y += (mouseX * 0.5 - ring.rotation.y) * 0.05
Position: center of scene [0, 0, 0]
Scale: 1.5
```

#### DOM Content
```
Section Label: "// 003 — EXPERIENCE"
Heading: "Where I've worked."

TIMELINE (vertical, left-aligned line in cyan):

  ●── Amdox — Software Development Intern
      Jan 2026 – March 2026 · Kanpur, UP

      • 4+ full-stack MERN modules for internal applications
      • 6+ React UI components integrated with RESTful APIs
        → Improved consistency, reduced rendering issues
      • REST APIs + MongoDB → reduced manual steps ~30%
      • JWT auth + session management + debugging pipelines
      • 4-member Agile team (Git/GitHub, daily standups)

Timeline bullet: filled cyan circle (12px)
Timeline line: 2px solid cyan, grows from top to bottom on scroll
  (GSAP scaleY from 0→1, transformOrigin: 'top center', scrub:1)
Each bullet point: appears with x:-30→0 stagger as scroll reaches it
```

---

### SECTION 6: EDUCATION & CERTIFICATIONS

#### Layout
```
Height: 100vh
Two columns: Education (left) | Certifications (right)
```

#### DOM Content
```
Section Label: "// 004 — EDUCATION"
Heading: "Learning never stops."

EDUCATION CARD:
  P.S.P.T. College, Kanpur
  Bachelor of Arts (BA)
  Expected: May 2026

  Self-Study:
  [Full-Stack Web Dev] [Data Structures] [System Design]

  Intermediate (CBSE Board)
  Kanpur · 2023

CERTIFICATIONS:
  ┌────────────────────────────────────┐
  │ 🎓 AI-Powered MERN Stack Dev      │
  │    Sheryians Coding School        │
  │    Expected: June 2026            │
  └────────────────────────────────────┘

  ┌────────────────────────────────────┐
  │ 🎓 Full-Stack Web Development     │
  │    ASDC Kanpur · 2026            │
  └────────────────────────────────────┘

Cards: border var(--border-subtle), hover → border-glow, lift (y: -4px)
Framer Motion whileInView entrance: initial opacity:0 y:40 → opacity:1 y:0
```

---

### SECTION 7: CONTACT

#### Layout
```
Height: 120vh
Full screen, centered form
```

#### 3D Scene
```
Component: <ContactShader />  ← file: src/components/3D/ContactShader.tsx

Full-screen plane (PlaneGeometry fills viewport) as background
ShaderMaterial with aurora vertex + fragment shader:
  - Animated UV noise creating flowing color waves
  - Colors: cyan + violet + amber
  - uTime uniform: increments in useFrame
  - uMouse uniform: updates from global mouse state
  - Opacity: 0.35 (subtle behind form)
```

#### DOM Content
```
Section Label: "// 005 — CONTACT"
Heading: "Let's build something."
Subtext: "uk873195@gmail.com · Open to remote opportunities"

CONTACT FORM (NO <form> element — use div wrapper):
  Field 1: Name — DM Mono input, bottom-border style (no box)
  Field 2: Email
  Field 3: Message — textarea, 4 rows

  Submit Button: [SEND MESSAGE →]
    - Magnetic hover
    - On submit: button morphs to spinning loader →
      success state: [✓ MESSAGE SENT] with <Sparkles> confetti burst
      (use setTimeout(2000) to simulate send — no real backend needed)

  Validation: real-time, inline error in amber color
    - Email format check on blur
    - Empty field check on submit attempt

SOCIAL LINKS (below form):
  [GitHub ↗] [LinkedIn ↗]
  Magnetic hover, DM Mono, uppercase, letter-spacing: 0.2em
```

---

### SECTION 8: FOOTER

```
Height: auto (min: 80px)
Background: var(--bg-base) + subtle top border in cyan (1px solid var(--border-subtle))

Left:  "© 2026 Uzair Manzoor" — DM Mono, 0.75rem, muted
Right: [GitHub] [LinkedIn] — icon links, magnetic hover
Center (subtle): "Built with React, Three.js & GSAP"
```

---

## 4. CUSTOM CURSOR DESIGN

```
Structure: two DOM elements (position: fixed, pointer-events: none)

1. DOT (inner):
   Width: 8px, height: 8px
   Background: var(--accent-cyan)
   Border-radius: 50%
   Transition: none (instant follow)

2. RING (outer):
   Width: 32px, height: 32px
   Border: 1.5px solid rgba(0,245,255,0.6)
   Border-radius: 50%
   Lag: GSAP lerp factor 0.12 (follows with delay)

STATE CHANGES (all REQUIRED — implement all):
  Default:
    dot=8px ring=32px, normal cyan border

  Over link:
    dot scales to 0 (opacity 0)
    ring expands to 60px + mix-blend-mode: difference

  Over button:
    ring fills with cyan at 20% opacity (background: rgba(0,245,255,0.2))
    "CLICK" label appears INSIDE the ring:
      <span> centered inside ring, DM Mono 7px, cyan, pointer-events:none
    dot stays but shrinks to 4px

  Over canvas:
    ring shape changes to crosshair (border: 2px solid cyan + rotated 45deg lines)
    add cyan glow (box-shadow: var(--glow-cyan))

  Clicking:
    ring scales to 0.8 (spring snap: elastic.out)
    ring returns to 1 after click

Mobile: cursor hidden entirely (display: none when isMobile)
```

---

## 5. LOADING SCREEN — 3D REQUIRED

```
Component: <LoadingScreen />  ← MUST include a Three.js canvas

IMPLEMENTATION:
  Outer wrapper: position fixed, inset 0, z-index 10000, bg: --bg-base
  
  TOP: Mini Three.js Canvas (height: 60% of screen)
    - "UM" text as <Text3D> (Syne font via drei, or helvetiker)
      color: #00F5FF, metalness: 0.9, roughness: 0.1
      <Float speed={2} rotationIntensity={0.5}>
    - Particle ring: 200 particles in a torus path orbiting the monogram
      TorusKnotGeometry or manual sin/cos positions
      PointMaterial, color: #00F5FF, size: 0.04
    - pointLight cyan, intensity 2 — follows the float

  BOTTOM: DOM overlay (height: 40% of screen)
    Progress bar container: width 200px, height 1px, bg: var(--border-subtle)
    Progress fill: width 0%→100%, bg: cyan, GSAP duration: 2.5s, power1.inOut
      boxShadow: var(--glow-cyan)
    Label: "LOADING UZAIR'S UNIVERSE..." — DM Mono, 0.7rem, muted, uppercase

EXIT ANIMATION (AnimatePresence):
  When progress hits 100% → setTimeout 300ms → setLoaded(true)
  motion.div exit: { opacity: 0, scale: 1.1 }
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  Main site fades in underneath

NOTE: The "UM" monogram in loading screen is a 3D canvas element.
      Do NOT replace with a plain <div> or <p> — that violates quality standard #6.
```

---

## 6. POSTPROCESSING SETTINGS

```typescript
// Desktop — full effects
<EffectComposer>
  <Bloom
    luminanceThreshold={0.6}
    luminanceSmoothing={0.9}
    intensity={0.8}
    radius={0.4}
  />
  <ChromaticAberration
    offset={[0.0005, 0.0005]}
  />
  <Vignette
    eskil={false}
    offset={0.3}
    darkness={0.8}
  />
  <Noise opacity={0.02} />
  {/* DepthOfField — active only during Projects section */}
  {isProjectsActive && (
    <DepthOfField
      focusDistance={activeProjectZ}
      focalLength={0.02}
      bokehScale={3}
    />
  )}
</EffectComposer>

// Tablet — reduced
<EffectComposer>
  <Bloom luminanceThreshold={0.6} intensity={0.6} radius={0.3} />
</EffectComposer>

// Mobile — NO EffectComposer at all
```

---

## 7. ANIMATION TIMING REFERENCE

| Animation                  | Duration  | Ease                     | Trigger        |
|----------------------------|-----------|--------------------------|----------------|
| Hero text reveal           | 1.2s      | power4.out               | Page load      |
| Section heading reveal     | 0.9s      | power3.out               | ScrollTrigger  |
| Word stagger               | 0.05s     | power2.out (per word)    | ScrollTrigger  |
| 3D object enter            | 0.8s      | back.out(2)              | ScrollTrigger  |
| 3D object exit (dissolve)  | 0.6s      | power2.in                | ScrollTrigger  |
| About geometry dissolve    | 0.6s      | power2.in                | ScrollTrigger  |
| Card hover tilt            | 0.3s      | power2.out               | mousemove      |
| Card tilt reset            | 0.5s      | elastic.out(1, 0.5)      | mouseleave     |
| Magnetic button            | 0.3s      | power2.out               | mousemove      |
| Magnetic button reset      | 0.5s      | elastic.out(1, 0.4)      | mouseleave     |
| Cursor ring follow         | lerp 0.12 | linear (per frame)       | mousemove      |
| Cursor state change        | 0.3s      | power2.out               | hover          |
| Page scroll progress       | scrub: 1  | linked to scroll         | scroll         |
| Timeline line grow         | scrub     | none                     | scroll         |
| Camera travel (projects)   | scrub: 1  | none                     | scroll         |
| Loading bar                | 2.5s      | power1.inOut             | onLoad         |
| Loading exit               | 0.8s      | [0.16,1,0.3,1]           | onComplete     |

---

## 8. COMPLETE FOLDER STRUCTURE — FINAL (v3, System Prompt Exact)

> ⚠️ AI INSTRUCTION: Before writing ANY code, read ALL THREE reference files in this order:
> 1. `docs/requirements.md` → developer data, FR list, package list
> 2. `docs/design.md`       → visual spec, section designs, component specs
> 3. `docs/task.md`         → step-by-step build instructions (follow Phase by Phase)
>
> These 3 files are the SINGLE SOURCE OF TRUTH. If code conflicts with them, the files win.

```
uzair-portfolio/                        ← project root
│
├── docs/                               ← ⭐ AI REFERENCE FILES — READ FIRST
│   ├── requirements.md                 ← Developer data + all functional requirements
│   │                                      Read this for: personal info, skills, projects,
│   │                                      experience, education, FR-01 to FR-30, package list
│   ├── design.md                       ← Visual + interaction design spec
│   │                                      Read this for: colors, typography, section layouts,
│   │                                      component specs, animation timings, GLSL shaders
│   └── task.md                         ← Step-by-step AI build instructions
│                                          Read this for: exact code per step, verification
│                                          checklists, Phase 0→18 execution order
│
├── public/
│   ├── fonts/
│   │   └── helvetiker_regular.typeface.json   ← Download: see task.md Step 4.1
│   └── textures/
│       ├── project-sirp.webp           ← SIRP screenshot (1024×640 WebP)
│       └── project-jobportal.webp      ← Job portal screenshot (1024×640 WebP)
│
├── src/
│   ├── components/
│   │   ├── 3D/                         ← All Three.js / R3F components
│   │   │   ├── Scene.tsx               ← Main Canvas + lights + Environment preset="night"
│   │   │   │                              Spec: task.md Step 17.4 + Step 18.1
│   │   │   ├── PostProcessing.tsx      ← Bloom + ChromaticAberration + Vignette + SMAA
│   │   │   │                              Spec: task.md Step 18.2 | design.md §11.2
│   │   │   ├── ParticleField.tsx       ← 5000 pts, Y-gradient cyan→violet, wind drift, repulsion
│   │   │   │                              Spec: task.md Step 2.2 + Step 18.3 | design.md §11.4
│   │   │   ├── HeroScene.tsx           ← Text3D "UZAIR MANZOOR" + mouse point light
│   │   │   │                              Spec: task.md Step 5.1 + Step 18.8
│   │   │   ├── AboutGeometry.tsx       ← IcosahedronGeometry + MeshDistortMaterial + dissolve exit
│   │   │   │                              Spec: task.md Step 6.1 | design.md §3 About
│   │   │   ├── SkillsOrbs.tsx          ← 8 spheres elliptical orbit + hover float z+1.5
│   │   │   │                              Spec: task.md Step 7.1 + Step 18.7
│   │   │   ├── ProjectCarousel3D.tsx   ← Camera bezier path + plane meshes + DepthOfField
│   │   │   │                              Spec: task.md Step 8.1 | design.md §3 Projects
│   │   │   ├── ExperienceScene.tsx     ← TorusGeometry wireframe, violet, mouse tilt
│   │   │   │                              Spec: task.md Step 9.1 | design.md §3 Experience
│   │   │   └── ContactShader.tsx       ← ShaderMaterial with exact system prompt palette() GLSL
│   │   │                                  Spec: task.md Step 18.5 | design.md §11.7
│   │   │
│   │   ├── sections/                   ← DOM sections (semantic HTML over canvas)
│   │   │   ├── Hero.tsx                ← chars y:-200 rotateX:-90 back.out(2) | Spec: task.md Step 5.2 + 18.8
│   │   │   ├── About.tsx               ← blur(20px) entry + word-by-word reveal | Spec: task.md Step 6.2
│   │   │   ├── Skills.tsx              ← SkillBar + SkillTag + orb spacer | Spec: task.md Step 7.2 + 18.6
│   │   │   ├── Projects.tsx            ← trackRef + scrollWidth horizontal | Spec: task.md Step 8.2
│   │   │   ├── Experience.tsx          ← Timeline + scaleY animation | Spec: task.md Step 9.2
│   │   │   ├── Education.tsx           ← Cards + certifications | Spec: task.md Step 10.1
│   │   │   └── Contact.tsx             ← Form (no <form> tag) + Sparkles success | Spec: task.md Step 11.2 + 18.10
│   │   │
│   │   ├── ui/                         ← Reusable UI components
│   │   │   ├── Navbar.tsx              ← Fixed top, scroll progress bar | Spec: task.md Step 3.1
│   │   │   ├── CustomCursor.tsx        ← 5 cursor states incl. CLICK label | Spec: task.md Step 1.1
│   │   │   ├── MagneticButton.tsx      ← magneticArea=80px exact formula | Spec: task.md Step 18.4
│   │   │   ├── ProjectCard.tsx         ← 3D tilt on hover | Spec: design.md §3 Projects
│   │   │   ├── SkillBar.tsx            ← 0%→actual% counter + bar animation | Spec: task.md Step 18.6
│   │   │   ├── SkillTag.tsx            ← Pill tag, hover cyan, dashed for learning | Spec: task.md Step 7.2
│   │   │   ├── LoadingScreen.tsx       ← 3D canvas: UM monogram + particle ring | Spec: task.md Step 4.1
│   │   │   └── Footer.tsx              ← Copyright + social links | Spec: task.md Step 12.1
│   │   │
│   │   └── providers/                  ← App-level providers
│   │       ├── SmoothScroll.tsx        ← Lenis lerp:0.08 + GSAP ticker + ScrollTrigger.update
│   │       │                              Spec: task.md Step 0.5 | design.md §9
│   │       └── MouseTracker.tsx        ← Global mousemove → Zustand store
│   │                                      Spec: task.md Step 0.6 | requirements.md FR-03
│   │
│   ├── store/
│   │   └── useStore.ts                 ← Zustand: mouseX/Y, scrollProgress, activeSection,
│   │                                      isLoaded, isProjectsActive, formSuccess
│   │                                      Spec: task.md Step 0.4
│   │
│   ├── hooks/
│   │   ├── useMouseTracker.ts          ← mousemove listener → setMouse() | Spec: task.md Step 0.6
│   │   ├── useScrollProgress.ts        ← scroll 0→1 → setScrollProgress() | Spec: task.md Step 0.6
│   │   └── useMediaQuery.ts            ← useIsMobile() useIsTablet() | Spec: task.md Step 0.6
│   │
│   ├── shaders/                        ← GLSL shader source files
│   │   ├── aurora.vert                 ← Aurora vertex shader (uTime, uMouse uniforms)
│   │   │                                  Spec: task.md Step 11.1
│   │   ├── aurora.frag                 ← EXACT system prompt palette() GLSL — do NOT modify
│   │   │                                  Spec: task.md Step 18.5 | design.md §11.7
│   │   └── distort.frag                ← About morph distortion shader
│   │                                      Spec: task.md Step 11.1
│   │
│   ├── data/
│   │   └── portfolioData.ts            ← ALL resume content as const TypeScript object
│   │                                      Source: requirements.md §1–6
│   │                                      ⚠️ Never use placeholder text — only this file
│   │
│   ├── assets/
│   │   ├── models/                     ← .glb files (empty — using procedural geometry)
│   │   └── textures/                   ← Tech logo PNGs for skill spheres (256×256)
│   │
│   ├── styles/
│   │   ├── globals.css                 ← Tailwind 4.x + CSS variables + grain noise
│   │   │                                  Spec: task.md Step 0.2
│   │   └── animations.css              ← CSS keyframe library (float, glow, bounce, scan)
│   │                                      Spec: task.md Step 18.11 | design.md §11.13
│   │
│   ├── App.tsx                         ← Root: SmoothScrollProvider + React.lazy sections
│   │                                      Spec: task.md Step 17.6
│   ├── main.tsx                        ← Entry: StrictMode + skip-link + CSS imports
│   │                                      Spec: task.md Step 17.3
│   └── vite-env.d.ts                   ← TypeScript types for ?raw shader imports
│                                          Spec: task.md Step 17.1
│
├── index.html                          ← Meta tags, OG tags, title | Spec: task.md Step 17.3
├── vite.config.ts                      ← Tailwind plugin + chunk splitting | Spec: task.md Step 17.2
└── tsconfig.json                       ← strict:true, noUnusedLocals | Spec: task.md Step 17.1
```

### AI Reading Order (MANDATORY before writing any code)

```
STEP 1: Read docs/requirements.md
        → Understand: who Uzair is, what his skills/projects are, FR-01 to FR-30
        → Extract: portfolioData values (name, email, URLs, achievements)
        → Note: package list, TypeScript requirement, shader files needed

STEP 2: Read docs/design.md
        → Understand: colors (#050508, #00F5FF, #7B2FBE, #FF6B35)
        → Understand: typography (Syne display, DM Mono body)
        → Understand: each section's 3D element + DOM content + animations
        → Note: Section 11 overrides earlier sections where there's conflict

STEP 3: Read docs/task.md
        → Follow: Phase 0 → Phase 18, one STEP at a time
        → After each step: check ALL verification checkboxes
        → Never skip a step. Never combine steps.
        → Phase 18 is NOT optional — it fixes system prompt alignment
```

---

## 9. LENIS CONFIGURATION (Resolved Conflict)

The correct lerp value is **0.08** (from system prompt Lenis Config section).
The `lerp: 0.1` seen in the system prompt's SmoothScrollProvider code snippet is an error in that snippet.
requirements.md FR-01 and system prompt Lenis Config both say `lerp: 0.08` — use 0.08.

```typescript
options={{
  autoRaf: false,         // GSAP controls RAF
  lerp: 0.08,             // CORRECT value — smoother than 0.1
  duration: 1.2,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: 'vertical',
  smoothWheel: true,
  wheelMultiplier: 1.0,
  touchMultiplier: 2.0,
}}
```

The `ScrollTrigger.update` sync line is MANDATORY:
```typescript
lenisRef.current?.lenis?.on('scroll', ScrollTrigger.update)
```

---

## 10. GSAP PLUGIN REGISTRATION

Register ALL plugins at the top of SmoothScroll.tsx (before any component code):
```typescript
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import TextPlugin from 'gsap/TextPlugin'

gsap.registerPlugin(ScrollTrigger, TextPlugin)
```

TextPlugin enables typewriter effects used in section label reveals.

---

## 11. SYSTEM PROMPT ALIGNMENT FIXES (GOD MODE)

---

### 11.1 — Canvas GL Config (CORRECTED — toneMapping added)

```typescript
// Scene.tsx — gl prop MUST include:
gl={{
  antialias: !isMobile,
  alpha: true,
  powerPreference: 'high-performance',
  toneMapping: THREE.ACESFilmicToneMapping,   // ← SYSTEM PROMPT REQUIRED
  toneMappingExposure: 1.2,                   // ← SYSTEM PROMPT REQUIRED
}}
```

### 11.2 — Scene Lighting (CORRECTED — directionalLight + Environment added)

```tsx
// Inside Canvas — ALL THREE required:
<ambientLight intensity={0.2} />
<directionalLight
  position={[5, 5, 5]}
  intensity={1.5}
  castShadow                     // ← SYSTEM PROMPT REQUIRED
/>
<Environment preset="night" />   // ← SYSTEM PROMPT REQUIRED (@react-three/drei)
```

### 11.3 — PostProcessing.tsx — DEDICATED FILE (system prompt folder structure)

**Action:** Create `src/components/3D/PostProcessing.tsx`:
```tsx
import {
  EffectComposer, Bloom, ChromaticAberration,
  Vignette, Noise, DepthOfField, SMAA
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
      <Bloom luminanceThreshold={0.6} luminanceSmoothing={0.9} intensity={0.8} radius={0.4} />
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

Scene.tsx then uses: `<PostProcessing />` instead of inline EffectComposer.

---

### 11.4 — Particle Field (CORRECTED — Y-gradient + Wind)

```tsx
// ParticleField.tsx — CORRECTED version with system prompt features:

// 1. Y-based color gradient (cyan bottom → violet top)
// Add colors array alongside positions:
const colors = useMemo(() => {
  const col = new Float32Array(count * 3)
  const cyan = new THREE.Color('#00F5FF')
  const violet = new THREE.Color('#7B2FBE')
  for (let i = 0; i < count; i++) {
    const y = positions[i * 3 + 1]               // Y position (-8 to +8)
    const t = (y + 8) / 16                        // normalize 0→1
    const mixed = cyan.clone().lerp(violet, t)
    col[i * 3]     = mixed.r
    col[i * 3 + 1] = mixed.g
    col[i * 3 + 2] = mixed.b
  }
  return col
}, [count, positions])

// Add to bufferGeometry:
<bufferAttribute attach="attributes-color" args={[colors, 3]} />
// Add to PointMaterial: vertexColors={true} (remove flat color prop)

// 2. Wind drift on scroll:
useFrame((_, delta) => {
  const { scrollProgress } = useStore.getState()
  if (!ref.current) return
  ref.current.position.x += scrollProgress * 0.001 * delta * 60
  ref.current.position.y -= scrollProgress * 0.0005 * delta * 60
  // ... existing rotation + repulsion code
})
```

---

### 11.5 — SkillBar Component (REQUIRED — was completely missing)

**Action:** Create `src/components/ui/SkillBar.tsx`:
```tsx
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

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
```

Add SkillBar section to Skills DOM (below tag pills):
```tsx
// In Skills.tsx — add after skill tag grid:
const SKILL_BARS = [
  { label: 'React.js / Next.js',   pct: 90, color: '#61DAFB' },
  { label: 'Node.js / Express',    pct: 85, color: '#68A063' },
  { label: 'MongoDB',              pct: 80, color: '#47A248' },
  { label: 'Socket.IO / Redis',    pct: 80, color: '#00F5FF' },
  { label: 'GSAP / Three.js',      pct: 75, color: '#88CE02' },
  { label: 'TypeScript',           pct: 60, color: '#FF6B35' },
  { label: 'Docker / CI-CD',       pct: 40, color: '#FF6B35' },
]

{SKILL_BARS.map(s => <SkillBar key={s.label} label={s.label} percentage={s.pct} color={s.color} />)}
```

---

### 11.6 — Magnetic Button (CORRECTED — exact system prompt formula)

Replace simplified `x * 0.3` formula in MagneticButton.tsx with system prompt exact:
```tsx
const MAGNETIC_AREA = 80  // px radius — system prompt spec

const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
  const btn = btnRef.current!
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

// Also attach to window mousemove (not just onMouseMove on button)
// so magnetic pull is felt BEFORE cursor reaches the button:
useEffect(() => {
  window.addEventListener('mousemove', handleMouseMove as any)
  return () => window.removeEventListener('mousemove', handleMouseMove as any)
}, [])
```

---

### 11.7 — Aurora Shader (CORRECTED — exact system prompt GLSL)

Replace `src/shaders/aurora.frag` with EXACT system prompt version:
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

aurora.vert stays the same.

---

### 11.8 — Hero Scroll Behavior (CORRECTED — camera pull-away + particle scatter)

```tsx
// In Hero.tsx useLayoutEffect — REPLACE existing scrollTrigger with:
const heroGroupRef = useRef()  // passed to HeroScene

gsap.to(heroGroupRef.current.position, {
  z: -5,
  scrollTrigger: { trigger: '#hero', start: 'top top', end: '30% top', scrub: true }
})

// Camera pull-away — in HeroScene.tsx useFrame, add scroll-linked z:
// Read scrollProgress from useStore
// state.camera.position.z += (5 + scrollProgress * 3 - state.camera.position.z) * 0.05

// Particle scatter — in ParticleField, add scroll-linked radius expansion:
// scatterRadius = 8 + scrollProgress * 4 (applied to rotation group scale)
```

---

### 11.9 — Hero Chars Animation (CORRECTED — back.out(2) not power4.out)

```tsx
// In Hero.tsx — split name into chars and use EXACT system prompt recipe:
const chars = heroTitleRef.current.querySelectorAll('span')
gsap.from(chars, {
  y: -200,
  opacity: 0,
  rotateX: -90,
  stagger: 0.02,
  duration: 1.2,
  ease: 'back.out(2)',      // ← system prompt exact ease
  scrollTrigger: {
    trigger: '.hero-section',
    start: 'top 80%',
    end: 'bottom 20%',
    toggleActions: 'play none none reverse',
  }
})
```

---

### 11.10 — Section Entry Animation (CORRECTED — blur filter)

Wrap EVERY section in Framer Motion with system prompt Recipe #4:
```tsx
// Apply to: About, Skills, Projects, Experience, Education, Contact
<motion.section
  id="about"
  initial={{ opacity: 0, y: 60, filter: 'blur(20px)' }}
  whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
  viewport={{ once: true, margin: '-100px' }}
  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
>
```

---

### 11.11 — Sparkles on Contact Form Success

```tsx
import { Sparkles } from '@react-three/drei'

// In ContactScene (or ContactShader.tsx) — conditionally render Sparkles:
{formSuccess && (
  <Sparkles
    count={50}
    scale={4}
    size={2}
    speed={0.4}
    color="#00F5FF"
  />
)}
// formSuccess state passed via Zustand or prop from Contact.tsx
```

---

### 11.12 — Skill Spheres — Float Toward Camera on Hover

Replace current emissive-only hover in SkillsOrbs.tsx:
```tsx
onPointerEnter={(e) => {
  e.stopPropagation()
  const mesh = refs.current[i]
  if (!mesh) return
  // Break orbit AND float toward camera:
  gsap.to(mesh.position, {
    z: mesh.position.z + 1.5,    // ← float toward camera
    duration: 0.4,
    ease: 'back.out(2)',
  })
  const mat = mesh.material as THREE.MeshStandardMaterial
  mat.emissiveIntensity = 1.5
}}
onPointerLeave={() => {
  const mesh = refs.current[i]
  if (!mesh) return
  gsap.to(mesh.position, {
    z: mesh.position.z - 1.5,    // ← return to orbit
    duration: 0.6,
    ease: 'elastic.out(1, 0.4)',
  })
  const mat = mesh.material as THREE.MeshStandardMaterial
  mat.emissiveIntensity = 0.2
}}
```

---

### 11.13 — animations.css — Required File

**Action:** Create `src/styles/animations.css`:
```css
/* Keyframe library — imported in main.tsx */

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-8px); }
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 20px rgba(0,245,255,0.3); }
  50%       { box-shadow: 0 0 40px rgba(0,245,255,0.7); }
}

@keyframes scan-line {
  0%   { transform: translateY(-100%); }
  100% { transform: translateY(100vh); }
}

@keyframes bounce-arrow {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(8px); }
}

@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

/* Utility classes */
.animate-float    { animation: float 3s ease-in-out infinite; }
.animate-glow     { animation: pulse-glow 2s ease-in-out infinite; }
.animate-bounce   { animation: bounce-arrow 1.5s ease-in-out infinite; }
.animate-spin-slow { animation: spin-slow 8s linear infinite; }
```

---

### 11.14 — UPDATED Complete Folder Structure (Merged into Section 8 above)

> ⚠️ The authoritative folder structure is now in **Section 8** above.
> Section 8 includes: docs/ reference files, all src/ files, Spec cross-references, and AI reading order.
> Do not use this section — refer to Section 8.
