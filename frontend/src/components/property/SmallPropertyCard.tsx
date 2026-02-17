"use client"
import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { CldImage } from 'next-cloudinary'

export function SmallPropertyCard({ property }: { property: any }) {
    // Robust image resolution
    let imageUrl = null;
    const rawImages = property.images || property.property_images;

    if (Array.isArray(rawImages) && rawImages.length > 0) {
        const first = rawImages[0];
        if (typeof first === 'string') {
            imageUrl = first;
        } else if (typeof first === 'object') {
            imageUrl = first.image_url || first.url || first.image_path || first.secure_url || null;
        }
    }

    return (
        <div className="relative group">
            <Link href={`/properties/${property.slug}`}>
                <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-white border border-stone-100 shadow-sm hover:shadow-lg transition-all duration-500 h-full flex flex-col"
                >
                    {/* Image Section - More compact 4:3 ratio */}
                    <div className="aspect-[4/3] relative overflow-hidden bg-stone-100">
                        {imageUrl ? (
                            imageUrl.startsWith('http') ? (
                                <img
                                    src={imageUrl}
                                    alt={property.title}
                                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                                    loading="lazy"
                                />
                            ) : (
                                <CldImage
                                    width="400"
                                    height="300"
                                    src={imageUrl}
                                    alt={property.title}
                                    crop="fill"
                                    gravity="auto"
                                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                                    loading="lazy"
                                />
                            )
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-stone-300 text-xs uppercase tracking-widest">
                                No Image
                            </div>
                        )}

                        {/* Status Badges - Simplified */}
                        <div className="absolute top-3 left-3 flex gap-2 z-10">
                            {property.is_boosted && (
                                <div className="bg-[#D4AF37] text-black text-[8px] font-bold px-2 py-1 uppercase tracking-widest shadow-sm">
                                    Promoted
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Details Section - Compact */}
                    <div className="p-5 flex flex-col flex-grow">
                        <h3 className="font-serif text-lg text-[#0D0D0D] mb-1 line-clamp-1 group-hover:text-[#E91E63] transition-colors">
                            {property.title}
                        </h3>

                        <p className="text-stone-400 text-[10px] uppercase tracking-widest mb-3 line-clamp-1">
                            {property.location?.name}, {property.location?.city}
                        </p>

                        <div className="mt-auto pt-4 border-t border-stone-100 flex justify-between items-center">
                            <span className="text-sm font-bold text-[#0D0D0D]">
                                Ksh {Number(property.price).toLocaleString()}
                            </span>
                            <span className="text-[10px] uppercase tracking-widest text-[#E91E63] font-bold opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                                View →
                            </span>
                        </div>
                    </div>
                </motion.div>
            </Link>
        </div>
    )
}
