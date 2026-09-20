export type SaleBadge = "FLASH SALE" | "HOT DEAL" | "LIMITED STOCK" | "BEST OFFER";

export interface FlashProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  oldPrice: number;
  image: string;
  hoverImage?: string;
  rating: number;
  reviewCount: number;
  sold: number;
  stock: number;
  badge: SaleBadge;
  sizes: string[];
  colors: { name: string; hex: string }[];
}

const img = (seed: string) => `https://picsum.photos/seed/${seed}/600/800`;

export const currency = "৳";
export const formatPrice = (value: number) => `${currency}${value.toLocaleString()}`;
export const discountPct = (price: number, oldPrice: number) =>
  Math.round(((oldPrice - price) / oldPrice) * 100);
export const soldPct = (sold: number, stock: number) =>
  Math.min(100, Math.round((sold / (sold + stock)) * 100));

/** countdown target — 2 days, 14 hours from load */
export const getSaleEnd = () => new Date(Date.now() + (2 * 24 * 60 * 60 + 14 * 60 * 60 + 25 * 60 + 45) * 1000);

export const flashProducts: FlashProduct[] = [
  { id: "fs1", name: "Tailored Wool Overcoat", category: "Outerwear", price: 7500, oldPrice: 15000, image: img("fs-coat"), hoverImage: img("fs-coat-b"), rating: 4.8, reviewCount: 1254, sold: 80, stock: 5, badge: "FLASH SALE", sizes: ["S", "M", "L", "XL"], colors: [{ name: "Charcoal", hex: "#3a3a3a" }, { name: "Camel", hex: "#c19a6b" }] },
  { id: "fs2", name: "Merino Knit Sweater", category: "Knitwear", price: 2700, oldPrice: 5200, image: img("fs-sweater"), hoverImage: img("fs-sweater-b"), rating: 4.9, reviewCount: 472, sold: 130, stock: 12, badge: "HOT DEAL", sizes: ["S", "M", "L", "XL"], colors: [{ name: "Burgundy", hex: "#6e1f2b" }, { name: "Cream", hex: "#efe6d3" }] },
  { id: "fs3", name: "Slim Fit Chinos", category: "Trousers", price: 1900, oldPrice: 3900, image: img("fs-chinos"), hoverImage: img("fs-chinos-b"), rating: 4.5, reviewCount: 318, sold: 210, stock: 3, badge: "LIMITED STOCK", sizes: ["30", "32", "34", "36"], colors: [{ name: "Khaki", hex: "#b5a482" }, { name: "Navy", hex: "#26314f" }] },
  { id: "fs4", name: "Suede Chelsea Boots", category: "Footwear", price: 4100, oldPrice: 8200, image: img("fs-boots"), hoverImage: img("fs-boots-b"), rating: 4.8, reviewCount: 389, sold: 95, stock: 18, badge: "BEST OFFER", sizes: ["40", "41", "42", "43", "44"], colors: [{ name: "Tan", hex: "#a87b4f" }] },
  { id: "fs5", name: "Oxford Dress Shirt", category: "Shirts", price: 1650, oldPrice: 3300, image: img("fs-shirt"), hoverImage: img("fs-shirt-b"), rating: 4.4, reviewCount: 256, sold: 320, stock: 8, badge: "FLASH SALE", sizes: ["S", "M", "L"], colors: [{ name: "White", hex: "#f5f5f5" }, { name: "Sky", hex: "#bcd3e8" }] },
  { id: "fs6", name: "Cashmere Scarf", category: "Accessories", price: 1100, oldPrice: 2800, image: img("fs-scarf"), hoverImage: img("fs-scarf-b"), rating: 4.7, reviewCount: 210, sold: 175, stock: 2, badge: "LIMITED STOCK", sizes: ["One Size"], colors: [{ name: "Grey", hex: "#8a8a8a" }] },
  { id: "fs7", name: "Leather Belt", category: "Accessories", price: 950, oldPrice: 2400, image: img("fs-belt"), hoverImage: img("fs-belt-b"), rating: 4.6, reviewCount: 174, sold: 140, stock: 22, badge: "HOT DEAL", sizes: ["32", "34", "36", "38"], colors: [{ name: "Brown", hex: "#5a3a22" }] },
  { id: "fs8", name: "Oversized Hoodie", category: "Loungewear", price: 2280, oldPrice: 4500, image: img("fs-hoodie"), hoverImage: img("fs-hoodie-b"), rating: 4.7, reviewCount: 402, sold: 260, stock: 6, badge: "BEST OFFER", sizes: ["M", "L", "XL"], colors: [{ name: "Stone", hex: "#9b948a" }] },
];

export const badgeClasses: Record<SaleBadge, string> = {
  "FLASH SALE": "bg-destructive text-destructive-foreground",
  "HOT DEAL": "bg-foreground text-background",
  "LIMITED STOCK": "bg-destructive/90 text-destructive-foreground",
  "BEST OFFER": "bg-foreground/90 text-background",
};