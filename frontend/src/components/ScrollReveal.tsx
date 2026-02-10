"use client"
import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'

export const RevealImage = ({ src, alt }: { src: string; alt?: string }) => {
  const reduce = useReducedMotion()

  if (reduce) {
    return <img src={src} alt={alt || ''} className="w-full h-full object-cover" />
  }

  return (
    <motion.div
      initial={{ clipPath: 'inset(0 0 100% 0)' }}
      whileInView={{ clipPath: 'inset(0 0 0% 0)' }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 1.2, ease: [0.45, 0, 0.55, 1] }}
      className="overflow-hidden aspect-video"
    >
      <motion.img
        initial={{ scale: 1.2 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
        src={src}
        alt={alt || ''}
        className="w-full h-full object-cover"
      />
    </motion.div>
  )
}

export default RevealImage
