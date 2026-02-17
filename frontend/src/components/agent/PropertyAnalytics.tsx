import React from 'react';

interface PropertyAnalyticsProps {
    views: number;
    leads: number;
}

export default function PropertyAnalytics({ views, leads }: PropertyAnalyticsProps) {
    const conversionRate = views > 0 ? ((leads / views) * 100).toFixed(1) : '0.0';

    return (
        <div className="flex gap-4 mt-4 text-xs font-mono text-stone-500 bg-stone-50 p-3 rounded-sm border border-stone-100">
            <div className="flex items-center gap-2">
                <span className="uppercase tracking-widest text-[9px]">Views</span>
                <span className="text-black font-bold">{views.toLocaleString()}</span>
            </div>
            <div className="w-px h-4 bg-stone-300"></div>
            <div className="flex items-center gap-2">
                <span className="uppercase tracking-widest text-[9px]">Conv. Rate</span>
                <span className={`font-bold ${parseFloat(conversionRate) > 1 ? 'text-green-600' : 'text-black'}`}>
                    {conversionRate}%
                </span>
            </div>
        </div>
    );
}
