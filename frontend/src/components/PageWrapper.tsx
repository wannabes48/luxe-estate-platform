"use client"
import React from 'react'
import { LazyMotion, domAnimation, m, AnimatePresence } from 'framer-motion'

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
}

export const PageWrapper = ({ children, pathname }: { children: React.ReactNode; pathname?: string }) => (
  <LazyMotion features={domAnimation}>
    <AnimatePresence mode="wait">
      <m.div
        key={pathname || 'page'}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </m.div>
    </AnimatePresence>
  </LazyMotion>
)

export default PageWrapper
