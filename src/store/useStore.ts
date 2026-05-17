//userStore.ts
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
  formSuccess: boolean
  scrollY: number
  setMouse: (x: number, y: number, rawX: number, rawY: number) => void
  setHover: (isHovering: boolean, hoverTarget?: string | null) => void
  setScrollProgress: (progress: number) => void
  setActiveSection: (section: string) => void
  setLoaded: () => void
  setProjectsActive: (active: boolean) => void
  setActiveProjectIndex: (index: number) => void
  setFormSuccess: (v: boolean) => void
  setScrollY: (y: number) => void
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
  formSuccess: false,
  scrollY: 0,
  setMouse: (x, y, rawX, rawY) => set((state) => {
    // Only update if mouse moved more than 0.005 units to save renders
    if (Math.abs(state.mouseX - x) < 0.005 && Math.abs(state.mouseY - y) < 0.005) return state;
    return { mouseX: x, mouseY: y, mouseRawX: rawX, mouseRawY: rawY };
  }),
  setHover: (isHovering, hoverTarget = null) => set({ isHovering, hoverTarget }),
  setScrollProgress: (progress) => set((state) => {
    // Check for extremely small changes to prevent unnecessary state updates
    if (Math.abs(state.scrollProgress - progress) < 0.00001) return state;
    return { scrollProgress: progress };
  }),
  setActiveSection: (section) => set((state) => {
    if (state.activeSection === section) return state;
    return { activeSection: section };
  }),
  setLoaded: () => set({ isLoaded: true }),
  setProjectsActive: (active) => set((state) => {
    if (state.isProjectsActive === active) return state;
    return { isProjectsActive: active };
  }),
  setActiveProjectIndex: (index) => set((state) => {
    if (state.activeProjectIndex === index) return state;
    return { activeProjectIndex: index };
  }),
  setFormSuccess: (v) => set({ formSuccess: v }),
  setScrollY: (y) => set((state) => {
    if (state.scrollY === y) return state;
    return { scrollY: y };
  }),
}))
