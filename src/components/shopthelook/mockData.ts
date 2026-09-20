export interface LookProduct {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  sizes: string[];
  colors: { name: string; hex: string }[];
  /** hotspot position as percentages of the model image */
  hotspot: { x: number; y: number };
}

export interface Look {
  id: string;
  label: string;
  title: string;
  modelImage: string;
  products: LookProduct[];
}

const p = (seed: string) => `https://picsum.photos/seed/${seed}/600/800`;
const model = (seed: string) => `https://picsum.photos/seed/${seed}/900/1200`;

export const currency = "৳";
export const formatPrice = (value: number) => `${currency}${value.toLocaleString()}`;
export const discountPct = (price: number, oldPrice?: number) =>
  oldPrice ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;

export const looks: Look[] = [
  {
    id: "casual",
    label: "Casual Look",
    title: "Everyday Casual",
    modelImage: model("look-casual"),
    products: [
      { id: "c1", name: "Cotton Crew T-Shirt", price: 1200, oldPrice: 1500, image: p("stl-tee"), rating: 4.6, reviewCount: 210, sizes: ["S", "M", "L", "XL"], colors: [{ name: "White", hex: "#f5f5f5" }, { name: "Black", hex: "#222" }], hotspot: { x: 50, y: 30 } },
      { id: "c2", name: "Slim Fit Jeans", price: 3200, oldPrice: 3900, image: p("stl-jeans"), rating: 4.5, reviewCount: 318, sizes: ["30", "32", "34", "36"], colors: [{ name: "Indigo", hex: "#2a3a5a" }], hotspot: { x: 48, y: 62 } },
      { id: "c3", name: "Canvas Sneakers", price: 2800, oldPrice: 3300, image: p("stl-sneakers"), rating: 4.7, reviewCount: 256, sizes: ["40", "41", "42", "43"], colors: [{ name: "Off White", hex: "#efe6d3" }], hotspot: { x: 52, y: 90 } },
      { id: "c4", name: "Minimal Watch", price: 4500, oldPrice: 5200, image: p("stl-watch"), rating: 4.8, reviewCount: 174, sizes: ["One Size"], colors: [{ name: "Silver", hex: "#cfcfcf" }], hotspot: { x: 38, y: 50 } },
    ],
  },
  {
    id: "street",
    label: "Street Wear",
    title: "Urban Street Style",
    modelImage: model("look-street"),
    products: [
      { id: "s1", name: "Oversized Hoodie", price: 3800, oldPrice: 4500, image: p("stl-hoodie"), rating: 4.7, reviewCount: 402, sizes: ["M", "L", "XL"], colors: [{ name: "Stone", hex: "#9b948a" }], hotspot: { x: 50, y: 32 } },
      { id: "s2", name: "Cargo Joggers", price: 2900, oldPrice: 3500, image: p("stl-cargo"), rating: 4.5, reviewCount: 188, sizes: ["S", "M", "L"], colors: [{ name: "Olive", hex: "#5b5a3a" }], hotspot: { x: 49, y: 65 } },
      { id: "s3", name: "High Top Trainers", price: 4900, oldPrice: 5900, image: p("stl-hightop"), rating: 4.8, reviewCount: 311, sizes: ["41", "42", "43", "44"], colors: [{ name: "Black", hex: "#1a1a1a" }], hotspot: { x: 53, y: 91 } },
      { id: "s4", name: "Bucket Hat", price: 1500, oldPrice: 1900, image: p("stl-bucket"), rating: 4.4, reviewCount: 96, sizes: ["One Size"], colors: [{ name: "Khaki", hex: "#b5a482" }], hotspot: { x: 50, y: 12 } },
    ],
  },
  {
    id: "formal",
    label: "Formal Look",
    title: "Sharp & Tailored",
    modelImage: model("look-formal"),
    products: [
      { id: "f1", name: "Tailored Blazer", price: 8900, oldPrice: 10500, image: p("stl-blazer"), rating: 4.9, reviewCount: 521, sizes: ["38", "40", "42", "44"], colors: [{ name: "Navy", hex: "#26314f" }], hotspot: { x: 50, y: 33 } },
      { id: "f2", name: "Oxford Dress Shirt", price: 2800, oldPrice: 3300, image: p("stl-oxford"), rating: 4.6, reviewCount: 256, sizes: ["S", "M", "L"], colors: [{ name: "White", hex: "#f5f5f5" }], hotspot: { x: 50, y: 45 } },
      { id: "f3", name: "Wool Trousers", price: 4200, oldPrice: 4900, image: p("stl-trousers"), rating: 4.7, reviewCount: 203, sizes: ["30", "32", "34", "36"], colors: [{ name: "Charcoal", hex: "#3a3a3a" }], hotspot: { x: 49, y: 66 } },
      { id: "f4", name: "Leather Oxfords", price: 6900, oldPrice: 8200, image: p("stl-leather"), rating: 4.8, reviewCount: 389, sizes: ["40", "41", "42", "43", "44"], colors: [{ name: "Brown", hex: "#5a3a22" }], hotspot: { x: 52, y: 92 } },
    ],
  },
  {
    id: "summer",
    label: "Summer Collection",
    title: "Summer Ease",
    modelImage: model("look-summer"),
    products: [
      { id: "su1", name: "Linen Camp Shirt", price: 2600, oldPrice: 3100, image: p("stl-linen"), rating: 4.6, reviewCount: 178, sizes: ["S", "M", "L", "XL"], colors: [{ name: "Sand", hex: "#d8c7a8" }], hotspot: { x: 50, y: 34 } },
      { id: "su2", name: "Tailored Shorts", price: 2200, oldPrice: 2700, image: p("stl-shorts"), rating: 4.5, reviewCount: 142, sizes: ["30", "32", "34"], colors: [{ name: "Beige", hex: "#c9b89a" }], hotspot: { x: 49, y: 60 } },
      { id: "su3", name: "Leather Sandals", price: 3100, oldPrice: 3700, image: p("stl-sandals"), rating: 4.4, reviewCount: 88, sizes: ["40", "41", "42", "43"], colors: [{ name: "Tan", hex: "#a87b4f" }], hotspot: { x: 52, y: 90 } },
      { id: "su4", name: "Round Sunglasses", price: 1800, oldPrice: 2300, image: p("stl-sunnies"), rating: 4.7, reviewCount: 264, sizes: ["One Size"], colors: [{ name: "Tortoise", hex: "#6b4a2a" }], hotspot: { x: 50, y: 14 } },
    ],
  },
  {
    id: "sports",
    label: "Sports Collection",
    title: "Active Performance",
    modelImage: model("look-sports"),
    products: [
      { id: "sp1", name: "Performance Tee", price: 1600, oldPrice: 2000, image: p("stl-perftee"), rating: 4.6, reviewCount: 230, sizes: ["S", "M", "L", "XL"], colors: [{ name: "Red", hex: "#b3261e" }], hotspot: { x: 50, y: 32 } },
      { id: "sp2", name: "Training Shorts", price: 1900, oldPrice: 2400, image: p("stl-trainshorts"), rating: 4.5, reviewCount: 156, sizes: ["S", "M", "L"], colors: [{ name: "Black", hex: "#1a1a1a" }], hotspot: { x: 49, y: 60 } },
      { id: "sp3", name: "Running Shoes", price: 5400, oldPrice: 6500, image: p("stl-running"), rating: 4.8, reviewCount: 478, sizes: ["40", "41", "42", "43", "44"], colors: [{ name: "Grey", hex: "#8a8a8a" }], hotspot: { x: 53, y: 91 } },
      { id: "sp4", name: "Sports Cap", price: 1200, oldPrice: 1500, image: p("stl-sportcap"), rating: 4.3, reviewCount: 74, sizes: ["One Size"], colors: [{ name: "White", hex: "#f5f5f5" }], hotspot: { x: 50, y: 12 } },
    ],
  },
];