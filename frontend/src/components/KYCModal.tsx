"use client"
import { ShieldAlert, X } from 'lucide-react';
import Link from 'next/link';

interface KYCModalProps {
    isOpen: boolean;
    onClose: () => void;
    isMandatory?: boolean; // If true, hides the close button
}

export default function KYCModal({ isOpen, onClose, isMandatory = false }: KYCModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
                onClick={!isMandatory ? onClose : undefined} 
            />
            
            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-md p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
                {!isMandatory && (
                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 text-stone-400 hover:text-stone-900 transition-colors"
                    >
                        <X size={20} />
                    </button>
                )}

                <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mb-6">
                    <ShieldAlert size={24} />
                </div>

                <h3 className="text-2xl font-serif text-stone-900 mb-2">
                    {isMandatory ? "Action Restricted" : "Secure Your Portfolio"}
                </h3>
                
                <p className="text-sm text-stone-500 leading-relaxed mb-8">
                    {isMandatory 
                        ? "To comply with CMA regulations, you must verify your identity before executing any fractional transactions."
                        : "Your account is currently unverified. While you can browse the dashboard, you will need to upload your ID to unlock trading."}
                </p>

                <div className="flex flex-col gap-3">
                    <Link 
                        href="/dashboard/kyc"
                        className="w-full bg-[#0D0D0D] text-white text-center py-4 text-[10px] uppercase tracking-widest font-bold hover:bg-emerald-600 transition-colors"
                    >
                        Verify Identity Now
                    </Link>
                    
                    {!isMandatory && (
                        <button 
                            onClick={onClose}
                            className="w-full py-4 text-[10px] uppercase tracking-widest font-bold text-stone-500 hover:text-stone-900 transition-colors"
                        >
                            I'll do this later
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
