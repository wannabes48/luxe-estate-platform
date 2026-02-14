/* src/app/agents/page.tsx */
import ReturnNavBar from "@/components/ReturnNavBar";
import { getAgents } from "@/lib/api"; // Ensure this import exists
import AgentAvatar from "@/components/AgentAvatar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default async function AgentsPage() {
  // Fetch real data from your Django backend
  const agents = await getAgents();

  if (!agents || agents.length === 0) {
    return (
      <div className="pt-32 px-10">
        <h1 className="text-2xl font-serif">Our Agents</h1>
        <p className="text-stone-500 mt-4">Currently updating our directory. Please check back soon.</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FCFAFA]">
      <ReturnNavBar />
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-80px)]">
        
        {/* Left Side: Agent List */}
        <section className="p-8 md:p-24 bg-white order-2 lg:order-1 overflow-y-auto">
          <div className="max-w-md mx-auto lg:mx-0">
            <span className="text-[10px] uppercase tracking-[0.5em] text-[#E91E63] font-bold mb-12 block">The Concierge Team</span>
            
            <div className="space-y-24">
              {agents.length > 0 ? (
                agents.map((agent: any, i: number) => (
                 <div key={agent.id || i} className="group">
                   <AgentAvatar src={agent.image_url} name={agent.name} />
                   <h2 className="font-serif text-5xl mb-3 text-[#0D0D0D] group-hover:italic transition-all">{agent.name}</h2>
                   <p className="text-[10px] uppercase tracking-[0.3em] text-stone-400 mb-8">{agent.role}</p>
                   
                   <p className="text-stone-600 text-sm leading-relaxed mb-10 max-w-sm italic">
                     {agent.bio || "Our objective is to match exceptional lifestyles with peerless architecture."}
                   </p>

                   {/* Contact Info Block */}
                   <div className="flex flex-col gap-5 border-t border-stone-100 pt-8">
                      <a href={`mailto:${agent.email}`} className="flex items-center gap-4 text-xs tracking-widest text-stone-500 hover:text-black transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                        {agent.email}
                      </a>
                      
                      <div className="flex flex-wrap gap-6 items-center">
                        <a href={`tel:${agent.phone}`} className="flex items-center gap-4 text-xs tracking-widest text-stone-500 hover:text-black transition-colors">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                          {agent.phone}
                        </a>

                        {/* WhatsApp Button */}
                        <a 
                          href={`https://wa.me/${agent.whatsapp_number || agent.phone.replace('+', '')}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-[#25D366]/10 text-[#128C7E] text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-[#25D366] hover:text-white transition-all duration-300"
                        >
                          <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.633 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                          WhatsApp
                        </a>
                      </div>
                      <div>
                      </div>
                   </div>

                   {/* Added Portfolio Section per Agent */}
                   <div className="mt-8">
                      <p className="text-[9px] uppercase tracking-widest text-stone-400 mb-3">Assigned Portfolio</p>
                      <ul className="space-y-1">
                        {agent.properties && agent.properties.length > 0 ? (
                          agent.properties.map((property: any, index: number) => (
                            <li 
                              key={property.id || `prop-${index}`} 
                              className="text-xs italic text-stone-500"
                            >
                              <Link 
                                href={`/properties/${property.slug}`} 
                                className="hover:underline hover:text-[#E91E63] transition-colors"
                              >
                                — {property.title || "Untitled Property"}
                              </Link>
                            </li>
                          ))
                        ) : (
                          <li className="text-[10px] uppercase tracking-tighter text-stone-300">
                            No active listings
                          </li>
                        )}
                      </ul>
                   </div>
                 </div>
               ))
              ) : (
                <p className="text-stone-400 italic">Our team is currently expanding. Please check back soon.</p>
              )}
            </div>
          </div>
        </section>

        {/* Right Side: Consistent Image Section */}
        <section className="relative hidden lg:flex items-center justify-center p-20 overflow-hidden bg-stone-900 order-1 lg:order-2">
            <div 
             className="absolute inset-0 z-0 opacity-40 bg-cover bg-center"
             style={{ backgroundImage: "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2073')" }}
           />
           <div className="relative z-10 backdrop-blur-xl bg-white/5 border border-white/10 p-12 max-w-sm text-center">
              <h1 className="font-serif text-5xl text-white mb-6 leading-tight">Expert Advisory</h1>
              <p className="text-[10px] uppercase tracking-[0.4em] text-white/60">Bespoke Real Estate Consulting</p>
           </div>
        </section>

      </div>
      <Footer />
    </main>
  );
}