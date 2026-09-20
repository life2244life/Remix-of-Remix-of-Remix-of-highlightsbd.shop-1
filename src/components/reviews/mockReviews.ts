export interface MockReview {
  id: string;
  name: string;
  avatar?: string;
  verified: boolean;
  rating: number;
  date: string; // ISO
  title: string;
  body: string;
  images: string[];
  helpful: number;
  notHelpful: number;
}

const img = (seed: string) => `https://picsum.photos/seed/${seed}/600/600`;

export const mockReviews: MockReview[] = [
  {
    id: "r1",
    name: "Ayesha Rahman",
    verified: true,
    rating: 5,
    date: "2026-05-28",
    title: "Excellent quality fabric",
    body: "Very comfortable and premium feel. The stitching is flawless and it fits true to size. Easily my favourite piece this season.",
    images: [img("rev1a"), img("rev1b"), img("rev1c")],
    helpful: 84,
    notHelpful: 2,
  },
  {
    id: "r2",
    name: "Tanvir Hasan",
    verified: true,
    rating: 4,
    date: "2026-05-19",
    title: "Great value for the price",
    body: "Looks exactly like the photos. Colour is slightly deeper in person but I actually prefer it. Delivery was quick too.",
    images: [img("rev2a")],
    helpful: 41,
    notHelpful: 1,
  },
  {
    id: "r3",
    name: "Nusrat Jahan",
    verified: true,
    rating: 5,
    date: "2026-05-11",
    title: "Premium and elegant",
    body: "Feels luxurious without the luxury price tag. Got compliments the first day I wore it. Highly recommend.",
    images: [img("rev3a"), img("rev3b")],
    helpful: 27,
    notHelpful: 0,
  },
  {
    id: "r4",
    name: "Rifat Ahmed",
    verified: false,
    rating: 3,
    date: "2026-04-30",
    title: "Good but runs slightly large",
    body: "Quality is solid for the price but I'd suggest sizing down. Otherwise happy with the purchase.",
    images: [],
    helpful: 12,
    notHelpful: 3,
  },
  {
    id: "r5",
    name: "Sadia Islam",
    verified: true,
    rating: 5,
    date: "2026-04-22",
    title: "Worth every taka",
    body: "The material is breathable and soft. Washed it twice and no fading at all. Will buy again in another colour.",
    images: [img("rev5a"), img("rev5b"), img("rev5c"), img("rev5d")],
    helpful: 53,
    notHelpful: 1,
  },
  {
    id: "r6",
    name: "Mahin Chowdhury",
    verified: true,
    rating: 2,
    date: "2026-04-10",
    title: "Not what I expected",
    body: "The fit was a bit off for me and the colour was lighter than shown. Customer service was helpful though.",
    images: [],
    helpful: 6,
    notHelpful: 5,
  },
];

export interface RatingSummaryData {
  average: number;
  total: number;
  breakdown: Record<1 | 2 | 3 | 4 | 5, number>; // percentages
}

export const mockSummary: RatingSummaryData = {
  average: 4.8,
  total: 1254,
  breakdown: { 5: 78, 4: 14, 3: 5, 2: 2, 1: 1 },
};