/* src/components/PropertyReturnNavBar.tsx */
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PropertyReturnNavBar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-stone-100 px-6 py-4">
      <div className="max-w-[1440px] mx-auto flex justify-between items-center">
        
        {/* Return to Property Listings */}
        <Link 
          href="/properties" 
          className="group flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-stone-500 hover:text-black transition-all"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          <span>Return to Collection</span>
        </Link>

        {/* Minimal Brand Mark */}
        <Link href="/">
          <span className="font-serif text-xl tracking-tighter"></span>
        </Link>

        {/* Action Link for Discretion */}
        <div className="hidden md:block">
           <Link href="/contact" className="text-[11px] uppercase tracking-widest text-stone-400 hover:text-[#E91E63] transition-colors">
             Private Inquiry
           </Link>
        </div>
      </div>
    </nav>
  );
}