import ReturnNavBar from "@/components/ReturnNavBar";
import Footer from "@/components/Footer";

export default function RiskDisclosurePage() {
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
              <h1 className="font-serif text-5xl text-[#0D0D0D] leading-tight">Risk <br/>Disclosure</h1>
            </header>

            <article className="space-y-12 text-stone-600 text-sm leading-relaxed">
              <section className="group">
                <h2 className="font-serif text-xl text-black mb-3 group-hover:italic transition-all">01. Market & Liquidity Risks</h2>
                <p>
                  Real estate is an inherently illiquid asset class. While Luxe Estate provides a Secondary Market for peer-to-peer trading, <strong>we do not guarantee a buyer for your fractional shares</strong>. You may be unable to sell your tokens immediately, or you may be forced to sell them at a price lower than your initial investment. The value of real estate fluctuates based on macroeconomic conditions in Kenya.
                </p>
              </section>

              <section className="group">
                <h2 className="font-serif text-xl text-black mb-3 group-hover:italic transition-all">02. Yield & Operational Risks</h2>
                <p>
                  Any projected Return on Investment (ROI) or monthly rental yields displayed on our platform are forward-looking estimates, not guarantees. Actual disbursements via M-Pesa depend entirely on tenant occupancy, property maintenance costs, property management fees, and unforeseen structural repairs. If a property is vacant, yield disbursements may be suspended.
                </p>
              </section>

              <section className="group">
                <h2 className="font-serif text-xl text-black mb-3 group-hover:italic transition-all">03. Smart Contract Vulnerabilities</h2>
                <p>
                  Fractional shares are deployed as ERC-20 smart contracts on the Polygon blockchain. While Luxe Estate utilizes audited, industry-standard OpenZeppelin frameworks, interacting with blockchain technology carries inherent risks. Undiscovered software bugs, malicious hacks, or systemic failures of the Polygon network could result in the total loss of your digital assets.
                </p>
              </section>

              <section className="group">
                <h2 className="font-serif text-xl text-black mb-3 group-hover:italic transition-all">04. Self-Custody & Web3 Wallets</h2>
                <p>
                  If you choose to connect an external Web3 wallet (such as MetaMask) to manage your shares directly on-chain, you are solely responsible for the security of your private keys and seed phrases. Luxe Estate does not have access to your external wallet and <strong>cannot recover your tokens</strong> if you lose your credentials or fall victim to a phishing attack.
                </p>
              </section>

              <section className="group">
                <h2 className="font-serif text-xl text-black mb-3 group-hover:italic transition-all">05. Regulatory Uncertainty</h2>
                <p>
                  The regulatory environment for cryptographic tokens and fractional real estate in Kenya is continually evolving. Future directives from the Capital Markets Authority (CMA) or the Central Bank of Kenya (CBK) may impact how Luxe Estate operates, potentially affecting the tradability of your shares or the mechanics of M-Pesa distributions.
                </p>
              </section>

              <div className="pt-10">
                <p className="text-[9px] uppercase tracking-widest text-stone-400">
                  By investing on the Luxe Estate platform, you acknowledge that you have read, understood, and accepted these risks. You should never invest money that you cannot afford to lose entirely.
                </p>
              </div>
            </article>
          </div>
        </section>

        {/* Right Side: Atmospheric Image */}
        <section className="relative hidden lg:flex items-center justify-center overflow-hidden bg-stone-900">
          <div 
            className="absolute inset-0 z-0 opacity-60 bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1479839672679-a4648ce52616?q=80&w=2070')" }}
          />
          <div className="relative z-10 p-12 border border-white/10 backdrop-blur-md bg-black/30 text-center max-w-sm shadow-2xl">
            <p className="text-white font-serif text-2xl italic">"Calculated precision in the face of market realities."</p>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}