"use client"
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import ReturnNavBar from '@/components/ReturnNavBar';
import Footer from '@/components/Footer';

export default function PropertyDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const propertyId = params.id as string;

    const [property, setProperty] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);

    // Purchase State
    const [sharesToBuy, setSharesToBuy] = useState(1);
    const [mpesaPhone, setMpesaPhone] = useState('');
    const [purchaseState, setPurchaseState] = useState<'idle' | 'pushing' | 'waiting' | 'success'>('idle');

    useEffect(() => {
        async function fetchProperty() {
            if (!propertyId) return;

            const { data, error } = await supabase
                .from('properties')
                .select(`
                    *,
                    locations(city),
                    property_images(image_url),
                    property_shares(*)
                `)
                .eq('property_id', propertyId)
                .single();

            if (error || !data) {
                console.error("Fetch error:", error?.message|| error);
                router.push('/invest'); // Redirect if not found
            } else {
                setProperty(data);
            }
            setLoading(false);
        }

        fetchProperty();
    }, [propertyId, router]);

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

            const shareData = property.property_shares[0];
            const totalAmount = sharesToBuy * shareData.price_per_share;

            const response = await fetch('/api/mpesa/push', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phoneNumber: mpesaPhone,
                    amount: totalAmount,
                    propertyId: property.property_id,
                    userId: user.id,
                    purchaseType: 'primary',
                    listingId: null
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

    if (loading) return <div className="min-h-screen flex items-center justify-center text-xs uppercase tracking-widest animate-pulse bg-[#FAFAFA]">Loading Asset...</div>;
    if (!property) return null;

    const shareData = property.property_shares?.[0];
    const images = property.property_images?.length > 0 ? property.property_images : [{ image_url: '/placeholder.jpg' }];
    const percentFunded = shareData ? ((shareData.total_shares - shareData.available_shares) / shareData.total_shares) * 100 : 0;

    return (
        <main className="min-h-screen bg-[#FAFAFA]">
            <ReturnNavBar />
            
            <div className="max-w-7xl mx-auto px-6 py-24">
                {/* Back Button */}
                <button onClick={() => router.back()} className="text-[10px] uppercase tracking-widest text-stone-500 hover:text-stone-900 mb-8 flex items-center gap-2">
                    ← Back to Marketplace
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    
                    {/* LEFT COLUMN: Gallery & Details */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* Title Section */}
                        <div>
                            <span className="text-[10px] uppercase tracking-widest text-emerald-600 font-bold mb-2 block">
                                {property.locations?.[0]?.city || 'Premium Location'}
                            </span>
                            <h1 className="text-4xl md:text-5xl font-serif text-stone-900 mb-4 leading-tight">{property.title}</h1>
                            <p className="text-stone-500 max-w-2xl leading-relaxed">{property.description || 'A masterpiece of modern architecture, offering unparalleled luxury and high-yield fractional equity potential.'}</p>
                        </div>

                        {/* Interactive Gallery */}
                        <div className="space-y-4">
                            <div className="w-full h-[400px] md:h-[500px] bg-stone-100 overflow-hidden relative">
                                <img 
                                    src={images[activeImage].image_url} 
                                    alt="Property Main" 
                                    className="w-full h-full object-cover transition-opacity duration-500"
                                />
                            </div>
                            <div className="flex gap-4 overflow-x-auto pb-2">
                                {images.map((img: any, idx: number) => (
                                    <button 
                                        key={idx} 
                                        onClick={() => setActiveImage(idx)}
                                        className={`w-24 h-24 flex-shrink-0 overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-emerald-500 opacity-100' : 'border-transparent opacity-50 hover:opacity-100'}`}
                                    >
                                        <img src={img.image_url} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Financial Highlights */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-stone-200">
                            <div>
                                <p className="text-[9px] uppercase tracking-widest text-stone-400 mb-1">Projected ROI</p>
                                <p className="text-2xl font-serif text-emerald-600">{shareData?.projected_roi || '0'}%</p>
                            </div>
                            <div>
                                <p className="text-[9px] uppercase tracking-widest text-stone-400 mb-1">Asset Status</p>
                                <p className="text-sm font-medium text-stone-900 mt-2">{property.status.replace('_', ' ')}</p>
                            </div>
                            <div>
                                <p className="text-[9px] uppercase tracking-widest text-stone-400 mb-1">Smart Contract</p>
                                {shareData?.smart_contract_address?.startsWith('0x') ? (
                                    <a href={`https://amoy.polygonscan.com/address/${shareData.smart_contract_address}`} target="_blank" rel="noreferrer" className="text-xs text-stone-900 underline mt-2 block hover:text-emerald-600">View on Polygon ↗</a>
                                ) : (
                                    <p className="text-xs text-stone-400 mt-2">Pending Deploy</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Sticky Investment Module */}
                    <div className="relative">
                        <div className="sticky top-24 bg-white border border-stone-200 p-8 shadow-xl">
                            {purchaseState === 'success' ? (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">✓</div>
                                    <h3 className="text-2xl font-serif mb-2">Investment Secured!</h3>
                                    <p className="text-stone-500 text-sm mb-6">Payment received. Tokens are minting to your portfolio.</p>
                                    <button onClick={() => router.push('/dashboard')} className="w-full bg-black text-white py-4 text-xs uppercase tracking-widest hover:bg-emerald-600 transition-colors">
                                        View Portfolio
                                    </button>
                                </div>
                            ) : !shareData ? (
                                <div className="text-center py-10">
                                    <p className="text-stone-500">This property is not currently available for fractional investment.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="mb-8">
                                        <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">Price per share</p>
                                        <h2 className="text-4xl font-serif text-stone-900">KES {shareData.price_per_share.toLocaleString()}</h2>
                                    </div>

                                    {/* Funding Progress */}
                                    <div className="mb-8">
                                        <div className="flex justify-between text-[10px] uppercase tracking-widest mb-2">
                                            <span className="text-emerald-600 font-bold">{shareData.total_shares - shareData.available_shares} Sold</span>
                                            <span className="text-stone-400">{shareData.available_shares} Available</span>
                                        </div>
                                        <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                                            <div className="bg-emerald-500 h-full transition-all duration-1000" style={{ width: `${percentFunded}%` }}></div>
                                        </div>
                                    </div>

                                    <form onSubmit={handleBuyRequest} className="space-y-5">
                                        <div>
                                            <label className="text-[10px] uppercase tracking-widest text-stone-400 block mb-2 font-bold">Number of Shares</label>
                                            <input 
                                                type="number" 
                                                min="1" 
                                                max={shareData.available_shares} 
                                                value={sharesToBuy} 
                                                onChange={(e) => setSharesToBuy(parseInt(e.target.value) || 1)} 
                                                className="w-full bg-[#FAFAFA] border border-stone-200 p-4 outline-none text-center text-xl font-medium focus:border-emerald-500 transition-colors" 
                                            />
                                        </div>
                                        
                                        <div className="bg-stone-50 p-4 border border-stone-100 flex justify-between items-center">
                                            <span className="text-xs text-stone-500 uppercase tracking-widest">Total:</span>
                                            <span className="text-xl font-bold text-emerald-700">
                                                {(sharesToBuy * shareData.price_per_share).toLocaleString()} KES
                                            </span>
                                        </div>

                                        <div>
                                            <label className="text-[10px] uppercase tracking-widest text-stone-400 block mb-2 font-bold">M-Pesa Phone Number</label>
                                            <input 
                                                required 
                                                type="tel" 
                                                placeholder="2547..." 
                                                value={mpesaPhone} 
                                                onChange={(e) => setMpesaPhone(e.target.value)} 
                                                className="w-full bg-[#FAFAFA] border border-stone-200 p-4 outline-none focus:border-emerald-500 font-mono" 
                                            />
                                        </div>

                                        <button 
                                            disabled={purchaseState !== 'idle' || shareData.available_shares === 0} 
                                            type="submit" 
                                            className="w-full bg-[#0D0D0D] text-white py-5 text-xs uppercase tracking-widest hover:bg-emerald-600 transition-colors disabled:opacity-50 mt-4 font-bold shadow-xl"
                                        >
                                            {purchaseState === 'idle' ? 'Invest via M-Pesa' : purchaseState === 'pushing' ? 'Initiating STK...' : 'Awaiting PIN...'}
                                        </button>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>

                </div>
            </div>
            <Footer />
        </main>
    );
}