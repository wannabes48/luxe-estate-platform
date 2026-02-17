"use client"
import VerifiedBadge from './VerifiedBadge';

export default function AgentAvatar({ src, name, isVerified }: { src: string; name: string; isVerified?: boolean }) {
  const fallbackImage = 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200&h=200&fit=crop';
  return (
    <div className="relative h-20 w-20 mb-6">
      <div className="h-full w-full overflow-hidden rounded-full bg-stone-50">
        <img
          src={src || fallbackImage}
          alt={name}
          className="h-full w-full object-cover transition-all duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = fallbackImage; // Fallback if image fails
          }}
        />
      </div>
      {isVerified && (
        <div className="absolute -bottom-1 -right-1 z-10">
          <VerifiedBadge className="w-6 h-6 border-2 border-white" />
        </div>
      )}
    </div>
  );
}