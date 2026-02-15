/* src/app/properties/[slug]/page.tsx */
import {
  getPropertyBySlug,
  getSimilarProperties,
  getNextPropertySlug,
  getPreviousPropertySlug,
  getAdjacentProperties
} from "@/lib/api";
import Gallery from "@/components/property/Gallery";
import InquiryForm from "@/components/property/InquiryForm";
import PropertySpecs from "@/components/property/PropertySpecs";
import SimilarListings from "@/components/property/SimilarListings";
import PropertyReturnNavBar from "@/components/PropertyReturnNavBar";
import NextPropertyNav from "@/components/NextPropertyNav";
import PropertyNavigation from "@/components/property/PropertyNavigation";
import Footer from "@/components/Footer";
import PropertyMap from "@/components/PropertyMap";
import MapButton from "@/components/MapButton";
import { Metadata } from 'next';
import AgentAvatar from "@/components/AgentAvatar";

export default async function PropertyDetail({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;

  if (!slug) return <div className="p-20 text-center">Invalid Property Path</div>;

  // 1. Fetch main property
  const property = await getPropertyBySlug(slug);

  if (!property) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <PropertyReturnNavBar />
        <h1 className="font-serif text-2xl">Property not found</h1>
      </main>
    );
  }

  const similarProperties = await getSimilarProperties(property.slug);

  // 2. Fetch associated data in parallel using the correct identifiers (UUIDs)
  const [similar] = await Promise.all([
    getSimilarProperties(property.slug),
    getNextPropertySlug(property.slug),
    getPreviousPropertySlug(property.slug)
  ]);

  const { nextProp, prevProp } = await getAdjacentProperties(property.slug);

  const agent = property.agent;
  const coverImage = property.images?.find((img: any) => img.is_cover) || property.images?.[0];

  return (
    <main className="bg-[#FCFAFA] min-h-screen pb-24 relative">
      <PropertyReturnNavBar />

      {/* Visual Layer: Modern Horizontal Scroll Gallery 
        We place this here to ensure it spans correctly across the top of the narrative.
      */}
      <section className="w-full bg-white border-b border-stone-100">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-4 py-10 px-6 md:px-12">
            {property.images && property.images.length > 0 ? (
              property.images.map((img: any) => (
                <div
                  key={img.id}
                  className="flex-shrink-0 w-[85vw] md:w-[600px] aspect-[4/5] snap-center"
                >
                  <img
                    src={img.image_url}
                    alt={img.alt_text || property.title}
                    className="w-full h-full object-cover rounded-sm shadow-xl"
                    loading="lazy"
                  />
                </div>
              ))
            ) : (
              <div className="w-full h-[400px] bg-stone-100 flex items-center justify-center text-stone-400 uppercase tracking-widest text-xs">
                No Gallery Images Available
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-20 grid grid-cols-1 lg:grid-cols-12 gap-20">
        <div className="lg:col-span-8">
          <header className="mb-16 border-b border-stone-100 pb-12">
            <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-8">
              <div>
                <p className="text-[#E91E63] tracking-[0.4em] text-[10px] uppercase font-bold mb-4">
                  {property.status?.replace('_', ' ') || "EXCLUSIVE"}
                </p>
                <h1 className="font-serif text-5xl md:text-7xl text-[#0D0D0D] leading-tight">
                  {property.title}
                </h1>
              </div>
              <div className="md:text-right">
                <p className="text-stone-400 text-[10px] uppercase tracking-widest mb-2">Guide Price</p>
                <p className="font-sans text-3xl font-bold text-[#0D0D0D]">
                  Ksh {Number(property.price).toLocaleString()}
                </p>
              </div>
            </div>
            <p className="text-stone-500 tracking-widest uppercase text-xs">
              {property.location?.name} — {property.location?.city}
            </p>
          </header>

          <PropertySpecs specs={property} />

          <article className="prose prose-stone max-w-none mt-20">
            <h3 className="font-serif text-3xl text-[#0D0D0D] mb-8">The Narrative</h3>
            <p className="text-stone-600 text-lg leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </article>

          {/* Location & Agent Section */}
          <section className="my-20 border-t border-stone-100 pt-20">
            <div className="flex flex-col md:flex-row justify-between gap-12 mb-12">
              <div className="flex-1">
                <span className="text-[10px] uppercase tracking-[0.5em] text-stone-400 block mb-4">Location</span>
                <h3 className="text-3xl font-serif mb-2">{property.location?.name}</h3>
                <div className="flex items-center gap-4">
                  <span className="text-stone-500 text-sm">{property.location?.city}</span>
                  <MapButton address={`${property.location?.name}, ${property.location?.city}`} name={property.title} />
                </div>
              </div>

              {agent && (
                <div className="flex-1 bg-white p-6 border border-stone-100 shadow-sm flex items-start gap-4">
                  <AgentAvatar src={agent.image_url} name={agent.name} />
                  <div className="space-y-1">
                    <p className="text-[10px] text-stone-400 uppercase tracking-widest">Listing Agent</p>
                    <p className="font-serif text-xl text-luxury-charcoal">{agent.name}</p>
                    <p className="text-xs text-stone-500 pb-3">{agent.role}</p>
                    <div className="flex gap-4 pt-2 border-t border-stone-50">
                      <a href={`mailto:${agent.email}`} className="text-[9px] uppercase tracking-tighter border-b border-black font-bold">Email</a>
                      <a href={`https://wa.me/${agent.whatsapp_number}`} className="text-[9px] uppercase tracking-tighter border-b border-black font-bold">WhatsApp</a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <PropertyMap
              locationName={property.location?.name}
              city={property.location?.city}
            />
          </section>
        </div>

        {/* Sidebar: Inquiry System */}
        <aside className="lg:col-span-4">
          <div className="sticky top-32 p-10 bg-white border border-stone-100 shadow-2xl">
            <span className="text-[9px] uppercase tracking-[0.4em] text-stone-400 mb-6 block">Private Treaty</span>
            <h4 className="font-serif text-3xl mb-8">Request <br />A Viewing</h4>
            <InquiryForm propertyId={property.id} propertyName={property.title} />
          </div>
        </aside>
      </div>

      <SimilarListings properties={similarProperties} />
      <PropertyNavigation prevProp={prevProp} nextProp={nextProp} />
      <Footer />
    </main>
  );
}

// Metadata remains the same, ensuring it's at the bottom
export async function generateMetadata({ params }: { params: any }): Promise<Metadata> {
  const resolvedParams = await params;
  const property = await getPropertyBySlug(resolvedParams.slug);
  if (!property) return { title: "Property Not Found" };

  return {
    title: `${property.title} | Luxe Estate`,
    description: property.description.slice(0, 160),
    openGraph: {
      images: [property.images?.[0]?.image_url || ''],
    },
  };
}