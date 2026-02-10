/* src/components/ReturnNavBar.tsx */
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ReturnNavBar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-stone-100 px-6 py-4">
      <div className="max-w-[1440px] mx-auto flex justify-between items-center">
        
        {/* Return Action */}
        <Link 
          href="/" 
          className="group flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-stone-500 hover:text-black transition-all"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          <span>Return Home</span>
        </Link>

        {/* Minimal Brand Mark */}
        <Link href="/">
          <span className="font-serif text-xl tracking-tighter"></span>
        </Link>

        {/* Empty div to keep logo centered or balanced */}
        <div className="w-20 hidden md:block"></div>
      </div>
    </nav>
  );
}