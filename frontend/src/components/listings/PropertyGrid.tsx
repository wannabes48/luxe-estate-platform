import React from 'react'
import { PropertyCard } from '@/components/PropertyCard'

// Define a type for the properties to improve DX
interface Property {
  id: string | number;
  title: string;
  // ... add other fields as needed
}

async function getProperties(filters: any) {
  // Use a single source for the URL. 
  // For Server Components, process.env.API_URL is preferred.
  const baseUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
  
  // Clean filters: Remove empty strings, nulls, or undefined values
  const cleanFilters = Object.entries(filters).reduce((acc: any, [k, v]) => {
    if (v !== undefined && v !== null && v !== '') acc[k] = String(v);
    return acc;
  }, {});

  const query = new URLSearchParams(cleanFilters).toString();

  try {
    const res = await fetch(`${baseUrl}/api/properties/?${query}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return [];
    const data = await res.json();
    // Handle both paginated and non-paginated DRF responses
    return data.results || data; 
  } catch (error) {
    console.error("Database connection failed:", error);
    return [];
  }
}

export default async function PropertyGrid({ filters }: { filters: any }) {
  const data = await getProperties(filters);
  const properties = Array.isArray(data) ? data : (data?.results || []);

  if (properties.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="font-serif text-2xl text-stone-400">No properties found in this collection.</p>
      </div>
    );
  }

  return (
    <div
      className={
        filters.view === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12' // Editorial grid spacing
          : 'flex flex-col gap-24' // Editorial list spacing
      }
    >
      {properties.map((property: any) => (
        <PropertyCard 
          key={property.id} 
          property={property}
        />
      ))}
    </div>
  )
}