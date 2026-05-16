import { useEffect } from 'react'
import { useStore } from '../store/useStore'

export function useScrollProgress() {
  const setScrollProgress = useStore((s) => s.setScrollProgress)

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement
      const rawProgress = scrollTop / (scrollHeight - clientHeight || 1)
      const rounded = Math.round(rawProgress * 1000) / 1000
      setScrollProgress(rounded)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [setScrollProgress])

  return useStore((s) => s.scrollProgress)
}
