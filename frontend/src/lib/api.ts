import { supabase } from './supabaseClient';
import { createClient } from '@supabase/supabase-js';

/**
 * 1. Fetch a single property by its unique slug
 * We use ilike for case-insensitive matching.
 */
export async function getPropertyBySlug(slug: string) {
  if (!slug) throw new Error("No slug provided");

  const { data, error } = await supabase
    .from('properties')
    .select(`
      *,
      location:locations(*),
      agent:agents(*),
      images:property_images(*)
    `)
    .ilike('slug', slug)
    .maybeSingle();

  if (error) {
    console.error("Supabase error fetching property:", error.message);
    return null;
  }
  return data;
}

/**
 * 2. Fetch Similar Properties
 * Replicates the logic of your old Django /similar/ endpoint.
 * It finds properties in the same location but excludes the current one.
 */
export async function getSimilarProperties(propertyId: string) {
  if (!propertyId) return [];

  // Get the location_id of the current property first
  const { data: currentProp } = await supabase
    .from('properties')
    .select('location_id')
    .eq('id', propertyId)
    .maybeSingle();

  if (!currentProp?.location_id) return [];

  const { data, error } = await supabase
    .from('properties')
    .select(`
      *,
      location:locations(name, city),
      images:property_images(*)
    `)
    .eq('location_id', currentProp.location_id)
    .neq('id', propertyId) // Don't show the current property
    .limit(4);

  if (error) {
    console.error("Error fetching similar properties:", error.message);
    return [];
  }
  return data;
}

/**
 * 3. Fetch Featured Slugs
 * Used for static site generation paths.
 */
export async function getFeaturedSlugs(limit = 12) {
  const { data, error } = await supabase
    .from('properties')
    .select('slug')
    .eq('is_featured', true)
    .limit(limit);

  if (error) return [];
  return data.map((p: any) => ({ slug: p.slug }));
}

/**
 * 4. Navigation: Get Next Property Slug
 * Replicates /api/properties/${slug}/next/
 */
export async function getNextPropertySlug(slug: string) {
  const { data: current } = await supabase
    .from('properties')
    .select('created_at')
    .ilike('slug', slug)
    .maybeSingle();

  if (!current) return null;

  const { data: next } = await supabase
    .from('properties')
    .select('slug')
    .gt('created_at', current.created_at)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  return next?.slug || null;
}

/**
 * 5. Navigation: Get Previous Property Slug
 * Replicates /api/properties/${slug}/previous/
 */
export async function getPreviousPropertySlug(slug: string) {
  const { data: current } = await supabase
    .from('properties')
    .select('created_at')
    .ilike('slug', slug)
    .maybeSingle();

  if (!current) return null;

  const { data: prev } = await supabase
    .from('properties')
    .select('slug')
    .lt('created_at', current.created_at)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  return prev?.slug || null;
}

/**
 * 6. Fetch All Properties with Filters
 */
export async function getProperties(filters: any = {}) {
  try {
    // Use single-line formatting to ensure compatibility
    let selectQuery = '*, location:locations(name, city), images:property_images(*)';

    if (filters.location) {
      // Use !inner for filtering by related location
      selectQuery = '*, location:locations!inner(name, city), images:property_images(*)';
    }

    let query = supabase.from('properties').select(selectQuery);

    if (filters.is_featured) query = query.eq('is_featured', true);
    if (filters.status) query = query.eq('status', filters.status);
    if (filters.price_min) query = query.gte('price', filters.price_min);
    if (filters.price_max) query = query.lte('price', filters.price_max);

    if (filters.location) {
      // Filter by either city OR name (e.g. Nairobi matches city:Nairobi, Nakuru matches name:Nakuru)
      // using raw Supabase syntax for foreign table filtering is tricky, simple path is usually .ilike
      // Since we have !inner, we can rely on that table's columns.
      // Try searching both columns.
      query = query.or(`name.ilike.%${filters.location}%,city.ilike.%${filters.location}%`, { foreignTable: 'locations' });
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error("Supabase Query Error:", JSON.stringify(error, null, 2));
      return [];
    }
    return data || [];
  } catch (err: any) {
    console.error("Network/Connection Error in getProperties:", err.message || err);
    return [];
  }
}

/**
 * 7. Combined Navigation
 * Efficiency helper to fetch both next and prev in parallel.
 */
export async function getAdjacentProperties(slug: string) {
  // Fetch all properties (lightweight: slug, title, created_at) to determine order
  const { data, error } = await supabase
    .from('properties')
    .select('slug, title, created_at')
    .order('created_at', { ascending: false });

  if (error || !data) return { nextProp: null, prevProp: null };

  const currentIndex = data.findIndex((p: any) => p.slug === slug);

  if (currentIndex === -1) return { nextProp: null, prevProp: null };

  // "Next" in the array (index + 1) is actually the *older* property (since we sort desc)
  // "Prev" in the array (index - 1) is the *newer* property
  // But usually "Next Project" implies moving *forward* in time or simply "next one in the list".
  // Let's stick to the visual list order:
  // List: [Newest (0), ..., Current (i), Older (i+1), ...]
  // Next (visual right arrow) -> Older (i+1)
  // Prev (visual left arrow) -> Newer (i-1)

  const prevProp = currentIndex > 0 ? data[currentIndex - 1] : null;
  const nextProp = currentIndex < data.length - 1 ? data[currentIndex + 1] : null;

  return { nextProp, prevProp };
}

/**
 * 8. Fetch Agents
 */
export async function getAgents() {
  try {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error("Supabase Error:", error.message);
      return [];
    };

    return data || [];
  } catch (error) {
    console.error("Build-time fetch failed for agents:", error);
    // Return an empty array so the build can at least finish
    return [];
  }
}

/**
 * 9. Submit Inquiry
 */
export async function sendInquiry(inquiryData: any) {
  const { data, error } = await supabase
    .from('inquiries')
    .insert([inquiryData])
    .select()
    .single();

  if (error) {
    console.error("Database Log Failure:", error.message);
    throw new Error(error.message);
  }

  console.log(`✅ Inquiry successfully saved for: ${inquiryData.full_name}`);

  // Trigger email notification (fire-and-forget)
  fetch('/api/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...inquiryData,
      property_name: "Luxury Listing Inquiry" // You can enhance this by fetching the property name if property_id is provided
    })
  }).catch(err => console.error("Email notification failed:", err));

  return data;
}