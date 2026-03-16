"use client"
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function AdminOverview() {
    const [metrics, setMetrics] = useState({
        totalCapital: 0,
        totalInvestors: 0,
        totalProperties: 0,
        activeShares: 0
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchMetrics() {
            // 1. Total Capital & Shares from Investments
            const { data: investments } = await supabase
                .from('investments')
                .select('amount_invested, shares_owned, user_id');
            
            // 2. Total Fractional Properties
            const { count: propertiesCount } = await supabase
                .from('properties')
                .select('*', { count: 'exact', head: true });

            if (investments) {
                const capital = investments.reduce((sum, inv) => sum + Number(inv.amount_invested), 0);
                const shares = investments.reduce((sum, inv) => sum + Number(inv.shares_owned), 0);
                
                // Get unique investors
                const uniqueInvestors = new Set(investments.map(inv => inv.user_id)).size;

                setMetrics({
                    totalCapital: capital,
                    totalInvestors: uniqueInvestors,
                    totalProperties: propertiesCount || 0,
                    activeShares: shares
                });
            }
            setIsLoading(false);
        }

        fetchMetrics();
    }, []);

    if (isLoading) return <div className="p-8 text-stone-500">Loading metrics...</div>;

    return (
        <div className="p-8 lg:p-12 max-w-7xl mx-auto">
            <div className="mb-10">
                <h1 className="text-4xl font-serif text-stone-900">Platform Overview</h1>
                <p className="text-stone-500 mt-2 text-sm">Real-time metrics for Luxe Estate operations.</p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                    <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-2">Total Capital Raised</p>
                    <p className="text-3xl font-serif text-stone-900">
                        <span className="text-lg text-stone-400">KES</span> {metrics.totalCapital.toLocaleString()}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                    <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-2">Unique Investors</p>
                    <p className="text-3xl font-serif text-stone-900">{metrics.totalInvestors}</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                    <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-2">Tokenized Assets</p>
                    <p className="text-3xl font-serif text-stone-900">{metrics.totalProperties}</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                    <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-2">Shares Circulating</p>
                    <p className="text-3xl font-serif text-stone-900">{metrics.activeShares.toLocaleString()}</p>
                </div>
            </div>

            {/* Placeholder for future charts or recent activity */}
            <div className="bg-white border border-stone-200 rounded-xl p-8 h-96 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl">📊</span>
                </div>
                <h3 className="font-serif text-xl text-stone-900 mb-2">Financial Charts Coming Soon</h3>
                <p className="text-sm text-stone-500 max-w-md">
                    Historical yield trends and secondary market trading volume will populate here once enough data is gathered.
                </p>
            </div>
        </div>
    );
}