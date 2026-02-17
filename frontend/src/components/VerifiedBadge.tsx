import React from 'react';

export default function VerifiedBadge({ className = "w-4 h-4" }: { className?: string }) {
    return (
        <div className={`bg-blue-500 rounded-full flex items-center justify-center text-white ${className}`} title="Verified Professional">
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-2/3 h-2/3"
            >
                <polyline points="20 6 9 17 4 12" />
            </svg>
        </div>
    );
}
