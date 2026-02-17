/* src/components/property/SimilarListings.tsx */
"use client";
import React from 'react';
import { PropertyCard } from '../PropertyCard';
import { SmallPropertyCard } from './SmallPropertyCard';
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
  if (!listingsArray || listingsArray.length === 0) {
    return (
      <section className="py-12 border-t border-stone-100 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 text-center text-stone-400 text-sm">
          No similar properties found at this time.
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 border-t border-stone-100 bg-white">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] font-bold">Recommendations</span>
            <h2 className="font-serif text-3xl mt-4">Similar Portfolios</h2>
          </div>
          <p className="hidden md:block text-stone-400 text-sm italic font-serif max-w-xs text-right">
            Refined alternatives curated based on value and location.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {listingsArray.slice(0, 4).map((prop: Property) => (
            <SmallPropertyCard key={prop.property_id || prop.id} property={prop} />
          ))}
        </div>
      </div>
    </section>
  );
}