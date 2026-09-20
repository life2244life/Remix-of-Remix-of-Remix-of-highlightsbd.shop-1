import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Star, Truck, ShieldCheck, RefreshCcw } from "lucide-react";
import {
  DemoProduct,
  formatPrice,
  getFrequentlyBoughtTogether,
  getCustomersAlsoBought,
} from "@/data/demoProducts";

interface Props {
  product: DemoProduct | null;
  open: boolean;
  onClose: () => void;
  onSelect: (p: DemoProduct) => void;
}

const DemoProductModal = ({ product, open, onClose, onSelect }: Props) => {
  const [active, setActive] = useState(0);
  const [size, setSize] = useState<string | null>(null);
  const [color, setColor] = useState(0);
  const [tab, setTab] = useState<"desc" | "specs" | "reviews">("desc");

  useEffect(() => {
    setActive(0);
    setSize(null);
    setColor(0);
    setTab("desc");
  }, [product]);

  if (!product) return null;
  const fbt = getFrequentlyBoughtTogether(product.id);
  const also = getCustomersAlsoBought(product.id);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-5xl max-h-[92vh] overflow-y-auto p-0">
        <div className="grid gap-0 md:grid-cols-2">
          {/* gallery */}
          <div className="bg-muted p-4">
            <div className="overflow-hidden rounded-xl bg-background aspect-[3/4]">
              <img src={product.images[active]} alt={product.name} className="h-full w-full object-cover" />
            </div>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {product.images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`overflow-hidden rounded-lg aspect-square ring-2 transition ${
                    active === i ? "ring-foreground" : "ring-transparent"
                  }`}
                >
                  <img src={src} alt={`${product.name} view ${i + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* details */}
          <div className="p-6">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
              {product.brand} · {product.subcategory}
            </p>
            <h2 className="mt-1 text-xl font-semibold text-foreground">{product.name}</h2>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={14}
                    className={s <= Math.round(product.rating) ? "fill-amber-500 text-amber-500" : "text-muted-foreground/30"}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating} · {product.reviewCount} reviews
              </span>
            </div>

            <div className="mt-3 flex items-center gap-3">
              <span className="text-2xl font-bold text-foreground">{formatPrice(product.price)}</span>
              {product.comparePrice > product.price && (
                <>
                  <span className="text-base text-muted-foreground line-through">{formatPrice(product.comparePrice)}</span>
                  <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-semibold text-destructive">
                    Save {product.discountPercent}%
                  </span>
                </>
              )}
            </div>

            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{product.shortDescription}</p>

            {/* colors */}
            <div className="mt-4">
              <p className="text-xs font-medium uppercase tracking-wider text-foreground">Color: {product.colors[color]?.name}</p>
              <div className="mt-2 flex gap-2">
                {product.colors.map((c, i) => (
                  <button
                    key={c.name + i}
                    onClick={() => setColor(i)}
                    aria-label={c.name}
                    className={`h-7 w-7 rounded-full border transition ${color === i ? "ring-2 ring-foreground ring-offset-2 ring-offset-background" : ""}`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>

            {/* sizes */}
            <div className="mt-4">
              <p className="text-xs font-medium uppercase tracking-wider text-foreground">Size</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`min-w-[44px] rounded-lg border px-3 py-2 text-sm transition ${
                      size === s ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <button
              disabled={product.stock === 0}
              className="mt-5 w-full rounded-xl bg-foreground py-3 text-sm font-medium uppercase tracking-[0.2em] text-background transition hover:bg-foreground/85 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {product.stock === 0 ? "Sold Out" : "Add to Cart"}
            </button>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[11px] text-muted-foreground">
              <div className="flex flex-col items-center gap-1"><Truck size={16} /> Fast Delivery</div>
              <div className="flex flex-col items-center gap-1"><RefreshCcw size={16} /> Easy Returns</div>
              <div className="flex flex-col items-center gap-1"><ShieldCheck size={16} /> Secure Payment</div>
            </div>

            {/* tabs */}
            <div className="mt-6 border-t border-border pt-4">
              <div className="flex gap-4 text-xs font-medium uppercase tracking-wider">
                {(["desc", "specs", "reviews"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`pb-1 transition ${tab === t ? "border-b-2 border-foreground text-foreground" : "text-muted-foreground"}`}
                  >
                    {t === "desc" ? "Description" : t === "specs" ? "Details" : "Reviews"}
                  </button>
                ))}
              </div>

              {tab === "desc" && (
                <div className="mt-3 space-y-3">
                  {product.longDescription.split("\n\n").slice(0, 3).map((p, i) => (
                    <p key={i} className="text-sm leading-relaxed text-muted-foreground">{p}</p>
                  ))}
                  <ul className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                    {product.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {tab === "specs" && (
                <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  {Object.entries(product.specifications).map(([k, v]) => (
                    <div key={k} className="flex flex-col">
                      <span className="text-[11px] uppercase tracking-wider text-muted-foreground">{k}</span>
                      <span className="text-foreground">{v}</span>
                    </div>
                  ))}
                </div>
              )}

              {tab === "reviews" && (
                <div className="mt-3 space-y-3">
                  {product.reviews.map((r, i) => (
                    <div key={i} className="rounded-lg border border-border p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">{r.name}</span>
                        <span className="text-[11px] text-muted-foreground">{r.date}</span>
                      </div>
                      <div className="mt-1 flex">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} size={12} className={s <= r.rating ? "fill-amber-500 text-amber-500" : "text-muted-foreground/30"} />
                        ))}
                      </div>
                      <p className="mt-1.5 text-sm text-muted-foreground">{r.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* FBT + also bought */}
            {(fbt.length > 0 || also.length > 0) && (
              <div className="mt-6 space-y-4 border-t border-border pt-4">
                {fbt.length > 0 && (
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-foreground">Frequently Bought Together</p>
                    <div className="flex gap-2">
                      {fbt.map((p) => (
                        <button key={p.id} onClick={() => onSelect(p)} className="flex-1 text-left">
                          <img src={p.imageRoles.front} alt={p.name} className="aspect-[3/4] w-full rounded-lg object-cover" />
                          <p className="mt-1 line-clamp-1 text-xs text-foreground">{p.name}</p>
                          <p className="text-xs font-semibold text-foreground">{formatPrice(p.price)}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {also.length > 0 && (
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-foreground">Customers Also Bought</p>
                    <div className="grid grid-cols-4 gap-2">
                      {also.map((p) => (
                        <button key={p.id} onClick={() => onSelect(p)} className="text-left">
                          <img src={p.imageRoles.front} alt={p.name} className="aspect-[3/4] w-full rounded-lg object-cover" />
                          <p className="mt-1 line-clamp-1 text-[11px] text-foreground">{p.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DemoProductModal;