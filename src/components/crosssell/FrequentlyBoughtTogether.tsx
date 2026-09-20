import { useMemo, useState } from "react";
import { Check, Plus } from "lucide-react";
import { motion } from "framer-motion";
import BundleSummary from "./BundleSummary";
import { CrossSellProduct, bundleProducts, discountPct, formatPrice, mainProduct } from "./mockData";

const all = [mainProduct, ...bundleProducts];

const BundleCard = ({
  product,
  selected,
  locked,
  onToggle,
}: {
  product: CrossSellProduct;
  selected: boolean;
  locked?: boolean;
  onToggle: () => void;
}) => {
  const pct = discountPct(product.price, product.oldPrice);
  const out = product.stock <= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`relative w-40 shrink-0 rounded-[14px] border bg-background p-3 text-center shadow-sm transition-colors sm:w-44 ${
        selected ? "border-foreground" : "border-border"
      }`}
    >
      <button
        type="button"
        disabled={locked || out}
        onClick={onToggle}
        aria-label={selected ? "Deselect" : "Select"}
        className={`absolute left-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-[7px] border transition-colors ${
          selected ? "border-foreground bg-foreground text-background" : "border-border bg-background"
        } ${locked || out ? "opacity-40" : ""}`}
      >
        {selected && <Check className="h-4 w-4" />}
      </button>
      {pct > 0 && (
        <span className="absolute right-2 top-2 rounded-[7px] bg-destructive/10 px-1.5 py-0.5 text-[10px] font-semibold text-destructive">
          -{pct}%
        </span>
      )}
      <div className="overflow-hidden rounded-[11px] bg-muted">
        <img src={product.image} alt={product.name} className="aspect-[3/4] w-full object-cover" loading="lazy" />
      </div>
      <p className="mt-2 line-clamp-1 text-sm font-medium text-foreground">{product.name}</p>
      <div className="mt-0.5 flex items-center justify-center gap-1.5">
        <span className="text-sm font-semibold text-foreground">{formatPrice(product.price)}</span>
        {product.oldPrice && (
          <span className="text-xs text-muted-foreground line-through">{formatPrice(product.oldPrice)}</span>
        )}
      </div>
      <p className={`mt-0.5 text-[11px] ${out ? "text-muted-foreground" : "text-foreground"}`}>
        {out ? "Out of stock" : "In stock"}
      </p>
    </motion.div>
  );
};

const FrequentlyBoughtTogether = () => {
  const [selected, setSelected] = useState<Record<string, boolean>>({
    main: true,
    b1: true,
    b2: true,
  });
  const [added, setAdded] = useState(false);

  const toggle = (id: string) => {
    if (id === "main") return; // main product is locked in the bundle
    setSelected((s) => ({ ...s, [id]: !s[id] }));
    setAdded(false);
  };

  const { count, total, savings } = useMemo(() => {
    const chosen = all.filter((p) => selected[p.id] && p.stock > 0);
    const total = chosen.reduce((sum, p) => sum + p.price, 0);
    const savings = chosen.reduce((sum, p) => sum + ((p.oldPrice ?? p.price) - p.price), 0);
    return { count: chosen.length, total, savings };
  }, [selected]);

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-light text-foreground sm:text-3xl" style={{ fontFamily: "'Playfair Display', serif" }}>
        Frequently Bought Together
      </h2>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_auto]">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          {all.map((p, i) => (
            <div key={p.id} className="flex items-center gap-3 sm:gap-4">
              <BundleCard
                product={p}
                selected={!!selected[p.id]}
                locked={p.id === "main"}
                onToggle={() => toggle(p.id)}
              />
              {i < all.length - 1 && <Plus className="h-5 w-5 shrink-0 text-muted-foreground" />}
            </div>
          ))}
        </div>

        <div className="lg:w-72">
          <BundleSummary
            count={count}
            total={total}
            savings={savings}
            added={added}
            onAdd={() => { setAdded(true); setTimeout(() => setAdded(false), 1800); }}
          />
        </div>
      </div>
    </section>
  );
};

export default FrequentlyBoughtTogether;