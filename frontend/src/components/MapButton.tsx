'use client';

export default function MapButton({ address, name }: { address: string; name: string }) {
  const handleFindOnMap = () => {
    // Encodes the address to be URL-safe
    const query = encodeURIComponent(`${name}, ${address}`);
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
    
    // Opens the map in a new tab
    window.open(mapUrl, '_blank');
  };

  return (
    <button 
      onClick={handleFindOnMap}
      className="text-[10px] uppercase tracking-widest text-[#E91E63] font-bold hover:underline flex items-center gap-2"
    >
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      Find on Map
    </button>
  );
}