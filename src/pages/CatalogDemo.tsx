import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import {
  demoProducts,
  demoCategories,
  DemoProduct,
  DemoCategory,
  searchDemoProducts,
} from "@/data/demoProducts";
import DemoProductCard from "@/components/catalog/DemoProductCard";
import DemoProductModal from "@/components/catalog/DemoProductModal";

type SortKey = "featured" | "price-asc" | "price-desc" | "rating" | "discount";
type Filter = "All" | DemoCategory;

const CatalogDemo = () => {
  const [filter, setFilter] = useState<Filter>("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("featured");
  const [active, setActive] = useState<DemoProduct | null>(null);
  const [open, setOpen] = useState(false);

  const list = useMemo(() => {
    let items = query.trim() ? searchDemoProducts(query) : demoProducts;
    if (filter !== "All") items = items.filter((p) => p.category === filter);
    items = [...items];
    switch (sort) {
      case "price-asc": items.sort((a, b) => a.price - b.price); break;
      case "price-desc": items.sort((a, b) => b.price - a.price); break;
      case "rating": items.sort((a, b) => b.rating - a.rating); break;
      case "discount": items.sort((a, b) => b.discountPercent - a.discountPercent); break;
      default: break;
    }
    return items;
  }, [filter, query, sort]);

  const openProduct = (p: DemoProduct) => {
    setActive(p);
    setOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* hero */}
      <header className="border-b border-border bg-muted/40">
        <div className="mx-auto max-w-7xl px-4 py-12 text-center sm:py-16">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">The 2026 Collection</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Premium Fashion Catalog
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
            Explore {demoProducts.length} curated pieces across Men, Women, Kids, Teens & Sports — crafted for everyday
            confidence.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* controls */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {(["All", ...demoCategories] as Filter[]).map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  filter === c
                    ? "bg-foreground text-background"
                    : "border border-border text-foreground hover:border-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 lg:w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full rounded-full border border-border bg-background py-2 pl-9 pr-4 text-sm outline-none focus:border-foreground"
              />
            </div>
            <div className="relative">
              <SlidersHorizontal size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="appearance-none rounded-full border border-border bg-background py-2 pl-9 pr-8 text-sm outline-none focus:border-foreground"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="discount">Best Discount</option>
              </select>
            </div>
          </div>
        </div>

        <p className="mt-4 text-sm text-muted-foreground">{list.length} products</p>

        {/* grid */}
        {list.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-lg font-medium text-foreground">No products found</p>
            <p className="mt-1 text-sm text-muted-foreground">Try a different search or category.</p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {list.map((p, i) => (
              <DemoProductCard key={p.id} product={p} index={i} onQuickView={openProduct} />
            ))}
          </div>
        )}
      </div>

      <DemoProductModal product={active} open={open} onClose={() => setOpen(false)} onSelect={openProduct} />
    </div>
  );
};

export default CatalogDemo;