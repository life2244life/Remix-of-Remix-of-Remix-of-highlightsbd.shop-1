import { useMemo, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Zap } from "lucide-react";
import { motion } from "framer-motion";
import CountdownTimer from "./CountdownTimer";
import SaleProductCard from "./SaleProductCard";
import QuickViewModal from "./QuickViewModal";
import { FlashProduct, flashProducts, getSaleEnd } from "./mockData";
import { Skeleton } from "@/components/ui/skeleton";

const CardSkeleton = () => (
  <div className="w-[44vw] shrink-0 sm:w-[31%] md:w-[30%] lg:w-[23%] xl:w-[18.5%]">
    <Skeleton className="aspect-[3/4] w-full rounded-[14px]" />
    <Skeleton className="mt-3 h-3 w-1/3" />
    <Skeleton className="mt-2 h-4 w-3/4" />
    <Skeleton className="mt-2 h-4 w-1/2" />
    <Skeleton className="mt-3 h-1.5 w-full rounded-full" />
  </div>
);

interface FlashSaleSectionProps {
  loading?: boolean;
}

const FlashSaleSection = ({ loading = false }: FlashSaleSectionProps) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [quickView, setQuickView] = useState<FlashProduct | null>(null);
  const saleEnd = useMemo(() => getSaleEnd(), []);

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-destructive text-destructive-foreground">
            <Zap className="h-5 w-5" fill="currentColor" />
          </span>
          <div>
            <h2 className="text-2xl font-light text-foreground sm:text-3xl" style={{ fontFamily: "'Playfair Display', serif" }}>
              Flash Sale
            </h2>
            <p className="text-sm text-muted-foreground">Limited Time Deals</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-5 lg:justify-end">
          {loading ? (
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-12 rounded-[11px] sm:w-14" />
              ))}
            </div>
          ) : (
            <CountdownTimer target={saleEnd} />
          )}
          <button
            type="button"
            className="hidden items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-destructive sm:inline-flex"
          >
            View All <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Promo banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-8 overflow-hidden rounded-[18px] border border-border bg-foreground p-6 text-background sm:p-8"
      >
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-background/70">Limited Time Offer</p>
            <p className="mt-1 text-3xl font-light sm:text-4xl">
              UP TO <span className="font-semibold text-destructive">70% OFF</span>
            </p>
            <p className="mt-1 text-sm text-background/70">Shop before it ends — premium styles at flash prices.</p>
          </div>
          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex h-12 items-center gap-2 rounded-[14px] bg-destructive px-6 text-sm font-semibold text-destructive-foreground shadow-lg"
          >
            Shop Now <ArrowRight className="h-4 w-4" />
          </motion.button>
        </div>
      </motion.div>

      {/* Carousel */}
      <div className="relative mt-8">
        <div className="absolute -top-14 right-0 hidden gap-2 sm:flex">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label="Previous"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-muted"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label="Next"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-muted"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {loading
            ? Array.from({ length: 5 }).map((_, i) => <CardSkeleton key={i} />)
            : flashProducts.map((p) => <SaleProductCard key={p.id} product={p} onQuickView={setQuickView} />)}
        </div>
      </div>

      <QuickViewModal product={quickView} onClose={() => setQuickView(null)} />
    </section>
  );
};

export default FlashSaleSection;