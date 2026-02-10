/* src/components/sections/Hero.tsx */
"use client"
import React from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import SearchBar from '../SearchBar'
import NavBar from '../NavBar'

export default function Hero() {
  const { scrollY } = useScroll();
  const yContent = useTransform(scrollY, [0, 500], [0, 100]);

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black">
      <NavBar />
      
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/luxury-villa.jpg" 
          alt="Luxury Architecture"
          className="w-full h-full object-cover brightness-[0.7]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
      </div>

      <motion.div style={{ y: yContent }} className="relative z-10 w-full px-6 flex flex-col items-center">
        {/* Glassmorphism Title Container */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-12 md:p-20 mb-12 text-center max-w-5xl"
        >
          <span className="inline-block text-white/70 tracking-hud mb-8">
            Established 2026 — Nairobi
          </span>
          <h1 className="text-white text-5xl md:text-8xl font-bold mb-8 leading-[0.9] tracking-tighter">
            Find Your <br /> Amazing Home
          </h1>
          <p className="text-white/60 text-lg md:text-xl font-light tracking-wide max-w-2xl mx-auto">
            Curated architectural masterpieces.
          </p>
        </motion.div>

        <SearchBar />
      </motion.div>

      {/* Decorative HUD Elements */}
      <div className="absolute bottom-12 left-12 hidden lg:flex gap-16 text-white/30 tracking-hud">
        <div><p className="mb-1">Perspective</p><p className="text-white/60">001 / 004</p></div>
        <div><p className="mb-1">Coordinates</p><p className="text-white/60">NBO 1.2921° S</p></div>
      </div>
    </section>
  )
}