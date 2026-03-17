import ReturnNavBar from "@/components/ReturnNavBar";
import Footer from "@/components/Footer";

export default function TermsPage() {
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
              <h1 className="font-serif text-5xl text-[#0D0D0D] leading-tight">Terms of <br/>Service</h1>
            </header>

            <article className="space-y-12 text-stone-600 text-sm leading-relaxed">
              <section className="group">
                <h2 className="font-serif text-xl text-black mb-3 group-hover:italic transition-all">01. Scope of Service</h2>
                <p>
                  Luxe Estate provides a curated digital marketplace for premium real estate, facilitating traditional whole-property acquisitions as well as fractional equity tokenization for verified investors.
                </p>
              </section>

              <section className="group">
                <h2 className="font-serif text-xl text-black mb-3 group-hover:italic transition-all">02. KYC & AML Compliance</h2>
                <p>
                  To participate in primary or secondary market transactions, all users must successfully pass our Know Your Customer (KYC) verification, which includes submitting a valid Kenyan National ID and an active Safaricom M-Pesa phone number. Luxe Estate reserves the right to suspend accounts that fail to meet Anti-Money Laundering (AML) standards or provide fraudulent information.
                </p>
              </section>

              <section className="group">
                <h2 className="font-serif text-xl text-black mb-3 group-hover:italic transition-all">03. Blockchain Irrevocability</h2>
                <p>
                  Property shares on Luxe Estate are represented as ERC-20 cryptographic tokens on the Polygon blockchain. Once a transaction (whether a primary mint or a peer-to-peer sale) is executed and confirmed on-chain, it is mathematically immutable and irreversible. Luxe Estate cannot reverse accidental secondary market trades or recover tokens sent to unsupported external wallets.
                </p>
              </section>

              <section className="group">
                <h2 className="font-serif text-xl text-black mb-3 group-hover:italic transition-all">04. M-Pesa Dependency</h2>
                <p>
                  All fiat transactions, including yield disbursements and STK Push purchases, rely on the Safaricom Daraja API infrastructure. Luxe Estate is not liable for delays, failed STK pushes, or delayed yield disbursements caused by Safaricom network outages, API downtime, or user account limitations.
                </p>
              </section>

              <section className="group">
                <h2 className="font-serif text-xl text-black mb-3 group-hover:italic transition-all">05. Secondary Market Trading</h2>
                <p>
                  When utilizing the Peer-to-Peer Secondary Market, buyers agree to purchase shares in the exact block size defined by the listing seller. Partial block purchases are not currently supported. Luxe Estate acts solely as a technological facilitator and does not guarantee the liquidity or resale value of any fractional tokens.
                </p>
              </section>

              <div className="pt-10">
                <p className="text-[9px] uppercase tracking-widest text-stone-400">
                  By accessing our marketplace, connecting a Web3 wallet, or initiating an M-Pesa transaction, you legally agree to these protocols.
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
          <div className="relative z-10 p-12 border border-white/10 backdrop-blur-md bg-black/20 text-center max-w-xs shadow-2xl">
            <p className="text-white font-serif text-2xl italic">"Integrity in every square foot, and every digital block."</p>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}