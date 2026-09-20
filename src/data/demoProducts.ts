// AUTO-GENERATED demo catalog — frontend only, no backend.
// 50 realistic premium fashion products across Men, Women, Kids, Teens & Sports.

export interface DemoColor { name: string; hex: string; }
export interface DemoReview { name: string; rating: number; text: string; date: string; }
export interface DemoSizeGuideRow { size: string; [key: string]: string; }
export interface DemoSEO {
  title: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}
export type DemoCategory = "Men" | "Women" | "Kids" | "Teens" | "Sports";

export interface DemoProduct {
  id: string;
  slug: string;
  name: string;
  sku: string;
  category: DemoCategory;
  subcategory: string;
  brand: string;
  price: number;
  comparePrice: number;
  discountPercent: number;
  rating: number;
  reviewCount: number;
  stock: number;
  images: string[];
  imageRoles: { front: string; back: string; lifestyle: string; model: string };
  colors: DemoColor[];
  sizes: string[];
  seo: DemoSEO;
  shortDescription: string;
  longDescription: string;
  features: string[];
  specifications: Record<string, string>;
  sizeGuide: DemoSizeGuideRow[];
  reviews: DemoReview[];
  relatedIds: string[];
  frequentlyBoughtTogetherIds: string[];
  customersAlsoBoughtIds: string[];
}

export const demoCategories: DemoCategory[] = ["Men", "Women", "Kids", "Teens", "Sports"];

export const currency = "৳";
export const formatPrice = (v: number) => `${currency}${v.toLocaleString()}`;

export const demoProducts: DemoProduct[] = [
  {
    "id": "prod-001",
    "slug": "premium-cotton-polo-shirt-men",
    "name": "Premium Cotton Polo Shirt",
    "sku": "MN-0001",
    "category": "Men",
    "subcategory": "Polo Shirts",
    "brand": "Arcadia",
    "price": 1290,
    "comparePrice": 1790,
    "discountPercent": 28,
    "rating": 4,
    "reviewCount": 48,
    "stock": 0,
    "images": [
      "https://picsum.photos/seed/premium-cotton-polo-shirt-men-front/700/933",
      "https://picsum.photos/seed/premium-cotton-polo-shirt-men-back/700/933",
      "https://picsum.photos/seed/premium-cotton-polo-shirt-men-life/700/933",
      "https://picsum.photos/seed/premium-cotton-polo-shirt-men-model/700/933"
    ],
    "imageRoles": {
      "front": "https://picsum.photos/seed/premium-cotton-polo-shirt-men-front/700/933",
      "back": "https://picsum.photos/seed/premium-cotton-polo-shirt-men-back/700/933",
      "lifestyle": "https://picsum.photos/seed/premium-cotton-polo-shirt-men-life/700/933",
      "model": "https://picsum.photos/seed/premium-cotton-polo-shirt-men-model/700/933"
    },
    "colors": [
      {
        "name": "Black",
        "hex": "#1c1c1c"
      },
      {
        "name": "Charcoal",
        "hex": "#3a3a3a"
      },
      {
        "name": "Sky Blue",
        "hex": "#9fc3e0"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "seo": {
      "title": "Premium Cotton Polo Shirt for Men – Comfortable Premium Casual Wear",
      "slug": "premium-cotton-polo-shirt-men",
      "metaTitle": "Premium Cotton Polo Shirt | Buy Online",
      "metaDescription": "Shop the Premium Cotton Polo Shirt in 100% Combed Cotton Piqué. Regular Fit, solid design for casual. Now 28% off with fast delivery. Free returns. Free returns",
      "keywords": [
        "premium cotton polo shirt",
        "men polo shirts",
        "solid polo shirts",
        "buy premium cotton polo shirt online",
        "casual wear",
        "premium polo shirts"
      ]
    },
    "shortDescription": "The Premium Cotton Polo Shirt blends 100% combed cotton piqué with a regular fit for effortless comfort. Featuring a solid design and polo collar neckline, it's tailored for casual moments throughout the summer season. A versatile wardrobe staple that pairs easily and wears beautifully day after day.",
    "longDescription": "Meet the Premium Cotton Polo Shirt — a thoughtfully designed polo shirts that brings together premium materials and a refined fit. Crafted from 100% Combed Cotton Piqué, it is built to feel as good as it looks. The fabric is carefully selected for its soft hand-feel, resilience and natural drape, giving you a piece that holds its shape and color through repeated wear. Every detail — from the polo collar to the precision-finished seams and durable trims — reflects a genuine commitment to premium craftsmanship that you can see and feel.\n\nFabric & Comfort: 100% Combed Cotton Piqué offers a balance of softness and structure that sits comfortably against the skin. The weave is breathable and gentle, helping regulate temperature so you stay fresh through busy days. The regular fit allows a natural range of movement without feeling restrictive, while careful tailoring ensures a clean, flattering line. The short sleeve cut adds balance to the overall silhouette, making this an easy choice when you want to look put-together without compromising on ease or all-day wearability.\n\nStyle Benefits: the solid aesthetic makes this a genuinely versatile addition to any wardrobe. It layers effortlessly, mixes with both relaxed and elevated pieces, and adapts to your mood and the moment. Whether you dress it up or keep it understated, the Premium Cotton Polo Shirt delivers a modern, considered look. The colorways are chosen to complement a wide range of skin tones and existing outfits, so styling it is intuitive rather than complicated.\n\nUsage Scenarios: ideally suited for casual settings throughout the summer season, this piece transitions smoothly across your day. Wear it for casual outings, weekend plans, travel, gatherings with friends, or relaxed time at home. Its adaptable design means it works across your existing wardrobe with minimal effort, quickly becoming a reliable go-to you will reach for again and again — versatile enough to earn its place season after season.\n\nCare Instructions: to keep the Premium Cotton Polo Shirt looking its best, machine wash cold with similar colors on a gentle cycle. Do not bleach, and avoid harsh detergents that can dull the finish. Tumble dry on low or line dry in shade to protect the fibers, and warm iron on the reverse if needed. Avoid wringing to preserve the fabric structure and shape. With this simple care routine, your piece will stay fresh, soft and vibrant wash after wash — a smart, long-lasting investment in your everyday style.",
    "features": [
      "Premium 100% fabric",
      "Breathable, skin-friendly material",
      "Fade-resistant color retention",
      "Soft-touch finish for all-day comfort",
      "Lightweight, easy-to-wear construction",
      "Regular Fit for a flattering silhouette",
      "Reinforced stitching for durability"
    ],
    "specifications": {
      "Material": "100% Combed Cotton Piqué",
      "Fit Type": "Regular Fit",
      "Sleeve Type": "Short Sleeve",
      "Neck Type": "Polo Collar",
      "Pattern": "Solid",
      "Occasion": "Casual",
      "Season": "Summer",
      "Gender": "Men",
      "Country of Origin": "Bangladesh"
    },
    "sizeGuide": [
      {
        "size": "XS",
        "chest": "34",
        "waist": "28",
        "length": "66",
        "shoulder": "40"
      },
      {
        "size": "S",
        "chest": "36",
        "waist": "30",
        "length": "68",
        "shoulder": "42"
      },
      {
        "size": "M",
        "chest": "38",
        "waist": "32",
        "length": "70",
        "shoulder": "44"
      },
      {
        "size": "L",
        "chest": "40",
        "waist": "34",
        "length": "72",
        "shoulder": "46"
      },
      {
        "size": "XL",
        "chest": "42",
        "waist": "36",
        "length": "74",
        "shoulder": "48"
      },
      {
        "size": "XXL",
        "chest": "44",
        "waist": "38",
        "length": "76",
        "shoulder": "50"
      }
    ],
    "reviews": [
      {
        "name": "Arman Hossain",
        "rating": 4,
        "text": "Absolutely love the quality, the fabric feels premium and the fit is spot on.",
        "date": "2025-12-01"
      },
      {
        "name": "Nusrat Jahan",
        "rating": 5,
        "text": "Exceeded my expectations — stitching is clean and the color is exactly as shown.",
        "date": "2025-11-22"
      },
      {
        "name": "Tanvir Ahmed",
        "rating": 4,
        "text": "Super comfortable for all-day wear, I've already ordered a second one.",
        "date": "2025-11-13"
      },
      {
        "name": "Sadia Islam",
        "rating": 5,
        "text": "Great value for the price. Delivery was fast and packaging was neat.",
        "date": "2025-11-04"
      },
      {
        "name": "Rakib Hasan",
        "rating": 3,
        "text": "Decent fabric for the price, the fit runs a touch slim.",
        "date": "2025-10-26"
      }
    ],
    "relatedIds": [
      "prod-002",
      "prod-003",
      "prod-004",
      "prod-005"
    ],
    "frequentlyBoughtTogetherIds": [
      "prod-003",
      "prod-004"
    ],
    "customersAlsoBoughtIds": [
      "prod-013",
      "prod-014",
      "prod-015",
      "prod-016"
    ]
  },
  {
    "id": "prod-002",
    "slug": "oversized-graphic-t-shirt-men",
    "name": "Oversized Graphic T-Shirt",
    "sku": "MN-0002",
    "category": "Men",
    "subcategory": "T-Shirts",
    "brand": "Arcadia",
    "price": 990,
    "comparePrice": 1490,
    "discountPercent": 34,
    "rating": 4.3,
    "reviewCount": 105,
    "stock": 19,
    "images": [
      "https://picsum.photos/seed/oversized-graphic-t-shirt-men-front/700/933",
      "https://picsum.photos/seed/oversized-graphic-t-shirt-men-back/700/933",
      "https://picsum.photos/seed/oversized-graphic-t-shirt-men-life/700/933",
      "https://picsum.photos/seed/oversized-graphic-t-shirt-men-model/700/933"
    ],
    "imageRoles": {
      "front": "https://picsum.photos/seed/oversized-graphic-t-shirt-men-front/700/933",
      "back": "https://picsum.photos/seed/oversized-graphic-t-shirt-men-back/700/933",
      "lifestyle": "https://picsum.photos/seed/oversized-graphic-t-shirt-men-life/700/933",
      "model": "https://picsum.photos/seed/oversized-graphic-t-shirt-men-model/700/933"
    },
    "colors": [
      {
        "name": "White",
        "hex": "#f5f5f5"
      },
      {
        "name": "Olive",
        "hex": "#5b5a3a"
      },
      {
        "name": "Mustard",
        "hex": "#d6a531"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "seo": {
      "title": "Oversized Graphic T-Shirt for Men – Comfortable Premium Casual Wear",
      "slug": "oversized-graphic-t-shirt-men",
      "metaTitle": "Oversized Graphic T-Shirt | Buy Online",
      "metaDescription": "Shop the Oversized Graphic T-Shirt in 240 GSM Cotton Jersey. Oversized Fit, graphic print design for streetwear. Now 34% off with fast delivery. Free returns.",
      "keywords": [
        "oversized graphic t-shirt",
        "men t-shirts",
        "graphic print t-shirts",
        "buy oversized graphic t-shirt online",
        "streetwear wear",
        "premium t-shirts"
      ]
    },
    "shortDescription": "The Oversized Graphic T-Shirt blends 240 gsm cotton jersey with a oversized fit for effortless comfort. Featuring a graphic print design and crew neck neckline, it's tailored for streetwear moments throughout the all season season. A versatile wardrobe staple that pairs easily and wears beautifully day after day.",
    "longDescription": "Meet the Oversized Graphic T-Shirt — a thoughtfully designed t-shirts that brings together premium materials and a refined fit. Crafted from 240 GSM Cotton Jersey, it is built to feel as good as it looks. The fabric is carefully selected for its soft hand-feel, resilience and natural drape, giving you a piece that holds its shape and color through repeated wear. Every detail — from the crew neck to the precision-finished seams and durable trims — reflects a genuine commitment to premium craftsmanship that you can see and feel.\n\nFabric & Comfort: 240 GSM Cotton Jersey offers a balance of softness and structure that sits comfortably against the skin. The weave is breathable and gentle, helping regulate temperature so you stay fresh through busy days. The oversized fit allows a natural range of movement without feeling restrictive, while careful tailoring ensures a clean, flattering line. The drop shoulder cut adds balance to the overall silhouette, making this an easy choice when you want to look put-together without compromising on ease or all-day wearability.\n\nStyle Benefits: the graphic print aesthetic makes this a genuinely versatile addition to any wardrobe. It layers effortlessly, mixes with both relaxed and elevated pieces, and adapts to your mood and the moment. Whether you dress it up or keep it understated, the Oversized Graphic T-Shirt delivers a modern, considered look. The colorways are chosen to complement a wide range of skin tones and existing outfits, so styling it is intuitive rather than complicated.\n\nUsage Scenarios: ideally suited for streetwear settings throughout the all season season, this piece transitions smoothly across your day. Wear it for casual outings, weekend plans, travel, gatherings with friends, or relaxed time at home. Its adaptable design means it works across your existing wardrobe with minimal effort, quickly becoming a reliable go-to you will reach for again and again — versatile enough to earn its place season after season.\n\nCare Instructions: to keep the Oversized Graphic T-Shirt looking its best, machine wash cold with similar colors on a gentle cycle. Do not bleach, and avoid harsh detergents that can dull the finish. Tumble dry on low or line dry in shade to protect the fibers, and warm iron on the reverse if needed. Avoid wringing to preserve the fabric structure and shape. With this simple care routine, your piece will stay fresh, soft and vibrant wash after wash — a smart, long-lasting investment in your everyday style.",
    "features": [
      "Premium 240 fabric",
      "Breathable, skin-friendly material",
      "Fade-resistant color retention",
      "Soft-touch finish for all-day comfort",
      "Lightweight, easy-to-wear construction",
      "Oversized Fit for a flattering silhouette",
      "Reinforced stitching for durability"
    ],
    "specifications": {
      "Material": "240 GSM Cotton Jersey",
      "Fit Type": "Oversized Fit",
      "Sleeve Type": "Drop Shoulder",
      "Neck Type": "Crew Neck",
      "Pattern": "Graphic Print",
      "Occasion": "Streetwear",
      "Season": "All Season",
      "Gender": "Men",
      "Country of Origin": "Bangladesh"
    },
    "sizeGuide": [
      {
        "size": "XS",
        "chest": "34",
        "waist": "28",
        "length": "66",
        "shoulder": "40"
      },
      {
        "size": "S",
        "chest": "36",
        "waist": "30",
        "length": "68",
        "shoulder": "42"
      },
      {
        "size": "M",
        "chest": "38",
        "waist": "32",
        "length": "70",
        "shoulder": "44"
      },
      {
        "size": "L",
        "chest": "40",
        "waist": "34",
        "length": "72",
        "shoulder": "46"
      },
      {
        "size": "XL",
        "chest": "42",
        "waist": "36",
        "length": "74",
        "shoulder": "48"
      },
      {
        "size": "XXL",
        "chest": "44",
        "waist": "38",
        "length": "76",
        "shoulder": "50"
      }
    ],
    "reviews": [
      {
        "name": "Nusrat Jahan",
        "rating": 5,
        "text": "Exceeded my expectations — stitching is clean and the color is exactly as shown.",
        "date": "2025-11-30"
      },
      {
        "name": "Tanvir Ahmed",
        "rating": 4,
        "text": "Super comfortable for all-day wear, I've already ordered a second one.",
        "date": "2025-11-21"
      },
      {
        "name": "Sadia Islam",
        "rating": 5,
        "text": "Great value for the price. Delivery was fast and packaging was neat.",
        "date": "2025-11-12"
      },
      {
        "name": "Rakib Hasan",
        "rating": 4,
        "text": "The material breathes really well, perfect for our weather. Highly recommend.",
        "date": "2025-11-03"
      },
      {
        "name": "Mitu Akter",
        "rating": 3,
        "text": "Good product overall, though I'd suggest sizing up for a relaxed fit.",
        "date": "2025-10-25"
      },
      {
        "name": "Farhan Kabir",
        "rating": 4,
        "text": "True to size and holds up well after multiple washes. Very happy.",
        "date": "2025-10-16"
      }
    ],
    "relatedIds": [
      "prod-003",
      "prod-004",
      "prod-005",
      "prod-006"
    ],
    "frequentlyBoughtTogetherIds": [
      "prod-004",
      "prod-005"
    ],
    "customersAlsoBoughtIds": [
      "prod-014",
      "prod-015",
      "prod-016",
      "prod-017"
    ]
  },
  {
    "id": "prod-003",
    "slug": "slim-fit-denim-jeans-men",
    "name": "Slim Fit Denim Jeans",
    "sku": "MN-0003",
    "category": "Men",
    "subcategory": "Jeans",
    "brand": "Arcadia",
    "price": 2190,
    "comparePrice": 2990,
    "discountPercent": 27,
    "rating": 4.6,
    "reviewCount": 162,
    "stock": 32,
    "images": [
      "https://picsum.photos/seed/slim-fit-denim-jeans-men-front/700/933",
      "https://picsum.photos/seed/slim-fit-denim-jeans-men-back/700/933",
      "https://picsum.photos/seed/slim-fit-denim-jeans-men-life/700/933",
      "https://picsum.photos/seed/slim-fit-denim-jeans-men-model/700/933"
    ],
    "imageRoles": {
      "front": "https://picsum.photos/seed/slim-fit-denim-jeans-men-front/700/933",
      "back": "https://picsum.photos/seed/slim-fit-denim-jeans-men-back/700/933",
      "lifestyle": "https://picsum.photos/seed/slim-fit-denim-jeans-men-life/700/933",
      "model": "https://picsum.photos/seed/slim-fit-denim-jeans-men-model/700/933"
    },
    "colors": [
      {
        "name": "Navy",
        "hex": "#1f2a44"
      },
      {
        "name": "Maroon",
        "hex": "#6e1f2b"
      },
      {
        "name": "Teal",
        "hex": "#1f6f6b"
      }
    ],
    "sizes": [
      "28",
      "30",
      "32",
      "34",
      "36",
      "38"
    ],
    "seo": {
      "title": "Slim Fit Denim Jeans for Men – Comfortable Premium Casual Wear",
      "slug": "slim-fit-denim-jeans-men",
      "metaTitle": "Slim Fit Denim Jeans | Buy Online",
      "metaDescription": "Shop the Slim Fit Denim Jeans in Stretch Denim. Slim Fit, solid design for casual. Now 27% off with fast delivery. Free returns. Free returns. Free returns.",
      "keywords": [
        "slim fit denim jeans",
        "men jeans",
        "solid jeans",
        "buy slim fit denim jeans online",
        "casual wear",
        "premium jeans"
      ]
    },
    "shortDescription": "The Slim Fit Denim Jeans blends stretch denim with a slim fit for effortless comfort. Featuring a solid design and it's tailored for casual moments throughout the all season season. A versatile wardrobe staple that pairs easily and wears beautifully day after day.",
    "longDescription": "Meet the Slim Fit Denim Jeans — a thoughtfully designed jeans that brings together premium materials and a refined fit. Crafted from Stretch Denim (98% Cotton, 2% Elastane), it is built to feel as good as it looks. The fabric is carefully selected for its soft hand-feel, resilience and natural drape, giving you a piece that holds its shape and color through repeated wear. Every detail — from the clean construction to the precision-finished seams and durable trims — reflects a genuine commitment to premium craftsmanship that you can see and feel.\n\nFabric & Comfort: Stretch Denim (98% Cotton, 2% Elastane) offers a balance of softness and structure that sits comfortably against the skin. The weave is breathable and gentle, helping regulate temperature so you stay fresh through busy days. The slim fit allows a natural range of movement without feeling restrictive, while careful tailoring ensures a clean, flattering line. making this an easy choice when you want to look put-together without compromising on ease or all-day wearability.\n\nStyle Benefits: the solid aesthetic makes this a genuinely versatile addition to any wardrobe. It layers effortlessly, mixes with both relaxed and elevated pieces, and adapts to your mood and the moment. Whether you dress it up or keep it understated, the Slim Fit Denim Jeans delivers a modern, considered look. The colorways are chosen to complement a wide range of skin tones and existing outfits, so styling it is intuitive rather than complicated.\n\nUsage Scenarios: ideally suited for casual settings throughout the all season season, this piece transitions smoothly across your day. Wear it for casual outings, weekend plans, travel, gatherings with friends, or relaxed time at home. Its adaptable design means it works across your existing wardrobe with minimal effort, quickly becoming a reliable go-to you will reach for again and again — versatile enough to earn its place season after season.\n\nCare Instructions: to keep the Slim Fit Denim Jeans looking its best, machine wash cold with similar colors on a gentle cycle. Do not bleach, and avoid harsh detergents that can dull the finish. Tumble dry on low or line dry in shade to protect the fibers, and warm iron on the reverse if needed. Avoid wringing to preserve the fabric structure and shape. With this simple care routine, your piece will stay fresh, soft and vibrant wash after wash — a smart, long-lasting investment in your everyday style.",
    "features": [
      "Premium Stretch fabric",
      "Breathable, skin-friendly material",
      "Fade-resistant color retention",
      "Soft-touch finish for all-day comfort",
      "Lightweight, easy-to-wear construction",
      "Slim Fit for a flattering silhouette",
      "Reinforced stitching for durability"
    ],
    "specifications": {
      "Material": "Stretch Denim (98% Cotton, 2% Elastane)",
      "Fit Type": "Slim Fit",
      "Sleeve Type": "N/A",
      "Neck Type": "N/A",
      "Pattern": "Solid",
      "Occasion": "Casual",
      "Season": "All Season",
      "Gender": "Men",
      "Country of Origin": "Bangladesh"
    },
    "sizeGuide": [
      {
        "size": "28",
        "waist": "28",
        "hip": "36",
        "inseam": "78",
        "length": "104"
      },
      {
        "size": "30",
        "waist": "30",
        "hip": "38",
        "inseam": "78",
        "length": "104"
      },
      {
        "size": "32",
        "waist": "32",
        "hip": "40",
        "inseam": "78",
        "length": "104"
      },
      {
        "size": "34",
        "waist": "34",
        "hip": "42",
        "inseam": "78",
        "length": "104"
      },
      {
        "size": "36",
        "waist": "36",
        "hip": "44",
        "inseam": "78",
        "length": "104"
      },
      {
        "size": "38",
        "waist": "38",
        "hip": "46",
        "inseam": "78",
        "length": "104"
      }
    ],
    "reviews": [
      {
        "name": "Tanvir Ahmed",
        "rating": 4,
        "text": "Super comfortable for all-day wear, I've already ordered a second one.",
        "date": "2025-11-29"
      },
      {
        "name": "Sadia Islam",
        "rating": 5,
        "text": "Great value for the price. Delivery was fast and packaging was neat.",
        "date": "2025-11-20"
      },
      {
        "name": "Rakib Hasan",
        "rating": 4,
        "text": "The material breathes really well, perfect for our weather. Highly recommend.",
        "date": "2025-11-11"
      },
      {
        "name": "Mitu Akter",
        "rating": 5,
        "text": "Looks even better in person. Got compliments the first time I wore it.",
        "date": "2025-11-02"
      },
      {
        "name": "Farhan Kabir",
        "rating": 3,
        "text": "Nice quality but the color is slightly darker than the picture.",
        "date": "2025-10-24"
      },
      {
        "name": "Lamia Rahman",
        "rating": 5,
        "text": "Premium feel without the premium markup. Will buy again from this brand.",
        "date": "2025-10-15"
      },
      {
        "name": "Imran Chowdhury",
        "rating": 4,
        "text": "Soft, lightweight and well finished. Exactly what I was looking for.",
        "date": "2025-10-06"
      }
    ],
    "relatedIds": [
      "prod-004",
      "prod-005",
      "prod-006",
      "prod-007"
    ],
    "frequentlyBoughtTogetherIds": [
      "prod-005",
      "prod-006"
    ],
    "customersAlsoBoughtIds": [
      "prod-015",
      "prod-016",
      "prod-017",
      "prod-018"
    ]
  },
  {
    "id": "prod-004",
    "slug": "casual-oxford-shirt-men",
    "name": "Casual Oxford Shirt",
    "sku": "MN-0004",
    "category": "Men",
    "subcategory": "Shirts",
    "brand": "Arcadia",
    "price": 1690,
    "comparePrice": 2290,
    "discountPercent": 26,
    "rating": 4.9,
    "reviewCount": 219,
    "stock": 45,
    "images": [
      "https://picsum.photos/seed/casual-oxford-shirt-men-front/700/933",
      "https://picsum.photos/seed/casual-oxford-shirt-men-back/700/933",
      "https://picsum.photos/seed/casual-oxford-shirt-men-life/700/933",
      "https://picsum.photos/seed/casual-oxford-shirt-men-model/700/933"
    ],
    "imageRoles": {
      "front": "https://picsum.photos/seed/casual-oxford-shirt-men-front/700/933",
      "back": "https://picsum.photos/seed/casual-oxford-shirt-men-back/700/933",
      "lifestyle": "https://picsum.photos/seed/casual-oxford-shirt-men-life/700/933",
      "model": "https://picsum.photos/seed/casual-oxford-shirt-men-model/700/933"
    },
    "colors": [
      {
        "name": "Charcoal",
        "hex": "#3a3a3a"
      },
      {
        "name": "Beige",
        "hex": "#d8c7a8"
      },
      {
        "name": "Coral",
        "hex": "#e8836b"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "seo": {
      "title": "Casual Oxford Shirt for Men – Comfortable Premium Casual Wear",
      "slug": "casual-oxford-shirt-men",
      "metaTitle": "Casual Oxford Shirt | Buy Online",
      "metaDescription": "Shop the Casual Oxford Shirt in Yarn-Dyed Oxford Cotton. Slim Fit, solid design for smart casual. Now 26% off with fast delivery. Free returns. Free returns.",
      "keywords": [
        "casual oxford shirt",
        "men shirts",
        "solid shirts",
        "buy casual oxford shirt online",
        "smart casual wear",
        "premium shirts"
      ]
    },
    "shortDescription": "The Casual Oxford Shirt blends yarn-dyed oxford cotton with a slim fit for effortless comfort. Featuring a solid design and button-down collar neckline, it's tailored for smart casual moments throughout the all season season. A versatile wardrobe staple that pairs easily and wears beautifully day after day.",
    "longDescription": "Meet the Casual Oxford Shirt — a thoughtfully designed shirts that brings together premium materials and a refined fit. Crafted from Yarn-Dyed Oxford Cotton, it is built to feel as good as it looks. The fabric is carefully selected for its soft hand-feel, resilience and natural drape, giving you a piece that holds its shape and color through repeated wear. Every detail — from the button-down collar to the precision-finished seams and durable trims — reflects a genuine commitment to premium craftsmanship that you can see and feel.\n\nFabric & Comfort: Yarn-Dyed Oxford Cotton offers a balance of softness and structure that sits comfortably against the skin. The weave is breathable and gentle, helping regulate temperature so you stay fresh through busy days. The slim fit allows a natural range of movement without feeling restrictive, while careful tailoring ensures a clean, flattering line. The long sleeve cut adds balance to the overall silhouette, making this an easy choice when you want to look put-together without compromising on ease or all-day wearability.\n\nStyle Benefits: the solid aesthetic makes this a genuinely versatile addition to any wardrobe. It layers effortlessly, mixes with both relaxed and elevated pieces, and adapts to your mood and the moment. Whether you dress it up or keep it understated, the Casual Oxford Shirt delivers a modern, considered look. The colorways are chosen to complement a wide range of skin tones and existing outfits, so styling it is intuitive rather than complicated.\n\nUsage Scenarios: ideally suited for smart casual settings throughout the all season season, this piece transitions smoothly across your day. Wear it for casual outings, weekend plans, travel, gatherings with friends, or relaxed time at home. Its adaptable design means it works across your existing wardrobe with minimal effort, quickly becoming a reliable go-to you will reach for again and again — versatile enough to earn its place season after season.\n\nCare Instructions: to keep the Casual Oxford Shirt looking its best, machine wash cold with similar colors on a gentle cycle. Do not bleach, and avoid harsh detergents that can dull the finish. Tumble dry on low or line dry in shade to protect the fibers, and warm iron on the reverse if needed. Avoid wringing to preserve the fabric structure and shape. With this simple care routine, your piece will stay fresh, soft and vibrant wash after wash — a smart, long-lasting investment in your everyday style.",
    "features": [
      "Premium Yarn-Dyed fabric",
      "Breathable, skin-friendly material",
      "Fade-resistant color retention",
      "Soft-touch finish for all-day comfort",
      "Lightweight, easy-to-wear construction",
      "Slim Fit for a flattering silhouette",
      "Reinforced stitching for durability"
    ],
    "specifications": {
      "Material": "Yarn-Dyed Oxford Cotton",
      "Fit Type": "Slim Fit",
      "Sleeve Type": "Long Sleeve",
      "Neck Type": "Button-Down Collar",
      "Pattern": "Solid",
      "Occasion": "Smart Casual",
      "Season": "All Season",
      "Gender": "Men",
      "Country of Origin": "Bangladesh"
    },
    "sizeGuide": [
      {
        "size": "XS",
        "chest": "34",
        "waist": "28",
        "length": "66",
        "shoulder": "40"
      },
      {
        "size": "S",
        "chest": "36",
        "waist": "30",
        "length": "68",
        "shoulder": "42"
      },
      {
        "size": "M",
        "chest": "38",
        "waist": "32",
        "length": "70",
        "shoulder": "44"
      },
      {
        "size": "L",
        "chest": "40",
        "waist": "34",
        "length": "72",
        "shoulder": "46"
      },
      {
        "size": "XL",
        "chest": "42",
        "waist": "36",
        "length": "74",
        "shoulder": "48"
      },
      {
        "size": "XXL",
        "chest": "44",
        "waist": "38",
        "length": "76",
        "shoulder": "50"
      }
    ],
    "reviews": [
      {
        "name": "Sadia Islam",
        "rating": 5,
        "text": "Great value for the price. Delivery was fast and packaging was neat.",
        "date": "2025-11-28"
      },
      {
        "name": "Rakib Hasan",
        "rating": 4,
        "text": "The material breathes really well, perfect for our weather. Highly recommend.",
        "date": "2025-11-19"
      },
      {
        "name": "Mitu Akter",
        "rating": 5,
        "text": "Looks even better in person. Got compliments the first time I wore it.",
        "date": "2025-11-10"
      },
      {
        "name": "Farhan Kabir",
        "rating": 4,
        "text": "True to size and holds up well after multiple washes. Very happy.",
        "date": "2025-11-01"
      },
      {
        "name": "Lamia Rahman",
        "rating": 3,
        "text": "Comfortable and well made, delivery took a little longer than expected.",
        "date": "2025-10-23"
      },
      {
        "name": "Imran Chowdhury",
        "rating": 4,
        "text": "Soft, lightweight and well finished. Exactly what I was looking for.",
        "date": "2025-10-14"
      },
      {
        "name": "Sumaiya Akhtar",
        "rating": 5,
        "text": "Fantastic everyday piece — versatile, stylish and easy to care for.",
        "date": "2025-10-05"
      },
      {
        "name": "Shahriar Khan",
        "rating": 4,
        "text": "Absolutely love the quality, the fabric feels premium and the fit is spot on.",
        "date": "2025-09-26"
      }
    ],
    "relatedIds": [
      "prod-005",
      "prod-006",
      "prod-007",
      "prod-008"
    ],
    "frequentlyBoughtTogetherIds": [
      "prod-006",
      "prod-007"
    ],
    "customersAlsoBoughtIds": [
      "prod-016",
      "prod-017",
      "prod-018",
      "prod-019"
    ]
  },
  {
    "id": "prod-005",
    "slug": "premium-embroidered-panjabi-men",
    "name": "Premium Embroidered Panjabi",
    "sku": "MN-0005",
    "category": "Men",
    "subcategory": "Panjabi",
    "brand": "Arcadia",
    "price": 2490,
    "comparePrice": 3490,
    "discountPercent": 29,
    "rating": 4.2,
    "reviewCount": 276,
    "stock": 58,
    "images": [
      "https://picsum.photos/seed/premium-embroidered-panjabi-men-front/700/933",
      "https://picsum.photos/seed/premium-embroidered-panjabi-men-back/700/933",
      "https://picsum.photos/seed/premium-embroidered-panjabi-men-life/700/933",
      "https://picsum.photos/seed/premium-embroidered-panjabi-men-model/700/933"
    ],
    "imageRoles": {
      "front": "https://picsum.photos/seed/premium-embroidered-panjabi-men-front/700/933",
      "back": "https://picsum.photos/seed/premium-embroidered-panjabi-men-back/700/933",
      "lifestyle": "https://picsum.photos/seed/premium-embroidered-panjabi-men-life/700/933",
      "model": "https://picsum.photos/seed/premium-embroidered-panjabi-men-model/700/933"
    },
    "colors": [
      {
        "name": "Olive",
        "hex": "#5b5a3a"
      },
      {
        "name": "Sky Blue",
        "hex": "#9fc3e0"
      },
      {
        "name": "Blush Pink",
        "hex": "#e8b5bf"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "seo": {
      "title": "Premium Embroidered Panjabi for Men – Comfortable Premium Casual Wear",
      "slug": "premium-embroidered-panjabi-men",
      "metaTitle": "Premium Embroidered Panjabi | Buy Online",
      "metaDescription": "Shop the Premium Embroidered Panjabi in Soft Cotton Slub. Regular Fit, embroidered design for festive. Now 29% off with fast delivery. Free returns. Free return",
      "keywords": [
        "premium embroidered panjabi",
        "men panjabi",
        "embroidered panjabi",
        "buy premium embroidered panjabi online",
        "festive wear",
        "premium panjabi"
      ]
    },
    "shortDescription": "The Premium Embroidered Panjabi blends soft cotton slub with a regular fit for effortless comfort. Featuring a embroidered design and mandarin collar neckline, it's tailored for festive moments throughout the all season season. A versatile wardrobe staple that pairs easily and wears beautifully day after day.",
    "longDescription": "Meet the Premium Embroidered Panjabi — a thoughtfully designed panjabi that brings together premium materials and a refined fit. Crafted from Soft Cotton Slub, it is built to feel as good as it looks. The fabric is carefully selected for its soft hand-feel, resilience and natural drape, giving you a piece that holds its shape and color through repeated wear. Every detail — from the mandarin collar to the precision-finished seams and durable trims — reflects a genuine commitment to premium craftsmanship that you can see and feel.\n\nFabric & Comfort: Soft Cotton Slub offers a balance of softness and structure that sits comfortably against the skin. The weave is breathable and gentle, helping regulate temperature so you stay fresh through busy days. The regular fit allows a natural range of movement without feeling restrictive, while careful tailoring ensures a clean, flattering line. The full sleeve cut adds balance to the overall silhouette, making this an easy choice when you want to look put-together without compromising on ease or all-day wearability.\n\nStyle Benefits: the embroidered aesthetic makes this a genuinely versatile addition to any wardrobe. It layers effortlessly, mixes with both relaxed and elevated pieces, and adapts to your mood and the moment. Whether you dress it up or keep it understated, the Premium Embroidered Panjabi delivers a modern, considered look. The colorways are chosen to complement a wide range of skin tones and existing outfits, so styling it is intuitive rather than complicated.\n\nUsage Scenarios: ideally suited for festive settings throughout the all season season, this piece transitions smoothly across your day. Wear it for casual outings, weekend plans, travel, gatherings with friends, or relaxed time at home. Its adaptable design means it works across your existing wardrobe with minimal effort, quickly becoming a reliable go-to you will reach for again and again — versatile enough to earn its place season after season.\n\nCare Instructions: to keep the Premium Embroidered Panjabi looking its best, machine wash cold with similar colors on a gentle cycle. Do not bleach, and avoid harsh detergents that can dull the finish. Tumble dry on low or line dry in shade to protect the fibers, and warm iron on the reverse if needed. Avoid wringing to preserve the fabric structure and shape. With this simple care routine, your piece will stay fresh, soft and vibrant wash after wash — a smart, long-lasting investment in your everyday style.",
    "features": [
      "Premium Soft fabric",
      "Breathable, skin-friendly material",
      "Fade-resistant color retention",
      "Soft-touch finish for all-day comfort",
      "Lightweight, easy-to-wear construction",
      "Regular Fit for a flattering silhouette",
      "Reinforced stitching for durability"
    ],
    "specifications": {
      "Material": "Soft Cotton Slub",
      "Fit Type": "Regular Fit",
      "Sleeve Type": "Full Sleeve",
      "Neck Type": "Mandarin Collar",
      "Pattern": "Embroidered",
      "Occasion": "Festive",
      "Season": "All Season",
      "Gender": "Men",
      "Country of Origin": "Bangladesh"
    },
    "sizeGuide": [
      {
        "size": "XS",
        "chest": "34",
        "waist": "28",
        "length": "66",
        "shoulder": "40"
      },
      {
        "size": "S",
        "chest": "36",
        "waist": "30",
        "length": "68",
        "shoulder": "42"
      },
      {
        "size": "M",
        "chest": "38",
        "waist": "32",
        "length": "70",
        "shoulder": "44"
      },
      {
        "size": "L",
        "chest": "40",
        "waist": "34",
        "length": "72",
        "shoulder": "46"
      },
      {
        "size": "XL",
        "chest": "42",
        "waist": "36",
        "length": "74",
        "shoulder": "48"
      },
      {
        "size": "XXL",
        "chest": "44",
        "waist": "38",
        "length": "76",
        "shoulder": "50"
      }
    ],
    "reviews": [
      {
        "name": "Rakib Hasan",
        "rating": 4,
        "text": "The material breathes really well, perfect for our weather. Highly recommend.",
        "date": "2025-11-27"
      },
      {
        "name": "Mitu Akter",
        "rating": 5,
        "text": "Looks even better in person. Got compliments the first time I wore it.",
        "date": "2025-11-18"
      },
      {
        "name": "Farhan Kabir",
        "rating": 4,
        "text": "True to size and holds up well after multiple washes. Very happy.",
        "date": "2025-11-09"
      },
      {
        "name": "Lamia Rahman",
        "rating": 5,
        "text": "Premium feel without the premium markup. Will buy again from this brand.",
        "date": "2025-10-31"
      },
      {
        "name": "Imran Chowdhury",
        "rating": 3,
        "text": "Happy with it, just wish there were a few more color options.",
        "date": "2025-10-22"
      },
      {
        "name": "Sumaiya Akhtar",
        "rating": 5,
        "text": "Fantastic everyday piece — versatile, stylish and easy to care for.",
        "date": "2025-10-13"
      },
      {
        "name": "Shahriar Khan",
        "rating": 4,
        "text": "Absolutely love the quality, the fabric feels premium and the fit is spot on.",
        "date": "2025-10-04"
      },
      {
        "name": "Tania Sultana",
        "rating": 5,
        "text": "Exceeded my expectations — stitching is clean and the color is exactly as shown.",
        "date": "2025-09-25"
      },
      {
        "name": "Mahin Alam",
        "rating": 4,
        "text": "Super comfortable for all-day wear, I've already ordered a second one.",
        "date": "2025-09-16"
      }
    ],
    "relatedIds": [
      "prod-006",
      "prod-007",
      "prod-008",
      "prod-009"
    ],
    "frequentlyBoughtTogetherIds": [
      "prod-007",
      "prod-008"
    ],
    "customersAlsoBoughtIds": [
      "prod-017",
      "prod-018",
      "prod-019",
      "prod-020"
    ]
  },
  {
    "id": "prod-006",
    "slug": "cargo-joggers-men",
    "name": "Cargo Joggers",
    "sku": "MN-0006",
    "category": "Men",
    "subcategory": "Joggers",
    "brand": "Arcadia",
    "price": 1590,
    "comparePrice": 2190,
    "discountPercent": 27,
    "rating": 4.5,
    "reviewCount": 333,
    "stock": 71,
    "images": [
      "https://picsum.photos/seed/cargo-joggers-men-front/700/933",
      "https://picsum.photos/seed/cargo-joggers-men-back/700/933",
      "https://picsum.photos/seed/cargo-joggers-men-life/700/933",
      "https://picsum.photos/seed/cargo-joggers-men-model/700/933"
    ],
    "imageRoles": {
      "front": "https://picsum.photos/seed/cargo-joggers-men-front/700/933",
      "back": "https://picsum.photos/seed/cargo-joggers-men-back/700/933",
      "lifestyle": "https://picsum.photos/seed/cargo-joggers-men-life/700/933",
      "model": "https://picsum.photos/seed/cargo-joggers-men-model/700/933"
    },
    "colors": [
      {
        "name": "Maroon",
        "hex": "#6e1f2b"
      },
      {
        "name": "Mustard",
        "hex": "#d6a531"
      },
      {
        "name": "Sage",
        "hex": "#9caf88"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "seo": {
      "title": "Cargo Joggers for Men – Comfortable Premium Casual Wear",
      "slug": "cargo-joggers-men",
      "metaTitle": "Cargo Joggers | Buy Online",
      "metaDescription": "Shop the Cargo Joggers in Cotton Twill with Stretch. Tapered Fit, solid design for casual. Now 27% off with fast delivery. Free returns. Free returns.",
      "keywords": [
        "cargo joggers",
        "men joggers",
        "solid joggers",
        "buy cargo joggers online",
        "casual wear",
        "premium joggers"
      ]
    },
    "shortDescription": "The Cargo Joggers blends cotton twill with stretch with a tapered fit for effortless comfort. Featuring a solid design and it's tailored for casual moments throughout the all season season. A versatile wardrobe staple that pairs easily and wears beautifully day after day.",
    "longDescription": "Meet the Cargo Joggers — a thoughtfully designed joggers that brings together premium materials and a refined fit. Crafted from Cotton Twill with Stretch, it is built to feel as good as it looks. The fabric is carefully selected for its soft hand-feel, resilience and natural drape, giving you a piece that holds its shape and color through repeated wear. Every detail — from the clean construction to the precision-finished seams and durable trims — reflects a genuine commitment to premium craftsmanship that you can see and feel.\n\nFabric & Comfort: Cotton Twill with Stretch offers a balance of softness and structure that sits comfortably against the skin. The weave is breathable and gentle, helping regulate temperature so you stay fresh through busy days. The tapered fit allows a natural range of movement without feeling restrictive, while careful tailoring ensures a clean, flattering line. making this an easy choice when you want to look put-together without compromising on ease or all-day wearability.\n\nStyle Benefits: the solid aesthetic makes this a genuinely versatile addition to any wardrobe. It layers effortlessly, mixes with both relaxed and elevated pieces, and adapts to your mood and the moment. Whether you dress it up or keep it understated, the Cargo Joggers delivers a modern, considered look. The colorways are chosen to complement a wide range of skin tones and existing outfits, so styling it is intuitive rather than complicated.\n\nUsage Scenarios: ideally suited for casual settings throughout the all season season, this piece transitions smoothly across your day. Wear it for casual outings, weekend plans, travel, gatherings with friends, or relaxed time at home. Its adaptable design means it works across your existing wardrobe with minimal effort, quickly becoming a reliable go-to you will reach for again and again — versatile enough to earn its place season after season.\n\nCare Instructions: to keep the Cargo Joggers looking its best, machine wash cold with similar colors on a gentle cycle. Do not bleach, and avoid harsh detergents that can dull the finish. Tumble dry on low or line dry in shade to protect the fibers, and warm iron on the reverse if needed. Avoid wringing to preserve the fabric structure and shape. With this simple care routine, your piece will stay fresh, soft and vibrant wash after wash — a smart, long-lasting investment in your everyday style.",
    "features": [
      "Premium Cotton fabric",
      "Breathable, skin-friendly material",
      "Fade-resistant color retention",
      "Soft-touch finish for all-day comfort",
      "Lightweight, easy-to-wear construction",
      "Tapered Fit for a flattering silhouette",
      "Reinforced stitching for durability"
    ],
    "specifications": {
      "Material": "Cotton Twill with Stretch",
      "Fit Type": "Tapered Fit",
      "Sleeve Type": "N/A",
      "Neck Type": "N/A",
      "Pattern": "Solid",
      "Occasion": "Casual",
      "Season": "All Season",
      "Gender": "Men",
      "Country of Origin": "Bangladesh"
    },
    "sizeGuide": [
      {
        "size": "XS",
        "chest": "34",
        "waist": "28",
        "length": "66",
        "shoulder": "40"
      },
      {
        "size": "S",
        "chest": "36",
        "waist": "30",
        "length": "68",
        "shoulder": "42"
      },
      {
        "size": "M",
        "chest": "38",
        "waist": "32",
        "length": "70",
        "shoulder": "44"
      },
      {
        "size": "L",
        "chest": "40",
        "waist": "34",
        "length": "72",
        "shoulder": "46"
      },
      {
        "size": "XL",
        "chest": "42",
        "waist": "36",
        "length": "74",
        "shoulder": "48"
      },
      {
        "size": "XXL",
        "chest": "44",
        "waist": "38",
        "length": "76",
        "shoulder": "50"
      }
    ],
    "reviews": [
      {
        "name": "Mitu Akter",
        "rating": 5,
        "text": "Looks even better in person. Got compliments the first time I wore it.",
        "date": "2025-11-26"
      },
      {
        "name": "Farhan Kabir",
        "rating": 4,
        "text": "True to size and holds up well after multiple washes. Very happy.",
        "date": "2025-11-17"
      },
      {
        "name": "Lamia Rahman",
        "rating": 5,
        "text": "Premium feel without the premium markup. Will buy again from this brand.",
        "date": "2025-11-08"
      },
      {
        "name": "Imran Chowdhury",
        "rating": 4,
        "text": "Soft, lightweight and well finished. Exactly what I was looking for.",
        "date": "2025-10-30"
      },
      {
        "name": "Sumaiya Akhtar",
        "rating": 3,
        "text": "Decent fabric for the price, the fit runs a touch slim.",
        "date": "2025-10-21"
      },
      {
        "name": "Shahriar Khan",
        "rating": 4,
        "text": "Absolutely love the quality, the fabric feels premium and the fit is spot on.",
        "date": "2025-10-12"
      },
      {
        "name": "Tania Sultana",
        "rating": 5,
        "text": "Exceeded my expectations — stitching is clean and the color is exactly as shown.",
        "date": "2025-10-03"
      },
      {
        "name": "Mahin Alam",
        "rating": 4,
        "text": "Super comfortable for all-day wear, I've already ordered a second one.",
        "date": "2025-09-24"
      },
      {
        "name": "Rumana Begum",
        "rating": 5,
        "text": "Great value for the price. Delivery was fast and packaging was neat.",
        "date": "2025-09-15"
      },
      {
        "name": "Naimur Rashid",
        "rating": 4,
        "text": "Decent fabric for the price, the fit runs a touch slim.",
        "date": "2025-09-06"
      }
    ],
    "relatedIds": [
      "prod-007",
      "prod-008",
      "prod-009",
      "prod-010"
    ],
    "frequentlyBoughtTogetherIds": [
      "prod-008",
      "prod-009"
    ],
    "customersAlsoBoughtIds": [
      "prod-018",
      "prod-019",
      "prod-020",
      "prod-021"
    ]
  },
  {
    "id": "prod-007",
    "slug": "linen-blend-casual-shirt-men",
    "name": "Linen Blend Casual Shirt",
    "sku": "MN-0007",
    "category": "Men",
    "subcategory": "Shirts",
    "brand": "Arcadia",
    "price": 1790,
    "comparePrice": 2390,
    "discountPercent": 25,
    "rating": 4.8,
    "reviewCount": 390,
    "stock": 84,
    "images": [
      "https://picsum.photos/seed/linen-blend-casual-shirt-men-front/700/933",
      "https://picsum.photos/seed/linen-blend-casual-shirt-men-back/700/933",
      "https://picsum.photos/seed/linen-blend-casual-shirt-men-life/700/933",
      "https://picsum.photos/seed/linen-blend-casual-shirt-men-model/700/933"
    ],
    "imageRoles": {
      "front": "https://picsum.photos/seed/linen-blend-casual-shirt-men-front/700/933",
      "back": "https://picsum.photos/seed/linen-blend-casual-shirt-men-back/700/933",
      "lifestyle": "https://picsum.photos/seed/linen-blend-casual-shirt-men-life/700/933",
      "model": "https://picsum.photos/seed/linen-blend-casual-shirt-men-model/700/933"
    },
    "colors": [
      {
        "name": "Beige",
        "hex": "#d8c7a8"
      },
      {
        "name": "Teal",
        "hex": "#1f6f6b"
      },
      {
        "name": "Rust",
        "hex": "#a8562f"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "seo": {
      "title": "Linen Blend Casual Shirt for Men – Comfortable Premium Casual Wear",
      "slug": "linen-blend-casual-shirt-men",
      "metaTitle": "Linen Blend Casual Shirt | Buy Online",
      "metaDescription": "Shop the Linen Blend Casual Shirt in 55% Linen, 45% Cotton. Relaxed Fit, solid design for vacation. Now 25% off with fast delivery. Free returns. Free returns.",
      "keywords": [
        "linen blend casual shirt",
        "men shirts",
        "solid shirts",
        "buy linen blend casual shirt online",
        "vacation wear",
        "premium shirts"
      ]
    },
    "shortDescription": "The Linen Blend Casual Shirt blends 55% linen, 45% cotton with a relaxed fit for effortless comfort. Featuring a solid design and cuban collar neckline, it's tailored for vacation moments throughout the summer season. A versatile wardrobe staple that pairs easily and wears beautifully day after day.",
    "longDescription": "Meet the Linen Blend Casual Shirt — a thoughtfully designed shirts that brings together premium materials and a refined fit. Crafted from 55% Linen, 45% Cotton, it is built to feel as good as it looks. The fabric is carefully selected for its soft hand-feel, resilience and natural drape, giving you a piece that holds its shape and color through repeated wear. Every detail — from the cuban collar to the precision-finished seams and durable trims — reflects a genuine commitment to premium craftsmanship that you can see and feel.\n\nFabric & Comfort: 55% Linen, 45% Cotton offers a balance of softness and structure that sits comfortably against the skin. The weave is breathable and gentle, helping regulate temperature so you stay fresh through busy days. The relaxed fit allows a natural range of movement without feeling restrictive, while careful tailoring ensures a clean, flattering line. The half sleeve cut adds balance to the overall silhouette, making this an easy choice when you want to look put-together without compromising on ease or all-day wearability.\n\nStyle Benefits: the solid aesthetic makes this a genuinely versatile addition to any wardrobe. It layers effortlessly, mixes with both relaxed and elevated pieces, and adapts to your mood and the moment. Whether you dress it up or keep it understated, the Linen Blend Casual Shirt delivers a modern, considered look. The colorways are chosen to complement a wide range of skin tones and existing outfits, so styling it is intuitive rather than complicated.\n\nUsage Scenarios: ideally suited for vacation settings throughout the summer season, this piece transitions smoothly across your day. Wear it for casual outings, weekend plans, travel, gatherings with friends, or relaxed time at home. Its adaptable design means it works across your existing wardrobe with minimal effort, quickly becoming a reliable go-to you will reach for again and again — versatile enough to earn its place season after season.\n\nCare Instructions: to keep the Linen Blend Casual Shirt looking its best, machine wash cold with similar colors on a gentle cycle. Do not bleach, and avoid harsh detergents that can dull the finish. Tumble dry on low or line dry in shade to protect the fibers, and warm iron on the reverse if needed. Avoid wringing to preserve the fabric structure and shape. With this simple care routine, your piece will stay fresh, soft and vibrant wash after wash — a smart, long-lasting investment in your everyday style.",
    "features": [
      "Premium 55% fabric",
      "Breathable, skin-friendly material",
      "Fade-resistant color retention",
      "Soft-touch finish for all-day comfort",
      "Lightweight, easy-to-wear construction",
      "Relaxed Fit for a flattering silhouette",
      "Reinforced stitching for durability"
    ],
    "specifications": {
      "Material": "55% Linen, 45% Cotton",
      "Fit Type": "Relaxed Fit",
      "Sleeve Type": "Half Sleeve",
      "Neck Type": "Cuban Collar",
      "Pattern": "Solid",
      "Occasion": "Vacation",
      "Season": "Summer",
      "Gender": "Men",
      "Country of Origin": "Bangladesh"
    },
    "sizeGuide": [
      {
        "size": "XS",
        "chest": "34",
        "waist": "28",
        "length": "66",
        "shoulder": "40"
      },
      {
        "size": "S",
        "chest": "36",
        "waist": "30",
        "length": "68",
        "shoulder": "42"
      },
      {
        "size": "M",
        "chest": "38",
        "waist": "32",
        "length": "70",
        "shoulder": "44"
      },
      {
        "size": "L",
        "chest": "40",
        "waist": "34",
        "length": "72",
        "shoulder": "46"
      },
      {
        "size": "XL",
        "chest": "42",
        "waist": "36",
        "length": "74",
        "shoulder": "48"
      },
      {
        "size": "XXL",
        "chest": "44",
        "waist": "38",
        "length": "76",
        "shoulder": "50"
      }
    ],
    "reviews": [
      {
        "name": "Farhan Kabir",
        "rating": 4,
        "text": "True to size and holds up well after multiple washes. Very happy.",
        "date": "2025-11-25"
      },
      {
        "name": "Lamia Rahman",
        "rating": 5,
        "text": "Premium feel without the premium markup. Will buy again from this brand.",
        "date": "2025-11-16"
      },
      {
        "name": "Imran Chowdhury",
        "rating": 4,
        "text": "Soft, lightweight and well finished. Exactly what I was looking for.",
        "date": "2025-11-07"
      },
      {
        "name": "Sumaiya Akhtar",
        "rating": 5,
        "text": "Fantastic everyday piece — versatile, stylish and easy to care for.",
        "date": "2025-10-29"
      },
      {
        "name": "Shahriar Khan",
        "rating": 3,
        "text": "Good product overall, though I'd suggest sizing up for a relaxed fit.",
        "date": "2025-10-20"
      }
    ],
    "relatedIds": [
      "prod-008",
      "prod-009",
      "prod-010",
      "prod-011"
    ],
    "frequentlyBoughtTogetherIds": [
      "prod-009",
      "prod-010"
    ],
    "customersAlsoBoughtIds": [
      "prod-019",
      "prod-020",
      "prod-021",
      "prod-022"
    ]
  },
  {
    "id": "prod-008",
    "slug": "classic-crew-neck-tee-men",
    "name": "Classic Crew Neck Tee",
    "sku": "MN-0008",
    "category": "Men",
    "subcategory": "T-Shirts",
    "brand": "Arcadia",
    "price": 790,
    "comparePrice": 1090,
    "discountPercent": 28,
    "rating": 4.1,
    "reviewCount": 447,
    "stock": 97,
    "images": [
      "https://picsum.photos/seed/classic-crew-neck-tee-men-front/700/933",
      "https://picsum.photos/seed/classic-crew-neck-tee-men-back/700/933",
      "https://picsum.photos/seed/classic-crew-neck-tee-men-life/700/933",
      "https://picsum.photos/seed/classic-crew-neck-tee-men-model/700/933"
    ],
    "imageRoles": {
      "front": "https://picsum.photos/seed/classic-crew-neck-tee-men-front/700/933",
      "back": "https://picsum.photos/seed/classic-crew-neck-tee-men-back/700/933",
      "lifestyle": "https://picsum.photos/seed/classic-crew-neck-tee-men-life/700/933",
      "model": "https://picsum.photos/seed/classic-crew-neck-tee-men-model/700/933"
    },
    "colors": [
      {
        "name": "Sky Blue",
        "hex": "#9fc3e0"
      },
      {
        "name": "Coral",
        "hex": "#e8836b"
      },
      {
        "name": "Lavender",
        "hex": "#b9a7d6"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "seo": {
      "title": "Classic Crew Neck Tee for Men – Comfortable Premium Casual Wear",
      "slug": "classic-crew-neck-tee-men",
      "metaTitle": "Classic Crew Neck Tee | Buy Online",
      "metaDescription": "Shop the Classic Crew Neck Tee in 180 GSM Cotton. Regular Fit, solid design for everyday. Now 28% off with fast delivery. Free returns. Free returns. Free retur",
      "keywords": [
        "classic crew neck tee",
        "men t-shirts",
        "solid t-shirts",
        "buy classic crew neck tee online",
        "everyday wear",
        "premium t-shirts"
      ]
    },
    "shortDescription": "The Classic Crew Neck Tee blends 180 gsm cotton with a regular fit for effortless comfort. Featuring a solid design and crew neck neckline, it's tailored for everyday moments throughout the summer season. A versatile wardrobe staple that pairs easily and wears beautifully day after day.",
    "longDescription": "Meet the Classic Crew Neck Tee — a thoughtfully designed t-shirts that brings together premium materials and a refined fit. Crafted from 180 GSM Cotton, it is built to feel as good as it looks. The fabric is carefully selected for its soft hand-feel, resilience and natural drape, giving you a piece that holds its shape and color through repeated wear. Every detail — from the crew neck to the precision-finished seams and durable trims — reflects a genuine commitment to premium craftsmanship that you can see and feel.\n\nFabric & Comfort: 180 GSM Cotton offers a balance of softness and structure that sits comfortably against the skin. The weave is breathable and gentle, helping regulate temperature so you stay fresh through busy days. The regular fit allows a natural range of movement without feeling restrictive, while careful tailoring ensures a clean, flattering line. The short sleeve cut adds balance to the overall silhouette, making this an easy choice when you want to look put-together without compromising on ease or all-day wearability.\n\nStyle Benefits: the solid aesthetic makes this a genuinely versatile addition to any wardrobe. It layers effortlessly, mixes with both relaxed and elevated pieces, and adapts to your mood and the moment. Whether you dress it up or keep it understated, the Classic Crew Neck Tee delivers a modern, considered look. The colorways are chosen to complement a wide range of skin tones and existing outfits, so styling it is intuitive rather than complicated.\n\nUsage Scenarios: ideally suited for everyday settings throughout the summer season, this piece transitions smoothly across your day. Wear it for casual outings, weekend plans, travel, gatherings with friends, or relaxed time at home. Its adaptable design means it works across your existing wardrobe with minimal effort, quickly becoming a reliable go-to you will reach for again and again — versatile enough to earn its place season after season.\n\nCare Instructions: to keep the Classic Crew Neck Tee looking its best, machine wash cold with similar colors on a gentle cycle. Do not bleach, and avoid harsh detergents that can dull the finish. Tumble dry on low or line dry in shade to protect the fibers, and warm iron on the reverse if needed. Avoid wringing to preserve the fabric structure and shape. With this simple care routine, your piece will stay fresh, soft and vibrant wash after wash — a smart, long-lasting investment in your everyday style.",
    "features": [
      "Premium 180 fabric",
      "Breathable, skin-friendly material",
      "Fade-resistant color retention",
      "Soft-touch finish for all-day comfort",
      "Lightweight, easy-to-wear construction",
      "Regular Fit for a flattering silhouette",
      "Reinforced stitching for durability"
    ],
    "specifications": {
      "Material": "180 GSM Cotton",
      "Fit Type": "Regular Fit",
      "Sleeve Type": "Short Sleeve",
      "Neck Type": "Crew Neck",
      "Pattern": "Solid",
      "Occasion": "Everyday",
      "Season": "Summer",
      "Gender": "Men",
      "Country of Origin": "Bangladesh"
    },
    "sizeGuide": [
      {
        "size": "XS",
        "chest": "34",
        "waist": "28",
        "length": "66",
        "shoulder": "40"
      },
      {
        "size": "S",
        "chest": "36",
        "waist": "30",
        "length": "68",
        "shoulder": "42"
      },
      {
        "size": "M",
        "chest": "38",
        "waist": "32",
        "length": "70",
        "shoulder": "44"
      },
      {
        "size": "L",
        "chest": "40",
        "waist": "34",
        "length": "72",
        "shoulder": "46"
      },
      {
        "size": "XL",
        "chest": "42",
        "waist": "36",
        "length": "74",
        "shoulder": "48"
      },
      {
        "size": "XXL",
        "chest": "44",
        "waist": "38",
        "length": "76",
        "shoulder": "50"
      }
    ],
    "reviews": [
      {
        "name": "Lamia Rahman",
        "rating": 5,
        "text": "Premium feel without the premium markup. Will buy again from this brand.",
        "date": "2025-11-24"
      },
      {
        "name": "Imran Chowdhury",
        "rating": 4,
        "text": "Soft, lightweight and well finished. Exactly what I was looking for.",
        "date": "2025-11-15"
      },
      {
        "name": "Sumaiya Akhtar",
        "rating": 5,
        "text": "Fantastic everyday piece — versatile, stylish and easy to care for.",
        "date": "2025-11-06"
      },
      {
        "name": "Shahriar Khan",
        "rating": 4,
        "text": "Absolutely love the quality, the fabric feels premium and the fit is spot on.",
        "date": "2025-10-28"
      },
      {
        "name": "Tania Sultana",
        "rating": 3,
        "text": "Nice quality but the color is slightly darker than the picture.",
        "date": "2025-10-19"
      },
      {
        "name": "Mahin Alam",
        "rating": 4,
        "text": "Super comfortable for all-day wear, I've already ordered a second one.",
        "date": "2025-10-10"
      }
    ],
    "relatedIds": [
      "prod-009",
      "prod-010",
      "prod-011",
      "prod-012"
    ],
    "frequentlyBoughtTogetherIds": [
      "prod-010",
      "prod-011"
    ],
    "customersAlsoBoughtIds": [
      "prod-020",
      "prod-021",
      "prod-022",
      "prod-023"
    ]
  },
  {
    "id": "prod-009",
    "slug": "tailored-chino-pants-men",
    "name": "Tailored Chino Pants",
    "sku": "MN-0009",
    "category": "Men",
    "subcategory": "Trousers",
    "brand": "Arcadia",
    "price": 1890,
    "comparePrice": 2590,
    "discountPercent": 27,
    "rating": 4.4,
    "reviewCount": 504,
    "stock": 110,
    "images": [
      "https://picsum.photos/seed/tailored-chino-pants-men-front/700/933",
      "https://picsum.photos/seed/tailored-chino-pants-men-back/700/933",
      "https://picsum.photos/seed/tailored-chino-pants-men-life/700/933",
      "https://picsum.photos/seed/tailored-chino-pants-men-model/700/933"
    ],
    "imageRoles": {
      "front": "https://picsum.photos/seed/tailored-chino-pants-men-front/700/933",
      "back": "https://picsum.photos/seed/tailored-chino-pants-men-back/700/933",
      "lifestyle": "https://picsum.photos/seed/tailored-chino-pants-men-life/700/933",
      "model": "https://picsum.photos/seed/tailored-chino-pants-men-model/700/933"
    },
    "colors": [
      {
        "name": "Mustard",
        "hex": "#d6a531"
      },
      {
        "name": "Blush Pink",
        "hex": "#e8b5bf"
      },
      {
        "name": "Black",
        "hex": "#1c1c1c"
      }
    ],
    "sizes": [
      "28",
      "30",
      "32",
      "34",
      "36",
      "38"
    ],
    "seo": {
      "title": "Tailored Chino Pants for Men – Comfortable Premium Casual Wear",
      "slug": "tailored-chino-pants-men",
      "metaTitle": "Tailored Chino Pants | Buy Online",
      "metaDescription": "Shop the Tailored Chino Pants in Cotton Twill. Slim Fit, solid design for smart casual. Now 27% off with fast delivery. Free returns. Free returns. Free returns",
      "keywords": [
        "tailored chino pants",
        "men trousers",
        "solid trousers",
        "buy tailored chino pants online",
        "smart casual wear",
        "premium trousers"
      ]
    },
    "shortDescription": "The Tailored Chino Pants blends cotton twill with a slim fit for effortless comfort. Featuring a solid design and it's tailored for smart casual moments throughout the all season season. A versatile wardrobe staple that pairs easily and wears beautifully day after day.",
    "longDescription": "Meet the Tailored Chino Pants — a thoughtfully designed trousers that brings together premium materials and a refined fit. Crafted from Cotton Twill, it is built to feel as good as it looks. The fabric is carefully selected for its soft hand-feel, resilience and natural drape, giving you a piece that holds its shape and color through repeated wear. Every detail — from the clean construction to the precision-finished seams and durable trims — reflects a genuine commitment to premium craftsmanship that you can see and feel.\n\nFabric & Comfort: Cotton Twill offers a balance of softness and structure that sits comfortably against the skin. The weave is breathable and gentle, helping regulate temperature so you stay fresh through busy days. The slim fit allows a natural range of movement without feeling restrictive, while careful tailoring ensures a clean, flattering line. making this an easy choice when you want to look put-together without compromising on ease or all-day wearability.\n\nStyle Benefits: the solid aesthetic makes this a genuinely versatile addition to any wardrobe. It layers effortlessly, mixes with both relaxed and elevated pieces, and adapts to your mood and the moment. Whether you dress it up or keep it understated, the Tailored Chino Pants delivers a modern, considered look. The colorways are chosen to complement a wide range of skin tones and existing outfits, so styling it is intuitive rather than complicated.\n\nUsage Scenarios: ideally suited for smart casual settings throughout the all season season, this piece transitions smoothly across your day. Wear it for casual outings, weekend plans, travel, gatherings with friends, or relaxed time at home. Its adaptable design means it works across your existing wardrobe with minimal effort, quickly becoming a reliable go-to you will reach for again and again — versatile enough to earn its place season after season.\n\nCare Instructions: to keep the Tailored Chino Pants looking its best, machine wash cold with similar colors on a gentle cycle. Do not bleach, and avoid harsh detergents that can dull the finish. Tumble dry on low or line dry in shade to protect the fibers, and warm iron on the reverse if needed. Avoid wringing to preserve the fabric structure and shape. With this simple care routine, your piece will stay fresh, soft and vibrant wash after wash — a smart, long-lasting investment in your everyday style.",
    "features": [
      "Premium Cotton fabric",
      "Breathable, skin-friendly material",
      "Fade-resistant color retention",
      "Soft-touch finish for all-day comfort",
      "Lightweight, easy-to-wear construction",
      "Slim Fit for a flattering silhouette",
      "Reinforced stitching for durability"
    ],
    "specifications": {
      "Material": "Cotton Twill",
      "Fit Type": "Slim Fit",
      "Sleeve Type": "N/A",
      "Neck Type": "N/A",
      "Pattern": "Solid",
      "Occasion": "Smart Casual",
      "Season": "All Season",
      "Gender": "Men",
      "Country of Origin": "Bangladesh"
    },
    "sizeGuide": [
      {
        "size": "28",
        "waist": "28",
        "hip": "36",
        "inseam": "78",
        "length": "104"
      },
      {
        "size": "30",
        "waist": "30",
        "hip": "38",
        "inseam": "78",
        "length": "104"
      },
      {
        "size": "32",
        "waist": "32",
        "hip": "40",
        "inseam": "78",
        "length": "104"
      },
      {
        "size": "34",
        "waist": "34",
        "hip": "42",
        "inseam": "78",
        "length": "104"
      },
      {
        "size": "36",
        "waist": "36",
        "hip": "44",
        "inseam": "78",
        "length": "104"
      },
      {
        "size": "38",
        "waist": "38",
        "hip": "46",
        "inseam": "78",
        "length": "104"
      }
    ],
    "reviews": [
      {
        "name": "Imran Chowdhury",
        "rating": 4,
        "text": "Soft, lightweight and well finished. Exactly what I was looking for.",
        "date": "2025-11-23"
      },
      {
        "name": "Sumaiya Akhtar",
        "rating": 5,
        "text": "Fantastic everyday piece — versatile, stylish and easy to care for.",
        "date": "2025-11-14"
      },
      {
        "name": "Shahriar Khan",
        "rating": 4,
        "text": "Absolutely love the quality, the fabric feels premium and the fit is spot on.",
        "date": "2025-11-05"
      },
      {
        "name": "Tania Sultana",
        "rating": 5,
        "text": "Exceeded my expectations — stitching is clean and the color is exactly as shown.",
        "date": "2025-10-27"
      },
      {
        "name": "Mahin Alam",
        "rating": 3,
        "text": "Comfortable and well made, delivery took a little longer than expected.",
        "date": "2025-10-18"
      },
      {
        "name": "Rumana Begum",
        "rating": 5,
        "text": "Great value for the price. Delivery was fast and packaging was neat.",
        "date": "2025-10-09"
      },
      {
        "name": "Naimur Rashid",
        "rating": 4,
        "text": "The material breathes really well, perfect for our weather. Highly recommend.",
        "date": "2025-09-30"
      }
    ],
    "relatedIds": [
      "prod-010",
      "prod-011",
      "prod-012",
      "prod-001"
    ],
    "frequentlyBoughtTogetherIds": [
      "prod-011",
      "prod-012"
    ],
    "customersAlsoBoughtIds": [
      "prod-021",
      "prod-022",
      "prod-023",
      "prod-024"
    ]
  },
  {
    "id": "prod-010",
    "slug": "quilted-bomber-jacket-men",
    "name": "Quilted Bomber Jacket",
    "sku": "MN-0010",
    "category": "Men",
    "subcategory": "Jackets",
    "brand": "Arcadia",
    "price": 3290,
    "comparePrice": 4490,
    "discountPercent": 27,
    "rating": 4.7,
    "reviewCount": 561,
    "stock": 0,
    "images": [
      "https://picsum.photos/seed/quilted-bomber-jacket-men-front/700/933",
      "https://picsum.photos/seed/quilted-bomber-jacket-men-back/700/933",
      "https://picsum.photos/seed/quilted-bomber-jacket-men-life/700/933",
      "https://picsum.photos/seed/quilted-bomber-jacket-men-model/700/933"
    ],
    "imageRoles": {
      "front": "https://picsum.photos/seed/quilted-bomber-jacket-men-front/700/933",
      "back": "https://picsum.photos/seed/quilted-bomber-jacket-men-back/700/933",
      "lifestyle": "https://picsum.photos/seed/quilted-bomber-jacket-men-life/700/933",
      "model": "https://picsum.photos/seed/quilted-bomber-jacket-men-model/700/933"
    },
    "colors": [
      {
        "name": "Teal",
        "hex": "#1f6f6b"
      },
      {
        "name": "Sage",
        "hex": "#9caf88"
      },
      {
        "name": "White",
        "hex": "#f5f5f5"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "seo": {
      "title": "Quilted Bomber Jacket for Men – Comfortable Premium Casual Wear",
      "slug": "quilted-bomber-jacket-men",
      "metaTitle": "Quilted Bomber Jacket | Buy Online",
      "metaDescription": "Shop the Quilted Bomber Jacket in Polyester Shell with Quilted Lining. Regular Fit, solid design for winter casual. Now 27% off with fast delivery. Free returns",
      "keywords": [
        "quilted bomber jacket",
        "men jackets",
        "solid jackets",
        "buy quilted bomber jacket online",
        "winter casual wear",
        "premium jackets"
      ]
    },
    "shortDescription": "The Quilted Bomber Jacket blends polyester shell with quilted lining with a regular fit for effortless comfort. Featuring a solid design and ribbed stand collar neckline, it's tailored for winter casual moments throughout the winter season. A versatile wardrobe staple that pairs easily and wears beautifully day after day.",
    "longDescription": "Meet the Quilted Bomber Jacket — a thoughtfully designed jackets that brings together premium materials and a refined fit. Crafted from Polyester Shell with Quilted Lining, it is built to feel as good as it looks. The fabric is carefully selected for its soft hand-feel, resilience and natural drape, giving you a piece that holds its shape and color through repeated wear. Every detail — from the ribbed stand collar to the precision-finished seams and durable trims — reflects a genuine commitment to premium craftsmanship that you can see and feel.\n\nFabric & Comfort: Polyester Shell with Quilted Lining offers a balance of softness and structure that sits comfortably against the skin. The weave is breathable and gentle, helping regulate temperature so you stay fresh through busy days. The regular fit allows a natural range of movement without feeling restrictive, while careful tailoring ensures a clean, flattering line. The full sleeve cut adds balance to the overall silhouette, making this an easy choice when you want to look put-together without compromising on ease or all-day wearability.\n\nStyle Benefits: the solid aesthetic makes this a genuinely versatile addition to any wardrobe. It layers effortlessly, mixes with both relaxed and elevated pieces, and adapts to your mood and the moment. Whether you dress it up or keep it understated, the Quilted Bomber Jacket delivers a modern, considered look. The colorways are chosen to complement a wide range of skin tones and existing outfits, so styling it is intuitive rather than complicated.\n\nUsage Scenarios: ideally suited for winter casual settings throughout the winter season, this piece transitions smoothly across your day. Wear it for casual outings, weekend plans, travel, gatherings with friends, or relaxed time at home. Its adaptable design means it works across your existing wardrobe with minimal effort, quickly becoming a reliable go-to you will reach for again and again — versatile enough to earn its place season after season.\n\nCare Instructions: to keep the Quilted Bomber Jacket looking its best, machine wash cold with similar colors on a gentle cycle. Do not bleach, and avoid harsh detergents that can dull the finish. Tumble dry on low or line dry in shade to protect the fibers, and warm iron on the reverse if needed. Avoid wringing to preserve the fabric structure and shape. With this simple care routine, your piece will stay fresh, soft and vibrant wash after wash — a smart, long-lasting investment in your everyday style.",
    "features": [
      "Premium Polyester fabric",
      "Breathable, skin-friendly material",
      "Fade-resistant color retention",
      "Soft-touch finish for all-day comfort",
      "Lightweight, easy-to-wear construction",
      "Regular Fit for a flattering silhouette",
      "Reinforced stitching for durability"
    ],
    "specifications": {
      "Material": "Polyester Shell with Quilted Lining",
      "Fit Type": "Regular Fit",
      "Sleeve Type": "Full Sleeve",
      "Neck Type": "Ribbed Stand Collar",
      "Pattern": "Solid",
      "Occasion": "Winter Casual",
      "Season": "Winter",
      "Gender": "Men",
      "Country of Origin": "Bangladesh"
    },
    "sizeGuide": [
      {
        "size": "XS",
        "chest": "34",
        "waist": "28",
        "length": "66",
        "shoulder": "40"
      },
      {
        "size": "S",
        "chest": "36",
        "waist": "30",
        "length": "68",
        "shoulder": "42"
      },
      {
        "size": "M",
        "chest": "38",
        "waist": "32",
        "length": "70",
        "shoulder": "44"
      },
      {
        "size": "L",
        "chest": "40",
        "waist": "34",
        "length": "72",
        "shoulder": "46"
      },
      {
        "size": "XL",
        "chest": "42",
        "waist": "36",
        "length": "74",
        "shoulder": "48"
      },
      {
        "size": "XXL",
        "chest": "44",
        "waist": "38",
        "length": "76",
        "shoulder": "50"
      }
    ],
    "reviews": [
      {
        "name": "Sumaiya Akhtar",
        "rating": 5,
        "text": "Fantastic everyday piece — versatile, stylish and easy to care for.",
        "date": "2025-11-22"
      },
      {
        "name": "Shahriar Khan",
        "rating": 4,
        "text": "Absolutely love the quality, the fabric feels premium and the fit is spot on.",
        "date": "2025-11-13"
      },
      {
        "name": "Tania Sultana",
        "rating": 5,
        "text": "Exceeded my expectations — stitching is clean and the color is exactly as shown.",
        "date": "2025-11-04"
      },
      {
        "name": "Mahin Alam",
        "rating": 4,
        "text": "Super comfortable for all-day wear, I've already ordered a second one.",
        "date": "2025-10-26"
      },
      {
        "name": "Rumana Begum",
        "rating": 3,
        "text": "Happy with it, just wish there were a few more color options.",
        "date": "2025-10-17"
      },
      {
        "name": "Naimur Rashid",
        "rating": 4,
        "text": "The material breathes really well, perfect for our weather. Highly recommend.",
        "date": "2025-10-08"
      },
      {
        "name": "Jannatul Ferdous",
        "rating": 5,
        "text": "Looks even better in person. Got compliments the first time I wore it.",
        "date": "2025-09-29"
      },
      {
        "name": "Asif Mahmud",
        "rating": 4,
        "text": "True to size and holds up well after multiple washes. Very happy.",
        "date": "2025-09-20"
      }
    ],
    "relatedIds": [
      "prod-011",
      "prod-012",
      "prod-001",
      "prod-002"
    ],
    "frequentlyBoughtTogetherIds": [
      "prod-012",
      "prod-001"
    ],
    "customersAlsoBoughtIds": [
      "prod-022",
      "prod-023",
      "prod-024",
      "prod-025"
    ]
  },
  {
    "id": "prod-011",
    "slug": "henley-long-sleeve-shirt-men",
    "name": "Henley Long Sleeve Shirt",
    "sku": "MN-0011",
    "category": "Men",
    "subcategory": "T-Shirts",
    "brand": "Arcadia",
    "price": 1190,
    "comparePrice": 1690,
    "discountPercent": 30,
    "rating": 4,
    "reviewCount": 618,
    "stock": 136,
    "images": [
      "https://picsum.photos/seed/henley-long-sleeve-shirt-men-front/700/933",
      "https://picsum.photos/seed/henley-long-sleeve-shirt-men-back/700/933",
      "https://picsum.photos/seed/henley-long-sleeve-shirt-men-life/700/933",
      "https://picsum.photos/seed/henley-long-sleeve-shirt-men-model/700/933"
    ],
    "imageRoles": {
      "front": "https://picsum.photos/seed/henley-long-sleeve-shirt-men-front/700/933",
      "back": "https://picsum.photos/seed/henley-long-sleeve-shirt-men-back/700/933",
      "lifestyle": "https://picsum.photos/seed/henley-long-sleeve-shirt-men-life/700/933",
      "model": "https://picsum.photos/seed/henley-long-sleeve-shirt-men-model/700/933"
    },
    "colors": [
      {
        "name": "Coral",
        "hex": "#e8836b"
      },
      {
        "name": "Rust",
        "hex": "#a8562f"
      },
      {
        "name": "Navy",
        "hex": "#1f2a44"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "seo": {
      "title": "Henley Long Sleeve Shirt for Men – Comfortable Premium Casual Wear",
      "slug": "henley-long-sleeve-shirt-men",
      "metaTitle": "Henley Long Sleeve Shirt | Buy Online",
      "metaDescription": "Shop the Henley Long Sleeve Shirt in Cotton Waffle Knit. Slim Fit, solid design for casual. Now 30% off with fast delivery. Free returns. Free returns.",
      "keywords": [
        "henley long sleeve shirt",
        "men t-shirts",
        "solid t-shirts",
        "buy henley long sleeve shirt online",
        "casual wear",
        "premium t-shirts"
      ]
    },
    "shortDescription": "The Henley Long Sleeve Shirt blends cotton waffle knit with a slim fit for effortless comfort. Featuring a solid design and henley neck neckline, it's tailored for casual moments throughout the winter season. A versatile wardrobe staple that pairs easily and wears beautifully day after day.",
    "longDescription": "Meet the Henley Long Sleeve Shirt — a thoughtfully designed t-shirts that brings together premium materials and a refined fit. Crafted from Cotton Waffle Knit, it is built to feel as good as it looks. The fabric is carefully selected for its soft hand-feel, resilience and natural drape, giving you a piece that holds its shape and color through repeated wear. Every detail — from the henley neck to the precision-finished seams and durable trims — reflects a genuine commitment to premium craftsmanship that you can see and feel.\n\nFabric & Comfort: Cotton Waffle Knit offers a balance of softness and structure that sits comfortably against the skin. The weave is breathable and gentle, helping regulate temperature so you stay fresh through busy days. The slim fit allows a natural range of movement without feeling restrictive, while careful tailoring ensures a clean, flattering line. The long sleeve cut adds balance to the overall silhouette, making this an easy choice when you want to look put-together without compromising on ease or all-day wearability.\n\nStyle Benefits: the solid aesthetic makes this a genuinely versatile addition to any wardrobe. It layers effortlessly, mixes with both relaxed and elevated pieces, and adapts to your mood and the moment. Whether you dress it up or keep it understated, the Henley Long Sleeve Shirt delivers a modern, considered look. The colorways are chosen to complement a wide range of skin tones and existing outfits, so styling it is intuitive rather than complicated.\n\nUsage Scenarios: ideally suited for casual settings throughout the winter season, this piece transitions smoothly across your day. Wear it for casual outings, weekend plans, travel, gatherings with friends, or relaxed time at home. Its adaptable design means it works across your existing wardrobe with minimal effort, quickly becoming a reliable go-to you will reach for again and again — versatile enough to earn its place season after season.\n\nCare Instructions: to keep the Henley Long Sleeve Shirt looking its best, machine wash cold with similar colors on a gentle cycle. Do not bleach, and avoid harsh detergents that can dull the finish. Tumble dry on low or line dry in shade to protect the fibers, and warm iron on the reverse if needed. Avoid wringing to preserve the fabric structure and shape. With this simple care routine, your piece will stay fresh, soft and vibrant wash after wash — a smart, long-lasting investment in your everyday style.",
    "features": [
      "Premium Cotton fabric",
      "Breathable, skin-friendly material",
      "Fade-resistant color retention",
      "Soft-touch finish for all-day comfort",
      "Lightweight, easy-to-wear construction",
      "Slim Fit for a flattering silhouette",
      "Reinforced stitching for durability"
    ],
    "specifications": {
      "Material": "Cotton Waffle Knit",
      "Fit Type": "Slim Fit",
      "Sleeve Type": "Long Sleeve",
      "Neck Type": "Henley Neck",
      "Pattern": "Solid",
      "Occasion": "Casual",
      "Season": "Winter",
      "Gender": "Men",
      "Country of Origin": "Bangladesh"
    },
    "sizeGuide": [
      {
        "size": "XS",
        "chest": "34",
        "waist": "28",
        "length": "66",
        "shoulder": "40"
      },
      {
        "size": "S",
        "chest": "36",
        "waist": "30",
        "length": "68",
        "shoulder": "42"
      },
      {
        "size": "M",
        "chest": "38",
        "waist": "32",
        "length": "70",
        "shoulder": "44"
      },
      {
        "size": "L",
        "chest": "40",
        "waist": "34",
        "length": "72",
        "shoulder": "46"
      },
      {
        "size": "XL",
        "chest": "42",
        "waist": "36",
        "length": "74",
        "shoulder": "48"
      },
      {
        "size": "XXL",
        "chest": "44",
        "waist": "38",
        "length": "76",
        "shoulder": "50"
      }
    ],
    "reviews": [
      {
        "name": "Shahriar Khan",
        "rating": 4,
        "text": "Absolutely love the quality, the fabric feels premium and the fit is spot on.",
        "date": "2025-11-21"
      },
      {
        "name": "Tania Sultana",
        "rating": 5,
        "text": "Exceeded my expectations — stitching is clean and the color is exactly as shown.",
        "date": "2025-11-12"
      },
      {
        "name": "Mahin Alam",
        "rating": 4,
        "text": "Super comfortable for all-day wear, I've already ordered a second one.",
        "date": "2025-11-03"
      },
      {
        "name": "Rumana Begum",
        "rating": 5,
        "text": "Great value for the price. Delivery was fast and packaging was neat.",
        "date": "2025-10-25"
      },
      {
        "name": "Naimur Rashid",
        "rating": 3,
        "text": "Decent fabric for the price, the fit runs a touch slim.",
        "date": "2025-10-16"
      },
      {
        "name": "Jannatul Ferdous",
        "rating": 5,
        "text": "Looks even better in person. Got compliments the first time I wore it.",
        "date": "2025-10-07"
      },
      {
        "name": "Asif Mahmud",
        "rating": 4,
        "text": "True to size and holds up well after multiple washes. Very happy.",
        "date": "2025-09-28"
      },
      {
        "name": "Priya Das",
        "rating": 5,
        "text": "Premium feel without the premium markup. Will buy again from this brand.",
        "date": "2025-09-19"
      },
      {
        "name": "Sabbir Ahmed",
        "rating": 4,
        "text": "Soft, lightweight and well finished. Exactly what I was looking for.",
        "date": "2025-09-10"
      }
    ],
    "relatedIds": [
      "prod-012",
      "prod-001",
      "prod-002",
      "prod-003"
    ],
    "frequentlyBoughtTogetherIds": [
      "prod-001",
      "prod-002"
    ],
    "customersAlsoBoughtIds": [
      "prod-023",
      "prod-024",
      "prod-025",
      "prod-026"
    ]
  },
  {
    "id": "prod-012",
    "slug": "premium-wool-blend-blazer-men",
    "name": "Premium Wool Blend Blazer",
    "sku": "MN-0012",
    "category": "Men",
    "subcategory": "Blazers",
    "brand": "Arcadia",
    "price": 4990,
    "comparePrice": 6990,
    "discountPercent": 29,
    "rating": 4.3,
    "reviewCount": 675,
    "stock": 149,
    "images": [
      "https://picsum.photos/seed/premium-wool-blend-blazer-men-front/700/933",
      "https://picsum.photos/seed/premium-wool-blend-blazer-men-back/700/933",
      "https://picsum.photos/seed/premium-wool-blend-blazer-men-life/700/933",
      "https://picsum.photos/seed/premium-wool-blend-blazer-men-model/700/933"
    ],
    "imageRoles": {
      "front": "https://picsum.photos/seed/premium-wool-blend-blazer-men-front/700/933",
      "back": "https://picsum.photos/seed/premium-wool-blend-blazer-men-back/700/933",
      "lifestyle": "https://picsum.photos/seed/premium-wool-blend-blazer-men-life/700/933",
      "model": "https://picsum.photos/seed/premium-wool-blend-blazer-men-model/700/933"
    },
    "colors": [
      {
        "name": "Blush Pink",
        "hex": "#e8b5bf"
      },
      {
        "name": "Lavender",
        "hex": "#b9a7d6"
      },
      {
        "name": "Charcoal",
        "hex": "#3a3a3a"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "seo": {
      "title": "Premium Wool Blend Blazer for Men – Comfortable Premium Casual Wear",
      "slug": "premium-wool-blend-blazer-men",
      "metaTitle": "Premium Wool Blend Blazer | Buy Online",
      "metaDescription": "Shop the Premium Wool Blend Blazer in Wool Blend Suiting. Tailored Fit, textured design for formal. Now 29% off with fast delivery. Free returns. Free returns.",
      "keywords": [
        "premium wool blend blazer",
        "men blazers",
        "textured blazers",
        "buy premium wool blend blazer online",
        "formal wear",
        "premium blazers"
      ]
    },
    "shortDescription": "The Premium Wool Blend Blazer blends wool blend suiting with a tailored fit for effortless comfort. Featuring a textured design and notch lapel neckline, it's tailored for formal moments throughout the winter season. A versatile wardrobe staple that pairs easily and wears beautifully day after day.",
    "longDescription": "Meet the Premium Wool Blend Blazer — a thoughtfully designed blazers that brings together premium materials and a refined fit. Crafted from Wool Blend Suiting, it is built to feel as good as it looks. The fabric is carefully selected for its soft hand-feel, resilience and natural drape, giving you a piece that holds its shape and color through repeated wear. Every detail — from the notch lapel to the precision-finished seams and durable trims — reflects a genuine commitment to premium craftsmanship that you can see and feel.\n\nFabric & Comfort: Wool Blend Suiting offers a balance of softness and structure that sits comfortably against the skin. The weave is breathable and gentle, helping regulate temperature so you stay fresh through busy days. The tailored fit allows a natural range of movement without feeling restrictive, while careful tailoring ensures a clean, flattering line. The full sleeve cut adds balance to the overall silhouette, making this an easy choice when you want to look put-together without compromising on ease or all-day wearability.\n\nStyle Benefits: the textured aesthetic makes this a genuinely versatile addition to any wardrobe. It layers effortlessly, mixes with both relaxed and elevated pieces, and adapts to your mood and the moment. Whether you dress it up or keep it understated, the Premium Wool Blend Blazer delivers a modern, considered look. The colorways are chosen to complement a wide range of skin tones and existing outfits, so styling it is intuitive rather than complicated.\n\nUsage Scenarios: ideally suited for formal settings throughout the winter season, this piece transitions smoothly across your day. Wear it for casual outings, weekend plans, travel, gatherings with friends, or relaxed time at home. Its adaptable design means it works across your existing wardrobe with minimal effort, quickly becoming a reliable go-to you will reach for again and again — versatile enough to earn its place season after season.\n\nCare Instructions: to keep the Premium Wool Blend Blazer looking its best, machine wash cold with similar colors on a gentle cycle. Do not bleach, and avoid harsh detergents that can dull the finish. Tumble dry on low or line dry in shade to protect the fibers, and warm iron on the reverse if needed. Avoid wringing to preserve the fabric structure and shape. With this simple care routine, your piece will stay fresh, soft and vibrant wash after wash — a smart, long-lasting investment in your everyday style.",
    "features": [
      "Premium Wool fabric",
      "Breathable, skin-friendly material",
      "Fade-resistant color retention",
      "Soft-touch finish for all-day comfort",
      "Lightweight, easy-to-wear construction",
      "Tailored Fit for a flattering silhouette",
      "Reinforced stitching for durability"
    ],
    "specifications": {
      "Material": "Wool Blend Suiting",
      "Fit Type": "Tailored Fit",
      "Sleeve Type": "Full Sleeve",
      "Neck Type": "Notch Lapel",
      "Pattern": "Textured",
      "Occasion": "Formal",
      "Season": "Winter",
      "Gender": "Men",
      "Country of Origin": "Bangladesh"
    },
    "sizeGuide": [
      {
        "size": "XS",
        "chest": "34",
        "waist": "28",
        "length": "66",
        "shoulder": "40"
      },
      {
        "size": "S",
        "chest": "36",
        "waist": "30",
        "length": "68",
        "shoulder": "42"
      },
      {
        "size": "M",
        "chest": "38",
        "waist": "32",
        "length": "70",
        "shoulder": "44"
      },
      {
        "size": "L",
        "chest": "40",
        "waist": "34",
        "length": "72",
        "shoulder": "46"
      },
      {
        "size": "XL",
        "chest": "42",
        "waist": "36",
        "length": "74",
        "shoulder": "48"
      },
      {
        "size": "XXL",
        "chest": "44",
        "waist": "38",
        "length": "76",
        "shoulder": "50"
      }
    ],
    "reviews": [
      {
        "name": "Tania Sultana",
        "rating": 5,
        "text": "Exceeded my expectations — stitching is clean and the color is exactly as shown.",
        "date": "2025-11-20"
      },
      {
        "name": "Mahin Alam",
        "rating": 4,
        "text": "Super comfortable for all-day wear, I've already ordered a second one.",
        "date": "2025-11-11"
      },
      {
        "name": "Rumana Begum",
        "rating": 5,
        "text": "Great value for the price. Delivery was fast and packaging was neat.",
        "date": "2025-11-02"
      },
      {
        "name": "Naimur Rashid",
        "rating": 4,
        "text": "The material breathes really well, perfect for our weather. Highly recommend.",
        "date": "2025-10-24"
      },
      {
        "name": "Jannatul Ferdous",
        "rating": 3,
        "text": "Good product overall, though I'd suggest sizing up for a relaxed fit.",
        "date": "2025-10-15"
      },
      {
        "name": "Asif Mahmud",
        "rating": 4,
        "text": "True to size and holds up well after multiple washes. Very happy.",
        "date": "2025-10-06"
      },
      {
        "name": "Priya Das",
        "rating": 5,
        "text": "Premium feel without the premium markup. Will buy again from this brand.",
        "date": "2025-09-27"
      },
      {
        "name": "Sabbir Ahmed",
        "rating": 4,
        "text": "Soft, lightweight and well finished. Exactly what I was looking for.",
        "date": "2025-09-18"
      },
      {
        "name": "Rifat Karim",
        "rating": 5,
        "text": "Fantastic everyday piece — versatile, stylish and easy to care for.",
        "date": "2025-09-09"
      },
      {
        "name": "Mehnaz Haque",
        "rating": 4,
        "text": "Good product overall, though I'd suggest sizing up for a relaxed fit.",
        "date": "2025-08-31"
      }
    ],
    "relatedIds": [
      "prod-001",
      "prod-002",
      "prod-003",
      "prod-004"
    ],
    "frequentlyBoughtTogetherIds": [
      "prod-002",
      "prod-003"
    ],
    "customersAlsoBoughtIds": [
      "prod-024",
      "prod-025",
      "prod-026",
      "prod-027"
    ]
  },
  {
    "id": "prod-013",
    "slug": "floral-printed-kurti-women",
    "name": "Floral Printed Kurti",
    "sku": "WM-0013",
    "category": "Women",
    "subcategory": "Kurti",
    "brand": "Élan Studio",
    "price": 1390,
    "comparePrice": 1890,
    "discountPercent": 26,
    "rating": 4.6,
    "reviewCount": 732,
    "stock": 162,
    "images": [
      "https://picsum.photos/seed/floral-printed-kurti-women-front/700/933",
      "https://picsum.photos/seed/floral-printed-kurti-women-back/700/933",
      "https://picsum.photos/seed/floral-printed-kurti-women-life/700/933",
      "https://picsum.photos/seed/floral-printed-kurti-women-model/700/933"
    ],
    "imageRoles": {
      "front": "https://picsum.photos/seed/floral-printed-kurti-women-front/700/933",
      "back": "https://picsum.photos/seed/floral-printed-kurti-women-back/700/933",
      "lifestyle": "https://picsum.photos/seed/floral-printed-kurti-women-life/700/933",
      "model": "https://picsum.photos/seed/floral-printed-kurti-women-model/700/933"
    },
    "colors": [
      {
        "name": "Sage",
        "hex": "#9caf88"
      },
      {
        "name": "Black",
        "hex": "#1c1c1c"
      },
      {
        "name": "Olive",
        "hex": "#5b5a3a"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "seo": {
      "title": "Floral Printed Kurti for Women – Elegant Everyday Style",
      "slug": "floral-printed-kurti-women",
      "metaTitle": "Floral Printed Kurti | Buy Online",
      "metaDescription": "Shop the Floral Printed Kurti in Rayon Viscose. A-Line Fit, floral print design for casual. Now 26% off with fast delivery. Free returns. Free returns.",
      "keywords": [
        "floral printed kurti",
        "women kurti",
        "floral print kurti",
        "buy floral printed kurti online",
        "casual wear",
        "premium kurti"
      ]
    },
    "shortDescription": "The Floral Printed Kurti blends rayon viscose with a a-line fit for effortless comfort. Featuring a floral print design and round neck neckline, it's tailored for casual moments throughout the summer season. A versatile wardrobe staple that pairs easily and wears beautifully day after day.",
    "longDescription": "Meet the Floral Printed Kurti — a thoughtfully designed kurti that brings together premium materials and a refined fit. Crafted from Rayon Viscose, it is built to feel as good as it looks. The fabric is carefully selected for its soft hand-feel, resilience and natural drape, giving you a piece that holds its shape and color through repeated wear. Every detail — from the round neck to the precision-finished seams and durable trims — reflects a genuine commitment to premium craftsmanship that you can see and feel.\n\nFabric & Comfort: Rayon Viscose offers a balance of softness and structure that sits comfortably against the skin. The weave is breathable and gentle, helping regulate temperature so you stay fresh through busy days. The a-line fit allows a natural range of movement without feeling restrictive, while careful tailoring ensures a clean, flattering line. The three-quarter sleeve cut adds balance to the overall silhouette, making this an easy choice when you want to look put-together without compromising on ease or all-day wearability.\n\nStyle Benefits: the floral print aesthetic makes this a genuinely versatile addition to any wardrobe. It layers effortlessly, mixes with both relaxed and elevated pieces, and adapts to your mood and the moment. Whether you dress it up or keep it understated, the Floral Printed Kurti delivers a modern, considered look. The colorways are chosen to complement a wide range of skin tones and existing outfits, so styling it is intuitive rather than complicated.\n\nUsage Scenarios: ideally suited for casual settings throughout the summer season, this piece transitions smoothly across your day. Wear it for casual outings, weekend plans, travel, gatherings with friends, or relaxed time at home. Its adaptable design means it works across your existing wardrobe with minimal effort, quickly becoming a reliable go-to you will reach for again and again — versatile enough to earn its place season after season.\n\nCare Instructions: to keep the Floral Printed Kurti looking its best, machine wash cold with similar colors on a gentle cycle. Do not bleach, and avoid harsh detergents that can dull the finish. Tumble dry on low or line dry in shade to protect the fibers, and warm iron on the reverse if needed. Avoid wringing to preserve the fabric structure and shape. With this simple care routine, your piece will stay fresh, soft and vibrant wash after wash — a smart, long-lasting investment in your everyday style.",
    "features": [
      "Premium Rayon fabric",
      "Breathable, skin-friendly material",
      "Fade-resistant color retention",
      "Soft-touch finish for all-day comfort",
      "Lightweight, easy-to-wear construction",
      "A-Line Fit for a flattering silhouette",
      "Reinforced stitching for durability"
    ],
    "specifications": {
      "Material": "Rayon Viscose",
      "Fit Type": "A-Line Fit",
      "Sleeve Type": "Three-Quarter Sleeve",
      "Neck Type": "Round Neck",
      "Pattern": "Floral Print",
      "Occasion": "Casual",
      "Season": "Summer",
      "Gender": "Women",
      "Country of Origin": "Bangladesh"
    },
    "sizeGuide": [
      {
        "size": "XS",
        "chest": "34",
        "waist": "28",
        "length": "66",
        "shoulder": "40"
      },
      {
        "size": "S",
        "chest": "36",
        "waist": "30",
        "length": "68",
        "shoulder": "42"
      },
      {
        "size": "M",
        "chest": "38",
        "waist": "32",
        "length": "70",
        "shoulder": "44"
      },
      {
        "size": "L",
        "chest": "40",
        "waist": "34",
        "length": "72",
        "shoulder": "46"
      },
      {
        "size": "XL",
        "chest": "42",
        "waist": "36",
        "length": "74",
        "shoulder": "48"
      },
      {
        "size": "XXL",
        "chest": "44",
        "waist": "38",
        "length": "76",
        "shoulder": "50"
      }
    ],
    "reviews": [
      {
        "name": "Mahin Alam",
        "rating": 4,
        "text": "Super comfortable for all-day wear, I've already ordered a second one.",
        "date": "2025-11-19"
      },
      {
        "name": "Rumana Begum",
        "rating": 5,
        "text": "Great value for the price. Delivery was fast and packaging was neat.",
        "date": "2025-11-10"
      },
      {
        "name": "Naimur Rashid",
        "rating": 4,
        "text": "The material breathes really well, perfect for our weather. Highly recommend.",
        "date": "2025-11-01"
      },
      {
        "name": "Jannatul Ferdous",
        "rating": 5,
        "text": "Looks even better in person. Got compliments the first time I wore it.",
        "date": "2025-10-23"
      },
      {
        "name": "Asif Mahmud",
        "rating": 3,
        "text": "Nice quality but the color is slightly darker than the picture.",
        "date": "2025-10-14"
      }
    ],
    "relatedIds": [
      "prod-015",
      "prod-016",
      "prod-017",
      "prod-018"
    ],
    "frequentlyBoughtTogetherIds": [
      "prod-016",
      "prod-017"
    ],
    "customersAlsoBoughtIds": [
      "prod-025",
      "prod-026",
      "prod-027",
      "prod-028"
    ]
  },
  {
    "id": "prod-014",
    "slug": "relaxed-fit-co-ord-set-women",
    "name": "Relaxed Fit Co-Ord Set",
    "sku": "WM-0014",
    "category": "Women",
    "subcategory": "Co-Ord Sets",
    "brand": "Élan Studio",
    "price": 2290,
    "comparePrice": 3190,
    "discountPercent": 28,
    "rating": 4.9,
    "reviewCount": 789,
    "stock": 175,
    "images": [
      "https://picsum.photos/seed/relaxed-fit-co-ord-set-women-front/700/933",
      "https://picsum.photos/seed/relaxed-fit-co-ord-set-women-back/700/933",
      "https://picsum.photos/seed/relaxed-fit-co-ord-set-women-life/700/933",
      "https://picsum.photos/seed/relaxed-fit-co-ord-set-women-model/700/933"
    ],
    "imageRoles": {
      "front": "https://picsum.photos/seed/relaxed-fit-co-ord-set-women-front/700/933",
      "back": "https://picsum.photos/seed/relaxed-fit-co-ord-set-women-back/700/933",
      "lifestyle": "https://picsum.photos/seed/relaxed-fit-co-ord-set-women-life/700/933",
      "model": "https://picsum.photos/seed/relaxed-fit-co-ord-set-women-model/700/933"
    },
    "colors": [
      {
        "name": "Rust",
        "hex": "#a8562f"
      },
      {
        "name": "White",
        "hex": "#f5f5f5"
      },
      {
        "name": "Maroon",
        "hex": "#6e1f2b"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "seo": {
      "title": "Relaxed Fit Co-Ord Set for Women – Elegant Everyday Style",
      "slug": "relaxed-fit-co-ord-set-women",
      "metaTitle": "Relaxed Fit Co-Ord Set | Buy Online",
      "metaDescription": "Shop the Relaxed Fit Co-Ord Set in Cotton Linen Blend. Relaxed Fit, solid design for lounge. Now 28% off with fast delivery. Free returns. Free returns.",
      "keywords": [
        "relaxed fit co-ord set",
        "women co-ord sets",
        "solid co-ord sets",
        "buy relaxed fit co-ord set online",
        "lounge wear",
        "premium co-ord sets"
      ]
    },
    "shortDescription": "The Relaxed Fit Co-Ord Set blends cotton linen blend with a relaxed fit for effortless comfort. Featuring a solid design and v-neck neckline, it's tailored for lounge moments throughout the summer season. A versatile wardrobe staple that pairs easily and wears beautifully day after day.",
    "longDescription": "Meet the Relaxed Fit Co-Ord Set — a thoughtfully designed co-ord sets that brings together premium materials and a refined fit. Crafted from Cotton Linen Blend, it is built to feel as good as it looks. The fabric is carefully selected for its soft hand-feel, resilience and natural drape, giving you a piece that holds its shape and color through repeated wear. Every detail — from the v-neck to the precision-finished seams and durable trims — reflects a genuine commitment to premium craftsmanship that you can see and feel.\n\nFabric & Comfort: Cotton Linen Blend offers a balance of softness and structure that sits comfortably against the skin. The weave is breathable and gentle, helping regulate temperature so you stay fresh through busy days. The relaxed fit allows a natural range of movement without feeling restrictive, while careful tailoring ensures a clean, flattering line. The short sleeve cut adds balance to the overall silhouette, making this an easy choice when you want to look put-together without compromising on ease or all-day wearability.\n\nStyle Benefits: the solid aesthetic makes this a genuinely versatile addition to any wardrobe. It layers effortlessly, mixes with both relaxed and elevated pieces, and adapts to your mood and the moment. Whether you dress it up or keep it understated, the Relaxed Fit Co-Ord Set delivers a modern, considered look. The colorways are chosen to complement a wide range of skin tones and existing outfits, so styling it is intuitive rather than complicated.\n\nUsage Scenarios: ideally suited for lounge settings throughout the summer season, this piece transitions smoothly across your day. Wear it for casual outings, weekend plans, travel, gatherings with friends, or relaxed time at home. Its adaptable design means it works across your existing wardrobe with minimal effort, quickly becoming a reliable go-to you will reach for again and again — versatile enough to earn its place season after season.\n\nCare Instructions: to keep the Relaxed Fit Co-Ord Set looking its best, machine wash cold with similar colors on a gentle cycle. Do not bleach, and avoid harsh detergents that can dull the finish. Tumble dry on low or line dry in shade to protect the fibers, and warm iron on the reverse if needed. Avoid wringing to preserve the fabric structure and shape. With this simple care routine, your piece will stay fresh, soft and vibrant wash after wash — a smart, long-lasting investment in your everyday style.",
    "features": [
      "Premium Cotton fabric",
      "Breathable, skin-friendly material",
      "Fade-resistant color retention",
      "Soft-touch finish for all-day comfort",
      "Lightweight, easy-to-wear construction",
      "Relaxed Fit for a flattering silhouette",
      "Reinforced stitching for durability"
    ],
    "specifications": {
      "Material": "Cotton Linen Blend",
      "Fit Type": "Relaxed Fit",
      "Sleeve Type": "Short Sleeve",
      "Neck Type": "V-Neck",
      "Pattern": "Solid",
      "Occasion": "Lounge",
      "Season": "Summer",
      "Gender": "Women",
      "Country of Origin": "Bangladesh"
    },
    "sizeGuide": [
      {
        "size": "XS",
        "chest": "34",
        "waist": "28",
        "length": "66",
        "shoulder": "40"
      },
      {
        "size": "S",
        "chest": "36",
        "waist": "30",
        "length": "68",
        "shoulder": "42"
      },
      {
        "size": "M",
        "chest": "38",
        "waist": "32",
        "length": "70",
        "shoulder": "44"
      },
      {
        "size": "L",
        "chest": "40",
        "waist": "34",
        "length": "72",
        "shoulder": "46"
      },
      {
        "size": "XL",
        "chest": "42",
        "waist": "36",
        "length": "74",
        "shoulder": "48"
      },
      {
        "size": "XXL",
        "chest": "44",
        "waist": "38",
        "length": "76",
        "shoulder": "50"
      }
    ],
    "reviews": [
      {
        "name": "Rumana Begum",
        "rating": 5,
        "text": "Great value for the price. Delivery was fast and packaging was neat.",
        "date": "2025-11-18"
      },
      {
        "name": "Naimur Rashid",
        "rating": 4,
        "text": "The material breathes really well, perfect for our weather. Highly recommend.",
        "date": "2025-11-09"
      },
      {
        "name": "Jannatul Ferdous",
        "rating": 5,
        "text": "Looks even better in person. Got compliments the first time I wore it.",
        "date": "2025-10-31"
      },
      {
        "name": "Asif Mahmud",
        "rating": 4,
        "text": "True to size and holds up well after multiple washes. Very happy.",
        "date": "2025-10-22"
      },
      {
        "name": "Priya Das",
        "rating": 3,
        "text": "Comfortable and well made, delivery took a little longer than expected.",
        "date": "2025-10-13"
      },
      {
        "name": "Sabbir Ahmed",
        "rating": 4,
        "text": "Soft, lightweight and well finished. Exactly what I was looking for.",
        "date": "2025-10-04"
      }
    ],
    "relatedIds": [
      "prod-016",
      "prod-017",
      "prod-018",
      "prod-019"
    ],
    "frequentlyBoughtTogetherIds": [
      "prod-017",
      "prod-018"
    ],
    "customersAlsoBoughtIds": [
      "prod-026",
      "prod-027",
      "prod-028",
      "prod-029"
    ]
  },
  {
    "id": "prod-015",
    "slug": "premium-cotton-top-women",
    "name": "Premium Cotton Top",
    "sku": "WM-0015",
    "category": "Women",
    "subcategory": "Tops",
    "brand": "Élan Studio",
    "price": 1090,
    "comparePrice": 1490,
    "discountPercent": 27,
    "rating": 4.2,
    "reviewCount": 846,
    "stock": 8,
    "images": [
      "https://picsum.photos/seed/premium-cotton-top-women-front/700/933",
      "https://picsum.photos/seed/premium-cotton-top-women-back/700/933",
      "https://picsum.photos/seed/premium-cotton-top-women-life/700/933",
      "https://picsum.photos/seed/premium-cotton-top-women-model/700/933"
    ],
    "imageRoles": {
      "front": "https://picsum.photos/seed/premium-cotton-top-women-front/700/933",
      "back": "https://picsum.photos/seed/premium-cotton-top-women-back/700/933",
      "lifestyle": "https://picsum.photos/seed/premium-cotton-top-women-life/700/933",
      "model": "https://picsum.photos/seed/premium-cotton-top-women-model/700/933"
    },
    "colors": [
      {
        "name": "Lavender",
        "hex": "#b9a7d6"
      },
      {
        "name": "Navy",
        "hex": "#1f2a44"
      },
      {
        "name": "Beige",
        "hex": "#d8c7a8"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "seo": {
      "title": "Premium Cotton Top for Women – Elegant Everyday Style",
      "slug": "premium-cotton-top-women",
      "metaTitle": "Premium Cotton Top | Buy Online",
      "metaDescription": "Shop the Premium Cotton Top in Soft Cotton Poplin. Regular Fit, solid design for casual. Now 27% off with fast delivery. Free returns. Free returns. Free return",
      "keywords": [
        "premium cotton top",
        "women tops",
        "solid tops",
        "buy premium cotton top online",
        "casual wear",
        "premium tops"
      ]
    },
    "shortDescription": "The Premium Cotton Top blends soft cotton poplin with a regular fit for effortless comfort. Featuring a solid design and square neck neckline, it's tailored for casual moments throughout the summer season. A versatile wardrobe staple that pairs easily and wears beautifully day after day.",
    "longDescription": "Meet the Premium Cotton Top — a thoughtfully designed tops that brings together premium materials and a refined fit. Crafted from Soft Cotton Poplin, it is built to feel as good as it looks. The fabric is carefully selected for its soft hand-feel, resilience and natural drape, giving you a piece that holds its shape and color through repeated wear. Every detail — from the square neck to the precision-finished seams and durable trims — reflects a genuine commitment to premium craftsmanship that you can see and feel.\n\nFabric & Comfort: Soft Cotton Poplin offers a balance of softness and structure that sits comfortably against the skin. The weave is breathable and gentle, helping regulate temperature so you stay fresh through busy days. The regular fit allows a natural range of movement without feeling restrictive, while careful tailoring ensures a clean, flattering line. The puff sleeve cut adds balance to the overall silhouette, making this an easy choice when you want to look put-together without compromising on ease or all-day wearability.\n\nStyle Benefits: the solid aesthetic makes this a genuinely versatile addition to any wardrobe. It layers effortlessly, mixes with both relaxed and elevated pieces, and adapts to your mood and the moment. Whether you dress it up or keep it understated, the Premium Cotton Top delivers a modern, considered look. The colorways are chosen to complement a wide range of skin tones and existing outfits, so styling it is intuitive rather than complicated.\n\nUsage Scenarios: ideally suited for casual settings throughout the summer season, this piece transitions smoothly across your day. Wear it for casual outings, weekend plans, travel, gatherings with friends, or relaxed time at home. Its adaptable design means it works across your existing wardrobe with minimal effort, quickly becoming a reliable go-to you will reach for again and again — versatile enough to earn its place season after season.\n\nCare Instructions: to keep the Premium Cotton Top looking its best, machine wash cold with similar colors on a gentle cycle. Do not bleach, and avoid harsh detergents that can dull the finish. Tumble dry on low or line dry in shade to protect the fibers, and warm iron on the reverse if needed. Avoid wringing to preserve the fabric structure and shape. With this simple care routine, your piece will stay fresh, soft and vibrant wash after wash — a smart, long-lasting investment in your everyday style.",
    "features": [
      "Premium Soft fabric",
      "Breathable, skin-friendly material",
      "Fade-resistant color retention",
      "Soft-touch finish for all-day comfort",
      "Lightweight, easy-to-wear construction",
      "Regular Fit for a flattering silhouette",
      "Reinforced stitching for durability"
    ],
    "specifications": {
      "Material": "Soft Cotton Poplin",
      "Fit Type": "Regular Fit",
      "Sleeve Type": "Puff Sleeve",
      "Neck Type": "Square Neck",
      "Pattern": "Solid",
      "Occasion": "Casual",
      "Season": "Summer",
      "Gender": "Women",
      "Country of Origin": "Bangladesh"
    },
    "sizeGuide": [
      {
        "size": "XS",
        "chest": "34",
        "waist": "28",
        "length": "66",
        "shoulder": "40"
      },
      {
        "size": "S",
        "chest": "36",
        "waist": "30",
        "length": "68",
        "shoulder": "42"
      },
      {
        "size": "M",
        "chest": "38",
        "waist": "32",
        "length": "70",
        "shoulder": "44"
      },
      {
        "size": "L",
        "chest": "40",
        "waist": "34",
        "length": "72",
        "shoulder": "46"
      },
      {
        "size": "XL",
        "chest": "42",
        "waist": "36",
        "length": "74",
        "shoulder": "48"
      },
      {
        "size": "XXL",
        "chest": "44",
        "waist": "38",
        "length": "76",
        "shoulder": "50"
      }
    ],
    "reviews": [
      {
        "name": "Naimur Rashid",
        "rating": 4,
        "text": "The material breathes really well, perfect for our weather. Highly recommend.",
        "date": "2025-11-17"
      },
      {
        "name": "Jannatul Ferdous",
        "rating": 5,
        "text": "Looks even better in person. Got compliments the first time I wore it.",
        "date": "2025-11-08"
      },
      {
        "name": "Asif Mahmud",
        "rating": 4,
        "text": "True to size and holds up well after multiple washes. Very happy.",
        "date": "2025-10-30"
      },
      {
        "name": "Priya Das",
        "rating": 5,
        "text": "Premium feel without the premium markup. Will buy again from this brand.",
        "date": "2025-10-21"
      },
      {
        "name": "Sabbir Ahmed",
        "rating": 3,
        "text": "Happy with it, just wish there were a few more color options.",
        "date": "2025-10-12"
      },
      {
        "name": "Rifat Karim",
        "rating": 5,
        "text": "Fantastic everyday piece — versatile, stylish and easy to care for.",
        "date": "2025-10-03"
      },
      {
        "name": "Mehnaz Haque",
        "rating": 4,
        "text": "Absolutely love the quality, the fabric feels premium and the fit is spot on.",
        "date": "2025-09-24"
      }
    ],
    "relatedIds": [
      "prod-017",
      "prod-018",
      "prod-019",
      "prod-020"
    ],
    "frequentlyBoughtTogetherIds": [
      "prod-018",
      "prod-019"
    ],
    "customersAlsoBoughtIds": [
      "prod-027",
      "prod-028",
      "prod-029",
      "prod-030"
    ]
  },
  {
    "id": "prod-016",
    "slug": "elegant-salwar-kameez-women",
    "name": "Elegant Salwar Kameez",
    "sku": "WM-0016",
    "category": "Women",
    "subcategory": "Salwar Kameez",
    "brand": "Élan Studio",
    "price": 3290,
    "comparePrice": 4490,
    "discountPercent": 27,
    "rating": 4.5,
    "reviewCount": 903,
    "stock": 21,
    "images": [
      "https://picsum.photos/seed/elegant-salwar-kameez-women-front/700/933",
      "https://picsum.photos/seed/elegant-salwar-kameez-women-back/700/933",
      "https://picsum.photos/seed/elegant-salwar-kameez-women-life/700/933",
      "https://picsum.photos/seed/elegant-salwar-kameez-women-model/700/933"
    ],
    "imageRoles": {
      "front": "https://picsum.photos/seed/elegant-salwar-kameez-women-front/700/933",
      "back": "https://picsum.photos/seed/elegant-salwar-kameez-women-back/700/933",
      "lifestyle": "https://picsum.photos/seed/elegant-salwar-kameez-women-life/700/933",
      "model": "https://picsum.photos/seed/elegant-salwar-kameez-women-model/700/933"
    },
    "colors": [
      {
        "name": "Black",
        "hex": "#1c1c1c"
      },
      {
        "name": "Charcoal",
        "hex": "#3a3a3a"
      },
      {
        "name": "Sky Blue",
        "hex": "#9fc3e0"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "seo": {
      "title": "Elegant Salwar Kameez for Women – Elegant Everyday Style",
      "slug": "elegant-salwar-kameez-women",
      "metaTitle": "Elegant Salwar Kameez | Buy Online",
      "metaDescription": "Shop the Elegant Salwar Kameez in Georgette with Inner Lining. Semi-Fitted, embroidered design for festive. Now 27% off with fast delivery. Free returns.",
      "keywords": [
        "elegant salwar kameez",
        "women salwar kameez",
        "embroidered salwar kameez",
        "buy elegant salwar kameez online",
        "festive wear",
        "premium salwar kameez"
      ]
    },
    "shortDescription": "The Elegant Salwar Kameez blends georgette with inner lining with a semi-fitted for effortless comfort. Featuring a embroidered design and boat neck neckline, it's tailored for festive moments throughout the all season season. A versatile wardrobe staple that pairs easily and wears beautifully day after day.",
    "longDescription": "Meet the Elegant Salwar Kameez — a thoughtfully designed salwar kameez that brings together premium materials and a refined fit. Crafted from Georgette with Inner Lining, it is built to feel as good as it looks. The fabric is carefully selected for its soft hand-feel, resilience and natural drape, giving you a piece that holds its shape and color through repeated wear. Every detail — from the boat neck to the precision-finished seams and durable trims — reflects a genuine commitment to premium craftsmanship that you can see and feel.\n\nFabric & Comfort: Georgette with Inner Lining offers a balance of softness and structure that sits comfortably against the skin. The weave is breathable and gentle, helping regulate temperature so you stay fresh through busy days. The semi-fitted allows a natural range of movement without feeling restrictive, while careful tailoring ensures a clean, flattering line. The full sleeve cut adds balance to the overall silhouette, making this an easy choice when you want to look put-together without compromising on ease or all-day wearability.\n\nStyle Benefits: the embroidered aesthetic makes this a genuinely versatile addition to any wardrobe. It layers effortlessly, mixes with both relaxed and elevated pieces, and adapts to your mood and the moment. Whether you dress it up or keep it understated, the Elegant Salwar Kameez delivers a modern, considered look. The colorways are chosen to complement a wide range of skin tones and existing outfits, so styling it is intuitive rather than complicated.\n\nUsage Scenarios: ideally suited for festive settings throughout the all season season, this piece transitions smoothly across your day. Wear it for casual outings, weekend plans, travel, gatherings with friends, or relaxed time at home. Its adaptable design means it works across your existing wardrobe with minimal effort, quickly becoming a reliable go-to you will reach for again and again — versatile enough to earn its place season after season.\n\nCare Instructions: to keep the Elegant Salwar Kameez looking its best, machine wash cold with similar colors on a gentle cycle. Do not bleach, and avoid harsh detergents that can dull the finish. Tumble dry on low or line dry in shade to protect the fibers, and warm iron on the reverse if needed. Avoid wringing to preserve the fabric structure and shape. With this simple care routine, your piece will stay fresh, soft and vibrant wash after wash — a smart, long-lasting investment in your everyday style.",
    "features": [
      "Premium Georgette fabric",
      "Breathable, skin-friendly material",
      "Fade-resistant color retention",
      "Soft-touch finish for all-day comfort",
      "Lightweight, easy-to-wear construction",
      "Semi-Fitted for a flattering silhouette",
      "Reinforced stitching for durability"
    ],
    "specifications": {
      "Material": "Georgette with Inner Lining",
      "Fit Type": "Semi-Fitted",
      "Sleeve Type": "Full Sleeve",
      "Neck Type": "Boat Neck",
      "Pattern": "Embroidered",
      "Occasion": "Festive",
      "Season": "All Season",
      "Gender": "Women",
      "Country of Origin": "Bangladesh"
    },
    "sizeGuide": [
      {
        "size": "XS",
        "chest": "34",
        "waist": "28",
        "length": "66",
        "shoulder": "40"
      },
      {
        "size": "S",
        "chest": "36",
        "waist": "30",
        "length": "68",
        "shoulder": "42"
      },
      {
        "size": "M",
        "chest": "38",
        "waist": "32",
        "length": "70",
        "shoulder": "44"
      },
      {
        "size": "L",
        "chest": "40",
        "waist": "34",
        "length": "72",
        "shoulder": "46"
      },
      {
        "size": "XL",
        "chest": "42",
        "waist": "36",
        "length": "74",
        "shoulder": "48"
      },
      {
        "size": "XXL",
        "chest": "44",
        "waist": "38",
        "length": "76",
        "shoulder": "50"
      }
    ],
    "reviews": [
      {
        "name": "Jannatul Ferdous",
        "rating": 5,
        "text": "Looks even better in person. Got compliments the first time I wore it.",
        "date": "2025-11-16"
      },
      {
        "name": "Asif Mahmud",
        "rating": 4,
        "text": "True to size and holds up well after multiple washes. Very happy.",
        "date": "2025-11-07"
      },
      {
        "name": "Priya Das",
        "rating": 5,
        "text": "Premium feel without the premium markup. Will buy again from this brand.",
        "date": "2025-10-29"
      },
      {
        "name": "Sabbir Ahmed",
        "rating": 4,
        "text": "Soft, lightweight and well finished. Exactly what I was looking for.",
        "date": "2025-10-20"
      },
      {
        "name": "Rifat Karim",
        "rating": 3,
        "text": "Decent fabric for the price, the fit runs a touch slim.",
        "date": "2025-10-11"
      },
      {
        "name": "Mehnaz Haque",
        "rating": 4,
        "text": "Absolutely love the quality, the fabric feels premium and the fit is spot on.",
        "date": "2025-10-02"
      },
      {
        "name": "Tahmid Islam",
        "rating": 5,
        "text": "Exceeded my expectations — stitching is clean and the color is exactly as shown.",
        "date": "2025-09-23"
      },
      {
        "name": "Anika Tabassum",
        "rating": 4,
        "text": "Super comfortable for all-day wear, I've already ordered a second one.",
        "date": "2025-09-14"
      }
    ],
    "relatedIds": [
      "prod-018",
      "prod-019",
      "prod-020",
      "prod-021"
    ],
    "frequentlyBoughtTogetherIds": [
      "prod-019",
      "prod-020"
    ],
    "customersAlsoBoughtIds": [
      "prod-028",
      "prod-029",
      "prod-030",
      "prod-031"
    ]
  },
  {
    "id": "prod-017",
    "slug": "casual-tunic-women",
    "name": "Casual Tunic",
    "sku": "WM-0017",
    "category": "Women",
    "subcategory": "Tunics",
    "brand": "Élan Studio",
    "price": 1490,
    "comparePrice": 1990,
    "discountPercent": 25,
    "rating": 4.8,
    "reviewCount": 960,
    "stock": 34,
    "images": [
      "https://picsum.photos/seed/casual-tunic-women-front/700/933",
      "https://picsum.photos/seed/casual-tunic-women-back/700/933",
      "https://picsum.photos/seed/casual-tunic-women-life/700/933",
      "https://picsum.photos/seed/casual-tunic-women-model/700/933"
    ],
    "imageRoles": {
      "front": "https://picsum.photos/seed/casual-tunic-women-front/700/933",
      "back": "https://picsum.photos/seed/casual-tunic-women-back/700/933",
      "lifestyle": "https://picsum.photos/seed/casual-tunic-women-life/700/933",
      "model": "https://picsum.photos/seed/casual-tunic-women-model/700/933"
    },
    "colors": [
      {
        "name": "White",
        "hex": "#f5f5f5"
      },
      {
        "name": "Olive",
        "hex": "#5b5a3a"
      },
      {
        "name": "Mustard",
        "hex": "#d6a531"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "seo": {
      "title": "Casual Tunic for Women – Elegant Everyday Style",
      "slug": "casual-tunic-women",
      "metaTitle": "Casual Tunic | Buy Online",
      "metaDescription": "Shop the Casual Tunic in Viscose Crepe. Straight Fit, printed design for workwear. Now 25% off with fast delivery. Free returns. Free returns. Free returns.",
      "keywords": [
        "casual tunic",
        "women tunics",
        "printed tunics",
        "buy casual tunic online",
        "workwear wear",
        "premium tunics"
      ]
    },
    "shortDescription": "The Casual Tunic blends viscose crepe with a straight fit for effortless comfort. Featuring a printed design and keyhole neck neckline, it's tailored for workwear moments throughout the all season season. A versatile wardrobe staple that pairs easily and wears beautifully day after day.",
    "longDescription": "Meet the Casual Tunic — a thoughtfully designed tunics that brings together premium materials and a refined fit. Crafted from Viscose Crepe, it is built to feel as good as it looks. The fabric is carefully selected for its soft hand-feel, resilience and natural drape, giving you a piece that holds its shape and color through repeated wear. Every detail — from the keyhole neck to the precision-finished seams and durable trims — reflects a genuine commitment to premium craftsmanship that you can see and feel.\n\nFabric & Comfort: Viscose Crepe offers a balance of softness and structure that sits comfortably against the skin. The weave is breathable and gentle, helping regulate temperature so you stay fresh through busy days. The straight fit allows a natural range of movement without feeling restrictive, while careful tailoring ensures a clean, flattering line. The three-quarter sleeve cut adds balance to the overall silhouette, making this an easy choice when you want to look put-together without compromising on ease or all-day wearability.\n\nStyle Benefits: the printed aesthetic makes this a genuinely versatile addition to any wardrobe. It layers effortlessly, mixes with both relaxed and elevated pieces, and adapts to your mood and the moment. Whether you dress it up or keep it understated, the Casual Tunic delivers a modern, considered look. The colorways are chosen to complement a wide range of skin tones and existing outfits, so styling it is intuitive rather than complicated.\n\nUsage Scenarios: ideally suited for workwear settings throughout the all season season, this piece transitions smoothly across your day. Wear it for casual outings, weekend plans, travel, gatherings with friends, or relaxed time at home. Its adaptable design means it works across your existing wardrobe with minimal effort, quickly becoming a reliable go-to you will reach for again and again — versatile enough to earn its place season after season.\n\nCare Instructions: to keep the Casual Tunic looking its best, machine wash cold with similar colors on a gentle cycle. Do not bleach, and avoid harsh detergents that can dull the finish. Tumble dry on low or line dry in shade to protect the fibers, and warm iron on the reverse if needed. Avoid wringing to preserve the fabric structure and shape. With this simple care routine, your piece will stay fresh, soft and vibrant wash after wash — a smart, long-lasting investment in your everyday style.",
    "features": [
      "Premium Viscose fabric",
      "Breathable, skin-friendly material",
      "Fade-resistant color retention",
      "Soft-touch finish for all-day comfort",
      "Lightweight, easy-to-wear construction",
      "Straight Fit for a flattering silhouette",
      "Reinforced stitching for durability"
    ],
    "specifications": {
      "Material": "Viscose Crepe",
      "Fit Type": "Straight Fit",
      "Sleeve Type": "Three-Quarter Sleeve",
      "Neck Type": "Keyhole Neck",
      "Pattern": "Printed",
      "Occasion": "Workwear",
      "Season": "All Season",
      "Gender": "Women",
      "Country of Origin": "Bangladesh"
    },
    "sizeGuide": [
      {
        "size": "XS",
        "chest": "34",
        "waist": "28",
        "length": "66",
        "shoulder": "40"
      },
      {
        "size": "S",
        "chest": "36",
        "waist": "30",
        "length": "68",
        "shoulder": "42"
      },
      {
        "size": "M",
        "chest": "38",
        "waist": "32",
        "length": "70",
        "shoulder": "44"
      },
      {
        "size": "L",
        "chest": "40",
        "waist": "34",
        "length": "72",
        "shoulder": "46"
      },
      {
        "size": "XL",
        "chest": "42",
        "waist": "36",
        "length": "74",
        "shoulder": "48"
      },
      {
        "size": "XXL",
        "chest": "44",
        "waist": "38",
        "length": "76",
        "shoulder": "50"
      }
    ],
    "reviews": [
      {
        "name": "Asif Mahmud",
        "rating": 4,
        "text": "True to size and holds up well after multiple washes. Very happy.",
        "date": "2025-11-15"
      },
      {
        "name": "Priya Das",
        "rating": 5,
        "text": "Premium feel without the premium markup. Will buy again from this brand.",
        "date": "2025-11-06"
      },
      {
        "name": "Sabbir Ahmed",
        "rating": 4,
        "text": "Soft, lightweight and well finished. Exactly what I was looking for.",
        "date": "2025-10-28"
      },
      {
        "name": "Rifat Karim",
        "rating": 5,
        "text": "Fantastic everyday piece — versatile, stylish and easy to care for.",
        "date": "2025-10-19"
      },
      {
        "name": "Mehnaz Haque",
        "rating": 3,
        "text": "Good product overall, though I'd suggest sizing up for a relaxed fit.",
        "date": "2025-10-10"
      },
      {
        "name": "Tahmid Islam",
        "rating": 5,
        "text": "Exceeded my expectations — stitching is clean and the color is exactly as shown.",
        "date": "2025-10-01"
      },
      {
        "name": "Anika Tabassum",
        "rating": 4,
        "text": "Super comfortable for all-day wear, I've already ordered a second one.",
        "date": "2025-09-22"
      },
      {
        "name": "Shuvo Roy",
        "rating": 5,
        "text": "Great value for the price. Delivery was fast and packaging was neat.",
        "date": "2025-09-13"
      },
      {
        "name": "Faria Noor",
        "rating": 4,
        "text": "The material breathes really well, perfect for our weather. Highly recommend.",
        "date": "2025-09-04"
      }
    ],
    "relatedIds": [
      "prod-019",
      "prod-020",
      "prod-021",
      "prod-022"
    ],
    "frequentlyBoughtTogetherIds": [
      "prod-020",
      "prod-021"
    ],
    "customersAlsoBoughtIds": [
      "prod-029",
      "prod-030",
      "prod-031",
      "prod-032"
    ]
  },
  {
    "id": "prod-018",
    "slug": "long-sleeve-t-shirt-women",
    "name": "Long Sleeve T-Shirt",
    "sku": "WM-0018",
    "category": "Women",
    "subcategory": "T-Shirts",
    "brand": "Élan Studio",
    "price": 890,
    "comparePrice": 1290,
    "discountPercent": 31,
    "rating": 4.1,
    "reviewCount": 97,
    "stock": 47,
    "images": [
      "https://picsum.photos/seed/long-sleeve-t-shirt-women-front/700/933",
      "https://picsum.photos/seed/long-sleeve-t-shirt-women-back/700/933",
      "https://picsum.photos/seed/long-sleeve-t-shirt-women-life/700/933",
      "https://picsum.photos/seed/long-sleeve-t-shirt-women-model/700/933"
    ],
    "imageRoles": {
      "front": "https://picsum.photos/seed/long-sleeve-t-shirt-women-front/700/933",
      "back": "https://picsum.photos/seed/long-sleeve-t-shirt-women-back/700/933",
      "lifestyle": "https://picsum.photos/seed/long-sleeve-t-shirt-women-life/700/933",
      "model": "https://picsum.photos/seed/long-sleeve-t-shirt-women-model/700/933"
    },
    "colors": [
      {
        "name": "Navy",
        "hex": "#1f2a44"
      },
      {
        "name": "Maroon",
        "hex": "#6e1f2b"
      },
      {
        "name": "Teal",
        "hex": "#1f6f6b"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "seo": {
      "title": "Long Sleeve T-Shirt for Women – Elegant Everyday Style",
      "slug": "long-sleeve-t-shirt-women",
      "metaTitle": "Long Sleeve T-Shirt | Buy Online",
      "metaDescription": "Shop the Long Sleeve T-Shirt in Cotton Modal Blend. Slim Fit, solid design for everyday. Now 31% off with fast delivery. Free returns. Free returns. Free return",
      "keywords": [
        "long sleeve t-shirt",
        "women t-shirts",
        "solid t-shirts",
        "buy long sleeve t-shirt online",
        "everyday wear",
        "premium t-shirts"
      ]
    },
    "shortDescription": "The Long Sleeve T-Shirt blends cotton modal blend with a slim fit for effortless comfort. Featuring a solid design and crew neck neckline, it's tailored for everyday moments throughout the winter season. A versatile wardrobe staple that pairs easily and wears beautifully day after day.",
    "longDescription": "Meet the Long Sleeve T-Shirt — a thoughtfully designed t-shirts that brings together premium materials and a refined fit. Crafted from Cotton Modal Blend, it is built to feel as good as it looks. The fabric is carefully selected for its soft hand-feel, resilience and natural drape, giving you a piece that holds its shape and color through repeated wear. Every detail — from the crew neck to the precision-finished seams and durable trims — reflects a genuine commitment to premium craftsmanship that you can see and feel.\n\nFabric & Comfort: Cotton Modal Blend offers a balance of softness and structure that sits comfortably against the skin. The weave is breathable and gentle, helping regulate temperature so you stay fresh through busy days. The slim fit allows a natural range of movement without feeling restrictive, while careful tailoring ensures a clean, flattering line. The long sleeve cut adds balance to the overall silhouette, making this an easy choice when you want to look put-together without compromising on ease or all-day wearability.\n\nStyle Benefits: the solid aesthetic makes this a genuinely versatile addition to any wardrobe. It layers effortlessly, mixes with both relaxed and elevated pieces, and adapts to your mood and the moment. Whether you dress it up or keep it understated, the Long Sleeve T-Shirt delivers a modern, considered look. The colorways are chosen to complement a wide range of skin tones and existing outfits, so styling it is intuitive rather than complicated.\n\nUsage Scenarios: ideally suited for everyday settings throughout the winter season, this piece transitions smoothly across your day. Wear it for casual outings, weekend plans, travel, gatherings with friends, or relaxed time at home. Its adaptable design means it works across your existing wardrobe with minimal effort, quickly becoming a reliable go-to you will reach for again and again — versatile enough to earn its place season after season.\n\nCare Instructions: to keep the Long Sleeve T-Shirt looking its best, machine wash cold with similar colors on a gentle cycle. Do not bleach, and avoid harsh detergents that can dull the finish. Tumble dry on low or line dry in shade to protect the fibers, and warm iron on the reverse if needed. Avoid wringing to preserve the fabric structure and shape. With this simple care routine, your piece will stay fresh, soft and vibrant wash after wash — a smart, long-lasting investment in your everyday style.",
    "features": [
      "Premium Cotton fabric",
      "Breathable, skin-friendly material",
      "Fade-resistant color retention",
      "Soft-touch finish for all-day comfort",
      "Lightweight, easy-to-wear construction",
      "Slim Fit for a flattering silhouette",
      "Reinforced stitching for durability"
    ],
    "specifications": {
      "Material": "Cotton Modal Blend",
      "Fit Type": "Slim Fit",
      "Sleeve Type": "Long Sleeve",
      "Neck Type": "Crew Neck",
      "Pattern": "Solid",
      "Occasion": "Everyday",
      "Season": "Winter",
      "Gender": "Women",
      "Country of Origin": "Bangladesh"
    },
    "sizeGuide": [
      {
        "size": "XS",
        "chest": "34",
        "waist": "28",
        "length": "66",
        "shoulder": "40"
      },
      {
        "size": "S",
        "chest": "36",
        "waist": "30",
        "length": "68",
        "shoulder": "42"
      },
      {
        "size": "M",
        "chest": "38",
        "waist": "32",
        "length": "70",
        "shoulder": "44"
      },
      {
        "size": "L",
        "chest": "40",
        "waist": "34",
        "length": "72",
        "shoulder": "46"
      },
      {
        "size": "XL",
        "chest": "42",
        "waist": "36",
        "length": "74",
        "shoulder": "48"
      },
      {
        "size": "XXL",
        "chest": "44",
        "waist": "38",
        "length": "76",
        "shoulder": "50"
      }
    ],
    "reviews": [
      {
        "name": "Priya Das",
        "rating": 5,
        "text": "Premium feel without the premium markup. Will buy again from this brand.",
        "date": "2025-11-14"
      },
      {
        "name": "Sabbir Ahmed",
        "rating": 4,
        "text": "Soft, lightweight and well finished. Exactly what I was looking for.",
        "date": "2025-11-05"
      },
      {
        "name": "Rifat Karim",
        "rating": 5,
        "text": "Fantastic everyday piece — versatile, stylish and easy to care for.",
        "date": "2025-10-27"
      },
      {
        "name": "Mehnaz Haque",
        "rating": 4,
        "text": "Absolutely love the quality, the fabric feels premium and the fit is spot on.",
        "date": "2025-10-18"
      },
      {
        "name": "Tahmid Islam",
        "rating": 3,
        "text": "Nice quality but the color is slightly darker than the picture.",
        "date": "2025-10-09"
      },
      {
        "name": "Anika Tabassum",
        "rating": 4,
        "text": "Super comfortable for all-day wear, I've already ordered a second one.",
        "date": "2025-09-30"
      },
      {
        "name": "Shuvo Roy",
        "rating": 5,
        "text": "Great value for the price. Delivery was fast and packaging was neat.",
        "date": "2025-09-21"
      },
      {
        "name": "Faria Noor",
        "rating": 4,
        "text": "The material breathes really well, perfect for our weather. Highly recommend.",
        "date": "2025-09-12"
      },
      {
        "name": "Zubair Hossain",
        "rating": 5,
        "text": "Looks even better in person. Got compliments the first time I wore it.",
        "date": "2025-09-03"
      },
      {
        "name": "Nadia Sultana",
        "rating": 4,
        "text": "Nice quality but the color is slightly darker than the picture.",
        "date": "2025-08-25"
      }
    ],
    "relatedIds": [
      "prod-020",
      "prod-021",
      "prod-022",
      "prod-023"
    ],
    "frequentlyBoughtTogetherIds": [
      "prod-021",
      "prod-022"
    ],
    "customersAlsoBoughtIds": [
      "prod-030",
      "prod-031",
      "prod-032",
      "prod-033"
    ]
  },
  {
    "id": "prod-019",
    "slug": "flowy-maxi-dress-women",
    "name": "Flowy Maxi Dress",
    "sku": "WM-0019",
    "category": "Women",
    "subcategory": "Dresses",
    "brand": "Élan Studio",
    "price": 2690,
    "comparePrice": 3690,
    "discountPercent": 27,
    "rating": 4.4,
    "reviewCount": 154,
    "stock": 0,
    "images": [
      "https://picsum.photos/seed/flowy-maxi-dress-women-front/700/933",
      "https://picsum.photos/seed/flowy-maxi-dress-women-back/700/933",
      "https://picsum.photos/seed/flowy-maxi-dress-women-life/700/933",
      "https://picsum.photos/seed/flowy-maxi-dress-women-model/700/933"
    ],
    "imageRoles": {
      "front": "https://picsum.photos/seed/flowy-maxi-dress-women-front/700/933",
      "back": "https://picsum.photos/seed/flowy-maxi-dress-women-back/700/933",
      "lifestyle": "https://picsum.photos/seed/flowy-maxi-dress-women-life/700/933",
      "model": "https://picsum.photos/seed/flowy-maxi-dress-women-model/700/933"
    },
    "colors": [
      {
        "name": "Charcoal",
        "hex": "#3a3a3a"
      },
      {
        "name": "Beige",
        "hex": "#d8c7a8"
      },
      {
        "name": "Coral",
        "hex": "#e8836b"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "seo": {
      "title": "Flowy Maxi Dress for Women – Elegant Everyday Style",
      "slug": "flowy-maxi-dress-women",
      "metaTitle": "Flowy Maxi Dress | Buy Online",
      "metaDescription": "Shop the Flowy Maxi Dress in Chiffon Georgette. Flowy Fit, floral print design for party. Now 27% off with fast delivery. Free returns. Free returns. Free retur",
      "keywords": [
        "flowy maxi dress",
        "women dresses",
        "floral print dresses",
        "buy flowy maxi dress online",
        "party wear",
        "premium dresses"
      ]
    },
    "shortDescription": "The Flowy Maxi Dress blends chiffon georgette with a flowy fit for effortless comfort. Featuring a floral print design and halter neck neckline, it's tailored for party moments throughout the summer season. A versatile wardrobe staple that pairs easily and wears beautifully day after day.",
    "longDescription": "Meet the Flowy Maxi Dress — a thoughtfully designed dresses that brings together premium materials and a refined fit. Crafted from Chiffon Georgette, it is built to feel as good as it looks. The fabric is carefully selected for its soft hand-feel, resilience and natural drape, giving you a piece that holds its shape and color through repeated wear. Every detail — from the halter neck to the precision-finished seams and durable trims — reflects a genuine commitment to premium craftsmanship that you can see and feel.\n\nFabric & Comfort: Chiffon Georgette offers a balance of softness and structure that sits comfortably against the skin. The weave is breathable and gentle, helping regulate temperature so you stay fresh through busy days. The flowy fit allows a natural range of movement without feeling restrictive, while careful tailoring ensures a clean, flattering line. The sleeveless cut adds balance to the overall silhouette, making this an easy choice when you want to look put-together without compromising on ease or all-day wearability.\n\nStyle Benefits: the floral print aesthetic makes this a genuinely versatile addition to any wardrobe. It layers effortlessly, mixes with both relaxed and elevated pieces, and adapts to your mood and the moment. Whether you dress it up or keep it understated, the Flowy Maxi Dress delivers a modern, considered look. The colorways are chosen to complement a wide range of skin tones and existing outfits, so styling it is intuitive rather than complicated.\n\nUsage Scenarios: ideally suited for party settings throughout the summer season, this piece transitions smoothly across your day. Wear it for casual outings, weekend plans, travel, gatherings with friends, or relaxed time at home. Its adaptable design means it works across your existing wardrobe with minimal effort, quickly becoming a reliable go-to you will reach for again and again — versatile enough to earn its place season after season.\n\nCare Instructions: to keep the Flowy Maxi Dress looking its best, machine wash cold with similar colors on a gentle cycle. Do not bleach, and avoid harsh detergents that can dull the finish. Tumble dry on low or line dry in shade to protect the fibers, and warm iron on the reverse if needed. Avoid wringing to preserve the fabric structure and shape. With this simple care routine, your piece will stay fresh, soft and vibrant wash after wash — a smart, long-lasting investment in your everyday style.",
    "features": [
      "Premium Chiffon fabric",
      "Breathable, skin-friendly material",
      "Fade-resistant color retention",
      "Soft-touch finish for all-day comfort",
      "Lightweight, easy-to-wear construction",
      "Flowy Fit for a flattering silhouette",
      "Reinforced stitching for durability"
    ],
    "specifications": {
      "Material": "Chiffon Georgette",
      "Fit Type": "Flowy Fit",
      "Sleeve Type": "Sleeveless",
      "Neck Type": "Halter Neck",
      "Pattern": "Floral Print",
      "Occasion": "Party",
      "Season": "Summer",
      "Gender": "Women",
      "Country of Origin": "Bangladesh"
    },
    "sizeGuide": [
      {
        "size": "XS",
        "chest": "34",
        "waist": "28",
        "length": "66",
        "shoulder": "40"
      },
      {
        "size": "S",
        "chest": "36",
        "waist": "30",
        "length": "68",
        "shoulder": "42"
      },
      {
        "size": "M",
        "chest": "38",
        "waist": "32",
        "length": "70",
        "shoulder": "44"
      },
      {
        "size": "L",
        "chest": "40",
        "waist": "34",
        "length": "72",
        "shoulder": "46"
      },
      {
        "size": "XL",
        "chest": "42",
        "waist": "36",
        "length": "74",
        "shoulder": "48"
      },
      {
        "size": "XXL",
        "chest": "44",
        "waist": "38",
        "length": "76",
        "shoulder": "50"
      }
    ],
    "reviews": [
      {
        "name": "Sabbir Ahmed",
        "rating": 4,
        "text": "Soft, lightweight and well finished. Exactly what I was looking for.",
        "date": "2025-11-13"
      },
      {
        "name": "Rifat Karim",
        "rating": 5,
        "text": "Fantastic everyday piece — versatile, stylish and easy to care for.",
        "date": "2025-11-04"
      },
      {
        "name": "Mehnaz Haque",
        "rating": 4,
        "text": "Absolutely love the quality, the fabric feels premium and the fit is spot on.",
        "date": "2025-10-26"
      },
      {
        "name": "Tahmid Islam",
        "rating": 5,
        "text": "Exceeded my expectations — stitching is clean and the color is exactly as shown.",
        "date": "2025-10-17"
      },
      {
        "name": "Anika Tabassum",
        "rating": 3,
        "text": "Comfortable and well made, delivery took a little longer than expected.",
        "date": "2025-10-08"
      }
    ],
    "relatedIds": [
      "prod-021",
      "prod-022",
      "prod-023",
      "prod-024"
    ],
    "frequentlyBoughtTogetherIds": [
      "prod-022",
      "prod-023"
    ],
    "customersAlsoBoughtIds": [
      "prod-031",
      "prod-032",
      "prod-033",
      "prod-034"
    ]
  },
  {
    "id": "prod-020",
    "slug": "high-waist-palazzo-pants-women",
    "name": "High-Waist Palazzo Pants",
    "sku": "WM-0020",
    "category": "Women",
    "subcategory": "Bottoms",
    "brand": "Élan Studio",
    "price": 1190,
    "comparePrice": 1690,
    "discountPercent": 30,
    "rating": 4.7,
    "reviewCount": 211,
    "stock": 73,
    "images": [
      "https://picsum.photos/seed/high-waist-palazzo-pants-women-front/700/933",
      "https://picsum.photos/seed/high-waist-palazzo-pants-women-back/700/933",
      "https://picsum.photos/seed/high-waist-palazzo-pants-women-life/700/933",
      "https://picsum.photos/seed/high-waist-palazzo-pants-women-model/700/933"
    ],
    "imageRoles": {
      "front": "https://picsum.photos/seed/high-waist-palazzo-pants-women-front/700/933",
      "back": "https://picsum.photos/seed/high-waist-palazzo-pants-women-back/700/933",
      "lifestyle": "https://picsum.photos/seed/high-waist-palazzo-pants-women-life/700/933",
      "model": "https://picsum.photos/seed/high-waist-palazzo-pants-women-model/700/933"
    },
    "colors": [
      {
        "name": "Olive",
        "hex": "#5b5a3a"
      },
      {
        "name": "Sky Blue",
        "hex": "#9fc3e0"
      },
      {
        "name": "Blush Pink",
        "hex": "#e8b5bf"
      }
    ],
    "sizes": [
      "28",
      "30",
      "32",
      "34",
      "36",
      "38"
    ],
    "seo": {
      "title": "High-Waist Palazzo Pants for Women – Elegant Everyday Style",
      "slug": "high-waist-palazzo-pants-women",
      "metaTitle": "High-Waist Palazzo Pants | Buy Online",
      "metaDescription": "Shop the High-Waist Palazzo Pants in Rayon Crepe. Wide Leg, solid design for casual. Now 30% off with fast delivery. Free returns. Free returns. Free returns.",
      "keywords": [
        "high-waist palazzo pants",
        "women bottoms",
        "solid bottoms",
        "buy high-waist palazzo pants online",
        "casual wear",
        "premium bottoms"
      ]
    },
    "shortDescription": "The High-Waist Palazzo Pants blends rayon crepe with a wide leg for effortless comfort. Featuring a solid design and it's tailored for casual moments throughout the summer season. A versatile wardrobe staple that pairs easily and wears beautifully day after day.",
    "longDescription": "Meet the High-Waist Palazzo Pants — a thoughtfully designed bottoms that brings together premium materials and a refined fit. Crafted from Rayon Crepe, it is built to feel as good as it looks. The fabric is carefully selected for its soft hand-feel, resilience and natural drape, giving you a piece that holds its shape and color through repeated wear. Every detail — from the clean construction to the precision-finished seams and durable trims — reflects a genuine commitment to premium craftsmanship that you can see and feel.\n\nFabric & Comfort: Rayon Crepe offers a balance of softness and structure that sits comfortably against the skin. The weave is breathable and gentle, helping regulate temperature so you stay fresh through busy days. The wide leg allows a natural range of movement without feeling restrictive, while careful tailoring ensures a clean, flattering line. making this an easy choice when you want to look put-together without compromising on ease or all-day wearability.\n\nStyle Benefits: the solid aesthetic makes this a genuinely versatile addition to any wardrobe. It layers effortlessly, mixes with both relaxed and elevated pieces, and adapts to your mood and the moment. Whether you dress it up or keep it understated, the High-Waist Palazzo Pants delivers a modern, considered look. The colorways are chosen to complement a wide range of skin tones and existing outfits, so styling it is intuitive rather than complicated.\n\nUsage Scenarios: ideally suited for casual settings throughout the summer season, this piece transitions smoothly across your day. Wear it for casual outings, weekend plans, travel, gatherings with friends, or relaxed time at home. Its adaptable design means it works across your existing wardrobe with minimal effort, quickly becoming a reliable go-to you will reach for again and again — versatile enough to earn its place season after season.\n\nCare Instructions: to keep the High-Waist Palazzo Pants looking its best, machine wash cold with similar colors on a gentle cycle. Do not bleach, and avoid harsh detergents that can dull the finish. Tumble dry on low or line dry in shade to protect the fibers, and warm iron on the reverse if needed. Avoid wringing to preserve the fabric structure and shape. With this simple care routine, your piece will stay fresh, soft and vibrant wash after wash — a smart, long-lasting investment in your everyday style.",
    "features": [
      "Premium Rayon fabric",
      "Breathable, skin-friendly material",
      "Fade-resistant color retention",
      "Soft-touch finish for all-day comfort",
      "Lightweight, easy-to-wear construction",
      "Wide Leg for a flattering silhouette",
      "Reinforced stitching for durability"
    ],
    "specifications": {
      "Material": "Rayon Crepe",
      "Fit Type": "Wide Leg",
      "Sleeve Type": "N/A",
      "Neck Type": "N/A",
      "Pattern": "Solid",
      "Occasion": "Casual",
      "Season": "Summer",
      "Gender": "Women",
      "Country of Origin": "Bangladesh"
    },
    "sizeGuide": [
      {
        "size": "28",
        "waist": "28",
        "hip": "36",
        "inseam": "78",
        "length": "104"
      },
      {
        "size": "30",
        "waist": "30",
        "hip": "38",
        "inseam": "78",
        "length": "104"
      },
      {
        "size": "32",
        "waist": "32",
        "hip": "40",
        "inseam": "78",
        "length": "104"
      },
      {
        "size": "34",
        "waist": "34",
        "hip": "42",
        "inseam": "78",
        "length": "104"
      },
      {
        "size": "36",
        "waist": "36",
        "hip": "44",
        "inseam": "78",
        "length": "104"
      },
      {
        "size": "38",
        "waist": "38",
        "hip": "46",
        "inseam": "78",
        "length": "104"
      }
    ],
    "reviews": [
      {
        "name": "Rifat Karim",
        "rating": 5,
        "text": "Fantastic everyday piece — versatile, stylish and easy to care for.",
        "date": "2025-11-12"
      },
      {
        "name": "Mehnaz Haque",
        "rating": 4,
        "text": "Absolutely love the quality, the fabric feels premium and the fit is spot on.",
        "date": "2025-11-03"
      },
      {
        "name": "Tahmid Islam",
        "rating": 5,
        "text": "Exceeded my expectations — stitching is clean and the color is exactly as shown.",
        "date": "2025-10-25"
      },
      {
        "name": "Anika Tabassum",
        "rating": 4,
        "text": "Super comfortable for all-day wear, I've already ordered a second one.",
        "date": "2025-10-16"
      },
      {
        "name": "Shuvo Roy",
        "rating": 3,
        "text": "Happy with it, just wish there were a few more color options.",
        "date": "2025-10-07"
      },
      {
        "name": "Faria Noor",
        "rating": 4,
        "text": "The material breathes really well, perfect for our weather. Highly recommend.",
        "date": "2025-09-28"
      }
    ],
    "relatedIds": [
      "prod-022",
      "prod-023",
      "prod-024",
      "prod-013"
    ],
    "frequentlyBoughtTogetherIds": [
      "prod-023",
      "prod-024"
    ],
    "customersAlsoBoughtIds": [
      "prod-032",
      "prod-033",
      "prod-034",
      "prod-035"
    ]
  },
  {
    "id": "prod-021",
    "slug": "knitted-cardigan-women",
    "name": "Knitted Cardigan",
    "sku": "WM-0021",
    "category": "Women",
    "subcategory": "Knitwear",
    "brand": "Élan Studio",
    "price": 1990,
    "comparePrice": 2790,
    "discountPercent": 29,
    "rating": 4,
    "reviewCount": 268,
    "stock": 86,
    "images": [
      "https://picsum.photos/seed/knitted-cardigan-women-front/700/933",
      "https://picsum.photos/seed/knitted-cardigan-women-back/700/933",
      "https://picsum.photos/seed/knitted-cardigan-women-life/700/933",
      "https://picsum.photos/seed/knitted-cardigan-women-model/700/933"
    ],
    "imageRoles": {
      "front": "https://picsum.photos/seed/knitted-cardigan-women-front/700/933",
      "back": "https://picsum.photos/seed/knitted-cardigan-women-back/700/933",
      "lifestyle": "https://picsum.photos/seed/knitted-cardigan-women-life/700/933",
      "model": "https://picsum.photos/seed/knitted-cardigan-women-model/700/933"
    },
    "colors": [
      {
        "name": "Maroon",
        "hex": "#6e1f2b"
      },
      {
        "name": "Mustard",
        "hex": "#d6a531"
      },
      {
        "name": "Sage",
        "hex": "#9caf88"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "seo": {
      "title": "Knitted Cardigan for Women – Elegant Everyday Style",
      "slug": "knitted-cardigan-women",
      "metaTitle": "Knitted Cardigan | Buy Online",
      "metaDescription": "Shop the Knitted Cardigan in Acrylic Wool Blend Knit. Relaxed Fit, ribbed design for winter casual. Now 29% off with fast delivery. Free returns. Free returns.",
      "keywords": [
        "knitted cardigan",
        "women knitwear",
        "ribbed knitwear",
        "buy knitted cardigan online",
        "winter casual wear",
        "premium knitwear"
      ]
    },
    "shortDescription": "The Knitted Cardigan blends acrylic wool blend knit with a relaxed fit for effortless comfort. Featuring a ribbed design and shawl collar neckline, it's tailored for winter casual moments throughout the winter season. A versatile wardrobe staple that pairs easily and wears beautifully day after day.",
    "longDescription": "Meet the Knitted Cardigan — a thoughtfully designed knitwear that brings together premium materials and a refined fit. Crafted from Acrylic Wool Blend Knit, it is built to feel as good as it looks. The fabric is carefully selected for its soft hand-feel, resilience and natural drape, giving you a piece that holds its shape and color through repeated wear. Every detail — from the shawl collar to the precision-finished seams and durable trims — reflects a genuine commitment to premium craftsmanship that you can see and feel.\n\nFabric & Comfort: Acrylic Wool Blend Knit offers a balance of softness and structure that sits comfortably against the skin. The weave is breathable and gentle, helping regulate temperature so you stay fresh through busy days. The relaxed fit allows a natural range of movement without feeling restrictive, while careful tailoring ensures a clean, flattering line. The full sleeve cut adds balance to the overall silhouette, making this an easy choice when you want to look put-together without compromising on ease or all-day wearability.\n\nStyle Benefits: the ribbed aesthetic makes this a genuinely versatile addition to any wardrobe. It layers effortlessly, mixes with both relaxed and elevated pieces, and adapts to your mood and the moment. Whether you dress it up or keep it understated, the Knitted Cardigan delivers a modern, considered look. The colorways are chosen to complement a wide range of skin tones and existing outfits, so styling it is intuitive rather than complicated.\n\nUsage Scenarios: ideally suited for winter casual settings throughout the winter season, this piece transitions smoothly across your day. Wear it for casual outings, weekend plans, travel, gatherings with friends, or relaxed time at home. Its adaptable design means it works across your existing wardrobe with minimal effort, quickly becoming a reliable go-to you will reach for again and again — versatile enough to earn its place season after season.\n\nCare Instructions: to keep the Knitted Cardigan looking its best, machine wash cold with similar colors on a gentle cycle. Do not bleach, and avoid harsh detergents that can dull the finish. Tumble dry on low or line dry in shade to protect the fibers, and warm iron on the reverse if needed. Avoid wringing to preserve the fabric structure and shape. With this simple care routine, your piece will stay fresh, soft and vibrant wash after wash — a smart, long-lasting investment in your everyday style.",
    "features": [
      "Premium Acrylic fabric",
      "Breathable, skin-friendly material",
      "Fade-resistant color retention",
      "Soft-touch finish for all-day comfort",
      "Lightweight, easy-to-wear construction",
      "Relaxed Fit for a flattering silhouette",
      "Reinforced stitching for durability"
    ],
    "specifications": {
      "Material": "Acrylic Wool Blend Knit",
      "Fit Type": "Relaxed Fit",
      "Sleeve Type": "Full Sleeve",
      "Neck Type": "Shawl Collar",
      "Pattern": "Ribbed",
      "Occasion": "Winter Casual",
      "Season": "Winter",
      "Gender": "Women",
      "Country of Origin": "Bangladesh"
    },
    "sizeGuide": [
      {
        "size": "XS",
        "chest": "34",
        "waist": "28",
        "length": "66",
        "shoulder": "40"
      },
      {
        "size": "S",
        "chest": "36",
        "waist": "30",
        "length": "68",
        "shoulder": "42"
      },
      {
        "size": "M",
        "chest": "38",
        "waist": "32",
        "length": "70",
        "shoulder": "44"
      },
      {
        "size": "L",
        "chest": "40",
        "waist": "34",
        "length": "72",
        "shoulder": "46"
      },
      {
        "size": "XL",
        "chest": "42",
        "waist": "36",
        "length": "74",
        "shoulder": "48"
      },
      {
        "size": "XXL",
        "chest": "44",
        "waist": "38",
        "length": "76",
        "shoulder": "50"
      }
    ],
    "reviews": [
      {
        "name": "Mehnaz Haque",
        "rating": 4,
        "text": "Absolutely love the quality, the fabric feels premium and the fit is spot on.",
        "date": "2025-11-11"
      },
      {
        "name": "Tahmid Islam",
        "rating": 5,
        "text": "Exceeded my expectations — stitching is clean and the color is exactly as shown.",
        "date": "2025-11-02"
      },
      {
        "name": "Anika Tabassum",
        "rating": 4,
        "text": "Super comfortable for all-day wear, I've already ordered a second one.",
        "date": "2025-10-24"
      },
      {
        "name": "Shuvo Roy",
        "rating": 5,
        "text": "Great value for the price. Delivery was fast and packaging was neat.",
        "date": "2025-10-15"
      },
      {
        "name": "Faria Noor",
        "rating": 3,
        "text": "Decent fabric for the price, the fit runs a touch slim.",
        "date": "2025-10-06"
      },
      {
        "name": "Zubair Hossain",
        "rating": 5,
        "text": "Looks even better in person. Got compliments the first time I wore it.",
        "date": "2025-09-27"
      },
      {
        "name": "Nadia Sultana",
        "rating": 4,
        "text": "True to size and holds up well after multiple washes. Very happy.",
        "date": "2025-09-18"
      }
    ],
    "relatedIds": [
      "prod-023",
      "prod-024",
      "prod-013",
      "prod-014"
    ],
    "frequentlyBoughtTogetherIds": [
      "prod-024",
      "prod-013"
    ],
    "customersAlsoBoughtIds": [
      "prod-033",
      "prod-034",
      "prod-035",
      "prod-036"
    ]
  },
  {
    "id": "prod-022",
    "slug": "embroidered-anarkali-gown-women",
    "name": "Embroidered Anarkali Gown",
    "sku": "WM-0022",
    "category": "Women",
    "subcategory": "Gowns",
    "brand": "Élan Studio",
    "price": 5490,
    "comparePrice": 7490,
    "discountPercent": 27,
    "rating": 4.3,
    "reviewCount": 325,
    "stock": 99,
    "images": [
      "https://picsum.photos/seed/embroidered-anarkali-gown-women-front/700/933",
      "https://picsum.photos/seed/embroidered-anarkali-gown-women-back/700/933",
      "https://picsum.photos/seed/embroidered-anarkali-gown-women-life/700/933",
      "https://picsum.photos/seed/embroidered-anarkali-gown-women-model/700/933"
    ],
    "imageRoles": {
      "front": "https://picsum.photos/seed/embroidered-anarkali-gown-women-front/700/933",
      "back": "https://picsum.photos/seed/embroidered-anarkali-gown-women-back/700/933",
      "lifestyle": "https://picsum.photos/seed/embroidered-anarkali-gown-women-life/700/933",
      "model": "https://picsum.photos/seed/embroidered-anarkali-gown-women-model/700/933"
    },
    "colors": [
      {
        "name": "Beige",
        "hex": "#d8c7a8"
      },
      {
        "name": "Teal",
        "hex": "#1f6f6b"
      },
      {
        "name": "Rust",
        "hex": "#a8562f"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "seo": {
      "title": "Embroidered Anarkali Gown for Women – Elegant Everyday Style",
      "slug": "embroidered-anarkali-gown-women",
      "metaTitle": "Embroidered Anarkali Gown | Buy Online",
      "metaDescription": "Shop the Embroidered Anarkali Gown in Net over Satin. Flared Fit, embroidered design for wedding. Now 27% off with fast delivery. Free returns. Free returns.",
      "keywords": [
        "embroidered anarkali gown",
        "women gowns",
        "embroidered gowns",
        "buy embroidered anarkali gown online",
        "wedding wear",
        "premium gowns"
      ]
    },
    "shortDescription": "The Embroidered Anarkali Gown blends net over satin with a flared fit for effortless comfort. Featuring a embroidered design and sweetheart neck neckline, it's tailored for wedding moments throughout the all season season. A versatile wardrobe staple that pairs easily and wears beautifully day after day.",
    "longDescription": "Meet the Embroidered Anarkali Gown — a thoughtfully designed gowns that brings together premium materials and a refined fit. Crafted from Net over Satin, it is built to feel as good as it looks. The fabric is carefully selected for its soft hand-feel, resilience and natural drape, giving you a piece that holds its shape and color through repeated wear. Every detail — from the sweetheart neck to the precision-finished seams and durable trims — reflects a genuine commitment to premium craftsmanship that you can see and feel.\n\nFabric & Comfort: Net over Satin offers a balance of softness and structure that sits comfortably against the skin. The weave is breathable and gentle, helping regulate temperature so you stay fresh through busy days. The flared fit allows a natural range of movement without feeling restrictive, while careful tailoring ensures a clean, flattering line. The full sleeve cut adds balance to the overall silhouette, making this an easy choice when you want to look put-together without compromising on ease or all-day wearability.\n\nStyle Benefits: the embroidered aesthetic makes this a genuinely versatile addition to any wardrobe. It layers effortlessly, mixes with both relaxed and elevated pieces, and adapts to your mood and the moment. Whether you dress it up or keep it understated, the Embroidered Anarkali Gown delivers a modern, considered look. The colorways are chosen to complement a wide range of skin tones and existing outfits, so styling it is intuitive rather than complicated.\n\nUsage Scenarios: ideally suited for wedding settings throughout the all season season, this piece transitions smoothly across your day. Wear it for casual outings, weekend plans, travel, gatherings with friends, or relaxed time at home. Its adaptable design means it works across your existing wardrobe with minimal effort, quickly becoming a reliable go-to you will reach for again and again — versatile enough to earn its place season after season.\n\nCare Instructions: to keep the Embroidered Anarkali Gown looking its best, machine wash cold with similar colors on a gentle cycle. Do not bleach, and avoid harsh detergents that can dull the finish. Tumble dry on low or line dry in shade to protect the fibers, and warm iron on the reverse if needed. Avoid wringing to preserve the fabric structure and shape. With this simple care routine, your piece will stay fresh, soft and vibrant wash after wash — a smart, long-lasting investment in your everyday style.",
    "features": [
      "Premium Net fabric",
      "Breathable, skin-friendly material",
      "Fade-resistant color retention",
      "Soft-touch finish for all-day comfort",
      "Lightweight, easy-to-wear construction",
      "Flared Fit for a flattering silhouette",
      "Reinforced stitching for durability"
    ],
    "specifications": {
      "Material": "Net over Satin",
      "Fit Type": "Flared Fit",
      "Sleeve Type": "Full Sleeve",
      "Neck Type": "Sweetheart Neck",
      "Pattern": "Embroidered",
      "Occasion": "Wedding",
      "Season": "All Season",
      "Gender": "Women",
      "Country of Origin": "Bangladesh"
    },
    "sizeGuide": [
      {
        "size": "XS",
        "chest": "34",
        "waist": "28",
        "length": "66",
        "shoulder": "40"
      },
      {
        "size": "S",
        "chest": "36",
        "waist": "30",
        "length": "68",
        "shoulder": "42"
      },
      {
        "size": "M",
        "chest": "38",
        "waist": "32",
        "length": "70",
        "shoulder": "44"
      },
      {
        "size": "L",
        "chest": "40",
        "waist": "34",
        "length": "72",
        "shoulder": "46"
      },
      {
        "size": "XL",
        "chest": "42",
        "waist": "36",
        "length": "74",
        "shoulder": "48"
      },
      {
        "size": "XXL",
        "chest": "44",
        "waist": "38",
        "length": "76",
        "shoulder": "50"
      }
    ],
    "reviews": [
      {
        "name": "Tahmid Islam",
        "rating": 5,
        "text": "Exceeded my expectations — stitching is clean and the color is exactly as shown.",
        "date": "2025-11-10"
      },
      {
        "name": "Anika Tabassum",
        "rating": 4,
        "text": "Super comfortable for all-day wear, I've already ordered a second one.",
        "date": "2025-11-01"
      },
      {
        "name": "Shuvo Roy",
        "rating": 5,
        "text": "Great value for the price. Delivery was fast and packaging was neat.",
        "date": "2025-10-23"
      },
      {
        "name": "Faria Noor",
        "rating": 4,
        "text": "The material breathes really well, perfect for our weather. Highly recommend.",
        "date": "2025-10-14"
      },
      {
        "name": "Zubair Hossain",
        "rating": 3,
        "text": "Good product overall, though I'd suggest sizing up for a relaxed fit.",
        "date": "2025-10-05"
      },
      {
        "name": "Nadia Sultana",
        "rating": 4,
        "text": "True to size and holds up well after multiple washes. Very happy.",
        "date": "2025-09-26"
      },
      {
        "name": "Rahul Sen",
        "rating": 5,
        "text": "Premium feel without the premium markup. Will buy again from this brand.",
        "date": "2025-09-17"
      },
      {
        "name": "Tasnia Mim",
        "rating": 4,
        "text": "Soft, lightweight and well finished. Exactly what I was looking for.",
        "date": "2025-09-08"
      }
    ],
    "relatedIds": [
      "prod-024",
      "prod-013",
      "prod-014",
      "prod-015"
    ],
    "frequentlyBoughtTogetherIds": [
      "prod-013",
      "prod-014"
    ],
    "customersAlsoBoughtIds": [
      "prod-034",
      "prod-035",
      "prod-036",
      "prod-037"
    ]
  },
  {
    "id": "prod-023",
    "slug": "denim-pinafore-dress-women",
    "name": "Denim Pinafore Dress",
    "sku": "WM-0023",
    "category": "Women",
    "subcategory": "Dresses",
    "brand": "Élan Studio",
    "price": 2190,
    "comparePrice": 2990,
    "discountPercent": 27,
    "rating": 4.6,
    "reviewCount": 382,
    "stock": 112,
    "images": [
      "https://picsum.photos/seed/denim-pinafore-dress-women-front/700/933",
      "https://picsum.photos/seed/denim-pinafore-dress-women-back/700/933",
      "https://picsum.photos/seed/denim-pinafore-dress-women-life/700/933",
      "https://picsum.photos/seed/denim-pinafore-dress-women-model/700/933"
    ],
    "imageRoles": {
      "front": "https://picsum.photos/seed/denim-pinafore-dress-women-front/700/933",
      "back": "https://picsum.photos/seed/denim-pinafore-dress-women-back/700/933",
      "lifestyle": "https://picsum.photos/seed/denim-pinafore-dress-women-life/700/933",
      "model": "https://picsum.photos/seed/denim-pinafore-dress-women-model/700/933"
    },
    "colors": [
      {
        "name": "Sky Blue",
        "hex": "#9fc3e0"
      },
      {
        "name": "Coral",
        "hex": "#e8836b"
      },
      {
        "name": "Lavender",
        "hex": "#b9a7d6"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "seo": {
      "title": "Denim Pinafore Dress for Women – Elegant Everyday Style",
      "slug": "denim-pinafore-dress-women",
      "metaTitle": "Denim Pinafore Dress | Buy Online",
      "metaDescription": "Shop the Denim Pinafore Dress in Cotton Denim. A-Line Fit, solid design for casual. Now 27% off with fast delivery. Free returns. Free returns. Free returns.",
      "keywords": [
        "denim pinafore dress",
        "women dresses",
        "solid dresses",
        "buy denim pinafore dress online",
        "casual wear",
        "premium dresses"
      ]
    },
    "shortDescription": "The Denim Pinafore Dress blends cotton denim with a a-line fit for effortless comfort. Featuring a solid design and square neck neckline, it's tailored for casual moments throughout the all season season. A versatile wardrobe staple that pairs easily and wears beautifully day after day.",
    "longDescription": "Meet the Denim Pinafore Dress — a thoughtfully designed dresses that brings together premium materials and a refined fit. Crafted from Cotton Denim, it is built to feel as good as it looks. The fabric is carefully selected for its soft hand-feel, resilience and natural drape, giving you a piece that holds its shape and color through repeated wear. Every detail — from the square neck to the precision-finished seams and durable trims — reflects a genuine commitment to premium craftsmanship that you can see and feel.\n\nFabric & Comfort: Cotton Denim offers a balance of softness and structure that sits comfortably against the skin. The weave is breathable and gentle, helping regulate temperature so you stay fresh through busy days. The a-line fit allows a natural range of movement without feeling restrictive, while careful tailoring ensures a clean, flattering line. The sleeveless cut adds balance to the overall silhouette, making this an easy choice when you want to look put-together without compromising on ease or all-day wearability.\n\nStyle Benefits: the solid aesthetic makes this a genuinely versatile addition to any wardrobe. It layers effortlessly, mixes with both relaxed and elevated pieces, and adapts to your mood and the moment. Whether you dress it up or keep it understated, the Denim Pinafore Dress delivers a modern, considered look. The colorways are chosen to complement a wide range of skin tones and existing outfits, so styling it is intuitive rather than complicated.\n\nUsage Scenarios: ideally suited for casual settings throughout the all season season, this piece transitions smoothly across your day. Wear it for casual outings, weekend plans, travel, gatherings with friends, or relaxed time at home. Its adaptable design means it works across your existing wardrobe with minimal effort, quickly becoming a reliable go-to you will reach for again and again — versatile enough to earn its place season after season.\n\nCare Instructions: to keep the Denim Pinafore Dress looking its best, machine wash cold with similar colors on a gentle cycle. Do not bleach, and avoid harsh detergents that can dull the finish. Tumble dry on low or line dry in shade to protect the fibers, and warm iron on the reverse if needed. Avoid wringing to preserve the fabric structure and shape. With this simple care routine, your piece will stay fresh, soft and vibrant wash after wash — a smart, long-lasting investment in your everyday style.",
    "features": [
      "Premium Cotton fabric",
      "Breathable, skin-friendly material",
      "Fade-resistant color retention",
      "Soft-touch finish for all-day comfort",
      "Lightweight, easy-to-wear construction",
      "A-Line Fit for a flattering silhouette",
      "Reinforced stitching for durability"
    ],
    "specifications": {
      "Material": "Cotton Denim",
      "Fit Type": "A-Line Fit",
      "Sleeve Type": "Sleeveless",
      "Neck Type": "Square Neck",
      "Pattern": "Solid",
      "Occasion": "Casual",
      "Season": "All Season",
      "Gender": "Women",
      "Country of Origin": "Bangladesh"
    },
    "sizeGuide": [
      {
        "size": "XS",
        "chest": "34",
        "waist": "28",
        "length": "66",
        "shoulder": "40"
      },
      {
        "size": "S",
        "chest": "36",
        "waist": "30",
        "length": "68",
        "shoulder": "42"
      },
      {
        "size": "M",
        "chest": "38",
        "waist": "32",
        "length": "70",
        "shoulder": "44"
      },
      {
        "size": "L",
        "chest": "40",
        "waist": "34",
        "length": "72",
        "shoulder": "46"
      },
      {
        "size": "XL",
        "chest": "42",
        "waist": "36",
        "length": "74",
        "shoulder": "48"
      },
      {
        "size": "XXL",
        "chest": "44",
        "waist": "38",
        "length": "76",
        "shoulder": "50"
      }
    ],
    "reviews": [
      {
        "name": "Anika Tabassum",
        "rating": 4,
        "text": "Super comfortable for all-day wear, I've already ordered a second one.",
        "date": "2025-11-09"
      },
      {
        "name": "Shuvo Roy",
        "rating": 5,
        "text": "Great value for the price. Delivery was fast and packaging was neat.",
        "date": "2025-10-31"
      },
      {
        "name": "Faria Noor",
        "rating": 4,
        "text": "The material breathes really well, perfect for our weather. Highly recommend.",
        "date": "2025-10-22"
      },
      {
        "name": "Zubair Hossain",
        "rating": 5,
        "text": "Looks even better in person. Got compliments the first time I wore it.",
        "date": "2025-10-13"
      },
      {
        "name": "Nadia Sultana",
        "rating": 3,
        "text": "Nice quality but the color is slightly darker than the picture.",
        "date": "2025-10-04"
      },
      {
        "name": "Rahul Sen",
        "rating": 5,
        "text": "Premium feel without the premium markup. Will buy again from this brand.",
        "date": "2025-09-25"
      },
      {
        "name": "Tasnia Mim",
        "rating": 4,
        "text": "Soft, lightweight and well finished. Exactly what I was looking for.",
        "date": "2025-09-16"
      },
      {
        "name": "Omar Faruk",
        "rating": 5,
        "text": "Fantastic everyday piece — versatile, stylish and easy to care for.",
        "date": "2025-09-07"
      },
      {
        "name": "Arman Hossain",
        "rating": 4,
        "text": "Absolutely love the quality, the fabric feels premium and the fit is spot on.",
        "date": "2025-08-29"
      }
    ],
    "relatedIds": [
      "prod-013",
      "prod-014",
      "prod-015",
      "prod-016"
    ],
    "frequentlyBoughtTogetherIds": [
      "prod-014",
      "prod-015"
    ],
    "customersAlsoBoughtIds": [
      "prod-035",
      "prod-036",
      "prod-037",
      "prod-038"
    ]
  },
  {
    "id": "prod-024",
    "slug": "silk-blend-saree-women",
    "name": "Silk Blend Saree",
    "sku": "WM-0024",
    "category": "Women",
    "subcategory": "Sarees",
    "brand": "Élan Studio",
    "price": 3990,
    "comparePrice": 5490,
    "discountPercent": 27,
    "rating": 4.9,
    "reviewCount": 439,
    "stock": 125,
    "images": [
      "https://picsum.photos/seed/silk-blend-saree-women-front/700/933",
      "https://picsum.photos/seed/silk-blend-saree-women-back/700/933",
      "https://picsum.photos/seed/silk-blend-saree-women-life/700/933",
      "https://picsum.photos/seed/silk-blend-saree-women-model/700/933"
    ],
    "imageRoles": {
      "front": "https://picsum.photos/seed/silk-blend-saree-women-front/700/933",
      "back": "https://picsum.photos/seed/silk-blend-saree-women-back/700/933",
      "lifestyle": "https://picsum.photos/seed/silk-blend-saree-women-life/700/933",
      "model": "https://picsum.photos/seed/silk-blend-saree-women-model/700/933"
    },
    "colors": [
      {
        "name": "Mustard",
        "hex": "#d6a531"
      },
      {
        "name": "Blush Pink",
        "hex": "#e8b5bf"
      },
      {
        "name": "Black",
        "hex": "#1c1c1c"
      }
    ],
    "sizes": [
      "Free Size"
    ],
    "seo": {
      "title": "Silk Blend Saree for Women – Elegant Everyday Style",
      "slug": "silk-blend-saree-women",
      "metaTitle": "Silk Blend Saree | Buy Online",
      "metaDescription": "Shop the Silk Blend Saree in Art Silk with Zari Border. N/A, woven design for festive. Now 27% off with fast delivery. Free returns. Free returns. Free returns.",
      "keywords": [
        "silk blend saree",
        "women sarees",
        "woven sarees",
        "buy silk blend saree online",
        "festive wear",
        "premium sarees"
      ]
    },
    "shortDescription": "The Silk Blend Saree blends art silk with zari border with a n/a for effortless comfort. Featuring a woven design and it's tailored for festive moments throughout the all season season. A versatile wardrobe staple that pairs easily and wears beautifully day after day.",
    "longDescription": "Meet the Silk Blend Saree — a thoughtfully designed sarees that brings together premium materials and a refined fit. Crafted from Art Silk with Zari Border, it is built to feel as good as it looks. The fabric is carefully selected for its soft hand-feel, resilience and natural drape, giving you a piece that holds its shape and color through repeated wear. Every detail — from the clean construction to the precision-finished seams and durable trims — reflects a genuine commitment to premium craftsmanship that you can see and feel.\n\nFabric & Comfort: Art Silk with Zari Border offers a balance of softness and structure that sits comfortably against the skin. The weave is breathable and gentle, helping regulate temperature so you stay fresh through busy days. The n/a allows a natural range of movement without feeling restrictive, while careful tailoring ensures a clean, flattering line. making this an easy choice when you want to look put-together without compromising on ease or all-day wearability.\n\nStyle Benefits: the woven aesthetic makes this a genuinely versatile addition to any wardrobe. It layers effortlessly, mixes with both relaxed and elevated pieces, and adapts to your mood and the moment. Whether you dress it up or keep it understated, the Silk Blend Saree delivers a modern, considered look. The colorways are chosen to complement a wide range of skin tones and existing outfits, so styling it is intuitive rather than complicated.\n\nUsage Scenarios: ideally suited for festive settings throughout the all season season, this piece transitions smoothly across your day. Wear it for casual outings, weekend plans, travel, gatherings with friends, or relaxed time at home. Its adaptable design means it works across your existing wardrobe with minimal effort, quickly becoming a reliable go-to you will reach for again and again — versatile enough to earn its place season after season.\n\nCare Instructions: to keep the Silk Blend Saree looking its best, machine wash cold with similar colors on a gentle cycle. Do not bleach, and avoid harsh detergents that can dull the finish. Tumble dry on low or line dry in shade to protect the fibers, and warm iron on the reverse if needed. Avoid wringing to preserve the fabric structure and shape. With this simple care routine, your piece will stay fresh, soft and vibrant wash after wash — a smart, long-lasting investment in your everyday style.",
    "features": [
      "Premium Art fabric",
      "Breathable, skin-friendly material",
      "Fade-resistant color retention",
      "Soft-touch finish for all-day comfort",
      "Lightweight, easy-to-wear construction",
      "N/A for a flattering silhouette",
      "Reinforced stitching for durability"
    ],
    "specifications": {
      "Material": "Art Silk with Zari Border",
      "Fit Type": "N/A",
      "Sleeve Type": "N/A",
      "Neck Type": "N/A",
      "Pattern": "Woven",
      "Occasion": "Festive",
      "Season": "All Season",
      "Gender": "Women",
      "Country of Origin": "Bangladesh"
    },
    "sizeGuide": [
      {
        "size": "Free Size",
        "length": "550",
        "width": "110",
        "note": "Saree length incl. blouse piece"
      }
    ],
    "reviews": [
      {
        "name": "Shuvo Roy",
        "rating": 5,
        "text": "Great value for the price. Delivery was fast and packaging was neat.",
        "date": "2025-11-08"
      },
      {
        "name": "Faria Noor",
        "rating": 4,
        "text": "The material breathes really well, perfect for our weather. Highly recommend.",
        "date": "2025-10-30"
      },
      {
        "name": "Zubair Hossain",
        "rating": 5,
        "text": "Looks even better in person. Got compliments the first time I wore it.",
        "date": "2025-10-21"
      },
      {
        "name": "Nadia Sultana",
        "rating": 4,
        "text": "True to size and holds up well after multiple washes. Very happy.",
        "date": "2025-10-12"
      },
      {
        "name": "Rahul Sen",
        "rating": 3,
        "text": "Comfortable and well made, delivery took a little longer than expected.",
        "date": "2025-10-03"
      },
      {
        "name": "Tasnia Mim",
        "rating": 4,
        "text": "Soft, lightweight and well finished. Exactly what I was looking for.",
        "date": "2025-09-24"
      },
      {
        "name": "Omar Faruk",
        "rating": 5,
        "text": "Fantastic everyday piece — versatile, stylish and easy to care for.",
        "date": "2025-09-15"
      },
      {
        "name": "Arman Hossain",
        "rating": 4,
        "text": "Absolutely love the quality, the fabric feels premium and the fit is spot on.",
        "date": "2025-09-06"
      },
      {
        "name": "Nusrat Jahan",
        "rating": 5,
        "text": "Exceeded my expectations — stitching is clean and the color is exactly as shown.",
        "date": "2025-08-28"
      },
      {
        "name": "Tanvir Ahmed",
        "rating": 4,
        "text": "Comfortable and well made, delivery took a little longer than expected.",
        "date": "2025-08-19"
      }
    ],
    "relatedIds": [
      "prod-014",
      "prod-015",
      "prod-016",
      "prod-017"
    ],
    "frequentlyBoughtTogetherIds": [
      "prod-015",
      "prod-016"
    ],
    "customersAlsoBoughtIds": [
      "prod-036",
      "prod-037",
      "prod-038",
      "prod-039"
    ]
  },
  {
    "id": "prod-025",
    "slug": "boys-graphic-tee-boys",
    "name": "Boys Graphic Tee",
    "sku": "KD-0025",
    "category": "Kids",
    "subcategory": "Boys T-Shirts",
    "brand": "Little Lane",
    "price": 590,
    "comparePrice": 890,
    "discountPercent": 34,
    "rating": 4.2,
    "reviewCount": 496,
    "stock": 138,
    "images": [
      "https://picsum.photos/seed/boys-graphic-tee-boys-front/700/933",
      "https://picsum.photos/seed/boys-graphic-tee-boys-back/700/933",
      "https://picsum.photos/seed/boys-graphic-tee-boys-life/700/933",
      "https://picsum.photos/seed/boys-graphic-tee-boys-model/700/933"
    ],
    "imageRoles": {
      "front": "https://picsum.photos/seed/boys-graphic-tee-boys-front/700/933",
      "back": "https://picsum.photos/seed/boys-graphic-tee-boys-back/700/933",
      "lifestyle": "https://picsum.photos/seed/boys-graphic-tee-boys-life/700/933",
      "model": "https://picsum.photos/seed/boys-graphic-tee-boys-model/700/933"
    },
    "colors": [
      {
        "name": "Teal",
        "hex": "#1f6f6b"
      },
      {
        "name": "Sage",
        "hex": "#9caf88"
      },
      {
        "name": "White",
        "hex": "#f5f5f5"
      }
    ],
    "sizes": [
      "2-3Y",
      "4-5Y",
      "6-7Y",
      "8-9Y",
      "10-11Y",
      "12-13Y"
    ],
    "seo": {
      "title": "Boys Graphic Tee for Boys – Soft & Playful Everyday Wear",
      "slug": "boys-graphic-tee-boys",
      "metaTitle": "Boys Graphic Tee | Buy Online",
      "metaDescription": "Shop the Boys Graphic Tee in Soft Cotton Single Jersey. Regular Fit, graphic print design for playwear. Now 34% off with fast delivery. Free returns. Free retur",
      "keywords": [
        "boys graphic tee",
        "kids boys t-shirts",
        "graphic print boys t-shirts",
        "buy boys graphic tee online",
        "playwear wear",
        "premium boys t-shirts"
      ]
    },
    "shortDescription": "The Boys Graphic Tee blends soft cotton single jersey with a regular fit for effortless comfort. Featuring a graphic print design and crew neck neckline, it's tailored for playwear moments throughout the summer season. A versatile wardrobe staple that pairs easily and wears beautifully day after day.",
    "longDescription": "Meet the Boys Graphic Tee — a thoughtfully designed boys t-shirts that brings together premium materials and a refined fit. Crafted from Soft Cotton Single Jersey, it is built to feel as good as it looks. The fabric is carefully selected for its soft hand-feel, resilience and natural drape, giving you a piece that holds its shape and color through repeated wear. Every detail — from the crew neck to the precision-finished seams and durable trims — reflects a genuine commitment to premium craftsmanship that you can see and feel.\n\nFabric & Comfort: Soft Cotton Single Jersey offers a balance of softness and structure that sits comfortably against the skin. The weave is breathable and gentle, helping regulate temperature so you stay fresh through busy days. The regular fit allows a natural range of movement without feeling restrictive, while careful tailoring ensures a clean, flattering line. The short sleeve cut adds balance to the overall silhouette, making this an easy choice when you want to look put-together without compromising on ease or all-day wearability.\n\nStyle Benefits: the graphic print aesthetic makes this a genuinely versatile addition to any wardrobe. It layers effortlessly, mixes with both relaxed and elevated pieces, and adapts to your mood and the moment. Whether you dress it up or keep it understated, the Boys Graphic Tee delivers a modern, considered look. The colorways are chosen to complement a wide range of skin tones and existing outfits, so styling it is intuitive rather than complicated.\n\nUsage Scenarios: ideally suited for playwear settings throughout the summer season, this piece transitions smoothly across your day. Wear it for casual outings, weekend plans, travel, gatherings with friends, or relaxed time at home. Its adaptable design means it works across your existing wardrobe with minimal effort, quickly becoming a reliable go-to you will reach for again and again — versatile enough to earn its place season after season.\n\nCare Instructions: to keep the Boys Graphic Tee looking its best, machine wash cold with similar colors on a gentle cycle. Do not bleach, and avoid harsh detergents that can dull the finish. Tumble dry on low or line dry in shade to protect the fibers, and warm iron on the reverse if needed. Avoid wringing to preserve the fabric structure and shape. With this simple care routine, your piece will stay fresh, soft and vibrant wash after wash — a smart, long-lasting investment in your everyday style.",
    "features": [
      "Premium Soft fabric",
      "Breathable, skin-friendly material",
      "Fade-resistant color retention",
      "Soft-touch finish for all-day comfort",
      "Lightweight, easy-to-wear construction",
      "Regular Fit for a flattering silhouette",
      "Reinforced stitching for durability"
    ],
    "specifications": {
      "Material": "Soft Cotton Single Jersey",
      "Fit Type": "Regular Fit",
      "Sleeve Type": "Short Sleeve",
      "Neck Type": "Crew Neck",
      "Pattern": "Graphic Print",
      "Occasion": "Playwear",
      "Season": "Summer",
      "Gender": "Boys",
      "Country of Origin": "Bangladesh"
    },
    "sizeGuide": [
      {
        "size": "2-3Y",
        "chest": "26",
        "waist": "24",
        "length": "40",
        "height": "98"
      },
      {
        "size": "4-5Y",
        "chest": "28",
        "waist": "26",
        "length": "44",
        "height": "110"
      },
      {
        "size": "6-7Y",
        "chest": "30",
        "waist": "28",
        "length": "48",
        "height": "122"
      },
      {
        "size": "8-9Y",
        "chest": "32",
        "waist": "30",
        "length": "52",
        "height": "134"
      },
      {
        "size": "10-11Y",
        "chest": "34",
        "waist": "32",
        "length": "56",
        "height": "146"
      },
      {
        "size": "12-13Y",
        "chest": "36",
        "waist": "34",
        "length": "60",
        "height": "158"
      }
    ],
    "reviews": [
      {
        "name": "Faria Noor",
        "rating": 4,
        "text": "The material breathes really well, perfect for our weather. Highly recommend.",
        "date": "2025-11-07"
      },
      {
        "name": "Zubair Hossain",
        "rating": 5,
        "text": "Looks even better in person. Got compliments the first time I wore it.",
        "date": "2025-10-29"
      },
      {
        "name": "Nadia Sultana",
        "rating": 4,
        "text": "True to size and holds up well after multiple washes. Very happy.",
        "date": "2025-10-20"
      },
      {
        "name": "Rahul Sen",
        "rating": 5,
        "text": "Premium feel without the premium markup. Will buy again from this brand.",
        "date": "2025-10-11"
      },
      {
        "name": "Tasnia Mim",
        "rating": 3,
        "text": "Happy with it, just wish there were a few more color options.",
        "date": "2025-10-02"
      }
    ],
    "relatedIds": [
      "prod-029",
      "prod-030",
      "prod-031",
      "prod-032"
    ],
    "frequentlyBoughtTogetherIds": [
      "prod-030",
      "prod-031"
    ],
    "customersAlsoBoughtIds": [
      "prod-033",
      "prod-034",
      "prod-035",
      "prod-036"
    ]
  },
  {
    "id": "prod-026",
    "slug": "girls-floral-dress-girls",
    "name": "Girls Floral Dress",
    "sku": "KD-0026",
    "category": "Kids",
    "subcategory": "Girls Dresses",
    "brand": "Little Lane",
    "price": 990,
    "comparePrice": 1390,
    "discountPercent": 29,
    "rating": 4.5,
    "reviewCount": 553,
    "stock": 151,
    "images": [
      "https://picsum.photos/seed/girls-floral-dress-girls-front/700/933",
      "https://picsum.photos/seed/girls-floral-dress-girls-back/700/933",
      "https://picsum.photos/seed/girls-floral-dress-girls-life/700/933",
      "https://picsum.photos/seed/girls-floral-dress-girls-model/700/933"
    ],
    "imageRoles": {
      "front": "https://picsum.photos/seed/girls-floral-dress-girls-front/700/933",
      "back": "https://picsum.photos/seed/girls-floral-dress-girls-back/700/933",
      "lifestyle": "https://picsum.photos/seed/girls-floral-dress-girls-life/700/933",
      "model": "https://picsum.photos/seed/girls-floral-dress-girls-model/700/933"
    },
    "colors": [
      {
        "name": "Coral",
        "hex": "#e8836b"
      },
      {
        "name": "Rust",
        "hex": "#a8562f"
      },
      {
        "name": "Navy",
        "hex": "#1f2a44"
      }
    ],
    "sizes": [
      "2-3Y",
      "4-5Y",
      "6-7Y",
      "8-9Y",
      "10-11Y",
      "12-13Y"
    ],
    "seo": {
      "title": "Girls Floral Dress for Girls – Soft & Playful Everyday Wear",
      "slug": "girls-floral-dress-girls",
      "metaTitle": "Girls Floral Dress | Buy Online",
      "metaDescription": "Shop the Girls Floral Dress in Cotton Poplin. Fit and Flare, floral print design for party. Now 29% off with fast delivery. Free returns. Free returns.",
      "keywords": [
        "girls floral dress",
        "kids girls dresses",
        "floral print girls dresses",
        "buy girls floral dress online",
        "party wear",
        "premium girls dresses"
      ]
    },
    "shortDescription": "The Girls Floral Dress blends cotton poplin with a fit and flare for effortless comfort. Featuring a floral print design and peter pan collar neckline, it's tailored for party moments throughout the summer season. A versatile wardrobe staple that pairs easily and wears beautifully day after day.",
    "longDescription": "Meet the Girls Floral Dress — a thoughtfully designed girls dresses that brings together premium materials and a refined fit. Crafted from Cotton Poplin, it is built to feel as good as it looks. The fabric is carefully selected for its soft hand-feel, resilience and natural drape, giving you a piece that holds its shape and color through repeated wear. Every detail — from the peter pan collar to the precision-finished seams and durable trims — reflects a genuine commitment to premium craftsmanship that you can see and feel.\n\nFabric & Comfort: Cotton Poplin offers a balance of softness and structure that sits comfortably against the skin. The weave is breathable and gentle, helping regulate temperature so you stay fresh through busy days. The fit and flare allows a natural range of movement without feeling restrictive, while careful tailoring ensures a clean, flattering line. The cap sleeve cut adds balance to the overall silhouette, making this an easy choice when you want to look put-together without compromising on ease or all-day wearability.\n\nStyle Benefits: the floral print aesthetic makes this a genuinely versatile addition to any wardrobe. It layers effortlessly, mixes with both relaxed and elevated pieces, and adapts to your mood and the moment. Whether you dress it up or keep it understated, the Girls Floral Dress delivers a modern, considered look. The colorways are chosen to complement a wide range of skin tones and existing outfits, so styling it is intuitive rather than complicated.\n\nUsage Scenarios: ideally suited for party settings throughout the summer season, this piece transitions smoothly across your day. Wear it for casual outings, weekend plans, travel, gatherings with friends, or relaxed time at home. Its adaptable design means it works across your existing wardrobe with minimal effort, quickly becoming a reliable go-to you will reach for again and again — versatile enough to earn its place season after season.\n\nCare Instructions: to keep the Girls Floral Dress looking its best, machine wash cold with similar colors on a gentle cycle. Do not bleach, and avoid harsh detergents that can dull the finish. Tumble dry on low or line dry in shade to protect the fibers, and warm iron on the reverse if needed. Avoid wringing to preserve the fabric structure and shape. With this simple care routine, your piece will stay fresh, soft and vibrant wash after wash — a smart, long-lasting investment in your everyday style.",
    "features": [
      "Premium Cotton fabric",
      "Breathable, skin-friendly material",
      "Fade-resistant color retention",
      "Soft-touch finish for all-day comfort",
      "Lightweight, easy-to-wear construction",
      "Fit and Flare for a flattering silhouette",
      "Reinforced stitching for durability"
    ],
    "specifications": {
      "Material": "Cotton Poplin",
      "Fit Type": "Fit and Flare",
      "Sleeve Type": "Cap Sleeve",
      "Neck Type": "Peter Pan Collar",
      "Pattern": "Floral Print",
      "Occasion": "Party",
      "Season": "Summer",
      "Gender": "Girls",
      "Country of Origin": "Bangladesh"
    },
    "sizeGuide": [
      {
        "size": "2-3Y",
        "chest": "26",
        "waist": "24",
        "length": "40",
        "height": "98"
      },
      {
        "size": "4-5Y",
        "chest": "28",
        "waist": "26",
        "length": "44",
        "height": "110"
      },
      {
        "size": "6-7Y",
        "chest": "30",
        "waist": "28",
        "length": "48",
        "height": "122"
      },
      {
        "size": "8-9Y",
        "chest": "32",
        "waist": "30",
        "length": "52",
        "height": "134"
      },
      {
        "size": "10-11Y",
        "chest": "34",
        "waist": "32",
        "length": "56",
        "height": "146"
      },
      {
        "size": "12-13Y",
        "chest": "36",
        "waist": "34",
        "length": "60",
        "height": "158"
      }
    ],
    "reviews": [
      {
        "name": "Zubair Hossain",
        "rating": 5,
        "text": "Looks even better in person. Got compliments the first time I wore it.",
        "date": "2025-11-06"
      },
      {
        "name": "Nadia Sultana",
        "rating": 4,
        "text": "True to size and holds up well after multiple washes. Very happy.",
        "date": "2025-10-28"
      },
      {
        "name": "Rahul Sen",
        "rating": 5,
        "text": "Premium feel without the premium markup. Will buy again from this brand.",
        "date": "2025-10-19"
      },
      {
        "name": "Tasnia Mim",
        "rating": 4,
        "text": "Soft, lightweight and well finished. Exactly what I was looking for.",
        "date": "2025-10-10"
      },
      {
        "name": "Omar Faruk",
        "rating": 3,
        "text": "Decent fabric for the price, the fit runs a touch slim.",
        "date": "2025-10-01"
      },
      {
        "name": "Arman Hossain",
        "rating": 4,
        "text": "Absolutely love the quality, the fabric feels premium and the fit is spot on.",
        "date": "2025-09-22"
      }
    ],
    "relatedIds": [
      "prod-030",
      "prod-031",
      "prod-032",
      "prod-025"
    ],
    "frequentlyBoughtTogetherIds": [
      "prod-031",
      "prod-032"
    ],
    "customersAlsoBoughtIds": [
      "prod-034",
      "prod-035",
      "prod-036",
      "prod-037"
    ]
  },
  {
    "id": "prod-027",
    "slug": "kids-sports-set-unisex-kids",
    "name": "Kids Sports Set",
    "sku": "KD-0027",
    "category": "Kids",
    "subcategory": "Active Sets",
    "brand": "Little Lane",
    "price": 1190,
    "comparePrice": 1690,
    "discountPercent": 30,
    "rating": 4.8,
    "reviewCount": 610,
    "stock": 164,
    "images": [
      "https://picsum.photos/seed/kids-sports-set-unisex-kids-front/700/933",
      "https://picsum.photos/seed/kids-sports-set-unisex-kids-back/700/933",
      "https://picsum.photos/seed/kids-sports-set-unisex-kids-life/700/933",
      "https://picsum.photos/seed/kids-sports-set-unisex-kids-model/700/933"
    ],
    "imageRoles": {
      "front": "https://picsum.photos/seed/kids-sports-set-unisex-kids-front/700/933",
      "back": "https://picsum.photos/seed/kids-sports-set-unisex-kids-back/700/933",
      "lifestyle": "https://picsum.photos/seed/kids-sports-set-unisex-kids-life/700/933",
      "model": "https://picsum.photos/seed/kids-sports-set-unisex-kids-model/700/933"
    },
    "colors": [
      {
        "name": "Blush Pink",
        "hex": "#e8b5bf"
      },
      {
        "name": "Lavender",
        "hex": "#b9a7d6"
      },
      {
        "name": "Charcoal",
        "hex": "#3a3a3a"
      }
    ],
    "sizes": [
      "2-3Y",
      "4-5Y",
      "6-7Y",
      "8-9Y",
      "10-11Y",
      "12-13Y"
    ],
    "seo": {
      "title": "Kids Sports Set for Unisex Kids – Soft & Playful Everyday Wear",
      "slug": "kids-sports-set-unisex-kids",
      "metaTitle": "Kids Sports Set | Buy Online",
      "metaDescription": "Shop the Kids Sports Set in Polyester Dri-Fit Knit. Regular Fit, color block design for sports. Now 30% off with fast delivery. Free returns. Free returns.",
      "keywords": [
        "kids sports set",
        "kids active sets",
        "color block active sets",
        "buy kids sports set online",
        "sports wear",
        "premium active sets"
      ]
    },
    "shortDescription": "The Kids Sports Set blends polyester dri-fit knit with a regular fit for effortless comfort. Featuring a color block design and crew neck neckline, it's tailored for sports moments throughout the summer season. A versatile wardrobe staple that pairs easily and wears beautifully day after day.",
    "longDescription": "Meet the Kids Sports Set — a thoughtfully designed active sets that brings together premium materials and a refined fit. Crafted from Polyester Dri-Fit Knit, it is built to feel as good as it looks. The fabric is carefully selected for its soft hand-feel, resilience and natural drape, giving you a piece that holds its shape and color through repeated wear. Every detail — from the crew neck to the precision-finished seams and durable trims — reflects a genuine commitment to premium craftsmanship that you can see and feel.\n\nFabric & Comfort: Polyester Dri-Fit Knit offers a balance of softness and structure that sits comfortably against the skin. The weave is breathable and gentle, helping regulate temperature so you stay fresh through busy days. The regular fit allows a natural range of movement without feeling restrictive, while careful tailoring ensures a clean, flattering line. The short sleeve cut adds balance to the overall silhouette, making this an easy choice when you want to look put-together without compromising on ease or all-day wearability.\n\nStyle Benefits: the color block aesthetic makes this a genuinely versatile addition to any wardrobe. It layers effortlessly, mixes with both relaxed and elevated pieces, and adapts to your mood and the moment. Whether you dress it up or keep it understated, the Kids Sports Set delivers a modern, considered look. The colorways are chosen to complement a wide range of skin tones and existing outfits, so styling it is intuitive rather than complicated.\n\nUsage Scenarios: ideally suited for sports settings throughout the summer season, this piece transitions smoothly across your day. Wear it for casual outings, weekend plans, travel, gatherings with friends, or relaxed time at home. Its adaptable design means it works across your existing wardrobe with minimal effort, quickly becoming a reliable go-to you will reach for again and again — versatile enough to earn its place season after season.\n\nCare Instructions: to keep the Kids Sports Set looking its best, machine wash cold with similar colors on a gentle cycle. Do not bleach, and avoid harsh detergents that can dull the finish. Tumble dry on low or line dry in shade to protect the fibers, and warm iron on the reverse if needed. Avoid wringing to preserve the fabric structure and shape. With this simple care routine, your piece will stay fresh, soft and vibrant wash after wash — a smart, long-lasting investment in your everyday style.",
    "features": [
      "Premium Polyester fabric",
      "Breathable, skin-friendly material",
      "Fade-resistant color retention",
      "Soft-touch finish for all-day comfort",
      "Lightweight, easy-to-wear construction",
      "Regular Fit for a flattering silhouette",
      "Reinforced stitching for durability"
    ],
    "specifications": {
      "Material": "Polyester Dri-Fit Knit",
      "Fit Type": "Regular Fit",
      "Sleeve Type": "Short Sleeve",
      "Neck Type": "Crew Neck",
      "Pattern": "Color Block",
      "Occasion": "Sports",
      "Season": "Summer",
      "Gender": "Unisex Kids",
      "Country of Origin": "Bangladesh"
    },
    "sizeGuide": [
      {
        "size": "2-3Y",
        "chest": "26",
        "waist": "24",
        "length": "40",
        "height": "98"
      },
      {
        "size": "4-5Y",
        "chest": "28",
        "waist": "26",
        "length": "44",
        "height": "110"
      },
      {
        "size": "6-7Y",
        "chest": "30",
        "waist": "28",
        "length": "48",
        "height": "122"
      },
      {
        "size": "8-9Y",
        "chest": "32",
        "waist": "30",
        "length": "52",
        "height": "134"
      },
      {
        "size": "10-11Y",
        "chest": "34",
        "waist": "32",
        "length": "56",
        "height": "146"
      },
      {
        "size": "12-13Y",
        "chest": "36",
        "waist": "34",
        "length": "60",
        "height": "158"
      }
    ],
    "reviews": [
      {
        "name": "Nadia Sultana",
        "rating": 4,
        "text": "True to size and holds up well after multiple washes. Very happy.",
        "date": "2025-11-05"
      },
      {
        "name": "Rahul Sen",
        "rating": 5,
        "text": "Premium feel without the premium markup. Will buy again from this brand.",
        "date": "2025-10-27"
      },
      {
        "name": "Tasnia Mim",
        "rating": 4,
        "text": "Soft, lightweight and well finished. Exactly what I was looking for.",
        "date": "2025-10-18"
      },
      {
        "name": "Omar Faruk",
        "rating": 5,
        "text": "Fantastic everyday piece — versatile, stylish and easy to care for.",
        "date": "2025-10-09"
      },
      {
        "name": "Arman Hossain",
        "rating": 3,
        "text": "Good product overall, though I'd suggest sizing up for a relaxed fit.",
        "date": "2025-09-30"
      },
      {
        "name": "Nusrat Jahan",
        "rating": 5,
        "text": "Exceeded my expectations — stitching is clean and the color is exactly as shown.",
        "date": "2025-09-21"
      },
      {
        "name": "Tanvir Ahmed",
        "rating": 4,
        "text": "Super comfortable for all-day wear, I've already ordered a second one.",
        "date": "2025-09-12"
      }
    ],
    "relatedIds": [
      "prod-031",
      "prod-032",
      "prod-025",
      "prod-026"
    ],
    "frequentlyBoughtTogetherIds": [
      "prod-032",
      "prod-025"
    ],
    "customersAlsoBoughtIds": [
      "prod-035",
      "prod-036",
      "prod-037",
      "prod-038"
    ]
  },
  {
    "id": "prod-028",
    "slug": "cartoon-print-t-shirt-unisex-kids",
    "name": "Cartoon Print T-Shirt",
    "sku": "KD-0028",
    "category": "Kids",
    "subcategory": "Boys T-Shirts",
    "brand": "Little Lane",
    "price": 550,
    "comparePrice": 790,
    "discountPercent": 30,
    "rating": 4.1,
    "reviewCount": 667,
    "stock": 0,
    "images": [
      "https://picsum.photos/seed/cartoon-print-t-shirt-unisex-kids-front/700/933",
      "https://picsum.photos/seed/cartoon-print-t-shirt-unisex-kids-back/700/933",
      "https://picsum.photos/seed/cartoon-print-t-shirt-unisex-kids-life/700/933",
      "https://picsum.photos/seed/cartoon-print-t-shirt-unisex-kids-model/700/933"
    ],
    "imageRoles": {
      "front": "https://picsum.photos/seed/cartoon-print-t-shirt-unisex-kids-front/700/933",
      "back": "https://picsum.photos/seed/cartoon-print-t-shirt-unisex-kids-back/700/933",
      "lifestyle": "https://picsum.photos/seed/cartoon-print-t-shirt-unisex-kids-life/700/933",
      "model": "https://picsum.photos/seed/cartoon-print-t-shirt-unisex-kids-model/700/933"
    },
    "colors": [
      {
        "name": "Sage",
        "hex": "#9caf88"
      },
      {
        "name": "Black",
        "hex": "#1c1c1c"
      },
      {
        "name": "Olive",
        "hex": "#5b5a3a"
      }
    ],
    "sizes": [
      "2-3Y",
      "4-5Y",
      "6-7Y",
      "8-9Y",
      "10-11Y",
      "12-13Y"
    ],
    "seo": {
      "title": "Cartoon Print T-Shirt for Unisex Kids – Soft & Playful Everyday Wear",
      "slug": "cartoon-print-t-shirt-unisex-kids",
      "metaTitle": "Cartoon Print T-Shirt | Buy Online",
      "metaDescription": "Shop the Cartoon Print T-Shirt in Cotton Jersey. Regular Fit, cartoon print design for playwear. Now 30% off with fast delivery. Free returns. Free returns.",
      "keywords": [
        "cartoon print t-shirt",
        "kids boys t-shirts",
        "cartoon print boys t-shirts",
        "buy cartoon print t-shirt online",
        "playwear wear",
        "premium boys t-shirts"
      ]
    },
    "shortDescription": "The Cartoon Print T-Shirt blends cotton jersey with a regular fit for effortless comfort. Featuring a cartoon print design and crew neck neckline, it's tailored for playwear moments throughout the summer season. A versatile wardrobe staple that pairs easily and wears beautifully day after day.",
    "longDescription": "Meet the Cartoon Print T-Shirt — a thoughtfully designed boys t-shirts that brings together premium materials and a refined fit. Crafted from Cotton Jersey, it is built to feel as good as it looks. The fabric is carefully selected for its soft hand-feel, resilience and natural drape, giving you a piece that holds its shape and color through repeated wear. Every detail — from the crew neck to the precision-finished seams and durable trims — reflects a genuine commitment to premium craftsmanship that you can see and feel.\n\nFabric & Comfort: Cotton Jersey offers a balance of softness and structure that sits comfortably against the skin. The weave is breathable and gentle, helping regulate temperature so you stay fresh through busy days. The regular fit allows a natural range of movement without feeling restrictive, while careful tailoring ensures a clean, flattering line. The short sleeve cut adds balance to the overall silhouette, making this an easy choice when you want to look put-together without compromising on ease or all-day wearability.\n\nStyle Benefits: the cartoon print aesthetic makes this a genuinely versatile addition to any wardrobe. It layers effortlessly, mixes with both relaxed and elevated pieces, and adapts to your mood and the moment. Whether you dress it up or keep it understated, the Cartoon Print T-Shirt delivers a modern, considered look. The colorways are chosen to complement a wide range of skin tones and existing outfits, so styling it is intuitive rather than complicated.\n\nUsage Scenarios: ideally suited for playwear settings throughout the summer season, this piece transitions smoothly across your day. Wear it for casual outings, weekend plans, travel, gatherings with friends, or relaxed time at home. Its adaptable design means it works across your existing wardrobe with minimal effort, quickly becoming a reliable go-to you will reach for again and again — versatile enough to earn its place season after season.\n\nCare Instructions: to keep the Cartoon Print T-Shirt looking its best, machine wash cold with similar colors on a gentle cycle. Do not bleach, and avoid harsh detergents that can dull the finish. Tumble dry on low or line dry in shade to protect the fibers, and warm iron on the reverse if needed. Avoid wringing to preserve the fabric structure and shape. With this simple care routine, your piece will stay fresh, soft and vibrant wash after wash — a smart, long-lasting investment in your everyday style.",
    "features": [
      "Premium Cotton fabric",
      "Breathable, skin-friendly material",
      "Fade-resistant color retention",
      "Soft-touch finish for all-day comfort",
      "Lightweight, easy-to-wear construction",
      "Regular Fit for a flattering silhouette",
      "Reinforced stitching for durability"
    ],
    "specifications": {
      "Material": "Cotton Jersey",
      "Fit Type": "Regular Fit",
      "Sleeve Type": "Short Sleeve",
      "Neck Type": "Crew Neck",
      "Pattern": "Cartoon Print",
      "Occasion": "Playwear",
      "Season": "Summer",
      "Gender": "Unisex Kids",
      "Country of Origin": "Bangladesh"
    },
    "sizeGuide": [
      {
        "size": "2-3Y",
        "chest": "26",
        "waist": "24",
        "length": "40",
        "height": "98"
      },
      {
        "size": "4-5Y",
        "chest": "28",
        "waist": "26",
        "length": "44",
        "height": "110"
      },
      {
        "size": "6-7Y",
        "chest": "30",
        "waist": "28",
        "length": "48",
        "height": "122"
      },
      {
        "size": "8-9Y",
        "chest": "32",
        "waist": "30",
        "length": "52",
        "height": "134"
      },
      {
        "size": "10-11Y",
        "chest": "34",
        "waist": "32",
        "length": "56",
        "height": "146"
      },
      {
        "size": "12-13Y",
        "chest": "36",
        "waist": "34",
        "length": "60",
        "height": "158"
      }
    ],
    "reviews": [
      {
        "name": "Rahul Sen",
        "rating": 5,
        "text": "Premium feel without the premium markup. Will buy again from this brand.",
        "date": "2025-11-04"
      },
      {
        "name": "Tasnia Mim",
        "rating": 4,
        "text": "Soft, lightweight and well finished. Exactly what I was looking for.",
        "date": "2025-10-26"
      },
      {
        "name": "Omar Faruk",
        "rating": 5,
        "text": "Fantastic everyday piece — versatile, stylish and easy to care for.",
        "date": "2025-10-17"
      },
      {
        "name": "Arman Hossain",
        "rating": 4,
        "text": "Absolutely love the quality, the fabric feels premium and the fit is spot on.",
        "date": "2025-10-08"
      },
      {
        "name": "Nusrat Jahan",
        "rating": 3,
        "text": "Nice quality but the color is slightly darker than the picture.",
        "date": "2025-09-29"
      },
      {
        "name": "Tanvir Ahmed",
        "rating": 4,
        "text": "Super comfortable for all-day wear, I've already ordered a second one.",
        "date": "2025-09-20"
      },
      {
        "name": "Sadia Islam",
        "rating": 5,
        "text": "Great value for the price. Delivery was fast and packaging was neat.",
        "date": "2025-09-11"
      },
      {
        "name": "Rakib Hasan",
        "rating": 4,
        "text": "The material breathes really well, perfect for our weather. Highly recommend.",
        "date": "2025-09-02"
      }
    ],
    "relatedIds": [
      "prod-032",
      "prod-025",
      "prod-026",
      "prod-027"
    ],
    "frequentlyBoughtTogetherIds": [
      "prod-025",
      "prod-026"
    ],
    "customersAlsoBoughtIds": [
      "prod-036",
      "prod-037",
      "prod-038",
      "prod-039"
    ]
  },
  {
    "id": "prod-029",
    "slug": "girls-denim-dungaree-girls",
    "name": "Girls Denim Dungaree",
    "sku": "KD-0029",
    "category": "Kids",
    "subcategory": "Girls Dungarees",
    "brand": "Little Lane",
    "price": 1290,
    "comparePrice": 1790,
    "discountPercent": 28,
    "rating": 4.4,
    "reviewCount": 724,
    "stock": 10,
    "images": [
      "https://picsum.photos/seed/girls-denim-dungaree-girls-front/700/933",
      "https://picsum.photos/seed/girls-denim-dungaree-girls-back/700/933",
      "https://picsum.photos/seed/girls-denim-dungaree-girls-life/700/933",
      "https://picsum.photos/seed/girls-denim-dungaree-girls-model/700/933"
    ],
    "imageRoles": {
      "front": "https://picsum.photos/seed/girls-denim-dungaree-girls-front/700/933",
      "back": "https://picsum.photos/seed/girls-denim-dungaree-girls-back/700/933",
      "lifestyle": "https://picsum.photos/seed/girls-denim-dungaree-girls-life/700/933",
      "model": "https://picsum.photos/seed/girls-denim-dungaree-girls-model/700/933"
    },
    "colors": [
      {
        "name": "Rust",
        "hex": "#a8562f"
      },
      {
        "name": "White",
        "hex": "#f5f5f5"
      },
      {
        "name": "Maroon",
        "hex": "#6e1f2b"
      }
    ],
    "sizes": [
      "2-3Y",
      "4-5Y",
      "6-7Y",
      "8-9Y",
      "10-11Y",
      "12-13Y"
    ],
    "seo": {
      "title": "Girls Denim Dungaree for Girls – Soft & Playful Everyday Wear",
      "slug": "girls-denim-dungaree-girls",
      "metaTitle": "Girls Denim Dungaree | Buy Online",
      "metaDescription": "Shop the Girls Denim Dungaree in Cotton Denim. Relaxed Fit, solid design for casual. Now 28% off with fast delivery. Free returns. Free returns. Free returns.",
      "keywords": [
        "girls denim dungaree",
        "kids girls dungarees",
        "solid girls dungarees",
        "buy girls denim dungaree online",
        "casual wear",
        "premium girls dungarees"
      ]
    },
    "shortDescription": "The Girls Denim Dungaree blends cotton denim with a relaxed fit for effortless comfort. Featuring a solid design and bib front neckline, it's tailored for casual moments throughout the all season season. A versatile wardrobe staple that pairs easily and wears beautifully day after day.",
    "longDescription": "Meet the Girls Denim Dungaree — a thoughtfully designed girls dungarees that brings together premium materials and a refined fit. Crafted from Cotton Denim, it is built to feel as good as it looks. The fabric is carefully selected for its soft hand-feel, resilience and natural drape, giving you a piece that holds its shape and color through repeated wear. Every detail — from the bib front to the precision-finished seams and durable trims — reflects a genuine commitment to premium craftsmanship that you can see and feel.\n\nFabric & Comfort: Cotton Denim offers a balance of softness and structure that sits comfortably against the skin. The weave is breathable and gentle, helping regulate temperature so you stay fresh through busy days. The relaxed fit allows a natural range of movement without feeling restrictive, while careful tailoring ensures a clean, flattering line. The sleeveless cut adds balance to the overall silhouette, making this an easy choice when you want to look put-together without compromising on ease or all-day wearability.\n\nStyle Benefits: the solid aesthetic makes this a genuinely versatile addition to any wardrobe. It layers effortlessly, mixes with both relaxed and elevated pieces, and adapts to your mood and the moment. Whether you dress it up or keep it understated, the Girls Denim Dungaree delivers a modern, considered look. The colorways are chosen to complement a wide range of skin tones and existing outfits, so styling it is intuitive rather than complicated.\n\nUsage Scenarios: ideally suited for casual settings throughout the all season season, this piece transitions smoothly across your day. Wear it for casual outings, weekend plans, travel, gatherings with friends, or relaxed time at home. Its adaptable design means it works across your existing wardrobe with minimal effort, quickly becoming a reliable go-to you will reach for again and again — versatile enough to earn its place season after season.\n\nCare Instructions: to keep the Girls Denim Dungaree looking its best, machine wash cold with similar colors on a gentle cycle. Do not bleach, and avoid harsh detergents that can dull the finish. Tumble dry on low or line dry in shade to protect the fibers, and warm iron on the reverse if needed. Avoid wringing to preserve the fabric structure and shape. With this simple care routine, your piece will stay fresh, soft and vibrant wash after wash — a smart, long-lasting investment in your everyday style.",
    "features": [
      "Premium Cotton fabric",
      "Breathable, skin-friendly material",
      "Fade-resistant color retention",
      "Soft-touch finish for all-day comfort",
      "Lightweight, easy-to-wear construction",
      "Relaxed Fit for a flattering silhouette",
      "Reinforced stitching for durability"
    ],
    "specifications": {
      "Material": "Cotton Denim",
      "Fit Type": "Relaxed Fit",
      "Sleeve Type": "Sleeveless",
      "Neck Type": "Bib Front",
      "Pattern": "Solid",
      "Occasion": "Casual",
      "Season": "All Season",
      "Gender": "Girls",
      "Country of Origin": "Bangladesh"
    },
    "sizeGuide": [
      {
        "size": "2-3Y",
        "chest": "26",
        "waist": "24",
        "length": "40",
        "height": "98"
      },
      {
        "size": "4-5Y",
        "chest": "28",
        "waist": "26",
        "length": "44",
        "height": "110"
      },
      {
        "size": "6-7Y",
        "chest": "30",
        "waist": "28",
        "length": "48",
        "height": "122"
      },
      {
        "size": "8-9Y",
        "chest": "32",
        "waist": "30",
        "length": "52",
        "height": "134"
      },
      {
        "size": "10-11Y",
        "chest": "34",
        "waist": "32",
        "length": "56",
        "height": "146"
      },
      {
        "size": "12-13Y",
        "chest": "36",
        "waist": "34",
        "length": "60",
        "height": "158"
      }
    ],
    "reviews": [
      {
        "name": "Tasnia Mim",
        "rating": 4,
        "text": "Soft, lightweight and well finished. Exactly what I was looking for.",
        "date": "2025-11-03"
      },
      {
        "name": "Omar Faruk",
        "rating": 5,
        "text": "Fantastic everyday piece — versatile, stylish and easy to care for.",
        "date": "2025-10-25"
      },
      {
        "name": "Arman Hossain",
        "rating": 4,
        "text": "Absolutely love the quality, the fabric feels premium and the fit is spot on.",
        "date": "2025-10-16"
      },
      {
        "name": "Nusrat Jahan",
        "rating": 5,
        "text": "Exceeded my expectations — stitching is clean and the color is exactly as shown.",
        "date": "2025-10-07"
      },
      {
        "name": "Tanvir Ahmed",
        "rating": 3,
        "text": "Comfortable and well made, delivery took a little longer than expected.",
        "date": "2025-09-28"
      },
      {
        "name": "Sadia Islam",
        "rating": 5,
        "text": "Great value for the price. Delivery was fast and packaging was neat.",
        "date": "2025-09-19"
      },
      {
        "name": "Rakib Hasan",
        "rating": 4,
        "text": "The material breathes really well, perfect for our weather. Highly recommend.",
        "date": "2025-09-10"
      },
      {
        "name": "Mitu Akter",
        "rating": 5,
        "text": "Looks even better in person. Got compliments the first time I wore it.",
        "date": "2025-09-01"
      },
      {
        "name": "Farhan Kabir",
        "rating": 4,
        "text": "True to size and holds up well after multiple washes. Very happy.",
        "date": "2025-08-23"
      }
    ],
    "relatedIds": [
      "prod-025",
      "prod-026",
      "prod-027",
      "prod-028"
    ],
    "frequentlyBoughtTogetherIds": [
      "prod-026",
      "prod-027"
    ],
    "customersAlsoBoughtIds": [
      "prod-037",
      "prod-038",
      "prod-039",
      "prod-040"
    ]
  },
  {
    "id": "prod-030",
    "slug": "boys-hooded-sweatshirt-boys",
    "name": "Boys Hooded Sweatshirt",
    "sku": "KD-0030",
    "category": "Kids",
    "subcategory": "Boys Sweatshirts",
    "brand": "Little Lane",
    "price": 1190,
    "comparePrice": 1690,
    "discountPercent": 30,
    "rating": 4.7,
    "reviewCount": 781,
    "stock": 23,
    "images": [
      "https://picsum.photos/seed/boys-hooded-sweatshirt-boys-front/700/933",
      "https://picsum.photos/seed/boys-hooded-sweatshirt-boys-back/700/933",
      "https://picsum.photos/seed/boys-hooded-sweatshirt-boys-life/700/933",
      "https://picsum.photos/seed/boys-hooded-sweatshirt-boys-model/700/933"
    ],
    "imageRoles": {
      "front": "https://picsum.photos/seed/boys-hooded-sweatshirt-boys-front/700/933",
      "back": "https://picsum.photos/seed/boys-hooded-sweatshirt-boys-back/700/933",
      "lifestyle": "https://picsum.photos/seed/boys-hooded-sweatshirt-boys-life/700/933",
      "model": "https://picsum.photos/seed/boys-hooded-sweatshirt-boys-model/700/933"
    },
    "colors": [
      {
        "name": "Lavender",
        "hex": "#b9a7d6"
      },
      {
        "name": "Navy",
        "hex": "#1f2a44"
      },
      {
        "name": "Beige",
        "hex": "#d8c7a8"
      }
    ],
    "sizes": [
      "2-3Y",
      "4-5Y",
      "6-7Y",
      "8-9Y",
      "10-11Y",
      "12-13Y"
    ],
    "seo": {
      "title": "Boys Hooded Sweatshirt for Boys – Soft & Playful Everyday Wear",
      "slug": "boys-hooded-sweatshirt-boys",
      "metaTitle": "Boys Hooded Sweatshirt | Buy Online",
      "metaDescription": "Shop the Boys Hooded Sweatshirt in Fleece-Backed Cotton. Regular Fit, solid design for winter casual. Now 30% off with fast delivery. Free returns. Free returns",
      "keywords": [
        "boys hooded sweatshirt",
        "kids boys sweatshirts",
        "solid boys sweatshirts",
        "buy boys hooded sweatshirt online",
        "winter casual wear",
        "premium boys sweatshirts"
      ]
    },
    "shortDescription": "The Boys Hooded Sweatshirt blends fleece-backed cotton with a regular fit for effortless comfort. Featuring a solid design and hooded neckline, it's tailored for winter casual moments throughout the winter season. A versatile wardrobe staple that pairs easily and wears beautifully day after day.",
    "longDescription": "Meet the Boys Hooded Sweatshirt — a thoughtfully designed boys sweatshirts that brings together premium materials and a refined fit. Crafted from Fleece-Backed Cotton, it is built to feel as good as it looks. The fabric is carefully selected for its soft hand-feel, resilience and natural drape, giving you a piece that holds its shape and color through repeated wear. Every detail — from the hooded to the precision-finished seams and durable trims — reflects a genuine commitment to premium craftsmanship that you can see and feel.\n\nFabric & Comfort: Fleece-Backed Cotton offers a balance of softness and structure that sits comfortably against the skin. The weave is breathable and gentle, helping regulate temperature so you stay fresh through busy days. The regular fit allows a natural range of movement without feeling restrictive, while careful tailoring ensures a clean, flattering line. The full sleeve cut adds balance to the overall silhouette, making this an easy choice when you want to look put-together without compromising on ease or all-day wearability.\n\nStyle Benefits: the solid aesthetic makes this a genuinely versatile addition to any wardrobe. It layers effortlessly, mixes with both relaxed and elevated pieces, and adapts to your mood and the moment. Whether you dress it up or keep it understated, the Boys Hooded Sweatshirt delivers a modern, considered look. The colorways are chosen to complement a wide range of skin tones and existing outfits, so styling it is intuitive rather than complicated.\n\nUsage Scenarios: ideally suited for winter casual settings throughout the winter season, this piece transitions smoothly across your day. Wear it for casual outings, weekend plans, travel, gatherings with friends, or relaxed time at home. Its adaptable design means it works across your existing wardrobe with minimal effort, quickly becoming a reliable go-to you will reach for again and again — versatile enough to earn its place season after season.\n\nCare Instructions: to keep the Boys Hooded Sweatshirt looking its best, machine wash cold with similar colors on a gentle cycle. Do not bleach, and avoid harsh detergents that can dull the finish. Tumble dry on low or line dry in shade to protect the fibers, and warm iron on the reverse if needed. Avoid wringing to preserve the fabric structure and shape. With this simple care routine, your piece will stay fresh, soft and vibrant wash after wash — a smart, long-lasting investment in your everyday style.",
    "features": [
      "Premium Fleece-Backed fabric",
      "Breathable, skin-friendly material",
      "Fade-resistant color retention",
      "Soft-touch finish for all-day comfort",
      "Lightweight, easy-to-wear construction",
      "Regular Fit for a flattering silhouette",
      "Reinforced stitching for durability"
    ],
    "specifications": {
      "Material": "Fleece-Backed Cotton",
      "Fit Type": "Regular Fit",
      "Sleeve Type": "Full Sleeve",
      "Neck Type": "Hooded",
      "Pattern": "Solid",
      "Occasion": "Winter Casual",
      "Season": "Winter",
      "Gender": "Boys",
      "Country of Origin": "Bangladesh"
    },
    "sizeGuide": [
      {
        "size": "2-3Y",
        "chest": "26",
        "waist": "24",
        "length": "40",
        "height": "98"
      },
      {
        "size": "4-5Y",
        "chest": "28",
        "waist": "26",
        "length": "44",
        "height": "110"
      },
      {
        "size": "6-7Y",
        "chest": "30",
        "waist": "28",
        "length": "48",
        "height": "122"
      },
      {
        "size": "8-9Y",
        "chest": "32",
        "waist": "30",
        "length": "52",
        "height": "134"
      },
      {
        "size": "10-11Y",
        "chest": "34",
        "waist": "32",
        "length": "56",
        "height": "146"
      },
      {
        "size": "12-13Y",
        "chest": "36",
        "waist": "34",
        "length": "60",
        "height": "158"
      }
    ],
    "reviews": [
      {
        "name": "Omar Faruk",
        "rating": 5,
        "text": "Fantastic everyday piece — versatile, stylish and easy to care for.",
        "date": "2025-11-02"
      },
      {
        "name": "Arman Hossain",
        "rating": 4,
        "text": "Absolutely love the quality, the fabric feels premium and the fit is spot on.",
        "date": "2025-10-24"
      },
      {
        "name": "Nusrat Jahan",
        "rating": 5,
        "text": "Exceeded my expectations — stitching is clean and the color is exactly as shown.",
        "date": "2025-10-15"
      },
      {
        "name": "Tanvir Ahmed",
        "rating": 4,
        "text": "Super comfortable for all-day wear, I've already ordered a second one.",
        "date": "2025-10-06"
      },
      {
        "name": "Sadia Islam",
        "rating": 3,
        "text": "Happy with it, just wish there were a few more color options.",
        "date": "2025-09-27"
      },
      {
        "name": "Rakib Hasan",
        "rating": 4,
        "text": "The material breathes really well, perfect for our weather. Highly recommend.",
        "date": "2025-09-18"
      },
      {
        "name": "Mitu Akter",
        "rating": 5,
        "text": "Looks even better in person. Got compliments the first time I wore it.",
        "date": "2025-09-09"
      },
      {
        "name": "Farhan Kabir",
        "rating": 4,
        "text": "True to size and holds up well after multiple washes. Very happy.",
        "date": "2025-08-31"
      },
      {
        "name": "Lamia Rahman",
        "rating": 5,
        "text": "Premium feel without the premium markup. Will buy again from this brand.",
        "date": "2025-08-22"
      },
      {
        "name": "Imran Chowdhury",
        "rating": 4,
        "text": "Happy with it, just wish there were a few more color options.",
        "date": "2025-08-13"
      }
    ],
    "relatedIds": [
      "prod-026",
      "prod-027",
      "prod-028",
      "prod-029"
    ],
    "frequentlyBoughtTogetherIds": [
      "prod-027",
      "prod-028"
    ],
    "customersAlsoBoughtIds": [
      "prod-038",
      "prod-039",
      "prod-040",
      "prod-041"
    ]
  },
  {
    "id": "prod-031",
    "slug": "girls-party-frock-girls",
    "name": "Girls Party Frock",
    "sku": "KD-0031",
    "category": "Kids",
    "subcategory": "Girls Dresses",
    "brand": "Little Lane",
    "price": 1590,
    "comparePrice": 2190,
    "discountPercent": 27,
    "rating": 4,
    "reviewCount": 838,
    "stock": 36,
    "images": [
      "https://picsum.photos/seed/girls-party-frock-girls-front/700/933",
      "https://picsum.photos/seed/girls-party-frock-girls-back/700/933",
      "https://picsum.photos/seed/girls-party-frock-girls-life/700/933",
      "https://picsum.photos/seed/girls-party-frock-girls-model/700/933"
    ],
    "imageRoles": {
      "front": "https://picsum.photos/seed/girls-party-frock-girls-front/700/933",
      "back": "https://picsum.photos/seed/girls-party-frock-girls-back/700/933",
      "lifestyle": "https://picsum.photos/seed/girls-party-frock-girls-life/700/933",
      "model": "https://picsum.photos/seed/girls-party-frock-girls-model/700/933"
    },
    "colors": [
      {
        "name": "Black",
        "hex": "#1c1c1c"
      },
      {
        "name": "Charcoal",
        "hex": "#3a3a3a"
      },
      {
        "name": "Sky Blue",
        "hex": "#9fc3e0"
      }
    ],
    "sizes": [
      "2-3Y",
      "4-5Y",
      "6-7Y",
      "8-9Y",
      "10-11Y",
      "12-13Y"
    ],
    "seo": {
      "title": "Girls Party Frock for Girls – Soft & Playful Everyday Wear",
      "slug": "girls-party-frock-girls",
      "metaTitle": "Girls Party Frock | Buy Online",
      "metaDescription": "Shop the Girls Party Frock in Tulle over Satin. Fit and Flare, sequin embellished design for party. Now 27% off with fast delivery. Free returns. Free returns.",
      "keywords": [
        "girls party frock",
        "kids girls dresses",
        "sequin embellished girls dresses",
        "buy girls party frock online",
        "party wear",
        "premium girls dresses"
      ]
    },
    "shortDescription": "The Girls Party Frock blends tulle over satin with a fit and flare for effortless comfort. Featuring a sequin embellished design and round neck neckline, it's tailored for party moments throughout the all season season. A versatile wardrobe staple that pairs easily and wears beautifully day after day.",
    "longDescription": "Meet the Girls Party Frock — a thoughtfully designed girls dresses that brings together premium materials and a refined fit. Crafted from Tulle over Satin, it is built to feel as good as it looks. The fabric is carefully selected for its soft hand-feel, resilience and natural drape, giving you a piece that holds its shape and color through repeated wear. Every detail — from the round neck to the precision-finished seams and durable trims — reflects a genuine commitment to premium craftsmanship that you can see and feel.\n\nFabric & Comfort: Tulle over Satin offers a balance of softness and structure that sits comfortably against the skin. The weave is breathable and gentle, helping regulate temperature so you stay fresh through busy days. The fit and flare allows a natural range of movement without feeling restrictive, while careful tailoring ensures a clean, flattering line. The sleeveless cut adds balance to the overall silhouette, making this an easy choice when you want to look put-together without compromising on ease or all-day wearability.\n\nStyle Benefits: the sequin embellished aesthetic makes this a genuinely versatile addition to any wardrobe. It layers effortlessly, mixes with both relaxed and elevated pieces, and adapts to your mood and the moment. Whether you dress it up or keep it understated, the Girls Party Frock delivers a modern, considered look. The colorways are chosen to complement a wide range of skin tones and existing outfits, so styling it is intuitive rather than complicated.\n\nUsage Scenarios: ideally suited for party settings throughout the all season season, this piece transitions smoothly across your day. Wear it for casual outings, weekend plans, travel, gatherings with friends, or relaxed time at home. Its adaptable design means it works across your existing wardrobe with minimal effort, quickly becoming a reliable go-to you will reach for again and again — versatile enough to earn its place season after season.\n\nCare Instructions: to keep the Girls Party Frock looking its best, machine wash cold with similar colors on a gentle cycle. Do not bleach, and avoid harsh detergents that can dull the finish. Tumble dry on low or line dry in shade to protect the fibers, and warm iron on the reverse if needed. Avoid wringing to preserve the fabric structure and shape. With this simple care routine, your piece will stay fresh, soft and vibrant wash after wash — a smart, long-lasting investment in your everyday style.",
    "features": [
      "Premium Tulle fabric",
      "Breathable, skin-friendly material",
      "Fade-resistant color retention",
      "Soft-touch finish for all-day comfort",
      "Lightweight, easy-to-wear construction",
      "Fit and Flare for a flattering silhouette",
      "Reinforced stitching for durability"
    ],
    "specifications": {
      "Material": "Tulle over Satin",
      "Fit Type": "Fit and Flare",
      "Sleeve Type": "Sleeveless",
      "Neck Type": "Round Neck",
      "Pattern": "Sequin Embellished",
      "Occasion": "Party",
      "Season": "All Season",
      "Gender": "Girls",
      "Country of Origin": "Bangladesh"
    },
    "sizeGuide": [
      {
        "size": "2-3Y",
        "chest": "26",
        "waist": "24",
        "length": "40",
        "height": "98"
      },
      {
        "size": "4-5Y",
        "chest": "28",
        "waist": "26",
        "length": "44",
        "height": "110"
      },
      {
        "size": "6-7Y",
        "chest": "30",
        "waist": "28",
        "length": "48",
        "height": "122"
      },
      {
        "size": "8-9Y",
        "chest": "32",
        "waist": "30",
        "length": "52",
        "height": "134"
      },
      {
        "size": "10-11Y",
        "chest": "34",
        "waist": "32",
        "length": "56",
        "height": "146"
      },
      {
        "size": "12-13Y",
        "chest": "36",
        "waist": "34",
        "length": "60",
        "height": "158"
      }
    ],
    "reviews": [
      {
        "name": "Arman Hossain",
        "rating": 4,
        "text": "Absolutely love the quality, the fabric feels premium and the fit is spot on.",
        "date": "2025-11-01"
      },
      {
        "name": "Nusrat Jahan",
        "rating": 5,
        "text": "Exceeded my expectations — stitching is clean and the color is exactly as shown.",
        "date": "2025-10-23"
      },
      {
        "name": "Tanvir Ahmed",
        "rating": 4,
        "text": "Super comfortable for all-day wear, I've already ordered a second one.",
        "date": "2025-10-14"
      },
      {
        "name": "Sadia Islam",
        "rating": 5,
        "text": "Great value for the price. Delivery was fast and packaging was neat.",
        "date": "2025-10-05"
      },
      {
        "name": "Rakib Hasan",
        "rating": 3,
        "text": "Decent fabric for the price, the fit runs a touch slim.",
        "date": "2025-09-26"
      }
    ],
    "relatedIds": [
      "prod-027",
      "prod-028",
      "prod-029",
      "prod-030"
    ],
    "frequentlyBoughtTogetherIds": [
      "prod-028",
      "prod-029"
    ],
    "customersAlsoBoughtIds": [
      "prod-039",
      "prod-040",
      "prod-041",
      "prod-042"
    ]
  },
  {
    "id": "prod-032",
    "slug": "kids-cotton-pajama-set-unisex-kids",
    "name": "Kids Cotton Pajama Set",
    "sku": "KD-0032",
    "category": "Kids",
    "subcategory": "Sleepwear",
    "brand": "Little Lane",
    "price": 790,
    "comparePrice": 1090,
    "discountPercent": 28,
    "rating": 4.3,
    "reviewCount": 895,
    "stock": 49,
    "images": [
      "https://picsum.photos/seed/kids-cotton-pajama-set-unisex-kids-front/700/933",
      "https://picsum.photos/seed/kids-cotton-pajama-set-unisex-kids-back/700/933",
      "https://picsum.photos/seed/kids-cotton-pajama-set-unisex-kids-life/700/933",
      "https://picsum.photos/seed/kids-cotton-pajama-set-unisex-kids-model/700/933"
    ],
    "imageRoles": {
      "front": "https://picsum.photos/seed/kids-cotton-pajama-set-unisex-kids-front/700/933",
      "back": "https://picsum.photos/seed/kids-cotton-pajama-set-unisex-kids-back/700/933",
      "lifestyle": "https://picsum.photos/seed/kids-cotton-pajama-set-unisex-kids-life/700/933",
      "model": "https://picsum.photos/seed/kids-cotton-pajama-set-unisex-kids-model/700/933"
    },
    "colors": [
      {
        "name": "White",
        "hex": "#f5f5f5"
      },
      {
        "name": "Olive",
        "hex": "#5b5a3a"
      },
      {
        "name": "Mustard",
        "hex": "#d6a531"
      }
    ],
    "sizes": [
      "2-3Y",
      "4-5Y",
      "6-7Y",
      "8-9Y",
      "10-11Y",
      "12-13Y"
    ],
    "seo": {
      "title": "Kids Cotton Pajama Set for Unisex Kids – Soft & Playful Everyday Wear",
      "slug": "kids-cotton-pajama-set-unisex-kids",
      "metaTitle": "Kids Cotton Pajama Set | Buy Online",
      "metaDescription": "Shop the Kids Cotton Pajama Set in 100% Cotton Knit. Regular Fit, printed design for sleepwear. Now 28% off with fast delivery. Free returns. Free returns.",
      "keywords": [
        "kids cotton pajama set",
        "kids sleepwear",
        "printed sleepwear",
        "buy kids cotton pajama set online",
        "sleepwear wear",
        "premium sleepwear"
      ]
    },
    "shortDescription": "The Kids Cotton Pajama Set blends 100% cotton knit with a regular fit for effortless comfort. Featuring a printed design and crew neck neckline, it's tailored for sleepwear moments throughout the all season season. A versatile wardrobe staple that pairs easily and wears beautifully day after day.",
    "longDescription": "Meet the Kids Cotton Pajama Set — a thoughtfully designed sleepwear that brings together premium materials and a refined fit. Crafted from 100% Cotton Knit, it is built to feel as good as it looks. The fabric is carefully selected for its soft hand-feel, resilience and natural drape, giving you a piece that holds its shape and color through repeated wear. Every detail — from the crew neck to the precision-finished seams and durable trims — reflects a genuine commitment to premium craftsmanship that you can see and feel.\n\nFabric & Comfort: 100% Cotton Knit offers a balance of softness and structure that sits comfortably against the skin. The weave is breathable and gentle, helping regulate temperature so you stay fresh through busy days. The regular fit allows a natural range of movement without feeling restrictive, while careful tailoring ensures a clean, flattering line. The full sleeve cut adds balance to the overall silhouette, making this an easy choice when you want to look put-together without compromising on ease or all-day wearability.\n\nStyle Benefits: the printed aesthetic makes this a genuinely versatile addition to any wardrobe. It layers effortlessly, mixes with both relaxed and elevated pieces, and adapts to your mood and the moment. Whether you dress it up or keep it understated, the Kids Cotton Pajama Set delivers a modern, considered look. The colorways are chosen to complement a wide range of skin tones and existing outfits, so styling it is intuitive rather than complicated.\n\nUsage Scenarios: ideally suited for sleepwear settings throughout the all season season, this piece transitions smoothly across your day. Wear it for casual outings, weekend plans, travel, gatherings with friends, or relaxed time at home. Its adaptable design means it works across your existing wardrobe with minimal effort, quickly becoming a reliable go-to you will reach for again and again — versatile enough to earn its place season after season.\n\nCare Instructions: to keep the Kids Cotton Pajama Set looking its best, machine wash cold with similar colors on a gentle cycle. Do not bleach, and avoid harsh detergents that can dull the finish. Tumble dry on low or line dry in shade to protect the fibers, and warm iron on the reverse if needed. Avoid wringing to preserve the fabric structure and shape. With this simple care routine, your piece will stay fresh, soft and vibrant wash after wash — a smart, long-lasting investment in your everyday style.",
    "features": [
      "Premium 100% fabric",
      "Breathable, skin-friendly material",
      "Fade-resistant color retention",
      "Soft-touch finish for all-day comfort",
      "Lightweight, easy-to-wear construction",
      "Regular Fit for a flattering silhouette",
      "Reinforced stitching for durability"
    ],
    "specifications": {
      "Material": "100% Cotton Knit",
      "Fit Type": "Regular Fit",
      "Sleeve Type": "Full Sleeve",
      "Neck Type": "Crew Neck",
      "Pattern": "Printed",
      "Occasion": "Sleepwear",
      "Season": "All Season",
      "Gender": "Unisex Kids",
      "Country of Origin": "Bangladesh"
    },
    "sizeGuide": [
      {
        "size": "2-3Y",
        "chest": "26",
        "waist": "24",
        "length": "40",
        "height": "98"
      },
      {
        "size": "4-5Y",
        "chest": "28",
        "waist": "26",
        "length": "44",
        "height": "110"
      },
      {
        "size": "6-7Y",
        "chest": "30",
        "waist": "28",
        "length": "48",
        "height": "122"
      },
      {
        "size": "8-9Y",
        "chest": "32",
        "waist": "30",
        "length": "52",
        "height": "134"
      },
      {
        "size": "10-11Y",
        "chest": "34",
        "waist": "32",
        "length": "56",
        "height": "146"
      },
      {
        "size": "12-13Y",
        "chest": "36",
        "waist": "34",
        "length": "60",
        "height": "158"
      }
    ],
    "reviews": [
      {
        "name": "Nusrat Jahan",
        "rating": 5,
        "text": "Exceeded my expectations — stitching is clean and the color is exactly as shown.",
        "date": "2025-10-31"
      },
      {
        "name": "Tanvir Ahmed",
        "rating": 4,
        "text": "Super comfortable for all-day wear, I've already ordered a second one.",
        "date": "2025-10-22"
      },
      {
        "name": "Sadia Islam",
        "rating": 5,
        "text": "Great value for the price. Delivery was fast and packaging was neat.",
        "date": "2025-10-13"
      },
      {
        "name": "Rakib Hasan",
        "rating": 4,
        "text": "The material breathes really well, perfect for our weather. Highly recommend.",
        "date": "2025-10-04"
      },
      {
        "name": "Mitu Akter",
        "rating": 3,
        "text": "Good product overall, though I'd suggest sizing up for a relaxed fit.",
        "date": "2025-09-25"
      },
      {
        "name": "Farhan Kabir",
        "rating": 4,
        "text": "True to size and holds up well after multiple washes. Very happy.",
        "date": "2025-09-16"
      }
    ],
    "relatedIds": [
      "prod-028",
      "prod-029",
      "prod-030",
      "prod-031"
    ],
    "frequentlyBoughtTogetherIds": [
      "prod-029",
      "prod-030"
    ],
    "customersAlsoBoughtIds": [
      "prod-040",
      "prod-041",
      "prod-042",
      "prod-043"
    ]
  },
  {
    "id": "prod-033",
    "slug": "teen-oversized-hoodie-teens",
    "name": "Teen Oversized Hoodie",
    "sku": "TN-0033",
    "category": "Teens",
    "subcategory": "Hoodies",
    "brand": "Volt & Co.",
    "price": 1690,
    "comparePrice": 2390,
    "discountPercent": 29,
    "rating": 4.6,
    "reviewCount": 952,
    "stock": 62,
    "images": [
      "https://picsum.photos/seed/teen-oversized-hoodie-teens-front/700/933",
      "https://picsum.photos/seed/teen-oversized-hoodie-teens-back/700/933",
      "https://picsum.photos/seed/teen-oversized-hoodie-teens-life/700/933",
      "https://picsum.photos/seed/teen-oversized-hoodie-teens-model/700/933"
    ],
    "imageRoles": {
      "front": "https://picsum.photos/seed/teen-oversized-hoodie-teens-front/700/933",
      "back": "https://picsum.photos/seed/teen-oversized-hoodie-teens-back/700/933",
      "lifestyle": "https://picsum.photos/seed/teen-oversized-hoodie-teens-life/700/933",
      "model": "https://picsum.photos/seed/teen-oversized-hoodie-teens-model/700/933"
    },
    "colors": [
      {
        "name": "Navy",
        "hex": "#1f2a44"
      },
      {
        "name": "Maroon",
        "hex": "#6e1f2b"
      },
      {
        "name": "Teal",
        "hex": "#1f6f6b"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "seo": {
      "title": "Teen Oversized Hoodie for Teens – Trendy Streetwear Essential",
      "slug": "teen-oversized-hoodie-teens",
      "metaTitle": "Teen Oversized Hoodie | Buy Online",
      "metaDescription": "Shop the Teen Oversized Hoodie in 320 GSM Brushed Fleece. Oversized Fit, minimal print design for streetwear. Now 29% off with fast delivery. Free returns.",
      "keywords": [
        "teen oversized hoodie",
        "teens hoodies",
        "minimal print hoodies",
        "buy teen oversized hoodie online",
        "streetwear wear",
        "premium hoodies"
      ]
    },
    "shortDescription": "The Teen Oversized Hoodie blends 320 gsm brushed fleece with a oversized fit for effortless comfort. Featuring a minimal print design and hooded neckline, it's tailored for streetwear moments throughout the winter season. A versatile wardrobe staple that pairs easily and wears beautifully day after day.",
    "longDescription": "Meet the Teen Oversized Hoodie — a thoughtfully designed hoodies that brings together premium materials and a refined fit. Crafted from 320 GSM Brushed Fleece, it is built to feel as good as it looks. The fabric is carefully selected for its soft hand-feel, resilience and natural drape, giving you a piece that holds its shape and color through repeated wear. Every detail — from the hooded to the precision-finished seams and durable trims — reflects a genuine commitment to premium craftsmanship that you can see and feel.\n\nFabric & Comfort: 320 GSM Brushed Fleece offers a balance of softness and structure that sits comfortably against the skin. The weave is breathable and gentle, helping regulate temperature so you stay fresh through busy days. The oversized fit allows a natural range of movement without feeling restrictive, while careful tailoring ensures a clean, flattering line. The full sleeve cut adds balance to the overall silhouette, making this an easy choice when you want to look put-together without compromising on ease or all-day wearability.\n\nStyle Benefits: the minimal print aesthetic makes this a genuinely versatile addition to any wardrobe. It layers effortlessly, mixes with both relaxed and elevated pieces, and adapts to your mood and the moment. Whether you dress it up or keep it understated, the Teen Oversized Hoodie delivers a modern, considered look. The colorways are chosen to complement a wide range of skin tones and existing outfits, so styling it is intuitive rather than complicated.\n\nUsage Scenarios: ideally suited for streetwear settings throughout the winter season, this piece transitions smoothly across your day. Wear it for casual outings, weekend plans, travel, gatherings with friends, or relaxed time at home. Its adaptable design means it works across your existing wardrobe with minimal effort, quickly becoming a reliable go-to you will reach for again and again — versatile enough to earn its place season after season.\n\nCare Instructions: to keep the Teen Oversized Hoodie looking its best, machine wash cold with similar colors on a gentle cycle. Do not bleach, and avoid harsh detergents that can dull the finish. Tumble dry on low or line dry in shade to protect the fibers, and warm iron on the reverse if needed. Avoid wringing to preserve the fabric structure and shape. With this simple care routine, your piece will stay fresh, soft and vibrant wash after wash — a smart, long-lasting investment in your everyday style.",
    "features": [
      "Premium 320 fabric",
      "Breathable, skin-friendly material",
      "Fade-resistant color retention",
      "Soft-touch finish for all-day comfort",
      "Lightweight, easy-to-wear construction",
      "Oversized Fit for a flattering silhouette",
      "Reinforced stitching for durability"
    ],
    "specifications": {
      "Material": "320 GSM Brushed Fleece",
      "Fit Type": "Oversized Fit",
      "Sleeve Type": "Full Sleeve",
      "Neck Type": "Hooded",
      "Pattern": "Minimal Print",
      "Occasion": "Streetwear",
      "Season": "Winter",
      "Gender": "Unisex Teen",
      "Country of Origin": "Bangladesh"
    },
    "sizeGuide": [
      {
        "size": "XS",
        "chest": "34",
        "waist": "28",
        "length": "66",
        "shoulder": "40"
      },
      {
        "size": "S",
        "chest": "36",
        "waist": "30",
        "length": "68",
        "shoulder": "42"
      },
      {
        "size": "M",
        "chest": "38",
        "waist": "32",
        "length": "70",
        "shoulder": "44"
      },
      {
        "size": "L",
        "chest": "40",
        "waist": "34",
        "length": "72",
        "shoulder": "46"
      },
      {
        "size": "XL",
        "chest": "42",
        "waist": "36",
        "length": "74",
        "shoulder": "48"
      },
      {
        "size": "XXL",
        "chest": "44",
        "waist": "38",
        "length": "76",
        "shoulder": "50"
      }
    ],
    "reviews": [
      {
        "name": "Tanvir Ahmed",
        "rating": 4,
        "text": "Super comfortable for all-day wear, I've already ordered a second one.",
        "date": "2025-10-30"
      },
      {
        "name": "Sadia Islam",
        "rating": 5,
        "text": "Great value for the price. Delivery was fast and packaging was neat.",
        "date": "2025-10-21"
      },
      {
        "name": "Rakib Hasan",
        "rating": 4,
        "text": "The material breathes really well, perfect for our weather. Highly recommend.",
        "date": "2025-10-12"
      },
      {
        "name": "Mitu Akter",
        "rating": 5,
        "text": "Looks even better in person. Got compliments the first time I wore it.",
        "date": "2025-10-03"
      },
      {
        "name": "Farhan Kabir",
        "rating": 3,
        "text": "Nice quality but the color is slightly darker than the picture.",
        "date": "2025-09-24"
      },
      {
        "name": "Lamia Rahman",
        "rating": 5,
        "text": "Premium feel without the premium markup. Will buy again from this brand.",
        "date": "2025-09-15"
      },
      {
        "name": "Imran Chowdhury",
        "rating": 4,
        "text": "Soft, lightweight and well finished. Exactly what I was looking for.",
        "date": "2025-09-06"
      }
    ],
    "relatedIds": [
      "prod-038",
      "prod-039",
      "prod-040",
      "prod-034"
    ],
    "frequentlyBoughtTogetherIds": [
      "prod-039",
      "prod-040"
    ],
    "customersAlsoBoughtIds": [
      "prod-041",
      "prod-042",
      "prod-043",
      "prod-044"
    ]
  },
  {
    "id": "prod-034",
    "slug": "distressed-skinny-jeans-teens",
    "name": "Distressed Skinny Jeans",
    "sku": "TN-0034",
    "category": "Teens",
    "subcategory": "Jeans",
    "brand": "Volt & Co.",
    "price": 1890,
    "comparePrice": 2590,
    "discountPercent": 27,
    "rating": 4.9,
    "reviewCount": 89,
    "stock": 75,
    "images": [
      "https://picsum.photos/seed/distressed-skinny-jeans-teens-front/700/933",
      "https://picsum.photos/seed/distressed-skinny-jeans-teens-back/700/933",
      "https://picsum.photos/seed/distressed-skinny-jeans-teens-life/700/933",
      "https://picsum.photos/seed/distressed-skinny-jeans-teens-model/700/933"
    ],
    "imageRoles": {
      "front": "https://picsum.photos/seed/distressed-skinny-jeans-teens-front/700/933",
      "back": "https://picsum.photos/seed/distressed-skinny-jeans-teens-back/700/933",
      "lifestyle": "https://picsum.photos/seed/distressed-skinny-jeans-teens-life/700/933",
      "model": "https://picsum.photos/seed/distressed-skinny-jeans-teens-model/700/933"
    },
    "colors": [
      {
        "name": "Charcoal",
        "hex": "#3a3a3a"
      },
      {
        "name": "Beige",
        "hex": "#d8c7a8"
      },
      {
        "name": "Coral",
        "hex": "#e8836b"
      }
    ],
    "sizes": [
      "28",
      "30",
      "32",
      "34",
      "36",
      "38"
    ],
    "seo": {
      "title": "Distressed Skinny Jeans for Teens – Trendy Streetwear Essential",
      "slug": "distressed-skinny-jeans-teens",
      "metaTitle": "Distressed Skinny Jeans | Buy Online",
      "metaDescription": "Shop the Distressed Skinny Jeans in Stretch Denim. Skinny Fit, distressed design for casual. Now 27% off with fast delivery. Free returns. Free returns.",
      "keywords": [
        "distressed skinny jeans",
        "teens jeans",
        "distressed jeans",
        "buy distressed skinny jeans online",
        "casual wear",
        "premium jeans"
      ]
    },
    "shortDescription": "The Distressed Skinny Jeans blends stretch denim with a skinny fit for effortless comfort. Featuring a distressed design and it's tailored for casual moments throughout the all season season. A versatile wardrobe staple that pairs easily and wears beautifully day after day.",
    "longDescription": "Meet the Distressed Skinny Jeans — a thoughtfully designed jeans that brings together premium materials and a refined fit. Crafted from Stretch Denim, it is built to feel as good as it looks. The fabric is carefully selected for its soft hand-feel, resilience and natural drape, giving you a piece that holds its shape and color through repeated wear. Every detail — from the clean construction to the precision-finished seams and durable trims — reflects a genuine commitment to premium craftsmanship that you can see and feel.\n\nFabric & Comfort: Stretch Denim offers a balance of softness and structure that sits comfortably against the skin. The weave is breathable and gentle, helping regulate temperature so you stay fresh through busy days. The skinny fit allows a natural range of movement without feeling restrictive, while careful tailoring ensures a clean, flattering line. making this an easy choice when you want to look put-together without compromising on ease or all-day wearability.\n\nStyle Benefits: the distressed aesthetic makes this a genuinely versatile addition to any wardrobe. It layers effortlessly, mixes with both relaxed and elevated pieces, and adapts to your mood and the moment. Whether you dress it up or keep it understated, the Distressed Skinny Jeans delivers a modern, considered look. The colorways are chosen to complement a wide range of skin tones and existing outfits, so styling it is intuitive rather than complicated.\n\nUsage Scenarios: ideally suited for casual settings throughout the all season season, this piece transitions smoothly across your day. Wear it for casual outings, weekend plans, travel, gatherings with friends, or relaxed time at home. Its adaptable design means it works across your existing wardrobe with minimal effort, quickly becoming a reliable go-to you will reach for again and again — versatile enough to earn its place season after season.\n\nCare Instructions: to keep the Distressed Skinny Jeans looking its best, machine wash cold with similar colors on a gentle cycle. Do not bleach, and avoid harsh detergents that can dull the finish. Tumble dry on low or line dry in shade to protect the fibers, and warm iron on the reverse if needed. Avoid wringing to preserve the fabric structure and shape. With this simple care routine, your piece will stay fresh, soft and vibrant wash after wash — a smart, long-lasting investment in your everyday style.",
    "features": [
      "Premium Stretch fabric",
      "Breathable, skin-friendly material",
      "Fade-resistant color retention",
      "Soft-touch finish for all-day comfort",
      "Lightweight, easy-to-wear construction",
      "Skinny Fit for a flattering silhouette",
      "Reinforced stitching for durability"
    ],
    "specifications": {
      "Material": "Stretch Denim",
      "Fit Type": "Skinny Fit",
      "Sleeve Type": "N/A",
      "Neck Type": "N/A",
      "Pattern": "Distressed",
      "Occasion": "Casual",
      "Season": "All Season",
      "Gender": "Unisex Teen",
      "Country of Origin": "Bangladesh"
    },
    "sizeGuide": [
      {
        "size": "28",
        "waist": "28",
        "hip": "36",
        "inseam": "78",
        "length": "104"
      },
      {
        "size": "30",
        "waist": "30",
        "hip": "38",
        "inseam": "78",
        "length": "104"
      },
      {
        "size": "32",
        "waist": "32",
        "hip": "40",
        "inseam": "78",
        "length": "104"
      },
      {
        "size": "34",
        "waist": "34",
        "hip": "42",
        "inseam": "78",
        "length": "104"
      },
      {
        "size": "36",
        "waist": "36",
        "hip": "44",
        "inseam": "78",
        "length": "104"
      },
      {
        "size": "38",
        "waist": "38",
        "hip": "46",
        "inseam": "78",
        "length": "104"
      }
    ],
    "reviews": [
      {
        "name": "Sadia Islam",
        "rating": 5,
        "text": "Great value for the price. Delivery was fast and packaging was neat.",
        "date": "2025-10-29"
      },
      {
        "name": "Rakib Hasan",
        "rating": 4,
        "text": "The material breathes really well, perfect for our weather. Highly recommend.",
        "date": "2025-10-20"
      },
      {
        "name": "Mitu Akter",
        "rating": 5,
        "text": "Looks even better in person. Got compliments the first time I wore it.",
        "date": "2025-10-11"
      },
      {
        "name": "Farhan Kabir",
        "rating": 4,
        "text": "True to size and holds up well after multiple washes. Very happy.",
        "date": "2025-10-02"
      },
      {
        "name": "Lamia Rahman",
        "rating": 3,
        "text": "Comfortable and well made, delivery took a little longer than expected.",
        "date": "2025-09-23"
      },
      {
        "name": "Imran Chowdhury",
        "rating": 4,
        "text": "Soft, lightweight and well finished. Exactly what I was looking for.",
        "date": "2025-09-14"
      },
      {
        "name": "Sumaiya Akhtar",
        "rating": 5,
        "text": "Fantastic everyday piece — versatile, stylish and easy to care for.",
        "date": "2025-09-05"
      },
      {
        "name": "Shahriar Khan",
        "rating": 4,
        "text": "Absolutely love the quality, the fabric feels premium and the fit is spot on.",
        "date": "2025-08-27"
      }
    ],
    "relatedIds": [
      "prod-039",
      "prod-040",
      "prod-033",
      "prod-035"
    ],
    "frequentlyBoughtTogetherIds": [
      "prod-040",
      "prod-033"
    ],
    "customersAlsoBoughtIds": [
      "prod-042",
      "prod-043",
      "prod-044",
      "prod-045"
    ]
  },
  {
    "id": "prod-035",
    "slug": "varsity-bomber-jacket-teens",
    "name": "Varsity Bomber Jacket",
    "sku": "TN-0035",
    "category": "Teens",
    "subcategory": "Jackets",
    "brand": "Volt & Co.",
    "price": 2490,
    "comparePrice": 3490,
    "discountPercent": 29,
    "rating": 4.2,
    "reviewCount": 146,
    "stock": 88,
    "images": [
      "https://picsum.photos/seed/varsity-bomber-jacket-teens-front/700/933",
      "https://picsum.photos/seed/varsity-bomber-jacket-teens-back/700/933",
      "https://picsum.photos/seed/varsity-bomber-jacket-teens-life/700/933",
      "https://picsum.photos/seed/varsity-bomber-jacket-teens-model/700/933"
    ],
    "imageRoles": {
      "front": "https://picsum.photos/seed/varsity-bomber-jacket-teens-front/700/933",
      "back": "https://picsum.photos/seed/varsity-bomber-jacket-teens-back/700/933",
      "lifestyle": "https://picsum.photos/seed/varsity-bomber-jacket-teens-life/700/933",
      "model": "https://picsum.photos/seed/varsity-bomber-jacket-teens-model/700/933"
    },
    "colors": [
      {
        "name": "Olive",
        "hex": "#5b5a3a"
      },
      {
        "name": "Sky Blue",
        "hex": "#9fc3e0"
      },
      {
        "name": "Blush Pink",
        "hex": "#e8b5bf"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "seo": {
      "title": "Varsity Bomber Jacket for Teens – Trendy Streetwear Essential",
      "slug": "varsity-bomber-jacket-teens",
      "metaTitle": "Varsity Bomber Jacket | Buy Online",
      "metaDescription": "Shop the Varsity Bomber Jacket in Cotton Fleece with Rib Trims. Regular Fit, color block design for streetwear. Now 29% off with fast delivery. Free returns.",
      "keywords": [
        "varsity bomber jacket",
        "teens jackets",
        "color block jackets",
        "buy varsity bomber jacket online",
        "streetwear wear",
        "premium jackets"
      ]
    },
    "shortDescription": "The Varsity Bomber Jacket blends cotton fleece with rib trims with a regular fit for effortless comfort. Featuring a color block design and ribbed collar neckline, it's tailored for streetwear moments throughout the winter season. A versatile wardrobe staple that pairs easily and wears beautifully day after day.",
    "longDescription": "Meet the Varsity Bomber Jacket — a thoughtfully designed jackets that brings together premium materials and a refined fit. Crafted from Cotton Fleece with Rib Trims, it is built to feel as good as it looks. The fabric is carefully selected for its soft hand-feel, resilience and natural drape, giving you a piece that holds its shape and color through repeated wear. Every detail — from the ribbed collar to the precision-finished seams and durable trims — reflects a genuine commitment to premium craftsmanship that you can see and feel.\n\nFabric & Comfort: Cotton Fleece with Rib Trims offers a balance of softness and structure that sits comfortably against the skin. The weave is breathable and gentle, helping regulate temperature so you stay fresh through busy days. The regular fit allows a natural range of movement without feeling restrictive, while careful tailoring ensures a clean, flattering line. The full sleeve cut adds balance to the overall silhouette, making this an easy choice when you want to look put-together without compromising on ease or all-day wearability.\n\nStyle Benefits: the color block aesthetic makes this a genuinely versatile addition to any wardrobe. It layers effortlessly, mixes with both relaxed and elevated pieces, and adapts to your mood and the moment. Whether you dress it up or keep it understated, the Varsity Bomber Jacket delivers a modern, considered look. The colorways are chosen to complement a wide range of skin tones and existing outfits, so styling it is intuitive rather than complicated.\n\nUsage Scenarios: ideally suited for streetwear settings throughout the winter season, this piece transitions smoothly across your day. Wear it for casual outings, weekend plans, travel, gatherings with friends, or relaxed time at home. Its adaptable design means it works across your existing wardrobe with minimal effort, quickly becoming a reliable go-to you will reach for again and again — versatile enough to earn its place season after season.\n\nCare Instructions: to keep the Varsity Bomber Jacket looking its best, machine wash cold with similar colors on a gentle cycle. Do not bleach, and avoid harsh detergents that can dull the finish. Tumble dry on low or line dry in shade to protect the fibers, and warm iron on the reverse if needed. Avoid wringing to preserve the fabric structure and shape. With this simple care routine, your piece will stay fresh, soft and vibrant wash after wash — a smart, long-lasting investment in your everyday style.",
    "features": [
      "Premium Cotton fabric",
      "Breathable, skin-friendly material",
      "Fade-resistant color retention",
      "Soft-touch finish for all-day comfort",
      "Lightweight, easy-to-wear construction",
      "Regular Fit for a flattering silhouette",
      "Reinforced stitching for durability"
    ],
    "specifications": {
      "Material": "Cotton Fleece with Rib Trims",
      "Fit Type": "Regular Fit",
      "Sleeve Type": "Full Sleeve",
      "Neck Type": "Ribbed Collar",
      "Pattern": "Color Block",
      "Occasion": "Streetwear",
      "Season": "Winter",
      "Gender": "Unisex Teen",
      "Country of Origin": "Bangladesh"
    },
    "sizeGuide": [
      {
        "size": "XS",
        "chest": "34",
        "waist": "28",
        "length": "66",
        "shoulder": "40"
      },
      {
        "size": "S",
        "chest": "36",
        "waist": "30",
        "length": "68",
        "shoulder": "42"
      },
      {
        "size": "M",
        "chest": "38",
        "waist": "32",
        "length": "70",
        "shoulder": "44"
      },
      {
        "size": "L",
        "chest": "40",
        "waist": "34",
        "length": "72",
        "shoulder": "46"
      },
      {
        "size": "XL",
        "chest": "42",
        "waist": "36",
        "length": "74",
        "shoulder": "48"
      },
      {
        "size": "XXL",
        "chest": "44",
        "waist": "38",
        "length": "76",
        "shoulder": "50"
      }
    ],
    "reviews": [
      {
        "name": "Rakib Hasan",
        "rating": 4,
        "text": "The material breathes really well, perfect for our weather. Highly recommend.",
        "date": "2025-10-28"
      },
      {
        "name": "Mitu Akter",
        "rating": 5,
        "text": "Looks even better in person. Got compliments the first time I wore it.",
        "date": "2025-10-19"
      },
      {
        "name": "Farhan Kabir",
        "rating": 4,
        "text": "True to size and holds up well after multiple washes. Very happy.",
        "date": "2025-10-10"
      },
      {
        "name": "Lamia Rahman",
        "rating": 5,
        "text": "Premium feel without the premium markup. Will buy again from this brand.",
        "date": "2025-10-01"
      },
      {
        "name": "Imran Chowdhury",
        "rating": 3,
        "text": "Happy with it, just wish there were a few more color options.",
        "date": "2025-09-22"
      },
      {
        "name": "Sumaiya Akhtar",
        "rating": 5,
        "text": "Fantastic everyday piece — versatile, stylish and easy to care for.",
        "date": "2025-09-13"
      },
      {
        "name": "Shahriar Khan",
        "rating": 4,
        "text": "Absolutely love the quality, the fabric feels premium and the fit is spot on.",
        "date": "2025-09-04"
      },
      {
        "name": "Tania Sultana",
        "rating": 5,
        "text": "Exceeded my expectations — stitching is clean and the color is exactly as shown.",
        "date": "2025-08-26"
      },
      {
        "name": "Mahin Alam",
        "rating": 4,
        "text": "Super comfortable for all-day wear, I've already ordered a second one.",
        "date": "2025-08-17"
      }
    ],
    "relatedIds": [
      "prod-040",
      "prod-033",
      "prod-034",
      "prod-036"
    ],
    "frequentlyBoughtTogetherIds": [
      "prod-033",
      "prod-034"
    ],
    "customersAlsoBoughtIds": [
      "prod-043",
      "prod-044",
      "prod-045",
      "prod-046"
    ]
  },
  {
    "id": "prod-036",
    "slug": "graphic-crop-top-teens",
    "name": "Graphic Crop Top",
    "sku": "TN-0036",
    "category": "Teens",
    "subcategory": "Tops",
    "brand": "Volt & Co.",
    "price": 690,
    "comparePrice": 990,
    "discountPercent": 30,
    "rating": 4.5,
    "reviewCount": 203,
    "stock": 101,
    "images": [
      "https://picsum.photos/seed/graphic-crop-top-teens-front/700/933",
      "https://picsum.photos/seed/graphic-crop-top-teens-back/700/933",
      "https://picsum.photos/seed/graphic-crop-top-teens-life/700/933",
      "https://picsum.photos/seed/graphic-crop-top-teens-model/700/933"
    ],
    "imageRoles": {
      "front": "https://picsum.photos/seed/graphic-crop-top-teens-front/700/933",
      "back": "https://picsum.photos/seed/graphic-crop-top-teens-back/700/933",
      "lifestyle": "https://picsum.photos/seed/graphic-crop-top-teens-life/700/933",
      "model": "https://picsum.photos/seed/graphic-crop-top-teens-model/700/933"
    },
    "colors": [
      {
        "name": "Maroon",
        "hex": "#6e1f2b"
      },
      {
        "name": "Mustard",
        "hex": "#d6a531"
      },
      {
        "name": "Sage",
        "hex": "#9caf88"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "seo": {
      "title": "Graphic Crop Top for Teens – Trendy Streetwear Essential",
      "slug": "graphic-crop-top-teens",
      "metaTitle": "Graphic Crop Top | Buy Online",
      "metaDescription": "Shop the Graphic Crop Top in Cotton Lycra. Cropped Fit, graphic print design for casual. Now 30% off with fast delivery. Free returns. Free returns. Free return",
      "keywords": [
        "graphic crop top",
        "teens tops",
        "graphic print tops",
        "buy graphic crop top online",
        "casual wear",
        "premium tops"
      ]
    },
    "shortDescription": "The Graphic Crop Top blends cotton lycra with a cropped fit for effortless comfort. Featuring a graphic print design and crew neck neckline, it's tailored for casual moments throughout the summer season. A versatile wardrobe staple that pairs easily and wears beautifully day after day.",
    "longDescription": "Meet the Graphic Crop Top — a thoughtfully designed tops that brings together premium materials and a refined fit. Crafted from Cotton Lycra, it is built to feel as good as it looks. The fabric is carefully selected for its soft hand-feel, resilience and natural drape, giving you a piece that holds its shape and color through repeated wear. Every detail — from the crew neck to the precision-finished seams and durable trims — reflects a genuine commitment to premium craftsmanship that you can see and feel.\n\nFabric & Comfort: Cotton Lycra offers a balance of softness and structure that sits comfortably against the skin. The weave is breathable and gentle, helping regulate temperature so you stay fresh through busy days. The cropped fit allows a natural range of movement without feeling restrictive, while careful tailoring ensures a clean, flattering line. The short sleeve cut adds balance to the overall silhouette, making this an easy choice when you want to look put-together without compromising on ease or all-day wearability.\n\nStyle Benefits: the graphic print aesthetic makes this a genuinely versatile addition to any wardrobe. It layers effortlessly, mixes with both relaxed and elevated pieces, and adapts to your mood and the moment. Whether you dress it up or keep it understated, the Graphic Crop Top delivers a modern, considered look. The colorways are chosen to complement a wide range of skin tones and existing outfits, so styling it is intuitive rather than complicated.\n\nUsage Scenarios: ideally suited for casual settings throughout the summer season, this piece transitions smoothly across your day. Wear it for casual outings, weekend plans, travel, gatherings with friends, or relaxed time at home. Its adaptable design means it works across your existing wardrobe with minimal effort, quickly becoming a reliable go-to you will reach for again and again — versatile enough to earn its place season after season.\n\nCare Instructions: to keep the Graphic Crop Top looking its best, machine wash cold with similar colors on a gentle cycle. Do not bleach, and avoid harsh detergents that can dull the finish. Tumble dry on low or line dry in shade to protect the fibers, and warm iron on the reverse if needed. Avoid wringing to preserve the fabric structure and shape. With this simple care routine, your piece will stay fresh, soft and vibrant wash after wash — a smart, long-lasting investment in your everyday style.",
    "features": [
      "Premium Cotton fabric",
      "Breathable, skin-friendly material",
      "Fade-resistant color retention",
      "Soft-touch finish for all-day comfort",
      "Lightweight, easy-to-wear construction",
      "Cropped Fit for a flattering silhouette",
      "Reinforced stitching for durability"
    ],
    "specifications": {
      "Material": "Cotton Lycra",
      "Fit Type": "Cropped Fit",
      "Sleeve Type": "Short Sleeve",
      "Neck Type": "Crew Neck",
      "Pattern": "Graphic Print",
      "Occasion": "Casual",
      "Season": "Summer",
      "Gender": "Unisex Teen",
      "Country of Origin": "Bangladesh"
    },
    "sizeGuide": [
      {
        "size": "XS",
        "chest": "34",
        "waist": "28",
        "length": "66",
        "shoulder": "40"
      },
      {
        "size": "S",
        "chest": "36",
        "waist": "30",
        "length": "68",
        "shoulder": "42"
      },
      {
        "size": "M",
        "chest": "38",
        "waist": "32",
        "length": "70",
        "shoulder": "44"
      },
      {
        "size": "L",
        "chest": "40",
        "waist": "34",
        "length": "72",
        "shoulder": "46"
      },
      {
        "size": "XL",
        "chest": "42",
        "waist": "36",
        "length": "74",
        "shoulder": "48"
      },
      {
        "size": "XXL",
        "chest": "44",
        "waist": "38",
        "length": "76",
        "shoulder": "50"
      }
    ],
    "reviews": [
      {
        "name": "Mitu Akter",
        "rating": 5,
        "text": "Looks even better in person. Got compliments the first time I wore it.",
        "date": "2025-10-27"
      },
      {
        "name": "Farhan Kabir",
        "rating": 4,
        "text": "True to size and holds up well after multiple washes. Very happy.",
        "date": "2025-10-18"
      },
      {
        "name": "Lamia Rahman",
        "rating": 5,
        "text": "Premium feel without the premium markup. Will buy again from this brand.",
        "date": "2025-10-09"
      },
      {
        "name": "Imran Chowdhury",
        "rating": 4,
        "text": "Soft, lightweight and well finished. Exactly what I was looking for.",
        "date": "2025-09-30"
      },
      {
        "name": "Sumaiya Akhtar",
        "rating": 3,
        "text": "Decent fabric for the price, the fit runs a touch slim.",
        "date": "2025-09-21"
      },
      {
        "name": "Shahriar Khan",
        "rating": 4,
        "text": "Absolutely love the quality, the fabric feels premium and the fit is spot on.",
        "date": "2025-09-12"
      },
      {
        "name": "Tania Sultana",
        "rating": 5,
        "text": "Exceeded my expectations — stitching is clean and the color is exactly as shown.",
        "date": "2025-09-03"
      },
      {
        "name": "Mahin Alam",
        "rating": 4,
        "text": "Super comfortable for all-day wear, I've already ordered a second one.",
        "date": "2025-08-25"
      },
      {
        "name": "Rumana Begum",
        "rating": 5,
        "text": "Great value for the price. Delivery was fast and packaging was neat.",
        "date": "2025-08-16"
      },
      {
        "name": "Naimur Rashid",
        "rating": 4,
        "text": "Decent fabric for the price, the fit runs a touch slim.",
        "date": "2025-08-07"
      }
    ],
    "relatedIds": [
      "prod-033",
      "prod-034",
      "prod-035",
      "prod-037"
    ],
    "frequentlyBoughtTogetherIds": [
      "prod-034",
      "prod-035"
    ],
    "customersAlsoBoughtIds": [
      "prod-044",
      "prod-045",
      "prod-046",
      "prod-047"
    ]
  },
  {
    "id": "prod-037",
    "slug": "cargo-wide-leg-pants-teens",
    "name": "Cargo Wide-Leg Pants",
    "sku": "TN-0037",
    "category": "Teens",
    "subcategory": "Bottoms",
    "brand": "Volt & Co.",
    "price": 1790,
    "comparePrice": 2490,
    "discountPercent": 28,
    "rating": 4.8,
    "reviewCount": 260,
    "stock": 0,
    "images": [
      "https://picsum.photos/seed/cargo-wide-leg-pants-teens-front/700/933",
      "https://picsum.photos/seed/cargo-wide-leg-pants-teens-back/700/933",
      "https://picsum.photos/seed/cargo-wide-leg-pants-teens-life/700/933",
      "https://picsum.photos/seed/cargo-wide-leg-pants-teens-model/700/933"
    ],
    "imageRoles": {
      "front": "https://picsum.photos/seed/cargo-wide-leg-pants-teens-front/700/933",
      "back": "https://picsum.photos/seed/cargo-wide-leg-pants-teens-back/700/933",
      "lifestyle": "https://picsum.photos/seed/cargo-wide-leg-pants-teens-life/700/933",
      "model": "https://picsum.photos/seed/cargo-wide-leg-pants-teens-model/700/933"
    },
    "colors": [
      {
        "name": "Beige",
        "hex": "#d8c7a8"
      },
      {
        "name": "Teal",
        "hex": "#1f6f6b"
      },
      {
        "name": "Rust",
        "hex": "#a8562f"
      }
    ],
    "sizes": [
      "28",
      "30",
      "32",
      "34",
      "36",
      "38"
    ],
    "seo": {
      "title": "Cargo Wide-Leg Pants for Teens – Trendy Streetwear Essential",
      "slug": "cargo-wide-leg-pants-teens",
      "metaTitle": "Cargo Wide-Leg Pants | Buy Online",
      "metaDescription": "Shop the Cargo Wide-Leg Pants in Cotton Canvas. Wide Leg, solid design for streetwear. Now 28% off with fast delivery. Free returns. Free returns. Free returns.",
      "keywords": [
        "cargo wide-leg pants",
        "teens bottoms",
        "solid bottoms",
        "buy cargo wide-leg pants online",
        "streetwear wear",
        "premium bottoms"
      ]
    },
    "shortDescription": "The Cargo Wide-Leg Pants blends cotton canvas with a wide leg for effortless comfort. Featuring a solid design and it's tailored for streetwear moments throughout the all season season. A versatile wardrobe staple that pairs easily and wears beautifully day after day.",
    "longDescription": "Meet the Cargo Wide-Leg Pants — a thoughtfully designed bottoms that brings together premium materials and a refined fit. Crafted from Cotton Canvas, it is built to feel as good as it looks. The fabric is carefully selected for its soft hand-feel, resilience and natural drape, giving you a piece that holds its shape and color through repeated wear. Every detail — from the clean construction to the precision-finished seams and durable trims — reflects a genuine commitment to premium craftsmanship that you can see and feel.\n\nFabric & Comfort: Cotton Canvas offers a balance of softness and structure that sits comfortably against the skin. The weave is breathable and gentle, helping regulate temperature so you stay fresh through busy days. The wide leg allows a natural range of movement without feeling restrictive, while careful tailoring ensures a clean, flattering line. making this an easy choice when you want to look put-together without compromising on ease or all-day wearability.\n\nStyle Benefits: the solid aesthetic makes this a genuinely versatile addition to any wardrobe. It layers effortlessly, mixes with both relaxed and elevated pieces, and adapts to your mood and the moment. Whether you dress it up or keep it understated, the Cargo Wide-Leg Pants delivers a modern, considered look. The colorways are chosen to complement a wide range of skin tones and existing outfits, so styling it is intuitive rather than complicated.\n\nUsage Scenarios: ideally suited for streetwear settings throughout the all season season, this piece transitions smoothly across your day. Wear it for casual outings, weekend plans, travel, gatherings with friends, or relaxed time at home. Its adaptable design means it works across your existing wardrobe with minimal effort, quickly becoming a reliable go-to you will reach for again and again — versatile enough to earn its place season after season.\n\nCare Instructions: to keep the Cargo Wide-Leg Pants looking its best, machine wash cold with similar colors on a gentle cycle. Do not bleach, and avoid harsh detergents that can dull the finish. Tumble dry on low or line dry in shade to protect the fibers, and warm iron on the reverse if needed. Avoid wringing to preserve the fabric structure and shape. With this simple care routine, your piece will stay fresh, soft and vibrant wash after wash — a smart, long-lasting investment in your everyday style.",
    "features": [
      "Premium Cotton fabric",
      "Breathable, skin-friendly material",
      "Fade-resistant color retention",
      "Soft-touch finish for all-day comfort",
      "Lightweight, easy-to-wear construction",
      "Wide Leg for a flattering silhouette",
      "Reinforced stitching for durability"
    ],
    "specifications": {
      "Material": "Cotton Canvas",
      "Fit Type": "Wide Leg",
      "Sleeve Type": "N/A",
      "Neck Type": "N/A",
      "Pattern": "Solid",
      "Occasion": "Streetwear",
      "Season": "All Season",
      "Gender": "Unisex Teen",
      "Country of Origin": "Bangladesh"
    },
    "sizeGuide": [
      {
        "size": "28",
        "waist": "28",
        "hip": "36",
        "inseam": "78",
        "length": "104"
      },
      {
        "size": "30",
        "waist": "30",
        "hip": "38",
        "inseam": "78",
        "length": "104"
      },
      {
        "size": "32",
        "waist": "32",
        "hip": "40",
        "inseam": "78",
        "length": "104"
      },
      {
        "size": "34",
        "waist": "34",
        "hip": "42",
        "inseam": "78",
        "length": "104"
      },
      {
        "size": "36",
        "waist": "36",
        "hip": "44",
        "inseam": "78",
        "length": "104"
      },
      {
        "size": "38",
        "waist": "38",
        "hip": "46",
        "inseam": "78",
        "length": "104"
      }
    ],
    "reviews": [
      {
        "name": "Farhan Kabir",
        "rating": 4,
        "text": "True to size and holds up well after multiple washes. Very happy.",
        "date": "2025-10-26"
      },
      {
        "name": "Lamia Rahman",
        "rating": 5,
        "text": "Premium feel without the premium markup. Will buy again from this brand.",
        "date": "2025-10-17"
      },
      {
        "name": "Imran Chowdhury",
        "rating": 4,
        "text": "Soft, lightweight and well finished. Exactly what I was looking for.",
        "date": "2025-10-08"
      },
      {
        "name": "Sumaiya Akhtar",
        "rating": 5,
        "text": "Fantastic everyday piece — versatile, stylish and easy to care for.",
        "date": "2025-09-29"
      },
      {
        "name": "Shahriar Khan",
        "rating": 3,
        "text": "Good product overall, though I'd suggest sizing up for a relaxed fit.",
        "date": "2025-09-20"
      }
    ],
    "relatedIds": [
      "prod-034",
      "prod-035",
      "prod-036",
      "prod-038"
    ],
    "frequentlyBoughtTogetherIds": [
      "prod-035",
      "prod-036"
    ],
    "customersAlsoBoughtIds": [
      "prod-045",
      "prod-046",
      "prod-047",
      "prod-048"
    ]
  },
  {
    "id": "prod-038",
    "slug": "pleated-mini-skirt-teens",
    "name": "Pleated Mini Skirt",
    "sku": "TN-0038",
    "category": "Teens",
    "subcategory": "Skirts",
    "brand": "Volt & Co.",
    "price": 990,
    "comparePrice": 1390,
    "discountPercent": 29,
    "rating": 4.1,
    "reviewCount": 317,
    "stock": 127,
    "images": [
      "https://picsum.photos/seed/pleated-mini-skirt-teens-front/700/933",
      "https://picsum.photos/seed/pleated-mini-skirt-teens-back/700/933",
      "https://picsum.photos/seed/pleated-mini-skirt-teens-life/700/933",
      "https://picsum.photos/seed/pleated-mini-skirt-teens-model/700/933"
    ],
    "imageRoles": {
      "front": "https://picsum.photos/seed/pleated-mini-skirt-teens-front/700/933",
      "back": "https://picsum.photos/seed/pleated-mini-skirt-teens-back/700/933",
      "lifestyle": "https://picsum.photos/seed/pleated-mini-skirt-teens-life/700/933",
      "model": "https://picsum.photos/seed/pleated-mini-skirt-teens-model/700/933"
    },
    "colors": [
      {
        "name": "Sky Blue",
        "hex": "#9fc3e0"
      },
      {
        "name": "Coral",
        "hex": "#e8836b"
      },
      {
        "name": "Lavender",
        "hex": "#b9a7d6"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "seo": {
      "title": "Pleated Mini Skirt for Teens – Trendy Streetwear Essential",
      "slug": "pleated-mini-skirt-teens",
      "metaTitle": "Pleated Mini Skirt | Buy Online",
      "metaDescription": "Shop the Pleated Mini Skirt in Polyester Pleated Knit. A-Line Fit, solid design for casual. Now 29% off with fast delivery. Free returns. Free returns.",
      "keywords": [
        "pleated mini skirt",
        "teens skirts",
        "solid skirts",
        "buy pleated mini skirt online",
        "casual wear",
        "premium skirts"
      ]
    },
    "shortDescription": "The Pleated Mini Skirt blends polyester pleated knit with a a-line fit for effortless comfort. Featuring a solid design and it's tailored for casual moments throughout the all season season. A versatile wardrobe staple that pairs easily and wears beautifully day after day.",
    "longDescription": "Meet the Pleated Mini Skirt — a thoughtfully designed skirts that brings together premium materials and a refined fit. Crafted from Polyester Pleated Knit, it is built to feel as good as it looks. The fabric is carefully selected for its soft hand-feel, resilience and natural drape, giving you a piece that holds its shape and color through repeated wear. Every detail — from the clean construction to the precision-finished seams and durable trims — reflects a genuine commitment to premium craftsmanship that you can see and feel.\n\nFabric & Comfort: Polyester Pleated Knit offers a balance of softness and structure that sits comfortably against the skin. The weave is breathable and gentle, helping regulate temperature so you stay fresh through busy days. The a-line fit allows a natural range of movement without feeling restrictive, while careful tailoring ensures a clean, flattering line. making this an easy choice when you want to look put-together without compromising on ease or all-day wearability.\n\nStyle Benefits: the solid aesthetic makes this a genuinely versatile addition to any wardrobe. It layers effortlessly, mixes with both relaxed and elevated pieces, and adapts to your mood and the moment. Whether you dress it up or keep it understated, the Pleated Mini Skirt delivers a modern, considered look. The colorways are chosen to complement a wide range of skin tones and existing outfits, so styling it is intuitive rather than complicated.\n\nUsage Scenarios: ideally suited for casual settings throughout the all season season, this piece transitions smoothly across your day. Wear it for casual outings, weekend plans, travel, gatherings with friends, or relaxed time at home. Its adaptable design means it works across your existing wardrobe with minimal effort, quickly becoming a reliable go-to you will reach for again and again — versatile enough to earn its place season after season.\n\nCare Instructions: to keep the Pleated Mini Skirt looking its best, machine wash cold with similar colors on a gentle cycle. Do not bleach, and avoid harsh detergents that can dull the finish. Tumble dry on low or line dry in shade to protect the fibers, and warm iron on the reverse if needed. Avoid wringing to preserve the fabric structure and shape. With this simple care routine, your piece will stay fresh, soft and vibrant wash after wash — a smart, long-lasting investment in your everyday style.",
    "features": [
      "Premium Polyester fabric",
      "Breathable, skin-friendly material",
      "Fade-resistant color retention",
      "Soft-touch finish for all-day comfort",
      "Lightweight, easy-to-wear construction",
      "A-Line Fit for a flattering silhouette",
      "Reinforced stitching for durability"
    ],
    "specifications": {
      "Material": "Polyester Pleated Knit",
      "Fit Type": "A-Line Fit",
      "Sleeve Type": "N/A",
      "Neck Type": "N/A",
      "Pattern": "Solid",
      "Occasion": "Casual",
      "Season": "All Season",
      "Gender": "Unisex Teen",
      "Country of Origin": "Bangladesh"
    },
    "sizeGuide": [
      {
        "size": "XS",
        "chest": "34",
        "waist": "28",
        "length": "66",
        "shoulder": "40"
      },
      {
        "size": "S",
        "chest": "36",
        "waist": "30",
        "length": "68",
        "shoulder": "42"
      },
      {
        "size": "M",
        "chest": "38",
        "waist": "32",
        "length": "70",
        "shoulder": "44"
      },
      {
        "size": "L",
        "chest": "40",
        "waist": "34",
        "length": "72",
        "shoulder": "46"
      },
      {
        "size": "XL",
        "chest": "42",
        "waist": "36",
        "length": "74",
        "shoulder": "48"
      },
      {
        "size": "XXL",
        "chest": "44",
        "waist": "38",
        "length": "76",
        "shoulder": "50"
      }
    ],
    "reviews": [
      {
        "name": "Lamia Rahman",
        "rating": 5,
        "text": "Premium feel without the premium markup. Will buy again from this brand.",
        "date": "2025-10-25"
      },
      {
        "name": "Imran Chowdhury",
        "rating": 4,
        "text": "Soft, lightweight and well finished. Exactly what I was looking for.",
        "date": "2025-10-16"
      },
      {
        "name": "Sumaiya Akhtar",
        "rating": 5,
        "text": "Fantastic everyday piece — versatile, stylish and easy to care for.",
        "date": "2025-10-07"
      },
      {
        "name": "Shahriar Khan",
        "rating": 4,
        "text": "Absolutely love the quality, the fabric feels premium and the fit is spot on.",
        "date": "2025-09-28"
      },
      {
        "name": "Tania Sultana",
        "rating": 3,
        "text": "Nice quality but the color is slightly darker than the picture.",
        "date": "2025-09-19"
      },
      {
        "name": "Mahin Alam",
        "rating": 4,
        "text": "Super comfortable for all-day wear, I've already ordered a second one.",
        "date": "2025-09-10"
      }
    ],
    "relatedIds": [
      "prod-035",
      "prod-036",
      "prod-037",
      "prod-039"
    ],
    "frequentlyBoughtTogetherIds": [
      "prod-036",
      "prod-037"
    ],
    "customersAlsoBoughtIds": [
      "prod-046",
      "prod-047",
      "prod-048",
      "prod-049"
    ]
  },
  {
    "id": "prod-039",
    "slug": "tie-dye-relaxed-tee-teens",
    "name": "Tie-Dye Relaxed Tee",
    "sku": "TN-0039",
    "category": "Teens",
    "subcategory": "T-Shirts",
    "brand": "Volt & Co.",
    "price": 790,
    "comparePrice": 1190,
    "discountPercent": 34,
    "rating": 4.4,
    "reviewCount": 374,
    "stock": 140,
    "images": [
      "https://picsum.photos/seed/tie-dye-relaxed-tee-teens-front/700/933",
      "https://picsum.photos/seed/tie-dye-relaxed-tee-teens-back/700/933",
      "https://picsum.photos/seed/tie-dye-relaxed-tee-teens-life/700/933",
      "https://picsum.photos/seed/tie-dye-relaxed-tee-teens-model/700/933"
    ],
    "imageRoles": {
      "front": "https://picsum.photos/seed/tie-dye-relaxed-tee-teens-front/700/933",
      "back": "https://picsum.photos/seed/tie-dye-relaxed-tee-teens-back/700/933",
      "lifestyle": "https://picsum.photos/seed/tie-dye-relaxed-tee-teens-life/700/933",
      "model": "https://picsum.photos/seed/tie-dye-relaxed-tee-teens-model/700/933"
    },
    "colors": [
      {
        "name": "Mustard",
        "hex": "#d6a531"
      },
      {
        "name": "Blush Pink",
        "hex": "#e8b5bf"
      },
      {
        "name": "Black",
        "hex": "#1c1c1c"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "seo": {
      "title": "Tie-Dye Relaxed Tee for Teens – Trendy Streetwear Essential",
      "slug": "tie-dye-relaxed-tee-teens",
      "metaTitle": "Tie-Dye Relaxed Tee | Buy Online",
      "metaDescription": "Shop the Tie-Dye Relaxed Tee in Cotton Jersey. Relaxed Fit, tie-dye design for casual. Now 34% off with fast delivery. Free returns. Free returns. Free returns.",
      "keywords": [
        "tie-dye relaxed tee",
        "teens t-shirts",
        "tie-dye t-shirts",
        "buy tie-dye relaxed tee online",
        "casual wear",
        "premium t-shirts"
      ]
    },
    "shortDescription": "The Tie-Dye Relaxed Tee blends cotton jersey with a relaxed fit for effortless comfort. Featuring a tie-dye design and crew neck neckline, it's tailored for casual moments throughout the summer season. A versatile wardrobe staple that pairs easily and wears beautifully day after day.",
    "longDescription": "Meet the Tie-Dye Relaxed Tee — a thoughtfully designed t-shirts that brings together premium materials and a refined fit. Crafted from Cotton Jersey, it is built to feel as good as it looks. The fabric is carefully selected for its soft hand-feel, resilience and natural drape, giving you a piece that holds its shape and color through repeated wear. Every detail — from the crew neck to the precision-finished seams and durable trims — reflects a genuine commitment to premium craftsmanship that you can see and feel.\n\nFabric & Comfort: Cotton Jersey offers a balance of softness and structure that sits comfortably against the skin. The weave is breathable and gentle, helping regulate temperature so you stay fresh through busy days. The relaxed fit allows a natural range of movement without feeling restrictive, while careful tailoring ensures a clean, flattering line. The short sleeve cut adds balance to the overall silhouette, making this an easy choice when you want to look put-together without compromising on ease or all-day wearability.\n\nStyle Benefits: the tie-dye aesthetic makes this a genuinely versatile addition to any wardrobe. It layers effortlessly, mixes with both relaxed and elevated pieces, and adapts to your mood and the moment. Whether you dress it up or keep it understated, the Tie-Dye Relaxed Tee delivers a modern, considered look. The colorways are chosen to complement a wide range of skin tones and existing outfits, so styling it is intuitive rather than complicated.\n\nUsage Scenarios: ideally suited for casual settings throughout the summer season, this piece transitions smoothly across your day. Wear it for casual outings, weekend plans, travel, gatherings with friends, or relaxed time at home. Its adaptable design means it works across your existing wardrobe with minimal effort, quickly becoming a reliable go-to you will reach for again and again — versatile enough to earn its place season after season.\n\nCare Instructions: to keep the Tie-Dye Relaxed Tee looking its best, machine wash cold with similar colors on a gentle cycle. Do not bleach, and avoid harsh detergents that can dull the finish. Tumble dry on low or line dry in shade to protect the fibers, and warm iron on the reverse if needed. Avoid wringing to preserve the fabric structure and shape. With this simple care routine, your piece will stay fresh, soft and vibrant wash after wash — a smart, long-lasting investment in your everyday style.",
    "features": [
      "Premium Cotton fabric",
      "Breathable, skin-friendly material",
      "Fade-resistant color retention",
      "Soft-touch finish for all-day comfort",
      "Lightweight, easy-to-wear construction",
      "Relaxed Fit for a flattering silhouette",
      "Reinforced stitching for durability"
    ],
    "specifications": {
      "Material": "Cotton Jersey",
      "Fit Type": "Relaxed Fit",
      "Sleeve Type": "Short Sleeve",
      "Neck Type": "Crew Neck",
      "Pattern": "Tie-Dye",
      "Occasion": "Casual",
      "Season": "Summer",
      "Gender": "Unisex Teen",
      "Country of Origin": "Bangladesh"
    },
    "sizeGuide": [
      {
        "size": "XS",
        "chest": "34",
        "waist": "28",
        "length": "66",
        "shoulder": "40"
      },
      {
        "size": "S",
        "chest": "36",
        "waist": "30",
        "length": "68",
        "shoulder": "42"
      },
      {
        "size": "M",
        "chest": "38",
        "waist": "32",
        "length": "70",
        "shoulder": "44"
      },
      {
        "size": "L",
        "chest": "40",
        "waist": "34",
        "length": "72",
        "shoulder": "46"
      },
      {
        "size": "XL",
        "chest": "42",
        "waist": "36",
        "length": "74",
        "shoulder": "48"
      },
      {
        "size": "XXL",
        "chest": "44",
        "waist": "38",
        "length": "76",
        "shoulder": "50"
      }
    ],
    "reviews": [
      {
        "name": "Imran Chowdhury",
        "rating": 4,
        "text": "Soft, lightweight and well finished. Exactly what I was looking for.",
        "date": "2025-10-24"
      },
      {
        "name": "Sumaiya Akhtar",
        "rating": 5,
        "text": "Fantastic everyday piece — versatile, stylish and easy to care for.",
        "date": "2025-10-15"
      },
      {
        "name": "Shahriar Khan",
        "rating": 4,
        "text": "Absolutely love the quality, the fabric feels premium and the fit is spot on.",
        "date": "2025-10-06"
      },
      {
        "name": "Tania Sultana",
        "rating": 5,
        "text": "Exceeded my expectations — stitching is clean and the color is exactly as shown.",
        "date": "2025-09-27"
      },
      {
        "name": "Mahin Alam",
        "rating": 3,
        "text": "Comfortable and well made, delivery took a little longer than expected.",
        "date": "2025-09-18"
      },
      {
        "name": "Rumana Begum",
        "rating": 5,
        "text": "Great value for the price. Delivery was fast and packaging was neat.",
        "date": "2025-09-09"
      },
      {
        "name": "Naimur Rashid",
        "rating": 4,
        "text": "The material breathes really well, perfect for our weather. Highly recommend.",
        "date": "2025-08-31"
      }
    ],
    "relatedIds": [
      "prod-036",
      "prod-037",
      "prod-038",
      "prod-040"
    ],
    "frequentlyBoughtTogetherIds": [
      "prod-037",
      "prod-038"
    ],
    "customersAlsoBoughtIds": [
      "prod-047",
      "prod-048",
      "prod-049",
      "prod-050"
    ]
  },
  {
    "id": "prod-040",
    "slug": "utility-overshirt-teens",
    "name": "Utility Overshirt",
    "sku": "TN-0040",
    "category": "Teens",
    "subcategory": "Shirts",
    "brand": "Volt & Co.",
    "price": 1590,
    "comparePrice": 2190,
    "discountPercent": 27,
    "rating": 4.7,
    "reviewCount": 431,
    "stock": 153,
    "images": [
      "https://picsum.photos/seed/utility-overshirt-teens-front/700/933",
      "https://picsum.photos/seed/utility-overshirt-teens-back/700/933",
      "https://picsum.photos/seed/utility-overshirt-teens-life/700/933",
      "https://picsum.photos/seed/utility-overshirt-teens-model/700/933"
    ],
    "imageRoles": {
      "front": "https://picsum.photos/seed/utility-overshirt-teens-front/700/933",
      "back": "https://picsum.photos/seed/utility-overshirt-teens-back/700/933",
      "lifestyle": "https://picsum.photos/seed/utility-overshirt-teens-life/700/933",
      "model": "https://picsum.photos/seed/utility-overshirt-teens-model/700/933"
    },
    "colors": [
      {
        "name": "Teal",
        "hex": "#1f6f6b"
      },
      {
        "name": "Sage",
        "hex": "#9caf88"
      },
      {
        "name": "White",
        "hex": "#f5f5f5"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "seo": {
      "title": "Utility Overshirt for Teens – Trendy Streetwear Essential",
      "slug": "utility-overshirt-teens",
      "metaTitle": "Utility Overshirt | Buy Online",
      "metaDescription": "Shop the Utility Overshirt in Cotton Drill. Boxy Fit, solid design for streetwear. Now 27% off with fast delivery. Free returns. Free returns. Free returns.",
      "keywords": [
        "utility overshirt",
        "teens shirts",
        "solid shirts",
        "buy utility overshirt online",
        "streetwear wear",
        "premium shirts"
      ]
    },
    "shortDescription": "The Utility Overshirt blends cotton drill with a boxy fit for effortless comfort. Featuring a solid design and camp collar neckline, it's tailored for streetwear moments throughout the all season season. A versatile wardrobe staple that pairs easily and wears beautifully day after day.",
    "longDescription": "Meet the Utility Overshirt — a thoughtfully designed shirts that brings together premium materials and a refined fit. Crafted from Cotton Drill, it is built to feel as good as it looks. The fabric is carefully selected for its soft hand-feel, resilience and natural drape, giving you a piece that holds its shape and color through repeated wear. Every detail — from the camp collar to the precision-finished seams and durable trims — reflects a genuine commitment to premium craftsmanship that you can see and feel.\n\nFabric & Comfort: Cotton Drill offers a balance of softness and structure that sits comfortably against the skin. The weave is breathable and gentle, helping regulate temperature so you stay fresh through busy days. The boxy fit allows a natural range of movement without feeling restrictive, while careful tailoring ensures a clean, flattering line. The long sleeve cut adds balance to the overall silhouette, making this an easy choice when you want to look put-together without compromising on ease or all-day wearability.\n\nStyle Benefits: the solid aesthetic makes this a genuinely versatile addition to any wardrobe. It layers effortlessly, mixes with both relaxed and elevated pieces, and adapts to your mood and the moment. Whether you dress it up or keep it understated, the Utility Overshirt delivers a modern, considered look. The colorways are chosen to complement a wide range of skin tones and existing outfits, so styling it is intuitive rather than complicated.\n\nUsage Scenarios: ideally suited for streetwear settings throughout the all season season, this piece transitions smoothly across your day. Wear it for casual outings, weekend plans, travel, gatherings with friends, or relaxed time at home. Its adaptable design means it works across your existing wardrobe with minimal effort, quickly becoming a reliable go-to you will reach for again and again — versatile enough to earn its place season after season.\n\nCare Instructions: to keep the Utility Overshirt looking its best, machine wash cold with similar colors on a gentle cycle. Do not bleach, and avoid harsh detergents that can dull the finish. Tumble dry on low or line dry in shade to protect the fibers, and warm iron on the reverse if needed. Avoid wringing to preserve the fabric structure and shape. With this simple care routine, your piece will stay fresh, soft and vibrant wash after wash — a smart, long-lasting investment in your everyday style.",
    "features": [
      "Premium Cotton fabric",
      "Breathable, skin-friendly material",
      "Fade-resistant color retention",
      "Soft-touch finish for all-day comfort",
      "Lightweight, easy-to-wear construction",
      "Boxy Fit for a flattering silhouette",
      "Reinforced stitching for durability"
    ],
    "specifications": {
      "Material": "Cotton Drill",
      "Fit Type": "Boxy Fit",
      "Sleeve Type": "Long Sleeve",
      "Neck Type": "Camp Collar",
      "Pattern": "Solid",
      "Occasion": "Streetwear",
      "Season": "All Season",
      "Gender": "Unisex Teen",
      "Country of Origin": "Bangladesh"
    },
    "sizeGuide": [
      {
        "size": "XS",
        "chest": "34",
        "waist": "28",
        "length": "66",
        "shoulder": "40"
      },
      {
        "size": "S",
        "chest": "36",
        "waist": "30",
        "length": "68",
        "shoulder": "42"
      },
      {
        "size": "M",
        "chest": "38",
        "waist": "32",
        "length": "70",
        "shoulder": "44"
      },
      {
        "size": "L",
        "chest": "40",
        "waist": "34",
        "length": "72",
        "shoulder": "46"
      },
      {
        "size": "XL",
        "chest": "42",
        "waist": "36",
        "length": "74",
        "shoulder": "48"
      },
      {
        "size": "XXL",
        "chest": "44",
        "waist": "38",
        "length": "76",
        "shoulder": "50"
      }
    ],
    "reviews": [
      {
        "name": "Sumaiya Akhtar",
        "rating": 5,
        "text": "Fantastic everyday piece — versatile, stylish and easy to care for.",
        "date": "2025-10-23"
      },
      {
        "name": "Shahriar Khan",
        "rating": 4,
        "text": "Absolutely love the quality, the fabric feels premium and the fit is spot on.",
        "date": "2025-10-14"
      },
      {
        "name": "Tania Sultana",
        "rating": 5,
        "text": "Exceeded my expectations — stitching is clean and the color is exactly as shown.",
        "date": "2025-10-05"
      },
      {
        "name": "Mahin Alam",
        "rating": 4,
        "text": "Super comfortable for all-day wear, I've already ordered a second one.",
        "date": "2025-09-26"
      },
      {
        "name": "Rumana Begum",
        "rating": 3,
        "text": "Happy with it, just wish there were a few more color options.",
        "date": "2025-09-17"
      },
      {
        "name": "Naimur Rashid",
        "rating": 4,
        "text": "The material breathes really well, perfect for our weather. Highly recommend.",
        "date": "2025-09-08"
      },
      {
        "name": "Jannatul Ferdous",
        "rating": 5,
        "text": "Looks even better in person. Got compliments the first time I wore it.",
        "date": "2025-08-30"
      },
      {
        "name": "Asif Mahmud",
        "rating": 4,
        "text": "True to size and holds up well after multiple washes. Very happy.",
        "date": "2025-08-21"
      }
    ],
    "relatedIds": [
      "prod-037",
      "prod-038",
      "prod-039",
      "prod-033"
    ],
    "frequentlyBoughtTogetherIds": [
      "prod-038",
      "prod-039"
    ],
    "customersAlsoBoughtIds": [
      "prod-048",
      "prod-049",
      "prod-050",
      "prod-001"
    ]
  },
  {
    "id": "prod-041",
    "slug": "pro-football-jersey-sports",
    "name": "Pro Football Jersey",
    "sku": "SP-0041",
    "category": "Sports",
    "subcategory": "Jerseys",
    "brand": "Apex Active",
    "price": 1490,
    "comparePrice": 2090,
    "discountPercent": 29,
    "rating": 4,
    "reviewCount": 488,
    "stock": 166,
    "images": [
      "https://picsum.photos/seed/pro-football-jersey-sports-front/700/933",
      "https://picsum.photos/seed/pro-football-jersey-sports-back/700/933",
      "https://picsum.photos/seed/pro-football-jersey-sports-life/700/933",
      "https://picsum.photos/seed/pro-football-jersey-sports-model/700/933"
    ],
    "imageRoles": {
      "front": "https://picsum.photos/seed/pro-football-jersey-sports-front/700/933",
      "back": "https://picsum.photos/seed/pro-football-jersey-sports-back/700/933",
      "lifestyle": "https://picsum.photos/seed/pro-football-jersey-sports-life/700/933",
      "model": "https://picsum.photos/seed/pro-football-jersey-sports-model/700/933"
    },
    "colors": [
      {
        "name": "Coral",
        "hex": "#e8836b"
      },
      {
        "name": "Rust",
        "hex": "#a8562f"
      },
      {
        "name": "Navy",
        "hex": "#1f2a44"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "seo": {
      "title": "Pro Football Jersey for Active Wear – High-Performance Activewear",
      "slug": "pro-football-jersey-sports",
      "metaTitle": "Pro Football Jersey | Buy Online",
      "metaDescription": "Shop the Pro Football Jersey in Recycled Polyester Mesh. Athletic Fit, color block design for sports. Now 29% off with fast delivery. Free returns. Free returns",
      "keywords": [
        "pro football jersey",
        "sports jerseys",
        "color block jerseys",
        "buy pro football jersey online",
        "sports wear",
        "premium jerseys"
      ]
    },
    "shortDescription": "The Pro Football Jersey blends recycled polyester mesh with a athletic fit for effortless comfort. Featuring a color block design and v-neck neckline, it's tailored for sports moments throughout the all season season. A versatile wardrobe staple that pairs easily and wears beautifully day after day.",
    "longDescription": "Meet the Pro Football Jersey — a thoughtfully designed jerseys that brings together premium materials and a refined fit. Crafted from Recycled Polyester Mesh, it is built to feel as good as it looks. The fabric is carefully selected for its soft hand-feel, resilience and natural drape, giving you a piece that holds its shape and color through repeated wear. Every detail — from the v-neck to the precision-finished seams and durable trims — reflects a genuine commitment to premium craftsmanship that you can see and feel.\n\nFabric & Comfort: Recycled Polyester Mesh offers a balance of softness and structure that sits comfortably against the skin. The weave is breathable and gentle, helping regulate temperature so you stay fresh through busy days. The athletic fit allows a natural range of movement without feeling restrictive, while careful tailoring ensures a clean, flattering line. The short sleeve cut adds balance to the overall silhouette, making this an easy choice when you want to look put-together without compromising on ease or all-day wearability.\n\nStyle Benefits: the color block aesthetic makes this a genuinely versatile addition to any wardrobe. It layers effortlessly, mixes with both relaxed and elevated pieces, and adapts to your mood and the moment. Whether you dress it up or keep it understated, the Pro Football Jersey delivers a modern, considered look. The colorways are chosen to complement a wide range of skin tones and existing outfits, so styling it is intuitive rather than complicated.\n\nUsage Scenarios: ideally suited for sports settings throughout the all season season, this piece transitions smoothly across your day. Wear it for casual outings, weekend plans, travel, gatherings with friends, or relaxed time at home. Its adaptable design means it works across your existing wardrobe with minimal effort, quickly becoming a reliable go-to you will reach for again and again — versatile enough to earn its place season after season.\n\nCare Instructions: to keep the Pro Football Jersey looking its best, machine wash cold with similar colors on a gentle cycle. Do not bleach, and avoid harsh detergents that can dull the finish. Tumble dry on low or line dry in shade to protect the fibers, and warm iron on the reverse if needed. Avoid wringing to preserve the fabric structure and shape. With this simple care routine, your piece will stay fresh, soft and vibrant wash after wash — a smart, long-lasting investment in your everyday style.",
    "features": [
      "Premium Recycled fabric",
      "Breathable, skin-friendly material",
      "Fade-resistant color retention",
      "Soft-touch finish for all-day comfort",
      "Lightweight, easy-to-wear construction",
      "Athletic Fit for a flattering silhouette",
      "Reinforced stitching for durability"
    ],
    "specifications": {
      "Material": "Recycled Polyester Mesh",
      "Fit Type": "Athletic Fit",
      "Sleeve Type": "Short Sleeve",
      "Neck Type": "V-Neck",
      "Pattern": "Color Block",
      "Occasion": "Sports",
      "Season": "All Season",
      "Gender": "Unisex",
      "Country of Origin": "Bangladesh"
    },
    "sizeGuide": [
      {
        "size": "XS",
        "chest": "34",
        "waist": "28",
        "length": "66",
        "shoulder": "40"
      },
      {
        "size": "S",
        "chest": "36",
        "waist": "30",
        "length": "68",
        "shoulder": "42"
      },
      {
        "size": "M",
        "chest": "38",
        "waist": "32",
        "length": "70",
        "shoulder": "44"
      },
      {
        "size": "L",
        "chest": "40",
        "waist": "34",
        "length": "72",
        "shoulder": "46"
      },
      {
        "size": "XL",
        "chest": "42",
        "waist": "36",
        "length": "74",
        "shoulder": "48"
      },
      {
        "size": "XXL",
        "chest": "44",
        "waist": "38",
        "length": "76",
        "shoulder": "50"
      }
    ],
    "reviews": [
      {
        "name": "Shahriar Khan",
        "rating": 4,
        "text": "Absolutely love the quality, the fabric feels premium and the fit is spot on.",
        "date": "2025-10-22"
      },
      {
        "name": "Tania Sultana",
        "rating": 5,
        "text": "Exceeded my expectations — stitching is clean and the color is exactly as shown.",
        "date": "2025-10-13"
      },
      {
        "name": "Mahin Alam",
        "rating": 4,
        "text": "Super comfortable for all-day wear, I've already ordered a second one.",
        "date": "2025-10-04"
      },
      {
        "name": "Rumana Begum",
        "rating": 5,
        "text": "Great value for the price. Delivery was fast and packaging was neat.",
        "date": "2025-09-25"
      },
      {
        "name": "Naimur Rashid",
        "rating": 3,
        "text": "Decent fabric for the price, the fit runs a touch slim.",
        "date": "2025-09-16"
      },
      {
        "name": "Jannatul Ferdous",
        "rating": 5,
        "text": "Looks even better in person. Got compliments the first time I wore it.",
        "date": "2025-09-07"
      },
      {
        "name": "Asif Mahmud",
        "rating": 4,
        "text": "True to size and holds up well after multiple washes. Very happy.",
        "date": "2025-08-29"
      },
      {
        "name": "Priya Das",
        "rating": 5,
        "text": "Premium feel without the premium markup. Will buy again from this brand.",
        "date": "2025-08-20"
      },
      {
        "name": "Sabbir Ahmed",
        "rating": 4,
        "text": "Soft, lightweight and well finished. Exactly what I was looking for.",
        "date": "2025-08-11"
      }
    ],
    "relatedIds": [
      "prod-046",
      "prod-047",
      "prod-048",
      "prod-049"
    ],
    "frequentlyBoughtTogetherIds": [
      "prod-047",
      "prod-048"
    ],
    "customersAlsoBoughtIds": [
      "prod-001",
      "prod-002",
      "prod-003",
      "prod-004"
    ]
  },
  {
    "id": "prod-042",
    "slug": "training-t-shirt-sports",
    "name": "Training T-Shirt",
    "sku": "SP-0042",
    "category": "Sports",
    "subcategory": "Activewear Tops",
    "brand": "Apex Active",
    "price": 890,
    "comparePrice": 1290,
    "discountPercent": 31,
    "rating": 4.3,
    "reviewCount": 545,
    "stock": 179,
    "images": [
      "https://picsum.photos/seed/training-t-shirt-sports-front/700/933",
      "https://picsum.photos/seed/training-t-shirt-sports-back/700/933",
      "https://picsum.photos/seed/training-t-shirt-sports-life/700/933",
      "https://picsum.photos/seed/training-t-shirt-sports-model/700/933"
    ],
    "imageRoles": {
      "front": "https://picsum.photos/seed/training-t-shirt-sports-front/700/933",
      "back": "https://picsum.photos/seed/training-t-shirt-sports-back/700/933",
      "lifestyle": "https://picsum.photos/seed/training-t-shirt-sports-life/700/933",
      "model": "https://picsum.photos/seed/training-t-shirt-sports-model/700/933"
    },
    "colors": [
      {
        "name": "Blush Pink",
        "hex": "#e8b5bf"
      },
      {
        "name": "Lavender",
        "hex": "#b9a7d6"
      },
      {
        "name": "Charcoal",
        "hex": "#3a3a3a"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "seo": {
      "title": "Training T-Shirt for Active Wear – High-Performance Activewear",
      "slug": "training-t-shirt-sports",
      "metaTitle": "Training T-Shirt | Buy Online",
      "metaDescription": "Shop the Training T-Shirt in Moisture-Wicking Polyester. Athletic Fit, solid design for training. Now 31% off with fast delivery. Free returns. Free returns.",
      "keywords": [
        "training t-shirt",
        "sports activewear tops",
        "solid activewear tops",
        "buy training t-shirt online",
        "training wear",
        "premium activewear tops"
      ]
    },
    "shortDescription": "The Training T-Shirt blends moisture-wicking polyester with a athletic fit for effortless comfort. Featuring a solid design and crew neck neckline, it's tailored for training moments throughout the all season season. A versatile wardrobe staple that pairs easily and wears beautifully day after day.",
    "longDescription": "Meet the Training T-Shirt — a thoughtfully designed activewear tops that brings together premium materials and a refined fit. Crafted from Moisture-Wicking Polyester, it is built to feel as good as it looks. The fabric is carefully selected for its soft hand-feel, resilience and natural drape, giving you a piece that holds its shape and color through repeated wear. Every detail — from the crew neck to the precision-finished seams and durable trims — reflects a genuine commitment to premium craftsmanship that you can see and feel.\n\nFabric & Comfort: Moisture-Wicking Polyester offers a balance of softness and structure that sits comfortably against the skin. The weave is breathable and gentle, helping regulate temperature so you stay fresh through busy days. The athletic fit allows a natural range of movement without feeling restrictive, while careful tailoring ensures a clean, flattering line. The short sleeve cut adds balance to the overall silhouette, making this an easy choice when you want to look put-together without compromising on ease or all-day wearability.\n\nStyle Benefits: the solid aesthetic makes this a genuinely versatile addition to any wardrobe. It layers effortlessly, mixes with both relaxed and elevated pieces, and adapts to your mood and the moment. Whether you dress it up or keep it understated, the Training T-Shirt delivers a modern, considered look. The colorways are chosen to complement a wide range of skin tones and existing outfits, so styling it is intuitive rather than complicated.\n\nUsage Scenarios: ideally suited for training settings throughout the all season season, this piece transitions smoothly across your day. Wear it for casual outings, weekend plans, travel, gatherings with friends, or relaxed time at home. Its adaptable design means it works across your existing wardrobe with minimal effort, quickly becoming a reliable go-to you will reach for again and again — versatile enough to earn its place season after season.\n\nCare Instructions: to keep the Training T-Shirt looking its best, machine wash cold with similar colors on a gentle cycle. Do not bleach, and avoid harsh detergents that can dull the finish. Tumble dry on low or line dry in shade to protect the fibers, and warm iron on the reverse if needed. Avoid wringing to preserve the fabric structure and shape. With this simple care routine, your piece will stay fresh, soft and vibrant wash after wash — a smart, long-lasting investment in your everyday style.",
    "features": [
      "Premium Moisture-Wicking fabric",
      "Breathable, skin-friendly material",
      "Fade-resistant color retention",
      "Soft-touch finish for all-day comfort",
      "Lightweight, easy-to-wear construction",
      "Athletic Fit for a flattering silhouette",
      "Reinforced stitching for durability"
    ],
    "specifications": {
      "Material": "Moisture-Wicking Polyester",
      "Fit Type": "Athletic Fit",
      "Sleeve Type": "Short Sleeve",
      "Neck Type": "Crew Neck",
      "Pattern": "Solid",
      "Occasion": "Training",
      "Season": "All Season",
      "Gender": "Unisex",
      "Country of Origin": "Bangladesh"
    },
    "sizeGuide": [
      {
        "size": "XS",
        "chest": "34",
        "waist": "28",
        "length": "66",
        "shoulder": "40"
      },
      {
        "size": "S",
        "chest": "36",
        "waist": "30",
        "length": "68",
        "shoulder": "42"
      },
      {
        "size": "M",
        "chest": "38",
        "waist": "32",
        "length": "70",
        "shoulder": "44"
      },
      {
        "size": "L",
        "chest": "40",
        "waist": "34",
        "length": "72",
        "shoulder": "46"
      },
      {
        "size": "XL",
        "chest": "42",
        "waist": "36",
        "length": "74",
        "shoulder": "48"
      },
      {
        "size": "XXL",
        "chest": "44",
        "waist": "38",
        "length": "76",
        "shoulder": "50"
      }
    ],
    "reviews": [
      {
        "name": "Tania Sultana",
        "rating": 5,
        "text": "Exceeded my expectations — stitching is clean and the color is exactly as shown.",
        "date": "2025-10-21"
      },
      {
        "name": "Mahin Alam",
        "rating": 4,
        "text": "Super comfortable for all-day wear, I've already ordered a second one.",
        "date": "2025-10-12"
      },
      {
        "name": "Rumana Begum",
        "rating": 5,
        "text": "Great value for the price. Delivery was fast and packaging was neat.",
        "date": "2025-10-03"
      },
      {
        "name": "Naimur Rashid",
        "rating": 4,
        "text": "The material breathes really well, perfect for our weather. Highly recommend.",
        "date": "2025-09-24"
      },
      {
        "name": "Jannatul Ferdous",
        "rating": 3,
        "text": "Good product overall, though I'd suggest sizing up for a relaxed fit.",
        "date": "2025-09-15"
      },
      {
        "name": "Asif Mahmud",
        "rating": 4,
        "text": "True to size and holds up well after multiple washes. Very happy.",
        "date": "2025-09-06"
      },
      {
        "name": "Priya Das",
        "rating": 5,
        "text": "Premium feel without the premium markup. Will buy again from this brand.",
        "date": "2025-08-28"
      },
      {
        "name": "Sabbir Ahmed",
        "rating": 4,
        "text": "Soft, lightweight and well finished. Exactly what I was looking for.",
        "date": "2025-08-19"
      },
      {
        "name": "Rifat Karim",
        "rating": 5,
        "text": "Fantastic everyday piece — versatile, stylish and easy to care for.",
        "date": "2025-08-10"
      },
      {
        "name": "Mehnaz Haque",
        "rating": 4,
        "text": "Good product overall, though I'd suggest sizing up for a relaxed fit.",
        "date": "2025-08-01"
      }
    ],
    "relatedIds": [
      "prod-047",
      "prod-048",
      "prod-049",
      "prod-050"
    ],
    "frequentlyBoughtTogetherIds": [
      "prod-048",
      "prod-049"
    ],
    "customersAlsoBoughtIds": [
      "prod-002",
      "prod-003",
      "prod-004",
      "prod-005"
    ]
  },
  {
    "id": "prod-043",
    "slug": "running-shorts-sports",
    "name": "Running Shorts",
    "sku": "SP-0043",
    "category": "Sports",
    "subcategory": "Shorts",
    "brand": "Apex Active",
    "price": 790,
    "comparePrice": 1190,
    "discountPercent": 34,
    "rating": 4.6,
    "reviewCount": 602,
    "stock": 12,
    "images": [
      "https://picsum.photos/seed/running-shorts-sports-front/700/933",
      "https://picsum.photos/seed/running-shorts-sports-back/700/933",
      "https://picsum.photos/seed/running-shorts-sports-life/700/933",
      "https://picsum.photos/seed/running-shorts-sports-model/700/933"
    ],
    "imageRoles": {
      "front": "https://picsum.photos/seed/running-shorts-sports-front/700/933",
      "back": "https://picsum.photos/seed/running-shorts-sports-back/700/933",
      "lifestyle": "https://picsum.photos/seed/running-shorts-sports-life/700/933",
      "model": "https://picsum.photos/seed/running-shorts-sports-model/700/933"
    },
    "colors": [
      {
        "name": "Sage",
        "hex": "#9caf88"
      },
      {
        "name": "Black",
        "hex": "#1c1c1c"
      },
      {
        "name": "Olive",
        "hex": "#5b5a3a"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "seo": {
      "title": "Running Shorts for Active Wear – High-Performance Activewear",
      "slug": "running-shorts-sports",
      "metaTitle": "Running Shorts | Buy Online",
      "metaDescription": "Shop the Running Shorts in Lightweight Stretch Polyester. Regular Fit, solid design for running. Now 34% off with fast delivery. Free returns. Free returns.",
      "keywords": [
        "running shorts",
        "sports shorts",
        "solid shorts",
        "buy running shorts online",
        "running wear",
        "premium shorts"
      ]
    },
    "shortDescription": "The Running Shorts blends lightweight stretch polyester with a regular fit for effortless comfort. Featuring a solid design and it's tailored for running moments throughout the summer season. A versatile wardrobe staple that pairs easily and wears beautifully day after day.",
    "longDescription": "Meet the Running Shorts — a thoughtfully designed shorts that brings together premium materials and a refined fit. Crafted from Lightweight Stretch Polyester, it is built to feel as good as it looks. The fabric is carefully selected for its soft hand-feel, resilience and natural drape, giving you a piece that holds its shape and color through repeated wear. Every detail — from the clean construction to the precision-finished seams and durable trims — reflects a genuine commitment to premium craftsmanship that you can see and feel.\n\nFabric & Comfort: Lightweight Stretch Polyester offers a balance of softness and structure that sits comfortably against the skin. The weave is breathable and gentle, helping regulate temperature so you stay fresh through busy days. The regular fit allows a natural range of movement without feeling restrictive, while careful tailoring ensures a clean, flattering line. making this an easy choice when you want to look put-together without compromising on ease or all-day wearability.\n\nStyle Benefits: the solid aesthetic makes this a genuinely versatile addition to any wardrobe. It layers effortlessly, mixes with both relaxed and elevated pieces, and adapts to your mood and the moment. Whether you dress it up or keep it understated, the Running Shorts delivers a modern, considered look. The colorways are chosen to complement a wide range of skin tones and existing outfits, so styling it is intuitive rather than complicated.\n\nUsage Scenarios: ideally suited for running settings throughout the summer season, this piece transitions smoothly across your day. Wear it for casual outings, weekend plans, travel, gatherings with friends, or relaxed time at home. Its adaptable design means it works across your existing wardrobe with minimal effort, quickly becoming a reliable go-to you will reach for again and again — versatile enough to earn its place season after season.\n\nCare Instructions: to keep the Running Shorts looking its best, machine wash cold with similar colors on a gentle cycle. Do not bleach, and avoid harsh detergents that can dull the finish. Tumble dry on low or line dry in shade to protect the fibers, and warm iron on the reverse if needed. Avoid wringing to preserve the fabric structure and shape. With this simple care routine, your piece will stay fresh, soft and vibrant wash after wash — a smart, long-lasting investment in your everyday style.",
    "features": [
      "Premium Lightweight fabric",
      "Breathable, skin-friendly material",
      "Fade-resistant color retention",
      "Soft-touch finish for all-day comfort",
      "Lightweight, easy-to-wear construction",
      "Regular Fit for a flattering silhouette",
      "Reinforced stitching for durability"
    ],
    "specifications": {
      "Material": "Lightweight Stretch Polyester",
      "Fit Type": "Regular Fit",
      "Sleeve Type": "N/A",
      "Neck Type": "N/A",
      "Pattern": "Solid",
      "Occasion": "Running",
      "Season": "Summer",
      "Gender": "Unisex",
      "Country of Origin": "Bangladesh"
    },
    "sizeGuide": [
      {
        "size": "XS",
        "chest": "34",
        "waist": "28",
        "length": "66",
        "shoulder": "40"
      },
      {
        "size": "S",
        "chest": "36",
        "waist": "30",
        "length": "68",
        "shoulder": "42"
      },
      {
        "size": "M",
        "chest": "38",
        "waist": "32",
        "length": "70",
        "shoulder": "44"
      },
      {
        "size": "L",
        "chest": "40",
        "waist": "34",
        "length": "72",
        "shoulder": "46"
      },
      {
        "size": "XL",
        "chest": "42",
        "waist": "36",
        "length": "74",
        "shoulder": "48"
      },
      {
        "size": "XXL",
        "chest": "44",
        "waist": "38",
        "length": "76",
        "shoulder": "50"
      }
    ],
    "reviews": [
      {
        "name": "Mahin Alam",
        "rating": 4,
        "text": "Super comfortable for all-day wear, I've already ordered a second one.",
        "date": "2025-10-20"
      },
      {
        "name": "Rumana Begum",
        "rating": 5,
        "text": "Great value for the price. Delivery was fast and packaging was neat.",
        "date": "2025-10-11"
      },
      {
        "name": "Naimur Rashid",
        "rating": 4,
        "text": "The material breathes really well, perfect for our weather. Highly recommend.",
        "date": "2025-10-02"
      },
      {
        "name": "Jannatul Ferdous",
        "rating": 5,
        "text": "Looks even better in person. Got compliments the first time I wore it.",
        "date": "2025-09-23"
      },
      {
        "name": "Asif Mahmud",
        "rating": 3,
        "text": "Nice quality but the color is slightly darker than the picture.",
        "date": "2025-09-14"
      }
    ],
    "relatedIds": [
      "prod-048",
      "prod-049",
      "prod-050",
      "prod-041"
    ],
    "frequentlyBoughtTogetherIds": [
      "prod-049",
      "prod-050"
    ],
    "customersAlsoBoughtIds": [
      "prod-003",
      "prod-004",
      "prod-005",
      "prod-006"
    ]
  },
  {
    "id": "prod-044",
    "slug": "activewear-set-sports",
    "name": "Activewear Set",
    "sku": "SP-0044",
    "category": "Sports",
    "subcategory": "Active Sets",
    "brand": "Apex Active",
    "price": 2190,
    "comparePrice": 2990,
    "discountPercent": 27,
    "rating": 4.9,
    "reviewCount": 659,
    "stock": 25,
    "images": [
      "https://picsum.photos/seed/activewear-set-sports-front/700/933",
      "https://picsum.photos/seed/activewear-set-sports-back/700/933",
      "https://picsum.photos/seed/activewear-set-sports-life/700/933",
      "https://picsum.photos/seed/activewear-set-sports-model/700/933"
    ],
    "imageRoles": {
      "front": "https://picsum.photos/seed/activewear-set-sports-front/700/933",
      "back": "https://picsum.photos/seed/activewear-set-sports-back/700/933",
      "lifestyle": "https://picsum.photos/seed/activewear-set-sports-life/700/933",
      "model": "https://picsum.photos/seed/activewear-set-sports-model/700/933"
    },
    "colors": [
      {
        "name": "Rust",
        "hex": "#a8562f"
      },
      {
        "name": "White",
        "hex": "#f5f5f5"
      },
      {
        "name": "Maroon",
        "hex": "#6e1f2b"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "seo": {
      "title": "Activewear Set for Active Wear – High-Performance Activewear",
      "slug": "activewear-set-sports",
      "metaTitle": "Activewear Set | Buy Online",
      "metaDescription": "Shop the Activewear Set in Nylon Spandex Blend. Compression Fit, solid design for gym. Now 27% off with fast delivery. Free returns. Free returns. Free returns.",
      "keywords": [
        "activewear set",
        "sports active sets",
        "solid active sets",
        "buy activewear set online",
        "gym wear",
        "premium active sets"
      ]
    },
    "shortDescription": "The Activewear Set blends nylon spandex blend with a compression fit for effortless comfort. Featuring a solid design and crew neck neckline, it's tailored for gym moments throughout the all season season. A versatile wardrobe staple that pairs easily and wears beautifully day after day.",
    "longDescription": "Meet the Activewear Set — a thoughtfully designed active sets that brings together premium materials and a refined fit. Crafted from Nylon Spandex Blend, it is built to feel as good as it looks. The fabric is carefully selected for its soft hand-feel, resilience and natural drape, giving you a piece that holds its shape and color through repeated wear. Every detail — from the crew neck to the precision-finished seams and durable trims — reflects a genuine commitment to premium craftsmanship that you can see and feel.\n\nFabric & Comfort: Nylon Spandex Blend offers a balance of softness and structure that sits comfortably against the skin. The weave is breathable and gentle, helping regulate temperature so you stay fresh through busy days. The compression fit allows a natural range of movement without feeling restrictive, while careful tailoring ensures a clean, flattering line. The short sleeve cut adds balance to the overall silhouette, making this an easy choice when you want to look put-together without compromising on ease or all-day wearability.\n\nStyle Benefits: the solid aesthetic makes this a genuinely versatile addition to any wardrobe. It layers effortlessly, mixes with both relaxed and elevated pieces, and adapts to your mood and the moment. Whether you dress it up or keep it understated, the Activewear Set delivers a modern, considered look. The colorways are chosen to complement a wide range of skin tones and existing outfits, so styling it is intuitive rather than complicated.\n\nUsage Scenarios: ideally suited for gym settings throughout the all season season, this piece transitions smoothly across your day. Wear it for casual outings, weekend plans, travel, gatherings with friends, or relaxed time at home. Its adaptable design means it works across your existing wardrobe with minimal effort, quickly becoming a reliable go-to you will reach for again and again — versatile enough to earn its place season after season.\n\nCare Instructions: to keep the Activewear Set looking its best, machine wash cold with similar colors on a gentle cycle. Do not bleach, and avoid harsh detergents that can dull the finish. Tumble dry on low or line dry in shade to protect the fibers, and warm iron on the reverse if needed. Avoid wringing to preserve the fabric structure and shape. With this simple care routine, your piece will stay fresh, soft and vibrant wash after wash — a smart, long-lasting investment in your everyday style.",
    "features": [
      "Premium Nylon fabric",
      "Breathable, skin-friendly material",
      "Fade-resistant color retention",
      "Soft-touch finish for all-day comfort",
      "Lightweight, easy-to-wear construction",
      "Compression Fit for a flattering silhouette",
      "Reinforced stitching for durability"
    ],
    "specifications": {
      "Material": "Nylon Spandex Blend",
      "Fit Type": "Compression Fit",
      "Sleeve Type": "Short Sleeve",
      "Neck Type": "Crew Neck",
      "Pattern": "Solid",
      "Occasion": "Gym",
      "Season": "All Season",
      "Gender": "Unisex",
      "Country of Origin": "Bangladesh"
    },
    "sizeGuide": [
      {
        "size": "XS",
        "chest": "34",
        "waist": "28",
        "length": "66",
        "shoulder": "40"
      },
      {
        "size": "S",
        "chest": "36",
        "waist": "30",
        "length": "68",
        "shoulder": "42"
      },
      {
        "size": "M",
        "chest": "38",
        "waist": "32",
        "length": "70",
        "shoulder": "44"
      },
      {
        "size": "L",
        "chest": "40",
        "waist": "34",
        "length": "72",
        "shoulder": "46"
      },
      {
        "size": "XL",
        "chest": "42",
        "waist": "36",
        "length": "74",
        "shoulder": "48"
      },
      {
        "size": "XXL",
        "chest": "44",
        "waist": "38",
        "length": "76",
        "shoulder": "50"
      }
    ],
    "reviews": [
      {
        "name": "Rumana Begum",
        "rating": 5,
        "text": "Great value for the price. Delivery was fast and packaging was neat.",
        "date": "2025-10-19"
      },
      {
        "name": "Naimur Rashid",
        "rating": 4,
        "text": "The material breathes really well, perfect for our weather. Highly recommend.",
        "date": "2025-10-10"
      },
      {
        "name": "Jannatul Ferdous",
        "rating": 5,
        "text": "Looks even better in person. Got compliments the first time I wore it.",
        "date": "2025-10-01"
      },
      {
        "name": "Asif Mahmud",
        "rating": 4,
        "text": "True to size and holds up well after multiple washes. Very happy.",
        "date": "2025-09-22"
      },
      {
        "name": "Priya Das",
        "rating": 3,
        "text": "Comfortable and well made, delivery took a little longer than expected.",
        "date": "2025-09-13"
      },
      {
        "name": "Sabbir Ahmed",
        "rating": 4,
        "text": "Soft, lightweight and well finished. Exactly what I was looking for.",
        "date": "2025-09-04"
      }
    ],
    "relatedIds": [
      "prod-049",
      "prod-050",
      "prod-041",
      "prod-042"
    ],
    "frequentlyBoughtTogetherIds": [
      "prod-050",
      "prod-041"
    ],
    "customersAlsoBoughtIds": [
      "prod-004",
      "prod-005",
      "prod-006",
      "prod-007"
    ]
  },
  {
    "id": "prod-045",
    "slug": "compression-base-layer-sports",
    "name": "Compression Base Layer",
    "sku": "SP-0045",
    "category": "Sports",
    "subcategory": "Base Layers",
    "brand": "Apex Active",
    "price": 1190,
    "comparePrice": 1690,
    "discountPercent": 30,
    "rating": 4.2,
    "reviewCount": 716,
    "stock": 38,
    "images": [
      "https://picsum.photos/seed/compression-base-layer-sports-front/700/933",
      "https://picsum.photos/seed/compression-base-layer-sports-back/700/933",
      "https://picsum.photos/seed/compression-base-layer-sports-life/700/933",
      "https://picsum.photos/seed/compression-base-layer-sports-model/700/933"
    ],
    "imageRoles": {
      "front": "https://picsum.photos/seed/compression-base-layer-sports-front/700/933",
      "back": "https://picsum.photos/seed/compression-base-layer-sports-back/700/933",
      "lifestyle": "https://picsum.photos/seed/compression-base-layer-sports-life/700/933",
      "model": "https://picsum.photos/seed/compression-base-layer-sports-model/700/933"
    },
    "colors": [
      {
        "name": "Lavender",
        "hex": "#b9a7d6"
      },
      {
        "name": "Navy",
        "hex": "#1f2a44"
      },
      {
        "name": "Beige",
        "hex": "#d8c7a8"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "seo": {
      "title": "Compression Base Layer for Active Wear – High-Performance Activewear",
      "slug": "compression-base-layer-sports",
      "metaTitle": "Compression Base Layer | Buy Online",
      "metaDescription": "Shop the Compression Base Layer in Polyester Elastane Knit. Compression Fit, solid design for training. Now 30% off with fast delivery. Free returns. Free retur",
      "keywords": [
        "compression base layer",
        "sports base layers",
        "solid base layers",
        "buy compression base layer online",
        "training wear",
        "premium base layers"
      ]
    },
    "shortDescription": "The Compression Base Layer blends polyester elastane knit with a compression fit for effortless comfort. Featuring a solid design and mock neck neckline, it's tailored for training moments throughout the winter season. A versatile wardrobe staple that pairs easily and wears beautifully day after day.",
    "longDescription": "Meet the Compression Base Layer — a thoughtfully designed base layers that brings together premium materials and a refined fit. Crafted from Polyester Elastane Knit, it is built to feel as good as it looks. The fabric is carefully selected for its soft hand-feel, resilience and natural drape, giving you a piece that holds its shape and color through repeated wear. Every detail — from the mock neck to the precision-finished seams and durable trims — reflects a genuine commitment to premium craftsmanship that you can see and feel.\n\nFabric & Comfort: Polyester Elastane Knit offers a balance of softness and structure that sits comfortably against the skin. The weave is breathable and gentle, helping regulate temperature so you stay fresh through busy days. The compression fit allows a natural range of movement without feeling restrictive, while careful tailoring ensures a clean, flattering line. The long sleeve cut adds balance to the overall silhouette, making this an easy choice when you want to look put-together without compromising on ease or all-day wearability.\n\nStyle Benefits: the solid aesthetic makes this a genuinely versatile addition to any wardrobe. It layers effortlessly, mixes with both relaxed and elevated pieces, and adapts to your mood and the moment. Whether you dress it up or keep it understated, the Compression Base Layer delivers a modern, considered look. The colorways are chosen to complement a wide range of skin tones and existing outfits, so styling it is intuitive rather than complicated.\n\nUsage Scenarios: ideally suited for training settings throughout the winter season, this piece transitions smoothly across your day. Wear it for casual outings, weekend plans, travel, gatherings with friends, or relaxed time at home. Its adaptable design means it works across your existing wardrobe with minimal effort, quickly becoming a reliable go-to you will reach for again and again — versatile enough to earn its place season after season.\n\nCare Instructions: to keep the Compression Base Layer looking its best, machine wash cold with similar colors on a gentle cycle. Do not bleach, and avoid harsh detergents that can dull the finish. Tumble dry on low or line dry in shade to protect the fibers, and warm iron on the reverse if needed. Avoid wringing to preserve the fabric structure and shape. With this simple care routine, your piece will stay fresh, soft and vibrant wash after wash — a smart, long-lasting investment in your everyday style.",
    "features": [
      "Premium Polyester fabric",
      "Breathable, skin-friendly material",
      "Fade-resistant color retention",
      "Soft-touch finish for all-day comfort",
      "Lightweight, easy-to-wear construction",
      "Compression Fit for a flattering silhouette",
      "Reinforced stitching for durability"
    ],
    "specifications": {
      "Material": "Polyester Elastane Knit",
      "Fit Type": "Compression Fit",
      "Sleeve Type": "Long Sleeve",
      "Neck Type": "Mock Neck",
      "Pattern": "Solid",
      "Occasion": "Training",
      "Season": "Winter",
      "Gender": "Unisex",
      "Country of Origin": "Bangladesh"
    },
    "sizeGuide": [
      {
        "size": "XS",
        "chest": "34",
        "waist": "28",
        "length": "66",
        "shoulder": "40"
      },
      {
        "size": "S",
        "chest": "36",
        "waist": "30",
        "length": "68",
        "shoulder": "42"
      },
      {
        "size": "M",
        "chest": "38",
        "waist": "32",
        "length": "70",
        "shoulder": "44"
      },
      {
        "size": "L",
        "chest": "40",
        "waist": "34",
        "length": "72",
        "shoulder": "46"
      },
      {
        "size": "XL",
        "chest": "42",
        "waist": "36",
        "length": "74",
        "shoulder": "48"
      },
      {
        "size": "XXL",
        "chest": "44",
        "waist": "38",
        "length": "76",
        "shoulder": "50"
      }
    ],
    "reviews": [
      {
        "name": "Naimur Rashid",
        "rating": 4,
        "text": "The material breathes really well, perfect for our weather. Highly recommend.",
        "date": "2025-10-18"
      },
      {
        "name": "Jannatul Ferdous",
        "rating": 5,
        "text": "Looks even better in person. Got compliments the first time I wore it.",
        "date": "2025-10-09"
      },
      {
        "name": "Asif Mahmud",
        "rating": 4,
        "text": "True to size and holds up well after multiple washes. Very happy.",
        "date": "2025-09-30"
      },
      {
        "name": "Priya Das",
        "rating": 5,
        "text": "Premium feel without the premium markup. Will buy again from this brand.",
        "date": "2025-09-21"
      },
      {
        "name": "Sabbir Ahmed",
        "rating": 3,
        "text": "Happy with it, just wish there were a few more color options.",
        "date": "2025-09-12"
      },
      {
        "name": "Rifat Karim",
        "rating": 5,
        "text": "Fantastic everyday piece — versatile, stylish and easy to care for.",
        "date": "2025-09-03"
      },
      {
        "name": "Mehnaz Haque",
        "rating": 4,
        "text": "Absolutely love the quality, the fabric feels premium and the fit is spot on.",
        "date": "2025-08-25"
      }
    ],
    "relatedIds": [
      "prod-050",
      "prod-041",
      "prod-042",
      "prod-043"
    ],
    "frequentlyBoughtTogetherIds": [
      "prod-041",
      "prod-042"
    ],
    "customersAlsoBoughtIds": [
      "prod-005",
      "prod-006",
      "prod-007",
      "prod-008"
    ]
  },
  {
    "id": "prod-046",
    "slug": "track-pants-sports",
    "name": "Track Pants",
    "sku": "SP-0046",
    "category": "Sports",
    "subcategory": "Bottoms",
    "brand": "Apex Active",
    "price": 1390,
    "comparePrice": 1890,
    "discountPercent": 26,
    "rating": 4.5,
    "reviewCount": 773,
    "stock": 0,
    "images": [
      "https://picsum.photos/seed/track-pants-sports-front/700/933",
      "https://picsum.photos/seed/track-pants-sports-back/700/933",
      "https://picsum.photos/seed/track-pants-sports-life/700/933",
      "https://picsum.photos/seed/track-pants-sports-model/700/933"
    ],
    "imageRoles": {
      "front": "https://picsum.photos/seed/track-pants-sports-front/700/933",
      "back": "https://picsum.photos/seed/track-pants-sports-back/700/933",
      "lifestyle": "https://picsum.photos/seed/track-pants-sports-life/700/933",
      "model": "https://picsum.photos/seed/track-pants-sports-model/700/933"
    },
    "colors": [
      {
        "name": "Black",
        "hex": "#1c1c1c"
      },
      {
        "name": "Charcoal",
        "hex": "#3a3a3a"
      },
      {
        "name": "Sky Blue",
        "hex": "#9fc3e0"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "seo": {
      "title": "Track Pants for Active Wear – High-Performance Activewear",
      "slug": "track-pants-sports",
      "metaTitle": "Track Pants | Buy Online",
      "metaDescription": "Shop the Track Pants in Tricot Polyester. Tapered Fit, side stripe design for athleisure. Now 26% off with fast delivery. Free returns. Free returns. Free retur",
      "keywords": [
        "track pants",
        "sports bottoms",
        "side stripe bottoms",
        "buy track pants online",
        "athleisure wear",
        "premium bottoms"
      ]
    },
    "shortDescription": "The Track Pants blends tricot polyester with a tapered fit for effortless comfort. Featuring a side stripe design and it's tailored for athleisure moments throughout the all season season. A versatile wardrobe staple that pairs easily and wears beautifully day after day.",
    "longDescription": "Meet the Track Pants — a thoughtfully designed bottoms that brings together premium materials and a refined fit. Crafted from Tricot Polyester, it is built to feel as good as it looks. The fabric is carefully selected for its soft hand-feel, resilience and natural drape, giving you a piece that holds its shape and color through repeated wear. Every detail — from the clean construction to the precision-finished seams and durable trims — reflects a genuine commitment to premium craftsmanship that you can see and feel.\n\nFabric & Comfort: Tricot Polyester offers a balance of softness and structure that sits comfortably against the skin. The weave is breathable and gentle, helping regulate temperature so you stay fresh through busy days. The tapered fit allows a natural range of movement without feeling restrictive, while careful tailoring ensures a clean, flattering line. making this an easy choice when you want to look put-together without compromising on ease or all-day wearability.\n\nStyle Benefits: the side stripe aesthetic makes this a genuinely versatile addition to any wardrobe. It layers effortlessly, mixes with both relaxed and elevated pieces, and adapts to your mood and the moment. Whether you dress it up or keep it understated, the Track Pants delivers a modern, considered look. The colorways are chosen to complement a wide range of skin tones and existing outfits, so styling it is intuitive rather than complicated.\n\nUsage Scenarios: ideally suited for athleisure settings throughout the all season season, this piece transitions smoothly across your day. Wear it for casual outings, weekend plans, travel, gatherings with friends, or relaxed time at home. Its adaptable design means it works across your existing wardrobe with minimal effort, quickly becoming a reliable go-to you will reach for again and again — versatile enough to earn its place season after season.\n\nCare Instructions: to keep the Track Pants looking its best, machine wash cold with similar colors on a gentle cycle. Do not bleach, and avoid harsh detergents that can dull the finish. Tumble dry on low or line dry in shade to protect the fibers, and warm iron on the reverse if needed. Avoid wringing to preserve the fabric structure and shape. With this simple care routine, your piece will stay fresh, soft and vibrant wash after wash — a smart, long-lasting investment in your everyday style.",
    "features": [
      "Premium Tricot fabric",
      "Breathable, skin-friendly material",
      "Fade-resistant color retention",
      "Soft-touch finish for all-day comfort",
      "Lightweight, easy-to-wear construction",
      "Tapered Fit for a flattering silhouette",
      "Reinforced stitching for durability"
    ],
    "specifications": {
      "Material": "Tricot Polyester",
      "Fit Type": "Tapered Fit",
      "Sleeve Type": "N/A",
      "Neck Type": "N/A",
      "Pattern": "Side Stripe",
      "Occasion": "Athleisure",
      "Season": "All Season",
      "Gender": "Unisex",
      "Country of Origin": "Bangladesh"
    },
    "sizeGuide": [
      {
        "size": "XS",
        "chest": "34",
        "waist": "28",
        "length": "66",
        "shoulder": "40"
      },
      {
        "size": "S",
        "chest": "36",
        "waist": "30",
        "length": "68",
        "shoulder": "42"
      },
      {
        "size": "M",
        "chest": "38",
        "waist": "32",
        "length": "70",
        "shoulder": "44"
      },
      {
        "size": "L",
        "chest": "40",
        "waist": "34",
        "length": "72",
        "shoulder": "46"
      },
      {
        "size": "XL",
        "chest": "42",
        "waist": "36",
        "length": "74",
        "shoulder": "48"
      },
      {
        "size": "XXL",
        "chest": "44",
        "waist": "38",
        "length": "76",
        "shoulder": "50"
      }
    ],
    "reviews": [
      {
        "name": "Jannatul Ferdous",
        "rating": 5,
        "text": "Looks even better in person. Got compliments the first time I wore it.",
        "date": "2025-10-17"
      },
      {
        "name": "Asif Mahmud",
        "rating": 4,
        "text": "True to size and holds up well after multiple washes. Very happy.",
        "date": "2025-10-08"
      },
      {
        "name": "Priya Das",
        "rating": 5,
        "text": "Premium feel without the premium markup. Will buy again from this brand.",
        "date": "2025-09-29"
      },
      {
        "name": "Sabbir Ahmed",
        "rating": 4,
        "text": "Soft, lightweight and well finished. Exactly what I was looking for.",
        "date": "2025-09-20"
      },
      {
        "name": "Rifat Karim",
        "rating": 3,
        "text": "Decent fabric for the price, the fit runs a touch slim.",
        "date": "2025-09-11"
      },
      {
        "name": "Mehnaz Haque",
        "rating": 4,
        "text": "Absolutely love the quality, the fabric feels premium and the fit is spot on.",
        "date": "2025-09-02"
      },
      {
        "name": "Tahmid Islam",
        "rating": 5,
        "text": "Exceeded my expectations — stitching is clean and the color is exactly as shown.",
        "date": "2025-08-24"
      },
      {
        "name": "Anika Tabassum",
        "rating": 4,
        "text": "Super comfortable for all-day wear, I've already ordered a second one.",
        "date": "2025-08-15"
      }
    ],
    "relatedIds": [
      "prod-041",
      "prod-042",
      "prod-043",
      "prod-044"
    ],
    "frequentlyBoughtTogetherIds": [
      "prod-042",
      "prod-043"
    ],
    "customersAlsoBoughtIds": [
      "prod-006",
      "prod-007",
      "prod-008",
      "prod-009"
    ]
  },
  {
    "id": "prod-047",
    "slug": "performance-tank-top-sports",
    "name": "Performance Tank Top",
    "sku": "SP-0047",
    "category": "Sports",
    "subcategory": "Activewear Tops",
    "brand": "Apex Active",
    "price": 690,
    "comparePrice": 990,
    "discountPercent": 30,
    "rating": 4.8,
    "reviewCount": 830,
    "stock": 64,
    "images": [
      "https://picsum.photos/seed/performance-tank-top-sports-front/700/933",
      "https://picsum.photos/seed/performance-tank-top-sports-back/700/933",
      "https://picsum.photos/seed/performance-tank-top-sports-life/700/933",
      "https://picsum.photos/seed/performance-tank-top-sports-model/700/933"
    ],
    "imageRoles": {
      "front": "https://picsum.photos/seed/performance-tank-top-sports-front/700/933",
      "back": "https://picsum.photos/seed/performance-tank-top-sports-back/700/933",
      "lifestyle": "https://picsum.photos/seed/performance-tank-top-sports-life/700/933",
      "model": "https://picsum.photos/seed/performance-tank-top-sports-model/700/933"
    },
    "colors": [
      {
        "name": "White",
        "hex": "#f5f5f5"
      },
      {
        "name": "Olive",
        "hex": "#5b5a3a"
      },
      {
        "name": "Mustard",
        "hex": "#d6a531"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "seo": {
      "title": "Performance Tank Top for Active Wear – High-Performance Activewear",
      "slug": "performance-tank-top-sports",
      "metaTitle": "Performance Tank Top | Buy Online",
      "metaDescription": "Shop the Performance Tank Top in Quick-Dry Microfiber. Athletic Fit, solid design for gym. Now 30% off with fast delivery. Free returns. Free returns.",
      "keywords": [
        "performance tank top",
        "sports activewear tops",
        "solid activewear tops",
        "buy performance tank top online",
        "gym wear",
        "premium activewear tops"
      ]
    },
    "shortDescription": "The Performance Tank Top blends quick-dry microfiber with a athletic fit for effortless comfort. Featuring a solid design and racerback neckline, it's tailored for gym moments throughout the summer season. A versatile wardrobe staple that pairs easily and wears beautifully day after day.",
    "longDescription": "Meet the Performance Tank Top — a thoughtfully designed activewear tops that brings together premium materials and a refined fit. Crafted from Quick-Dry Microfiber, it is built to feel as good as it looks. The fabric is carefully selected for its soft hand-feel, resilience and natural drape, giving you a piece that holds its shape and color through repeated wear. Every detail — from the racerback to the precision-finished seams and durable trims — reflects a genuine commitment to premium craftsmanship that you can see and feel.\n\nFabric & Comfort: Quick-Dry Microfiber offers a balance of softness and structure that sits comfortably against the skin. The weave is breathable and gentle, helping regulate temperature so you stay fresh through busy days. The athletic fit allows a natural range of movement without feeling restrictive, while careful tailoring ensures a clean, flattering line. The sleeveless cut adds balance to the overall silhouette, making this an easy choice when you want to look put-together without compromising on ease or all-day wearability.\n\nStyle Benefits: the solid aesthetic makes this a genuinely versatile addition to any wardrobe. It layers effortlessly, mixes with both relaxed and elevated pieces, and adapts to your mood and the moment. Whether you dress it up or keep it understated, the Performance Tank Top delivers a modern, considered look. The colorways are chosen to complement a wide range of skin tones and existing outfits, so styling it is intuitive rather than complicated.\n\nUsage Scenarios: ideally suited for gym settings throughout the summer season, this piece transitions smoothly across your day. Wear it for casual outings, weekend plans, travel, gatherings with friends, or relaxed time at home. Its adaptable design means it works across your existing wardrobe with minimal effort, quickly becoming a reliable go-to you will reach for again and again — versatile enough to earn its place season after season.\n\nCare Instructions: to keep the Performance Tank Top looking its best, machine wash cold with similar colors on a gentle cycle. Do not bleach, and avoid harsh detergents that can dull the finish. Tumble dry on low or line dry in shade to protect the fibers, and warm iron on the reverse if needed. Avoid wringing to preserve the fabric structure and shape. With this simple care routine, your piece will stay fresh, soft and vibrant wash after wash — a smart, long-lasting investment in your everyday style.",
    "features": [
      "Premium Quick-Dry fabric",
      "Breathable, skin-friendly material",
      "Fade-resistant color retention",
      "Soft-touch finish for all-day comfort",
      "Lightweight, easy-to-wear construction",
      "Athletic Fit for a flattering silhouette",
      "Reinforced stitching for durability"
    ],
    "specifications": {
      "Material": "Quick-Dry Microfiber",
      "Fit Type": "Athletic Fit",
      "Sleeve Type": "Sleeveless",
      "Neck Type": "Racerback",
      "Pattern": "Solid",
      "Occasion": "Gym",
      "Season": "Summer",
      "Gender": "Unisex",
      "Country of Origin": "Bangladesh"
    },
    "sizeGuide": [
      {
        "size": "XS",
        "chest": "34",
        "waist": "28",
        "length": "66",
        "shoulder": "40"
      },
      {
        "size": "S",
        "chest": "36",
        "waist": "30",
        "length": "68",
        "shoulder": "42"
      },
      {
        "size": "M",
        "chest": "38",
        "waist": "32",
        "length": "70",
        "shoulder": "44"
      },
      {
        "size": "L",
        "chest": "40",
        "waist": "34",
        "length": "72",
        "shoulder": "46"
      },
      {
        "size": "XL",
        "chest": "42",
        "waist": "36",
        "length": "74",
        "shoulder": "48"
      },
      {
        "size": "XXL",
        "chest": "44",
        "waist": "38",
        "length": "76",
        "shoulder": "50"
      }
    ],
    "reviews": [
      {
        "name": "Asif Mahmud",
        "rating": 4,
        "text": "True to size and holds up well after multiple washes. Very happy.",
        "date": "2025-10-16"
      },
      {
        "name": "Priya Das",
        "rating": 5,
        "text": "Premium feel without the premium markup. Will buy again from this brand.",
        "date": "2025-10-07"
      },
      {
        "name": "Sabbir Ahmed",
        "rating": 4,
        "text": "Soft, lightweight and well finished. Exactly what I was looking for.",
        "date": "2025-09-28"
      },
      {
        "name": "Rifat Karim",
        "rating": 5,
        "text": "Fantastic everyday piece — versatile, stylish and easy to care for.",
        "date": "2025-09-19"
      },
      {
        "name": "Mehnaz Haque",
        "rating": 3,
        "text": "Good product overall, though I'd suggest sizing up for a relaxed fit.",
        "date": "2025-09-10"
      },
      {
        "name": "Tahmid Islam",
        "rating": 5,
        "text": "Exceeded my expectations — stitching is clean and the color is exactly as shown.",
        "date": "2025-09-01"
      },
      {
        "name": "Anika Tabassum",
        "rating": 4,
        "text": "Super comfortable for all-day wear, I've already ordered a second one.",
        "date": "2025-08-23"
      },
      {
        "name": "Shuvo Roy",
        "rating": 5,
        "text": "Great value for the price. Delivery was fast and packaging was neat.",
        "date": "2025-08-14"
      },
      {
        "name": "Faria Noor",
        "rating": 4,
        "text": "The material breathes really well, perfect for our weather. Highly recommend.",
        "date": "2025-08-05"
      }
    ],
    "relatedIds": [
      "prod-042",
      "prod-043",
      "prod-044",
      "prod-045"
    ],
    "frequentlyBoughtTogetherIds": [
      "prod-043",
      "prod-044"
    ],
    "customersAlsoBoughtIds": [
      "prod-007",
      "prod-008",
      "prod-009",
      "prod-010"
    ]
  },
  {
    "id": "prod-048",
    "slug": "windbreaker-jacket-sports",
    "name": "Windbreaker Jacket",
    "sku": "SP-0048",
    "category": "Sports",
    "subcategory": "Jackets",
    "brand": "Apex Active",
    "price": 2490,
    "comparePrice": 3290,
    "discountPercent": 24,
    "rating": 4.1,
    "reviewCount": 887,
    "stock": 77,
    "images": [
      "https://picsum.photos/seed/windbreaker-jacket-sports-front/700/933",
      "https://picsum.photos/seed/windbreaker-jacket-sports-back/700/933",
      "https://picsum.photos/seed/windbreaker-jacket-sports-life/700/933",
      "https://picsum.photos/seed/windbreaker-jacket-sports-model/700/933"
    ],
    "imageRoles": {
      "front": "https://picsum.photos/seed/windbreaker-jacket-sports-front/700/933",
      "back": "https://picsum.photos/seed/windbreaker-jacket-sports-back/700/933",
      "lifestyle": "https://picsum.photos/seed/windbreaker-jacket-sports-life/700/933",
      "model": "https://picsum.photos/seed/windbreaker-jacket-sports-model/700/933"
    },
    "colors": [
      {
        "name": "Navy",
        "hex": "#1f2a44"
      },
      {
        "name": "Maroon",
        "hex": "#6e1f2b"
      },
      {
        "name": "Teal",
        "hex": "#1f6f6b"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "seo": {
      "title": "Windbreaker Jacket for Active Wear – High-Performance Activewear",
      "slug": "windbreaker-jacket-sports",
      "metaTitle": "Windbreaker Jacket | Buy Online",
      "metaDescription": "Shop the Windbreaker Jacket in Water-Resistant Nylon. Regular Fit, color block design for outdoor. Now 24% off with fast delivery. Free returns. Free returns.",
      "keywords": [
        "windbreaker jacket",
        "sports jackets",
        "color block jackets",
        "buy windbreaker jacket online",
        "outdoor wear",
        "premium jackets"
      ]
    },
    "shortDescription": "The Windbreaker Jacket blends water-resistant nylon with a regular fit for effortless comfort. Featuring a color block design and hooded neckline, it's tailored for outdoor moments throughout the all season season. A versatile wardrobe staple that pairs easily and wears beautifully day after day.",
    "longDescription": "Meet the Windbreaker Jacket — a thoughtfully designed jackets that brings together premium materials and a refined fit. Crafted from Water-Resistant Nylon, it is built to feel as good as it looks. The fabric is carefully selected for its soft hand-feel, resilience and natural drape, giving you a piece that holds its shape and color through repeated wear. Every detail — from the hooded to the precision-finished seams and durable trims — reflects a genuine commitment to premium craftsmanship that you can see and feel.\n\nFabric & Comfort: Water-Resistant Nylon offers a balance of softness and structure that sits comfortably against the skin. The weave is breathable and gentle, helping regulate temperature so you stay fresh through busy days. The regular fit allows a natural range of movement without feeling restrictive, while careful tailoring ensures a clean, flattering line. The full sleeve cut adds balance to the overall silhouette, making this an easy choice when you want to look put-together without compromising on ease or all-day wearability.\n\nStyle Benefits: the color block aesthetic makes this a genuinely versatile addition to any wardrobe. It layers effortlessly, mixes with both relaxed and elevated pieces, and adapts to your mood and the moment. Whether you dress it up or keep it understated, the Windbreaker Jacket delivers a modern, considered look. The colorways are chosen to complement a wide range of skin tones and existing outfits, so styling it is intuitive rather than complicated.\n\nUsage Scenarios: ideally suited for outdoor settings throughout the all season season, this piece transitions smoothly across your day. Wear it for casual outings, weekend plans, travel, gatherings with friends, or relaxed time at home. Its adaptable design means it works across your existing wardrobe with minimal effort, quickly becoming a reliable go-to you will reach for again and again — versatile enough to earn its place season after season.\n\nCare Instructions: to keep the Windbreaker Jacket looking its best, machine wash cold with similar colors on a gentle cycle. Do not bleach, and avoid harsh detergents that can dull the finish. Tumble dry on low or line dry in shade to protect the fibers, and warm iron on the reverse if needed. Avoid wringing to preserve the fabric structure and shape. With this simple care routine, your piece will stay fresh, soft and vibrant wash after wash — a smart, long-lasting investment in your everyday style.",
    "features": [
      "Premium Water-Resistant fabric",
      "Breathable, skin-friendly material",
      "Fade-resistant color retention",
      "Soft-touch finish for all-day comfort",
      "Lightweight, easy-to-wear construction",
      "Regular Fit for a flattering silhouette",
      "Reinforced stitching for durability"
    ],
    "specifications": {
      "Material": "Water-Resistant Nylon",
      "Fit Type": "Regular Fit",
      "Sleeve Type": "Full Sleeve",
      "Neck Type": "Hooded",
      "Pattern": "Color Block",
      "Occasion": "Outdoor",
      "Season": "All Season",
      "Gender": "Unisex",
      "Country of Origin": "Bangladesh"
    },
    "sizeGuide": [
      {
        "size": "XS",
        "chest": "34",
        "waist": "28",
        "length": "66",
        "shoulder": "40"
      },
      {
        "size": "S",
        "chest": "36",
        "waist": "30",
        "length": "68",
        "shoulder": "42"
      },
      {
        "size": "M",
        "chest": "38",
        "waist": "32",
        "length": "70",
        "shoulder": "44"
      },
      {
        "size": "L",
        "chest": "40",
        "waist": "34",
        "length": "72",
        "shoulder": "46"
      },
      {
        "size": "XL",
        "chest": "42",
        "waist": "36",
        "length": "74",
        "shoulder": "48"
      },
      {
        "size": "XXL",
        "chest": "44",
        "waist": "38",
        "length": "76",
        "shoulder": "50"
      }
    ],
    "reviews": [
      {
        "name": "Priya Das",
        "rating": 5,
        "text": "Premium feel without the premium markup. Will buy again from this brand.",
        "date": "2025-10-15"
      },
      {
        "name": "Sabbir Ahmed",
        "rating": 4,
        "text": "Soft, lightweight and well finished. Exactly what I was looking for.",
        "date": "2025-10-06"
      },
      {
        "name": "Rifat Karim",
        "rating": 5,
        "text": "Fantastic everyday piece — versatile, stylish and easy to care for.",
        "date": "2025-09-27"
      },
      {
        "name": "Mehnaz Haque",
        "rating": 4,
        "text": "Absolutely love the quality, the fabric feels premium and the fit is spot on.",
        "date": "2025-09-18"
      },
      {
        "name": "Tahmid Islam",
        "rating": 3,
        "text": "Nice quality but the color is slightly darker than the picture.",
        "date": "2025-09-09"
      },
      {
        "name": "Anika Tabassum",
        "rating": 4,
        "text": "Super comfortable for all-day wear, I've already ordered a second one.",
        "date": "2025-08-31"
      },
      {
        "name": "Shuvo Roy",
        "rating": 5,
        "text": "Great value for the price. Delivery was fast and packaging was neat.",
        "date": "2025-08-22"
      },
      {
        "name": "Faria Noor",
        "rating": 4,
        "text": "The material breathes really well, perfect for our weather. Highly recommend.",
        "date": "2025-08-13"
      },
      {
        "name": "Zubair Hossain",
        "rating": 5,
        "text": "Looks even better in person. Got compliments the first time I wore it.",
        "date": "2025-08-04"
      },
      {
        "name": "Nadia Sultana",
        "rating": 4,
        "text": "Nice quality but the color is slightly darker than the picture.",
        "date": "2025-07-26"
      }
    ],
    "relatedIds": [
      "prod-043",
      "prod-044",
      "prod-045",
      "prod-046"
    ],
    "frequentlyBoughtTogetherIds": [
      "prod-044",
      "prod-045"
    ],
    "customersAlsoBoughtIds": [
      "prod-008",
      "prod-009",
      "prod-010",
      "prod-011"
    ]
  },
  {
    "id": "prod-049",
    "slug": "yoga-leggings-sports",
    "name": "Yoga Leggings",
    "sku": "SP-0049",
    "category": "Sports",
    "subcategory": "Leggings",
    "brand": "Apex Active",
    "price": 1290,
    "comparePrice": 1790,
    "discountPercent": 28,
    "rating": 4.4,
    "reviewCount": 944,
    "stock": 90,
    "images": [
      "https://picsum.photos/seed/yoga-leggings-sports-front/700/933",
      "https://picsum.photos/seed/yoga-leggings-sports-back/700/933",
      "https://picsum.photos/seed/yoga-leggings-sports-life/700/933",
      "https://picsum.photos/seed/yoga-leggings-sports-model/700/933"
    ],
    "imageRoles": {
      "front": "https://picsum.photos/seed/yoga-leggings-sports-front/700/933",
      "back": "https://picsum.photos/seed/yoga-leggings-sports-back/700/933",
      "lifestyle": "https://picsum.photos/seed/yoga-leggings-sports-life/700/933",
      "model": "https://picsum.photos/seed/yoga-leggings-sports-model/700/933"
    },
    "colors": [
      {
        "name": "Charcoal",
        "hex": "#3a3a3a"
      },
      {
        "name": "Beige",
        "hex": "#d8c7a8"
      },
      {
        "name": "Coral",
        "hex": "#e8836b"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "seo": {
      "title": "Yoga Leggings for Active Wear – High-Performance Activewear",
      "slug": "yoga-leggings-sports",
      "metaTitle": "Yoga Leggings | Buy Online",
      "metaDescription": "Shop the Yoga Leggings in High-Stretch Nylon Spandex. Compression Fit, solid design for yoga. Now 28% off with fast delivery. Free returns. Free returns.",
      "keywords": [
        "yoga leggings",
        "sports leggings",
        "solid leggings",
        "buy yoga leggings online",
        "yoga wear",
        "premium leggings"
      ]
    },
    "shortDescription": "The Yoga Leggings blends high-stretch nylon spandex with a compression fit for effortless comfort. Featuring a solid design and it's tailored for yoga moments throughout the all season season. A versatile wardrobe staple that pairs easily and wears beautifully day after day.",
    "longDescription": "Meet the Yoga Leggings — a thoughtfully designed leggings that brings together premium materials and a refined fit. Crafted from High-Stretch Nylon Spandex, it is built to feel as good as it looks. The fabric is carefully selected for its soft hand-feel, resilience and natural drape, giving you a piece that holds its shape and color through repeated wear. Every detail — from the clean construction to the precision-finished seams and durable trims — reflects a genuine commitment to premium craftsmanship that you can see and feel.\n\nFabric & Comfort: High-Stretch Nylon Spandex offers a balance of softness and structure that sits comfortably against the skin. The weave is breathable and gentle, helping regulate temperature so you stay fresh through busy days. The compression fit allows a natural range of movement without feeling restrictive, while careful tailoring ensures a clean, flattering line. making this an easy choice when you want to look put-together without compromising on ease or all-day wearability.\n\nStyle Benefits: the solid aesthetic makes this a genuinely versatile addition to any wardrobe. It layers effortlessly, mixes with both relaxed and elevated pieces, and adapts to your mood and the moment. Whether you dress it up or keep it understated, the Yoga Leggings delivers a modern, considered look. The colorways are chosen to complement a wide range of skin tones and existing outfits, so styling it is intuitive rather than complicated.\n\nUsage Scenarios: ideally suited for yoga settings throughout the all season season, this piece transitions smoothly across your day. Wear it for casual outings, weekend plans, travel, gatherings with friends, or relaxed time at home. Its adaptable design means it works across your existing wardrobe with minimal effort, quickly becoming a reliable go-to you will reach for again and again — versatile enough to earn its place season after season.\n\nCare Instructions: to keep the Yoga Leggings looking its best, machine wash cold with similar colors on a gentle cycle. Do not bleach, and avoid harsh detergents that can dull the finish. Tumble dry on low or line dry in shade to protect the fibers, and warm iron on the reverse if needed. Avoid wringing to preserve the fabric structure and shape. With this simple care routine, your piece will stay fresh, soft and vibrant wash after wash — a smart, long-lasting investment in your everyday style.",
    "features": [
      "Premium High-Stretch fabric",
      "Breathable, skin-friendly material",
      "Fade-resistant color retention",
      "Soft-touch finish for all-day comfort",
      "Lightweight, easy-to-wear construction",
      "Compression Fit for a flattering silhouette",
      "Reinforced stitching for durability"
    ],
    "specifications": {
      "Material": "High-Stretch Nylon Spandex",
      "Fit Type": "Compression Fit",
      "Sleeve Type": "N/A",
      "Neck Type": "N/A",
      "Pattern": "Solid",
      "Occasion": "Yoga",
      "Season": "All Season",
      "Gender": "Unisex",
      "Country of Origin": "Bangladesh"
    },
    "sizeGuide": [
      {
        "size": "XS",
        "chest": "34",
        "waist": "28",
        "length": "66",
        "shoulder": "40"
      },
      {
        "size": "S",
        "chest": "36",
        "waist": "30",
        "length": "68",
        "shoulder": "42"
      },
      {
        "size": "M",
        "chest": "38",
        "waist": "32",
        "length": "70",
        "shoulder": "44"
      },
      {
        "size": "L",
        "chest": "40",
        "waist": "34",
        "length": "72",
        "shoulder": "46"
      },
      {
        "size": "XL",
        "chest": "42",
        "waist": "36",
        "length": "74",
        "shoulder": "48"
      },
      {
        "size": "XXL",
        "chest": "44",
        "waist": "38",
        "length": "76",
        "shoulder": "50"
      }
    ],
    "reviews": [
      {
        "name": "Sabbir Ahmed",
        "rating": 4,
        "text": "Soft, lightweight and well finished. Exactly what I was looking for.",
        "date": "2025-10-14"
      },
      {
        "name": "Rifat Karim",
        "rating": 5,
        "text": "Fantastic everyday piece — versatile, stylish and easy to care for.",
        "date": "2025-10-05"
      },
      {
        "name": "Mehnaz Haque",
        "rating": 4,
        "text": "Absolutely love the quality, the fabric feels premium and the fit is spot on.",
        "date": "2025-09-26"
      },
      {
        "name": "Tahmid Islam",
        "rating": 5,
        "text": "Exceeded my expectations — stitching is clean and the color is exactly as shown.",
        "date": "2025-09-17"
      },
      {
        "name": "Anika Tabassum",
        "rating": 3,
        "text": "Comfortable and well made, delivery took a little longer than expected.",
        "date": "2025-09-08"
      }
    ],
    "relatedIds": [
      "prod-044",
      "prod-045",
      "prod-046",
      "prod-047"
    ],
    "frequentlyBoughtTogetherIds": [
      "prod-045",
      "prod-046"
    ],
    "customersAlsoBoughtIds": [
      "prod-009",
      "prod-010",
      "prod-011",
      "prod-012"
    ]
  },
  {
    "id": "prod-050",
    "slug": "cushioned-sports-socks-3-pack-sports",
    "name": "Cushioned Sports Socks (3-Pack)",
    "sku": "SP-0050",
    "category": "Sports",
    "subcategory": "Accessories",
    "brand": "Apex Active",
    "price": 490,
    "comparePrice": 790,
    "discountPercent": 38,
    "rating": 4.7,
    "reviewCount": 81,
    "stock": 103,
    "images": [
      "https://picsum.photos/seed/cushioned-sports-socks-3-pack-sports-front/700/933",
      "https://picsum.photos/seed/cushioned-sports-socks-3-pack-sports-back/700/933",
      "https://picsum.photos/seed/cushioned-sports-socks-3-pack-sports-life/700/933",
      "https://picsum.photos/seed/cushioned-sports-socks-3-pack-sports-model/700/933"
    ],
    "imageRoles": {
      "front": "https://picsum.photos/seed/cushioned-sports-socks-3-pack-sports-front/700/933",
      "back": "https://picsum.photos/seed/cushioned-sports-socks-3-pack-sports-back/700/933",
      "lifestyle": "https://picsum.photos/seed/cushioned-sports-socks-3-pack-sports-life/700/933",
      "model": "https://picsum.photos/seed/cushioned-sports-socks-3-pack-sports-model/700/933"
    },
    "colors": [
      {
        "name": "Olive",
        "hex": "#5b5a3a"
      },
      {
        "name": "Sky Blue",
        "hex": "#9fc3e0"
      },
      {
        "name": "Blush Pink",
        "hex": "#e8b5bf"
      }
    ],
    "sizes": [
      "6",
      "7",
      "8",
      "9",
      "10",
      "11"
    ],
    "seo": {
      "title": "Cushioned Sports Socks (3-Pack) for Active Wear – High-Performance Activewear",
      "slug": "cushioned-sports-socks-3-pack-sports",
      "metaTitle": "Cushioned Sports Socks (3-Pack) | Buy Online",
      "metaDescription": "Shop the Cushioned Sports Socks (3-Pack) in Cotton Blend Terry Knit. Regular Fit, logo knit design for sports. Now 38% off with fast delivery. Free returns.",
      "keywords": [
        "cushioned sports socks (3-pack)",
        "sports accessories",
        "logo knit accessories",
        "buy cushioned sports socks (3-pack) online",
        "sports wear",
        "premium accessories"
      ]
    },
    "shortDescription": "The Cushioned Sports Socks (3-Pack) blends cotton blend terry knit with a regular fit for effortless comfort. Featuring a logo knit design and it's tailored for sports moments throughout the all season season. A versatile wardrobe staple that pairs easily and wears beautifully day after day.",
    "longDescription": "Meet the Cushioned Sports Socks (3-Pack) — a thoughtfully designed accessories that brings together premium materials and a refined fit. Crafted from Cotton Blend Terry Knit, it is built to feel as good as it looks. The fabric is carefully selected for its soft hand-feel, resilience and natural drape, giving you a piece that holds its shape and color through repeated wear. Every detail — from the clean construction to the precision-finished seams and durable trims — reflects a genuine commitment to premium craftsmanship that you can see and feel.\n\nFabric & Comfort: Cotton Blend Terry Knit offers a balance of softness and structure that sits comfortably against the skin. The weave is breathable and gentle, helping regulate temperature so you stay fresh through busy days. The regular fit allows a natural range of movement without feeling restrictive, while careful tailoring ensures a clean, flattering line. making this an easy choice when you want to look put-together without compromising on ease or all-day wearability.\n\nStyle Benefits: the logo knit aesthetic makes this a genuinely versatile addition to any wardrobe. It layers effortlessly, mixes with both relaxed and elevated pieces, and adapts to your mood and the moment. Whether you dress it up or keep it understated, the Cushioned Sports Socks (3-Pack) delivers a modern, considered look. The colorways are chosen to complement a wide range of skin tones and existing outfits, so styling it is intuitive rather than complicated.\n\nUsage Scenarios: ideally suited for sports settings throughout the all season season, this piece transitions smoothly across your day. Wear it for casual outings, weekend plans, travel, gatherings with friends, or relaxed time at home. Its adaptable design means it works across your existing wardrobe with minimal effort, quickly becoming a reliable go-to you will reach for again and again — versatile enough to earn its place season after season.\n\nCare Instructions: to keep the Cushioned Sports Socks (3-Pack) looking its best, machine wash cold with similar colors on a gentle cycle. Do not bleach, and avoid harsh detergents that can dull the finish. Tumble dry on low or line dry in shade to protect the fibers, and warm iron on the reverse if needed. Avoid wringing to preserve the fabric structure and shape. With this simple care routine, your piece will stay fresh, soft and vibrant wash after wash — a smart, long-lasting investment in your everyday style.",
    "features": [
      "Premium Cotton fabric",
      "Breathable, skin-friendly material",
      "Fade-resistant color retention",
      "Soft-touch finish for all-day comfort",
      "Lightweight, easy-to-wear construction",
      "Regular Fit for a flattering silhouette",
      "Reinforced stitching for durability"
    ],
    "specifications": {
      "Material": "Cotton Blend Terry Knit",
      "Fit Type": "Regular Fit",
      "Sleeve Type": "N/A",
      "Neck Type": "N/A",
      "Pattern": "Logo Knit",
      "Occasion": "Sports",
      "Season": "All Season",
      "Gender": "Unisex",
      "Country of Origin": "Bangladesh"
    },
    "sizeGuide": [
      {
        "size": "6",
        "note": "UK 6"
      },
      {
        "size": "7",
        "note": "UK 7"
      },
      {
        "size": "8",
        "note": "UK 8"
      },
      {
        "size": "9",
        "note": "UK 9"
      },
      {
        "size": "10",
        "note": "UK 10"
      },
      {
        "size": "11",
        "note": "UK 11"
      }
    ],
    "reviews": [
      {
        "name": "Rifat Karim",
        "rating": 5,
        "text": "Fantastic everyday piece — versatile, stylish and easy to care for.",
        "date": "2025-10-13"
      },
      {
        "name": "Mehnaz Haque",
        "rating": 4,
        "text": "Absolutely love the quality, the fabric feels premium and the fit is spot on.",
        "date": "2025-10-04"
      },
      {
        "name": "Tahmid Islam",
        "rating": 5,
        "text": "Exceeded my expectations — stitching is clean and the color is exactly as shown.",
        "date": "2025-09-25"
      },
      {
        "name": "Anika Tabassum",
        "rating": 4,
        "text": "Super comfortable for all-day wear, I've already ordered a second one.",
        "date": "2025-09-16"
      },
      {
        "name": "Shuvo Roy",
        "rating": 3,
        "text": "Happy with it, just wish there were a few more color options.",
        "date": "2025-09-07"
      },
      {
        "name": "Faria Noor",
        "rating": 4,
        "text": "The material breathes really well, perfect for our weather. Highly recommend.",
        "date": "2025-08-29"
      }
    ],
    "relatedIds": [
      "prod-045",
      "prod-046",
      "prod-047",
      "prod-048"
    ],
    "frequentlyBoughtTogetherIds": [
      "prod-046",
      "prod-047"
    ],
    "customersAlsoBoughtIds": [
      "prod-010",
      "prod-011",
      "prod-012",
      "prod-013"
    ]
  }
];

export const getDemoProduct = (idOrSlug: string): DemoProduct | undefined =>
  demoProducts.find((p) => p.id === idOrSlug || p.slug === idOrSlug);

export const getDemoProductsByCategory = (cat: DemoCategory): DemoProduct[] =>
  demoProducts.filter((p) => p.category === cat);

export const getRelatedProducts = (id: string): DemoProduct[] => {
  const p = getDemoProduct(id);
  if (!p) return [];
  return p.relatedIds.map((rid) => getDemoProduct(rid)).filter(Boolean) as DemoProduct[];
};

export const getFrequentlyBoughtTogether = (id: string): DemoProduct[] => {
  const p = getDemoProduct(id);
  if (!p) return [];
  return p.frequentlyBoughtTogetherIds.map((rid) => getDemoProduct(rid)).filter(Boolean) as DemoProduct[];
};

export const getCustomersAlsoBought = (id: string): DemoProduct[] => {
  const p = getDemoProduct(id);
  if (!p) return [];
  return p.customersAlsoBoughtIds.map((rid) => getDemoProduct(rid)).filter(Boolean) as DemoProduct[];
};

export const searchDemoProducts = (query: string): DemoProduct[] => {
  const q = query.trim().toLowerCase();
  if (!q) return demoProducts;
  return demoProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.subcategory.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.seo.keywords.some((k) => k.includes(q))
  );
};
