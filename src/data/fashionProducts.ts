// AUTO-GENERATED fashion catalog — frontend only, no backend, mock data.
// 15 realistic, SEO-optimized products across Men, Women, Kids, Teens & Sports.

export interface FashionColor { name: string; hex: string; }
export interface FashionReview { name: string; rating: number; text: string; date: string; }
export interface FashionSEO {
  title: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}
export interface FashionImageSEO {
  fileName: string;
  altText: string;
  title: string;
  caption: string;
}
export type FashionCategory = "Men" | "Women" | "Kids" | "Teens" | "Sports";

export interface FashionProduct {
  id: string;
  slug: string;
  name: string;
  brand: string;
  sku: string;
  category: FashionCategory;
  subcategory: string;
  productType: string;
  regularPrice: number;
  salePrice: number;
  discountPercent: number;
  rating: number;
  reviewCount: number;
  soldCount: number;
  images: { front: string; back: string; lifestyle: string; model: string };
  gallery: string[];
  colors: FashionColor[];
  sizes: string[];
  seo: FashionSEO;
  shortDescription: string;
  longDescription: string;
  features: string[];
  specifications: Record<string, string>;
  image: FashionImageSEO;
  reviews: FashionReview[];
  relatedIds: string[];
  customersAlsoBoughtIds: string[];
  frequentlyBoughtTogetherIds: string[];
}

export const fashionCategories: FashionCategory[] = ["Men", "Women", "Kids", "Teens", "Sports"];

export const currency = "৳";
export const formatPrice = (v: number) => `${currency}${v.toLocaleString()}`;

export const fashionProducts: FashionProduct[] = [
  {
    "id": "fp-001",
    "slug": "premium-cotton-polo-shirt-men",
    "name": "Premium Cotton Polo Shirt",
    "brand": "Arcadia",
    "sku": "ME-0001",
    "category": "Men",
    "subcategory": "Polo Shirts",
    "productType": "Polo Shirt",
    "regularPrice": 1290,
    "salePrice": 990,
    "discountPercent": 23,
    "rating": 4.6,
    "reviewCount": 182,
    "soldCount": 1340,
    "images": {
      "front": "https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=700&h=933&q=80",
      "back": "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=700&h=933&q=80",
      "lifestyle": "https://images.unsplash.com/photo-1490725263030-1f0521cec8ec?auto=format&fit=crop&w=700&h=933&q=80",
      "model": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&h=933&q=80"
    },
    "gallery": [
      "https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=700&h=933&q=80",
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=700&h=933&q=80",
      "https://images.unsplash.com/photo-1490725263030-1f0521cec8ec?auto=format&fit=crop&w=700&h=933&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&h=933&q=80"
    ],
    "colors": [
      {
        "name": "Midnight Black",
        "hex": "#1c1c1c"
      },
      {
        "name": "Charcoal",
        "hex": "#3a3a3a"
      },
      {
        "name": "Sky Blue",
        "hex": "#9fc3e0"
      },
      {
        "name": "Olive",
        "hex": "#5b5a3a"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "seo": {
      "title": "Premium Cotton Polo Shirt for Men – Arcadia",
      "metaTitle": "Premium Cotton Polo Shirt | Arcadia Men Fashion",
      "metaDescription": "Shop the Premium Cotton Polo Shirt by Arcadia in 100% Combed Cotton Piqué. Regular Fit, casual style for summer. Now 23% off with fast delivery and easy returns",
      "keywords": [
        "premium cotton polo shirt",
        "polo shirt men",
        "men fashion",
        "arcadia polo shirt",
        "casual wear",
        "buy polo shirt online",
        "summer collection"
      ]
    },
    "shortDescription": "The Premium Cotton Polo Shirt from Arcadia combines 100% combed cotton piqué with a regular fit for effortless comfort. Featuring a solid design and polo collar styling, it's made for casual moments through the summer season — a versatile wardrobe staple that wears beautifully day after day.",
    "longDescription": "Meet the Premium Cotton Polo Shirt — a thoughtfully crafted polo shirt from Arcadia that brings together premium materials and a refined fit. Made from 100% Combed Cotton Piqué, it is built to feel as good as it looks, with a soft hand-feel and natural drape that holds shape and colour through repeated wear.\n\nFabric & Comfort: the 100% combed cotton piqué sits comfortably against the skin and stays breathable through busy days. The regular fit allows a natural range of movement without feeling restrictive, while careful tailoring keeps a clean, flattering line.\n\nStyle Benefits: the solid aesthetic makes this a genuinely versatile addition to your wardrobe. It layers easily, mixes with relaxed and elevated pieces, and adapts to your mood and the moment for a modern, considered look.\n\nUsage Suggestions: ideally suited for casual settings throughout the summer season, wear it for outings, weekend plans, travel or gatherings. Its adaptable design works across your existing wardrobe, quickly becoming a reliable go-to. Machine wash cold with similar colours to keep it fresh wash after wash.",
    "features": [
      "Premium 100% Combed Cotton Piqué",
      "Breathable, skin-friendly material",
      "Fade-resistant colour retention",
      "Regular Fit for all-day comfort",
      "Easy care — machine washable"
    ],
    "specifications": {
      "Material": "100% Combed Cotton Piqué",
      "Fit Type": "Regular Fit",
      "Pattern": "Solid",
      "Sleeve Type": "Short Sleeve",
      "Neck Type": "Polo Collar",
      "Gender": "Men",
      "Occasion": "Casual",
      "Season": "Summer",
      "Country of Origin": "Bangladesh"
    },
    "image": {
      "fileName": "premium-cotton-polo-shirt.jpg",
      "altText": "Premium Cotton Polo Shirt by Arcadia in midnight black — men polo shirt",
      "title": "Premium Cotton Polo Shirt | Arcadia",
      "caption": "Arcadia Premium Cotton Polo Shirt — 100% Combed Cotton Piqué, Regular Fit."
    },
    "reviews": [
      {
        "name": "Rahul A.",
        "rating": 5,
        "text": "Absolutely love the quality — fabric feels premium and the fit is spot on.",
        "date": "2026-01-12"
      },
      {
        "name": "Sadia K.",
        "rating": 4,
        "text": "Great value for the price. Looks even better in person and washes well.",
        "date": "2026-01-13"
      },
      {
        "name": "Tanvir H.",
        "rating": 5,
        "text": "Comfortable and stylish. I've already ordered another color!",
        "date": "2026-01-14"
      }
    ],
    "relatedIds": [
      "fp-003",
      "fp-004",
      "fp-005"
    ],
    "customersAlsoBoughtIds": [
      "fp-006",
      "fp-007",
      "fp-008"
    ],
    "frequentlyBoughtTogetherIds": [
      "fp-009",
      "fp-010",
      "fp-011"
    ]
  },
  {
    "id": "fp-002",
    "slug": "slim-fit-oxford-shirt-men",
    "name": "Slim Fit Oxford Shirt",
    "brand": "Norwood",
    "sku": "ME-0002",
    "category": "Men",
    "subcategory": "Shirts",
    "productType": "Formal Shirt",
    "regularPrice": 1690,
    "salePrice": 1290,
    "discountPercent": 24,
    "rating": 4.7,
    "reviewCount": 221,
    "soldCount": 980,
    "images": {
      "front": "https://images.unsplash.com/photo-1622519407650-3df9883f76a5?auto=format&fit=crop&w=700&h=933&q=80",
      "back": "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=700&h=933&q=80",
      "lifestyle": "https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=700&h=933&q=80",
      "model": "https://images.unsplash.com/photo-1507680434567-5739c80be1ac?auto=format&fit=crop&w=700&h=933&q=80"
    },
    "gallery": [
      "https://images.unsplash.com/photo-1622519407650-3df9883f76a5?auto=format&fit=crop&w=700&h=933&q=80",
      "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=700&h=933&q=80",
      "https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=700&h=933&q=80",
      "https://images.unsplash.com/photo-1507680434567-5739c80be1ac?auto=format&fit=crop&w=700&h=933&q=80"
    ],
    "colors": [
      {
        "name": "White",
        "hex": "#f5f5f0"
      },
      {
        "name": "Sky Blue",
        "hex": "#a9c6dd"
      },
      {
        "name": "Navy",
        "hex": "#26314f"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "seo": {
      "title": "Slim Fit Oxford Shirt for Men – Norwood",
      "metaTitle": "Slim Fit Oxford Shirt | Norwood Men Fashion",
      "metaDescription": "Shop the Slim Fit Oxford Shirt by Norwood in Cotton Oxford Weave. Slim Fit, formal style for all season. Now 24% off with fast delivery and easy returns.",
      "keywords": [
        "slim fit oxford shirt",
        "formal shirt men",
        "men fashion",
        "norwood formal shirt",
        "formal wear",
        "buy formal shirt online",
        "all season collection"
      ]
    },
    "shortDescription": "The Slim Fit Oxford Shirt from Norwood combines cotton oxford weave with a slim fit for effortless comfort. Featuring a solid design and spread collar styling, it's made for formal moments through the all season season — a versatile wardrobe staple that wears beautifully day after day.",
    "longDescription": "Meet the Slim Fit Oxford Shirt — a thoughtfully crafted formal shirt from Norwood that brings together premium materials and a refined fit. Made from Cotton Oxford Weave, it is built to feel as good as it looks, with a soft hand-feel and natural drape that holds shape and colour through repeated wear.\n\nFabric & Comfort: the cotton oxford weave sits comfortably against the skin and stays breathable through busy days. The slim fit allows a natural range of movement without feeling restrictive, while careful tailoring keeps a clean, flattering line.\n\nStyle Benefits: the solid aesthetic makes this a genuinely versatile addition to your wardrobe. It layers easily, mixes with relaxed and elevated pieces, and adapts to your mood and the moment for a modern, considered look.\n\nUsage Suggestions: ideally suited for formal settings throughout the all season season, wear it for outings, weekend plans, travel or gatherings. Its adaptable design works across your existing wardrobe, quickly becoming a reliable go-to. Machine wash cold with similar colours to keep it fresh wash after wash.",
    "features": [
      "Premium Cotton Oxford Weave",
      "Breathable, skin-friendly material",
      "Fade-resistant colour retention",
      "Slim Fit for all-day comfort",
      "Easy care — machine washable"
    ],
    "specifications": {
      "Material": "Cotton Oxford Weave",
      "Fit Type": "Slim Fit",
      "Pattern": "Solid",
      "Sleeve Type": "Long Sleeve",
      "Neck Type": "Spread Collar",
      "Gender": "Men",
      "Occasion": "Formal",
      "Season": "All Season",
      "Country of Origin": "Bangladesh"
    },
    "image": {
      "fileName": "slim-fit-oxford-shirt.jpg",
      "altText": "Slim Fit Oxford Shirt by Norwood in white — men formal shirt",
      "title": "Slim Fit Oxford Shirt | Norwood",
      "caption": "Norwood Slim Fit Oxford Shirt — Cotton Oxford Weave, Slim Fit."
    },
    "reviews": [
      {
        "name": "Mehjabin R.",
        "rating": 5,
        "text": "Comfortable and stylish. I've already ordered another color!",
        "date": "2026-02-12"
      },
      {
        "name": "Arif M.",
        "rating": 4,
        "text": "Perfect fit and fast delivery. The material is breathable and soft.",
        "date": "2026-02-13"
      },
      {
        "name": "Nusrat J.",
        "rating": 5,
        "text": "Exceeded my expectations. Stitching and finish are top notch.",
        "date": "2026-02-14"
      }
    ],
    "relatedIds": [
      "fp-004",
      "fp-005",
      "fp-006"
    ],
    "customersAlsoBoughtIds": [
      "fp-007",
      "fp-008",
      "fp-009"
    ],
    "frequentlyBoughtTogetherIds": [
      "fp-010",
      "fp-011",
      "fp-012"
    ]
  },
  {
    "id": "fp-003",
    "slug": "tailored-wool-blend-blazer-men",
    "name": "Tailored Wool Blend Blazer",
    "brand": "Élan Studio",
    "sku": "ME-0003",
    "category": "Men",
    "subcategory": "Blazers",
    "productType": "Blazer",
    "regularPrice": 4990,
    "salePrice": 3990,
    "discountPercent": 20,
    "rating": 4.8,
    "reviewCount": 96,
    "soldCount": 420,
    "images": {
      "front": "https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=700&h=933&q=80",
      "back": "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=700&h=933&q=80",
      "lifestyle": "https://images.unsplash.com/photo-1490725263030-1f0521cec8ec?auto=format&fit=crop&w=700&h=933&q=80",
      "model": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&h=933&q=80"
    },
    "gallery": [
      "https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=700&h=933&q=80",
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=700&h=933&q=80",
      "https://images.unsplash.com/photo-1490725263030-1f0521cec8ec?auto=format&fit=crop&w=700&h=933&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&h=933&q=80"
    ],
    "colors": [
      {
        "name": "Charcoal",
        "hex": "#3a3a3a"
      },
      {
        "name": "Navy",
        "hex": "#26314f"
      },
      {
        "name": "Camel",
        "hex": "#c19a6b"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "seo": {
      "title": "Tailored Wool Blend Blazer for Men – Élan Studio",
      "metaTitle": "Tailored Wool Blend Blazer | Élan Studio Men Fashion",
      "metaDescription": "Shop the Tailored Wool Blend Blazer by Élan Studio in Wool Polyester Blend. Tailored Fit, office style for winter. Now 20% off with fast delivery and easy retur",
      "keywords": [
        "tailored wool blend blazer",
        "blazer men",
        "men fashion",
        "élan studio blazer",
        "office wear",
        "buy blazer online",
        "winter collection"
      ]
    },
    "shortDescription": "The Tailored Wool Blend Blazer from Élan Studio combines wool polyester blend with a tailored fit for effortless comfort. Featuring a solid design and notch lapel styling, it's made for office moments through the winter season — a versatile wardrobe staple that wears beautifully day after day.",
    "longDescription": "Meet the Tailored Wool Blend Blazer — a thoughtfully crafted blazer from Élan Studio that brings together premium materials and a refined fit. Made from Wool Polyester Blend, it is built to feel as good as it looks, with a soft hand-feel and natural drape that holds shape and colour through repeated wear.\n\nFabric & Comfort: the wool polyester blend sits comfortably against the skin and stays breathable through busy days. The tailored fit allows a natural range of movement without feeling restrictive, while careful tailoring keeps a clean, flattering line.\n\nStyle Benefits: the solid aesthetic makes this a genuinely versatile addition to your wardrobe. It layers easily, mixes with relaxed and elevated pieces, and adapts to your mood and the moment for a modern, considered look.\n\nUsage Suggestions: ideally suited for office settings throughout the winter season, wear it for outings, weekend plans, travel or gatherings. Its adaptable design works across your existing wardrobe, quickly becoming a reliable go-to. Machine wash cold with similar colours to keep it fresh wash after wash.",
    "features": [
      "Premium Wool Polyester Blend",
      "Breathable, skin-friendly material",
      "Fade-resistant colour retention",
      "Tailored Fit for all-day comfort",
      "Easy care — machine washable"
    ],
    "specifications": {
      "Material": "Wool Polyester Blend",
      "Fit Type": "Tailored Fit",
      "Pattern": "Solid",
      "Sleeve Type": "Long Sleeve",
      "Neck Type": "Notch Lapel",
      "Gender": "Men",
      "Occasion": "Office",
      "Season": "Winter",
      "Country of Origin": "Bangladesh"
    },
    "image": {
      "fileName": "tailored-wool-blend-blazer.jpg",
      "altText": "Tailored Wool Blend Blazer by Élan Studio in charcoal — men blazer",
      "title": "Tailored Wool Blend Blazer | Élan Studio",
      "caption": "Élan Studio Tailored Wool Blend Blazer — Wool Polyester Blend, Tailored Fit."
    },
    "reviews": [
      {
        "name": "Imran S.",
        "rating": 5,
        "text": "Exceeded my expectations. Stitching and finish are top notch.",
        "date": "2026-03-12"
      },
      {
        "name": "Farzana B.",
        "rating": 4,
        "text": "Stylish design, true to size, and very comfortable to wear all day.",
        "date": "2026-03-13"
      },
      {
        "name": "Sabbir N.",
        "rating": 5,
        "text": "Good quality fabric, holds shape after wash. Highly recommend.",
        "date": "2026-03-14"
      }
    ],
    "relatedIds": [
      "fp-005",
      "fp-006",
      "fp-007"
    ],
    "customersAlsoBoughtIds": [
      "fp-008",
      "fp-009",
      "fp-010"
    ],
    "frequentlyBoughtTogetherIds": [
      "fp-011",
      "fp-012",
      "fp-013"
    ]
  },
  {
    "id": "fp-004",
    "slug": "floral-wrap-midi-dress-women",
    "name": "Floral Wrap Midi Dress",
    "brand": "Lumière",
    "sku": "WO-0004",
    "category": "Women",
    "subcategory": "Dresses",
    "productType": "Dress",
    "regularPrice": 2790,
    "salePrice": 2190,
    "discountPercent": 22,
    "rating": 4.7,
    "reviewCount": 164,
    "soldCount": 760,
    "images": {
      "front": "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=700&h=933&q=80",
      "back": "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=700&h=933&q=80",
      "lifestyle": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&h=933&q=80",
      "model": "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=700&h=933&q=80"
    },
    "gallery": [
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=700&h=933&q=80",
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=700&h=933&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&h=933&q=80",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=700&h=933&q=80"
    ],
    "colors": [
      {
        "name": "Rose",
        "hex": "#c98c98"
      },
      {
        "name": "Emerald",
        "hex": "#2f6b54"
      },
      {
        "name": "Ivory",
        "hex": "#efe6d3"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "seo": {
      "title": "Floral Wrap Midi Dress for Women – Lumière",
      "metaTitle": "Floral Wrap Midi Dress | Lumière Women Fashion",
      "metaDescription": "Shop the Floral Wrap Midi Dress by Lumière in Viscose Crepe. Relaxed Fit, party style for spring. Now 22% off with fast delivery and easy returns.",
      "keywords": [
        "floral wrap midi dress",
        "dress women",
        "women fashion",
        "lumière dress",
        "party wear",
        "buy dress online",
        "spring collection"
      ]
    },
    "shortDescription": "The Floral Wrap Midi Dress from Lumière combines viscose crepe with a relaxed fit for effortless comfort. Featuring a floral print design and v-neck styling, it's made for party moments through the spring season — a versatile wardrobe staple that wears beautifully day after day.",
    "longDescription": "Meet the Floral Wrap Midi Dress — a thoughtfully crafted dress from Lumière that brings together premium materials and a refined fit. Made from Viscose Crepe, it is built to feel as good as it looks, with a soft hand-feel and natural drape that holds shape and colour through repeated wear.\n\nFabric & Comfort: the viscose crepe sits comfortably against the skin and stays breathable through busy days. The relaxed fit allows a natural range of movement without feeling restrictive, while careful tailoring keeps a clean, flattering line.\n\nStyle Benefits: the floral print aesthetic makes this a genuinely versatile addition to your wardrobe. It layers easily, mixes with relaxed and elevated pieces, and adapts to your mood and the moment for a modern, considered look.\n\nUsage Suggestions: ideally suited for party settings throughout the spring season, wear it for outings, weekend plans, travel or gatherings. Its adaptable design works across your existing wardrobe, quickly becoming a reliable go-to. Machine wash cold with similar colours to keep it fresh wash after wash.",
    "features": [
      "Premium Viscose Crepe",
      "Breathable, skin-friendly material",
      "Fade-resistant colour retention",
      "Relaxed Fit for all-day comfort",
      "Easy care — machine washable"
    ],
    "specifications": {
      "Material": "Viscose Crepe",
      "Fit Type": "Relaxed Fit",
      "Pattern": "Floral Print",
      "Sleeve Type": "Three Quarter Sleeve",
      "Neck Type": "V-Neck",
      "Gender": "Women",
      "Occasion": "Party",
      "Season": "Spring",
      "Country of Origin": "Bangladesh"
    },
    "image": {
      "fileName": "floral-wrap-midi-dress.jpg",
      "altText": "Floral Wrap Midi Dress by Lumière in rose — women dress",
      "title": "Floral Wrap Midi Dress | Lumière",
      "caption": "Lumière Floral Wrap Midi Dress — Viscose Crepe, Relaxed Fit."
    },
    "reviews": [
      {
        "name": "Lamia C.",
        "rating": 5,
        "text": "Good quality fabric, holds shape after wash. Highly recommend.",
        "date": "2026-04-12"
      },
      {
        "name": "Hasib R.",
        "rating": 4,
        "text": "Lovely colour and texture. Worth every taka, will buy again.",
        "date": "2026-04-13"
      },
      {
        "name": "Tahmina A.",
        "rating": 5,
        "text": "Absolutely love the quality — fabric feels premium and the fit is spot on.",
        "date": "2026-04-14"
      }
    ],
    "relatedIds": [
      "fp-002",
      "fp-003",
      "fp-008"
    ],
    "customersAlsoBoughtIds": [
      "fp-009",
      "fp-010",
      "fp-011"
    ],
    "frequentlyBoughtTogetherIds": [
      "fp-012",
      "fp-013",
      "fp-014"
    ]
  },
  {
    "id": "fp-005",
    "slug": "high-waist-skinny-jeans-women",
    "name": "High Waist Skinny Jeans",
    "brand": "Indigo Lane",
    "sku": "WO-0005",
    "category": "Women",
    "subcategory": "Jeans",
    "productType": "Jeans",
    "regularPrice": 2190,
    "salePrice": 1690,
    "discountPercent": 23,
    "rating": 4.5,
    "reviewCount": 289,
    "soldCount": 1520,
    "images": {
      "front": "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=700&h=933&q=80",
      "back": "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=700&h=933&q=80",
      "lifestyle": "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=700&h=933&q=80",
      "model": "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=700&h=933&q=80"
    },
    "gallery": [
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=700&h=933&q=80",
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=700&h=933&q=80",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=700&h=933&q=80",
      "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=700&h=933&q=80"
    ],
    "colors": [
      {
        "name": "Dark Indigo",
        "hex": "#26314f"
      },
      {
        "name": "Mid Blue",
        "hex": "#5b7fa6"
      },
      {
        "name": "Black",
        "hex": "#1c1c1c"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "seo": {
      "title": "High Waist Skinny Jeans for Women – Indigo Lane",
      "metaTitle": "High Waist Skinny Jeans | Indigo Lane Women Fashion",
      "metaDescription": "Shop the High Waist Skinny Jeans by Indigo Lane in Stretch Denim. Skinny Fit, casual style for all season. Now 23% off with fast delivery and easy returns.",
      "keywords": [
        "high waist skinny jeans",
        "jeans women",
        "women fashion",
        "indigo lane jeans",
        "casual wear",
        "buy jeans online",
        "all season collection"
      ]
    },
    "shortDescription": "The High Waist Skinny Jeans from Indigo Lane combines stretch denim with a skinny fit for effortless comfort. Featuring a solid design and high waist styling, it's made for casual moments through the all season season — a versatile wardrobe staple that wears beautifully day after day.",
    "longDescription": "Meet the High Waist Skinny Jeans — a thoughtfully crafted jeans from Indigo Lane that brings together premium materials and a refined fit. Made from Stretch Denim, it is built to feel as good as it looks, with a soft hand-feel and natural drape that holds shape and colour through repeated wear.\n\nFabric & Comfort: the stretch denim sits comfortably against the skin and stays breathable through busy days. The skinny fit allows a natural range of movement without feeling restrictive, while careful tailoring keeps a clean, flattering line.\n\nStyle Benefits: the solid aesthetic makes this a genuinely versatile addition to your wardrobe. It layers easily, mixes with relaxed and elevated pieces, and adapts to your mood and the moment for a modern, considered look.\n\nUsage Suggestions: ideally suited for casual settings throughout the all season season, wear it for outings, weekend plans, travel or gatherings. Its adaptable design works across your existing wardrobe, quickly becoming a reliable go-to. Machine wash cold with similar colours to keep it fresh wash after wash.",
    "features": [
      "Premium Stretch Denim",
      "Breathable, skin-friendly material",
      "Fade-resistant colour retention",
      "Skinny Fit for all-day comfort",
      "Easy care — machine washable"
    ],
    "specifications": {
      "Material": "Stretch Denim",
      "Fit Type": "Skinny Fit",
      "Pattern": "Solid",
      "Sleeve Type": "Sleeveless",
      "Neck Type": "High Waist",
      "Gender": "Women",
      "Occasion": "Casual",
      "Season": "All Season",
      "Country of Origin": "Bangladesh"
    },
    "image": {
      "fileName": "high-waist-skinny-jeans.jpg",
      "altText": "High Waist Skinny Jeans by Indigo Lane in dark indigo — women jeans",
      "title": "High Waist Skinny Jeans | Indigo Lane",
      "caption": "Indigo Lane High Waist Skinny Jeans — Stretch Denim, Skinny Fit."
    },
    "reviews": [
      {
        "name": "Rahul A.",
        "rating": 5,
        "text": "Absolutely love the quality — fabric feels premium and the fit is spot on.",
        "date": "2026-05-12"
      },
      {
        "name": "Sadia K.",
        "rating": 4,
        "text": "Great value for the price. Looks even better in person and washes well.",
        "date": "2026-05-13"
      },
      {
        "name": "Tanvir H.",
        "rating": 5,
        "text": "Comfortable and stylish. I've already ordered another color!",
        "date": "2026-05-14"
      }
    ],
    "relatedIds": [
      "fp-003",
      "fp-008",
      "fp-009"
    ],
    "customersAlsoBoughtIds": [
      "fp-010",
      "fp-011",
      "fp-012"
    ],
    "frequentlyBoughtTogetherIds": [
      "fp-013",
      "fp-014",
      "fp-015"
    ]
  },
  {
    "id": "fp-006",
    "slug": "soft-knit-cardigan-sweater-women",
    "name": "Soft Knit Cardigan Sweater",
    "brand": "Maison Rue",
    "sku": "WO-0006",
    "category": "Women",
    "subcategory": "Knitwear",
    "productType": "Cardigan",
    "regularPrice": 2490,
    "salePrice": 1890,
    "discountPercent": 24,
    "rating": 4.6,
    "reviewCount": 132,
    "soldCount": 610,
    "images": {
      "front": "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=700&h=933&q=80",
      "back": "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=700&h=933&q=80",
      "lifestyle": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&h=933&q=80",
      "model": "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=700&h=933&q=80"
    },
    "gallery": [
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=700&h=933&q=80",
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=700&h=933&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&h=933&q=80",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=700&h=933&q=80"
    ],
    "colors": [
      {
        "name": "Cream",
        "hex": "#efe6d3"
      },
      {
        "name": "Dusty Pink",
        "hex": "#d4a5a5"
      },
      {
        "name": "Camel",
        "hex": "#c19a6b"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "seo": {
      "title": "Soft Knit Cardigan Sweater for Women – Maison Rue",
      "metaTitle": "Soft Knit Cardigan Sweater | Maison Rue Women Fashion",
      "metaDescription": "Shop the Soft Knit Cardigan Sweater by Maison Rue in Acrylic Wool Blend. Relaxed Fit, casual style for winter. Now 24% off with fast delivery and easy returns.",
      "keywords": [
        "soft knit cardigan sweater",
        "cardigan women",
        "women fashion",
        "maison rue cardigan",
        "casual wear",
        "buy cardigan online",
        "winter collection"
      ]
    },
    "shortDescription": "The Soft Knit Cardigan Sweater from Maison Rue combines acrylic wool blend with a relaxed fit for effortless comfort. Featuring a ribbed knit design and round neck styling, it's made for casual moments through the winter season — a versatile wardrobe staple that wears beautifully day after day.",
    "longDescription": "Meet the Soft Knit Cardigan Sweater — a thoughtfully crafted cardigan from Maison Rue that brings together premium materials and a refined fit. Made from Acrylic Wool Blend, it is built to feel as good as it looks, with a soft hand-feel and natural drape that holds shape and colour through repeated wear.\n\nFabric & Comfort: the acrylic wool blend sits comfortably against the skin and stays breathable through busy days. The relaxed fit allows a natural range of movement without feeling restrictive, while careful tailoring keeps a clean, flattering line.\n\nStyle Benefits: the ribbed knit aesthetic makes this a genuinely versatile addition to your wardrobe. It layers easily, mixes with relaxed and elevated pieces, and adapts to your mood and the moment for a modern, considered look.\n\nUsage Suggestions: ideally suited for casual settings throughout the winter season, wear it for outings, weekend plans, travel or gatherings. Its adaptable design works across your existing wardrobe, quickly becoming a reliable go-to. Machine wash cold with similar colours to keep it fresh wash after wash.",
    "features": [
      "Premium Acrylic Wool Blend",
      "Breathable, skin-friendly material",
      "Fade-resistant colour retention",
      "Relaxed Fit for all-day comfort",
      "Easy care — machine washable"
    ],
    "specifications": {
      "Material": "Acrylic Wool Blend",
      "Fit Type": "Relaxed Fit",
      "Pattern": "Ribbed Knit",
      "Sleeve Type": "Long Sleeve",
      "Neck Type": "Round Neck",
      "Gender": "Women",
      "Occasion": "Casual",
      "Season": "Winter",
      "Country of Origin": "Bangladesh"
    },
    "image": {
      "fileName": "soft-knit-cardigan-sweater.jpg",
      "altText": "Soft Knit Cardigan Sweater by Maison Rue in cream — women cardigan",
      "title": "Soft Knit Cardigan Sweater | Maison Rue",
      "caption": "Maison Rue Soft Knit Cardigan Sweater — Acrylic Wool Blend, Relaxed Fit."
    },
    "reviews": [
      {
        "name": "Mehjabin R.",
        "rating": 5,
        "text": "Comfortable and stylish. I've already ordered another color!",
        "date": "2026-01-12"
      },
      {
        "name": "Arif M.",
        "rating": 4,
        "text": "Perfect fit and fast delivery. The material is breathable and soft.",
        "date": "2026-01-13"
      },
      {
        "name": "Nusrat J.",
        "rating": 5,
        "text": "Exceeded my expectations. Stitching and finish are top notch.",
        "date": "2026-01-14"
      }
    ],
    "relatedIds": [
      "fp-008",
      "fp-009",
      "fp-010"
    ],
    "customersAlsoBoughtIds": [
      "fp-011",
      "fp-012",
      "fp-013"
    ],
    "frequentlyBoughtTogetherIds": [
      "fp-014",
      "fp-015",
      "fp-004"
    ]
  },
  {
    "id": "fp-007",
    "slug": "silk-touch-blouse-top-women",
    "name": "Silk Touch Blouse Top",
    "brand": "Lumière",
    "sku": "WO-0007",
    "category": "Women",
    "subcategory": "Tops",
    "productType": "Blouse",
    "regularPrice": 1890,
    "salePrice": 1490,
    "discountPercent": 21,
    "rating": 4.4,
    "reviewCount": 118,
    "soldCount": 540,
    "images": {
      "front": "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=700&h=933&q=80",
      "back": "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=700&h=933&q=80",
      "lifestyle": "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=700&h=933&q=80",
      "model": "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=700&h=933&q=80"
    },
    "gallery": [
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=700&h=933&q=80",
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=700&h=933&q=80",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=700&h=933&q=80",
      "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=700&h=933&q=80"
    ],
    "colors": [
      {
        "name": "Champagne",
        "hex": "#e7d3b3"
      },
      {
        "name": "Black",
        "hex": "#1c1c1c"
      },
      {
        "name": "Blush",
        "hex": "#e3b7b7"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "seo": {
      "title": "Silk Touch Blouse Top for Women – Lumière",
      "metaTitle": "Silk Touch Blouse Top | Lumière Women Fashion",
      "metaDescription": "Shop the Silk Touch Blouse Top by Lumière in Satin Polyester. Regular Fit, office style for all season. Now 21% off with fast delivery and easy returns.",
      "keywords": [
        "silk touch blouse top",
        "blouse women",
        "women fashion",
        "lumière blouse",
        "office wear",
        "buy blouse online",
        "all season collection"
      ]
    },
    "shortDescription": "The Silk Touch Blouse Top from Lumière combines satin polyester with a regular fit for effortless comfort. Featuring a solid design and collared styling, it's made for office moments through the all season season — a versatile wardrobe staple that wears beautifully day after day.",
    "longDescription": "Meet the Silk Touch Blouse Top — a thoughtfully crafted blouse from Lumière that brings together premium materials and a refined fit. Made from Satin Polyester, it is built to feel as good as it looks, with a soft hand-feel and natural drape that holds shape and colour through repeated wear.\n\nFabric & Comfort: the satin polyester sits comfortably against the skin and stays breathable through busy days. The regular fit allows a natural range of movement without feeling restrictive, while careful tailoring keeps a clean, flattering line.\n\nStyle Benefits: the solid aesthetic makes this a genuinely versatile addition to your wardrobe. It layers easily, mixes with relaxed and elevated pieces, and adapts to your mood and the moment for a modern, considered look.\n\nUsage Suggestions: ideally suited for office settings throughout the all season season, wear it for outings, weekend plans, travel or gatherings. Its adaptable design works across your existing wardrobe, quickly becoming a reliable go-to. Machine wash cold with similar colours to keep it fresh wash after wash.",
    "features": [
      "Premium Satin Polyester",
      "Breathable, skin-friendly material",
      "Fade-resistant colour retention",
      "Regular Fit for all-day comfort",
      "Easy care — machine washable"
    ],
    "specifications": {
      "Material": "Satin Polyester",
      "Fit Type": "Regular Fit",
      "Pattern": "Solid",
      "Sleeve Type": "Long Sleeve",
      "Neck Type": "Collared",
      "Gender": "Women",
      "Occasion": "Office",
      "Season": "All Season",
      "Country of Origin": "Bangladesh"
    },
    "image": {
      "fileName": "silk-touch-blouse-top.jpg",
      "altText": "Silk Touch Blouse Top by Lumière in champagne — women blouse",
      "title": "Silk Touch Blouse Top | Lumière",
      "caption": "Lumière Silk Touch Blouse Top — Satin Polyester, Regular Fit."
    },
    "reviews": [
      {
        "name": "Imran S.",
        "rating": 5,
        "text": "Exceeded my expectations. Stitching and finish are top notch.",
        "date": "2026-02-12"
      },
      {
        "name": "Farzana B.",
        "rating": 4,
        "text": "Stylish design, true to size, and very comfortable to wear all day.",
        "date": "2026-02-13"
      },
      {
        "name": "Sabbir N.",
        "rating": 5,
        "text": "Good quality fabric, holds shape after wash. Highly recommend.",
        "date": "2026-02-14"
      }
    ],
    "relatedIds": [
      "fp-009",
      "fp-010",
      "fp-011"
    ],
    "customersAlsoBoughtIds": [
      "fp-012",
      "fp-013",
      "fp-014"
    ],
    "frequentlyBoughtTogetherIds": [
      "fp-015",
      "fp-004",
      "fp-005"
    ]
  },
  {
    "id": "fp-008",
    "slug": "kids-dinosaur-print-t-shirt-boys",
    "name": "Kids Dinosaur Print T-Shirt",
    "brand": "Tiny Trails",
    "sku": "KI-0008",
    "category": "Kids",
    "subcategory": "T-Shirts",
    "productType": "T-Shirt",
    "regularPrice": 690,
    "salePrice": 490,
    "discountPercent": 29,
    "rating": 4.8,
    "reviewCount": 205,
    "soldCount": 1880,
    "images": {
      "front": "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=700&h=933&q=80",
      "back": "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=700&h=933&q=80",
      "lifestyle": "https://images.unsplash.com/photo-1503944168849-8bf86875bbd8?auto=format&fit=crop&w=700&h=933&q=80",
      "model": "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?auto=format&fit=crop&w=700&h=933&q=80"
    },
    "gallery": [
      "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=700&h=933&q=80",
      "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=700&h=933&q=80",
      "https://images.unsplash.com/photo-1503944168849-8bf86875bbd8?auto=format&fit=crop&w=700&h=933&q=80",
      "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?auto=format&fit=crop&w=700&h=933&q=80"
    ],
    "colors": [
      {
        "name": "Sky Blue",
        "hex": "#9fc3e0"
      },
      {
        "name": "Sunny Yellow",
        "hex": "#e9c46a"
      },
      {
        "name": "Mint",
        "hex": "#a8d5c2"
      }
    ],
    "sizes": [
      "2-3Y",
      "4-5Y",
      "6-7Y",
      "8-9Y",
      "10-11Y"
    ],
    "seo": {
      "title": "Kids Dinosaur Print T-Shirt for Boys – Tiny Trails",
      "metaTitle": "Kids Dinosaur Print T-Shirt | Tiny Trails Kids Fashion",
      "metaDescription": "Shop the Kids Dinosaur Print T-Shirt by Tiny Trails in Organic Cotton Jersey. Regular Fit, casual style for summer. Now 29% off with fast delivery and easy retu",
      "keywords": [
        "kids dinosaur print t-shirt",
        "t-shirt boys",
        "kids fashion",
        "tiny trails t-shirt",
        "casual wear",
        "buy t-shirt online",
        "summer collection"
      ]
    },
    "shortDescription": "The Kids Dinosaur Print T-Shirt from Tiny Trails combines organic cotton jersey with a regular fit for effortless comfort. Featuring a graphic print design and crew neck styling, it's made for casual moments through the summer season — a versatile wardrobe staple that wears beautifully day after day.",
    "longDescription": "Meet the Kids Dinosaur Print T-Shirt — a thoughtfully crafted t-shirt from Tiny Trails that brings together premium materials and a refined fit. Made from Organic Cotton Jersey, it is built to feel as good as it looks, with a soft hand-feel and natural drape that holds shape and colour through repeated wear.\n\nFabric & Comfort: the organic cotton jersey sits comfortably against the skin and stays breathable through busy days. The regular fit allows a natural range of movement without feeling restrictive, while careful tailoring keeps a clean, flattering line.\n\nStyle Benefits: the graphic print aesthetic makes this a genuinely versatile addition to your wardrobe. It layers easily, mixes with relaxed and elevated pieces, and adapts to your mood and the moment for a modern, considered look.\n\nUsage Suggestions: ideally suited for casual settings throughout the summer season, wear it for outings, weekend plans, travel or gatherings. Its adaptable design works across your existing wardrobe, quickly becoming a reliable go-to. Machine wash cold with similar colours to keep it fresh wash after wash.",
    "features": [
      "Premium Organic Cotton Jersey",
      "Breathable, skin-friendly material",
      "Fade-resistant colour retention",
      "Regular Fit for all-day comfort",
      "Easy care — machine washable"
    ],
    "specifications": {
      "Material": "Organic Cotton Jersey",
      "Fit Type": "Regular Fit",
      "Pattern": "Graphic Print",
      "Sleeve Type": "Short Sleeve",
      "Neck Type": "Crew Neck",
      "Gender": "Boys",
      "Occasion": "Casual",
      "Season": "Summer",
      "Country of Origin": "Bangladesh"
    },
    "image": {
      "fileName": "kids-dinosaur-print-t-shirt.jpg",
      "altText": "Kids Dinosaur Print T-Shirt by Tiny Trails in sky blue — kids t-shirt",
      "title": "Kids Dinosaur Print T-Shirt | Tiny Trails",
      "caption": "Tiny Trails Kids Dinosaur Print T-Shirt — Organic Cotton Jersey, Regular Fit."
    },
    "reviews": [
      {
        "name": "Lamia C.",
        "rating": 5,
        "text": "Good quality fabric, holds shape after wash. Highly recommend.",
        "date": "2026-03-12"
      },
      {
        "name": "Hasib R.",
        "rating": 4,
        "text": "Lovely colour and texture. Worth every taka, will buy again.",
        "date": "2026-03-13"
      },
      {
        "name": "Tahmina A.",
        "rating": 5,
        "text": "Absolutely love the quality — fabric feels premium and the fit is spot on.",
        "date": "2026-03-14"
      }
    ],
    "relatedIds": [
      "fp-007",
      "fp-011",
      "fp-012"
    ],
    "customersAlsoBoughtIds": [
      "fp-013",
      "fp-014",
      "fp-015"
    ],
    "frequentlyBoughtTogetherIds": [
      "fp-009",
      "fp-010",
      "fp-001"
    ]
  },
  {
    "id": "fp-009",
    "slug": "kids-denim-dungaree-set",
    "name": "Kids Denim Dungaree Set",
    "brand": "Tiny Trails",
    "sku": "KI-0009",
    "category": "Kids",
    "subcategory": "Sets",
    "productType": "Dungaree",
    "regularPrice": 1290,
    "salePrice": 990,
    "discountPercent": 23,
    "rating": 4.7,
    "reviewCount": 143,
    "soldCount": 720,
    "images": {
      "front": "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=700&h=933&q=80",
      "back": "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=700&h=933&q=80",
      "lifestyle": "https://images.unsplash.com/photo-1503944168849-8bf86875bbd8?auto=format&fit=crop&w=700&h=933&q=80",
      "model": "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?auto=format&fit=crop&w=700&h=933&q=80"
    },
    "gallery": [
      "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=700&h=933&q=80",
      "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=700&h=933&q=80",
      "https://images.unsplash.com/photo-1503944168849-8bf86875bbd8?auto=format&fit=crop&w=700&h=933&q=80",
      "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?auto=format&fit=crop&w=700&h=933&q=80"
    ],
    "colors": [
      {
        "name": "Light Blue",
        "hex": "#a9c6dd"
      },
      {
        "name": "Indigo",
        "hex": "#26314f"
      }
    ],
    "sizes": [
      "2-3Y",
      "4-5Y",
      "6-7Y",
      "8-9Y",
      "10-11Y"
    ],
    "seo": {
      "title": "Kids Denim Dungaree Set – Tiny Trails",
      "metaTitle": "Kids Denim Dungaree Set | Tiny Trails Kids Fashion",
      "metaDescription": "Shop the Kids Denim Dungaree Set by Tiny Trails in Cotton Denim. Relaxed Fit, casual style for all season. Now 23% off with fast delivery and easy returns.",
      "keywords": [
        "kids denim dungaree set",
        "dungaree unisex",
        "kids fashion",
        "tiny trails dungaree",
        "casual wear",
        "buy dungaree online",
        "all season collection"
      ]
    },
    "shortDescription": "The Kids Denim Dungaree Set from Tiny Trails combines cotton denim with a relaxed fit for effortless comfort. Featuring a solid design and bib front styling, it's made for casual moments through the all season season — a versatile wardrobe staple that wears beautifully day after day.",
    "longDescription": "Meet the Kids Denim Dungaree Set — a thoughtfully crafted dungaree from Tiny Trails that brings together premium materials and a refined fit. Made from Cotton Denim, it is built to feel as good as it looks, with a soft hand-feel and natural drape that holds shape and colour through repeated wear.\n\nFabric & Comfort: the cotton denim sits comfortably against the skin and stays breathable through busy days. The relaxed fit allows a natural range of movement without feeling restrictive, while careful tailoring keeps a clean, flattering line.\n\nStyle Benefits: the solid aesthetic makes this a genuinely versatile addition to your wardrobe. It layers easily, mixes with relaxed and elevated pieces, and adapts to your mood and the moment for a modern, considered look.\n\nUsage Suggestions: ideally suited for casual settings throughout the all season season, wear it for outings, weekend plans, travel or gatherings. Its adaptable design works across your existing wardrobe, quickly becoming a reliable go-to. Machine wash cold with similar colours to keep it fresh wash after wash.",
    "features": [
      "Premium Cotton Denim",
      "Breathable, skin-friendly material",
      "Fade-resistant colour retention",
      "Relaxed Fit for all-day comfort",
      "Easy care — machine washable"
    ],
    "specifications": {
      "Material": "Cotton Denim",
      "Fit Type": "Relaxed Fit",
      "Pattern": "Solid",
      "Sleeve Type": "Sleeveless",
      "Neck Type": "Bib Front",
      "Gender": "Unisex",
      "Occasion": "Casual",
      "Season": "All Season",
      "Country of Origin": "Bangladesh"
    },
    "image": {
      "fileName": "kids-denim-dungaree-set.jpg",
      "altText": "Kids Denim Dungaree Set by Tiny Trails in light blue — kids dungaree",
      "title": "Kids Denim Dungaree Set | Tiny Trails",
      "caption": "Tiny Trails Kids Denim Dungaree Set — Cotton Denim, Relaxed Fit."
    },
    "reviews": [
      {
        "name": "Rahul A.",
        "rating": 5,
        "text": "Absolutely love the quality — fabric feels premium and the fit is spot on.",
        "date": "2026-04-12"
      },
      {
        "name": "Sadia K.",
        "rating": 4,
        "text": "Great value for the price. Looks even better in person and washes well.",
        "date": "2026-04-13"
      },
      {
        "name": "Tanvir H.",
        "rating": 5,
        "text": "Comfortable and stylish. I've already ordered another color!",
        "date": "2026-04-14"
      }
    ],
    "relatedIds": [
      "fp-011",
      "fp-012",
      "fp-013"
    ],
    "customersAlsoBoughtIds": [
      "fp-014",
      "fp-015",
      "fp-008"
    ],
    "frequentlyBoughtTogetherIds": [
      "fp-010",
      "fp-001",
      "fp-002"
    ]
  },
  {
    "id": "fp-010",
    "slug": "girls-tulle-party-frock-girls",
    "name": "Girls Tulle Party Frock",
    "brand": "Petal & Bloom",
    "sku": "KI-0010",
    "category": "Kids",
    "subcategory": "Dresses",
    "productType": "Frock",
    "regularPrice": 1490,
    "salePrice": 1190,
    "discountPercent": 20,
    "rating": 4.6,
    "reviewCount": 98,
    "soldCount": 460,
    "images": {
      "front": "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=700&h=933&q=80",
      "back": "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=700&h=933&q=80",
      "lifestyle": "https://images.unsplash.com/photo-1503944168849-8bf86875bbd8?auto=format&fit=crop&w=700&h=933&q=80",
      "model": "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?auto=format&fit=crop&w=700&h=933&q=80"
    },
    "gallery": [
      "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=700&h=933&q=80",
      "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=700&h=933&q=80",
      "https://images.unsplash.com/photo-1503944168849-8bf86875bbd8?auto=format&fit=crop&w=700&h=933&q=80",
      "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?auto=format&fit=crop&w=700&h=933&q=80"
    ],
    "colors": [
      {
        "name": "Pink",
        "hex": "#e3b7b7"
      },
      {
        "name": "Lavender",
        "hex": "#c3b1e1"
      },
      {
        "name": "Peach",
        "hex": "#f2c6a0"
      }
    ],
    "sizes": [
      "2-3Y",
      "4-5Y",
      "6-7Y",
      "8-9Y",
      "10-11Y"
    ],
    "seo": {
      "title": "Girls Tulle Party Frock for Girls – Petal & Bloom",
      "metaTitle": "Girls Tulle Party Frock | Petal & Bloom Kids Fashion",
      "metaDescription": "Shop the Girls Tulle Party Frock by Petal & Bloom in Tulle Net Cotton. Flared Fit, party style for spring. Now 20% off with fast delivery and easy returns.",
      "keywords": [
        "girls tulle party frock",
        "frock girls",
        "kids fashion",
        "petal & bloom frock",
        "party wear",
        "buy frock online",
        "spring collection"
      ]
    },
    "shortDescription": "The Girls Tulle Party Frock from Petal & Bloom combines tulle net cotton with a flared fit for effortless comfort. Featuring a solid design and round neck styling, it's made for party moments through the spring season — a versatile wardrobe staple that wears beautifully day after day.",
    "longDescription": "Meet the Girls Tulle Party Frock — a thoughtfully crafted frock from Petal & Bloom that brings together premium materials and a refined fit. Made from Tulle Net Cotton, it is built to feel as good as it looks, with a soft hand-feel and natural drape that holds shape and colour through repeated wear.\n\nFabric & Comfort: the tulle net cotton sits comfortably against the skin and stays breathable through busy days. The flared fit allows a natural range of movement without feeling restrictive, while careful tailoring keeps a clean, flattering line.\n\nStyle Benefits: the solid aesthetic makes this a genuinely versatile addition to your wardrobe. It layers easily, mixes with relaxed and elevated pieces, and adapts to your mood and the moment for a modern, considered look.\n\nUsage Suggestions: ideally suited for party settings throughout the spring season, wear it for outings, weekend plans, travel or gatherings. Its adaptable design works across your existing wardrobe, quickly becoming a reliable go-to. Machine wash cold with similar colours to keep it fresh wash after wash.",
    "features": [
      "Premium Tulle Net Cotton",
      "Breathable, skin-friendly material",
      "Fade-resistant colour retention",
      "Flared Fit for all-day comfort",
      "Easy care — machine washable"
    ],
    "specifications": {
      "Material": "Tulle Net Cotton",
      "Fit Type": "Flared Fit",
      "Pattern": "Solid",
      "Sleeve Type": "Sleeveless",
      "Neck Type": "Round Neck",
      "Gender": "Girls",
      "Occasion": "Party",
      "Season": "Spring",
      "Country of Origin": "Bangladesh"
    },
    "image": {
      "fileName": "girls-tulle-party-frock.jpg",
      "altText": "Girls Tulle Party Frock by Petal & Bloom in pink — kids frock",
      "title": "Girls Tulle Party Frock | Petal & Bloom",
      "caption": "Petal & Bloom Girls Tulle Party Frock — Tulle Net Cotton, Flared Fit."
    },
    "reviews": [
      {
        "name": "Mehjabin R.",
        "rating": 5,
        "text": "Comfortable and stylish. I've already ordered another color!",
        "date": "2026-05-12"
      },
      {
        "name": "Arif M.",
        "rating": 4,
        "text": "Perfect fit and fast delivery. The material is breathable and soft.",
        "date": "2026-05-13"
      },
      {
        "name": "Nusrat J.",
        "rating": 5,
        "text": "Exceeded my expectations. Stitching and finish are top notch.",
        "date": "2026-05-14"
      }
    ],
    "relatedIds": [
      "fp-012",
      "fp-013",
      "fp-014"
    ],
    "customersAlsoBoughtIds": [
      "fp-015",
      "fp-008",
      "fp-009"
    ],
    "frequentlyBoughtTogetherIds": [
      "fp-001",
      "fp-002",
      "fp-003"
    ]
  },
  {
    "id": "fp-011",
    "slug": "teens-oversized-graphic-hoodie",
    "name": "Teens Oversized Graphic Hoodie",
    "brand": "Voltz",
    "sku": "TE-0011",
    "category": "Teens",
    "subcategory": "Hoodies",
    "productType": "Hoodie",
    "regularPrice": 1990,
    "salePrice": 1490,
    "discountPercent": 25,
    "rating": 4.7,
    "reviewCount": 176,
    "soldCount": 1120,
    "images": {
      "front": "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=700&h=933&q=80",
      "back": "https://images.unsplash.com/photo-1492447166138-50c3889fccb1?auto=format&fit=crop&w=700&h=933&q=80",
      "lifestyle": "https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?auto=format&fit=crop&w=700&h=933&q=80",
      "model": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=700&h=933&q=80"
    },
    "gallery": [
      "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=700&h=933&q=80",
      "https://images.unsplash.com/photo-1492447166138-50c3889fccb1?auto=format&fit=crop&w=700&h=933&q=80",
      "https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?auto=format&fit=crop&w=700&h=933&q=80",
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=700&h=933&q=80"
    ],
    "colors": [
      {
        "name": "Black",
        "hex": "#1c1c1c"
      },
      {
        "name": "Beige",
        "hex": "#d8cbb3"
      },
      {
        "name": "Burgundy",
        "hex": "#6e1f2b"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "seo": {
      "title": "Teens Oversized Graphic Hoodie – Voltz",
      "metaTitle": "Teens Oversized Graphic Hoodie | Voltz Teens Fashion",
      "metaDescription": "Shop the Teens Oversized Graphic Hoodie by Voltz in Cotton Fleece Blend. Oversized Fit, casual style for winter. Now 25% off with fast delivery and easy returns",
      "keywords": [
        "teens oversized graphic hoodie",
        "hoodie unisex",
        "teens fashion",
        "voltz hoodie",
        "casual wear",
        "buy hoodie online",
        "winter collection"
      ]
    },
    "shortDescription": "The Teens Oversized Graphic Hoodie from Voltz combines cotton fleece blend with a oversized fit for effortless comfort. Featuring a graphic print design and hooded styling, it's made for casual moments through the winter season — a versatile wardrobe staple that wears beautifully day after day.",
    "longDescription": "Meet the Teens Oversized Graphic Hoodie — a thoughtfully crafted hoodie from Voltz that brings together premium materials and a refined fit. Made from Cotton Fleece Blend, it is built to feel as good as it looks, with a soft hand-feel and natural drape that holds shape and colour through repeated wear.\n\nFabric & Comfort: the cotton fleece blend sits comfortably against the skin and stays breathable through busy days. The oversized fit allows a natural range of movement without feeling restrictive, while careful tailoring keeps a clean, flattering line.\n\nStyle Benefits: the graphic print aesthetic makes this a genuinely versatile addition to your wardrobe. It layers easily, mixes with relaxed and elevated pieces, and adapts to your mood and the moment for a modern, considered look.\n\nUsage Suggestions: ideally suited for casual settings throughout the winter season, wear it for outings, weekend plans, travel or gatherings. Its adaptable design works across your existing wardrobe, quickly becoming a reliable go-to. Machine wash cold with similar colours to keep it fresh wash after wash.",
    "features": [
      "Premium Cotton Fleece Blend",
      "Breathable, skin-friendly material",
      "Fade-resistant colour retention",
      "Oversized Fit for all-day comfort",
      "Easy care — machine washable"
    ],
    "specifications": {
      "Material": "Cotton Fleece Blend",
      "Fit Type": "Oversized Fit",
      "Pattern": "Graphic Print",
      "Sleeve Type": "Long Sleeve",
      "Neck Type": "Hooded",
      "Gender": "Unisex",
      "Occasion": "Casual",
      "Season": "Winter",
      "Country of Origin": "Bangladesh"
    },
    "image": {
      "fileName": "teens-oversized-graphic-hoodie.jpg",
      "altText": "Teens Oversized Graphic Hoodie by Voltz in black — teens hoodie",
      "title": "Teens Oversized Graphic Hoodie | Voltz",
      "caption": "Voltz Teens Oversized Graphic Hoodie — Cotton Fleece Blend, Oversized Fit."
    },
    "reviews": [
      {
        "name": "Imran S.",
        "rating": 5,
        "text": "Exceeded my expectations. Stitching and finish are top notch.",
        "date": "2026-01-12"
      },
      {
        "name": "Farzana B.",
        "rating": 4,
        "text": "Stylish design, true to size, and very comfortable to wear all day.",
        "date": "2026-01-13"
      },
      {
        "name": "Sabbir N.",
        "rating": 5,
        "text": "Good quality fabric, holds shape after wash. Highly recommend.",
        "date": "2026-01-14"
      }
    ],
    "relatedIds": [
      "fp-013",
      "fp-014",
      "fp-015"
    ],
    "customersAlsoBoughtIds": [
      "fp-012",
      "fp-001",
      "fp-002"
    ],
    "frequentlyBoughtTogetherIds": [
      "fp-003",
      "fp-004",
      "fp-005"
    ]
  },
  {
    "id": "fp-012",
    "slug": "teens-cargo-jogger-pants",
    "name": "Teens Cargo Jogger Pants",
    "brand": "Voltz",
    "sku": "TE-0012",
    "category": "Teens",
    "subcategory": "Bottoms",
    "productType": "Joggers",
    "regularPrice": 1690,
    "salePrice": 1290,
    "discountPercent": 24,
    "rating": 4.5,
    "reviewCount": 134,
    "soldCount": 690,
    "images": {
      "front": "https://images.unsplash.com/photo-1503342394128-c104d54dba01?auto=format&fit=crop&w=700&h=933&q=80",
      "back": "https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=700&h=933&q=80",
      "lifestyle": "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=700&h=933&q=80",
      "model": "https://images.unsplash.com/photo-1492447166138-50c3889fccb1?auto=format&fit=crop&w=700&h=933&q=80"
    },
    "gallery": [
      "https://images.unsplash.com/photo-1503342394128-c104d54dba01?auto=format&fit=crop&w=700&h=933&q=80",
      "https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=700&h=933&q=80",
      "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=700&h=933&q=80",
      "https://images.unsplash.com/photo-1492447166138-50c3889fccb1?auto=format&fit=crop&w=700&h=933&q=80"
    ],
    "colors": [
      {
        "name": "Olive",
        "hex": "#5b5a3a"
      },
      {
        "name": "Black",
        "hex": "#1c1c1c"
      },
      {
        "name": "Stone",
        "hex": "#b8ae9c"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "seo": {
      "title": "Teens Cargo Jogger Pants – Voltz",
      "metaTitle": "Teens Cargo Jogger Pants | Voltz Teens Fashion",
      "metaDescription": "Shop the Teens Cargo Jogger Pants by Voltz in Cotton Twill. Tapered Fit, casual style for all season. Now 24% off with fast delivery and easy returns.",
      "keywords": [
        "teens cargo jogger pants",
        "joggers unisex",
        "teens fashion",
        "voltz joggers",
        "casual wear",
        "buy joggers online",
        "all season collection"
      ]
    },
    "shortDescription": "The Teens Cargo Jogger Pants from Voltz combines cotton twill with a tapered fit for effortless comfort. Featuring a solid design and elastic waist styling, it's made for casual moments through the all season season — a versatile wardrobe staple that wears beautifully day after day.",
    "longDescription": "Meet the Teens Cargo Jogger Pants — a thoughtfully crafted joggers from Voltz that brings together premium materials and a refined fit. Made from Cotton Twill, it is built to feel as good as it looks, with a soft hand-feel and natural drape that holds shape and colour through repeated wear.\n\nFabric & Comfort: the cotton twill sits comfortably against the skin and stays breathable through busy days. The tapered fit allows a natural range of movement without feeling restrictive, while careful tailoring keeps a clean, flattering line.\n\nStyle Benefits: the solid aesthetic makes this a genuinely versatile addition to your wardrobe. It layers easily, mixes with relaxed and elevated pieces, and adapts to your mood and the moment for a modern, considered look.\n\nUsage Suggestions: ideally suited for casual settings throughout the all season season, wear it for outings, weekend plans, travel or gatherings. Its adaptable design works across your existing wardrobe, quickly becoming a reliable go-to. Machine wash cold with similar colours to keep it fresh wash after wash.",
    "features": [
      "Premium Cotton Twill",
      "Breathable, skin-friendly material",
      "Fade-resistant colour retention",
      "Tapered Fit for all-day comfort",
      "Easy care — machine washable"
    ],
    "specifications": {
      "Material": "Cotton Twill",
      "Fit Type": "Tapered Fit",
      "Pattern": "Solid",
      "Sleeve Type": "Sleeveless",
      "Neck Type": "Elastic Waist",
      "Gender": "Unisex",
      "Occasion": "Casual",
      "Season": "All Season",
      "Country of Origin": "Bangladesh"
    },
    "image": {
      "fileName": "teens-cargo-jogger-pants.jpg",
      "altText": "Teens Cargo Jogger Pants by Voltz in olive — teens joggers",
      "title": "Teens Cargo Jogger Pants | Voltz",
      "caption": "Voltz Teens Cargo Jogger Pants — Cotton Twill, Tapered Fit."
    },
    "reviews": [
      {
        "name": "Lamia C.",
        "rating": 5,
        "text": "Good quality fabric, holds shape after wash. Highly recommend.",
        "date": "2026-02-12"
      },
      {
        "name": "Hasib R.",
        "rating": 4,
        "text": "Lovely colour and texture. Worth every taka, will buy again.",
        "date": "2026-02-13"
      },
      {
        "name": "Tahmina A.",
        "rating": 5,
        "text": "Absolutely love the quality — fabric feels premium and the fit is spot on.",
        "date": "2026-02-14"
      }
    ],
    "relatedIds": [
      "fp-014",
      "fp-015",
      "fp-011"
    ],
    "customersAlsoBoughtIds": [
      "fp-001",
      "fp-002",
      "fp-003"
    ],
    "frequentlyBoughtTogetherIds": [
      "fp-004",
      "fp-005",
      "fp-006"
    ]
  },
  {
    "id": "fp-013",
    "slug": "men-s-pro-running-shoes-men",
    "name": "Men's Pro Running Shoes",
    "brand": "Velocity",
    "sku": "SP-0013",
    "category": "Sports",
    "subcategory": "Footwear",
    "productType": "Running Shoes",
    "regularPrice": 3490,
    "salePrice": 2790,
    "discountPercent": 20,
    "rating": 4.8,
    "reviewCount": 312,
    "soldCount": 1640,
    "images": {
      "front": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&h=933&q=80",
      "back": "https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=700&h=933&q=80",
      "lifestyle": "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=700&h=933&q=80",
      "model": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=700&h=933&q=80"
    },
    "gallery": [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&h=933&q=80",
      "https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=700&h=933&q=80",
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=700&h=933&q=80",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=700&h=933&q=80"
    ],
    "colors": [
      {
        "name": "Black/Red",
        "hex": "#1c1c1c"
      },
      {
        "name": "Grey",
        "hex": "#8a8a8a"
      },
      {
        "name": "Blue",
        "hex": "#2f5d8a"
      }
    ],
    "sizes": [
      "40",
      "41",
      "42",
      "43",
      "44"
    ],
    "seo": {
      "title": "Men's Pro Running Shoes for Men – Velocity",
      "metaTitle": "Men's Pro Running Shoes | Velocity Sports Fashion",
      "metaDescription": "Shop the Men's Pro Running Shoes by Velocity in Mesh Knit Upper. Performance Fit, sports style for all season. Now 20% off with fast delivery and easy returns.",
      "keywords": [
        "men's pro running shoes",
        "running shoes men",
        "sports fashion",
        "velocity running shoes",
        "sports wear",
        "buy running shoes online",
        "all season collection"
      ]
    },
    "shortDescription": "The Men's Pro Running Shoes from Velocity combines mesh knit upper with a performance fit for effortless comfort. Featuring a solid design and lace-up styling, it's made for sports moments through the all season season — a versatile wardrobe staple that wears beautifully day after day.",
    "longDescription": "Meet the Men's Pro Running Shoes — a thoughtfully crafted running shoes from Velocity that brings together premium materials and a refined fit. Made from Mesh Knit Upper, it is built to feel as good as it looks, with a soft hand-feel and natural drape that holds shape and colour through repeated wear.\n\nFabric & Comfort: the mesh knit upper sits comfortably against the skin and stays breathable through busy days. The performance fit allows a natural range of movement without feeling restrictive, while careful tailoring keeps a clean, flattering line.\n\nStyle Benefits: the solid aesthetic makes this a genuinely versatile addition to your wardrobe. It layers easily, mixes with relaxed and elevated pieces, and adapts to your mood and the moment for a modern, considered look.\n\nUsage Suggestions: ideally suited for sports settings throughout the all season season, wear it for outings, weekend plans, travel or gatherings. Its adaptable design works across your existing wardrobe, quickly becoming a reliable go-to. Machine wash cold with similar colours to keep it fresh wash after wash.",
    "features": [
      "Premium Mesh Knit Upper",
      "Breathable, skin-friendly material",
      "Fade-resistant colour retention",
      "Performance Fit for all-day comfort",
      "Easy care — machine washable"
    ],
    "specifications": {
      "Material": "Mesh Knit Upper",
      "Fit Type": "Performance Fit",
      "Pattern": "Solid",
      "Sleeve Type": "Sleeveless",
      "Neck Type": "Lace-Up",
      "Gender": "Men",
      "Occasion": "Sports",
      "Season": "All Season",
      "Country of Origin": "Bangladesh"
    },
    "image": {
      "fileName": "men-s-pro-running-shoes.jpg",
      "altText": "Men's Pro Running Shoes by Velocity in black/red — sports running shoes",
      "title": "Men's Pro Running Shoes | Velocity",
      "caption": "Velocity Men's Pro Running Shoes — Mesh Knit Upper, Performance Fit."
    },
    "reviews": [
      {
        "name": "Rahul A.",
        "rating": 5,
        "text": "Absolutely love the quality — fabric feels premium and the fit is spot on.",
        "date": "2026-03-12"
      },
      {
        "name": "Sadia K.",
        "rating": 4,
        "text": "Great value for the price. Looks even better in person and washes well.",
        "date": "2026-03-13"
      },
      {
        "name": "Tanvir H.",
        "rating": 5,
        "text": "Comfortable and stylish. I've already ordered another color!",
        "date": "2026-03-14"
      }
    ],
    "relatedIds": [
      "fp-012",
      "fp-014",
      "fp-015"
    ],
    "customersAlsoBoughtIds": [
      "fp-001",
      "fp-002",
      "fp-003"
    ],
    "frequentlyBoughtTogetherIds": [
      "fp-004",
      "fp-005",
      "fp-006"
    ]
  },
  {
    "id": "fp-014",
    "slug": "women-s-seamless-sports-bra-women",
    "name": "Women's Seamless Sports Bra",
    "brand": "Velocity",
    "sku": "SP-0014",
    "category": "Sports",
    "subcategory": "Activewear",
    "productType": "Sports Bra",
    "regularPrice": 1290,
    "salePrice": 990,
    "discountPercent": 23,
    "rating": 4.6,
    "reviewCount": 228,
    "soldCount": 1380,
    "images": {
      "front": "https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&w=700&h=933&q=80",
      "back": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=700&h=933&q=80",
      "lifestyle": "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=700&h=933&q=80",
      "model": "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=700&h=933&q=80"
    },
    "gallery": [
      "https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&w=700&h=933&q=80",
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=700&h=933&q=80",
      "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=700&h=933&q=80",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=700&h=933&q=80"
    ],
    "colors": [
      {
        "name": "Black",
        "hex": "#1c1c1c"
      },
      {
        "name": "Mauve",
        "hex": "#b08a92"
      },
      {
        "name": "Teal",
        "hex": "#2f7d7d"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "seo": {
      "title": "Women's Seamless Sports Bra for Women – Velocity",
      "metaTitle": "Women's Seamless Sports Bra | Velocity Sports Fashion",
      "metaDescription": "Shop the Women's Seamless Sports Bra by Velocity in Nylon Spandex Blend. Compression Fit, gym style for all season. Now 23% off with fast delivery and easy retu",
      "keywords": [
        "women's seamless sports bra",
        "sports bra women",
        "sports fashion",
        "velocity sports bra",
        "gym wear",
        "buy sports bra online",
        "all season collection"
      ]
    },
    "shortDescription": "The Women's Seamless Sports Bra from Velocity combines nylon spandex blend with a compression fit for effortless comfort. Featuring a solid design and racerback styling, it's made for gym moments through the all season season — a versatile wardrobe staple that wears beautifully day after day.",
    "longDescription": "Meet the Women's Seamless Sports Bra — a thoughtfully crafted sports bra from Velocity that brings together premium materials and a refined fit. Made from Nylon Spandex Blend, it is built to feel as good as it looks, with a soft hand-feel and natural drape that holds shape and colour through repeated wear.\n\nFabric & Comfort: the nylon spandex blend sits comfortably against the skin and stays breathable through busy days. The compression fit allows a natural range of movement without feeling restrictive, while careful tailoring keeps a clean, flattering line.\n\nStyle Benefits: the solid aesthetic makes this a genuinely versatile addition to your wardrobe. It layers easily, mixes with relaxed and elevated pieces, and adapts to your mood and the moment for a modern, considered look.\n\nUsage Suggestions: ideally suited for gym settings throughout the all season season, wear it for outings, weekend plans, travel or gatherings. Its adaptable design works across your existing wardrobe, quickly becoming a reliable go-to. Machine wash cold with similar colours to keep it fresh wash after wash.",
    "features": [
      "Premium Nylon Spandex Blend",
      "Breathable, skin-friendly material",
      "Fade-resistant colour retention",
      "Compression Fit for all-day comfort",
      "Easy care — machine washable"
    ],
    "specifications": {
      "Material": "Nylon Spandex Blend",
      "Fit Type": "Compression Fit",
      "Pattern": "Solid",
      "Sleeve Type": "Sleeveless",
      "Neck Type": "Racerback",
      "Gender": "Women",
      "Occasion": "Gym",
      "Season": "All Season",
      "Country of Origin": "Bangladesh"
    },
    "image": {
      "fileName": "women-s-seamless-sports-bra.jpg",
      "altText": "Women's Seamless Sports Bra by Velocity in black — sports sports bra",
      "title": "Women's Seamless Sports Bra | Velocity",
      "caption": "Velocity Women's Seamless Sports Bra — Nylon Spandex Blend, Compression Fit."
    },
    "reviews": [
      {
        "name": "Mehjabin R.",
        "rating": 5,
        "text": "Comfortable and stylish. I've already ordered another color!",
        "date": "2026-04-12"
      },
      {
        "name": "Arif M.",
        "rating": 4,
        "text": "Perfect fit and fast delivery. The material is breathable and soft.",
        "date": "2026-04-13"
      },
      {
        "name": "Nusrat J.",
        "rating": 5,
        "text": "Exceeded my expectations. Stitching and finish are top notch.",
        "date": "2026-04-14"
      }
    ],
    "relatedIds": [
      "fp-013",
      "fp-015",
      "fp-001"
    ],
    "customersAlsoBoughtIds": [
      "fp-002",
      "fp-003",
      "fp-004"
    ],
    "frequentlyBoughtTogetherIds": [
      "fp-005",
      "fp-006",
      "fp-007"
    ]
  },
  {
    "id": "fp-015",
    "slug": "quick-dry-training-shorts-men",
    "name": "Quick Dry Training Shorts",
    "brand": "Velocity",
    "sku": "SP-0015",
    "category": "Sports",
    "subcategory": "Activewear",
    "productType": "Shorts",
    "regularPrice": 990,
    "salePrice": 790,
    "discountPercent": 20,
    "rating": 4.5,
    "reviewCount": 196,
    "soldCount": 1240,
    "images": {
      "front": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&h=933&q=80",
      "back": "https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=700&h=933&q=80",
      "lifestyle": "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=700&h=933&q=80",
      "model": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=700&h=933&q=80"
    },
    "gallery": [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&h=933&q=80",
      "https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=700&h=933&q=80",
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=700&h=933&q=80",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=700&h=933&q=80"
    ],
    "colors": [
      {
        "name": "Black",
        "hex": "#1c1c1c"
      },
      {
        "name": "Navy",
        "hex": "#26314f"
      },
      {
        "name": "Grey",
        "hex": "#8a8a8a"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "seo": {
      "title": "Quick Dry Training Shorts for Men – Velocity",
      "metaTitle": "Quick Dry Training Shorts | Velocity Sports Fashion",
      "metaDescription": "Shop the Quick Dry Training Shorts by Velocity in Recycled Polyester. Athletic Fit, gym style for summer. Now 20% off with fast delivery and easy returns.",
      "keywords": [
        "quick dry training shorts",
        "shorts men",
        "sports fashion",
        "velocity shorts",
        "gym wear",
        "buy shorts online",
        "summer collection"
      ]
    },
    "shortDescription": "The Quick Dry Training Shorts from Velocity combines recycled polyester with a athletic fit for effortless comfort. Featuring a solid design and elastic waist styling, it's made for gym moments through the summer season — a versatile wardrobe staple that wears beautifully day after day.",
    "longDescription": "Meet the Quick Dry Training Shorts — a thoughtfully crafted shorts from Velocity that brings together premium materials and a refined fit. Made from Recycled Polyester, it is built to feel as good as it looks, with a soft hand-feel and natural drape that holds shape and colour through repeated wear.\n\nFabric & Comfort: the recycled polyester sits comfortably against the skin and stays breathable through busy days. The athletic fit allows a natural range of movement without feeling restrictive, while careful tailoring keeps a clean, flattering line.\n\nStyle Benefits: the solid aesthetic makes this a genuinely versatile addition to your wardrobe. It layers easily, mixes with relaxed and elevated pieces, and adapts to your mood and the moment for a modern, considered look.\n\nUsage Suggestions: ideally suited for gym settings throughout the summer season, wear it for outings, weekend plans, travel or gatherings. Its adaptable design works across your existing wardrobe, quickly becoming a reliable go-to. Machine wash cold with similar colours to keep it fresh wash after wash.",
    "features": [
      "Premium Recycled Polyester",
      "Breathable, skin-friendly material",
      "Fade-resistant colour retention",
      "Athletic Fit for all-day comfort",
      "Easy care — machine washable"
    ],
    "specifications": {
      "Material": "Recycled Polyester",
      "Fit Type": "Athletic Fit",
      "Pattern": "Solid",
      "Sleeve Type": "Sleeveless",
      "Neck Type": "Elastic Waist",
      "Gender": "Men",
      "Occasion": "Gym",
      "Season": "Summer",
      "Country of Origin": "Bangladesh"
    },
    "image": {
      "fileName": "quick-dry-training-shorts.jpg",
      "altText": "Quick Dry Training Shorts by Velocity in black — sports shorts",
      "title": "Quick Dry Training Shorts | Velocity",
      "caption": "Velocity Quick Dry Training Shorts — Recycled Polyester, Athletic Fit."
    },
    "reviews": [
      {
        "name": "Imran S.",
        "rating": 5,
        "text": "Exceeded my expectations. Stitching and finish are top notch.",
        "date": "2026-05-12"
      },
      {
        "name": "Farzana B.",
        "rating": 4,
        "text": "Stylish design, true to size, and very comfortable to wear all day.",
        "date": "2026-05-13"
      },
      {
        "name": "Sabbir N.",
        "rating": 5,
        "text": "Good quality fabric, holds shape after wash. Highly recommend.",
        "date": "2026-05-14"
      }
    ],
    "relatedIds": [
      "fp-014",
      "fp-001",
      "fp-002"
    ],
    "customersAlsoBoughtIds": [
      "fp-003",
      "fp-004",
      "fp-005"
    ],
    "frequentlyBoughtTogetherIds": [
      "fp-006",
      "fp-007",
      "fp-008"
    ]
  }
];

export const getFashionProduct = (idOrSlug: string): FashionProduct | undefined =>
  fashionProducts.find((p) => p.id === idOrSlug || p.slug === idOrSlug);

const byIds = (ids: string[]): FashionProduct[] =>
  ids.map((id) => fashionProducts.find((p) => p.id === id)).filter(Boolean) as FashionProduct[];

export const getRelatedProducts = (id: string) => byIds(getFashionProduct(id)?.relatedIds ?? []);
export const getCustomersAlsoBought = (id: string) => byIds(getFashionProduct(id)?.customersAlsoBoughtIds ?? []);
export const getFrequentlyBoughtTogether = (id: string) => byIds(getFashionProduct(id)?.frequentlyBoughtTogetherIds ?? []);

export const searchFashionProducts = (query: string): FashionProduct[] => {
  const q = query.trim().toLowerCase();
  if (!q) return fashionProducts;
  return fashionProducts.filter((p) =>
    [p.name, p.brand, p.category, p.subcategory, p.productType, ...p.seo.keywords]
      .join(" ")
      .toLowerCase()
      .includes(q)
  );
};
