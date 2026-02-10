"use client"
import React from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

export default function FilterBar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // 1. Get current values from URL to drive the UI state
  const currentLocation = searchParams.get('location') || ''
  const currentView = searchParams.get('view') || 'grid'

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }

    // 2. Update the URL. Next.js handles the data re-fetching in the parent Server Component.
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const locations = [
    { name: 'All', value: '' },
    { name: 'Nairobi', value: 'nairobi' },
    { name: 'Mombasa', value: 'mombasa' },
    { name: 'Nakuru', value: 'nakuru' },
    { name: 'Kisumu', value: 'kisumu' },
  ]

  return (
    <div className="flex flex-col md:flex-row gap-8 items-center justify-between border-b border-stone-100 pb-8 mb-12">
      
      {/* HUD Location Selector */}
      <div className="flex gap-6 items-center">
        <span className="text-[9px] uppercase tracking-[0.4em] text-stone-400 font-bold">Location //</span>
        <div className="flex gap-3">
          {locations.map((loc) => {
            const isActive = currentLocation === loc.value
            return (
              <button
                key={loc.value}
                onClick={() => handleFilterChange('location', loc.value)}
                className={`px-5 py-2 text-[10px] uppercase tracking-[0.2em] transition-all duration-700 border rounded-sm ${
                  isActive 
                    ? 'bg-black text-white border-black shadow-lg shadow-black/10' 
                    : 'bg-transparent text-stone-400 border-stone-100 hover:border-stone-400'
                }`}
              >
                {loc.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* HUD Controls */}
      <div className="flex gap-8 items-center">
        {/* Layout Toggle */}
        <div className="flex items-center gap-4">
          <span className="text-[9px] uppercase tracking-[0.4em] text-stone-400 font-bold">Layout</span>
          <div className="flex bg-stone-50 p-1 border border-stone-100 rounded-sm">
            <button
              onClick={() => handleFilterChange("view", "grid")}
              className={`px-4 py-1.5 text-[9px] uppercase tracking-widest transition-all duration-300 ${
                currentView === 'grid' 
                  ? 'bg-white text-black shadow-sm' 
                  : 'text-stone-300 hover:text-stone-500'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => handleFilterChange('view', 'list')}
              className={`px-4 py-1.5 text-[9px] uppercase tracking-widest transition-all duration-300 ${
                currentView === 'list' 
                  ? 'bg-white text-black shadow-sm' 
                  : 'text-stone-300 hover:text-stone-500'
              }`}
            >
              List
            </button>
          </div>
        </div>

        {/* Sync Status - Decorative but high-end */}
        <div className="hidden lg:flex items-center gap-3 border-l border-stone-200 pl-8">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[9px] text-stone-400 font-medium tracking-[0.3em] uppercase">
            Live Inventory
          </span>
        </div>
      </div>
    </div>
  )
}