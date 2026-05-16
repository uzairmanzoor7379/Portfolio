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
