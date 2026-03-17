import React from 'react';
import Link from 'next/link';
import { Mail, Phone, X, Youtube, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-white pt-20 pb-10 px-6 md:px-12 border-t border-white/5">
      {/* 5-Column Grid for better spacing on large screens */}
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-20">

        {/* Brand & Newsletter (Spans 2 columns) */}
        <div className="space-y-8 lg:col-span-2 pr-0 lg:pr-12">
          <Link href="/">
            <h3 className="font-serif text-3xl cursor-pointer hover:text-stone-300 transition-colors">Luxe Estate.</h3>
          </Link>
          <p className="text-stone-400 text-sm font-light leading-relaxed max-w-sm">
            The premier fractional real estate marketplace powered by Polygon smart contracts and Safaricom M-Pesa.
          </p>
          <div className="space-y-4 max-w-sm">
            <p className="text-[10px] uppercase tracking-widest text-stone-400">Stay up to date</p>
            <form className="flex border-b border-stone-700 pb-2 group focus-within:border-[#E91E63] transition-colors">
              <input
                type="email"
                placeholder="Email Address"
                className="bg-transparent outline-none text-sm w-full font-light placeholder:text-stone-600"
                required
              />
              <button type="submit" className="text-[10px] uppercase tracking-tighter text-stone-400 group-hover:text-[#E91E63] transition-colors">Join</button>
            </form>
          </div>
        </div>

        {/* Platform Links */}
        <div className="space-y-6">
          <p className="text-[10px] uppercase tracking-[0.4em] text-stone-500 font-bold">Platform</p>
          <ul className="space-y-4 text-sm font-light text-stone-300">
            <li><Link href="/invest" className="hover:text-white transition-colors">Primary Offerings</Link></li>
            <li><Link href="/invest" className="hover:text-white transition-colors">Secondary Market</Link></li>
            <li><Link href="/how-it-works" className="hover:text-white transition-colors">How Tokenization Works</Link></li>
            <li><Link href="/agent/login" className="hover:text-[#E91E63] transition-colors">Agent Portal</Link></li>
          </ul>
        </div>

        {/* Support & Legal Links */}
        <div className="space-y-6">
          <p className="text-[10px] uppercase tracking-[0.4em] text-stone-500 font-bold">Legal & Support</p>
          <ul className="space-y-4 text-sm font-light text-stone-300">
            <li><Link href="/faq" className="hover:text-white transition-colors">Help Center & FAQs</Link></li>
            <li><Link href="/wallet-setup" className="hover:text-white transition-colors">MetaMask Guide</Link></li>
            <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            <li><Link href="/legal/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link href="/legal/risks" className="hover:text-[#E91E63] transition-colors">Risk Disclosure</Link></li>
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
            <a href="tel:0745131817" className="flex items-center gap-2 hover:text-white transition-colors">
              <Phone size={14} /> 0745 131 817
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-[1440px] mx-auto pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-[10px] uppercase tracking-widest text-stone-500 text-center md:text-left leading-loose">
          © {new Date().getFullYear()} Luxe Estate. All rights reserved.<br />
          <span className="opacity-50">Regulated under the applicable laws of Kenya. A craft of Siro Production.</span>
        </div>

        <div className="flex gap-8 text-stone-400">
          <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className="hover:text-[#E91E63] transition-colors"><X size={18} /></a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:text-[#E91E63] transition-colors"><Youtube size={18} /></a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-[#E91E63] transition-colors"><Instagram size={18} /></a>
        </div>
      </div>
    </footer>
  );
}