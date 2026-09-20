import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Star, Eye } from "lucide-react";
import { DemoProduct, formatPrice } from "@/data/demoProducts";

interface Props {
  product: DemoProduct;
  onQuickView: (p: DemoProduct) => void;
  index?: number;
}

const DemoProductCard = ({ product, onQuickView, index = 0 }: Props) => {
  const [hovered, setHovered] = useState(false);
  const [wished, setWished] = useState(false);
  const soldOut = product.stock === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: (index % 8) * 0.04 }}
      className="group"
    >
      <div
        className="relative overflow-hidden rounded-2xl bg-muted aspect-[3/4] shadow-sm"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <img
          src={product.imageRoles.front}
          alt={product.name}
          loading="lazy"
          className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${
            hovered ? "opacity-0 scale-105" : "opacity-100 scale-100"
          }`}
        />
        <img
          src={product.imageRoles.model}
          alt={`${product.name} alternate view`}
          loading="lazy"
          className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${
            hovered ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
        />

        {/* badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {soldOut ? (
            <span className="rounded-full bg-destructive px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-destructive-foreground">
              Sold Out
            </span>
          ) : product.discountPercent > 0 ? (
            <span className="rounded-full bg-destructive px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-destructive-foreground">
              −{product.discountPercent}%
            </span>
          ) : null}
          <span className="rounded-full bg-foreground/85 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-background backdrop-blur-sm">
            {product.category}
          </span>
        </div>

        {/* actions */}
        <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-0 translate-x-2 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
          <button
            onClick={() => setWished((w) => !w)}
            aria-label="Add to wishlist"
            className={`grid h-9 w-9 place-items-center rounded-full bg-background/80 backdrop-blur-sm transition-colors ${
              wished ? "text-destructive" : "text-foreground hover:text-destructive"
            }`}
          >
            <Heart size={15} fill={wished ? "currentColor" : "none"} />
          </button>
          <button
            onClick={() => onQuickView(product)}
            aria-label="Quick view"
            className="grid h-9 w-9 place-items-center rounded-full bg-background/80 text-foreground backdrop-blur-sm transition-colors hover:bg-foreground hover:text-background"
          >
            <Eye size={15} />
          </button>
        </div>

        {/* quick view bar */}
        <button
          onClick={() => onQuickView(product)}
          className="absolute inset-x-0 bottom-0 translate-y-2 bg-foreground/60 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-background opacity-0 backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
        >
          Quick View
        </button>
      </div>

      <div className="px-1 pt-3">
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{product.brand}</p>
        <h3 className="mt-0.5 line-clamp-1 text-sm font-medium text-foreground">{product.name}</h3>
        <div className="mt-1 flex items-center gap-1.5">
          <Star size={12} className="fill-amber-500 text-amber-500" />
          <span className="text-xs text-foreground">{product.rating}</span>
          <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
        </div>
        <div className="mt-1.5 flex items-center gap-2">
          <span className="text-base font-semibold text-foreground">{formatPrice(product.price)}</span>
          {product.comparePrice > product.price && (
            <span className="text-xs text-muted-foreground line-through">{formatPrice(product.comparePrice)}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default DemoProductCard;