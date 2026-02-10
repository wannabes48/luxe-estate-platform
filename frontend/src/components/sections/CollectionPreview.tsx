"use client"
import React from 'react'
import { CldImage } from 'next-cloudinary'
import { motion } from 'framer-motion'
import Link from 'next/link'

const CollectionPreview: React.FC = () => {
  return (
    <section className="py-24 px-6 md:px-24 bg-white">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-center">
        
        {/* Text Content */}
        <div className="md:col-span-5">
          <span className="text-[10px] uppercase tracking-[0.4em] text-luxury-gold mb-6 block font-bold">
            The Portfolio
          </span>
          <h3 className="font-serif text-5xl mb-8 text-luxury-charcoal leading-tight">
            Curated <br />Collections
          </h3>
          <p className="text-luxury-slate leading-relaxed mb-8 text-lg">
             <em>
                A selection of homes grouped by architectural language and provenance.
                From the brutalist concrete lines of urban penthouses to the soft,
                organic textures of riverside estates, we categorize property not just
                by location, but by the soul of its design.
            </em>

          </p>
        <Link href="/properties">
            <div className="flex items-center gap-4 group cursor-pointer w-fit">
                <span className="text-xs uppercase tracking-widest font-bold border-b border-black pb-1 group-hover:text-luxury-gold group-hover:border-luxury-gold transition-all duration-500">
                    Explore All Series
                </span>
                <motion.svg 
                    width="15" 
                    height="15" 
                    viewBox="0 0 15 15" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className="group-hover:translate-x-2 transition-transform duration-500"
                >
                    <path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" />
                </motion.svg>
            </div>
        </Link>
        </div>

        {/* Image Content */}
        <div className="md:col-span-7">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="aspect-[16/10] relative overflow-hidden bg-stone-100 shadow-2xl"
          >
            <CldImage
              width="1200"
              height="750"
              // Using the public ID from your URL: samples/landscapes/architecture-signs
              src="samples/landscapes/architecture-signs"
              alt="Architectural signs and design language"
              crop="fill"
              gravity="center"
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 duration-700"
            />
            {/* Subtle Overlay HUD */}
            <div className="absolute bottom-0 right-0 bg-white p-6 md:p-10 max-w-[240px]">
              <p className="text-[9px] uppercase tracking-widest text-stone-400 mb-2">Reference №</p>
              <p className="text-sm font-serif italic text-luxury-charcoal">
                "Design is the silent ambassador of your brand."
              </p>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  )
}

export default CollectionPreview