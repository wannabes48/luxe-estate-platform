import React from 'react';
import { ShieldCheck, ShieldAlert } from 'lucide-react';

interface GetVerifiedBadgeProps {
    isVerified: boolean;
    onVerifyClick?: () => void;
}

export default function GetVerifiedBadge({ isVerified, onVerifyClick }: GetVerifiedBadgeProps) {
    if (isVerified) {
        return (
            <div className="flex items-center gap-2 bg-[#F5F5F0] text-[#D4AF37] px-4 py-2 rounded-full border border-[#D4AF37]/20">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[10px] uppercase tracking-widest font-bold text-stone-800">Verified Agent</span>
            </div>
        );
    }

    return (
        <button
            onClick={onVerifyClick}
            className="group flex items-center gap-2 bg-white text-stone-400 px-4 py-2 rounded-full border border-stone-200 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all duration-300"
        >
            <ShieldAlert className="w-4 h-4" />
            <span className="text-[10px] uppercase tracking-widest font-bold group-hover:text-[#D4AF37]">Verify Identity</span>
        </button>
    );
}
