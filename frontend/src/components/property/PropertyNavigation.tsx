/* src/components/property/PropertyNavigation.tsx */
"use client"
import Link from 'next/link'
import { motion } from 'framer-motion'

interface NavProps {
  prevProp: { slug: string; title: string } | null;
  nextProp: { slug: string; title: string } | null;
}

export default function PropertyNavigation({ prevProp, nextProp }: NavProps) {
  return (
    <section className="border-t border-stone-200 bg-white overflow-hidden relative z-50">
      <div className="grid grid-cols-1 md:grid-cols-2">

        {/* Previous Property (Newer) */}
        <Link
          href={prevProp ? `/properties/${prevProp.slug}` : '#'}
          className={`group relative p-16 md:p-24 border-b md:border-b-0 md:border-r border-stone-100 transition-colors duration-700 hover:bg-stone-50 ${!prevProp && 'pointer-events-none opacity-50'}`}
        >
          <div className="relative z-10 flex items-center gap-8">
            <div className="w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-stone-400 mb-2">Previous</p>
              <h4 className="font-serif text-3xl">{prevProp?.title || "Previous"}</h4>
            </div>
          </div>
        </Link>

        {/* Next Property (Older) */}
        <Link
          href={nextProp ? `/properties/${nextProp.slug}` : '#'}
          className={`group relative p-16 md:p-24 transition-colors duration-700 hover:bg-[#FCFAFA] ${!nextProp && 'pointer-events-none opacity-50'}`}
        >
          <div className="relative z-10 flex items-center justify-end gap-8 text-right">
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-stone-400 mb-2">Next</p>
              <h4 className="font-serif text-3xl">{nextProp?.title || "Next"}</h4>
            </div>
            <div className="w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center group-hover:bg-[#E91E63] group-hover:border-[#E91E63] group-hover:text-white transition-all">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </div>
          </div>
        </Link>

      </div>
    </section>
  )
}