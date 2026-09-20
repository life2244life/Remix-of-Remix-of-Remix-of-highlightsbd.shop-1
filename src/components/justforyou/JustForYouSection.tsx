import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Loader2, PackageOpen } from "lucide-react";
import { motion } from "framer-motion";
import ProductGrid from "./ProductGrid";
import QuickViewModal from "./QuickViewModal";
import { FilterKey, RecProduct, filterChips, filterProducts } from "./mockData";

const PAGE_SIZE = 20;

interface JustForYouSectionProps {
  loading?: boolean;
}

const JustForYouSection = ({ loading = false }: JustForYouSectionProps) => {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [loadingMore, setLoadingMore] = useState(false);
  const [infinite, setInfinite] = useState(false);
  const [quickView, setQuickView] = useState<RecProduct | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => filterProducts(filter), [filter]);
  const shown = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;

  const loadMore = () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    setTimeout(() => {
      setVisible((v) => v + PAGE_SIZE);
      setLoadingMore(false);
    }, 700);
  };

  const changeFilter = (key: FilterKey) => {
    setFilter(key);
    setVisible(PAGE_SIZE);
  };

  // Infinite scroll
  useEffect(() => {
    if (!infinite || !hasMore) return;
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) loadMore(); },
      { rootMargin: "300px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [infinite, hasMore, loadingMore, filter]);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-light text-foreground sm:text-3xl" style={{ fontFamily: "'Playfair Display', serif" }}>
            Just For You
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">Handpicked recommendations for your style</p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-destructive"
        >
          View All <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Filter chips */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        {filterChips.map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => changeFilter(c.key)}
            className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
              filter === c.key ? "border-foreground bg-foreground text-background" : "border-border text-foreground hover:bg-muted"
            }`}
          >
            {c.label}
          </button>
        ))}
        <label className="ml-auto flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
          <input
            type="checkbox"
            checked={infinite}
            onChange={(e) => setInfinite(e.target.checked)}
            className="h-4 w-4 accent-[hsl(var(--destructive))]"
          />
          Infinite scroll
        </label>
      </div>

      {/* Grid / empty state */}
      <div className="mt-8">
        {!loading && filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-4 rounded-[18px] border border-dashed border-border py-16 text-center"
          >
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <PackageOpen className="h-9 w-9" />
            </span>
            <div>
              <p className="text-lg font-medium text-foreground">No products available</p>
              <p className="mt-1 text-sm text-muted-foreground">Explore our latest collection</p>
            </div>
            <button
              type="button"
              onClick={() => changeFilter("all")}
              className="inline-flex h-11 items-center gap-2 rounded-[14px] bg-foreground px-5 text-sm font-semibold text-background transition-transform hover:scale-[1.02]"
            >
              Browse Collection <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        ) : (
          <ProductGrid products={shown} loading={loading} onQuickView={setQuickView} />
        )}
      </div>

      {/* Load more / infinite sentinel */}
      {!loading && hasMore && (
        <div className="mt-10 flex flex-col items-center gap-3">
          {infinite ? (
            <div ref={sentinelRef} className="flex h-10 items-center justify-center text-muted-foreground">
              {loadingMore && <Loader2 className="h-6 w-6 animate-spin" />}
            </div>
          ) : (
            <motion.button
              type="button"
              onClick={loadMore}
              disabled={loadingMore}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex h-12 items-center gap-2 rounded-[14px] border border-foreground px-8 text-sm font-semibold text-foreground transition-colors hover:bg-foreground hover:text-background"
            >
              {loadingMore ? <><Loader2 className="h-4 w-4 animate-spin" /> Loading…</> : "Load More"}
            </motion.button>
          )}
          <p className="text-xs text-muted-foreground">
            Showing {shown.length} of {filtered.length} products
          </p>
        </div>
      )}

      <QuickViewModal product={quickView} onClose={() => setQuickView(null)} />
    </section>
  );
};

export default JustForYouSection;