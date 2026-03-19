import ReturnNavBar from "@/components/ReturnNavBar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="bg-[#FCFAFA] min-h-screen">
      <ReturnNavBar />

      {/* Hero Section */}
      <div className="pt-40 pb-20 px-6 lg:px-12 max-w-[1440px] mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-16 mb-16">
          
          <div className="max-w-4xl flex-1">
            <span className="text-[#E91E63] tracking-[0.5em] text-[10px] uppercase font-bold mb-8 block">Our Philosophy</span>
              <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl mb-12 text-[#0D0D0D] leading-[1.1]">
                Redefining <br/>
                <span className="italic font-light text-stone-500">Ownership.</span>
              </h1>
          </div>
          {/* Right Side: Glassmorphism Architectural Plan Image */}
          {/* Visually fills the blank space next to the heading on desktop */}
          <div className="relative group flex-shrink-0 w-full lg:w-auto flex justify-center lg:justify-end">
            {/* Pink glow effect behind the glass */}
            <div className="absolute -inset-4 bg-[#E91E63]/10 rounded-full blur-3xl opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>
      
            {/* The Glass Container */}
            <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 p-3 rounded-3xl shadow-2xl overflow-hidden aspect-[4/3] w-full max-w-md lg:max-w-sm transform lg:rotate-3 hover:rotate-0 transition-transform duration-500 ease-out">
              <img 
                src="https://www.mymodernhome.com/media/images/My_Modern_Home_Plan.2e16d0ba.fill-1920x1080.format-webp_ETkA43E.webp" 
                alt="Modernist architectural floor plan" 
                className="w-full h-full object-cover rounded-2xl opacity-80 mix-blend-luminosity group-hover:mix-blend-normal group-hover:opacity-100 transition-all duration-500"
              />
        
              {/* Subtle glass reflection overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/5 rounded-2xl"></div>
        
              {/* Minimalist Web3 Tokenized detail */}
              <div className="absolute bottom-6 left-6 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#E91E63] animate-pulse"></div>
                <span className="text-[9px] text-white/90 uppercase tracking-widest font-bold">LXE-NBO-001</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 font-sans text-stone-1000 text-base md:text-lg leading-relaxed">
          <p>
            At Luxe Estate, we believe that luxury is not just a price point, but a standard of architectural integrity. We curate homes that respect their environment and challenge traditional aesthetics across the Kenyan landscape.
          </p>
          <p>
            But curation was only the beginning. We have evolved into a Web3-integrated financial exchange, bridging the gap between physical real estate and digital liquidity. By fractionalizing premium assets, we make building a legacy accessible to the modern investor.
          </p>
        </div>
      </div>

      {/* Immersive Image Break */}
      <section className="px-6 lg:px-12 max-w-[1440px] mx-auto mb-32">
         <div className="w-full h-[50vh] md:h-[70vh] relative overflow-hidden bg-stone-900 shadow-2xl">
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-90 hover:scale-105 transition-transform duration-1000"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-10 left-10 md:bottom-16 md:left-16 text-white">
                <p className="text-[10px] uppercase tracking-[0.3em] font-bold mb-2 text-emerald-400">The Luxe Standard</p>
                <p className="font-serif text-2xl md:text-3xl max-w-md leading-relaxed">"Where uncompromising design meets immutable technology."</p>
            </div>
         </div>
      </section>

      {/* Core Pillars Section */}
      <section className="px-6 lg:px-12 pb-32 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          
          <div className="space-y-5 border-t border-stone-200 pt-8 group">
            <span className="font-mono text-[10px] text-stone-400">01</span>
            <h3 className="font-serif text-2xl text-[#0D0D0D] group-hover:text-[#E91E63] transition-colors">Architectural Curation</h3>
            <p className="text-sm text-stone-500 leading-relaxed">
              We strictly list modernist and contemporary properties. Every asset on our platform undergoes a rigorous aesthetic and structural review before it reaches the marketplace.
            </p>
          </div>

          <div className="space-y-5 border-t border-stone-200 pt-8 group">
            <span className="font-mono text-[10px] text-stone-400">02</span>
            <h3 className="font-serif text-2xl text-[#0D0D0D] group-hover:text-emerald-600 transition-colors">Web3 Tokenization</h3>
            <p className="text-sm text-stone-500 leading-relaxed">
              Physical equity is transformed into immutable ERC-20 smart contracts on the Polygon blockchain, ensuring secure, transparent, and irrefutable proof of ownership for every investor.
            </p>
          </div>

          <div className="space-y-5 border-t border-stone-200 pt-8 group">
            <span className="font-mono text-[10px] text-stone-400">03</span>
            <h3 className="font-serif text-2xl text-[#0D0D0D] group-hover:text-emerald-600 transition-colors">Liquid Equity</h3>
            <p className="text-sm text-stone-500 leading-relaxed">
              Powered by Safaricom M-Pesa APIs, our peer-to-peer secondary market allows investors to trade shares globally and receive automated monthly rental yields directly to their phones.
            </p>
          </div>

        </div>

        {/* Call to Action */}
        <div className="mt-24 text-center">
            <Link 
                href="/invest" 
                className="inline-block bg-[#0D0D0D] text-white px-10 py-5 text-xs uppercase tracking-widest hover:bg-emerald-600 transition-colors font-bold shadow-xl"
            >
                Explore the Portfolio
            </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}