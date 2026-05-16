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

const Hero = lazy(() => import('./components/sections/Hero').then(m => ({ default: m.Hero })))
const About = lazy(() => import('./components/sections/About').then(m => ({ default: m.About })))
const Skills = lazy(() => import('./components/sections/Skills').then(m => ({ default: m.Skills })))
const Projects = lazy(() => import('./components/sections/Projects').then(m => ({ default: m.Projects })))
const Experience = lazy(() => import('./components/sections/Experience').then(m => ({ default: m.Experience })))
const Education = lazy(() => import('./components/sections/Education').then(m => ({ default: m.Education })))
const Contact = lazy(() => import('./components/sections/Contact').then(m => ({ default: m.Contact })))

function AppContent() {
  useMouseTracker()
  const isMobile = useIsMobile()
  const isLoaded = useStore((s) => s.isLoaded)
  const setActiveSection = useStore((s) => s.setActiveSection)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) gsap.globalTimeline.timeScale(0)
  }, [])

  useEffect(() => {
    const handleResize = () => ScrollTrigger.refresh()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useLayoutEffect(() => {
    if (!isLoaded) return
    const sections = ['hero', 'about', 'skills', 'projects', 'experience', 'education', 'contact']
    const triggers: ScrollTrigger[] = []

    const initTriggers = () => {
      // Clear existing triggers to prevent duplicates
      triggers.forEach(t => t.kill());
      triggers.length = 0;

      const allExist = sections.every(id => document.getElementById(id));
      if (!allExist) {
        gsap.delayedCall(0.2, initTriggers);
        return;
      }

      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;
        const trigger = ScrollTrigger.create({
          trigger: el,
          start: 'top 50%',
          end: 'bottom 50%',
          onEnter: () => setActiveSection(id),
          onEnterBack: () => setActiveSection(id),
          fastScrollEnd: true,
          preventOverlaps: true
        });
        triggers.push(trigger);
      });
      ScrollTrigger.refresh();
    };

    initTriggers()

    return () => {
      triggers.forEach((t) => t.kill())
    }
  }, [isLoaded, setActiveSection])

  return (
    <>
      <LoadingScreen />
      {!isMobile && <Scene />}
      <CustomCursor />
      <div style={{ opacity: isLoaded ? 1 : 0, transition: 'opacity 0.6s ease', pointerEvents: isLoaded ? 'auto' : 'none' }}>
        <Navbar />
        <main id="main-content" style={{ position: 'relative', zIndex: 10 }} role="main">
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
