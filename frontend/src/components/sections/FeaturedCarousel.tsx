"use client"
import React from 'react'
import { motion } from 'framer-motion'
import { CldImage } from 'next-cloudinary'
import Link from 'next/link'
import SearchBar from '../SearchBar'

const FeaturedCarousel: React.FC = () => {
  const items = [
    { 
      id: '1', 
      title: 'Villa Azul', 
      location: 'Karen, Nairobi', 
      price: 125000000, 
      cloudinary_id: 'villa-azul_ys6thm',
      slug: 'villa-azul'
    },
    { 
      id: '2', 
      title: 'Penthouse Noir', 
      location: 'Westlands, Nairobi', 
      price: 98000000, 
      cloudinary_id: 'penthouse-noir_ga8o2a', 
      slug: 'penthouse-noir'
    },
    { 
      id: '3', 
      title: 'Riverside Estate', 
      location: 'Runda, Nairobi', 
      price: 215000000, 
      cloudinary_id: 'riverside-estate_pcqmvz', 
      slug: 'riverside-estate'
    },
  ]

  return (
    <section className="py-24 md:py-32 overflow-hidden bg-[#FAFAFA]">
      <div className="max-w-[1440px] mx-auto">
        
        {/* Section Header */}
        <div className="px-6 lg:px-12 mb-16 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <span className="text-[#E91E63] tracking-[0.4em] text-[10px] uppercase font-bold mb-4 block">
              Curated Portfolio
            </span>
            <h2 className="font-serif text-4xl md:text-6xl text-[#0D0D0D]">Featured Assets</h2>
          </div>
          <Link 
            href="/properties" 
            className="text-[10px] uppercase tracking-[0.3em] text-stone-500 border-b border-stone-300 pb-1 hover:text-[#0D0D0D] hover:border-[#0D0D0D] transition-colors whitespace-nowrap"
          >
            View All Properties →
          </Link>
        </div>

        {/* Horizontal Scrolling Carousel */}
        <div className="flex gap-8 px-6 lg:px-12 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-12">
          {items.map((item, index) => (
            <motion.div 
              key={item.id}
              className="min-w-[85vw] md:min-w-[500px] lg:min-w-[600px] snap-center group"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
            >
              <Link href={`/properties/${item.slug}`} className="block">
                
                {/* Image Container */}
                <div className="aspect-[4/3] md:aspect-[16/10] relative overflow-hidden bg-stone-200 mb-6">
                  <CldImage
                    width="1200"
                    height="800"
                    src={item.cloudinary_id}
                    alt={item.title}
                    crop="fill"
                    gravity="auto"
                    className="w-full h-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
                  />
                  {/* Subtle dark gradient for badge readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60"></div>
                  
                  {/* Location Badge */}
                  <div className="absolute bottom-6 left-6 bg-black/40 backdrop-blur-md border border-white/20 px-4 py-2">
                    <p className="text-white text-[9px] tracking-[0.3em] uppercase">{item.location}</p>
                  </div>
                </div>
                
                {/* Content Box */}
                <div className="flex justify-between items-start px-2 border-b border-stone-200 pb-6 group-hover:border-[#E91E63] transition-colors duration-500">
                  <div>
                    <h3 className="font-serif text-3xl mb-2 text-[#0D0D0D] group-hover:italic transition-all">{item.title}</h3>
                    <p className="text-stone-400 text-[10px] uppercase tracking-widest">Architectural Listing</p>
                  </div>
                  <div className="text-right">
                    <p className="font-sans text-sm md:text-base text-stone-900 tracking-wide">
                      KES {item.price.toLocaleString()}
                    </p>
                    <p className="text-[#E91E63] text-[9px] uppercase tracking-widest mt-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">
                      View Asset →
                    </p>
                  </div>
                </div>

              </Link>
            </motion.div>
          ))}
        </div>

        {/* Global Search Bar Section */}
        <div className="max-w-4xl mx-auto px-6 mt-20 md:mt-32">
          <div className="text-center mb-8">
            <span className="font-serif text-2xl md:text-3xl text-stone-900">Refine your acquisition.</span>
            <p className="text-xs text-stone-500 mt-2 font-light">Search by location, architectural style, or fractional availability.</p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white p-2 border border-stone-200 shadow-xl"
          >
            {/* Assuming your SearchBar component is a form with inputs.
              The wrapper above gives it a clean, boxed-in luxury feel. 
            */}
            <SearchBar />
          </motion.div>
        </div>

      </div>
    </section>
  )
}

export default FeaturedCarousel