import ReturnNavBar from "@/components/ReturnNavBar";
import Footer from "@/components/Footer";

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-[#FCFAFA] min-h-screen">
      <ReturnNavBar />
      
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-80px)]">
        
        {/* Left Side: Content Column */}
        <section className="p-8 md:p-24 bg-white overflow-y-auto">
          <div className="max-w-xl mx-auto lg:mx-0">
            <header className="mb-16">
              <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#E91E63] font-bold mb-4">
                Protocol // Updated Mar 2026
              </p>
              <h1 className="font-serif text-5xl text-[#0D0D0D] leading-tight">Privacy <br/>Policy</h1>
            </header>

            <article className="space-y-12 text-stone-600 text-sm leading-relaxed">
              <section className="group">
                <h2 className="font-serif text-xl text-black mb-3 group-hover:italic transition-all">01. Information We Collect</h2>
                <p>
                  To operate our fractional real estate marketplace, Luxe Estate collects specific personal and financial data. This includes your legal name, email address, Safaricom M-Pesa phone number, and Web3 wallet address (if connected).
                </p>
              </section>

              <section className="group">
                <h2 className="font-serif text-xl text-black mb-3 group-hover:italic transition-all">02. KYC & Biometric Data</h2>
                <p>
                  To comply with Kenyan Anti-Money Laundering (AML) regulations, we utilize third-party identity verification partners (such as Smile ID). During onboarding, you may be required to provide a scan of your National ID and a biometric facial scan. Luxe Estate does not store raw biometric data on our own servers; it is securely processed and maintained by our accredited compliance partners.
                </p>
              </section>

              <section className="group">
                <h2 className="font-serif text-xl text-black mb-3 group-hover:italic transition-all">03. Web3 & Public Blockchain Ledgers</h2>
                <p>
                  Because Luxe Estate utilizes the Polygon blockchain for fractional tokenization, you must understand that <strong>blockchain transactions are a matter of public record</strong>. If you connect a Web3 wallet (like MetaMask) to our platform, your wallet address, token balances, and transaction history will be permanently visible on public block explorers. While we do not publicly associate your legal name with your wallet address on our website, the on-chain data itself is public by nature.
                </p>
              </section>

              <section className="group">
                <h2 className="font-serif text-xl text-black mb-3 group-hover:italic transition-all">04. Payment Processing (M-Pesa)</h2>
                <p>
                  When you execute a purchase via STK Push or receive rental yields, your phone number and transaction metadata are shared with Safaricom PLC via their Daraja API. We store M-Pesa transaction receipt numbers in our database strictly for auditing, portfolio tracking, and dispute resolution purposes.
                </p>
              </section>

              <section className="group">
                <h2 className="font-serif text-xl text-black mb-3 group-hover:italic transition-all">05. Data Security & Storage</h2>
                <p>
                  Your profile data is encrypted at rest using enterprise-grade PostgreSQL security standards (via Supabase). We employ Row Level Security (RLS) to ensure that your financial portfolio and personal details are only accessible by your authenticated account.
                </p>
              </section>

              <div className="pt-10">
                <p className="text-[9px] uppercase tracking-widest text-stone-400">
                  For data deletion requests, please contact our compliance team directly via the Support portal. Note that on-chain Web3 data cannot be deleted.
                </p>
              </div>
            </article>
          </div>
        </section>

        {/* Right Side: Atmospheric Image */}
        <section className="relative hidden lg:flex items-center justify-center overflow-hidden bg-stone-900">
          <div 
            className="absolute inset-0 z-0 opacity-60 bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070')" }}
          />
          <div className="relative z-10 p-12 border border-white/10 backdrop-blur-md bg-black/20 text-center max-w-xs shadow-2xl">
            <p className="text-white font-serif text-2xl italic">"Absolute transparency on the chain. Total privacy off it."</p>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}