import { Heart } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface WishlistButtonProps {
  active: boolean;
  onToggle: () => void;
  className?: string;
}

const WishlistButton = ({ active, onToggle, className = "" }: WishlistButtonProps) => {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.95 }}
      aria-pressed={active}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      className={`relative flex h-12 items-center justify-center gap-2 rounded-[14px] border border-border bg-background px-4 text-sm font-medium text-foreground shadow-sm transition-colors hover:border-foreground ${className}`}
    >
      <span className="relative flex h-5 w-5 items-center justify-center">
        <Heart
          className={`h-5 w-5 transition-colors ${active ? "fill-destructive text-destructive" : "text-foreground"}`}
        />
        <AnimatePresence>
          {active && (
            <motion.span
              key="burst"
              initial={{ scale: 0, opacity: 0.7 }}
              animate={{ scale: 2.2, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute inset-0 rounded-full bg-destructive/30"
            />
          )}
        </AnimatePresence>
      </span>
      <span className="hidden sm:inline">{active ? "Wishlisted" : "Wishlist"}</span>
    </motion.button>
  );
};

export default WishlistButton;