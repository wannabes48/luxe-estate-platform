/* src/components/PropertyMap.tsx */

export default function PropertyMap({ locationName, city }: { locationName: string; city: string }) {
  // We combine the specific location name and city for accuracy
  const mapQuery = encodeURIComponent(`${locationName}, ${city}, Kenya`);
  const iframeSrc = `https://www.google.com/maps/embed/v1/place?key=YOUR_FREE_EMBED_API_KEY&q=${mapQuery}`;
  
  // Alternative: If you don't have an API key yet, use the search embed (less precise but free)
  const freeSrc = `https://maps.google.com/maps?q=${mapQuery}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

  return (
    <section className="mt-20">
      <h3 className="font-serif text-2xl mb-6 text-[#0D0D0D]">Location & Context</h3>
      <div className="w-full h-[500px] bg-stone-100 grayscale hover:grayscale-0 transition-all duration-700 rounded-sm overflow-hidden border border-stone-200">
        <iframe
          width="100%"
          height="100%"
          frameBorder="0"
          style={{ border: 0 }}
          src={freeSrc}
          allowFullScreen
          loading="lazy"
        ></iframe>
      </div>
      <p className="mt-4 text-[10px] uppercase tracking-widest text-stone-400">
        {locationName}, {city}
      </p>
    </section>
  );
}