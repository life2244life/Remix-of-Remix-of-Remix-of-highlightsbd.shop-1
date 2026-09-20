import { useMemo, useRef, useState } from "react";
import { ArrowRight, Check, Eye, Heart, ShoppingCart, Star } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Hotspot from "./Hotspot";
import OutfitSummary from "./OutfitSummary";
import QuickViewModal from "./QuickViewModal";
import { Look, LookProduct, discountPct, formatPrice, looks } from "./mockData";
import { Skeleton } from "@/components/ui/skeleton";

const PanelCard = ({
  product,
  active,
  onQuickView,
  registerRef,
}: {
  product: LookProduct;
  active: boolean;
  onQuickView: (p: LookProduct) => void;
  registerRef: (id: string, el: HTMLDivElement | null) => void;
}) => {
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);
  const pct = discountPct(product.price, product.oldPrice);

  return (
    <motion.div
      ref={(el) => registerRef(product.id, el)}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={`flex gap-3 rounded-[14px] border bg-background p-3 shadow-sm transition-colors ${
        active ? "border-destructive ring-1 ring-destructive/30" : "border-border"
      }`}
    >
      <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-[11px] bg-muted">
        <img src={product.image} alt={product.name} className="h-full w-full object-cover" loading="lazy" />
        {pct > 0 && (
          <span className="absolute left-1 top-1 rounded-[6px] bg-destructive px-1 py-0.5 text-[9px] font-semibold text-destructive-foreground">
            -{pct}%
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <h4 className="line-clamp-1 text-sm font-medium text-foreground">{product.name}</h4>
        <div className="mt-0.5 flex items-center gap-1">
          <Star className="h-3 w-3 fill-destructive text-destructive" />
          <span className="text-[11px] text-muted-foreground">{product.rating} ({product.reviewCount})</span>
        </div>
        <div className="mt-1 flex items-center gap-1.5">
          <span className="text-sm font-semibold text-foreground">{formatPrice(product.price)}</span>
          {product.oldPrice && (
            <span className="text-xs text-muted-foreground line-through">{formatPrice(product.oldPrice)}</span>
          )}
        </div>

        <div className="mt-auto flex items-center gap-1.5 pt-2">
          <button
            type="button"
            onClick={() => { setAdded(true); setTimeout(() => setAdded(false), 1400); }}
            className="flex h-8 flex-1 items-center justify-center gap-1 rounded-[9px] bg-foreground text-[11px] font-medium text-background transition-transform hover:scale-[1.02]"
          >
            {added ? <Check className="h-3.5 w-3.5" /> : <ShoppingCart className="h-3.5 w-3.5" />}
            {added ? "Added" : "Add"}
          </button>
          <button
            type="button"
            onClick={() => onQuickView(product)}
            aria-label="Quick view"
            className="flex h-8 w-8 items-center justify-center rounded-[9px] border border-border text-foreground hover:bg-muted"
          >
            <Eye className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setWishlisted((v) => !v)}
            aria-label="Wishlist"
            className="flex h-8 w-8 items-center justify-center rounded-[9px] border border-border text-foreground hover:bg-muted"
          >
            <Heart className={`h-3.5 w-3.5 ${wishlisted ? "fill-destructive text-destructive" : ""}`} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

interface ShopTheLookProps {
  loading?: boolean;
}

const ShopTheLook = ({ loading = false }: ShopTheLookProps) => {
  const [activeLookId, setActiveLookId] = useState(looks[0].id);
  const [activeProductId, setActiveProductId] = useState<string | null>(null);
  const [quickView, setQuickView] = useState<LookProduct | null>(null);
  const [added, setAdded] = useState(false);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const look = useMemo<Look>(() => looks.find((l) => l.id === activeLookId) ?? looks[0], [activeLookId]);

  const { total, savings } = useMemo(() => {
    const total = look.products.reduce((sum, p) => sum + p.price, 0);
    const savings = look.products.reduce((sum, p) => sum + ((p.oldPrice ?? p.price) - p.price), 0);
    return { total, savings };
  }, [look]);

  const handleHotspot = (id: string) => {
    setActiveProductId(id);
    const el = cardRefs.current[id];
    el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  const switchLook = (id: string) => {
    setActiveLookId(id);
    setActiveProductId(null);
  };

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-light text-foreground sm:text-3xl" style={{ fontFamily: "'Playfair Display', serif" }}>
            Shop The Look
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">Get the complete outfit in one click</p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-destructive"
        >
          View All Looks <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex flex-wrap gap-2">
        {looks.map((l) => (
          <button
            key={l.id}
            type="button"
            onClick={() => switchLook(l.id)}
            className={`rounded-full border px-4 py-2 text-sm transition-colors ${
              activeLookId === l.id ? "border-foreground bg-foreground text-background" : "border-border text-foreground hover:bg-muted"
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[3fr_2fr]">
        {/* Model image + hotspots */}
        <div className="relative overflow-hidden rounded-[18px] bg-muted">
          {loading ? (
            <Skeleton className="h-[400px] w-full md:h-[500px] lg:h-[700px]" />
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={look.id}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="relative h-[400px] md:h-[500px] lg:h-[700px]"
              >
                <img src={look.modelImage} alt={look.title} className="h-full w-full object-cover" />
                {look.products.map((p, i) => (
                  <Hotspot
                    key={p.id}
                    index={i}
                    x={p.hotspot.x}
                    y={p.hotspot.y}
                    label={p.name}
                    active={activeProductId === p.id}
                    onClick={() => handleHotspot(p.id)}
                  />
                ))}
                <span className="absolute bottom-4 left-4 rounded-full bg-background/90 px-3 py-1 text-xs font-medium text-foreground backdrop-blur">
                  {look.title}
                </span>
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Product panel */}
        <div className="flex flex-col gap-3">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 w-full rounded-[14px]" />)
          ) : (
            <>
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {look.products.map((p) => (
                    <PanelCard
                      key={p.id}
                      product={p}
                      active={activeProductId === p.id}
                      onQuickView={setQuickView}
                      registerRef={(id, el) => { cardRefs.current[id] = el; }}
                    />
                  ))}
                </AnimatePresence>
              </div>
              <OutfitSummary
                count={look.products.length}
                total={total}
                savings={savings}
                added={added}
                onAddAll={() => { setAdded(true); setTimeout(() => setAdded(false), 1800); }}
                onBuyNow={() => {}}
              />
            </>
          )}
        </div>
      </div>

      <QuickViewModal product={quickView} onClose={() => setQuickView(null)} />
    </section>
  );
};

export default ShopTheLook;