import { useMemo, useState } from "react";
import { Search, Star } from "lucide-react";
import {
  fashionProducts,
  fashionCategories,
  FashionProduct,
  FashionCategory,
  formatPrice,
  searchFashionProducts,
} from "@/data/fashionProducts";
import DemoProductModal from "@/components/catalog/DemoProductModal";
import type { DemoProduct } from "@/data/demoProducts";

type Filter = "All" | FashionCategory;

// Adapt a FashionProduct to the shape DemoProductModal expects.
const toDemo = (p: FashionProduct): DemoProduct =>
  ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    sku: p.sku,
    category: p.category as DemoProduct["category"],
    subcategory: p.subcategory,
    brand: p.brand,
    price: p.salePrice,
    comparePrice: p.regularPrice,
    discountPercent: p.discountPercent,
    rating: p.rating,
    reviewCount: p.reviewCount,
    stock: 25,
    images: p.gallery,
    imageRoles: p.images,
    colors: p.colors,
    sizes: p.sizes,
    seo: {
      title: p.seo.title,
      slug: p.slug,
      metaTitle: p.seo.metaTitle,
      metaDescription: p.seo.metaDescription,
      keywords: p.seo.keywords,
    },
    shortDescription: p.shortDescription,
    longDescription: p.longDescription,
    features: p.features,
    specifications: p.specifications,
    sizeGuide: [],
    reviews: p.reviews,
    relatedIds: p.relatedIds,
    frequentlyBoughtTogetherIds: p.frequentlyBoughtTogetherIds,
    customersAlsoBoughtIds: p.customersAlsoBoughtIds,
  }) as DemoProduct;

const FashionProductsDemo = () => {
  const [filter, setFilter] = useState<Filter>("All");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<DemoProduct | null>(null);
  const [open, setOpen] = useState(false);

  const list = useMemo(() => {
    let items = query.trim() ? searchFashionProducts(query) : fashionProducts;
    if (filter !== "All") items = items.filter((p) => p.category === filter);
    return items;
  }, [filter, query]);

  const openProduct = (p: FashionProduct) => {
    setActive(toDemo(p));
    setOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-muted/40">
        <div className="mx-auto max-w-7xl px-4 py-12 text-center sm:py-16">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Mock Catalog · Frontend Only</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Fashion Products
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
            {fashionProducts.length} SEO-ready products across Men, Women, Kids, Teens &amp; Sports.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {(["All", ...fashionCategories] as Filter[]).map((c) => (
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
          <div className="relative lg:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-full border border-border bg-background py-2 pl-9 pr-4 text-sm outline-none focus:border-foreground"
            />
          </div>
        </div>

        <p className="mt-4 text-sm text-muted-foreground">{list.length} products</p>

        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {list.map((p) => (
            <button key={p.id} onClick={() => openProduct(p)} className="group text-left">
              <div className="relative overflow-hidden rounded-xl bg-muted aspect-[3/4]">
                <img
                  src={p.images.front}
                  alt={p.image.altText}
                  title={p.image.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105 group-hover:opacity-0"
                />
                <img
                  src={p.images.model}
                  alt={`${p.name} model view`}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover opacity-0 transition duration-500 group-hover:opacity-100"
                />
                {p.discountPercent > 0 && (
                  <span className="absolute left-2 top-2 rounded-full bg-destructive px-2 py-0.5 text-[11px] font-semibold text-destructive-foreground">
                    -{p.discountPercent}%
                  </span>
                )}
              </div>
              <p className="mt-2 text-[11px] uppercase tracking-wider text-muted-foreground">{p.brand}</p>
              <h3 className="line-clamp-1 text-sm font-medium text-foreground">{p.name}</h3>
              <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <Star size={12} className="fill-amber-500 text-amber-500" />
                {p.rating} · {p.reviewCount} reviews
              </div>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">{formatPrice(p.salePrice)}</span>
                {p.regularPrice > p.salePrice && (
                  <span className="text-xs text-muted-foreground line-through">{formatPrice(p.regularPrice)}</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      <DemoProductModal product={active} open={open} onClose={() => setOpen(false)} onSelect={() => {}} />
    </div>
  );
};

export default FashionProductsDemo;