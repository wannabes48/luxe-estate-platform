/* src/app/blog/page.tsx */
import ReturnNavBar from "@/components/ReturnNavBar"; // New Import
import Footer from "@/components/Footer";

const posts = [
  {
    title: "Market Intelligence: Nairobi 2026",
    excerpt: "Yields in Westlands and Karen are shifting towards boutique luxury developments.",
    date: "Feb 05, 2026",
    category: "Insights"
  },
  {
    title: "The Rise of Architectural Wellness",
    excerpt: "How biophilic design is increasing property valuation in coastal retreats.",
    date: "Jan 28, 2026",
    category: "Design"
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
            className="absolute inset-0 z-0 opacity-50 bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069')" }}
          />
          <div className="relative z-10 backdrop-blur-xl bg-white/5 border border-white/10 p-12 max-w-md">
            <p className="text-[10px] uppercase tracking-[0.5em] text-white/50 mb-8">Journal</p>
            <h1 className="font-serif text-5xl text-white leading-tight">Curated thoughts on architecture and equity.</h1>
          </div>
        </section>

        {/* Right: Content */}
        <section className="p-8 md:p-24 bg-white overflow-y-auto">
          <div className="space-y-20">
            {posts.map((post, i) => (
              <article key={i} className="group cursor-pointer">
                <p className="text-[9px] uppercase tracking-widest text-[#E91E63] font-bold mb-4">{post.category} — {post.date}</p>
                <h2 className="font-serif text-3xl mb-4 group-hover:italic transition-all">{post.title}</h2>
                <p className="text-stone-500 text-sm leading-relaxed mb-6">{post.excerpt}</p>
                <button className="text-[10px] uppercase tracking-widest border-b border-stone-200 pb-1 hover:border-black transition-colors">Read Monograph</button>
              </article>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}