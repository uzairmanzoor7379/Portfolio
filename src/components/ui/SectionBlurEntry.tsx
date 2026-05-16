import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

export function SectionBlurEntry({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60, filter: 'blur(20px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      style={{ width: '100%', height: '100%' }}
    >
      {children}
    </motion.div>
  )
}
