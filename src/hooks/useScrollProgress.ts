import { useEffect } from 'react'
import { useStore } from '../store/useStore'

export function useScrollProgress() {
  const setScrollProgress = useStore((s) => s.setScrollProgress)

  const setScrollY = useStore((s) => s.setScrollY)

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement
      const rawProgress = scrollTop / (scrollHeight - clientHeight || 1)
      setScrollProgress(rawProgress)
      setScrollY(scrollTop)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [setScrollProgress])

  return useStore((s) => s.scrollProgress)
}
