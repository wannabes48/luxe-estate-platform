"use client"
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Web3Portfolio from '@/components/Web3Portfolio'; // Make sure this path is correct!
import Link from 'next/link';

export default function InvestorDashboard() {
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [metrics, setMetrics] = useState({ totalInvested: 0, totalShares: 0, activeAssets: 0 });
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadDashboard() {
            // 1. Get the authenticated user
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                window.location.href = '/auth/login';
                return;
            }
            setUser(user);

            // 2. Fetch User Profile
            const { data: profileData } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('id', user.id)
                .single();
            setProfile(profileData);

            // 3. Fetch Investment Metrics
            const { data: investments } = await supabase
                .from('investments')
                .select('total_invested, shares_owned')
                .eq('user_id', user.id);

            if (investments && investments.length > 0) {
                const totalInvested = investments.reduce((sum, inv) => sum + Number(inv.total_invested), 0);
                const totalShares = investments.reduce((sum, inv) => sum + Number(inv.shares_owned), 0);
                setMetrics({ totalInvested, totalShares, activeAssets: investments.length });
            }

            // 4. Fetch M-Pesa Transaction History
            const { data: mpesaTx } = await supabase
                .from('mpesa_transactions')
                .select('amount, mpesa_receipt, status, created_at, properties(title)')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(5);

            if (mpesaTx) setTransactions(mpesaTx);
            setLoading(false);
        }

        loadDashboard();
    }, []);

    if (loading) return <div className="min-h-screen flex items-center justify-center text-xs uppercase tracking-widest text-stone-400 animate-pulse">Loading secure portfolio...</div>;

    return (
        <div className="min-h-screen bg-[#FAFAFA] pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-6">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-stone-200 pb-8">
                    <div>
                        <h1 className="text-4xl font-serif text-stone-900 mb-2">My Portfolio</h1>
                        <p className="text-sm text-stone-500">
                            Welcome back, <span className="font-bold text-stone-900">{profile?.full_name || 'Investor'}</span>
                        </p>
                    </div>
                    <div className="mt-4 md:mt-0 flex gap-4">
                        <Link href="/invest" className="px-6 py-3 bg-black text-white text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-colors">
                            Explore Assets
                        </Link>
                    </div>
                </div>

                {/* Top Metrics Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white p-6 border border-stone-200 shadow-sm">
                        <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-2">Total Value Locked</p>
                        <p className="text-3xl font-light text-stone-900">
                            {metrics.totalInvested.toLocaleString()} <span className="text-sm text-stone-400">KES</span>
                        </p>
                    </div>
                    <div className="bg-white p-6 border border-stone-200 shadow-sm">
                        <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-2">Total Shares Owned</p>
                        <p className="text-3xl font-light text-stone-900">{metrics.totalShares}</p>
                    </div>
                    <div className="bg-white p-6 border border-stone-200 shadow-sm">
                        <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-2">Active Properties</p>
                        <p className="text-3xl font-light text-stone-900">{metrics.activeAssets}</p>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column: Web3 Integration (Takes up 2/3 width on large screens) */}
                    <div className="lg:col-span-2">
                        {user && <Web3Portfolio userId={user.id} />}
                    </div>

                    {/* Right Column: Fiat / M-Pesa Activity */}
                    <div className="space-y-6">
                        <div className="bg-white border border-stone-200 p-6 shadow-sm rounded-xl">
                            <h3 className="font-serif text-xl text-stone-900 mb-1">Fiat Audit Trail</h3>
                            <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-6">Recent M-Pesa Deposits</p>

                            {transactions.length === 0 ? (
                                <p className="text-xs text-stone-400 italic">No transactions found.</p>
                            ) : (
                                <div className="space-y-4">
                                    {transactions.map((tx, idx) => (
                                        <div key={idx} className="flex justify-between items-center pb-4 border-b border-stone-100 last:border-0 last:pb-0">
                                            <div>
                                                <p className="text-sm font-medium text-stone-900">{tx.properties?.title || 'Property Share'}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[9px] uppercase tracking-widest text-stone-400">{new Date(tx.created_at).toLocaleDateString()}</span>
                                                    <span className="text-[9px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded font-mono">Ref: {tx.mpesa_receipt}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-emerald-600">+{tx.amount.toLocaleString()}</p>
                                                <p className="text-[9px] uppercase tracking-widest text-stone-400">KES</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}