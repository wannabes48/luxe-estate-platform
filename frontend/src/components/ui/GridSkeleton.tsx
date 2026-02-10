import React from 'react'

const GridSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="animate-pulse bg-stone-50 rounded-md h-80" />
    ))}
  </div>
)

export default GridSkeleton
