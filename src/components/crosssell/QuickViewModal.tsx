import { useEffect, useState } from "react";
import { Check, ShoppingCart, Star } from "lucide-react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CrossSellProduct, discountPct, formatPrice } from "./mockData";

interface QuickViewModalProps {
  product: CrossSellProduct | null;
  onClose: () => void;
}

const QuickViewModal = ({ product, onClose }: QuickViewModalProps) => {
  const [size, setSize] = useState<string>("");
  const [color, setColor] = useState<string>("");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (product) {
      setSize(product.sizes[0] ?? "");
      setColor(product.colors[0]?.name ?? "");
      setAdded(false);
    }
  }, [product]);

  const pct = product ? discountPct(product.price, product.oldPrice) : 0;

  return (
    <Dialog open={!!product} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="rounded-[18px] sm:max-w-2xl">
        {product && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="overflow-hidden rounded-[14px] bg-muted">
              <img src={product.image} alt={product.name} className="aspect-[3/4] w-full object-cover" />
            </div>
            <div className="flex flex-col">
              <DialogHeader className="text-left">
                <DialogTitle className="text-xl">{product.name}</DialogTitle>
                <DialogDescription className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-destructive text-destructive" />
                  {product.rating} · {product.reviewCount} reviews
                </DialogDescription>
              </DialogHeader>

              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-light text-foreground">{formatPrice(product.price)}</span>
                {product.oldPrice && (
                  <span className="text-sm text-muted-foreground line-through">{formatPrice(product.oldPrice)}</span>
                )}
                {pct > 0 && (
                  <span className="rounded-[8px] bg-destructive/10 px-2 py-0.5 text-xs font-semibold text-destructive">
                    -{pct}%
                  </span>
                )}
              </div>

              <div className="mt-5">
                <p className="mb-2 text-[11px] uppercase tracking-[0.15em] text-muted-foreground">Size</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`h-10 min-w-[44px] rounded-[11px] border px-3 text-sm transition-colors ${
                        size === s ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <p className="mb-2 text-[11px] uppercase tracking-[0.15em] text-muted-foreground">Color</p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setColor(c.name)}
                      aria-label={c.name}
                      className={`h-8 w-8 rounded-full border-2 transition-all ${
                        color === c.name ? "border-foreground" : "border-transparent ring-1 ring-border"
                      }`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </div>

              <motion.button
                type="button"
                onClick={() => { setAdded(true); setTimeout(() => setAdded(false), 1600); }}
                disabled={product.stock <= 0}
                whileTap={{ scale: 0.98 }}
                className="mt-auto flex h-12 w-full items-center justify-center gap-2 rounded-[14px] bg-foreground text-sm font-semibold text-background shadow-lg shadow-foreground/20 disabled:opacity-50"
              >
                {product.stock <= 0 ? "Out of Stock" : added ? (
                  <><Check className="h-5 w-5" /> Added to Cart</>
                ) : (
                  <><ShoppingCart className="h-5 w-5" /> Add to Cart</>
                )}
              </motion.button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QuickViewModal;