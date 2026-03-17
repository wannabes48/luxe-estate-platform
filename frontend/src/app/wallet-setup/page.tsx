import ReturnNavBar from "@/components/ReturnNavBar";
import Footer from "@/components/Footer";

export default function WalletSetupPage() {
  return (
    <main className="bg-[#FCFAFA] min-h-screen">
      <ReturnNavBar />
      
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-80px)]">
        
        {/* Left Side: Content Column */}
        <section className="p-8 md:p-24 bg-white overflow-y-auto">
          <div className="max-w-xl mx-auto lg:mx-0">
            <header className="mb-16">
              <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#E91E63] font-bold mb-4">
                Web3 Infrastructure
              </p>
              <h1 className="font-serif text-5xl text-[#0D0D0D] leading-tight">Digital Vault <br/>Setup</h1>
              <p className="text-stone-500 mt-6 text-sm leading-relaxed">
                Your fractional real estate shares are minted as secure, cryptographic tokens on the Polygon blockchain. To independently view and custody your assets, follow this guide to set up your MetaMask Web3 wallet.
              </p>
            </header>

            <article className="space-y-12 text-stone-600 text-sm leading-relaxed">
              
              {/* Step 1 */}
              <section className="group">
                <div className="flex items-center gap-4 mb-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-stone-100 text-stone-900 font-serif font-bold group-hover:bg-[#E91E63] group-hover:text-white transition-colors">1</span>
                  <h2 className="font-serif text-xl text-black">Download MetaMask</h2>
                </div>
                <div className="pl-12 border-l border-stone-100 ml-4">
                  <p className="mb-4">
                    MetaMask is the industry standard for Web3 wallets. It acts as your personal gateway to the blockchain.
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-stone-500">
                    <li>Visit the official <a href="https://metamask.io" target="_blank" rel="noreferrer" className="text-[#E91E63] hover:underline">metamask.io</a> website.</li>
                    <li>Install the extension for your browser (Chrome, Firefox, Brave) or download the mobile app (iOS/Android).</li>
                  </ul>
                </div>
              </section>

              {/* Step 2 */}
              <section className="group">
                <div className="flex items-center gap-4 mb-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-stone-100 text-stone-900 font-serif font-bold group-hover:bg-[#E91E63] group-hover:text-white transition-colors">2</span>
                  <h2 className="font-serif text-xl text-black">Secure Your Seed Phrase</h2>
                </div>
                <div className="pl-12 border-l border-stone-100 ml-4">
                  <p className="mb-4">
                    During setup, MetaMask will give you a 12-word "Secret Recovery Phrase". <strong>This is the master key to your digital real estate.</strong>
                  </p>
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-sm text-amber-800 mb-4">
                    <p className="font-bold text-xs uppercase tracking-widest mb-1">Critical Security Warning</p>
                    <p className="text-xs">Never share this 12-word phrase with anyone, including Luxe Estate staff. If you lose this phrase, your assets cannot be recovered. Write it down on physical paper and store it in a secure location (like a safe or bank vault).</p>
                  </div>
                </div>
              </section>

              {/* Step 3 */}
              <section className="group">
                <div className="flex items-center gap-4 mb-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-stone-100 text-stone-900 font-serif font-bold group-hover:bg-[#E91E63] group-hover:text-white transition-colors">3</span>
                  <h2 className="font-serif text-xl text-black">Connect to Polygon</h2>
                </div>
                <div className="pl-12 border-l border-stone-100 ml-4">
                  <p className="mb-4">
                    Luxe Estate utilizes the Polygon network for its speed and low transaction fees. When you log into your Investor Dashboard and click "Connect MetaMask", our platform will automatically prompt your wallet to switch to the correct network. 
                  </p>
                  <p className="text-xs text-stone-500 italic">
                    Note: We are currently operating on the Polygon Amoy Testnet. The network will be added to your wallet automatically upon connection.
                  </p>
                </div>
              </section>

              {/* Step 4 */}
              <section className="group">
                <div className="flex items-center gap-4 mb-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-stone-100 text-stone-900 font-serif font-bold group-hover:bg-[#E91E63] group-hover:text-white transition-colors">4</span>
                  <h2 className="font-serif text-xl text-black">View Your Shares</h2>
                </div>
                <div className="pl-12 border-l border-stone-100 ml-4">
                  <p>
                    Once you purchase a fractional share via M-Pesa, the digital tokens are instantly minted to your connected wallet. To see them in MetaMask, click "Import Tokens" and paste the specific Smart Contract Address of the property (available in your Dashboard).
                  </p>
                </div>
              </section>

              <div className="pt-10 flex items-center gap-4">
                <a 
                  href="/dashboard" 
                  className="bg-[#0D0D0D] text-white px-8 py-4 text-[10px] uppercase tracking-widest hover:bg-[#E91E63] transition-colors font-bold"
                >
                  Return to Dashboard
                </a>
                <a 
                  href="/contact" 
                  className="text-[10px] uppercase tracking-widest text-stone-500 hover:text-stone-900 transition-colors"
                >
                  Need Technical Support?
                </a>
              </div>

            </article>
          </div>
        </section>

        {/* Right Side: Atmospheric Image */}
        <section className="relative hidden lg:flex items-center justify-center overflow-hidden bg-stone-900">
          <div 
            className="absolute inset-0 z-0 opacity-60 bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1639762681485-074b7f4ec651?q=80&w=2070')" }}
          />
          <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="relative z-10 p-12 border border-white/10 backdrop-blur-md bg-black/30 text-center max-w-sm shadow-2xl">
            <p className="text-white font-serif text-2xl italic">"Self-custody is the foundation of true ownership."</p>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}