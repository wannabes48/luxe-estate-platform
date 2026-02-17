"use client"
import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface LuxuryToastProps {
    message: string;
    isVisible: boolean;
    onClose: () => void;
    type?: 'success' | 'error';
}

export default function LuxuryToast({ message, isVisible, onClose, type = 'success' }: LuxuryToastProps) {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    if (!isVisible) return null;

    const bgColor = type === 'success' ? 'bg-[#0D0D0D]' : 'bg-red-900';
    const borderColor = type === 'success' ? 'border-[#D4AF37]' : 'border-red-700';

    return (
        <div className={`fixed bottom-8 right-8 z-50 animate-in slide-in-from-bottom-5 fade-in duration-500`}>
            <div className={`${bgColor} text-white px-8 py-6 shadow-2xl border-l-4 ${borderColor} flex items-center gap-6 min-w-[300px]`}>
                <div className="flex-1">
                    <p className={`text-[10px] uppercase tracking-[0.2em] mb-1 ${type === 'success' ? 'text-[#D4AF37]' : 'text-red-400'}`}>
                        {type === 'success' ? 'Success' : 'Notice'}
                    </p>
                    <p className="font-serif text-lg">{message}</p>
                </div>
                <button onClick={onClose} className="text-stone-500 hover:text-white transition-colors">
                    <X size={18} />
                </button>
            </div>
        </div>
    );
}
