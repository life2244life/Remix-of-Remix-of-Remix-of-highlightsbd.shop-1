export type ProductLabel = "NEW" | "TRENDING" | "BESTSELLER" | "LIMITED" | "HOT";
export type Category = "Men" | "Women" | "Kids" | "Sports";
export type FilterKey = "all" | "trending" | "new" | "bestsellers" | "Men" | "Women" | "Kids" | "Sports";

export interface RecProduct {
  id: string;
  name: string;
  category: Category;
  price: number;
  oldPrice?: number;
  image: string;
  hoverImage: string;
  rating: number;
  reviewCount: number;
  sold: number;
  label?: ProductLabel;
  isNew?: boolean;
  isTrending?: boolean;
  isBestseller?: boolean;
  sizes: string[];
  colors: { name: string; hex: string }[];
  description: string;
}

const img = (seed: string) => `https://picsum.photos/seed/${seed}/600/800`;

export const currency = "৳";
export const formatPrice = (value: number) => `${currency}${value.toLocaleString()}`;
export const discountPct = (price: number, oldPrice?: number) =>
  oldPrice ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;

export const labelClasses: Record<ProductLabel, string> = {
  NEW: "bg-foreground text-background",
  TRENDING: "bg-destructive text-destructive-foreground",
  BESTSELLER: "bg-foreground/90 text-background",
  LIMITED: "bg-destructive/90 text-destructive-foreground",
  HOT: "bg-destructive text-destructive-foreground",
};

export const filterChips: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "trending", label: "Trending" },
  { key: "new", label: "New Arrivals" },
  { key: "bestsellers", label: "Best Sellers" },
  { key: "Men", label: "Men" },
  { key: "Women", label: "Women" },
  { key: "Kids", label: "Kids" },
  { key: "Sports", label: "Sports" },
];

const names = [
  "Wool Overcoat", "Merino Sweater", "Slim Chinos", "Chelsea Boots", "Oxford Shirt",
  "Cashmere Scarf", "Leather Belt", "Oversized Hoodie", "Linen Camp Shirt", "Tailored Blazer",
  "Denim Jacket", "Pleated Skirt", "Silk Blouse", "Knit Cardigan", "Cargo Joggers",
  "Running Shoes", "Performance Tee", "Puffer Vest", "Corduroy Pants", "Trench Coat",
];
const categories: Category[] = ["Men", "Women", "Kids", "Sports"];
const labels: (ProductLabel | undefined)[] = ["NEW", "TRENDING", "BESTSELLER", "LIMITED", "HOT", undefined];
const sizePool = [["S", "M", "L", "XL"], ["30", "32", "34", "36"], ["40", "41", "42", "43"], ["One Size"]];
const colorPool = [
  { name: "Charcoal", hex: "#3a3a3a" }, { name: "Camel", hex: "#c19a6b" }, { name: "Navy", hex: "#26314f" },
  { name: "Burgundy", hex: "#6e1f2b" }, { name: "Cream", hex: "#efe6d3" }, { name: "Olive", hex: "#5b5a3a" },
];

const total = 60;

export const recProducts: RecProduct[] = Array.from({ length: total }).map((_, i) => {
  const name = `${names[i % names.length]} ${Math.floor(i / names.length) + 1}`;
  const category = categories[i % categories.length];
  const label = labels[i % labels.length];
  const price = 1200 + ((i * 173) % 8000);
  const hasDiscount = i % 3 !== 0;
  return {
    id: `jfy-${i + 1}`,
    name,
    category,
    price,
    oldPrice: hasDiscount ? Math.round(price * 1.3) : undefined,
    image: img(`jfy-${i}`),
    hoverImage: img(`jfy-${i}-b`),
    rating: Number((3.9 + ((i * 7) % 11) / 10).toFixed(1)),
    reviewCount: 40 + ((i * 53) % 900),
    sold: 20 + ((i * 37) % 500),
    label,
    isNew: label === "NEW" || i % 5 === 0,
    isTrending: label === "TRENDING" || label === "HOT" || i % 4 === 0,
    isBestseller: label === "BESTSELLER" || i % 6 === 0,
    sizes: sizePool[i % sizePool.length],
    colors: [colorPool[i % colorPool.length], colorPool[(i + 2) % colorPool.length]],
    description: "Crafted from premium materials with a refined, modern fit — an effortless wardrobe essential.",
  };
});

export const filterProducts = (key: FilterKey): RecProduct[] => {
  switch (key) {
    case "all": return recProducts;
    case "trending": return recProducts.filter((p) => p.isTrending);
    case "new": return recProducts.filter((p) => p.isNew);
    case "bestsellers": return recProducts.filter((p) => p.isBestseller);
    default: return recProducts.filter((p) => p.category === key);
  }
};