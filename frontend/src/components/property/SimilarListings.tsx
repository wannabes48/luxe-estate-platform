/* src/components/property/SimilarListings.tsx */
"use client";
import React from 'react';
import { PropertyCard } from '../PropertyCard';
import { motion } from 'framer-motion';

interface Property {
  id: string | number;
  [key: string]: any;
}

interface SimilarListingsProps {
  properties: Property[];
}

export default function SimilarListings({ properties }: SimilarListingsProps) {
  // Extract the actual array from the API response safely
  const listingsArray: Property[] = Array.isArray(properties) 
    ? properties 
    : [];

  // Don't render the section if no similar properties were found
  if (!listingsArray || listingsArray.length === 0) return null;

  return (
    <section className="py-24 border-t border-stone-100 bg-white">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#E91E63] font-bold">Recommendations</span>
            <h2 className="font-serif text-4xl mt-4">Similar Portfolios</h2>
          </div>
          <p className="hidden md:block text-stone-400 text-sm italic font-serif max-w-xs">
            Refined alternatives curated based on architectural style and region.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {properties.slice(0, 3).map((prop: Property) => (
            <PropertyCard key={prop.id} property={prop} />
          ))}
        </div>
      </div>
    </section>
  );
}