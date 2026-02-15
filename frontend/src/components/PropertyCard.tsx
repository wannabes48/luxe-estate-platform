"use client"
import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { CldImage } from 'next-cloudinary'

export function PropertyCard({ property }: { property: any }) {
  // Robust image resolution
  let imageUrl = null;
  const rawImages = property.images || property.property_images;

  if (Array.isArray(rawImages) && rawImages.length > 0) {
    const first = rawImages[0];
    if (typeof first === 'string') {
      imageUrl = first;
    } else if (typeof first === 'object') {
      // based on debug logs, image_url is the correct field for these records
      imageUrl = first.image_url || first.url || first.image_path || first.secure_url || null;
    }
  }

  return (
    <div className="relative group">
      {/* 1. The main clickable area - Wraps everything once */}
      <Link href={`/properties/${property.slug}`}>
        <motion.div
          whileHover={{ y: -10 }}
          className="bg-white shadow-sm hover:shadow-2xl transition-all duration-700 h-full flex flex-col"
        >
          {/* Image Section */}
          <div className="aspect-[4/5] relative overflow-hidden bg-stone-100">
            {imageUrl && imageUrl !== "" ? (
              imageUrl.startsWith('http') ? (
                <img
                  src={imageUrl}
                  alt={property.title}
                  className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
                  loading="lazy"
                />
              ) : (
                <CldImage
                  width="800"
                  height="1000"
                  src={imageUrl}
                  alt={property.title}
                  crop="fill"
                  gravity="auto"
                  className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
                  loading="lazy"
                />
              )
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No Image Available
              </div>
            )}
            <div className="absolute top-6 left-6 bg-[#E91E63] text-white text-[10px] font-bold px-4 py-1.5 uppercase tracking-widest z-10">
              {property.is_featured ? 'Featured' : 'Exclusive'}
            </div>
          </div>

          {/* Details Section */}
          <div className="p-10 flex flex-col flex-grow">
            <h3 className="font-serif text-3xl text-[#0D0D0D] mb-3 line-clamp-1">{property.title}</h3>

            <p className="text-gray-400 text-xs uppercase tracking-[0.3em] mb-6">
              {property.location?.name || "Premium Location"}, {property.location?.city || "Kenya"}
            </p>

            <div className="mt-auto flex justify-between items-center border-t border-gray-100 pt-8" onClick={(e) => e.stopPropagation()}>
              <span className="text-xl font-bold text-[#E91E63]">
                Ksh {Number(property.price).toLocaleString()}
              </span>

              {/* Note: This is now just a span, NOT a <Link> */}
              <span className="text-[10px] uppercase tracking-widest border-b border-black pb-1 group-hover:text-[#E91E63] group-hover:border-[#E91E63] transition-colors">
                View Detail
              </span>
              <button
                onClick={() => window.open(property.map_url, '_blank')}
                className="text-[10px] uppercase tracking-tighter text-stone-400 hover:text-[#E91E63] flex items-center gap-1 transition-colors bg-none border-none p-0 cursor-pointer"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                Find on Map
              </button>
            </div>
          </div>
        </motion.div>
      </Link>
    </div>
  )
}