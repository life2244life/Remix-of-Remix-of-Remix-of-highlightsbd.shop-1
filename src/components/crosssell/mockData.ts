export interface CrossSellProduct {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  hoverImage?: string;
  stock: number;
  rating: number;
  reviewCount: number;
  sizes: string[];
  colors: { name: string; hex: string }[];
}

const img = (seed: string) => `https://picsum.photos/seed/${seed}/600/800`;

export const currency = "৳";

export const mainProduct: CrossSellProduct = {
  id: "main",
  name: "Tailored Wool Overcoat",
  price: 12500,
  oldPrice: 15000,
  image: img("main-coat"),
  hoverImage: img("main-coat-b"),
  stock: 8,
  rating: 4.8,
  reviewCount: 1254,
  sizes: ["S", "M", "L", "XL"],
  colors: [
    { name: "Charcoal", hex: "#3a3a3a" },
    { name: "Camel", hex: "#c19a6b" },
  ],
};

export const bundleProducts: CrossSellProduct[] = [
  {
    id: "b1",
    name: "Cashmere Scarf",
    price: 2200,
    oldPrice: 2800,
    image: img("scarf"),
    stock: 14,
    rating: 4.7,
    reviewCount: 210,
    sizes: ["One Size"],
    colors: [{ name: "Grey", hex: "#8a8a8a" }],
  },
  {
    id: "b2",
    name: "Leather Gloves",
    price: 1800,
    oldPrice: 2100,
    image: img("gloves"),
    stock: 5,
    rating: 4.6,
    reviewCount: 132,
    sizes: ["M", "L"],
    colors: [{ name: "Black", hex: "#222" }],
  },
];

export const alsoBought: CrossSellProduct[] = [
  {
    id: "a1",
    name: "Slim Fit Chinos",
    price: 3200,
    oldPrice: 3900,
    image: img("chinos"),
    hoverImage: img("chinos-b"),
    stock: 20,
    rating: 4.5,
    reviewCount: 318,
    sizes: ["30", "32", "34", "36"],
    colors: [{ name: "Khaki", hex: "#b5a482" }, { name: "Navy", hex: "#26314f" }],
  },
  {
    id: "a2",
    name: "Merino Knit Sweater",
    price: 4500,
    oldPrice: 5200,
    image: img("sweater"),
    hoverImage: img("sweater-b"),
    stock: 9,
    rating: 4.9,
    reviewCount: 472,
    sizes: ["S", "M", "L", "XL"],
    colors: [{ name: "Burgundy", hex: "#6e1f2b" }, { name: "Cream", hex: "#efe6d3" }],
  },
  {
    id: "a3",
    name: "Oxford Dress Shirt",
    price: 2800,
    oldPrice: 3300,
    image: img("shirt"),
    hoverImage: img("shirt-b"),
    stock: 0,
    rating: 4.4,
    reviewCount: 256,
    sizes: ["S", "M", "L"],
    colors: [{ name: "White", hex: "#f5f5f5" }, { name: "Sky", hex: "#bcd3e8" }],
  },
  {
    id: "a4",
    name: "Suede Chelsea Boots",
    price: 6900,
    oldPrice: 8200,
    image: img("boots"),
    hoverImage: img("boots-b"),
    stock: 6,
    rating: 4.8,
    reviewCount: 389,
    sizes: ["40", "41", "42", "43", "44"],
    colors: [{ name: "Tan", hex: "#a87b4f" }],
  },
  {
    id: "a5",
    name: "Wool Flat Cap",
    price: 1500,
    oldPrice: 1900,
    image: img("cap"),
    hoverImage: img("cap-b"),
    stock: 18,
    rating: 4.3,
    reviewCount: 98,
    sizes: ["One Size"],
    colors: [{ name: "Herringbone", hex: "#6b6b6b" }],
  },
  {
    id: "a6",
    name: "Leather Belt",
    price: 1900,
    oldPrice: 2400,
    image: img("belt"),
    hoverImage: img("belt-b"),
    stock: 11,
    rating: 4.6,
    reviewCount: 174,
    sizes: ["32", "34", "36", "38"],
    colors: [{ name: "Brown", hex: "#5a3a22" }],
  },
];

export const formatPrice = (value: number) => `${currency}${value.toLocaleString()}`;
export const discountPct = (price: number, oldPrice?: number) =>
  oldPrice ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;