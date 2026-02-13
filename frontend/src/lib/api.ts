/* src/lib/api.ts */

// Get base URL - use NEXT_PUBLIC_API_URL for deployment, fallback to localhost for development
const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
};

export async function getPropertyBySlug(slug: string) {
  if (!slug) throw new Error("No slug provided");

  const baseUrl = getBaseUrl();

  console.log("FETCHING SLUG:", slug);
  
  try {
    const res = await fetch(`${baseUrl}/api/properties/${slug}/`, { 
      cache: 'no-store', // Ensure we get fresh data for each property detail view
      credentials: 'include' // Include cookies for CSRF protection if needed
  });

  if (!res.ok) return null;
  return await res.json();
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}

export async function getSimilarProperties(propertyId: string) {
    // If propertyId is missing, don't even try the fetch
    if (!propertyId) {
        console.error("getSimilarProperties: No propertyId provided");
    return [];
    }

    const baseUrl = getBaseUrl();

    try {
        const res = await fetch(`${baseUrl}/api/properties/${propertyId}/similar/`, { next: { revalidate: 3600 } 
    });

    if (!res.ok) {
      console.warn(`Similar API failed with status: ${res.status}`);
       return [] // Return empty array if call fails to prevent UI crash
    }
    return await res.json();
    } catch (error) {
    // This catches "fetch failed" (network down, refuse connection, etc.)
    console.error("Network error fetching similar properties:", error);
    return []; 
  }
}

export async function getFeaturedSlugs(limit = 12) {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/properties/?is_featured=true&limit=${limit}`, { next: { revalidate: 3600 } })
  if (!res.ok) return []
  const data = await res.json()
  return data.map((p: any) => ({ slug: p.slug }))
}

export async function getNextPropertySlug(slug: string) {
  const baseUrl = getBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/api/properties/${slug}/next/`, {
      next: { revalidate: 60 } 
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.slug;
  } catch (error) {
    return null;
  }
}

export async function getPreviousPropertySlug(slug: string) {
  const baseUrl = getBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/api/properties/${slug}/previous/`, {
      next: { revalidate: 60 } 
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.slug;
  } catch (error) {
    return null;
  }
}

export async function getProperties(filters: any = {}) {
    const baseUrl = getBaseUrl();

    const queryParams = new URLSearchParams(filters).toString();
    const url = `${baseUrl}/api/properties/${queryParams ? `?${queryParams}` : ''}`;
    
    const res = await fetch(url, { 
    cache: 'no-store',
    credentials: 'include' // This forces Next.js to fetch fresh data every time
  });

  if (!res.ok) {
    console.error(`Fetch failed! Status: ${res.status} (${res.statusText})`);
    
    // Return empty array instead of crashing the whole site
    return [];
  }

  return res.json();
}

export async function getAdjacentProperties(slug: string) {
  const baseUrl = getBaseUrl();
  
  // Fetch both in parallel for speed
  const [nextRes, prevRes] = await Promise.all([
    fetch(`${baseUrl}/api/properties/${slug}/next/`, { cache: 'no-store' }),
    fetch(`${baseUrl}/api/properties/${slug}/previous/`, { cache: 'no-store' })
  ]);

  const nextData = nextRes.ok ? await nextRes.json() : null;
  const prevData = prevRes.ok ? await prevRes.json() : null;

  return {
    nextSlug: nextData?.slug || null,
    prevSlug: prevData?.slug || null
  };
}

export async function getAgents() {
  const baseUrl = getBaseUrl();
  
  try {
    const res = await fetch(`${baseUrl}/api/agents/`, {
      cache: 'no-store', // Ensures fresh data if you add an agent in Django Admin
      credentials: 'include'
    });

    if (!res.ok){
      console.error(`Failed to fetch agents: ${res.status}`);
       return [];
    }   

    const data = await res.json();

    if (data && data.results && Array.isArray(data.results)) {
      return data.results; 
    }

    if (Array.isArray(data)) {
      return data;
    }

    // 3. Fallback if the data format is unexpected
    return [];

    } catch (error) {
    console.error("Error fetching agents:", error);
    return [];
  }
}

export async function sendInquiry(inquiryData: {
  property_id: string | number;
  name: string;
  email: string;
  phone?: string;
  message: string;
}) {
  const baseUrl = getBaseUrl();

  try {
    const res = await fetch(`${baseUrl}/api/inquiries/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inquiryData),
      // Important for production: avoids caching POST requests
      cache: 'no-store',
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || `Server responded with ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Inquiry submission error:", error);
    // Rethrow to allow the UI to show the specific "Server Connection Error"
    throw error;
  }
}