"use client"
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import Footer from '@/components/Footer';
import ReturnNavBar from '@/components/ReturnNavBar';

export default function FractionalMarketplace() {
    // Marketplace State
    const [activeTab, setActiveTab] = useState<'primary' | 'secondary'>('primary');
    const [primaryProperties, setPrimaryProperties] = useState<any[]>([]);
    const [secondaryListings, setSecondaryListings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<any>(null);
    
    // M-Pesa Purchase Modal State
    const [selectedAsset, setSelectedAsset] = useState<any>(null);
    const [purchaseType, setPurchaseType] = useState<'primary' | 'secondary'>('primary');
    const [sharesToBuy, setSharesToBuy] = useState(1);
    const [mpesaPhone, setMpesaPhone] = useState('');
    const [purchaseState, setPurchaseState] = useState<'idle' | 'pushing' | 'waiting' | 'success'>('idle');

    useEffect(() => {
        async function fetchMarketplace() {
            setLoading(true);
            
            // Get Current User (to prevent buying your own secondary shares)
            const { data: { user } } = await supabase.auth.getUser();
            setCurrentUser(user);

            // 1. Fetch Primary Offerings (Properties Table)
            const { data: primaryData, error: primaryErr } = await supabase
                .from('properties')
                .select(`
                    property_id, 
                    title,
                    locations(city),
                    price,
                    property_shares(*),
                    property_images(image_url)
                `)
                .in('status', ['FOR_SALE', 'RENTAL']);

            if (!primaryErr && primaryData) {
                const validProperties = primaryData.filter(p => p.property_shares && p.property_shares.length > 0);
                setPrimaryProperties(validProperties);
            }

            // 2. Fetch Secondary Market (Peer-to-Peer Listings)
            const { data: secondaryData, error: secondaryErr } = await supabase
                .from('secondary_listings')
                .select(`
                    id,
                    seller_id,
                    shares_offered,
                    price_per_share,
                    created_at,
                    properties (
                        property_id,
                        title,
                        locations(city),
                        property_images(image_url),
                        property_shares(smart_contract_address)
                    ),
                    users (full_name)
                `)
                .eq('status', 'active')
                .order('created_at', { ascending: false });

            if (!secondaryErr && secondaryData) {
                setSecondaryListings(secondaryData);
            }

            setLoading(false);
        }
        
        fetchMarketplace();
    }, []);

    const openPurchaseModal = (asset: any, type: 'primary' | 'secondary') => {
        setSelectedAsset(asset);
        setPurchaseType(type);
        setSharesToBuy(1); // Reset counter
        setPurchaseState('idle');
    };

    const handleBuyRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        setPurchaseState('pushing');

        try {
            if (!currentUser) {
                alert("Please log in to invest.");
                window.location.href = '/auth/login';
                return;
            }

            // Calculate total amount based on the type of purchase
            let totalAmount = 0;
            let propertyId = '';

            if (purchaseType === 'primary') {
                totalAmount = sharesToBuy * selectedAsset.property_shares[0].price_per_share;
                propertyId = selectedAsset.property_id;
            } else {
                totalAmount = sharesToBuy * selectedAsset.price_per_share;
                propertyId = selectedAsset.properties.property_id;
            }

            // Trigger the Next.js API route (This requires your M-Pesa backend logic to be complete)
            const response = await fetch('/api/mpesa/push', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phoneNumber: mpesaPhone,
                    amount: totalAmount,
                    propertyId: propertyId,
                    userId: currentUser.id,
                    purchaseType: purchaseType,
                    listingId: purchaseType === 'secondary' ? selectedAsset.id : null
                })
            });

            const result = await response.json();

            if (result.success) {
                setPurchaseState('waiting');
                // Mock waiting for M-Pesa Callback
                setTimeout(() => setPurchaseState('success'), 8000); 
            } else {
                throw new Error(result.error);
            }
        } catch (error: any) {
            alert("Payment Initiation Failed: " + error.message);
            setPurchaseState('idle');
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-xs uppercase tracking-widest animate-pulse text-stone-400 bg-[#FAFAFA]">Loading Marketplace...</div>;

    return (
        <div className="min-h-screen bg-[#FAFAFA] pt-24 pb-20">
            <ReturnNavBar />
            <div className="max-w-7xl mx-auto px-6">
                
                <div className="mb-12">
                    <h1 className="text-4xl font-serif text-stone-900 mb-2">The Marketplace</h1>
                    <p className="text-stone-500">Invest directly in new developments or buy shares from other investors.</p>
                </div>

                {/* Tab Navigation */}
                <div className="flex border-b border-stone-200 mb-10">
                    <button 
                        onClick={() => setActiveTab('primary')}
                        className={`pb-4 px-6 text-xs uppercase tracking-widest font-bold transition-colors ${activeTab === 'primary' ? 'border-b-2 border-emerald-500 text-stone-900' : 'text-stone-400 hover:text-stone-600'}`}
                    >
                        Primary Offerings
                    </button>
                    <button 
                        onClick={() => setActiveTab('secondary')}
                        className={`pb-4 px-6 text-xs uppercase tracking-widest font-bold transition-colors ${activeTab === 'secondary' ? 'border-b-2 border-emerald-500 text-stone-900' : 'text-stone-400 hover:text-stone-600'}`}
                    >
                        Secondary Market (P2P)
                        <span className="ml-2 bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full text-[9px]">{secondaryListings.length}</span>
                    </button>
                </div>

                {/* TAB 1: PRIMARY OFFERINGS */}
                {activeTab === 'primary' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
                        {primaryProperties.map(property => {
                            const shares = property.property_shares[0];
                            const coverImage = property.property_images?.[0]?.image_url || '/placeholder.jpg';
                            const percentFunded = ((shares.total_shares - shares.available_shares) / shares.total_shares) * 100;

                            return (
                                <div key={property.property_id} className="bg-white border border-stone-200 group overflow-hidden hover:shadow-xl transition-all">
                                    <div className="h-56 relative overflow-hidden">
                                        <img src={coverImage} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 text-[10px] uppercase tracking-widest font-bold text-emerald-700 shadow-sm">
                                            {shares.projected_roi}% ROI
                                        </div>
                                    </div>
                                    
                                    <div className="p-6">
                                        <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">{property.locations?.[0]?.city || 'Premium Location'}</p>
                                        <h3 className="font-serif text-xl text-stone-900 mb-4 line-clamp-1">{property.title}</h3>
                                        
                                        <div className="space-y-4 mb-6">
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <p className="text-[10px] uppercase tracking-widest text-stone-400">Mint Price</p>
                                                    <p className="text-lg font-medium text-stone-900">{shares.price_per_share.toLocaleString()} <span className="text-xs text-stone-500">KES</span></p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] uppercase tracking-widest text-stone-400">Available</p>
                                                    <p className="text-lg font-medium text-emerald-600">{shares.available_shares} <span className="text-xs text-stone-500">/ {shares.total_shares}</span></p>
                                                </div>
                                            </div>

                                            <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                                                <div className="bg-emerald-500 h-full" style={{ width: `${percentFunded}%` }}></div>
                                            </div>
                                        </div>

                                        <button 
                                            onClick={() => openPurchaseModal(property, 'primary')}
                                            className="w-full py-4 border border-stone-900 text-stone-900 text-xs uppercase tracking-widest hover:bg-stone-900 hover:text-white transition-colors"
                                        >
                                            Buy Original Shares
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                        {primaryProperties.length === 0 && (
                            <div className="col-span-full py-20 text-center border border-stone-200 border-dashed bg-white">
                                <p className="text-stone-500">No primary offerings available right now.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* TAB 2: SECONDARY MARKET */}
                {activeTab === 'secondary' && (
                    <div className="space-y-4 animate-in fade-in duration-500">
                        {secondaryListings.length === 0 ? (
                            <div className="py-20 text-center border border-stone-200 border-dashed bg-white">
                                <p className="text-stone-500">The secondary market is currently quiet. No peer-to-peer listings available.</p>
                            </div>
                        ) : (
                            secondaryListings.map(listing => {
                                const coverImage = listing.properties?.property_images?.[0]?.image_url || '/placeholder.jpg';
                                const isMyListing = currentUser?.id === listing.seller_id;
                                
                                return (
                                    <div key={listing.id} className="bg-white border border-stone-200 p-4 flex flex-col md:flex-row items-center gap-6 hover:shadow-md transition-shadow">
                                        <div className="w-full md:w-32 h-24 relative overflow-hidden flex-shrink-0">
                                            <img src={coverImage} alt={listing.properties?.title} className="w-full h-full object-cover" />
                                        </div>
                                        
                                        <div className="flex-1 w-full flex flex-col md:flex-row justify-between items-center gap-6">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-serif text-lg text-stone-900">{listing.properties?.title}</h3>
                                                    {listing.properties?.property_shares?.[0]?.smart_contract_address?.startsWith('0x') && (
                                                        <span className="bg-emerald-100 text-emerald-700 text-[8px] uppercase tracking-widest px-2 py-0.5 font-bold rounded-sm">On-Chain</span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-stone-500 mb-2">Listed by: {listing.users?.full_name || 'Anonymous Investor'}</p>
                                                <p className="text-[10px] text-stone-400 uppercase tracking-widest">{listing.properties?.locations?.[0]?.city}</p>
                                            </div>

                                            <div className="flex items-center gap-8 bg-stone-50 p-4 border border-stone-100 w-full md:w-auto">
                                                <div>
                                                    <p className="text-[9px] uppercase tracking-widest text-stone-500 mb-1">Block Size</p>
                                                    <p className="font-bold text-lg">{listing.shares_offered} <span className="text-xs font-normal">Shares</span></p>
                                                </div>
                                                <div>
                                                    <p className="text-[9px] uppercase tracking-widest text-stone-500 mb-1">Asking Price</p>
                                                    <p className="font-bold text-lg text-emerald-600">KES {listing.price_per_share.toLocaleString()}</p>
                                                </div>
                                            </div>

                                            <button 
                                                onClick={() => openPurchaseModal(listing, 'secondary')}
                                                disabled={isMyListing}
                                                className={`w-full md:w-auto px-8 py-4 text-xs uppercase tracking-widest transition-colors ${isMyListing ? 'bg-stone-200 text-stone-400 cursor-not-allowed' : 'bg-[#0D0D0D] text-white hover:bg-emerald-600'}`}
                                            >
                                                {isMyListing ? 'Your Listing' : 'Buy Shares'}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}
            </div>

            {/* Universal Checkout Modal */}
            {selectedAsset && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white max-w-md w-full p-8 relative shadow-2xl animate-in zoom-in-95 duration-200">
                        <button onClick={() => setSelectedAsset(null)} className="absolute top-4 right-4 text-stone-400 hover:text-black">✕</button>
                        
                        {purchaseState === 'success' ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">✓</div>
                                <h3 className="text-2xl font-serif mb-2">Investment Secured!</h3>
                                <p className="text-stone-500 text-sm mb-6">
                                    {purchaseType === 'primary' 
                                        ? "Your payment was received. The smart contract is minting your tokens on the Polygon blockchain."
                                        : "Payment received. The shares are being transferred from the seller to your portfolio."}
                                </p>
                                <button onClick={() => window.location.href = '/dashboard'} className="w-full bg-black text-white py-4 text-xs uppercase tracking-widest hover:bg-emerald-600 transition-colors">
                                    View Portfolio
                                </button>
                            </div>
                        ) : (
                            <>
                                <h3 className="font-serif text-2xl mb-1 text-stone-900">
                                    {purchaseType === 'primary' ? 'Purchase Original Shares' : 'Peer-to-Peer Purchase'}
                                </h3>
                                <p className="text-xs text-stone-500 uppercase tracking-widest mb-6">
                                    {purchaseType === 'primary' ? selectedAsset.title : selectedAsset.properties.title}
                                </p>
                                
                                <form onSubmit={handleBuyRequest} className="space-y-4">
                                    {purchaseType === 'primary' ? (
                                        // Primary Purchase Input
                                        <div>
                                            <label className="text-[10px] uppercase tracking-widest text-stone-400 block mb-1">Number of Shares</label>
                                            <input 
                                                type="number" 
                                                min="1" 
                                                max={selectedAsset.property_shares[0].available_shares} 
                                                value={sharesToBuy} 
                                                onChange={(e) => setSharesToBuy(parseInt(e.target.value) || 1)} 
                                                className="w-full bg-[#FAFAFA] border border-stone-200 p-3 outline-none text-center text-xl font-medium" 
                                            />
                                            <p className="text-right text-[10px] text-stone-400 mt-1">{selectedAsset.property_shares[0].available_shares} Available</p>
                                        </div>
                                    ) : (
                                        // Secondary Purchase Info (Fixed Block)
                                        <div className="bg-stone-50 border border-stone-200 p-4 text-center">
                                            <p className="text-[10px] uppercase tracking-widest text-stone-500 mb-1">Fixed Block Size</p>
                                            <p className="text-xl font-bold">{selectedAsset.shares_offered} Shares</p>
                                            <p className="text-xs text-stone-400 mt-1">Must be purchased entirely.</p>
                                        </div>
                                    )}
                                    
                                    <div className="bg-emerald-50 p-4 border border-emerald-100 flex justify-between items-center">
                                        <span className="text-sm text-emerald-800 font-bold">Total Amount:</span>
                                        <span className="text-xl font-medium text-emerald-700">
                                            {purchaseType === 'primary' 
                                                ? (sharesToBuy * selectedAsset.property_shares[0].price_per_share).toLocaleString() 
                                                : (selectedAsset.shares_offered * selectedAsset.price_per_share).toLocaleString()} KES
                                        </span>
                                    </div>

                                    <div>
                                        <label className="text-[10px] uppercase tracking-widest text-stone-400 block mb-1">M-Pesa Phone Number</label>
                                        <input 
                                            required 
                                            type="tel" 
                                            placeholder="254700000000" 
                                            value={mpesaPhone} 
                                            onChange={(e) => setMpesaPhone(e.target.value)} 
                                            className="w-full bg-[#FAFAFA] border border-stone-200 p-3 outline-none focus:border-emerald-500 font-mono" 
                                        />
                                        <p className="text-[10px] text-stone-400 mt-1">Make sure your phone is unlocked and nearby to enter the M-Pesa PIN.</p>
                                    </div>

                                    <button disabled={purchaseState !== 'idle'} type="submit" className="w-full bg-[#52B44B] hover:bg-[#42953D] text-white py-4 text-xs uppercase tracking-[0.2em] transition-colors disabled:opacity-50 mt-4 shadow-lg shadow-emerald-500/20">
                                        {purchaseState === 'idle' ? 'Pay with M-Pesa' : purchaseState === 'pushing' ? 'Initiating STK Push...' : 'Awaiting PIN on Phone...'}
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