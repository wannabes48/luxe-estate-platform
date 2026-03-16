"use client"
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import ReturnNavBar from '@/components/ReturnNavBar';
import Footer from "@/components/Footer";

export default function HowItWorks() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => setUser(data.user));
    }, []);

    return (
        <main className="min-h-screen flex w-full relative bg-[#FAFAFA] overflow-hidden">
            {/* Absolute positioning for the Return Navbar */}
            <div className="absolute top-0 left-0 w-full z-50">
                <ReturnNavBar />
            </div>

            {/* --- LEFT SIDE: Fixed Image & Glass Overlay (Hidden on Mobile) --- */}
            <section className="relative hidden lg:flex lg:w-1/2 items-center justify-center h-screen">
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop')" }}
                />
                <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                <div className="relative z-10 w-full max-w-lg p-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl text-white transform translate-y-8">
                    <div className="w-12 h-1 bg-emerald-500 mb-6"></div>
                    <h1 className="text-5xl font-serif leading-tight mb-6">
                        Real Estate Wealth, <br />
                        <span className="text-emerald-400">Democratized.</span>
                    </h1>
                    <p className="text-stone-300 font-light leading-relaxed text-lg mb-8">
                        Luxe Fractional uses blockchain technology and M-Pesa to break down multi-million shilling properties into affordable, income-generating shares.
                    </p>
                    
                    <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest font-bold">
                        <span className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            Asset-Backed Innovation
                        </span>
                    </div>
                </div>
            </section>

            {/* --- RIGHT SIDE: Scrollable Content & CTAs --- */}
            <section className="w-full lg:w-1/2 h-screen overflow-y-auto flex flex-col px-6 py-20 pt-32 lg:px-16 lg:py-24">
                <div className="max-w-xl mx-auto w-full pb-10">
                    
                    <div className="mb-12">
                        <h2 className="text-3xl font-serif text-stone-900">How It Works</h2>
                        <p className="text-xs text-stone-500 uppercase tracking-widest mt-2">
                            The 4-Step Fractional Process
                        </p>
                    </div>

                    <div className="space-y-4 mb-16">
                        {[
                            { step: "01", title: "Browse Assets", desc: "Explore climate-resilient, verified luxury properties across Kenya." },
                            { step: "02", title: "Micro-Invest", desc: "Buy shares for as little as 10,000 KES instantly using M-Pesa." },
                            { step: "03", title: "Web3 Ownership", desc: "Your shares are minted as secure, immutable tokens on the Polygon Blockchain." },
                            { step: "04", title: "Earn Dividends", desc: "Receive your portion of the monthly rental income directly to your phone." }
                        ].map((item, i) => (
                            <div key={i} className="bg-white p-6 border border-stone-200 hover:border-emerald-400 transition-colors flex gap-6 items-start shadow-sm rounded-lg">
                                <span className="text-3xl font-serif text-emerald-100">{item.step}</span>
                                <div>
                                    <h3 className="text-md font-bold text-stone-900 mb-1 uppercase tracking-wide">{item.title}</h3>
                                    <p className="text-sm text-stone-600 leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* The Entry Funnel */}
                    <div className="bg-stone-950 text-white shadow-2xl overflow-hidden rounded-2xl">
                        
                        {/* Investor Path */}
                        <div className="p-10 border-b border-white/10">
                            <h3 className="text-2xl font-serif mb-3">I want to Invest</h3>
                            <p className="text-stone-400 text-sm mb-8">
                                Start building your fractional real estate portfolio today. Get monthly yields paid directly to your M-Pesa.
                            </p>
                            
                            <div className="space-y-4">
                                <Link 
                                    href={user ? "/dashboard" : "/auth/login"} 
                                    className="block w-full text-center px-6 py-5 bg-emerald-500 text-black text-xs uppercase tracking-widest font-bold hover:bg-emerald-400 transition-colors shadow-lg"
                                >
                                    Go to My Portfolio
                                </Link>
                                {!user && (
                                    <p className="text-center text-xs text-stone-500 mt-4">
                                        New to Luxe? <Link href="/auth/register?role=investor" className="text-emerald-400 font-bold hover:underline uppercase tracking-widest text-[10px]">Create an Account</Link>
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Property Owner Path */}
                        <div className="p-10 bg-stone-900/50">
                            <h3 className="text-2xl font-serif mb-3">I want to List a Property</h3>
                            <p className="text-stone-400 text-sm mb-8">
                                Tokenize your building to raise capital quickly. Let the community fund your next sustainable development.
                            </p>
                            
                            <div className="space-y-4">
                                <Link 
                                    href={user ? "/agent/dashboard" : "/auth/login"} 
                                    className="block w-full text-center px-6 py-5 border border-white/20 text-white text-xs uppercase tracking-widest hover:bg-white/10 transition-colors"
                                >
                                    Manage My Listings
                                </Link>
                                {!user && (
                                    <p className="text-center text-xs text-stone-500 mt-4">
                                        Want to list an asset? <Link href="/auth/register?role=owner" className="text-white font-bold hover:underline uppercase tracking-widest text-[10px]">Apply Here</Link>
                                    </p>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
                <Footer />
            </section>
        </main>
    );
}