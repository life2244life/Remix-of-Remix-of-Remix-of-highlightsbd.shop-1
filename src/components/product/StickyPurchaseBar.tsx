import { useEffect, useState } from 'react';

interface StickyPurchaseBarProps {
  image: string;
  name: string;
  price: number;
  originalPrice?: number | null;
  soldOut: boolean;
  disabled: boolean;
  onAddToCart: () => void;
  onBuyNow: () => void;
}

const StickyPurchaseBar = ({
  image, name, price, originalPrice, soldOut, disabled, onAddToCart, onBuyNow,
}: StickyPurchaseBarProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur transition-transform duration-300 ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center gap-3">
        <img src={image} alt={name} className="hidden sm:block w-11 h-14 object-cover border border-border shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-xs sm:text-sm font-medium truncate text-foreground">{name}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-sm sm:text-base font-semibold">৳{price.toLocaleString()}</span>
            {originalPrice && (
              <span className="text-[11px] text-muted-foreground line-through">৳{originalPrice.toLocaleString()}</span>
            )}
          </div>
        </div>
        {soldOut ? (
          <span className="px-4 py-2.5 text-[11px] sm:text-sm font-medium uppercase tracking-wider bg-destructive/10 text-destructive">Sold Out</span>
        ) : (
          <div className="flex gap-2 shrink-0">
            <button
              onClick={onAddToCart}
              disabled={disabled}
              className="luxury-button-outline px-3 sm:px-5 py-2.5 text-[11px] sm:text-sm disabled:opacity-40 whitespace-nowrap"
            >
              Add to Cart
            </button>
            <button
              onClick={onBuyNow}
              disabled={disabled}
              className="luxury-button-primary px-3 sm:px-5 py-2.5 text-[11px] sm:text-sm disabled:opacity-40 whitespace-nowrap"
            >
              Buy Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StickyPurchaseBar;
