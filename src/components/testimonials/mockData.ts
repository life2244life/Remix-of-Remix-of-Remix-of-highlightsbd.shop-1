export interface Testimonial {
  id: string;
  name: string;
  location: string;
  avatar: string;
  verified: boolean;
  rating: number;
  date: string; // ISO
  text: string;
  product: string;
  productImage: string;
}

export interface VideoTestimonial {
  id: string;
  name: string;
  location: string;
  thumbnail: string;
  videoUrl: string;
  caption: string;
}

export interface RatingBreakdown {
  average: number;
  total: number;
  breakdown: Record<1 | 2 | 3 | 4 | 5, number>;
}

export interface TrustMetric {
  label: string;
  value: number;
  suffix: string;
  prefix?: string;
  decimals?: number;
}

export interface SocialBadge {
  label: string;
  icon: "verified" | "top" | "delivery" | "quality" | "return";
}

const avatar = (seed: string) => `https://i.pravatar.cc/200?u=${seed}`;
const product = (seed: string) => `https://picsum.photos/seed/${seed}/400/500`;
const photo = (seed: string) => `https://picsum.photos/seed/${seed}/600/600`;

export const ratingSummary: RatingBreakdown = {
  average: 4.8,
  total: 10254,
  breakdown: { 5: 78, 4: 14, 3: 5, 2: 2, 1: 1 },
};

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Ayesha Rahman",
    location: "Dhaka, Bangladesh",
    avatar: avatar("ayesha"),
    verified: true,
    rating: 5,
    date: "2026-05-28",
    text: "Excellent quality and fitting. The fabric feels premium and the stitching is flawless. Easily my favourite purchase this season.",
    product: "Premium Cotton Polo",
    productImage: product("polo1"),
  },
  {
    id: "t2",
    name: "Tanvir Hasan",
    location: "Chittagong, Bangladesh",
    avatar: avatar("tanvir"),
    verified: true,
    rating: 5,
    date: "2026-05-19",
    text: "Looks exactly like the photos and the delivery was incredibly fast. Highly recommended for anyone who loves a clean, modern look.",
    product: "Slim Fit Denim Jacket",
    productImage: product("denim1"),
  },
  {
    id: "t3",
    name: "Nusrat Jahan",
    location: "Sylhet, Bangladesh",
    avatar: avatar("nusrat"),
    verified: true,
    rating: 5,
    date: "2026-05-11",
    text: "Feels luxurious without the luxury price tag. Got compliments the very first day I wore it. Will definitely order again.",
    product: "Silk Blend Kurti",
    productImage: product("kurti1"),
  },
  {
    id: "t4",
    name: "Rifat Ahmed",
    location: "Khulna, Bangladesh",
    avatar: avatar("rifat"),
    verified: true,
    rating: 4,
    date: "2026-04-30",
    text: "Great value for the price. The colour is slightly deeper in person but I actually prefer it that way. Very happy overall.",
    product: "Classic Oxford Shirt",
    productImage: product("oxford1"),
  },
  {
    id: "t5",
    name: "Sadia Islam",
    location: "Rajshahi, Bangladesh",
    avatar: avatar("sadia"),
    verified: true,
    rating: 5,
    date: "2026-04-22",
    text: "The material is breathable and soft. Washed it twice and no fading at all. Worth every taka and the packaging was beautiful.",
    product: "Linen Summer Dress",
    productImage: product("dress1"),
  },
  {
    id: "t6",
    name: "Mahin Chowdhury",
    location: "Comilla, Bangladesh",
    avatar: avatar("mahin"),
    verified: true,
    rating: 5,
    date: "2026-04-10",
    text: "Top-tier service and the quality exceeded my expectations. The fit is perfect and it has become my everyday go-to piece.",
    product: "Tailored Chino Pants",
    productImage: product("chino1"),
  },
  {
    id: "t7",
    name: "Farhana Akter",
    location: "Barisal, Bangladesh",
    avatar: avatar("farhana"),
    verified: true,
    rating: 5,
    date: "2026-03-30",
    text: "Absolutely in love with the design and comfort. The customer support was friendly and the return policy gave me confidence to order.",
    product: "Embroidered Saree",
    productImage: product("saree1"),
  },
  {
    id: "t8",
    name: "Imran Kabir",
    location: "Rangpur, Bangladesh",
    avatar: avatar("imran"),
    verified: true,
    rating: 4,
    date: "2026-03-18",
    text: "Stylish and well made. Sizing runs true and the material holds up beautifully after multiple wears. A solid premium buy.",
    product: "Wool Blend Blazer",
    productImage: product("blazer1"),
  },
];

export const videoTestimonials: VideoTestimonial[] = [
  {
    id: "v1",
    name: "Ayesha Rahman",
    location: "Dhaka",
    thumbnail: photo("vid1"),
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    caption: "My honest unboxing experience",
  },
  {
    id: "v2",
    name: "Tanvir Hasan",
    location: "Chittagong",
    thumbnail: photo("vid2"),
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    caption: "Styling the new summer collection",
  },
  {
    id: "v3",
    name: "Nusrat Jahan",
    location: "Sylhet",
    thumbnail: photo("vid3"),
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    caption: "Why I keep coming back",
  },
];

export const galleryPhotos: string[] = Array.from({ length: 10 }, (_, i) =>
  photo(`gallery-${i + 1}`)
);

export const trustMetrics: TrustMetric[] = [
  { label: "Happy Customers", value: 100000, suffix: "+" },
  { label: "Orders Delivered", value: 50000, suffix: "+" },
  { label: "Average Rating", value: 4.8, suffix: "", decimals: 1 },
  { label: "Positive Reviews", value: 98, suffix: "%" },
];

export const socialBadges: SocialBadge[] = [
  { label: "Verified Buyers", icon: "verified" },
  { label: "Top Rated Products", icon: "top" },
  { label: "Fast Delivery", icon: "delivery" },
  { label: "Premium Quality", icon: "quality" },
  { label: "Easy Return", icon: "return" },
];

export interface CustomerStory {
  name: string;
  location: string;
  image: string;
  quote: string;
  story: string;
  favoriteProduct: string;
}

export const customerStory: CustomerStory = {
  name: "Maliha Tasnim",
  location: "Gulshan, Dhaka",
  image: photo("story-main"),
  quote:
    "Fashion is how I tell my story without saying a word — and this brand lets me tell it beautifully.",
  story:
    "Maliha discovered the brand two years ago while searching for timeless pieces that fit her fast-paced lifestyle. From boardroom blazers to weekend linens, she has built an entire capsule wardrobe she loves — pieces that feel as premium as they look, season after season.",
  favoriteProduct: "Tailored Wool Blazer",
};

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });