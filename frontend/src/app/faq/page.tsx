/* src/app/faq/page.tsx */
import Footer from "@/components/Footer";
import ReturnNavBar from "@/components/ReturnNavBar";

const faqs = [
  {
    question: "How do I list my property with Luxe Estate?",
    answer: "Our curation process is selective. Please reach out via our Contact page or contact a Principal Partner directly. We require a preliminary architectural review before listing."
  },
  {
    question: "Do you offer international buyer representation?",
    answer: "Yes. We specialize in cross-border acquisitions, providing bespoke advisory for high-net-worth individuals looking to enter the Kenyan luxury market."
  },
  {
    question: "What are the costs associated with selling?",
    answer: "Our commission structures are competitive and reflect the premium marketing, professional cinematography, and global reach we provide for every listing."
  },
  {
    question: "What is Luxe Estate?",
    answer: "Luxe Estate is a premium PropTech platform specializing in modernist architectural homes in Kisii and Nyamira, Kenya. We connect high-end buyers with verified agents."
  },
  {
    question: "Is Luxe Estate a traditional agency?",
    answer: "No, we are a technology platform that provides digital tools for agents and a curated marketplace for architectural gems."
  },

  // Locations & Inventory
  {
    question: "Where are the properties located?",
    answer: "Our inventory focuses on upscale neighborhoods in Kisii town (like Milimani), Nyamira, and surrounding luxury corridors in Western Kenya."
  },
  {
    question: "What kind of properties do you list?",
    answer: "We exclusively feature modernist, contemporary, and high-end architectural designs that meet our luxury aesthetic standards."
  },

  // Agent Portal & Monetization
  {
    question: "How do I join the Agent Portal?",
    answer: "Qualified agents can register at /agent/login. Once verified, you can manage inventory and view lead analytics."
  },
  {
    question: "What is the Professional Tier?",
    answer: "The Pro Tier offers verified badges, featured listing placement (boosting), and unblurred lead contact information for a monthly fee."
  },
  {
    question: "Can I boost my property listing?",
    answer: "Yes! Professional tier agents can 'Boost' listings to keep them at the top of the Architectural Inventory grid."
  },

  // Services & Operations
  {
    question: "Do you offer property maintenance?",
    answer: "Yes, we provide professional move-in cleaning and routine maintenance services for properties listed on our platform."
  },
  {
    question: "How do viewings work?",
    answer: "Click the 'Contact Agent' button on any property page to schedule a viewing. We support both physical walkthroughs and virtual tours."
  },
  {
    question: "Is there a fee for buyers?",
    answer: "Luxe Estate is free for buyers to browse. Fees only apply to agents for premium features and listing services."
  },

  // Trust & Security
  {
    question: "Are the agents verified?",
    answer: "Agents with a gold checkmark are part of our Professional Tier and have undergone a verification process to ensure trust and reliability."
  }
];

export default function FAQPage() {
  return (
    <main className="bg-[#FCFAFA] min-h-screen">
      <ReturnNavBar />
      
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-80px)]">
        
        {/* Left Side: Editorial Content Column */}
        <section className="p-8 md:p-24 bg-white overflow-y-auto">
          <div className="max-w-md mx-auto lg:mx-0">
            <header className="mb-20">
              <span className="text-[10px] uppercase tracking-[0.5em] text-[#E91E63] font-bold block mb-4">Client Services</span>
              <h1 className="font-serif text-5xl text-[#0D0D0D] leading-tight">Common <br/>Inquiries</h1>
            </header>

            <div className="space-y-16">
              {faqs.map((faq, i) => (
                <div key={i} className="group transition-all">
                  <div className="flex gap-4 items-start mb-4">
                    <span className="font-mono text-[9px] text-stone-400 mt-1">0{i + 1}</span>
                    <h3 className="font-serif text-xl text-[#0D0D0D] group-hover:italic transition-all">
                      {faq.question}
                    </h3>
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
          <div className="relative z-10 p-12 backdrop-blur-md bg-white/5 border border-white/10 text-center max-w-xs">
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