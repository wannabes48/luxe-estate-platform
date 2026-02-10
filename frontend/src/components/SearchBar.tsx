"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SearchBar() {
  const router = useRouter()
  
  // State to hold search criteria
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    bedrooms: '',
    bathrooms: '',
    location: ''
  })

  const selectBase = "bg-white text-gray-500 py-5 px-8 outline-none border-r border-gray-100 last:border-0 text-sm appearance-none hover:text-black transition-colors font-medium cursor-pointer";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Construct query parameters
    const params = new URLSearchParams()
    if (filters.status) params.set('status', filters.status)
    if (filters.bedrooms) params.set('bedrooms', filters.bedrooms)
    if (filters.bathrooms) params.set('bathrooms', filters.bathrooms)
    if (filters.location) params.set('location', filters.location)
    
    // Redirect to the listings page with the query
    router.push(`/properties?${params.toString()}`)
  }

  return (
    <div className="w-full max-w-6xl shadow-2xl">
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row bg-white rounded-sm overflow-hidden">
        <div className="flex-1 grid grid-cols-2 md:grid-cols-5">
          
          {/* Status Option */}
          <select 
            className={selectBase}
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
          >
            <option value="">Status</option>
            <option value="FOR_SALE">For Sale</option>
            <option value="FOR_RENT">For Rent</option>
          </select>

          {/* Type Option (Placeholder for logic) */}
          <select className={selectBase}>
            <option value="">All Types</option>
            <option value="apartment">Apartment</option>
            <option value="villa">Villa</option>
            <option value="office">Office</option>
          </select>

          {/* Bedrooms Option */}
          <select 
            className={selectBase}
            value={filters.bedrooms}
            onChange={(e) => setFilters({...filters, bedrooms: e.target.value})}
          >
            <option value="">Bedrooms</option>
            {[1, 2, 3, 4, 5, '50', '56'].map(num => (
              <option key={num} value={num}>{num}+ Beds</option>
            ))}
          </select>

          {/* Bathrooms Option */}
          <select 
            className={selectBase}
            value={filters.bathrooms}
            onChange={(e) => setFilters({...filters, bathrooms: e.target.value})}
          >
            <option value="">Bathrooms</option>
            {[1, 2, 3, '20', '50'].map(num => (
              <option key={num} value={num}>{num}+ Baths</option>
            ))}
          </select>

          {/* Location Input */}
          <input 
            className="bg-white py-5 px-8 outline-none text-sm border-r border-gray-100 focus:placeholder-transparent" 
            placeholder="Location (e.g. Kisii)"
            value={filters.location}
            onChange={(e) => setFilters({...filters, location: e.target.value})}
          />
        </div>

        <button 
          type="submit" 
          className="bg-[#E91E63] text-white font-bold px-16 py-5 uppercase tracking-[0.2em] text-[11px] hover:bg-[#D81B60] transition-all"
        >
          Search
        </button>
      </form>
    </div>
  )
}