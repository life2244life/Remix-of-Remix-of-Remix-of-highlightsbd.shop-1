import { useRef, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Eye, Heart, ShoppingCart, Star } from "lucide-react";
import { motion } from "framer-motion";
import QuickViewModal from "./QuickViewModal";
import { CrossSellProduct, alsoBought, discountPct, formatPrice } from "./mockData";
import { Skeleton } from "@/components/ui/skeleton";

const ProductCard = ({
  product,
  onQuickView,
}: {
  product: CrossSellProduct;
  onQuickView: (p: CrossSellProduct) => void;
}) => {
  const [hovered, setHovered] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);
  const pct = discountPct(product.price, product.oldPrice);
  const out = product.stock <= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      className="group w-[44vw] shrink-0 snap-start sm:w-[31%] lg:w-[23.5%]"
    >
      <div
        className="relative overflow-hidden rounded-[14px] bg-muted"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <img
          src={product.image}
          alt={product.name}
          className={`aspect-[3/4] w-full object-cover transition-opacity duration-500 ${hovered && product.hoverImage ? "opacity-0" : "opacity-100"}`}
          loading="lazy"
        />
        {product.hoverImage && (
          <img
            src={product.hoverImage}
            alt={`${product.name} alternate`}
            className={`absolute inset-0 aspect-[3/4] w-full object-cover transition-opacity duration-500 ${hovered ? "opacity-100" : "opacity-0"}`}
            loading="lazy"
          />
        )}
        {pct > 0 && (
          <span className="absolute left-3 top-3 rounded-[8px] bg-destructive px-2 py-0.5 text-[11px] font-semibold text-destructive-foreground">
            -{pct}%
          </span>
        )}
        {out && (
          <span className="absolute left-3 top-3 rounded-[8px] bg-foreground/80 px-2 py-0.5 text-[11px] font-semibold text-background">
            Sold Out
          </span>
        )}

        <button
          type="button"
          onClick={() => setWishlisted((v) => !v)}
          aria-label="Toggle wishlist"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur transition-colors hover:bg-background"
        >
          <Heart className={`h-4 w-4 ${wishlisted ? "fill-destructive text-destructive" : ""}`} />
        </button>

        <div className="absolute inset-x-3 bottom-3 flex gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <button
            type="button"
            onClick={() => onQuickView(product)}
            className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-[11px] bg-background/90 text-xs font-medium text-foreground backdrop-blur transition-colors hover:bg-background"
          >
            <Eye className="h-4 w-4" /> Quick View
          </button>
          <button
            type="button"
            onClick={() => { if (!out) { setAdded(true); setTimeout(() => setAdded(false), 1500); } }}
            disabled={out}
            className="flex h-10 w-10 items-center justify-center rounded-[11px] bg-foreground text-background transition-transform hover:scale-105 disabled:opacity-50"
            aria-label="Add to cart"
          >
            {added ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="pt-3">
        <h3 className="line-clamp-1 text-sm font-medium text-foreground">{product.name}</h3>
        <div className="mt-1 flex items-center gap-1.5">
          <span className="text-sm font-semibold text-foreground">{formatPrice(product.price)}</span>
          {product.oldPrice && (
            <span className="text-xs text-muted-foreground line-through">{formatPrice(product.oldPrice)}</span>
          )}
        </div>
        <div className="mt-1 flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-destructive text-destructive" />
          <span className="text-xs text-foreground">{product.rating}</span>
          <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
        </div>
      </div>
    </motion.div>
  );
};

const CardSkeleton = () => (
  <div className="w-[44vw] shrink-0 sm:w-[31%] lg:w-[23.5%]">
    <Skeleton className="aspect-[3/4] w-full rounded-[14px]" />
    <Skeleton className="mt-3 h-4 w-3/4" />
    <Skeleton className="mt-2 h-4 w-1/2" />
  </div>
);

interface CustomersAlsoBoughtProps {
  loading?: boolean;
}

const CustomersAlsoBought = ({ loading = false }: CustomersAlsoBoughtProps) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [quickView, setQuickView] = useState<CrossSellProduct | null>(null);

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-light text-foreground sm:text-3xl" style={{ fontFamily: "'Playfair Display', serif" }}>
            Customers Also Bought
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">Popular items purchased with this product</p>
        </div>
        <div className="hidden gap-2 sm:flex">
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
      </div>

      <div
        ref={trackRef}
        className="mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
          : alsoBought.map((p) => <ProductCard key={p.id} product={p} onQuickView={setQuickView} />)}
      </div>

      <QuickViewModal product={quickView} onClose={() => setQuickView(null)} />
    </section>
  );
};

export default CustomersAlsoBought;