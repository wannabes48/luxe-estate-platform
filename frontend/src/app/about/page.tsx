import NavBar from "@/components/NavBar";

export default function AboutPage() {
  return (
    <main className="bg-white min-h-screen">
      <NavBar />
      <section className="pt-56 pb-32 px-6">
        <div className="max-w-4xl mx-auto">
          <span className="text-accent tracking-[0.5em] text-[10px] uppercase font-bold mb-12 block">Our Philosophy</span>
          <h1 className="font-serif text-6xl md:text-8xl mb-16 leading-[0.9]">Curation as <br/><span className="italic font-light">Architecture.</span></h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 font-sans text-stone-500 text-lg leading-relaxed">
            <p>At LUXE, we believe that luxury is not just a price point, but a standard of architectural integrity. We curate homes that respect their environment and challenge traditional aesthetics.</p>
            <p>Our presence in Nairobi and Kisii allows us to bridge the gap between metropolitan modernity and the raw beauty of the Kenyan landscape.</p>
          </div>
        </div>
      </section>
    </main>
  );
}