// Product Image Gallery — TypeScript types (frontend only)

export type ProductBadge = "NEW" | "BESTSELLER" | "LIMITED" | "HOT";

export interface GalleryImage {
  id: string;
  /** Full-size / display image URL */
  url: string;
  /** Accessible alt text */
  alt: string;
  /** Optional short label e.g. "Front View" */
  label?: string;
}

export interface GalleryProduct {
  id: string;
  name: string;
  badges?: ProductBadge[];
  images: GalleryImage[];
}

export interface ProductImageGalleryProps {
  product: GalleryProduct;
  /** Optional extra classes for the gallery wrapper */
  className?: string;
  /** Zoom magnification level on hover (desktop). Default 2 */
  zoomLevel?: number;
}