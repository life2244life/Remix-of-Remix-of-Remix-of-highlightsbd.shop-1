import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';
import { Product, getProductImage, productUrl } from '@/data/products';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { flyToCart } from '@/lib/flyToCart';
import { toast } from 'sonner';
import type { CardSettings } from '@/lib/productSections';

interface Props {
  product: Product;
  reviewStats?: Record<string, { avg: number; count: number }>;
  hoverImageUrl?: string | null;
  isSoldOut?: boolean;
  priority?: boolean;
  card?: Partial<CardSettings>;
}

const FabProductCard = ({ product, reviewStats = {}, hoverImageUrl, isSoldOut = false, priority = false, card }: Props) => {
  const show = {
    discountBadge: card?.discountBadge ?? true,
    newBadge: card?.newBadge ?? true,
    rating: card?.rating ?? true,
    reviewCount: card?.reviewCount ?? true,
    quickView: card?.quickView ?? true,
    wishlist: card?.wishlist ?? true,
    addToCart: card?.addToCart ?? true,
    stockStatus: card?.stockStatus ?? true,
  };
  const { addItem } = useCart();
  const { isInWishlist, toggleItem } = useWishlist();
  const [hovered, setHovered] = useState(false);
  const [showSizes, setShowSizes] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const sizes = Array.isArray(product.sizes) ? product.sizes : [];
  const colors = Array.isArray(product.colors) ? product.colors : [];
  const stat = reviewStats[product.id];
  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : null;

  useEffect(() => {
    if (!showSizes) return;
    const handler = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) setShowSizes(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showSizes]);

  const onAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (sizes.length > 1) { setShowSizes(true); return; }
    addItem(product, sizes[0] || 'One Size', colors[0]?.name || 'Default');
    flyToCart(imageRef.current, getProductImage(product.image_url, 400));
    toast.success(`${product.name} added to cart`);
  };

  const onPickSize = (e: React.MouseEvent, size: string) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, size, colors[0]?.name || 'Default');
    flyToCart(imageRef.current, getProductImage(product.image_url, 400));
    setShowSizes(false);
    toast.success(`${product.name} (${size}) added to cart`);
  };

  const onWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product);
  };

  return (
    <div className="group/card w-full">
      <Link to={productUrl(product)} className="block">
        <div
          ref={imageRef}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="relative aspect-[4/5] w-full overflow-hidden rounded-card bg-fab-soft fab-card-shadow"
        >
          <img
            src={getProductImage(product.image_url, 600)}
            alt={product.alt_text || product.name}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-500 ${
              hovered && hoverImageUrl ? 'opacity-0 scale-105' : 'opacity-100 scale-100 group-hover/card:scale-105'
            }`}
          />
          {hoverImageUrl && hovered && (
            <img
              src={getProductImage(hoverImageUrl, 600)}
              alt={`${product.name} alternate`}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}

          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {show.stockStatus && isSoldOut ? (
              <span className="rounded-md bg-fab-ink px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                Sold Out
              </span>
            ) : show.discountBadge && discount ? (
              <span className="rounded-md bg-fab-accent px-2.5 py-1 text-[11px] font-bold text-white">
                -{discount}%
              </span>
            ) : null}
            {show.newBadge && product.is_new_drop && !isSoldOut && (
              <span className="rounded-md bg-fab-ink px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                New
              </span>
            )}
          </div>

          {/* Wishlist + quick view */}
          <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-0 transition-all duration-300 group-hover/card:opacity-100">
            {show.wishlist && (
            <button
              onClick={onWishlist}
              aria-label="Add to wishlist"
              className={`grid h-9 w-9 place-items-center rounded-full bg-fab-card shadow-md transition-colors ${
                isInWishlist(product.id) ? 'text-fab-accent' : 'text-fab-ink hover:text-fab-accent'
              }`}
            >
              <Heart size={16} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
            </button>
            )}
            {show.quickView && (
            <span
              className="grid h-9 w-9 place-items-center rounded-full bg-fab-card text-fab-ink shadow-md transition-colors hover:text-fab-accent"
              aria-label="Quick view"
            >
              <Eye size={16} />
            </span>
            )}
          </div>

          {/* Size popup */}
          {showSizes && (
            <div
              ref={popupRef}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
              className="absolute inset-x-0 bottom-0 z-10 bg-fab-card/95 p-3 backdrop-blur-sm"
            >
              <p className="mb-2 text-center text-[10px] uppercase tracking-[0.15em] text-fab-muted">Select size</p>
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={(e) => onPickSize(e, s)}
                    className="h-8 min-w-[34px] rounded-md border border-fab-line px-2 text-xs font-medium transition-colors hover:bg-fab-ink hover:text-white"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add to cart reveal */}
          {show.addToCart && !showSizes && !isSoldOut && (
            <div className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 transition-all duration-300 group-hover/card:translate-y-0 group-hover/card:opacity-100">
              <button
                onClick={onAdd}
                className="flex w-full items-center justify-center gap-2 rounded-btn bg-fab-ink py-2.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-white transition-colors hover:bg-fab-accent"
              >
                <ShoppingBag size={14} /> Add to Cart
              </button>
            </div>
          )}
        </div>

        <div className="px-1 pt-3">
          <h3 className="line-clamp-1 text-[14px] font-medium text-fab-ink">{product.name}</h3>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-[15px] font-bold text-fab-ink">৳{product.price.toLocaleString()}</span>
            {product.original_price && (
              <span className="text-[12px] text-fab-muted line-through">৳{product.original_price.toLocaleString()}</span>
            )}
          </div>
          <div className="mt-1.5 flex items-center gap-1">
            {show.rating && [1, 2, 3, 4, 5].map((n) => (
              <Star
                key={n}
                size={12}
                className={n <= Math.round(stat?.avg || 0) ? 'fill-fab-rating text-fab-rating' : 'text-fab-line'}
              />
            ))}
            {show.reviewCount && <span className="ml-1 text-[11px] text-fab-muted">({stat?.count ?? 0})</span>}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default FabProductCard;
