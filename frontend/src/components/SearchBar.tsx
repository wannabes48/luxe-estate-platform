"use client"
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, MapPin, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Custom Hook to handle clicking outside custom dropdowns
function useOnClickOutside(ref: React.RefObject<any>, handler: () => void) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) return;
      handler();
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

export default function SearchBar() {
  const router = useRouter();
  
  // State
  const [filters, setFilters] = useState({
    intent: '',
    type: '',
    location: ''
  });

  // Dropdown States
  const [openDropdown, setOpenDropdown] = useState<'intent' | 'type' | null>(null);

  // Refs for click-outside
  const intentRef = useRef<HTMLDivElement>(null);
  const typeRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(intentRef, () => setOpenDropdown(null));
  useOnClickOutside(typeRef, () => setOpenDropdown(null));

  // Options Definitions
  const intentOptions = [
    { label: 'All Acquisitions', value: '' },
    { label: 'Buy Entire Asset', value: 'FOR_SALE' },
    { label: 'Fractional Equity', value: 'FRACTIONAL' },
    { label: 'Rent Luxury', value: 'FOR_RENT' }
  ];

  const typeOptions = [
    { label: 'All Asset Classes', value: '' },
    { label: 'Modernist Villa', value: 'villa' },
    { label: 'Penthouse', value: 'penthouse' },
    { label: 'Commercial Estate', value: 'estate' },
    { label: 'Coastal Retreat', value: 'coastal' }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (filters.type) params.set('type', filters.type);
    if (filters.location) params.set('location', filters.location);

    // Dynamic Routing Logic
    if (filters.intent === 'FRACTIONAL') {
      router.push(`/invest?${params.toString()}`);
    } else {
      if (filters.intent) params.set('status', filters.intent);
      router.push(`/properties?${params.toString()}`);
    }
  };

  // Helper to find selected label
  const getLabel = (options: any[], value: string) => options.find(opt => opt.value === value)?.label || options[0].label;

  return (
    <div className="w-full max-w-5xl shadow-2xl bg-white border border-stone-100">
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row w-full">
        
        {/* 1. INTENT DROPDOWN */}
        <div className="relative flex-1 border-b md:border-b-0 md:border-r border-stone-200" ref={intentRef}>
          <div 
            onClick={() => setOpenDropdown(openDropdown === 'intent' ? null : 'intent')}
            className="px-8 py-6 h-full cursor-pointer hover:bg-[#FAFAFA] transition-colors flex flex-col justify-center"
          >
            <span className="text-[9px] uppercase tracking-[0.2em] text-[#E91E63] font-bold mb-2">Intent</span>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-stone-900">{getLabel(intentOptions, filters.intent)}</span>
              <ChevronDown size={14} className={`text-stone-400 transition-transform duration-300 ${openDropdown === 'intent' ? 'rotate-180' : ''}`} />
            </div>
          </div>
          
          <AnimatePresence>
            {openDropdown === 'intent' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 w-full md:w-[120%] bg-white shadow-2xl border border-stone-100 mt-2 z-50 py-2"
              >
                {intentOptions.map(opt => (
                  <div 
                    key={opt.value}
                    onClick={() => { setFilters({...filters, intent: opt.value}); setOpenDropdown(null); }}
                    className="px-8 py-4 text-sm text-stone-600 hover:bg-stone-50 hover:text-[#E91E63] cursor-pointer transition-colors"
                  >
                    {opt.label}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 2. ASSET CLASS DROPDOWN */}
        <div className="relative flex-1 border-b md:border-b-0 md:border-r border-stone-200" ref={typeRef}>
          <div 
            onClick={() => setOpenDropdown(openDropdown === 'type' ? null : 'type')}
            className="px-8 py-6 h-full cursor-pointer hover:bg-[#FAFAFA] transition-colors flex flex-col justify-center"
          >
            <span className="text-[9px] uppercase tracking-[0.2em] text-[#E91E63] font-bold mb-2">Asset Class</span>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-stone-900">{getLabel(typeOptions, filters.type)}</span>
              <ChevronDown size={14} className={`text-stone-400 transition-transform duration-300 ${openDropdown === 'type' ? 'rotate-180' : ''}`} />
            </div>
          </div>
          
          <AnimatePresence>
            {openDropdown === 'type' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 w-full md:w-[120%] bg-white shadow-2xl border border-stone-100 mt-2 z-50 py-2"
              >
                {typeOptions.map(opt => (
                  <div 
                    key={opt.value}
                    onClick={() => { setFilters({...filters, type: opt.value}); setOpenDropdown(null); }}
                    className="px-8 py-4 text-sm text-stone-600 hover:bg-stone-50 hover:text-[#E91E63] cursor-pointer transition-colors"
                  >
                    {opt.label}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 3. LOCATION INPUT */}
        <div className="flex-[1.5] relative flex items-center">
          <div className="absolute left-8">
            <MapPin size={16} className="text-stone-300" />
          </div>
          <input 
            type="text"
            className="w-full h-full py-8 pl-16 pr-8 outline-none text-sm text-stone-900 placeholder:text-stone-400 font-medium hover:bg-[#FAFAFA] focus:bg-white transition-colors" 
            placeholder="Search by neighborhood, city, or zip..."
            value={filters.location}
            onChange={(e) => setFilters({...filters, location: e.target.value})}
          />
        </div>

        {/* 4. SUBMIT BUTTON */}
        <button 
          type="submit" 
          className="bg-[#0D0D0D] text-white px-12 py-8 flex items-center justify-center gap-3 hover:bg-[#E91E63] transition-colors group"
        >
          <Search size={16} className="text-white group-hover:scale-110 transition-transform" />
          <span className="font-bold uppercase tracking-[0.2em] text-[10px]">Explore</span>
        </button>
        
      </form>
    </div>
  );
}