"use client"
import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface SellModalProps {
    isOpen: boolean;
    onClose: () => void;
    propertyId: string;
    propertyTitle: string;
    maxShares: number;
    originalPrice: number;
    userId: string;
    onSuccess: () => void;
}

export default function SellSharesModal({ isOpen, onClose, propertyId, propertyTitle, maxShares, originalPrice, userId, onSuccess }: SellModalProps) {
    const [sharesToSell, setSharesToSell] = useState<number | ''>('');
    const [askingPrice, setAskingPrice] = useState<number | ''>(originalPrice);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const shares = Number(sharesToSell);
        const price = Number(askingPrice);

        if (shares <= 0 || shares > maxShares) {
            setError(`Please enter a valid number of shares (1 - ${maxShares}).`);
            return;
        }
        if (price <= 0) {
            setError("Asking price must be greater than 0.");
            return;
        }

        setIsSubmitting(true);

        try {
            // Insert the listing into the new secondary market table
            const { error: insertError } = await supabase
                .from('secondary_listings')
                .insert({
                    seller_id: userId,
                    property_id: propertyId,
                    shares_offered: shares,
                    price_per_share: price,
                    status: 'active'
                });

            if (insertError) throw insertError;
            
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.message || "Failed to list shares on the market.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Calculate potential profit/loss
    const totalExpected = Number(sharesToSell || 0) * Number(askingPrice || 0);
    const profitMargin = Number(askingPrice || 0) - originalPrice;
    const isProfit = profitMargin >= 0;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-[#FAFAFA]">
                    <div>
                        <h3 className="font-serif text-2xl text-stone-900">List on Market</h3>
                        <p className="text-xs text-stone-500 uppercase tracking-widest mt-1 line-clamp-1">{propertyTitle}</p>
                    </div>
                    <button onClick={onClose} className="text-stone-400 hover:text-stone-900 text-2xl">&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && <div className="p-3 bg-red-50 text-red-600 text-xs rounded border border-red-100">{error}</div>}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest text-stone-500 mb-2">
                                Shares to Sell (Max: {maxShares})
                            </label>
                            <input 
                                type="number" 
                                max={maxShares}
                                min="1"
                                required
                                className="w-full bg-[#FAFAFA] border border-stone-200 p-4 text-lg outline-none focus:border-emerald-500 transition-colors rounded-lg"
                                value={sharesToSell}
                                onChange={(e) => setSharesToSell(e.target.value ? Number(e.target.value) : '')}
                                placeholder="e.g. 5"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] uppercase tracking-widest text-stone-500 mb-2">
                                Asking Price Per Share (KES)
                            </label>
                            <input 
                                type="number" 
                                min="1"
                                required
                                className="w-full bg-[#FAFAFA] border border-stone-200 p-4 text-lg font-mono outline-none focus:border-emerald-500 transition-colors rounded-lg"
                                value={askingPrice}
                                onChange={(e) => setAskingPrice(e.target.value ? Number(e.target.value) : '')}
                            />
                            <p className="text-[10px] text-stone-400 mt-2">Original purchase price: KES {originalPrice.toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="bg-stone-50 p-4 rounded-lg border border-stone-100">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs text-stone-500">Total Expected Payout:</span>
                            <span className="font-mono font-bold text-lg">KES {totalExpected.toLocaleString()}</span>
                        </div>
                        {sharesToSell !== '' && askingPrice !== '' && (
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-stone-500">Estimated Margin:</span>
                                <span className={`text-xs font-bold px-2 py-1 rounded ${isProfit ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                    {isProfit ? '+' : ''}{profitMargin.toLocaleString()} KES / share
                                </span>
                            </div>
                        )}
                    </div>

                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full bg-[#0D0D0D] text-white py-4 text-xs uppercase tracking-[0.2em] hover:bg-emerald-600 transition-colors disabled:opacity-50 rounded-lg"
                    >
                        {isSubmitting ? 'Listing Asset...' : 'Confirm Listing'}
                    </button>
                </form>
            </div>
        </div>
    );
}