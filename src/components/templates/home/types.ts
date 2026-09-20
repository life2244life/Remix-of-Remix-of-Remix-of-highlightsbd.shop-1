import { Product } from '@/data/products';

export interface HomeShared {
  reviewStats: Record<string, { avg: number; count: number }>;
  hoverImageMap: Record<string, string>;
  soldOutMap: Record<string, boolean>;
}

export interface HomeProps {
  allProducts: Product[];
  newArrivals: Product[];
  topSelling: Product[];
  isLoading: boolean;
  shared: HomeShared;
}