import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const PhotoGallery = ({ images }: { images: string[] }) => {
  const [index, setIndex] = useState<number | null>(null);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIndex(null);
      if (e.key === "ArrowRight") setIndex((i) => (i === null ? i : (i + 1) % images.length));
      if (e.key === "ArrowLeft") setIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, images.length]);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {images.map((src, i) => (
          <motion.button
            key={src}
            type="button"
            onClick={() => setIndex(i)}
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: (i % 5) * 0.05 }}
            className="group relative aspect-square overflow-hidden rounded-2xl border border-border"
          >
            <img
              src={src}
              alt={`Customer photo ${i + 1}`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-foreground/0 transition-colors group-hover:bg-foreground/10" />
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {index !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/90 p-4"
            onClick={() => setIndex(null)}
          >
            <button type="button" className="absolute right-4 top-4 text-background" aria-label="Close">
              <X className="h-7 w-7" />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length)); }}
              className="absolute left-4 text-background"
              aria-label="Previous"
            >
              <ChevronLeft className="h-9 w-9" />
            </button>
            <motion.img
              key={images[index]}
              src={images[index]}
              alt="Customer review"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85vh] max-w-[90vw] rounded-2xl object-contain"
            />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setIndex((i) => (i === null ? i : (i + 1) % images.length)); }}
              className="absolute right-4 text-background"
              aria-label="Next"
            >
              <ChevronRight className="h-9 w-9" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PhotoGallery;