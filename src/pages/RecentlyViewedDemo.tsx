import { useState } from "react";
import RecentlyViewed from "@/components/recentlyviewed/RecentlyViewed";
import { recentlyViewedProducts } from "@/components/recentlyviewed/mockData";

const RecentlyViewedDemo = () => {
  const [loading, setLoading] = useState(false);
  const [empty, setEmpty] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setLoading((v) => !v)}
            className="rounded-[11px] border border-border px-3 py-1.5 text-sm text-foreground hover:bg-muted"
          >
            Toggle loading
          </button>
          <button
            onClick={() => setEmpty((v) => !v)}
            className="rounded-[11px] border border-border px-3 py-1.5 text-sm text-foreground hover:bg-muted"
          >
            Toggle empty state
          </button>
        </div>
      </div>
      <RecentlyViewed products={empty ? [] : recentlyViewedProducts} loading={loading} />
    </div>
  );
};

export default RecentlyViewedDemo;