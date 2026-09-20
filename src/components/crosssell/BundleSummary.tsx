import { Check, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { formatPrice } from "./mockData";

interface BundleSummaryProps {
  count: number;
  total: number;
  savings: number;
  onAdd: () => void;
  added: boolean;
}

const BundleSummary = ({ count, total, savings, onAdd, added }: BundleSummaryProps) => {
  return (
    <div className="flex h-full flex-col justify-between rounded-[18px] border border-border bg-background p-6 shadow-sm">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Selected items</span>
          <span className="text-sm font-semibold text-foreground">{count} Items</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total price</span>
          <span className="text-2xl font-light text-foreground">{formatPrice(total)}</span>
        </div>
        {savings > 0 && (
          <div className="flex items-center justify-between rounded-[11px] bg-destructive/10 px-3 py-2">
            <span className="text-sm font-medium text-destructive">Bundle savings</span>
            <span className="text-sm font-semibold text-destructive">Save {formatPrice(savings)}</span>
          </div>
        )}
      </div>

      <motion.button
        type="button"
        onClick={onAdd}
        disabled={count === 0}
        whileHover={{ scale: count === 0 ? 1 : 1.015 }}
        whileTap={{ scale: count === 0 ? 1 : 0.985 }}
        className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-[14px] bg-foreground text-base font-semibold text-background shadow-lg shadow-foreground/20 transition-shadow hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
      >
        {added ? <><Check className="h-5 w-5" /> Bundle Added</> : <><ShoppingCart className="h-5 w-5" /> Add Bundle to Cart</>}
      </motion.button>
    </div>
  );
};

export default BundleSummary;