import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ZoomIn, X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import type { ProductBadge, ProductImageGalleryProps } from "./types";

/* ----------------------------- Badge styles ----------------------------- */
const BADGE_STYLES: Record<ProductBadge, string> = {
  NEW: "bg-foreground text-background",
  BESTSELLER: "bg-amber-500 text-white",
  LIMITED: "bg-purple-600 text-white",
  HOT: "bg-red-600 text-white",
};

/* --------------------------- Image with skeleton ------------------------ */
const SmartImage = ({
  src,
  alt,
  className,
  imgClassName,
  draggable = false,
  onClick,
  style,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  draggable?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}) => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => setLoaded(false), [src]);
  return (
    <div className={cn("relative overflow-hidden bg-muted", className)} onClick={onClick}>
      {!loaded && <div className="absolute inset-0 animate-pulse bg-muted" />}
      <img
        src={src}
        alt={alt}
        draggable={draggable}
        onLoad={() => setLoaded(true)}
        style={style}
        className={cn(
          "h-full w-full object-cover transition-opacity duration-500",
          loaded ? "opacity-100" : "opacity-0",
          imgClassName,
        )}
      />
    </div>
  );
};

/* ------------------------------ Skeleton -------------------------------- */
const GallerySkeleton = () => (
  <div className="flex gap-4">
    <div className="hidden lg:flex flex-col gap-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-[112px] w-[90px] rounded-xl bg-muted animate-pulse" />
      ))}
    </div>
    <div className="flex-1 aspect-[4/5] lg:h-[700px] rounded-2xl bg-muted animate-pulse" />
  </div>
);

/* ============================== Lightbox ================================ */
const Lightbox = ({
  images,
  index,
  alt,
  onClose,
  onNavigate,
}: {
  images: { id: string; url: string; alt: string }[];
  index: number;
  alt: string;
  onClose: () => void;
  onNavigate: (i: number) => void;
}) => {
  const prev = useCallback(
    () => onNavigate((index - 1 + images.length) % images.length),
    [index, images.length, onNavigate],
  );
  const next = useCallback(
    () => onNavigate((index + 1) % images.length),
    [index, images.length, onNavigate],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, prev, next]);

  return (
    <motion.div
      className="fixed inset-0 z-[120] flex flex-col bg-black/95 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/20"
        aria-label="Close"
      >
        <X size={22} />
      </button>

      <div className="relative flex flex-1 items-center justify-center px-4 sm:px-16" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={prev}
          className="absolute left-2 sm:left-6 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
          aria-label="Previous image"
        >
          <ChevronLeft size={24} />
        </button>

        <AnimatePresence mode="wait">
          <motion.img
            key={images[index].id}
            src={images[index].url}
            alt={images[index].alt || alt}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="max-h-[80vh] max-w-full object-contain"
            draggable={false}
          />
        </AnimatePresence>

        <button
          onClick={next}
          className="absolute right-2 sm:right-6 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
          aria-label="Next image"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Thumbnail strip */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto px-4 pb-6 pt-2" onClick={(e) => e.stopPropagation()}>
        {images.map((img, i) => (
          <button
            key={img.id}
            onClick={() => onNavigate(i)}
            className={cn(
              "h-16 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition-all",
              i === index ? "border-white" : "border-transparent opacity-50 hover:opacity-100",
            )}
          >
            <img src={img.url} alt={img.alt} className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </motion.div>
  );
};

/* ========================= Product Image Gallery ======================== */
const ProductImageGallery = ({ product, className, zoomLevel = 2 }: ProductImageGalleryProps) => {
  const images = product.images;
  const isMobile = useIsMobile();
  const [activeIndex, setActiveIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Desktop zoom
  const [zoomed, setZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const mainRef = useRef<HTMLDivElement>(null);

  // Mobile slider
  const sliderRef = useRef<HTMLDivElement>(null);

  // Simulate gallery container loading
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 550);
    return () => clearTimeout(t);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!mainRef.current) return;
    const rect = mainRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  }, []);

  // Track mobile slider active dot
  const handleSliderScroll = useCallback(() => {
    const el = sliderRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    setActiveIndex(Math.min(images.length - 1, Math.max(0, idx)));
  }, [images.length]);

  if (!ready) {
    return (
      <div className={className}>
        <GallerySkeleton />
      </div>
    );
  }

  const Badges = () =>
    product.badges && product.badges.length > 0 ? (
      <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5">
        {product.badges.map((b) => (
          <span
            key={b}
            className={cn(
              "rounded-md px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] shadow-sm",
              BADGE_STYLES[b],
            )}
          >
            {b}
          </span>
        ))}
      </div>
    ) : null;

  /* ------------------------------ MOBILE ------------------------------- */
  if (isMobile) {
    return (
      <div className={className}>
        <div className="relative">
          <div
            ref={sliderRef}
            onScroll={handleSliderScroll}
            className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            style={{ touchAction: "pan-x pan-y" }}
          >
            {images.map((img) => (
              <div key={img.id} className="w-full shrink-0 snap-center">
                <SmartImage
                  src={img.url}
                  alt={img.alt}
                  className="h-[450px] w-full"
                  onClick={() => setLightboxOpen(true)}
                />
              </div>
            ))}
          </div>

          <Badges />

          {/* Counter overlay */}
          <div className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
            {activeIndex + 1} / {images.length}
          </div>

          {/* Fullscreen hint */}
          <button
            onClick={() => setLightboxOpen(true)}
            className="absolute bottom-3 left-3 rounded-full bg-black/60 p-2 text-white backdrop-blur-sm"
            aria-label="Open fullscreen"
          >
            <Maximize2 size={15} />
          </button>
        </div>

        {/* Pagination dots */}
        <div className="mt-3 flex items-center justify-center gap-1.5">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => {
                sliderRef.current?.scrollTo({ left: i * (sliderRef.current?.clientWidth || 0), behavior: "smooth" });
              }}
              aria-label={`Go to image ${i + 1}`}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === activeIndex ? "w-5 bg-foreground" : "w-1.5 bg-muted-foreground/40",
              )}
            />
          ))}
        </div>

        <AnimatePresence>
          {lightboxOpen && (
            <Lightbox
              images={images}
              index={activeIndex}
              alt={product.name}
              onClose={() => setLightboxOpen(false)}
              onNavigate={setActiveIndex}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }

  /* ------------------------------ DESKTOP ------------------------------ */
  return (
    <motion.div
      className={cn("flex gap-4", className)}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Vertical thumbnails */}
      <div className="flex max-h-[700px] flex-col gap-3 overflow-y-auto pr-1 [scrollbar-width:thin]">
        {images.map((img, i) => (
          <button
            key={img.id}
            onClick={() => setActiveIndex(i)}
            onMouseEnter={() => setActiveIndex(i)}
            title={img.label}
            className={cn(
              "group relative shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-300",
              i === activeIndex
                ? "border-foreground"
                : "border-transparent opacity-60 hover:opacity-100",
            )}
            style={{ width: 90, height: 112 }}
          >
            <img
              src={img.url}
              alt={img.alt}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </button>
        ))}
      </div>

      {/* Main image with magnifier zoom */}
      <div className="flex-1">
        <div
          ref={mainRef}
          className="group relative h-[700px] cursor-zoom-in overflow-hidden rounded-2xl border border-border bg-muted"
          onMouseEnter={() => setZoomed(true)}
          onMouseLeave={() => setZoomed(false)}
          onMouseMove={handleMouseMove}
          onClick={() => setLightboxOpen(true)}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={images[activeIndex].id}
              src={images[activeIndex].url}
              alt={images[activeIndex].alt}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              draggable={false}
              className="h-full w-full object-cover"
              style={
                zoomed
                  ? { transform: `scale(${zoomLevel})`, transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` }
                  : undefined
              }
            />
          </AnimatePresence>

          <Badges />

          {/* Zoom indicator */}
          <div className="pointer-events-none absolute right-3 top-3 z-10 rounded-full bg-black/55 p-2 text-white opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
            <ZoomIn size={16} />
          </div>

          {/* Counter overlay (bottom right) */}
          <div className="absolute bottom-3 right-3 z-10 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
            Image {activeIndex + 1} of {images.length}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {lightboxOpen && (
          <Lightbox
            images={images}
            index={activeIndex}
            alt={product.name}
            onClose={() => setLightboxOpen(false)}
            onNavigate={setActiveIndex}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProductImageGallery;