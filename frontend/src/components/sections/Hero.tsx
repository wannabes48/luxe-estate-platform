"use client"
import React, { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import SearchBar from '../SearchBar'
import NavBar from '../NavBar'

export default function Hero() {
  const { scrollY } = useScroll();
  const yContent = useTransform(scrollY, [0, 500], [0, 100]);
  
  // Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 2;

  // Auto-scroll every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === 0 ? 1 : 0));
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black">
      <meta name="google-site-verification" content="yCWkx_g_st56DQ35eL4It-2tnZCBCN7bC-pB6aNyRgM" />
      
      {/* NavBar stays fixed on top of both slides */}
      <div className="absolute top-0 w-full z-50">
        <NavBar />
      </div>
      
      {/* --- BACKGROUND CROSSFADES --- */}
      {/* Background 1 (Traditional) */}
      <div className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${currentSlide === 0 ? 'opacity-100' : 'opacity-0'}`}>
        <img 
          src="/images/luxury-villa.jpg" 
          alt="Luxury Architecture"
          className="w-full h-full object-cover brightness-[0.7]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
      </div>

      {/* Background 2 (Web3/Dark) */}
      <div className={`absolute inset-0 z-0 bg-stone-950 transition-opacity duration-1000 ease-in-out ${currentSlide === 1 ? 'opacity-100' : 'opacity-0'}`}>
        <img 
          src="/images/luxury-architecture.jpg" 
          alt="Luxe Estate fractional" 
          className="w-full h-full object-cover opacity-30" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
      </div>


      {/* --- SLIDING CONTENT TRACK --- */}
      <motion.div style={{ y: yContent }} className="relative z-10 w-full h-full pt-20">
        <div 
            className="w-full h-full flex transition-transform duration-1000 ease-[cubic-bezier(0.87,0,0.13,1)]"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
            
            {/* ================= SLIDE 1: TRADITIONAL SEARCH ================= */}
            <div className="w-full h-full flex-shrink-0 flex flex-col items-center justify-center px-6">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: currentSlide === 0 ? 1 : 0, y: currentSlide === 0 ? 0 : 20 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="glass-panel p-10 md:p-16 mb-8 text-center max-w-4xl"
                >
                    <span className="inline-block text-white/70 tracking-hud mb-6">
                        Established 2026 — Nairobi
                    </span>
                    <h1 className="text-white text-5xl md:text-7xl font-bold mb-6 leading-[0.9] tracking-tighter">
                        Find Your <br /> Amazing Home
                    </h1>
                    <p className="text-white/60 text-base md:text-lg font-light tracking-wide max-w-xl mx-auto">
                        Curated architectural masterpieces in Kenya's most exclusive neighborhoods.
                    </p>
                </motion.div>
            </div>


            {/* ================= SLIDE 2: WEB3 / FRACTIONAL ================= */}
            <div className="w-full h-full flex-shrink-0 flex flex-col items-center justify-center px-6 text-center">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: currentSlide === 1 ? 1 : 0, y: currentSlide === 1 ? 0 : 20 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="max-w-5xl mx-auto"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-400 text-[10px] uppercase tracking-[0.3em] font-medium mb-6">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Now Live on Polygon Blockchain
                    </div>
                    
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white leading-tight mb-6">
                        Democratizing <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                            Real Estate Wealth.
                        </span>
                    </h1>
                    
                    <p className="text-sm md:text-lg text-stone-300 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
                        Luxe Fractional allows you to invest in premium, climate-resilient properties across Kenya for as little as 10,000 KES. Earn monthly rental yields directly to your M-Pesa, backed by immutable blockchain security.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                        <Link href="/invest" className="w-full sm:w-auto px-8 py-4 bg-white text-black text-xs uppercase tracking-[0.2em] font-bold hover:bg-emerald-400 transition-colors">
                            View fractional Listings
                        </Link>
                        <Link href="/how-it-works" className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/30 text-white text-xs uppercase tracking-[0.2em] hover:bg-white/10 transition-colors">
                            Read the Whitepaper
                        </Link>
                    </div>

                    {/* Trust Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-white/10">
                        <div>
                            <p className="text-2xl md:text-3xl font-serif text-white">1000 <span className="text-sm text-emerald-400">KES</span></p>
                            <p className="text-[9px] md:text-[10px] uppercase tracking-widest text-stone-500 mt-2">Minimum Entry</p>
                        </div>
                        <div>
                            <p className="text-2xl md:text-3xl font-serif text-white">8-12<span className="text-sm text-emerald-400">%</span></p>
                            <p className="text-[9px] md:text-[10px] uppercase tracking-widest text-stone-500 mt-2">Avg Annual Yield</p>
                        </div>
                        <div>
                            <p className="text-2xl md:text-3xl font-serif text-white">100<span className="text-sm text-emerald-400">%</span></p>
                            <p className="text-[9px] md:text-[10px] uppercase tracking-widest text-stone-500 mt-2">Asset Backed</p>
                        </div>
                        <div>
                            <p className="text-2xl md:text-3xl font-serif text-white">Web3</p>
                            <p className="text-[9px] md:text-[10px] uppercase tracking-widest text-stone-500 mt-2">Tokenized Security</p>
                        </div>
                    </div>
                </motion.div>
            </div>

        </div>
      </motion.div>

      {/* --- SLIDER CONTROLS (Dots) --- */}
      <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center gap-3">
        {[0, 1].map((index) => (
            <button 
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-1.5 rounded-full transition-all duration-500 ${currentSlide === index ? 'w-8 bg-emerald-400' : 'w-4 bg-white/30 hover:bg-white/60'}`}
                aria-label={`Go to slide ${index + 1}`}
            />
        ))}
      </div>

      {/* Decorative HUD Elements (Hidden on mobile) */}
      <div className="absolute bottom-12 left-12 hidden xl:flex gap-16 text-white/30 tracking-hud z-10">
        <div><p className="mb-1">Perspective</p><p className="text-white/60">00{currentSlide + 1} / 002</p></div>
      </div>
    </section>
  )
}