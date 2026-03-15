"use client"
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import ReturnNavBar from '@/components/ReturnNavBar';

export default function HowItWorks() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => setUser(data.user));
    }, []);

    return (
        <div className="min-h-screen bg-[#FAFAFA] pt-24 pb-20">
            <ReturnNavBar />
            {/* Hero Section */}
            <div className="max-w-4xl mx-auto px-6 text-center mb-20">
                <h1 className="text-4xl md:text-6xl font-serif text-stone-900 mb-6 leading-tight">
                    Real Estate Wealth, <br />
                    <span className="text-emerald-600">Democratized.</span>
                </h1>
                <p className="text-lg text-stone-600 max-w-2xl mx-auto font-light">
                    Luxe Fractional uses blockchain technology and M-Pesa to break down multi-million shilling properties into affordable, income-generating shares.
                </p>
            </div>

            {/* The 4-Step Process */}
            <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-24">
                {[
                    { step: "01", title: "Browse Assets", desc: "Explore climate-resilient, verified luxury properties across Kenya." },
                    { step: "02", title: "Micro-Invest", desc: "Buy shares for as little as 10,000 KES instantly using M-Pesa." },
                    { step: "03", title: "Web3 Ownership", desc: "Your shares are minted as secure, immutable tokens on the Polygon Blockchain." },
                    { step: "04", title: "Earn Dividends", desc: "Receive your portion of the monthly rental income directly to your phone." }
                ].map((item, i) => (
                    <div key={i} className="bg-white p-8 border border-stone-200 hover:border-emerald-400 transition-colors">
                        <span className="text-4xl font-serif text-stone-200 mb-4 block">{item.step}</span>
                        <h3 className="text-lg font-bold text-stone-900 mb-2 uppercase tracking-wide">{item.title}</h3>
                        <p className="text-sm text-stone-600 leading-relaxed">{item.desc}</p>
                    </div>
                ))}
            </div>

            {/* The Entry Funnel (Your requested CTAs) */}
            <div className="max-w-5xl mx-auto px-6">
                <div className="bg-stone-950 text-white rounded-2xl overflow-hidden shadow-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        
                        {/* Investor Path */}
                        <div className="p-12 border-b md:border-b-0 md:border-r border-white/10 flex flex-col justify-center">
                            <h3 className="text-2xl font-serif mb-4">I want to Invest</h3>
                            <p className="text-stone-400 text-sm mb-8">
                                Start building your fractional real estate portfolio today. Get monthly yields paid to your M-Pesa.
                            </p>
                            {user ? (
                                <Link href="/dashboard" className="w-full text-center px-6 py-4 bg-emerald-500 text-black text-xs uppercase tracking-widest font-bold hover:bg-emerald-400 transition-colors">
                                    Go to My Portfolio
                                </Link>
                            ) : (
                                <div className="space-y-4">
                                    <Link href="/auth/register?role=investor" className="block w-full text-center px-6 py-4 bg-emerald-500 text-black text-xs uppercase tracking-widest font-bold hover:bg-emerald-400 transition-colors">
                                        Create Investor Account
                                    </Link>
                                    <p className="text-center text-xs text-stone-500">
                                        Already have an account? <Link href="/auth/login" className="text-emerald-400 hover:underline">Log In</Link>
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Property Owner Path */}
                        <div className="p-12 flex flex-col justify-center bg-stone-900/50">
                            <h3 className="text-2xl font-serif mb-4">I want to List a Property</h3>
                            <p className="text-stone-400 text-sm mb-8">
                                Tokenize your building to raise capital quickly. Let the community fund your next sustainable development.
                            </p>
                            {user ? (
                                <Link href="/agent/dashboard" className="w-full text-center px-6 py-4 border border-white/20 text-white text-xs uppercase tracking-widest hover:bg-white/10 transition-colors">
                                    Manage My Listings
                                </Link>
                            ) : (
                                <Link href="/auth/register?role=owner" className="block w-full text-center px-6 py-4 border border-white/20 text-white text-xs uppercase tracking-widest hover:bg-white/10 transition-colors">
                                    Apply as Property Owner
                                </Link>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}