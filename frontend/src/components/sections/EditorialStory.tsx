"use client"
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface EditorialStoryProps {
  title?: string;
  subtitle?: string;
}

export default function EditorialStory({ title, subtitle }: EditorialStoryProps) {
  return (
    <section className="bg-[#FAFAFA] py-24 md:py-40 px-6 lg:px-12 overflow-hidden">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
        
        {/* Left: Text Content */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:col-span-5 flex flex-col items-start order-2 lg:order-1"
        >
          {/* Decorative Accent Line */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-px bg-[#E91E63]"></div>
            <span className="text-[#E91E63] tracking-[0.4em] text-[10px] uppercase font-bold">
              The Luxe Vision
            </span>
          </div>

          <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl mb-8 text-[#0D0D0D] leading-[1.1]">
            {title || "Curation as Architecture."}
          </h2>
          
          <p className="text-stone-500 text-base md:text-lg leading-relaxed max-w-md font-light mb-12">
            {subtitle || "We bridge the gap between physical spaces and digital liquidity, offering unprecedented access to premium architectural assets."}
          </p>
          
          <Link 
            href="/about" 
            className="group flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] font-bold text-[#0D0D0D] hover:text-[#E91E63] transition-colors"
          >
            <span className="border-b border-black pb-1 group-hover:border-[#E91E63] transition-colors">
              Read Our Story
            </span>
            <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
          </Link>
        </motion.div>

        {/* Right: Architectural Image (Preserved Motion Effect) */}
        <motion.div 
          initial={{ clipPath: 'inset(100% 0 0 0)' }}
          whileInView={{ clipPath: 'inset(0% 0 0 0)' }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 aspect-square md:aspect-[4/3] lg:aspect-[16/11] bg-stone-100 overflow-hidden relative order-1 lg:order-2 shadow-2xl"
        >
          <img 
            src="/images/interior.jpg" 
            alt="Interior Architecture"
            className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 scale-105 hover:scale-100 transition-all duration-1000 ease-out" 
          />
          {/* Subtle interior border for an editorial print feel */}
          <div className="absolute inset-5 border border-white/20 pointer-events-none mix-blend-overlay"></div>
        </motion.div>

      </div>
    </section>
  );
}