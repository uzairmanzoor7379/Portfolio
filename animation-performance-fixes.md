# Portfolio Animation Performance Fixes
### Zero-Jerk, Smooth-Scroll Enhancements

---

## How Your Portfolio Works (Full Picture)

```
index-SuyxFey3.js (main bundle)
├── React 19 + ReactDOM
├── Framer Motion (motion.div, AnimatePresence, useSpring, useMotionValue)
├── Zustand store → activeProjectIndex, formSuccess, setProjectsActive
├── Lenis (smooth scroll library) → scrollTo util
├── Three.js WebGL canvas (background particles)
├── Custom cursor, navbar, scroll progress bar
└── Lazy-loads all section chunks:
    ├── Hero      → GSAP scroll-linked fade
    ├── About     → GSAP pin + word-span stagger
    ├── Skills    → Framer Motion whileInView only
    ├── Projects  → GSAP ScrollTrigger pin + Framer Motion AnimatePresence
    ├── Experience→ GSAP timeline line scaleY + bullet fade
    ├── Education → Framer Motion whileInView only
    └── Contact   → GSAP + Framer Motion

portfolioData-S_xyqlAo.js
└── Re-exports: React, motion (Framer), data object (ru), jsx runtime

gsap-B7OIkDZn.js
└── GSAP core + ScrollTrigger + Observer plugins
```

**The core problem:** GSAP and Framer Motion are both running scroll-listening loops simultaneously, competing over the same DOM elements in About, Projects, Experience, and Contact. Combined with `backdropFilter: blur()` on many surfaces, this tanks GPU compositing.

---

## Fix 1 — CSS: Add `will-change` and kill the repaint layer

In `index-CKSr9njR.css`, add this block at the end:

```css
/* === PERFORMANCE LAYER HINTS === */

/* Promote scroll-animated elements to their own GPU layer */
#hero,
#about,
#projects,
#experience {
  will-change: transform;
}

/* Hero content fades on scroll via GSAP — promote it */
.hero-content {
  will-change: transform, opacity;
}

/* Word spans in About get opacity + y animated */
#about .word-span {
  will-change: opacity, transform;
}

/* Experience timeline bullet points */
.exp-bullet {
  will-change: opacity, transform;
}

/* The animated timeline line */
#experience > div > div > div > div:first-child {
  will-change: transform;
}

/* 
  The body::after noise overlay uses position:fixed with an SVG filter.
  This causes a full-page repaint every frame. 
  Fix: make it its own compositing layer.
*/
body::after {
  will-change: opacity; /* forces GPU layer isolation */
  transform: translateZ(0);
}

/* 
  Cards with backdropFilter are expensive. Limit blur repaints
  by containing them. Add this to every frosted-glass card.
*/
.stat-card,
.edu-card {
  will-change: transform;
  transform: translateZ(0);
}
```

---

## Fix 2 — About.js: Fix word splitting + eliminate GSAP/Framer conflict

**Problem:** The word split uses `summary.split('\n')` (newlines), not real words. Most summaries have no `\n`, so you get 1 giant span. Also `whileInView` on the outer motion.div fights with the GSAP `pin`.

**Drop-in replacement for `About-C3O8dXYy.js` source** (before minification):

```jsx
// Key changes:
// 1. Split by SPACE, not \n
// 2. Remove whileInView from the pinned section's motion.div (use GSAP for everything inside a pin)
// 3. Add will-change via style prop on the section itself

export function About() {
  const sectionRef = useRef(null);
  const textRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Pin the section
      ScrollTrigger.create({
        trigger: '#about',
        start: 'top top',
        end: '+=150%',
        pin: true,
        scrub: 1,
        anticipatePin: 1,
      });

      if (textRef.current) {
        // FIX: split by space (words), not newline
        const words = portfolioData.summary.split(' ');
        textRef.current.innerHTML = words
          .map(
            w =>
              `<span class="word-span" style="opacity:0;display:inline-block;margin-right:0.3em;will-change:opacity,transform">${w}</span>`
          )
          .join('');

        gsap.to('#about .word-span', {
          opacity: 1,
          y: 0,
          stagger: 0.03,
          scrollTrigger: {
            trigger: '#about',
            start: 'top top',
            end: '+=80%',
            scrub: 1,
          },
        });
      }

      // FIX: Animate stat cards via GSAP too (not whileInView inside a pin)
      gsap.from('.stat-card', {
        opacity: 0,
        y: 40,
        stagger: 0.15,
        scrollTrigger: {
          trigger: '#about',
          start: 'top top',
          end: '+=40%',
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // FIX: Remove motion.div wrapper — use plain div inside a pinned GSAP section
  // whileInView inside a ScrollTrigger pin causes double-scroll-listener fighting
  return (
    <section
      id="about"
      ref={sectionRef}
      style={{
        minHeight: '100vh',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        padding: '6rem 2rem 4rem',
        zIndex: 10,
        willChange: 'transform', // GPU layer for the pin
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '45% 55%',
          gap: '4rem',
          alignItems: 'center',
          width: '100%',
        }}
      >
        {/* ... rest of JSX unchanged, just remove motion.div wrapper ... */}
      </div>
    </section>
  );
}
```

**The single most impactful change here:** replace `split('\`\n\`')` with `split(' ')`.

---

## Fix 3 — Projects.js: Fix Zustand access inside scroll callback

**Problem:** Inside the `onUpdate` callback, you call `l.getState().activeProjectIndex` — this bypasses React's render cycle but also runs on every scroll tick. The `o(n)` call (setActiveProjectIndex) triggers a React re-render + Framer Motion AnimatePresence swap mid-scroll. This is the biggest source of jank.

**Fix — debounce the index update + add `lazy: true` to ScrollTrigger:**

```js
useLayoutEffect(() => {
  if (!sectionRef.current) return;

  let pendingIndex = null;
  let rafId = null;

  const ctx = gsap.context(() => {
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: `+=${projectCount * 45}%`,
      pin: true,
      pinSpacing: true,
      // FIX: lazy:true defers ScrollTrigger updates to next RAF tick
      lazy: true,
      onEnter: () => setProjectsActive(true),
      onLeave: () => setProjectsActive(false),
      onEnterBack: () => setProjectsActive(true),
      onLeaveBack: () => setProjectsActive(false),
      onUpdate: (self) => {
        const rawIndex = Math.floor(self.progress * projectCount * 0.99);
        const newIndex = Math.max(0, Math.min(projectCount - 1, rawIndex));
        
        // FIX: batch updates via RAF — prevents mid-scroll re-renders
        if (newIndex !== pendingIndex) {
          pendingIndex = newIndex;
          if (rafId) cancelAnimationFrame(rafId);
          rafId = requestAnimationFrame(() => {
            setActiveProjectIndex(pendingIndex);
          });
        }
      },
    });
  }, sectionRef);

  return () => {
    ctx.revert();
    if (rafId) cancelAnimationFrame(rafId);
  };
}, [setProjectsActive, setActiveProjectIndex, projectCount]);
```

**Also fix the AnimatePresence exit animation:** The current exit goes to `x: '-40vw'` with `scale: 0.85` + `rotateY`. On mobile/mid-tier GPUs this composites 3 transform properties simultaneously. Simplify:

```js
// Replace the info card (m) variants:
const cardVariants = {
  initial: (isEven) => ({ x: isEven ? '20vw' : '-20vw', opacity: 0 }),
  animate: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
  exit: (isEven) => ({
    x: isEven ? '-20vw' : '20vw',
    opacity: 0,
    transition: { duration: 0.4, ease: [0.7, 0, 0.84, 0] },
  }),
};
```

Removing `rotateY`, `scale`, and `rotate` from exit variants drops the number of composited properties from 5 to 2 per card swap.

---

## Fix 4 — Experience.js: Fix scaleY on a non-composited element

**Problem:** GSAP animates `scaleY` on the timeline line div. Without `transform-origin` being compositable, the browser repaints the line's parent on every frame.

**Fix:**

```js
// In the timeline line div's style:
style={{
  position: 'absolute',
  left: 0,
  top: 0,
  bottom: 0,
  width: '2px',
  background: 'var(--accent-cyan)',
  transformOrigin: 'top center',
  willChange: 'transform',        // ← ADD THIS
  transform: 'scaleY(0)',         // ← set initial state in CSS, not GSAP fromTo
}}
```

Then change the GSAP animation from `fromTo` to just `to`:
```js
// Instead of gsap.fromTo(ref, {scaleY:0}, {scaleY:1, ...})
// Set scaleY:0 in the style, then:
gsap.to(timelineRef.current, {
  scaleY: 1,
  transformOrigin: 'top center',
  ease: 'none',
  scrollTrigger: {
    trigger: '#experience',
    start: 'top 60%',
    end: 'bottom 40%',
    scrub: 1,
  },
});
```

---

## Fix 5 — Global: Lenis + GSAP ScrollTrigger sync (critical)

**Problem:** Lenis smooth scroll intercepts native scroll events and re-dispatches them. GSAP ScrollTrigger by default listens to native scroll. If they're not synced, you get double-scroll updates — Lenis moves the page, ScrollTrigger fires slightly out of phase, causing visual stutter.

**Check your Lenis setup in `index-SuyxFey3.js`.** You likely have something like:

```js
const lenis = new Lenis({ duration: 1.2, easing: ... });
```

**Add the GSAP ticker sync:**

```js
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: 'vertical',
  smoothWheel: true,
});

// CRITICAL: Sync Lenis with GSAP's RAF ticker
// Without this, ScrollTrigger fires on native scroll (desync with Lenis)
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

// Prevent GSAP from creating its own RAF loop
gsap.ticker.lagSmoothing(0);

// Tell ScrollTrigger to use Lenis's scroll position
ScrollTrigger.scrollerProxy(document.body, {
  scrollTop(value) {
    if (arguments.length) {
      lenis.scrollTo(value, { immediate: true });
    }
    return lenis.scroll;
  },
  getBoundingClientRect() {
    return {
      top: 0,
      left: 0,
      width: window.innerWidth,
      height: window.innerHeight,
    };
  },
  pinType: document.body.style.transform ? 'transform' : 'fixed',
});

lenis.on('scroll', ScrollTrigger.update);
```

This is **the single highest-impact fix**. Without Lenis↔GSAP sync, every pinned section (About, Projects) will stutter because Lenis is moving the page but ScrollTrigger is reading a stale scroll position.

---

## Fix 6 — Hero.js: Use `transform: translateY` not `y` for scroll fade

GSAP's shorthand `y` prop maps to `translateY` but GSAP internally uses a matrix transform. For scroll-linked `opacity + y`, prefer setting `will-change` and letting the GPU handle it:

```js
// In Hero's useLayoutEffect:
gsap.set('.hero-content', { willChange: 'transform, opacity' });

gsap.to('.hero-content', {
  opacity: 0,
  y: -30,
  scrollTrigger: {
    trigger: '#hero',
    start: 'top top',
    end: '30% top',
    scrub: true,
    // FIX: fastScrollEnd prevents the animation from "catching up" after fast scrolls
    fastScrollEnd: true,
  },
});
```

---

## Fix 7 — CSS: Replace `backdropFilter: blur()` on cards

`backdrop-filter: blur()` forces the browser to composite everything behind the element separately — extremely expensive when you have 6+ blurred surfaces on screen.

**Replace frosted glass cards with a pseudo-element trick:**

```css
/* Instead of backdropFilter blur on the element itself,
   use a ::before with a static blurred background clone */

.stat-card,
.edu-card,
#experience .exp-card {
  position: relative;
  backdrop-filter: none !important; /* remove */
  background: rgba(13, 13, 20, 0.85) !important; /* opaque-ish fallback */
}
```

If you must keep blur, reduce it from `blur(16px)` to `blur(8px)` — blur radius scales quadratically with GPU cost.

---

## Fix 8 — Projects floating image (g component): Stop RAF loop per card

The `g` component runs a continuous `requestAnimationFrame` loop for floating animation:

```js
// Current code — runs forever, even when off-screen
useEffect(() => {
  let t = 0;
  const animate = () => {
    t += 0.012;
    motionValue.set(Math.sin(t) * 6);
    rafId = requestAnimationFrame(animate);
  };
  rafId = requestAnimationFrame(animate);
  return () => cancelAnimationFrame(rafId);
}, []);
```

**Fix: Replace with CSS animation** — zero JS overhead:

```jsx
// Remove the RAF loop entirely. In the motion.div style:
style={{
  position: 'relative',
  animation: 'float 3s ease-in-out infinite', // uses your existing @keyframes float
}}
```

Your CSS already has `@keyframes float` defined. Just use it. This moves the animation to the compositor thread — no JS, no RAF, smooth even during scroll.

---

## Summary Priority Order

| Priority | Fix | Impact |
|----------|-----|--------|
| 🔴 Critical | Fix 5 — Lenis↔GSAP sync | Eliminates stutter on ALL pinned sections |
| 🔴 Critical | Fix 3 — RAF-debounce project index updates | Kills mid-scroll React re-renders |
| 🟠 High | Fix 1 — `will-change` CSS hints | GPU layer promotion for all animated elements |
| 🟠 High | Fix 8 — Replace RAF float with CSS animation | Removes per-card JS animation loop |
| 🟡 Medium | Fix 2 — Fix word split (`' '` not `'\n'`) | Makes word animation actually work |
| 🟡 Medium | Fix 6 — `fastScrollEnd` on hero | Stops hero from jerking after fast scroll |
| 🟢 Low | Fix 4 — `will-change` on timeline line | Smoother experience line draw |
| 🟢 Low | Fix 7 — Reduce backdrop-filter blur radius | GPU compositing relief |

Apply Fix 5 first — it affects every section simultaneously.
