/* src/components/sections/EditorialStory.tsx */
"use client"
import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

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
    </section>
  )
}