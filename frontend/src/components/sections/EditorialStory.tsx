/* src/components/sections/EditorialStory.tsx */
"use client"
import React from 'react'
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';


export default function EditorialStory({ title, subtitle, image }: any) {
  return (
    <section className="bg-white py-32 md:py-56 px-10">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-24 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          className="md:col-span-5"
        >
          
          <span className="text-accent tracking-[0.5em] text-[10px] uppercase mb-10 block font-bold">Introduction</span>
          <h2 className="text-5xl md:text-7xl mb-12 leading-[1.05] tracking-tight">{title}</h2>
          <p className="text-stone-500 text-lg leading-relaxed max-w-md">{subtitle}</p>
          <Link href="/about" className="mt-12 inline-block text-[10px] uppercase tracking-[0.3em] border-b border-black pb-2 hover:text-accent hover:border-accent transition-all">
            Learn More
          </Link>
        </motion.div>

        <motion.div 
          initial={{ clipPath: 'inset(100% 0 0 0)' }}
          whileInView={{ clipPath: 'inset(0% 0 0 0)' }}
          transition={{ duration: 1.5 }}
          className="md:col-span-7 aspect-[16/11] bg-stone-100 overflow-hidden"
        >
          <img src={"/images/interior.jpg"} className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-1000" />
        </motion.div>
      </div>
      
      <section className="relative min-h-[90vh] flex items-center justify-center bg-stone-950 overflow-hidden">
      {/* Background Video/Image */}
      <div className="absolute inset-0 opacity-40">
        <img src="/images/luxury-architecture.jpg" alt="Luxe Estate" className="w-full h-full object-cover" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center mt-20">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-400 text-[10px] uppercase tracking-[0.3em] font-medium mb-8">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Now Live on Polygon Blockchain
        </div>
        
        <h1 className="text-5xl md:text-7xl font-serif text-white leading-tight mb-8">
          Democratizing <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            Real Estate Wealth.
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-stone-300 max-w-2xl mx-auto mb-12 font-light">
          Luxe Fractional allows you to invest in premium, climate-resilient properties across Kenya for as little as 10,000 KES. Earn monthly rental yields directly to your M-Pesa, backed by immutable blockchain security.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link href="/invest" className="w-full sm:w-auto px-8 py-4 bg-white text-black text-xs uppercase tracking-[0.2em] font-bold hover:bg-emerald-400 transition-colors">
            View fractional Listings
          </Link>
          <Link href="/how-it-works" className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/30 text-white text-xs uppercase tracking-[0.2em] hover:bg-white/10 transition-colors">
            Read the Whitepaper
          </Link>
        </div>

        {/* Trust Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-10 border-t border-white/10">
          <div>
            <p className="text-3xl font-serif text-white">10k <span className="text-sm text-emerald-400">KES</span></p>
            <p className="text-[10px] uppercase tracking-widest text-stone-500 mt-2">Minimum Entry</p>
          </div>
          <div>
            <p className="text-3xl font-serif text-white">8-12<span className="text-sm text-emerald-400">%</span></p>
            <p className="text-[10px] uppercase tracking-widest text-stone-500 mt-2">Avg Annual Yield</p>
          </div>
          <div>
            <p className="text-3xl font-serif text-white">100<span className="text-sm text-emerald-400">%</span></p>
            <p className="text-[10px] uppercase tracking-widest text-stone-500 mt-2">Asset Backed</p>
          </div>
          <div>
            <p className="text-3xl font-serif text-white">Web3</p>
            <p className="text-[10px] uppercase tracking-widest text-stone-500 mt-2">Tokenized Security</p>
          </div>
        </div>
      </div>
      </section>
    </section>
    
  )
}