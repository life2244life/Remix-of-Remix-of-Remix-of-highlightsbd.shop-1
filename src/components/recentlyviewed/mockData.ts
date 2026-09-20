export interface ViewedProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  image: string;
  hoverImage?: string;
  rating: number;
  reviewCount: number;
  sizes: string[];
  colors: { name: string; hex: string }[];
  /** how long ago it was viewed, in minutes */
  viewedMinutesAgo: number;
}

const img = (seed: string) => `https://picsum.photos/seed/${seed}/600/800`;

export const currency = "৳";

export const formatPrice = (value: number) => `${currency}${value.toLocaleString()}`;
export const discountPct = (price: number, oldPrice?: number) =>
  oldPrice ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;

export const formatViewedTime = (minutes: number): string => {
  if (minutes < 1) return "Viewed just now";
  if (minutes < 60) return `Viewed ${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Viewed ${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Viewed yesterday";
  return `Viewed ${days} days ago`;
};

export const recentlyViewedProducts: ViewedProduct[] = [
  {
    id: "rv1",
    name: "Tailored Wool Overcoat",
    category: "Outerwear",
    price: 12500,
    oldPrice: 15000,
    image: img("rv-coat"),
    hoverImage: img("rv-coat-b"),
    rating: 4.8,
    reviewCount: 1254,
    sizes: ["S", "M", "L", "XL"],
    colors: [{ name: "Charcoal", hex: "#3a3a3a" }, { name: "Camel", hex: "#c19a6b" }],
    viewedMinutesAgo: 5,
  },
  {
    id: "rv2",
    name: "Merino Knit Sweater",
    category: "Knitwear",
    price: 4500,
    oldPrice: 5200,
    image: img("rv-sweater"),
    hoverImage: img("rv-sweater-b"),
    rating: 4.9,
    reviewCount: 472,
    sizes: ["S", "M", "L", "XL"],
    colors: [{ name: "Burgundy", hex: "#6e1f2b" }, { name: "Cream", hex: "#efe6d3" }],
    viewedMinutesAgo: 42,
  },
  {
    id: "rv3",
    name: "Slim Fit Chinos",
    category: "Trousers",
    price: 3200,
    oldPrice: 3900,
    image: img("rv-chinos"),
    hoverImage: img("rv-chinos-b"),
    rating: 4.5,
    reviewCount: 318,
    sizes: ["30", "32", "34", "36"],
    colors: [{ name: "Khaki", hex: "#b5a482" }, { name: "Navy", hex: "#26314f" }],
    viewedMinutesAgo: 180,
  },
  {
    id: "rv4",
    name: "Suede Chelsea Boots",
    category: "Footwear",
    price: 6900,
    oldPrice: 8200,
    image: img("rv-boots"),
    hoverImage: img("rv-boots-b"),
    rating: 4.8,
    reviewCount: 389,
    sizes: ["40", "41", "42", "43", "44"],
    colors: [{ name: "Tan", hex: "#a87b4f" }],
    viewedMinutesAgo: 1500,
  },
  {
    id: "rv5",
    name: "Oxford Dress Shirt",
    category: "Shirts",
    price: 2800,
    oldPrice: 3300,
    image: img("rv-shirt"),
    hoverImage: img("rv-shirt-b"),
    rating: 4.4,
    reviewCount: 256,
    sizes: ["S", "M", "L"],
    colors: [{ name: "White", hex: "#f5f5f5" }, { name: "Sky", hex: "#bcd3e8" }],
    viewedMinutesAgo: 2880,
  },
  {
    id: "rv6",
    name: "Cashmere Scarf",
    category: "Accessories",
    price: 2200,
    oldPrice: 2800,
    image: img("rv-scarf"),
    hoverImage: img("rv-scarf-b"),
    rating: 4.7,
    reviewCount: 210,
    sizes: ["One Size"],
    colors: [{ name: "Grey", hex: "#8a8a8a" }],
    viewedMinutesAgo: 4320,
  },
  {
    id: "rv7",
    name: "Leather Belt",
    category: "Accessories",
    price: 1900,
    oldPrice: 2400,
    image: img("rv-belt"),
    hoverImage: img("rv-belt-b"),
    rating: 4.6,
    reviewCount: 174,
    sizes: ["32", "34", "36", "38"],
    colors: [{ name: "Brown", hex: "#5a3a22" }],
    viewedMinutesAgo: 5760,
  },
];