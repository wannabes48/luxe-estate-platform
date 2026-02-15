import React from 'react'
import { PropertyCard } from '@/components/PropertyCard'
import { supabase } from '@/lib/supabaseClient' // Import your existing client

// Define the Props interface to accept either filters or direct properties
interface PropertyGridProps {
  filters: any;
  properties?: any[];
  view?: 'grid' | 'list';
}

async function fetchSupabaseProperties(filters: any) {
  try {
    // 1. Start the query on the 'properties' table
    let query = supabase
      .from('properties')
      .select(`
        *,
        location:locations(name, city),
        images:property_images(*)
      `);

    // 2. Apply Filters (Mapping your filter names to DB columns)
    if (filters.location && filters.location !== 'all') {
      query = query.ilike('location.name', `%${filters.location}%`);
    }
    if (filters.price_min) {
      query = query.gte('price', parseInt(filters.price_min));
    }
    if (filters.price_max) {
      query = query.lte('price', parseInt(filters.price_max));
    }
    if (filters.bedrooms && filters.bedrooms !== 'any') {
      query = query.gte('bedrooms', parseInt(filters.bedrooms));
    }

    // 3. Execute query
    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Supabase fetch failed:", error);
    return [];
  }
}

export default async function PropertyGrid({ filters={}, properties: initialProperties, view = 'grid' }: PropertyGridProps) {
  // Use properties passed from parent, or fetch them here using our new logic
  const properties = initialProperties || await fetchSupabaseProperties(filters);

  if (!properties || properties.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="font-serif text-2xl text-stone-400">No properties found in this collection.</p>
      </div>
    );
  }

  return (
    <div
      className={
        view === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12'
          : 'flex flex-col gap-24'
      }
    >
      {properties.map((property: any, index: number) => (
        <PropertyCard 
          key={property.id || `prop-${property.slug}-${index}`} 
          property={property}
        />
      ))}
    </div>
  )
}