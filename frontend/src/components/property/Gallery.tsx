"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CldImage } from "next-cloudinary";

export default function Gallery({ images, mainImageId }: { images: any[], mainImageId: string }) {
  // 1. State to track the active fullscreen image
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Filter out any images without a valid source and limit to 5 for the grid
  const validImages = images.filter(img => img.image_url || img.cloudinary_id);
  const mainImage = validImages.find(img => img.cloudinary_id === mainImageId) || validImages[0];
  const gridImages = validImages.slice(1, 5);

  if (!mainImage) return null;

  return (
    <section className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-2 h-auto md:h-[80vh] px-2 pt-28 bg-white">
      
      {/* Featured Large Image (Left Pane) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        onClick={() => setSelectedImage(mainImage.image_url || mainImage.cloudinary_id)}
        className="md:col-span-2 md:row-span-2 relative overflow-hidden cursor-zoom-in"
      >
        <CldImage 
          width="1200"
          height="1600"
          src={mainImage.cloudinary_id || mainImage.image_url} 
          className="w-full h-full object-cover transition-transform duration-[2s] hover:scale-110" 
          alt="Main Architectural Feature" 
          priority
        />
      </motion.div>

      {/* Smaller Grid Images (Right Panes) */}
      {gridImages.map((img, i) => (
        <div 
          key={img.id || i} 
          onClick={() => setSelectedImage(img.image_url || img.cloudinary_id)}
          className="relative overflow-hidden group aspect-square md:aspect-auto cursor-zoom-in"
        >
          <CldImage 
            width="600"
            height="600"
            src={img.cloudinary_id || img.image_url} 
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" 
            alt={`Perspective ${i + 1}`}
          />
        </div>
      ))}

      {/* 2. Lightbox Overlay */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-10 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full h-full flex items-center justify-center"
            >
              <CldImage
                width="1600"
                height="1200"
                src={selectedImage}
                alt="Full View"
                className="max-w-full max-h-full object-contain"
              />
              <button className="absolute top-0 right-0 text-white text-[10px] uppercase tracking-[0.3em] p-4">
                Close [×]
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}