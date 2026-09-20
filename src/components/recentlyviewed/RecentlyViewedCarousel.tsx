import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import QuickViewModal from "./QuickViewModal";
import RecentlyViewedCard from "./RecentlyViewedCard";
import { ViewedProduct } from "./mockData";
import { Skeleton } from "@/components/ui/skeleton";

const CardSkeleton = () => (
  <div className="w-[44vw] shrink-0 sm:w-[31%] md:w-[30%] lg:w-[23%] xl:w-[18.5%]">
    <Skeleton className="aspect-[3/4] w-full rounded-[14px]" />
    <Skeleton className="mt-3 h-3 w-1/3" />
    <Skeleton className="mt-2 h-4 w-3/4" />
    <Skeleton className="mt-2 h-4 w-1/2" />
  </div>
);

interface RecentlyViewedCarouselProps {
  products: ViewedProduct[];
  loading?: boolean;
}

const RecentlyViewedCarousel = ({ products, loading = false }: RecentlyViewedCarouselProps) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [quickView, setQuickView] = useState<ViewedProduct | null>(null);

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <div className="relative">
      {!loading && products.length > 0 && (
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
      )}

      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {loading
          ? Array.from({ length: 5 }).map((_, i) => <CardSkeleton key={i} />)
          : products.map((p) => <RecentlyViewedCard key={p.id} product={p} onQuickView={setQuickView} />)}
      </div>

      <QuickViewModal product={quickView} onClose={() => setQuickView(null)} />
    </div>
  );
};

export default RecentlyViewedCarousel;