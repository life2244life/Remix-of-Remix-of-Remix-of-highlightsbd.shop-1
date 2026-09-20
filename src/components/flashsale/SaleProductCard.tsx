import { useState } from "react";
import { Check, Eye, Flame, Heart, ShoppingCart, Star } from "lucide-react";
import { motion } from "framer-motion";
import { FlashProduct, badgeClasses, discountPct, formatPrice, soldPct } from "./mockData";

interface SaleProductCardProps {
  product: FlashProduct;
  onQuickView: (p: FlashProduct) => void;
}

const SaleProductCard = ({ product, onQuickView }: SaleProductCardProps) => {
  const [hovered, setHovered] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);
  const pct = discountPct(product.price, product.oldPrice);
  const sold = soldPct(product.sold, product.stock);
  const lowStock = product.stock <= 5;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      className="group w-[44vw] shrink-0 snap-start sm:w-[31%] md:w-[30%] lg:w-[23%] xl:w-[18.5%]"
    >
      <div
        className="relative overflow-hidden rounded-[14px] bg-muted"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <img
          src={product.image}
          alt={product.name}
          className={`aspect-[3/4] w-full object-cover transition-all duration-500 group-hover:scale-105 ${hovered && product.hoverImage ? "opacity-0" : "opacity-100"}`}
          loading="lazy"
        />
        {product.hoverImage && (
          <img
            src={product.hoverImage}
            alt={`${product.name} alternate`}
            className={`absolute inset-0 aspect-[3/4] w-full object-cover transition-all duration-500 group-hover:scale-105 ${hovered ? "opacity-100" : "opacity-0"}`}
            loading="lazy"
          />
        )}

        {/* Animated sale badge */}
        <motion.span
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 1.6, repeat: Infinity }}
          className={`absolute left-3 top-3 inline-flex items-center gap-1 rounded-[8px] px-2 py-0.5 text-[10px] font-bold tracking-wide ${badgeClasses[product.badge]}`}
        >
          <Flame className="h-3 w-3" /> {product.badge}
        </motion.span>

        <span className="absolute right-3 top-3 rounded-[8px] bg-background/90 px-1.5 py-0.5 text-[11px] font-semibold text-destructive backdrop-blur">
          -{pct}%
        </span>

        <button
          type="button"
          onClick={() => setWishlisted((v) => !v)}
          aria-label="Toggle wishlist"
          className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/80 text-foreground opacity-0 backdrop-blur transition-opacity duration-300 hover:bg-background group-hover:opacity-100"
        >
          <Heart className={`h-4 w-4 ${wishlisted ? "fill-destructive text-destructive" : ""}`} />
        </button>

        <div className="absolute inset-x-3 bottom-3 flex gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <button
            type="button"
            onClick={() => onQuickView(product)}
            className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-[11px] bg-background/90 text-xs font-medium text-foreground backdrop-blur transition-colors hover:bg-background"
          >
            <Eye className="h-4 w-4" /> Quick View
          </button>
          <button
            type="button"
            onClick={() => { setAdded(true); setTimeout(() => setAdded(false), 1500); }}
            className="flex h-10 w-10 items-center justify-center rounded-[11px] bg-foreground text-background transition-transform hover:scale-105"
            aria-label="Add to cart"
          >
            {added ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="pt-3">
        <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">{product.category}</p>
        <h3 className="mt-0.5 line-clamp-1 text-sm font-medium text-foreground">{product.name}</h3>
        <div className="mt-1 flex items-center gap-1.5">
          <span className="text-sm font-semibold text-destructive">{formatPrice(product.price)}</span>
          <span className="text-xs text-muted-foreground line-through">{formatPrice(product.oldPrice)}</span>
        </div>
        <div className="mt-1 flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-destructive text-destructive" />
          <span className="text-xs text-foreground">{product.rating}</span>
          <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
        </div>

        {/* Sale progress */}
        <div className="mt-2.5">
          <div className="mb-1 flex items-center justify-between text-[11px]">
            <span className={lowStock ? "font-medium text-destructive" : "text-muted-foreground"}>
              {lowStock ? `Only ${product.stock} left` : "Selling fast"}
            </span>
            <span className="text-muted-foreground">Sold {sold}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full rounded-full bg-destructive"
              initial={{ width: 0 }}
              whileInView={{ width: `${sold}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SaleProductCard;