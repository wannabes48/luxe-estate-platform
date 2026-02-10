export default function PropertySpecs({ specs }: { specs: any }) {
  const items = [
    { label: "Bedrooms", value: specs.bedrooms },
    { label: "Baths", value: specs.bathrooms },
    { label: "Area", value: `${Number(specs.sq_ft).toLocaleString()} SQ FT` },
    { label: "Status", value: specs.status.replace('_', ' ') },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-b border-stone-100">
      {items.map((item, i) => (
        <div key={i}>
          <p className="text-[10px] uppercase tracking-[0.4em] text-stone-400 mb-3">{item.label}</p>
          <p className="font-sans text-xl font-bold text-[#0D0D0D]">{item.value}</p>
        </div>
      ))}
    </div>
  );
}