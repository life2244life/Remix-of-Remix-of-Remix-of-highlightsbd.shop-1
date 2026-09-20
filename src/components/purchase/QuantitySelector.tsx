import { Minus, Plus } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface QuantitySelectorProps {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}

const QuantitySelector = ({ value, onChange, min = 1, max = 99, disabled = false }: QuantitySelectorProps) => {
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));

  return (
    <div className="flex items-center gap-4">
      <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Quantity</span>
      <div
        className={`inline-flex select-none items-center rounded-[14px] border border-border bg-background p-1 shadow-sm ${
          disabled ? "pointer-events-none opacity-50" : ""
        }`}
      >
        <motion.button
          type="button"
          aria-label="Decrease quantity"
          onClick={dec}
          disabled={value <= min}
          whileTap={{ scale: 0.85 }}
          className="flex h-9 w-9 items-center justify-center rounded-[11px] text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-30"
        >
          <Minus className="h-4 w-4" />
        </motion.button>

        <div className="relative h-9 w-12 overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={value}
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -14, opacity: 0 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="absolute inset-0 flex items-center justify-center text-base font-semibold tabular-nums text-foreground"
            >
              {value}
            </motion.span>
          </AnimatePresence>
        </div>

        <motion.button
          type="button"
          aria-label="Increase quantity"
          onClick={inc}
          disabled={value >= max}
          whileTap={{ scale: 0.85 }}
          className="flex h-9 w-9 items-center justify-center rounded-[11px] text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-30"
        >
          <Plus className="h-4 w-4" />
        </motion.button>
      </div>
    </div>
  );
};

export default QuantitySelector;