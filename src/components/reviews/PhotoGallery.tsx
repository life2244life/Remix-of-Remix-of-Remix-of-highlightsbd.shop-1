import { useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface PhotoGalleryProps {
  images: string[];
  onOpen: (images: string[], index: number) => void;
}

export const PhotoStrip = ({ images, onOpen }: PhotoGalleryProps) => {
  if (images.length === 0) return null;
  return (
    <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
      {images.map((src, i) => (
        <motion.button
          key={src + i}
          type="button"
          onClick={() => onOpen(images, i)}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: i * 0.03 }}
          className="aspect-square overflow-hidden rounded-[12px] border border-border transition-transform hover:scale-[1.04]"
        >
          <img src={src} alt={`Customer photo ${i + 1}`} className="h-full w-full object-cover" loading="lazy" />
        </motion.button>
      ))}
    </div>
  );
};

interface LightboxProps {
  images: string[] | null;
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export const Lightbox = ({ images, index, onClose, onNavigate }: LightboxProps) => {
  useEffect(() => {
    if (!images) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNavigate((index + 1) % images.length);
      if (e.key === "ArrowLeft") onNavigate((index - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [images, index, onClose, onNavigate]);

  return (
    <AnimatePresence>
      {images && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/90 p-4"
          onClick={onClose}
        >
          <button type="button" className="absolute right-4 top-4 text-background" aria-label="Close">
            <X className="h-7 w-7" />
          </button>
          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onNavigate((index - 1 + images.length) % images.length); }}
              className="absolute left-4 text-background"
              aria-label="Previous"
            >
              <ChevronLeft className="h-9 w-9" />
            </button>
          )}
          <motion.img
            key={images[index]}
            src={images[index]}
            alt="Customer review"
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] max-w-[90vw] rounded-[14px] object-contain"
          />
          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onNavigate((index + 1) % images.length); }}
              className="absolute right-4 text-background"
              aria-label="Next"
            >
              <ChevronRight className="h-9 w-9" />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};