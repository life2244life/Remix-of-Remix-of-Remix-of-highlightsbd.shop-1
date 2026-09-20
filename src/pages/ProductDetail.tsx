import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, Minus, Plus, Star, ZoomIn, X } from 'lucide-react';
import FabHeader from '@/components/fab/FabHeader';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useProduct, useProductBySlug, useProductReviews, useRelatedProducts, useProductImages, useStoreSettings, useAllSizeStock } from '@/hooks/useSupabase';
import ProductCard from '@/components/ProductCard';
import { getProductImage, productUrl } from '@/data/products';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import SEO from '@/components/SEO';
import Breadcrumbs from '@/components/Breadcrumbs';
import { useSEOSettings } from '@/hooks/useSEOSettings';
import { pushViewItem } from '@/lib/gtm';
import { flyToCart } from '@/lib/flyToCart';
import ProductInfo from '@/components/product/ProductInfo';
import { getProductInfo } from '@/data/productInfo';
import DeliveryInfo from '@/components/product/DeliveryInfo';
import ShareButtons from '@/components/product/ShareButtons';

/** Dynamic stock status from available units. */
const stockStatus = (avail: number, soldOut: boolean) => {
  if (soldOut || avail <= 0) return { label: 'Out of Stock', cls: 'bg-destructive/10 text-destructive' };
  if (avail <= 3) return { label: `Only ${avail} Left`, cls: 'bg-destructive/10 text-destructive' };
  if (avail <= 10) return { label: 'Low Stock', cls: 'bg-amber-500/15 text-amber-600' };
  return { label: 'In Stock', cls: 'bg-emerald-500/15 text-emerald-600' };
};
// Deterministic "sold" count derived from id so it stays stable per product.
const soldCount = (id: string) => {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return 200 + (h % 800);
};

const ProductImageGallery = ({ mainImage, name, productId, altText, selectedColor }: { mainImage: string; name: string; productId: string; altText?: string | null; selectedColor?: string }) => {
  const { data: additionalImages = [] } = useProductImages(productId);
  const baseAlt = altText || name;

  // Filter additional images by selected color: keep shared (untagged) images
  // plus images tagged with the currently selected color.
  const visibleAdditional = additionalImages.filter((img: any) => {
    const c = (img.color || '').trim();
    return !c || !selectedColor || c === selectedColor;
  });

  // Build images array: main image + filtered additional images (with per-image alt fallback)
  const images = [
    { url: mainImage, alt: baseAlt },
    ...visibleAdditional.map((img: any, i: number) => ({
      url: img.image_url,
      alt: img.alt_text || `${baseAlt} - view ${i + 2}`,
    })),
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  // Reset to the first image whenever the color (and thus the visible set) changes.
  useEffect(() => { setActiveIndex(0); }, [selectedColor]);
  const [zoomed, setZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [mobileZoom, setMobileZoom] = useState(false);
  const [mobileZoomPos, setMobileZoomPos] = useState({ x: 50, y: 50 });
  const imgRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  }, []);

  const touchStart = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => { touchStart.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && activeIndex < images.length - 1) setActiveIndex(activeIndex + 1);
      if (diff < 0 && activeIndex > 0) setActiveIndex(activeIndex - 1);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Thumbnails */}
      <div className="hidden sm:flex sm:flex-col gap-2 sm:max-h-[600px] lg:max-h-[670px] overflow-y-auto">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`shrink-0 w-16 h-20 overflow-hidden border-2 transition-all ${
              i === activeIndex ? 'border-foreground' : 'border-transparent opacity-50 hover:opacity-100'
            }`}
          >
            <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />

          </button>
        ))}
      </div>

      {/* Main image */}
      <div
        ref={imgRef}
        className="flex-1 aspect-[3/4] lg:h-[670px] lg:max-h-[670px] overflow-hidden bg-secondary cursor-crosshair relative border border-border"
        onMouseEnter={() => setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={images[activeIndex].url}
          alt={images[activeIndex].alt}
          className="w-full h-full object-cover transition-transform duration-200"
          style={zoomed ? { transform: 'scale(2.5)', transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : undefined}
          draggable={false}
        />
        {/* Mobile zoom button */}
        <button
          onClick={() => setMobileZoom(true)}
          className="sm:hidden absolute bottom-3 right-3 p-2.5 bg-foreground/60 backdrop-blur-sm text-background rounded-full shadow-lg active:scale-95 transition-transform"
          aria-label="Zoom image"
        >
          <ZoomIn size={18} />
        </button>
      </div>

      {/* Mobile fullscreen zoom overlay - pinch to zoom */}
      {mobileZoom && (
        <div
          className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
          style={{ touchAction: 'pinch-zoom' }}
        >
          <button
            onClick={() => setMobileZoom(false)}
            className="fixed top-4 right-4 z-[101] p-2.5 bg-white/20 backdrop-blur-sm text-white rounded-full shadow-lg"
            aria-label="Close zoom"
          >
            <X size={20} />
          </button>
          <img
            src={images[activeIndex].url}
            alt={images[activeIndex].alt}
            className="w-full h-auto max-h-screen object-contain"
            draggable={false}
          />
        </div>
      )}

      {/* Mobile thumbnail strip */}
      <div className="flex sm:hidden items-center justify-start gap-1.5 overflow-x-auto py-2">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`shrink-0 w-12 h-14 overflow-hidden border transition-all ${
              i === activeIndex ? 'border-foreground' : 'border-transparent opacity-50'
            }`}
          >
            <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const ProductDetail = () => {
  const params = useParams();
  const identifier = params.slug || params.id || '';
  const isUuid = UUID_RE.test(identifier);
  const byId = useProduct(isUuid ? identifier : '');
  const bySlug = useProductBySlug(!isUuid ? identifier : '');
  const product = isUuid ? byId.data : bySlug.data;
  const isLoading = isUuid ? byId.isLoading : bySlug.isLoading;
  const id = product?.id || '';
  const { data: reviews = [] } = useProductReviews(id || '');
  const { data: relatedProducts = [] } = useRelatedProducts(product?.category || '', id || '');
  const { addItem, setShowPopup } = useCart();
  const { isInWishlist, toggleItem } = useWishlist();
  const { addView } = useRecentlyViewed();
  const { data: storeSettings } = useStoreSettings();
  const { data: allSizeStock = [] } = useAllSizeStock();
  const { data: seoSettings } = useSEOSettings();
  const baseMessageLink = storeSettings?.product_message_link || storeSettings?.footer_messenger || 'https://m.me/eidlip';
  const buildMessageLink = () => {
    if (!product) return baseMessageLink;
    const pUrl = `${window.location.origin}${productUrl(product)}`;
    const text = `Hi! I'm interested in this product:\n${product.name}\n${pUrl}`;
    try {
      const u = new URL(baseMessageLink);
      const host = u.hostname.toLowerCase();
      if (host.includes('wa.me') || host.includes('whatsapp.com')) {
        u.searchParams.set('text', text);
      } else if (host.includes('m.me') || host.includes('messenger.com')) {
        u.searchParams.set('ref', pUrl);
      } else {
        u.searchParams.set('text', text);
      }
      return u.toString();
    } catch {
      return baseMessageLink;
    }
  };
  const messageLink = buildMessageLink();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isMessagePressed, setIsMessagePressed] = useState(false);

  useEffect(() => {
    if (product?.id) addView(product.id);
  }, [product?.id, addView]);

  useEffect(() => {
    if (!product) return;
    pushViewItem(product);
  }, [product?.id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (isLoading) return (
    <div className="min-h-screen bg-background">
      <FabHeader /><CartDrawer />
      <div className="pt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
          <div className="aspect-[3/4] bg-muted animate-pulse" />
          <div className="space-y-4 py-4">
            <div className="h-4 bg-muted rounded w-20 animate-pulse" />
            <div className="h-8 bg-muted rounded w-3/4 animate-pulse" />
            <div className="h-6 bg-muted rounded w-1/3 animate-pulse" />
            <div className="h-20 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen bg-background">
      <FabHeader /><CartDrawer />
      <div className="pt-16 text-center">
        <p className="text-muted-foreground mb-4">Product not found.</p>
        <Link to="/" className="luxury-button-outline inline-block">Back to Shop</Link>
      </div>
    </div>
  );

  const productSizes: string[] = Array.isArray(product.sizes) ? product.sizes : [];
  const productColors: any[] = Array.isArray(product.colors) ? product.colors : [];
  const productInfo = getProductInfo((product as any).product_info);
  const size = selectedSize || productSizes[0] || '';
  const color = selectedColor || productColors[0]?.name || '';
  const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

  // Check sold out per size
  const productStock = allSizeStock.filter(s => s.product_id === product.id);
  const getSizeAvailable = (sz: string) => {
    const s = productStock.find(st => st.size === sz);
    if (!s) return product.stock > 0 ? 999 : 0; // fallback to product.stock if no size stock data
    return s.total_stock - s.sold_count + s.cancelled_count + s.returned_count;
  };
  const currentSizeAvailable = getSizeAvailable(size);
  const allSoldOut = productStock.length > 0
    ? productSizes.every(sz => getSizeAvailable(sz) <= 0)
    : product.stock <= 0;

  const handleAddToCart = () => addItem(product, size, color, quantity);
  const handleBuyNow = () => {
    addItem(product, size, color, quantity);
    setShowPopup(false);
    window.location.href = '/checkout';
  };

  const productImg = getProductImage(product.image_url);
  const ogImg = (product as any).og_image || productImg;
  const seoTitle = (product as any).seo_title || product.name;
  const seoDesc = ((product as any).seo_description || product.description || `Shop ${product.name} from EIDLIP — premium clothing in Bangladesh.`).slice(0, 155);
  const productJsonLd: any = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: [productImg],
    description: product.description,
    sku: product.sku || product.id,
    mpn: product.sku || product.id,
    brand: { "@type": "Brand", name: product.brand || "EIDLIP" },
    category: product.category,
    offers: {
      "@type": "Offer",
      url: `https://demo.eidlip.com${productUrl(product)}`,
      priceCurrency: "BDT",
      price: Number(product.price).toFixed(2),
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      availability: allSoldOut ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: "EIDLIP" },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "BD",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 7,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "80",
          currency: "BDT",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "BD",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 1, unitCode: "DAY" },
          transitTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 3, unitCode: "DAY" },
        },
      },
    },
  };
  if (reviews.length > 0) {
    productJsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: avgRating.toFixed(1),
      reviewCount: reviews.length,
      bestRating: 5,
      worstRating: 1,
    };
    productJsonLd.review = reviews.slice(0, 10).map((r: any) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.name || "Customer" },
      datePublished: r.created_at,
      reviewBody: r.comment || "",
      reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5, worstRating: 1 },
    }));
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={seoTitle}
        description={seoDesc}
        path={productUrl(product)}
        image={ogImg}
        type="product"
        noIndex={(product as any).noindex}
        jsonLd={seoSettings?.sd_product !== 'false' ? productJsonLd : undefined}
      />
      <FabHeader /><CartDrawer />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-20 sm:pb-8">
        <Breadcrumbs
          className="mb-1 sm:mb-3"
          items={[
            { name: 'Home', href: '/' },
            { name: product.category, href: `/?category=${product.category}` },
            { name: product.name },
          ]}
        />


        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-14">
          <div>
            <ProductImageGallery mainImage={getProductImage(product.image_url)} name={product.name} productId={product.id} altText={product.alt_text} selectedColor={color} />
            <div className="sm:pl-[76px]">
              <ShareButtons url={`${typeof window !== 'undefined' ? window.location.origin : ''}${productUrl(product)}`} title={product.name} />
            </div>
          </div>

          <div className="py-0 lg:py-4">
            <p className="luxury-body text-[10px] text-muted-foreground mb-1 tracking-[0.15em]">{product.category}</p>
            <h1 className="text-2xl sm:text-4xl font-medium leading-tight mb-1.5 sm:mb-3 text-foreground" style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '0.005em' }}>{product.name}</h1>
            {(product.brand || product.sku) && (
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-2 sm:mb-3">
                {product.brand && <span className="text-[11px] text-muted-foreground">Brand: <span className="text-foreground font-medium">{product.brand}</span></span>}
                {product.sku && <span className="text-[11px] text-muted-foreground">SKU: <span className="text-foreground font-medium">{product.sku}</span></span>}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mb-2 sm:mb-3">
              <div className="flex items-center gap-1.5">
                <div className="flex text-amber-500">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} size={13} fill={j < Math.round(avgRating || 4.8) ? 'currentColor' : 'none'} className={j < Math.round(avgRating || 4.8) ? '' : 'text-muted-foreground/30'} />
                  ))}
                </div>
                <span className="text-[12px] font-medium text-foreground">{(avgRating || 4.8).toFixed(1)}</span>
                <span className="text-[11px] text-muted-foreground">({reviews.length > 0 ? `${reviews.length} reviews` : 'New'})</span>
              </div>
              <span className="h-3.5 w-px bg-border" />
              <span className="text-[11px] text-muted-foreground">Sold {soldCount(product.id)}+</span>
            </div>

            <div className="flex items-baseline gap-2 sm:gap-3 mb-3 sm:mb-6 flex-wrap">
              <span className="text-lg sm:text-2xl font-light">৳{product.price.toLocaleString()}</span>
              {product.original_price && (
                <>
                  <span className="text-xs sm:text-sm text-muted-foreground line-through">৳{product.original_price.toLocaleString()}</span>
                  <span className="inline-flex items-center text-[11px] sm:text-sm font-semibold tracking-wider bg-destructive/10 text-destructive px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-sm">
                    -{Math.round(((product.original_price - product.price) / product.original_price) * 100)}% OFF
                  </span>
                </>
              )}
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('open-product-tab', { detail: 'reviews' }));
                }}
                className="ml-auto inline-flex items-center gap-1 text-[11px] sm:text-xs font-medium tracking-wider uppercase border border-foreground/20 hover:bg-foreground hover:text-background transition-colors px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-sm"
              >
                <Star size={12} /> Give Review
              </button>
            </div>

            <div className="flex items-center gap-2 mb-3 sm:mb-5">
              {(() => {
                const s = stockStatus(currentSizeAvailable, allSoldOut);
                return (
                  <span className={`inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-medium px-2.5 py-1 rounded-sm ${s.cls}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />{s.label}
                  </span>
                );
              })()}
            </div>

            {productColors.length > 0 && (
              <div className="mb-3 sm:mb-6">
                <p className="luxury-body text-[10px] mb-1.5 sm:mb-2 tracking-[0.1em]">Color — <span className="text-muted-foreground">{color}</span></p>
                <div className="flex flex-wrap gap-2">
                  {productColors.map((c: any) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      aria-label={c.name}
                      title={c.name}
                      className={`relative w-8 h-8 rounded-full border transition-all ${color === c.name ? 'ring-2 ring-foreground ring-offset-2 ring-offset-background border-transparent' : 'border-border hover:border-foreground'}`}
                      style={{ backgroundColor: c.hex || '#ccc' }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="mb-3 sm:mb-6">
              <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                <p className="luxury-body text-[10px] tracking-[0.1em]">Size — <span className="text-muted-foreground">{size}</span></p>
              </div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {productSizes.map(s => {
                  const avail = getSizeAvailable(s);
                  return (
                    <button key={s} onClick={() => setSelectedSize(s)}
                      className={`min-w-[36px] h-9 sm:min-w-[40px] sm:h-11 px-2.5 sm:px-3 text-[11px] sm:text-xs tracking-wider border transition-all relative ${
                        avail <= 0 ? 'opacity-40 line-through' :
                        size === s ? 'bg-foreground text-background border-foreground' : 'border-border hover:border-foreground'
                      }`}>{s}</button>
                  );
                })}
              </div>
            </div>

            <div className="lg:flex lg:gap-8 lg:items-start">
            <div className="mb-4 sm:mb-8 lg:mb-0 lg:shrink-0">
              <p className="luxury-body text-[10px] mb-1.5 sm:mb-2 tracking-[0.1em]">Quantity</p>
              <div className="inline-flex items-center border border-border">
                 <button aria-label="Decrease quantity" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 sm:p-3 hover:bg-accent transition-colors"><Minus size={13} /></button>
                 <span className="w-9 sm:w-12 text-center text-xs sm:text-sm">{quantity}</span>
                 <button aria-label="Increase quantity" onClick={() => setQuantity(Math.min(currentSizeAvailable || product.stock, quantity + 1))} className="p-2 sm:p-3 hover:bg-accent transition-colors"><Plus size={13} /></button>
              </div>
              <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-1">
                {currentSizeAvailable <= 0
                  ? (allSoldOut ? 'Sold Out' : 'This size is out of stock')
                  : currentSizeAvailable <= 10
                    ? `Only ${currentSizeAvailable} left`
                    : 'In stock'}
              </p>
            </div>

            <div className="lg:flex-1">
            {allSoldOut ? (
              <div className="space-y-2">
                <div className="w-full py-3.5 text-center bg-destructive/10 text-destructive text-sm font-medium tracking-wider uppercase">SOLD OUT</div>
                <button onClick={() => toggleItem(product)}
                  className={`w-full py-2.5 sm:py-3.5 text-[11px] sm:text-sm flex items-center justify-center gap-2 border transition-colors ${isInWishlist(product.id) ? 'border-destructive text-destructive' : 'border-border hover:bg-accent'}`}>
                  <Heart size={16} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
                  {isInWishlist(product.id) ? 'In Wishlist' : 'Add to Wishlist'}
                </button>
              </div>
            ) : (
              <>
                <div className="flex gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <button onClick={(e) => { flyToCart((e.currentTarget as HTMLElement).closest('main')?.querySelector('img') || e.currentTarget, getProductImage(product.image_url, 400)); handleAddToCart(); }} disabled={currentSizeAvailable <= 0} className="inline-flex w-fit whitespace-nowrap luxury-button-primary py-2.5 sm:py-3.5 px-8 rounded-full text-[11px] sm:text-sm disabled:opacity-40">Add to Cart</button>
                   <button aria-label={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'} onClick={() => toggleItem(product)}
                    className={`p-2.5 sm:p-3.5 border border-border hover:bg-accent transition-colors ${isInWishlist(product.id) ? 'text-destructive' : ''}`}>
                    <Heart size={16} className="sm:w-[18px] sm:h-[18px]" fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
                  </button>
                </div>
                <button onClick={handleBuyNow} disabled={currentSizeAvailable <= 0} className="inline-flex w-fit whitespace-nowrap luxury-button-outline py-2.5 sm:py-3.5 px-8 rounded-full text-[11px] sm:text-sm disabled:opacity-40">Buy Now</button>
                
              </>
            )}
            <a
              href={messageLink}
              target="_blank"
              rel="noopener noreferrer"
              onPointerDown={() => setIsMessagePressed(true)}
              onPointerUp={() => setIsMessagePressed(false)}
              onPointerLeave={() => setIsMessagePressed(false)}
              onPointerCancel={() => setIsMessagePressed(false)}
              onBlur={() => setIsMessagePressed(false)}
              className={`w-fit whitespace-nowrap py-2.5 sm:py-3.5 px-8 rounded-full text-[11px] sm:text-sm inline-flex items-center justify-center gap-2 mt-2 border border-message transition-colors tracking-[0.15em] uppercase [@media(hover:hover)]:hover:bg-message [@media(hover:hover)]:hover:text-message-foreground ${isMessagePressed ? 'bg-message text-message-foreground' : 'bg-background text-message'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              WhatsApp Now
            </a>
            </div>
            </div>

            <div className="mt-6">
              <DeliveryInfo delivery={productInfo.delivery} />
            </div>

          </div>
        </div>

        <ProductInfo product={product} className="mt-10 sm:mt-14" />

        {relatedProducts.length > 0 && (
          <section className="mt-12 sm:mt-20 mb-8 sm:mb-12">
            <div className="text-center mb-8 sm:mb-10">
              <h2 className="luxury-heading text-xl sm:text-3xl tracking-[0.15em]">You May Also Like</h2>
              <div className="w-12 h-px bg-foreground mx-auto mt-4" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};


export default ProductDetail;