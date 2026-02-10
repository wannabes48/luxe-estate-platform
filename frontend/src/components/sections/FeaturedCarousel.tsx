/* src/components/sections/FeaturedCarousel.tsx */
"use client"
import React from 'react'
import { motion } from 'framer-motion'
import { CldImage } from 'next-cloudinary'
import Link from 'next/link'

const FeaturedCarousel: React.FC = () => {
  // Updated data to use Cloudinary Public IDs
  // Replace these strings with the actual Public IDs from your Cloudinary Media Library
  const items = [
    { 
      id: '1', 
      title: 'Villa Azul', 
      location: 'Karen, Nairobi', 
      price: 1250000, 
      cloudinary_id: 'villa-azul_ys6thm', // Your Cloudinary Public ID
      slug: 'villa-azul'
    },
    { 
      id: '2', 
      title: 'Penthouse Noir', 
      location: 'Westlands, Nairobi', 
      price: 980000, 
      cloudinary_id: 'penthouse-noir_ga8o2a', 
      slug: 'penthouse-noir'
    },
    { 
      id: '3', 
      title: 'Riverside Estate', 
      location: 'Runda, Nairobi', 
      price: 2150000, 
      cloudinary_id: 'riverside-estate_pcqmvz', 
      slug: 'riverside-estate'
    },
  ]

  return (
    <section className="py-20 overflow-hidden bg-white">
      <div className="flex gap-8 px-10 overflow-x-auto no-scrollbar snap-x snap-mandatory">
        {items.map((item) => (
          <motion.div 
            key={item.id}
            className="min-w-[300px] md:min-w-[450px] snap-start group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Link href={`/properties/${item.slug}`}>
              <div className="aspect-[16/10] relative overflow-hidden bg-stone-100 mb-6">
                <CldImage
                  width="900"
                  height="600"
                  src={item.cloudinary_id}
                  alt={item.title}
                  crop="fill"
                  gravity="auto"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                />
                <div className="absolute bottom-4 left-4 glass-panel px-4 py-2">
                   <p className="text-white text-[10px] tracking-[0.3em] uppercase">Featured / {item.location}</p>
                </div>
              </div>
              
              <div className="flex justify-between items-end px-2">
                <div>
                  <h3 className="font-serif text-3xl mb-1">{item.title}</h3>
                  <p className="text-stone-400 text-[10px] uppercase tracking-widest">Architectural Listing</p>
                </div>
                <p className="font-sans font-bold text-luxury-gold">Ksh {item.price.toLocaleString()}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default FeaturedCarousel