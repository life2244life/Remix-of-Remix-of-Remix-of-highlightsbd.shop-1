export interface PurchaseProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  currency: string;
  /** total units available; 0 = out of stock */
  stock: number;
  /** threshold at/below which a low-stock warning shows */
  lowStockThreshold: number;
  shareUrl: string;
}

export const mockPurchaseProduct: PurchaseProduct = {
  id: "wool-overcoat-01",
  name: "Tailored Wool Overcoat",
  price: 12500,
  originalPrice: 15000,
  currency: "৳",
  stock: 8,
  lowStockThreshold: 10,
  shareUrl: "https://example.com/products/tailored-wool-overcoat",
};

export interface ShareTarget {
  key: string;
  label: string;
  /** template that receives the encoded product URL */
  href: (url: string) => string;
  /** tailwind classes for the icon chip */
  accent: string;
}

export const shareTargets: ShareTarget[] = [
  {
    key: "facebook",
    label: "Facebook",
    href: (url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    accent: "bg-[#1877F2]/10 text-[#1877F2]",
  },
  {
    key: "messenger",
    label: "Messenger",
    href: (url) => `https://www.facebook.com/dialog/send?link=${encodeURIComponent(url)}`,
    accent: "bg-[#0084FF]/10 text-[#0084FF]",
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    href: (url) => `https://wa.me/?text=${encodeURIComponent(url)}`,
    accent: "bg-foreground/5 text-foreground",
  },
  {
    key: "instagram",
    label: "Instagram",
    href: () => `https://www.instagram.com/`,
    accent: "bg-destructive/10 text-destructive",
  },
];