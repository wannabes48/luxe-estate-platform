/* src/components/property/NextPropertyNav.tsx */
import Link from 'next/link'
import { motion } from 'framer-motion'

interface NavProps {
  nextSlug: string | null;
  prevSlug: string | null;
}

export default function NextPropertyNav({ nextSlug, prevSlug }: NavProps) {
  if (!nextSlug && !prevSlug) return null;
    return (
    <div className="flex justify-between items-center mt-20 border-t border-stone-100 pt-10 px-6 md:px-0">
      <div className="flex flex-col items-start"></div>
      {/* Previous Link */}
      {prevSlug && (
        <Link href={`/properties/${prevSlug}`} className="group flex flex-col items-start gap-2 transition-all">
          <span className="text-[9px] uppercase tracking-[0.3em] text-stone-400">Previous</span>
          <span className="text-[10px] uppercase tracking-widest text-black border-b border-transparent group-hover:border-black pb-1">
            ← Back to Earlier
          </span>
        </Link>
      )} 
      <div />

      <div className="flex flex-col items-end">
      {/* Next Link */}
      {nextSlug && (
        <Link href={`/properties/${nextSlug}`} className="group flex flex-col items-end gap-2 transition-all">
          <span className="text-[9px] uppercase tracking-[0.3em] text-stone-400">Next</span>
          <span className="text-[10px] uppercase tracking-widest text-black border-b border-transparent group-hover:border-black pb-1">
            View Next →
          </span>
        </Link>
      )}
      <div />
    </div>
  </div>  
  );
}