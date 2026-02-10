/* src/app/terms/page.tsx */
import ReturnNavBar from "@/components/ReturnNavBar"; // New Import
import Footer from "@/components/Footer";

export default function TermsPage() {
  return (
    <main className="bg-[#FCFAFA] min-h-screen">
      <ReturnNavBar />
      
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-80px)]">
        
        {/* Left Side: Content Column */}
        <section className="p-8 md:p-24 bg-white overflow-y-auto">
          <div className="max-w-md mx-auto lg:mx-0"> {/* Constrains text width */}
            <header className="mb-16">
              <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#E91E63] font-bold mb-4">
                Protocol // Feb 2026
              </p>
              <h1 className="font-serif text-5xl text-[#0D0D0D] leading-tight">Terms of <br/>Service</h1>
            </header>

            <article className="space-y-12 text-stone-600 text-sm leading-relaxed">
              <section className="group">
                <h2 className="font-serif text-xl text-black mb-3 group-hover:italic transition-all">01. Scope of Service</h2>
                <p>
                  Luxe Estate provides a curated digital marketplace for premium real estate, facilitating connections between discerning buyers and vetted owners.
                </p>
              </section>

              <section className="group">
                <h2 className="font-serif text-xl text-black mb-3 group-hover:italic transition-all">02. Representation</h2>
                <p>
                  While we prioritize architectural accuracy in our cinematography, all specifications must be independently verified via formal survey.
                </p>
              </section>

              <section className="group">
                <h2 className="font-serif text-xl text-black mb-3 group-hover:italic transition-all">03. Discretion</h2>
                <p>
                  High-value transactions often require NDAs. We manage all personal data with the utmost professional discretion.
                </p>
              </section>

              <div className="pt-10">
                <p className="text-[9px] uppercase tracking-widest text-stone-400">
                  By using this platform, you agree to our digital conduct protocols.
                </p>
              </div>
            </article>
          </div>
        </section>

        {/* Right Side: Architectural Image */}
        <section className="relative hidden lg:flex items-center justify-center overflow-hidden bg-stone-900">
          <div 
            className="absolute inset-0 z-0 opacity-60 bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070')" }}
          />
          <div className="relative z-10 p-12 border border-white/10 backdrop-blur-md bg-black/20 text-center max-w-xs">
            <p className="text-white font-serif text-2xl italic">"Integrity in every square foot."</p>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}