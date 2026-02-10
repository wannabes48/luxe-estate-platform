/* src/app/contact/page.tsx */
import ContactForm from "@/components/property/ContactForm";
import ReturnNavBar from "@/components/ReturnNavBar"; // New Import

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#FCFAFA]">
      <ReturnNavBar />
      
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-80px)]">
        
        {/* Left Side: Atmospheric Glassy Content */}
        <section className="relative hidden lg:flex items-center justify-center p-20 overflow-hidden">
          {/* Background Image - Use a high-quality architectural shot */}
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop')" }}
          />
          
          {/* Glass Overlay */}
          <div className="relative z-10 w-full max-w-md backdrop-blur-md bg-white/10 border border-white/20 p-12 shadow-2xl rounded-sm">
            <p className="text-[10px] uppercase tracking-[0.5em] text-white/70 mb-8">Connect</p>
            
            <h1 className="font-serif text-5xl text-white mb-6 leading-tight">
              Reach out for private viewings or architectural consultations.
            </h1>

            <div className="space-y-12 mt-16">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/50 mb-2">Nairobi HQ</p>
                <p className="text-white text-lg font-light italic">Westlands, NBO</p>
              </div>
              <div className="mt-12 pt-12 border-t border-white/10 flex flex-wrap gap-8">
                {/* Email */}
                    <a href="mailto:concierge@luxeestate.com" className="group flex items-center gap-3 text-white/70 hover:text-[#E91E63] transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform">
                            <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                        </svg>
                        <span className="text-[10px] uppercase tracking-[0.2em]">Email</span>
                    </a>

                {/* Instagram */}
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 text-white/70 hover:text-[#E91E63] transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform">
                            <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                        </svg>
                        <span className="text-[10px] uppercase tracking-[0.2em]">Instagram</span>
                    </a>

                {/* LinkedIn */}
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 text-white/70 hover:text-[#E91E63] transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform">
                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>
                        </svg>
                        <span className="text-[10px] uppercase tracking-[0.2em]">LinkedIn</span>
                    </a>
                </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/50 mb-2">Coordinates</p>
                <p className="text-white font-mono text-xs tracking-tighter">
                  1.2921° S, 36.8219° E
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Right Side: The Form */}
        <section className="flex items-center justify-center p-6 md:p-20 bg-white">
          <div className="w-full max-w-lg">
            <span className="text-[10px] uppercase tracking-[0.4em] text-stone-400 mb-4 block">Inquiry Portal</span>
            <h2 className="font-serif text-4xl mb-12">Send a Message</h2>
            <ContactForm />
          </div>
        </section>
        
      </div>
    </main>
  );
}