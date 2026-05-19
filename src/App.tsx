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

  useEffect(() => {
    if (!isLoaded) return;

    const sections = ['hero', 'about', 'skills', 'projects', 'experience', 'education', 'contact'];

    // Use native IntersectionObserver instead of GSAP.
    // This is 100% immune to GSAP pin-spacer shifts because it strictly checks
    // if the actual DOM element is currently intersecting the viewport.
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, {
      root: null,
      // Creates a razor-thin line in the exact center of the screen.
      // This guarantees no overlapping states and buttery-smooth single triggers.
      rootMargin: '-50% 0px -49% 0px',
      threshold: 0
    });

    // We use an interval to continuously try attaching observers 
    // to handle React's lazy loading Suspense boundaries without race conditions.
    const interval = setInterval(() => {
      let allFound = true;
      sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          // IntersectionObserver automatically handles re-observing safely
          observer.observe(el);
        } else {
          allFound = false;
        }
      });
      if (allFound) clearInterval(interval);
    }, 500);

    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
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
