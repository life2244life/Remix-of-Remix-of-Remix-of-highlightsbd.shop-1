import {
  Image, PanelTop, Type, MousePointerClick, LayoutGrid, FolderTree,
  Grid3x3, Timer, Video, Images, HelpCircle, Mail, StretchHorizontal,
  Quote, BookOpen,
} from 'lucide-react';

export type LandingBlockType =
  | 'hero_banner' | 'image_banner' | 'rich_text' | 'button'
  | 'product_grid' | 'collection_grid' | 'category_grid'
  | 'countdown' | 'video' | 'gallery' | 'faq' | 'newsletter' | 'spacer'
  | 'testimonials' | 'brand_story';

export interface LandingBlock {
  id: string;
  type: LandingBlockType;
  enabled: boolean;
  data: Record<string, any>;
}

export interface LandingPage {
  id: string;
  title: string;
  slug: string;
  blocks: LandingBlock[];
  seo_title: string | null;
  meta_description: string | null;
  og_image: string | null;
  meta_keywords: string | null;
  canonical_url: string | null;
  noindex: boolean;
  status: 'draft' | 'published';
  publish_at: string | null;
  expire_at: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export const lpUid = () => `lp_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

export const BLOCK_META: Record<LandingBlockType, { label: string; icon: any; group: string }> = {
  hero_banner:     { label: 'Hero Banner',     icon: PanelTop,           group: 'Layout' },
  image_banner:    { label: 'Image Banner',    icon: Image,              group: 'Layout' },
  rich_text:       { label: 'Rich Text',       icon: Type,               group: 'Content' },
  button:          { label: 'Button',          icon: MousePointerClick,  group: 'Content' },
  product_grid:    { label: 'Product Grid',    icon: LayoutGrid,         group: 'Commerce' },
  collection_grid: { label: 'Collection Grid', icon: FolderTree,         group: 'Commerce' },
  category_grid:   { label: 'Category Grid',   icon: Grid3x3,            group: 'Commerce' },
  countdown:       { label: 'Countdown Timer', icon: Timer,              group: 'Marketing' },
  video:           { label: 'Video',           icon: Video,              group: 'Content' },
  gallery:         { label: 'Gallery',         icon: Images,             group: 'Content' },
  faq:             { label: 'FAQ',             icon: HelpCircle,         group: 'Content' },
  newsletter:      { label: 'Newsletter',      icon: Mail,               group: 'Marketing' },
  spacer:          { label: 'Spacer',          icon: StretchHorizontal,  group: 'Layout' },
  testimonials:    { label: 'Testimonials',    icon: Quote,              group: 'Content' },
  brand_story:     { label: 'Brand Story',     icon: BookOpen,           group: 'Content' },
};

export const BLOCK_ORDER: LandingBlockType[] = [
  'hero_banner', 'image_banner', 'rich_text', 'button',
  'product_grid', 'collection_grid', 'category_grid',
  'countdown', 'video', 'gallery', 'faq', 'testimonials', 'brand_story', 'newsletter', 'spacer',
];

const DEFAULTS: Record<LandingBlockType, Record<string, any>> = {
  hero_banner:     { image: '', mobileImage: '', headline: 'Big Sale', subheadline: 'Limited time offer', buttonLabel: 'Shop Now', buttonUrl: '/', align: 'center' },
  image_banner:    { image: '', link: '', alt: 'Banner' },
  rich_text:       { content: 'Write your content here…', align: 'left' },
  button:          { label: 'Shop Now', url: '/', align: 'center', variant: 'primary' },
  product_grid:    { title: 'Featured Products', productIds: [], columns: 4 },
  collection_grid: { title: 'Collections', collectionIds: [], columns: 3 },
  category_grid:   { title: 'Categories', items: [], columns: 4 },
  countdown:       { title: 'Hurry, ends soon!', subtitle: '', endsAt: '' },
  video:           { url: '', title: '' },
  gallery:         { images: [], columns: 3 },
  faq:             { title: 'Frequently Asked Questions', items: [{ q: 'Question?', a: 'Answer.' }] },
  newsletter:      { title: 'Join our newsletter', subtitle: 'Get the latest offers in your inbox.', buttonLabel: 'Subscribe' },
  spacer:          { height: 40 },
  testimonials:    { title: 'What Our Customers Say', items: [{ name: 'Customer Name', role: '', quote: 'Share what your customers love about you.', image: '' }] },
  brand_story:     { title: 'Our Story', text: 'Tell your brand story here…', image: '', imageSide: 'left' },
};

export const makeLandingBlock = (type: LandingBlockType): LandingBlock => ({
  id: lpUid(),
  type,
  enabled: true,
  data: structuredClone(DEFAULTS[type]),
});

export const parseBlocks = (raw: unknown): LandingBlock[] => {
  if (!Array.isArray(raw)) return [];
  return (raw as any[])
    .filter((b) => b && typeof b === 'object' && BLOCK_META[b.type as LandingBlockType])
    .map((b) => ({
      id: b.id || lpUid(),
      type: b.type,
      enabled: b.enabled !== false,
      data: b.data && typeof b.data === 'object' ? b.data : {},
    }));
};

export const slugifyLanding = (text: string) =>
  text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
