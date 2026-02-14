/* src/components/AgentAvatar.tsx */
'use client'; // This tells Next.js this component is interactive

export default function AgentAvatar({ src, name }: { src: string; name: string }) {
    const fallbackImage = 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200&h=200&fit=crop';
    return (
    <div className="relative h-20 w-20 overflow-hidden rounded-full bg-stone-50 mb-6">
      <img 
        src={src || fallbackImage}
        alt={name}
        className="h-full w-full object-cover transition-all duration-500"
        onError={(e) => {
          (e.target as HTMLImageElement).src = 'fallbackImage'; // Fallback if image fails
        }}
      />
    </div>
  );
}