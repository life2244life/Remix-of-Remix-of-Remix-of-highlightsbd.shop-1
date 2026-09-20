import ProductImageGallery from "@/components/gallery/ProductImageGallery";
import { mockProduct } from "@/components/gallery/mockProduct";

const GalleryDemo = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Product Gallery Demo</p>
        <h1
          className="mt-1 text-3xl font-medium text-foreground lg:text-4xl"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {mockProduct.name}
        </h1>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
          {/* Gallery (left + center) */}
          <ProductImageGallery product={mockProduct} />

          {/* Product info area (already exists in real PDP) */}
          <div className="space-y-5">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-light text-foreground">৳12,500</span>
              <span className="text-sm text-muted-foreground line-through">৳15,000</span>
              <span className="rounded-sm bg-destructive/10 px-2 py-0.5 text-xs font-semibold text-destructive">
                -17% OFF
              </span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              A refined wool overcoat tailored for everyday elegance. Hover the main image to zoom, click to open the
              fullscreen viewer, and swipe on mobile.
            </p>
            <div>
              <p className="mb-2 text-[11px] uppercase tracking-[0.15em] text-muted-foreground">Size</p>
              <div className="flex flex-wrap gap-2">
                {["S", "M", "L", "XL"].map((s) => (
                  <button
                    key={s}
                    className="h-10 min-w-[42px] border border-border px-3 text-sm transition-colors hover:border-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <button className="luxury-button-primary w-full py-3.5 text-sm">Add to Cart</button>
            <button className="luxury-button-outline w-full py-3.5 text-sm">Buy Now</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryDemo;