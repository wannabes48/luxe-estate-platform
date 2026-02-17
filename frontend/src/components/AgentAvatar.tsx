"use client"
import VerifiedBadge from './VerifiedBadge';

export default function AgentAvatar({
  src,
  name,
  isVerified,
  size = 'md'
}: {
  src: string;
  name: string;
  isVerified?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}) {
  const fallbackImage = 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200&h=200&fit=crop';

  const sizeClasses = {
    sm: 'h-10 w-10',
    md: 'h-20 w-20',
    lg: 'h-32 w-32',
    xl: 'h-40 w-40'
  };

  return (
    <div className={`relative ${sizeClasses[size]} mb-6 shrink-0`}>
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