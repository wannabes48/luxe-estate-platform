import React from 'react'

export default function PropertySchema({ property }: { property: any }) {
  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'RealEstateListing',
    name: property.title,
    description: property.description,
    priceCurrency: 'KSH',
    price: property.price,
    address: {
      '@type': 'PostalAddress',
      addressLocality: property.location?.name || property.location,
      addressRegion: property.location?.city || undefined,
    },
    image: (property.images || []).map((img: any) => img.image_url),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
