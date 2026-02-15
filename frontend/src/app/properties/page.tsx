import { Suspense } from 'react';
import { getProperties } from "@/lib/api";
import PropertyGrid from '@/components/listings/PropertyGrid';
import FilterBar from '@/components/listings/FilterBar';
import Footer from "@/components/Footer";
import GridSkeleton from '@/components/ui/GridSkeleton';
import ReturnNavBar from "@/components/ReturnNavBar";

export default async function ListingsPage({ searchParams
}: {
  searchParams: Promise<{
    location?: string;
    view?: string;
    min_price?: string;
    max_price?: string;
    beds?: string
  }>
}) {
  // 1. Await the searchParams Promise (Crucial for Next.js 15)
  const resolvedParams = await searchParams;

  // 2. Map the resolved params to your filters object
  const filters = {
    price_min: resolvedParams.min_price,
    price_max: resolvedParams.max_price,
    location: resolvedParams.location,
    bedrooms: resolvedParams.beds,
    view: (resolvedParams.view as 'grid' | 'list') || 'grid',
  };

  const properties = await getProperties(filters);

  console.log("DEBUG: Filters applied:", filters);
  console.log("DEBUG: Property count:", properties?.length);
  if (properties?.length > 0) {
    properties.forEach((p: any) => {
      console.log(`Prop: ${p.title} | Loc: ${p.location?.name} | Img:`, JSON.stringify(p.images));
      console.log(`Image URL candidate:`, p.images?.[0]?.url || p.images?.[0]?.image_path || p.property_images?.[0]?.url);
    });
  }

  return (
    <div className="bg-white min-h-screen">
      <ReturnNavBar />
      <div className="pt-40 pb-20 px-6 md:px-12 max-w-[1440px] mx-auto">
        <header className="mb-16 border-b border-stone-100 pb-12">
          <span className="text-accent tracking-[0.4em] text-[10px] uppercase font-bold mb-4 block">
            The Collection
          </span>
          <h1 className="font-serif text-6xl text-foreground mb-8">
            Architectural Inventory
          </h1>
          <p className="text-stone-500 text-lg max-w-2xl">
            Explore our curated selection of modernist homes.
          </p>
        </header>

        {/* Passing filters here allows the bar to show active states */}
        <FilterBar initialFilters={filters} />

        {/* Using the stringified params as a key forces Suspense to trigger on change */}
        <Suspense key={JSON.stringify(resolvedParams)} fallback={<GridSkeleton />}>
          <PropertyGrid
            properties={properties}
            view={(resolvedParams.view as 'grid' | 'list') || 'grid'}
            filters={filters} />
        </Suspense>
      </div>
      <Footer />
    </div>
  );
}