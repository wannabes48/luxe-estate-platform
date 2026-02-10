/* src/components/Footer.tsx */
import React from 'react';
import Link from 'next/link';
import { Mail, Phone, Twitter, Youtube, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-white pt-20 pb-10 px-6 md:px-12 border-t border-white/5">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
        
        {/* Brand & Newsletter */}
        <div className="space-y-8">
          <Link href="/">
            <h3 className="font-serif text-3xl cursor-pointer">Luxe Estate.</h3>
          </Link>
          <div className="space-y-4">
            <p className="text-[10px] uppercase tracking-widest text-stone-400">Stay up to date</p>
            <form className="flex border-b border-stone-700 pb-2">
              <input 
                type="email" 
                placeholder="Email Address" 
                className="bg-transparent outline-none text-sm w-full font-light"
                required
              />
              <button type="submit" className="text-[10px] uppercase tracking-tighter hover:text-[#E91E63] transition-colors">Join</button>
            </form>
          </div>
        </div>

        {/* Company Links */}
        <div className="space-y-6">
          <p className="text-[10px] uppercase tracking-[0.4em] text-stone-500 font-bold">Company</p>
          <ul className="space-y-4 text-sm font-light text-stone-300">
            <li><Link href="/agents" className="hover:text-white transition-colors">The Team</Link></li>
            <li><Link href="/blog" className="hover:text-white transition-colors">Journal</Link></li>
            <li><Link href="/contact" className="hover:text-white transition-colors">List Your Property</Link></li>
            <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
          </ul>
        </div>

        {/* Support Links */}
        <div className="space-y-6">
          <p className="text-[10px] uppercase tracking-[0.4em] text-stone-500 font-bold">Support</p>
          <ul className="space-y-4 text-sm font-light text-stone-300">
            <li><Link href="/faq" className="hover:text-white transition-colors">Frequently Asked Questions</Link></li>
            <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            <li><Link href="/contact" className="hover:text-white transition-colors">Private Support</Link></li>
          </ul>
        </div>

        {/* Location & Contact */}
        <div className="space-y-6">
          <p className="text-[10px] uppercase tracking-[0.4em] text-stone-500 font-bold">Location</p>
          <div className="space-y-4 text-sm font-light text-stone-300">
            <p className="leading-relaxed">
              <span className="text-white block font-medium">Luxe HQ — Diamond Plaza II</span>
              4th Avenue Parklands<br />
              3rd Floor (Parking Section)
            </p>
            <a href="tel:0716770077" className="flex items-center gap-2 hover:text-white transition-colors">
              <Phone size={14} /> 0745 131 817
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-[1440px] mx-auto pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-[10px] uppercase tracking-widest text-stone-500 text-center md:text-left leading-loose">
          © 2026 Luxe Estate. All rights reserved.<br />
          <span className="opacity-50">A craft of Siro Production</span>
        </div>

        <div className="flex gap-8 text-stone-400">
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#E91E63] transition-colors"><Twitter size={18} /></a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#E91E63] transition-colors"><Youtube size={18} /></a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#E91E63] transition-colors"><Instagram size={18} /></a>
        </div>
      </div>
    </footer>
  );
}