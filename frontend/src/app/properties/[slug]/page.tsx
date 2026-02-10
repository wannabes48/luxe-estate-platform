/* src/app/properties/[slug]/page.tsx */
import { getPropertyBySlug, getSimilarProperties, getNextPropertySlug, getPreviousPropertySlug,getAdjacentProperties } from "@/lib/api";
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

export default async function PropertyDetail({
    params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;

  if (!slug) return <div className="p-20 text-center">Invalid Property Path</div>;

  // 1. Fetch the main property first
  const property = await getPropertyBySlug(slug);
  const agent = property.agent;

  // 2. IMMEDIATE check if property exists
  if (!property) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <PropertyReturnNavBar />
        <h1 className="font-serif text-2xl">Property not found</h1>
      </main>
    );
  }
  const similarProperties = await getSimilarProperties(property.slug);

  // 3. Fetch similar properties only after we confirm the main property exists
  // This prevents the "undefined" error you saw earlier
  const [similar] = await Promise.all([
    getSimilarProperties(property.slug),
    getNextPropertySlug(property.slug),
    getPreviousPropertySlug(property.slug)
  ]);

  const { nextSlug, prevSlug } = await getAdjacentProperties(property.slug);
  return (
    <main className="bg-[#FCFAFA] min-h-screen pb-24 relative">
      <PropertyReturnNavBar />
      
      <Gallery images={property.images} mainImageId={property.cloudinary_id} />

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-20 grid grid-cols-1 lg:grid-cols-12 gap-20">
        <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-4 py-10">
            {property.images.map((img: any) => (
                <div key={img.id} className="flex-shrink-0 w-[80vw] md:w-[600px] aspect-[4/5] snap-center">
                    <img 
                    src={img.image} 
                    alt={img.alt_text} 
                    className="w-full h-full object-cover rounded-sm shadow-lg" 
                    />
                </div>
            ))}
        </div>
        
        <div className="lg:col-span-8">
          <header className="mb-16 border-b border-stone-100 pb-12">
            <div className="flex justify-between items-end mb-8">
              <div>
                <p className="text-[#E91E63] tracking-[0.4em] text-[10px] uppercase font-bold mb-4">
                  {property.status?.replace('_', ' ') || "EXCLUSIVE"}
                </p>
                <h1 className="font-serif text-5xl md:text-7xl text-[#0D0D0D] leading-tight">
                  {property.title}
                </h1>
              </div>
              <div className="text-right">
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
          
          <div className="prose prose-stone max-w-none mt-20">
            <h3 className="font-serif text-3xl text-[#0D0D0D] mb-8">The Narrative</h3>
            <p className="text-stone-600 text-lg leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>

          
          
          <section className="my-20">
            <div className="flex items-center justify-between mb-8">
               <div>
                 <span className="text-[10px] uppercase tracking-[0.5em] text-stone-400">Location</span>
             </div>
             <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-serif">{property.title}</h1>
                <div className="flex items-center gap-4">
                  <span className="text-stone-500">{property.location.name}</span>
                  <MapButton address={property.location.name} name={property.title} />
                </div>
              </div>
             <p className="text-stone-500 font-mono text-xs italic">
               {property.latitude}, {property.longitude}
              </p>
             </div>

          <PropertyMap 
            locationName={property.location.name} 
            city={property.location.city} 
          />
          
          <section className="lg:col-span-4">
           <div className="sticky top-32 p-10 bg-white border border-stone-100 shadow-2xl">
             <span className="text-[9px] uppercase tracking-[0.4em] text-stone-400 mb-6 block">Private Treaty</span>
             <h4 className="font-serif text-3xl mb-8">Request <br/>A Viewing</h4>
             <InquiryForm propertyId={property.id} />
            </div>
         </section>
        
        </section>
        </div>
      </div>
      
      {agent && (
      <section className="mt-20 p-8 bg-stone-50 border border-stone-100 flex items-center gap-8">
        <img src={agent.image} className="w-20 h-20 object-cover grayscale" alt={agent.name} />
        <div>
          <p className="text-[10px] uppercase tracking-widest text-stone-400">Listing Agent</p>
          <h3 className="font-serif text-2xl">{agent.name}</h3>
          <p className="text-sm text-stone-500 mb-4">{agent.role}</p>
          <div className="flex gap-4">
             <a href={`mailto:${agent.email}`} className="text-[10px] uppercase border-b border-black">Email</a>
             <a href={`https://wa.me/${agent.whatsapp_number}`} className="text-[10px] uppercase border-b border-black">WhatsApp</a>
          </div>
        </div>
      </section>
      )}
      

      {/* 5. Similar Properties Section */}
      <SimilarListings properties={similarProperties} />
      {/* New Navigation Feature */}
      <PropertyNavigation prevSlug={prevSlug} nextSlug={nextSlug} />

      <NextPropertyNav nextSlug={nextSlug} prevSlug={prevSlug} />
     <Footer />   
    </main>
  );
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const resolvedParams = await params;

  if (!resolvedParams.slug) return { title: "Property Not Found" };
  
  const property = await getPropertyBySlug(resolvedParams.slug);

  return {
    title: `${property.title} | Exclusive Real Estate`,
    description: `Explore ${property.title} in ${property.location.name}. ${property.description.slice(0, 150)}...`,
    openGraph: {
      title: property.title,
      description: property.description,
      images: [{ url: property.images[0].image_url, width: 1200, height: 630 }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: property.title,
      images: [property.images[0].image_url],
    },
  };
}