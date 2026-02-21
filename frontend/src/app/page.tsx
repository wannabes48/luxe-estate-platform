import Hero from "@/components/sections/Hero";
import FeaturedCarousel from "@/components/sections/FeaturedCarousel";
import EditorialStory from "@/components/sections/EditorialStory";
import CollectionPreview from "@/components/sections/CollectionPreview";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/property/ContactForm"; 
import { getProperties } from "@/lib/api";

export default async function Home() {
  const properties = await getProperties();
  return (
    <main className="bg-white min-h-screen">
      <NavBar />
      <Hero />
      <EditorialStory
        title="Modernism Defined"
        subtitle="A curated selection of architectural masterpieces in Nairobi and Kisii, designed for those who appreciate the intersection of light, space, and form."
        image="/images/editorial-1.jpg"
      />
      <section className="py-24 bg-stone-50">
        <div className="container mx-auto px-6 mb-12 flex justify-between items-end">
          <div>
            <span className="text-accent tracking-[0.4em] text-[10px] uppercase font-bold mb-4 block">Curated</span>
            <h2 className="text-5xl font-serif">Featured Estates</h2>
          </div>
        </div>
        <FeaturedCarousel />
      </section>
      <CollectionPreview />

      <section className="py-32 px-6 bg-stone-50 border-t border-stone-100">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24">
          <div>
            <span className="text-accent tracking-[0.5em] text-[10px] uppercase font-bold mb-8 block">Inquiries</span>
            <h2 className="font-serif text-6xl mb-8">Start the <br/><span className="italic font-light">Conversation.</span></h2>
            <p className="text-stone-500 text-lg max-w-sm mb-12">Reach out for private viewings or architectural consultations in Nairobi and Kisii.</p>
            
            <div className="flex gap-12 text-stone-400 text-[10px] uppercase tracking-[0.3em]">
              <div><p className="mb-2">Kisii HQ</p><p className="text-black">Kisii Town</p></div>
              <div><p className="mb-2">Coordinates</p><p className="text-black">1.2921° S, 36.8219° E</p></div>
            </div>
          </div>
          
          <div className="bg-white p-12 shadow-2xl border border-stone-100">
            <ContactForm />
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}