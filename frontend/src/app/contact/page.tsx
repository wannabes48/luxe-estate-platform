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
                    <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <span className="text-[10px] uppercase tracking-[0.2em]">Email</span>
                </a>

                {/* Instagram */}
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 text-white/70 hover:text-[#E91E63] transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                  <span className="text-[10px] uppercase tracking-[0.2em]">Instagram</span>
                </a>

                {/* LinkedIn */}
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 text-white/70 hover:text-[#E91E63] transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" />
                  </svg>
                  <span className="text-[10px] uppercase tracking-[0.2em]">LinkedIn</span>
                </a>
                {/* WhatsApp */}
                <a href="https://wa.me/254712345678" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 text-white/70 hover:text-[#E91E63] transition-all">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="group-hover:scale-110 transition-transform">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span className="text-[10px] uppercase tracking-[0.2em]">WhatsApp</span>
                </a>
              </div>

              {/* List With Us CTA */}
              <div className="bg-white/5 border border-white/10 p-8 mt-12 backdrop-blur-sm">
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#E91E63] mb-4 font-bold">For Agents & Developers</p>
                <h3 className="text-white font-serif text-2xl mb-4">List With Us</h3>
                <p className="text-white/70 text-sm leading-relaxed mb-6 font-light">
                  Join our curated network of premium agents. Reach high-net-worth clients globally.
                </p>
                <a
                  href="mailto:partnerships@luxeestate.com?subject=Agent Partnership Inquiry"
                  className="inline-block border border-white/30 text-white text-[10px] uppercase tracking-widest px-6 py-3 hover:bg-white hover:text-black transition-all"
                >
                  Apply for Partnership
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