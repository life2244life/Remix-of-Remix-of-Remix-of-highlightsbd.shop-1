import { Check, Loader2, ShoppingCart, Zap } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { PurchaseProduct } from "./mockData";

type ActionState = "idle" | "loading" | "success";

interface StickyMobilePurchaseBarProps {
  product: PurchaseProduct;
  cartState: ActionState;
  buyState: ActionState;
  onAddToCart: () => void;
  onBuyNow: () => void;
}

const StickyMobilePurchaseBar = ({
  product,
  cartState,
  buyState,
  onAddToCart,
  onBuyNow,
}: StickyMobilePurchaseBarProps) => {
  const outOfStock = product.stock <= 0;

  return (
    <motion.div
      initial={{ y: 80 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-4 pb-[env(safe-area-inset-bottom)] pt-3 shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.2)] backdrop-blur lg:hidden"
    >
      <div className="flex items-center gap-3">
        <div className="min-w-[72px]">
          <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Price</p>
          <p className="text-lg font-semibold text-foreground">
            {product.currency}
            {product.price.toLocaleString()}
          </p>
        </div>

        <button
          type="button"
          onClick={onAddToCart}
          disabled={outOfStock || cartState !== "idle"}
          className="flex h-16 min-h-[64px] flex-1 items-center justify-center gap-2 rounded-[14px] border border-foreground bg-background text-sm font-semibold text-foreground disabled:opacity-60"
        >
          <AnimatePresence mode="wait" initial={false}>
            {cartState === "loading" ? (
              <motion.span key="l" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Loader2 className="h-5 w-5 animate-spin" />
              </motion.span>
            ) : cartState === "success" ? (
              <motion.span key="s" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }}>
                <Check className="h-5 w-5" />
              </motion.span>
            ) : (
              <motion.span key="i" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" /> Cart
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        <button
          type="button"
          onClick={onBuyNow}
          disabled={outOfStock || buyState !== "idle"}
          className="flex h-16 min-h-[64px] flex-[1.4] items-center justify-center gap-2 rounded-[14px] bg-foreground text-sm font-semibold text-background shadow-lg shadow-foreground/20 disabled:opacity-60"
        >
          <AnimatePresence mode="wait" initial={false}>
            {buyState === "loading" ? (
              <motion.span key="l" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" /> Processing
              </motion.span>
            ) : buyState === "success" ? (
              <motion.span key="s" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                <Check className="h-5 w-5" /> Done
              </motion.span>
            ) : (
              <motion.span key="i" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                <Zap className="h-5 w-5" /> {outOfStock ? "Sold Out" : "Buy Now"}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.div>
  );
};

export default StickyMobilePurchaseBar;