// Shared model for admin-managed product sections (Phase 3: Product Sections Management).
import { Product } from '@/data/products';

export type ProductSource = 'manual' | 'auto';

export type AutoMode =
  | 'top_selling'
  | 'most_ordered'
  | 'most_viewed'
  | 'newest'
  | 'featured'
  | 'flash_sale'
  | 'discounted'
  | 'category'
  | 'subcategory'
  | 'brand';

export type SectionLayout = 'grid' | 'slider';

export const AUTO_MODE_LABELS: Record<AutoMode, string> = {
  top_selling: 'Top Selling',
  most_ordered: 'Most Ordered Products',
  most_viewed: 'Most Viewed Products',
  newest: 'Newest Products',
  featured: 'Featured Products',
  flash_sale: 'Flash Sale Products',
  discounted: 'Discounted Products',
  category: 'Specific Category Products',
  subcategory: 'Specific Subcategory Products',
  brand: 'Specific Brand Products',
};

export const PRODUCT_COUNTS = [4, 6, 8, 12, 16];

export interface CardSettings {
  discountBadge: boolean;
  newBadge: boolean;
  rating: boolean;
  reviewCount: boolean;
  quickView: boolean;
  wishlist: boolean;
  addToCart: boolean;
  stockStatus: boolean;
}

export interface ProductSectionConfig {
  title: string;
  subtitle: string;
  viewAllText: string;
  viewAllUrl: string;
  source: ProductSource;
  autoMode: AutoMode;
  category: string;
  subcategory: string;
  brand: string;
  productIds: string[];
  count: number;
  layout: SectionLayout;
  mobileSlider: boolean;
  desktopGrid: boolean;
  mobilePerRow: number; // 1 or 2
  card: CardSettings;
  // flash sale extras
  countdown: boolean;
  startDate: string; // ISO or ''
  endDate: string; // ISO or ''
}

export const defaultCardSettings = (): CardSettings => ({
  discountBadge: true,
  newBadge: true,
  rating: true,
  reviewCount: true,
  quickView: true,
  wishlist: true,
  addToCart: true,
  stockStatus: true,
});

// Sensible per-section defaults so unconfigured sections keep their original behaviour.
const SECTION_PRESETS: Record<string, Partial<ProductSectionConfig>> = {
  flash_sale: { title: 'Flash Sale', subtitle: 'Limited time deals — ends soon', autoMode: 'discounted', countdown: true, count: 6 },
  top_selling: { title: 'Top Selling', subtitle: 'Most loved by our customers', autoMode: 'top_selling', count: 8 },
  new_arrivals: { title: 'New Arrivals', subtitle: 'Fresh styles, just landed', autoMode: 'newest', layout: 'slider', count: 12 },
  collection_men: { title: "Men's Collection", subtitle: 'Everyday essentials & statement pieces', autoMode: 'category', category: 'Men', count: 8 },
  collection_women: { title: "Women's Collection", subtitle: 'Curated looks for every occasion', autoMode: 'category', category: 'Women', count: 8 },
  collection_kids: { title: 'Kids Collection', subtitle: 'Comfy, playful & durable', autoMode: 'category', category: 'Kids', count: 8 },
  collection_teens: { title: 'Teens Collection', subtitle: 'Streetwear energy for the new gen', autoMode: 'category', category: 'Teens', count: 8 },
  collection_sports: { title: 'Sports Collection', subtitle: 'Gear up for game day', autoMode: 'category', category: 'Sports', count: 8 },
};

export const defaultProductSectionConfig = (sectionKey: string, title = ''): ProductSectionConfig => ({
  title: title || 'New Section',
  subtitle: '',
  viewAllText: 'View All',
  viewAllUrl: '/?category=All',
  source: 'auto',
  autoMode: 'newest',
  category: '',
  subcategory: '',
  brand: '',
  productIds: [],
  count: 8,
  layout: 'grid',
  mobileSlider: false,
  desktopGrid: true,
  mobilePerRow: 2,
  card: defaultCardSettings(),
  countdown: false,
  startDate: '',
  endDate: '',
  ...SECTION_PRESETS[sectionKey],
});

// Merge a stored (partial) config onto defaults.
export const parseProductSectionConfig = (sectionKey: string, title: string, config: any): ProductSectionConfig => {
  const base = defaultProductSectionConfig(sectionKey, title);
  if (!config || typeof config !== 'object') return base;
  return {
    ...base,
    ...config,
    card: { ...base.card, ...(config.card || {}) },
    productIds: Array.isArray(config.productIds) ? config.productIds : base.productIds,
  };
};

export interface ResolveContext {
  allProducts: Product[];
  reviewStats?: Record<string, { avg: number; count: number }>;
}

const ci = (a?: string | null, b?: string | null) =>
  (a || '').trim().toLowerCase() === (b || '').trim().toLowerCase();

// Is this section currently within its publish window? (Flash Sale scheduling.)
export const isProductSectionActive = (config: ProductSectionConfig, now = new Date()): boolean => {
  if (config.startDate && new Date(config.startDate) > now) return false;
  if (config.endDate && new Date(config.endDate) < now) return false;
  return true;
};

// Resolve the list of products to display for a section.
export const resolveSectionProducts = (config: ProductSectionConfig, ctx: ResolveContext): Product[] => {
  const { allProducts, reviewStats = {} } = ctx;
  const count = config.count || 8;

  if (config.source === 'manual') {
    const byId = new Map(allProducts.map((p) => [p.id, p]));
    return config.productIds.map((id) => byId.get(id)).filter(Boolean).slice(0, count) as Product[];
  }

  let list = [...allProducts];
  switch (config.autoMode) {
    case 'newest':
      list.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
      break;
    case 'featured':
      list = list.filter((p) => p.featured);
      break;
    case 'discounted':
    case 'flash_sale':
      list = list.filter((p) => p.original_price && p.original_price > p.price);
      break;
    case 'top_selling':
    case 'most_ordered':
    case 'most_viewed':
      list.sort((a, b) => (reviewStats[b.id]?.count || 0) - (reviewStats[a.id]?.count || 0));
      break;
    case 'category':
      list = list.filter((p) => ci(p.category, config.category));
      break;
    case 'subcategory':
      list = list.filter((p) => ci(p.subcategory, config.subcategory));
      break;
    case 'brand':
      list = list.filter((p) => ci(p.brand, config.brand));
      break;
  }
  return list.slice(0, count);
};
