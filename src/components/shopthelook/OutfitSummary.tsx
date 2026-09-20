import { Check, ShoppingBag, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { formatPrice } from "./mockData";

interface OutfitSummaryProps {
  count: number;
  total: number;
  savings: number;
  added: boolean;
  onAddAll: () => void;
  onBuyNow: () => void;
}

const OutfitSummary = ({ count, total, savings, added, onAddAll, onBuyNow }: OutfitSummaryProps) => {
  return (
    <div className="rounded-[18px] border border-border bg-background p-5 shadow-sm">
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Products selected</span>
          <span className="text-sm font-semibold text-foreground">{count} Items</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total outfit price</span>
          <span className="text-2xl font-light text-foreground">{formatPrice(total)}</span>
        </div>
        {savings > 0 && (
          <div className="flex items-center justify-between rounded-[11px] bg-destructive/10 px-3 py-2">
            <span className="text-sm font-medium text-destructive">Total savings</span>
            <span className="text-sm font-semibold text-destructive">Save {formatPrice(savings)}</span>
          </div>
        )}
      </div>

      <div className="mt-5 space-y-2.5">
        <motion.button
          type="button"
          onClick={onAddAll}
          disabled={count === 0}
          whileHover={{ scale: count === 0 ? 1 : 1.015 }}
          whileTap={{ scale: count === 0 ? 1 : 0.985 }}
          className="flex h-13 w-full items-center justify-center gap-2 rounded-[14px] bg-foreground py-3.5 text-sm font-semibold text-background shadow-lg shadow-foreground/20 transition-shadow hover:shadow-xl disabled:opacity-50"
        >
          {added ? <><Check className="h-5 w-5" /> Look Added</> : <><ShoppingBag className="h-5 w-5" /> Add Entire Look to Cart</>}
        </motion.button>
        <motion.button
          type="button"
          onClick={onBuyNow}
          disabled={count === 0}
          whileHover={{ scale: count === 0 ? 1 : 1.015 }}
          whileTap={{ scale: count === 0 ? 1 : 0.985 }}
          className="flex w-full items-center justify-center gap-2 rounded-[14px] border border-foreground py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted disabled:opacity-50"
        >
          <Zap className="h-5 w-5" /> Buy Complete Outfit
        </motion.button>
      </div>
    </div>
  );
};

export default OutfitSummary;