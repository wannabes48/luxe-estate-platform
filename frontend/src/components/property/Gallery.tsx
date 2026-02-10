"use client";
import { motion } from "framer-motion";
import { CldImage } from "next-cloudinary";

export default function Gallery({ images, mainImageId }: { images: any[], mainImageId: string }) {
  // We use the main property image for the large left pane
  const displayImages = images.slice(0, 5);

  return (
    <section className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-2 h-auto md:h-[80vh] px-2 pt-28 bg-white">
      {/* Featured Large Image */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="md:col-span-2 md:row-span-2 relative overflow-hidden"
      >
        <CldImage 
          width="1200"
          height="1600"
          src={mainImageId} 
          className="w-full h-full object-cover transition-transform duration-[2s] hover:scale-110" 
          alt="Architectural Feature" 
          priority
        />
      </motion.div>

      {/* Smaller Grid Images */}
      {displayImages.map((img, i) => (
        <div key={i} className="relative overflow-hidden group aspect-square md:aspect-auto">
          <CldImage 
            width="600"
            height="600"
            src={img.cloudinary_id} 
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" 
            alt={`Perspective ${i + 1}`}
          />
        </div>
      ))}
    </section>
  );
}