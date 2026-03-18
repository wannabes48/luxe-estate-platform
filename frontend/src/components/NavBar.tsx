"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Detect scroll to change navbar background from transparent to solid
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: 'Marketplace', path: '/invest' },
    { name: 'How it Works', path: '/how-it-works' },
    { name: 'Journal', path: '/blog' },
    { name: 'About', path: '/about' },
  ];

  return (
    <>
      <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          isScrolled ? 'bg-black/90 backdrop-blur-md py-4 border-b border-white/10' : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex justify-between items-center">
          
          {/* Brand */}
          <Link href="/" onClick={() => setMobileMenuOpen(false)}>
            <h1 className="font-serif text-2xl md:text-3xl text-white tracking-wide">
              Luxe Estate.
            </h1>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.path}
                className={`text-[10px] uppercase tracking-[0.2em] font-medium transition-colors hover:text-[#E91E63] ${
                  pathname === link.path ? 'text-[#E91E63]' : 'text-white/80'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/auth/login" className="text-white text-xs hover:text-[#E91E63] transition-colors font-medium">
              Sign In
            </Link>
            <Link href="/dashboard" className="bg-white text-black px-6 py-3 text-[10px] uppercase tracking-widest hover:bg-[#E91E63] hover:text-white transition-colors font-bold">
              Portfolio
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-white p-2 focus:outline-none"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={28} strokeWidth={1.5} />
          </button>
        </div>
      </nav>

      {/* Mobile Full-Screen Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: '-100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[100] bg-[#0D0D0D] flex flex-col px-6 py-6 overflow-y-auto"
          >
            {/* Mobile Menu Header */}
            <div className="flex justify-between items-center mb-16">
              <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                <h1 className="font-serif text-2xl text-white tracking-wide">Luxe Estate.</h1>
              </Link>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="text-white/50 hover:text-white transition-colors p-2"
              >
                <X size={32} strokeWidth={1} />
              </button>
            </div>

            {/* Mobile Links */}
            <div className="flex flex-col gap-8 mb-16 px-4">
              {navLinks.map((link, i) => (
                <motion.div 
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i + 0.2 }}
                >
                  <Link 
                    href={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-serif text-4xl text-white hover:text-[#E91E63] hover:italic transition-all block"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Mobile CTAs & Footer info */}
            <div className="mt-auto px-4 pb-8 border-t border-white/10 pt-8 flex flex-col gap-6">
              <Link 
                href="/dashboard" 
                onClick={() => setMobileMenuOpen(false)}
                className="w-full bg-[#E91E63] text-white text-center py-5 text-xs uppercase tracking-[0.2em] font-bold"
              >
                Access Portfolio
              </Link>
              <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-white/40">
                <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                <Link href="/terms" onClick={() => setMobileMenuOpen(false)}>Terms</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}