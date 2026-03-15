"use client"
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface FractionalProperty {
    property_id: string;
    title: string;
    total_shares: number;
    price_per_share: number;
}

export default function AdminYieldDashboard() {
    const [properties, setProperties] = useState<FractionalProperty[]>([]);
    const [selectedProperty, setSelectedProperty] = useState('');
    const [rentAmount, setRentAmount] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [distPreview, setDistPreview] = useState<any>(null);

    // 1. Fetch properties that have fractional shares setup
    useEffect(() => {
        async function fetchFractionalProperties() {
            const { data } = await supabase
                .from('properties')
                .select('property_id, title, property_shares!inner(total_shares, price_per_share)');
            
            if (data) {
                const formatted = data.map(d => ({
                    property_id: d.property_id,
                    title: d.title,
                    total_shares: d.property_shares[0].total_shares,
                    price_per_share: d.property_shares[0].price_per_share
                }));
                setProperties(formatted);
            }
        }
        fetchFractionalProperties();
    }, []);

    // 2. Preview the Math before sending money
    const handlePreview = async () => {
        if (!selectedProperty || !rentAmount) return;
        
        const targetProp = properties.find(p => p.property_id === selectedProperty);
        if (!targetProp) return;

        const rent = parseFloat(rentAmount);
        
        // Take a 5% platform management fee (Monetization Strategy)
        const platformFee = rent * 0.05;
        const distributableAmount = rent - platformFee;
        const dividendPerShare = distributableAmount / targetProp.total_shares;

        // Fetch how many unique investors we have for this property
        const { count } = await supabase
            .from('investments')
            .select('*', { count: 'exact', head: true })
            .eq('property_id', selectedProperty)
            .gt('shares_owned', 0);

        setDistPreview({
            grossRent: rent,
            platformFee,
            netToInvestors: distributableAmount,
            dividendPerShare,
            investorCount: count || 0
        });
    };

    // 3. Trigger the M-Pesa B2C API backend route
    const handleDistribute = async () => {
        if (!confirm("WARNING: This will initiate live M-Pesa B2C transfers to all investors. Proceed?")) return;
        
        setIsProcessing(true);
        try {
            const response = await fetch('/api/admin/distribute-yield', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    propertyId: selectedProperty,
                    grossRent: parseFloat(rentAmount),
                    dividendPerShare: distPreview.dividendPerShare
                })
            });

            const result = await response.json();
            if (result.success) {
                alert(`Success! Initiated ${result.payoutsCount} M-Pesa transfers.`);
                setRentAmount('');
                setDistPreview(null);
            } else {
                throw new Error(result.error);
            }
        } catch (error: any) {
            alert("Distribution Failed: " + error.message);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white border border-stone-200 mt-10 rounded-xl">
            <div className="mb-8 border-b border-stone-200 pb-4">
                <h2 className="text-3xl font-serif text-stone-900">Yield Distribution Engine</h2>
                <p className="text-xs text-stone-500 uppercase tracking-widest mt-2">
                    Automated M-Pesa B2C Payouts to Token Holders
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Configuration Panel */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-stone-400">Select Asset</label>
                        <select 
                            className="w-full bg-[#FAFAFA] border border-stone-200 p-3 outline-none"
                            value={selectedProperty}
                            onChange={(e) => setSelectedProperty(e.target.value)}
                        >
                            <option value="">-- Choose Fractional Property --</option>
                            {properties.map(p => (
                                <option key={p.property_id} value={p.property_id}>
                                    {p.title} ({p.total_shares} Total Shares)
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-stone-400">Gross Rent Collected (KES)</label>
                        <input 
                            type="number" 
                            className="w-full bg-[#FAFAFA] border border-stone-200 p-3 outline-none text-lg font-mono"
                            placeholder="e.g. 200000"
                            value={rentAmount}
                            onChange={(e) => setRentAmount(e.target.value)}
                            onBlur={handlePreview}
                        />
                    </div>
                </div>

                {/* Live Preview Panel */}
                <div className="bg-stone-50 p-6 rounded-lg border border-stone-200">
                    <h3 className="font-serif text-lg mb-4 text-stone-900">Distribution Preview</h3>
                    
                    {!distPreview ? (
                        <p className="text-xs text-stone-400 italic">Select a property and enter rent to view calculation.</p>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-stone-500">Gross Rent:</span>
                                <span className="font-mono font-medium">{distPreview.grossRent.toLocaleString()} KES</span>
                            </div>
                            <div className="flex justify-between text-sm text-red-500">
                                <span>Platform Fee (5%):</span>
                                <span className="font-mono">- {distPreview.platformFee.toLocaleString()} KES</span>
                            </div>
                            <div className="flex justify-between text-sm font-bold text-emerald-700 border-t border-stone-200 pt-2">
                                <span>Net to Investors:</span>
                                <span className="font-mono">{distPreview.netToInvestors.toLocaleString()} KES</span>
                            </div>
                            
                            <div className="mt-6 p-4 bg-white border border-emerald-100 rounded">
                                <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">Dividend Per Share</p>
                                <p className="text-2xl font-light text-emerald-600">
                                    {distPreview.dividendPerShare.toFixed(2)} <span className="text-sm">KES</span>
                                </p>
                                <p className="text-xs text-stone-500 mt-2">
                                    Disbursing to <strong>{distPreview.investorCount}</strong> unique investors.
                                </p>
                            </div>

                            <button 
                                onClick={handleDistribute}
                                disabled={isProcessing || distPreview.investorCount === 0}
                                className="w-full mt-4 bg-black text-white py-4 text-xs uppercase tracking-[0.2em] hover:bg-emerald-600 transition-colors disabled:opacity-50"
                            >
                                {isProcessing ? 'Processing B2C API...' : 'Confirm & Send via M-Pesa'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}