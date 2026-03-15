// src/components/EcoBadge.tsx

export function EcoBadge({ green_score }: { green_score: number }) {
  if (green_score < 50) return null;

  const isElite = green_score >= 80;

  return (
    <div 
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-[0.2em] font-medium border shadow-sm transition-all
        ${isElite 
          ? 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-emerald-100' 
          : 'bg-stone-50 text-stone-600 border-stone-200'
        }`}
    >
      <svg 
        className={`w-3.5 h-3.5 ${isElite ? 'text-emerald-600' : 'text-stone-500'}`} 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
      <span>
        {isElite ? 'Elite Green Certified' : 'Eco-Friendly'} • {green_score}/100
      </span>
    </div>
  );
}