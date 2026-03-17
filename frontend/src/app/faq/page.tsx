import Footer from "@/components/Footer";
import ReturnNavBar from "@/components/ReturnNavBar";

const faqs = [
  // --- PLATFORM & PROPERTIES (Original) ---
  {
    category: "The Platform",
    question: "What is Luxe Estate?",
    answer: "Luxe Estate is a premium PropTech platform specializing in modernist architectural homes in Kenya. We connect high-end buyers with verified agents and offer a revolutionary fractional ownership marketplace."
  },
  {
    category: "The Platform",
    question: "Where are the properties located?",
    answer: "Our inventory focuses on upscale neighborhoods in major cities and surrounding luxury corridors in the country."
  },
  {
    category: "The Platform",
    question: "How do viewings work for whole-property purchases?",
    answer: "Click the 'Contact Agent' button on any property page to schedule a viewing. We support both physical walkthroughs and high-fidelity virtual tours."
  },

  // --- FRACTIONAL OWNERSHIP & WEB3 (New) ---
  {
    category: "Tokenization & Web3",
    question: "How does fractional ownership work?",
    answer: "We divide the equity of premium properties into digital shares (tokens) backed by legal frameworks. You can buy these shares directly from developers or trade them with other investors on our platform."
  },
  {
    category: "Tokenization & Web3",
    question: "Why do I need to connect MetaMask?",
    answer: "Connecting a Web3 wallet is optional but highly recommended. Your shares are backed by real smart contracts on the Polygon blockchain. Connecting MetaMask allows you to view and verify your cryptographic tokens independently of our website."
  },
  {
    category: "Tokenization & Web3",
    question: "Is my investment secure on the blockchain?",
    answer: "Yes. Our smart contracts are built using industry-standard OpenZeppelin libraries and deployed on the Polygon network, ensuring immutable proof of ownership that cannot be altered or deleted."
  },

  // --- FINANCIALS & M-PESA (New) ---
  {
    category: "Financials & Trading",
    question: "How do I receive my rental yields?",
    answer: "Yields are automatically calculated based on your share ownership and disbursed directly to your verified M-Pesa phone number via Safaricom's B2C API on the 1st of every month. No manual withdrawal is required."
  },
  {
    category: "Financials & Trading",
    question: "How does the Secondary Market work?",
    answer: "If you wish to exit your investment, you can list your shares on our Peer-to-Peer Marketplace at your desired asking price. When another user buys your listing via M-Pesa, our backend automatically transfers the digital shares to their account and the funds to yours."
  },
  {
    category: "Financials & Trading",
    question: "Why is my account locked pending KYC?",
    answer: "To comply with Kenyan financial regulations and Anti-Money Laundering (AML) laws, we require all investors to verify their legal identity (National ID) and M-Pesa number before executing financial transactions."
  },

  // --- AGENTS & LISTINGS (Original) ---
  {
    category: "Agent Services",
    question: "How do I list my property with Luxe Estate?",
    answer: "Our curation process is selective. Please reach out via our Contact page. We require a preliminary architectural review before listing to ensure properties meet our luxury aesthetic standards."
  },
  {
    category: "Agent Services",
    question: "How do I join the Agent Portal?",
    answer: "Qualified agents can register at /agent/login. Once verified, you can manage inventory, view lead analytics, and upgrade to our Professional Tier for boosted listings."
  }
];

export default function FAQPage() {
  return (
    <main className="bg-[#FCFAFA] min-h-screen">
      <ReturnNavBar />
      
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-80px)]">
        
        {/* Left Side: Editorial Content Column */}
        <section className="p-8 md:p-24 bg-white overflow-y-auto">
          <div className="max-w-xl mx-auto lg:mx-0">
            <header className="mb-20">
              <span className="text-[10px] uppercase tracking-[0.5em] text-[#E91E63] font-bold block mb-4">Client Services</span>
              <h1 className="font-serif text-5xl text-[#0D0D0D] leading-tight">Common <br/>Inquiries</h1>
            </header>

            <div className="space-y-16">
              {faqs.map((faq, i) => (
                <div key={i} className="group transition-all">
                  <div className="flex gap-4 items-start mb-4">
                    <span className="font-mono text-[9px] text-stone-400 mt-1">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <span className="text-[8px] uppercase tracking-widest text-emerald-600 font-bold block mb-1">
                        {faq.category}
                      </span>
                      <h3 className="font-serif text-xl text-[#0D0D0D] group-hover:italic transition-all">
                        {faq.question}
                      </h3>
                    </div>
                  </div>
                  <p className="text-stone-500 text-sm leading-relaxed border-l border-stone-100 pl-6 ml-[14px]">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>

            {/* Subtle Call to Action Footer */}
            <div className="mt-20 pt-12 border-t border-stone-100">
              <p className="text-stone-400 text-xs italic mb-6">Can't find what you're looking for?</p>
              <a href="/contact" className="text-[10px] uppercase tracking-widest border-b border-black pb-1 hover:text-[#E91E63] hover:border-[#E91E63] transition-all">
                Request Private Consultation
              </a>
            </div>
          </div>
        </section>

        {/* Right Side: Atmospheric Image Column */}
        <section className="relative hidden lg:flex items-center justify-center overflow-hidden bg-stone-900">
          <div 
            className="absolute inset-0 z-0 opacity-60 bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1460317442991-0ec209397118?q=80&w=2070')" }}
          />
          <div className="relative z-10 p-12 backdrop-blur-md bg-white/5 border border-white/10 text-center max-w-xs shadow-2xl">
            <p className="text-white font-serif text-2xl leading-relaxed">
              "Clarity in the complex world of luxury equity."
            </p>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}