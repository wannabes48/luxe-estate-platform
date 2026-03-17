import ReturnNavBar from "@/components/ReturnNavBar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Journal | Market Intelligence & Web3',
  description: 'Curated monographs on luxury architecture, liquid equity, and the future of blockchain-integrated real estate in Kenya.',
  keywords: [
    'PropTech market intelligence',
    'real estate tokenization explained',
    'Kenyan luxury property trends',
    'Web3 investment strategies',
    'architectural design Kenya'
  ],
};

const posts = [
  {
    title: "Liquid Equity: The Polygon Blockchain Meets Real Estate",
    excerpt: "How cryptographic tokenization is dismantling the traditional barriers to high-yield asset acquisition, offering unprecedented liquidity to the modern investor.",
    date: "Mar 15, 2026",
    category: "Web3 & Tech",
    readTime: "6 min read"
  },
  {
    title: "Automated Yields: The Future of Passive Income",
    excerpt: "Behind the scenes of our Safaricom Daraja integration. Discover how smart contracts and M-Pesa B2C APIs work in tandem to disburse monthly rental yields automatically.",
    date: "Mar 02, 2026",
    category: "Financials",
    readTime: "4 min read"
  },
  {
    title: "Emerging Markets: The Luxury Boom in Kisii's Milimani",
    excerpt: "A deep dive into the shifting demographics and architectural demands driving property valuations in Western Kenya's most exclusive corridors.",
    date: "Feb 18, 2026",
    category: "Market Intelligence",
    readTime: "8 min read"
  },
  {
    title: "The Mechanics of the Secondary Market",
    excerpt: "Fractional ownership is only as valuable as its liquidity. We explore how peer-to-peer trading works on the Luxe platform, and how prices are determined by market demand.",
    date: "Feb 10, 2026",
    category: "Investing",
    readTime: "5 min read"
  },
  {
    title: "The Rise of Architectural Wellness",
    excerpt: "How biophilic design, natural light optimization, and sustainable materials are increasing property valuations in modernist coastal and highland retreats.",
    date: "Jan 28, 2026",
    category: "Design",
    readTime: "7 min read"
  }
];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-[#FCFAFA]">
      <ReturnNavBar />
      
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-80px)]">
        
        {/* Left: Atmospheric Image */}
        <section className="relative hidden lg:flex items-center justify-center p-20 overflow-hidden bg-stone-900">
          <div 
            className="absolute inset-0 z-0 opacity-40 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069')" }}
          />
          <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          <div className="relative z-10 backdrop-blur-md bg-white/5 border border-white/10 p-12 max-w-md shadow-2xl">
            <p className="text-[10px] uppercase tracking-[0.5em] text-emerald-400 font-bold mb-6">The Journal</p>
            <h1 className="font-serif text-5xl text-white leading-tight mb-6">
              Curated thoughts on architecture, Web3, and liquid equity.
            </h1>
            <p className="text-stone-400 text-sm leading-relaxed font-light">
              Explore our monographs detailing the intersection of uncompromising design and immutable blockchain technology.
            </p>
          </div>
        </section>

        {/* Right: Content */}
        <section className="p-8 md:p-16 lg:p-24 bg-white overflow-y-auto">
          <div className="max-w-xl mx-auto lg:mx-0 space-y-16">
            
            <div className="mb-12 border-b border-stone-100 pb-8 lg:hidden">
              <h1 className="font-serif text-4xl text-stone-900">The Journal</h1>
              <p className="text-stone-500 mt-2 text-sm">Curated thoughts on architecture and liquid equity.</p>
            </div>

            {posts.map((post, i) => (
              <article key={i} className="group">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-[9px] uppercase tracking-widest text-[#E91E63] font-bold">
                    {post.category} — {post.date}
                  </p>
                  <span className="text-[9px] uppercase tracking-widest text-stone-400 font-mono">
                    {post.readTime}
                  </span>
                </div>
                
                <h2 className="font-serif text-3xl text-stone-900 mb-4 group-hover:italic group-hover:text-emerald-700 transition-all cursor-pointer">
                  {post.title}
                </h2>
                
                <p className="text-stone-500 text-sm leading-relaxed mb-6">
                  {post.excerpt}
                </p>
                
                <Link href="#" className="inline-block text-[10px] uppercase tracking-widest text-stone-900 border-b border-stone-200 pb-1 hover:border-[#E91E63] hover:text-[#E91E63] transition-colors font-bold">
                  Read Monograph →
                </Link>
              </article>
            ))}

            <div className="pt-12 mt-12 border-t border-stone-100 text-center">
              <p className="text-xs text-stone-400 italic">You have reached the end of the current volume.</p>
            </div>

          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}