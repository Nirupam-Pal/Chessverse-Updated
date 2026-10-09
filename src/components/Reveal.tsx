import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { EASE_OUT } from '@/lib/motion'

/**
 * Fade-and-rise once on entering the viewport. Opacity + transform only (compositor-friendly,
 * no layout work); IntersectionObserver-driven, so nothing runs per scroll frame.
 */
export default function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: EASE_OUT }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
