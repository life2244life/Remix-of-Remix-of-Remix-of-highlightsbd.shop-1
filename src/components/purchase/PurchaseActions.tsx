import { useState } from "react";
import { Check, Loader2, ShoppingCart, Zap } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import QuantitySelector from "./QuantitySelector";
import WishlistButton from "./WishlistButton";
import ShareModal from "./ShareModal";
import StockStatus from "./StockStatus";
import StickyMobilePurchaseBar from "./StickyMobilePurchaseBar";
import { mockPurchaseProduct, PurchaseProduct } from "./mockData";
import { Skeleton } from "@/components/ui/skeleton";

interface PurchaseActionsProps {
  product?: PurchaseProduct;
  loading?: boolean;
}

const formatPrice = (currency: string, value: number) => `${currency}${value.toLocaleString()}`;

type CartState = "idle" | "loading" | "success";

const PurchaseActionsSkeleton = () => (
  <div className="space-y-5">
    <Skeleton className="h-7 w-40" />
    <Skeleton className="h-10 w-48" />
    <Skeleton className="h-12 w-full rounded-[14px]" />
    <Skeleton className="h-14 w-full rounded-[14px]" />
    <div className="flex gap-3">
      <Skeleton className="h-12 flex-1 rounded-[14px]" />
      <Skeleton className="h-12 w-12 rounded-[14px]" />
    </div>
  </div>
);

const PurchaseActions = ({ product = mockPurchaseProduct, loading = false }: PurchaseActionsProps) => {
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [cartState, setCartState] = useState<CartState>("idle");
  const [buyState, setBuyState] = useState<CartState>("idle");

  const outOfStock = product.stock <= 0;
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const runAction = (set: (s: CartState) => void) => {
    if (outOfStock) return;
    set("loading");
    setTimeout(() => {
      set("success");
      setTimeout(() => set("idle"), 1600);
    }, 900);
  };

  if (loading) return <PurchaseActionsSkeleton />;

  return (
    <>
      <div className="space-y-6">
        {/* Price */}
        <div className="flex flex-wrap items-baseline gap-3">
          <span className="text-3xl font-light text-foreground">{formatPrice(product.currency, product.price)}</span>
          {product.originalPrice && (
            <span className="text-base text-muted-foreground line-through">
              {formatPrice(product.currency, product.originalPrice)}
            </span>
          )}
          {discount > 0 && (
            <span className="rounded-[8px] bg-destructive/10 px-2 py-0.5 text-xs font-semibold text-destructive">
              -{discount}% OFF
            </span>
          )}
        </div>

        {/* Stock */}
        <StockStatus stock={product.stock} lowStockThreshold={product.lowStockThreshold} />

        {/* Quantity */}
        <QuantitySelector value={quantity} onChange={setQuantity} max={Math.max(1, product.stock)} disabled={outOfStock} />

        {/* Buy Now — highest priority */}
        <motion.button
          type="button"
          onClick={() => runAction(setBuyState)}
          disabled={outOfStock || buyState !== "idle"}
          whileHover={{ scale: outOfStock ? 1 : 1.015 }}
          whileTap={{ scale: outOfStock ? 1 : 0.985 }}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-[14px] bg-foreground text-base font-semibold text-background shadow-lg shadow-foreground/20 transition-shadow hover:shadow-xl hover:shadow-foreground/30 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <AnimatePresence mode="wait" initial={false}>
            {buyState === "loading" ? (
              <motion.span key="l" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" /> Processing…
              </motion.span>
            ) : buyState === "success" ? (
              <motion.span key="s" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                <Check className="h-5 w-5" /> Order Started
              </motion.span>
            ) : (
              <motion.span key="i" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                <Zap className="h-5 w-5" /> {outOfStock ? "Out of Stock" : "Buy Now"}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Add To Cart */}
        <motion.button
          type="button"
          onClick={() => runAction(setCartState)}
          disabled={outOfStock || cartState !== "idle"}
          whileHover={{ y: outOfStock ? 0 : -2 }}
          whileTap={{ scale: outOfStock ? 1 : 0.985 }}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-[14px] border border-foreground bg-background text-sm font-semibold uppercase tracking-[0.12em] text-foreground shadow-sm transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
        >
          <AnimatePresence mode="wait" initial={false}>
            {cartState === "loading" ? (
              <motion.span key="l" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Adding…
              </motion.span>
            ) : cartState === "success" ? (
              <motion.span key="s" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                <Check className="h-4 w-4" /> Added to Cart
              </motion.span>
            ) : (
              <motion.span key="i" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" /> Add to Cart
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Wishlist + Share */}
        <div className="flex gap-3">
          <WishlistButton active={wishlisted} onToggle={() => setWishlisted((v) => !v)} className="flex-1" />
          <ShareModal url={product.shareUrl} productName={product.name} />
        </div>
      </div>

      <StickyMobilePurchaseBar
        product={product}
        cartState={cartState}
        buyState={buyState}
        onAddToCart={() => runAction(setCartState)}
        onBuyNow={() => runAction(setBuyState)}
      />
    </>
  );
};

export default PurchaseActions;