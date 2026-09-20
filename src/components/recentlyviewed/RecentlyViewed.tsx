import { ArrowRight, PackageOpen } from "lucide-react";
import { motion } from "framer-motion";
import RecentlyViewedCarousel from "./RecentlyViewedCarousel";
import { ViewedProduct, recentlyViewedProducts } from "./mockData";

interface RecentlyViewedProps {
  products?: ViewedProduct[];
  loading?: boolean;
  onViewAll?: () => void;
  onExplore?: () => void;
}

const RecentlyViewed = ({
  products = recentlyViewedProducts,
  loading = false,
  onViewAll,
  onExplore,
}: RecentlyViewedProps) => {
  const isEmpty = !loading && products.length === 0;

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-light text-foreground sm:text-3xl" style={{ fontFamily: "'Playfair Display', serif" }}>
            Recently Viewed
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">Continue where you left off</p>
        </div>
        {!isEmpty && (
          <button
            type="button"
            onClick={onViewAll}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-destructive"
          >
            View All <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {isEmpty ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-4 rounded-[18px] border border-dashed border-border py-16 text-center"
        >
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <PackageOpen className="h-9 w-9" />
          </span>
          <div>
            <p className="text-lg font-medium text-foreground">No Recently Viewed Products</p>
            <p className="mt-1 text-sm text-muted-foreground">Browse products to see them here.</p>
          </div>
          <button
            type="button"
            onClick={onExplore}
            className="inline-flex h-11 items-center gap-2 rounded-[14px] bg-foreground px-5 text-sm font-semibold text-background transition-transform hover:scale-[1.02]"
          >
            Explore Collection <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>
      ) : (
        <RecentlyViewedCarousel products={products} loading={loading} />
      )}
    </section>
  );
};

export default RecentlyViewed;