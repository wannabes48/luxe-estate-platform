"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the user has already consented
    const consent = localStorage.getItem('luxe_cookie_consent');
    if (!consent) {
      // Small delay so it doesn't jar the user instantly on load
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('luxe_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const declineCookies = () => {
    // Depending on strictness, you might still set a token to hide the banner,
    // but disable your analytics trackers elsewhere in your app.
    localStorage.setItem('luxe_cookie_consent', 'declined');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-0 left-0 w-full z-[100] p-2 md:p-4 pointer-events-none"
        >
          <div className="max-w-[1440px] mx-auto pointer-events-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-black/90 backdrop-blur-md border border-white/10 p-4 md:px-8 md:py-4 shadow-2xl">
            
            {/* Text Content */}
            <div className="max-w-3xl">
              <h3 className="text-white font-serif text-xl mb-1">Digital Footprint & Privacy</h3>
              <p className="text-stone-400 text-sm leading-relaxed">
                Luxe Estate utilizes essential cookies to secure your M-Pesa sessions and maintain fractional equity ledgers. We also use analytics to refine our platform experience. By continuing to browse, you consent to our use of cookies.
              </p>
              <Link 
                href="/legal/privacy" 
                className="inline-block ml-2 mt-1 text-[10px] uppercase tracking-widest text-[#E91E63] hover:text-white transition-colors font-bold"
              >
                Read Privacy Policy
              </Link>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto shrink-0 mt-2 md:mt-0">
              <button 
                onClick={declineCookies}
                className="flex-1 md:flex-none px-4 py-2 text-[9px] uppercase tracking-widest text-stone-300 border border-white/20 hover:bg-white/5 transition-colors font-bold"
              >
                Essential Only
              </button>
              <button 
                onClick={acceptCookies}
                className="w-full sm:w-auto px-8 py-2.5 text-[9px] uppercase tracking-widest bg-white text-black hover:bg-[#E91E63] hover:text-white transition-colors font-bold"
              >
                Accept All
              </button>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}