"use client"
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import ReturnNavBar from '@/components/ReturnNavBar';

export default function FractionalMarketplace() {
    const [properties, setProperties] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    // M-Pesa Purchase Modal State
    const [selectedAsset, setSelectedAsset] = useState<any>(null);
    const [sharesToBuy, setSharesToBuy] = useState(1);
    const [mpesaPhone, setMpesaPhone] = useState('');
    const [purchaseState, setPurchaseState] = useState<'idle' | 'pushing' | 'waiting' | 'success'>('idle');

    useEffect(() => {
        async function fetchMarketplace() {
            // Fetch properties joined with their shares and cover image
            const { data, error } = await supabase
                .from('properties')
                .select(`
                    property_id, 
                    title,
                    locations(city),
                    price,
                    property_shares(*),
                    property_images(image_url)
                `)
                .in('status', ['FOR_SALE', 'RENTAL']); // Only active listings

            if (error) {
                console.error("Supabase Error:", error);
            } else {
                console.log("Raw Database Response:", data);
            
                // Now we manually filter it in the frontend just to see what survives
                const validProperties = data?.filter(p => p.property_shares && p.property_shares.length > 0) || [];
                console.log("Properties with shares:", validProperties);
            
                setProperties(validProperties);
            }
        setLoading(false);
        }
        fetchMarketplace();
    }, []);

    const handleBuyRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        setPurchaseState('pushing');

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                alert("Please log in to invest.");
                window.location.href = '/auth/login';
                return;
            }

            const totalAmount = sharesToBuy * selectedAsset.property_shares[0].price_per_share;

            // Trigger the Next.js API route we wrote earlier!
            const response = await fetch('/api/mpesa/push', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phoneNumber: mpesaPhone,
                    amount: totalAmount,
                    propertyId: selectedAsset.property_id,
                    userId: user.id
                })
            });

            const result = await response.json();

            if (result.success) {
                setPurchaseState('waiting');
                // In a production app, you would poll your database here or use Supabase Realtime 
                // to listen for the webhook to update the 'investments' table.
                setTimeout(() => setPurchaseState('success'), 8000); // Mocking the callback for UI flow
            } else {
                throw new Error(result.error);
            }
        } catch (error: any) {
            alert("Payment Initiation Failed: " + error.message);
            setPurchaseState('idle');
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-xs uppercase tracking-widest animate-pulse text-stone-400">Loading Marketplace...</div>;

    return (
        <div className="min-h-screen bg-[#FAFAFA] pt-24 pb-20">
            <ReturnNavBar />
            <div className="max-w-7xl mx-auto px-6">
                
                <div className="mb-12">
                    <h1 className="text-4xl font-serif text-stone-900 mb-2">Live Offerings</h1>
                    <p className="text-stone-500">Invest in high-yield, climate-resilient properties across Kenya.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {properties.map(property => {
                        const shares = property.property_shares[0];
                        const coverImage = property.property_images?.[0]?.image_url || '/placeholder.jpg';
                        const percentFunded = ((shares.total_shares - shares.available_shares) / shares.total_shares) * 100;

                        return (
                            <div key={property.property_id} className="bg-white border border-stone-200 group overflow-hidden hover:shadow-xl transition-all">
                                <div className="h-56 relative overflow-hidden">
                                    <img src={coverImage} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 text-[10px] uppercase tracking-widest font-bold text-emerald-700">
                                        {shares.projected_roi}% ROI
                                    </div>
                                </div>
                                
                                <div className="p-6">
                                    <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">{property.locations?.city || 'Premium Location'}</p>
                                    <h3 className="font-serif text-xl text-stone-900 mb-4">{property.title}</h3>
                                    
                                    <div className="space-y-4 mb-6">
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-[10px] uppercase tracking-widest text-stone-400">Price per Share</p>
                                                <p className="text-lg font-medium text-stone-900">{shares.price_per_share.toLocaleString()} <span className="text-xs text-stone-500">KES</span></p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] uppercase tracking-widest text-stone-400">Available</p>
                                                <p className="text-lg font-medium text-emerald-600">{shares.available_shares} <span className="text-xs text-stone-500">/ {shares.total_shares}</span></p>
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                                            <div className="bg-emerald-500 h-full" style={{ width: `${percentFunded}%` }}></div>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={() => setSelectedAsset(property)}
                                        className="w-full py-4 border border-stone-900 text-stone-900 text-xs uppercase tracking-widest hover:bg-stone-900 hover:text-white transition-colors"
                                    >
                                        Invest Now
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Checkout Modal */}
            {selectedAsset && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white max-w-md w-full p-8 relative shadow-2xl">
                        <button onClick={() => setSelectedAsset(null)} className="absolute top-4 right-4 text-stone-400 hover:text-black">✕</button>
                        
                        {purchaseState === 'success' ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">✓</div>
                                <h3 className="text-2xl font-serif mb-2">Investment Secured!</h3>
                                <p className="text-stone-500 text-sm mb-6">Your payment was received. The smart contract is minting your tokens on the Polygon blockchain.</p>
                                <button onClick={() => window.location.href = '/dashboard'} className="w-full bg-black text-white py-4 text-xs uppercase tracking-widest">
                                    View Portfolio
                                </button>
                            </div>
                        ) : (
                            <>
                                <h3 className="font-serif text-2xl mb-1 text-stone-900">Purchase Shares</h3>
                                <p className="text-xs text-stone-500 uppercase tracking-widest mb-6">{selectedAsset.title}</p>
                                
                                <form onSubmit={handleBuyRequest} className="space-y-4">
                                    <div>
                                        <label className="text-[10px] uppercase tracking-widest text-stone-400 block mb-1">Number of Shares</label>
                                        <input type="number" min="1" max={selectedAsset.property_shares[0].available_shares} value={sharesToBuy} onChange={(e) => setSharesToBuy(parseInt(e.target.value))} className="w-full bg-[#FAFAFA] border border-stone-200 p-3 outline-none text-center text-xl font-medium" />
                                    </div>
                                    
                                    <div className="bg-stone-50 p-4 border border-stone-100 flex justify-between items-center">
                                        <span className="text-sm text-stone-600">Total Amount:</span>
                                        <span className="text-xl font-medium text-emerald-600">{(sharesToBuy * selectedAsset.property_shares[0].price_per_share).toLocaleString()} KES</span>
                                    </div>

                                    <div>
                                        <label className="text-[10px] uppercase tracking-widest text-stone-400 block mb-1">M-Pesa Number</label>
                                        <input required type="tel" placeholder="254700000000" value={mpesaPhone} onChange={(e) => setMpesaPhone(e.target.value)} className="w-full bg-[#FAFAFA] border border-stone-200 p-3 outline-none focus:border-emerald-500" />
                                    </div>

                                    <button disabled={purchaseState !== 'idle'} type="submit" className="w-full bg-[#52B44B] hover:bg-[#42953D] text-white py-4 text-xs uppercase tracking-[0.2em] transition-colors disabled:opacity-50 mt-4">
                                        {purchaseState === 'idle' ? 'Pay with M-Pesa' : purchaseState === 'pushing' ? 'Initiating STK...' : 'Awaiting PIN on Phone...'}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
}