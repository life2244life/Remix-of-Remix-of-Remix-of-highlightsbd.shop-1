// Shared model for Phase 5: Homepage Banners, Posters & Custom Content Blocks.
// Each block is a `homepage_sections` row. `type` selects the renderer; all
// editable content lives in the section `config` JSONB.

export const uid = (prefix = 'b'): string =>
  (typeof crypto !== 'undefined' && 'randomUUID' in crypto)
    ? crypto.randomUUID()
    : `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;

export type Align = 'left' | 'center' | 'right';

/* ---------------- Scheduling ---------------- */
export interface Schedule { publishAt?: string; expireAt?: string }
export const isScheduleActive = (s: Schedule | undefined, now = new Date()): boolean => {
  if (!s) return true;
  if (s.publishAt && new Date(s.publishAt) > now) return false;
  if (s.expireAt && new Date(s.expireAt) < now) return false;
  return true;
};

/* ---------------- Banners ---------------- */
export type BannerLayout =
  | 'full_width' | 'half_width' | 'two_column' | 'three_column' | 'promotional' | 'collection';

export const BANNER_LAYOUTS: { value: BannerLayout; label: string; cols: number; ratio: number; rec: string }[] = [
  { value: 'full_width', label: 'Full Width Banner', cols: 1, ratio: 16 / 6, rec: '1920×700px (16:6)' },
  { value: 'half_width', label: 'Half Width Banner', cols: 1, ratio: 16 / 7, rec: '1200×525px (16:7)' },
  { value: 'two_column', label: 'Two Column Banner', cols: 2, ratio: 4 / 3, rec: '800×600px (4:3)' },
  { value: 'three_column', label: 'Three Column Banner', cols: 3, ratio: 1, rec: '600×600px (1:1)' },
  { value: 'promotional', label: 'Promotional Banner', cols: 2, ratio: 16 / 9, rec: '900×500px (16:9)' },
  { value: 'collection', label: 'Collection Banner', cols: 1, ratio: 16 / 5, rec: '1600×500px (16:5)' },
];

export const bannerLayoutMeta = (l: BannerLayout) =>
  BANNER_LAYOUTS.find((b) => b.value === l) || BANNER_LAYOUTS[0];

export interface BannerItem {
  id: string;
  desktopImage: string;
  mobileImage: string;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
  align: Align;
  overlay: number; // 0-100
  textColor: string;
}

export const makeBannerItem = (): BannerItem => ({
  id: uid('banner'),
  desktopImage: '', mobileImage: '', title: '', subtitle: '', description: '',
  buttonText: '', buttonUrl: '', align: 'left', overlay: 35, textColor: '#ffffff',
});

export interface BannerConfig extends Schedule {
  layout: BannerLayout;
  items: BannerItem[];
}

export const defaultBannerConfig = (layout: BannerLayout = 'full_width'): BannerConfig => {
  const cols = bannerLayoutMeta(layout).cols;
  return { layout, items: Array.from({ length: cols }, makeBannerItem) };
};

export const parseBannerConfig = (config: any): BannerConfig => {
  const layout: BannerLayout = config?.layout || 'full_width';
  const items = Array.isArray(config?.items) && config.items.length
    ? config.items.map((it: any) => ({ ...makeBannerItem(), ...it }))
    : defaultBannerConfig(layout).items;
  return { layout, items, publishAt: config?.publishAt || '', expireAt: config?.expireAt || '' };
};

/* ---------------- Posters ---------------- */
export interface PosterItem {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonUrl: string;
  badge: string;
  countdownTo: string; // ISO date or ''
}

export const makePosterItem = (): PosterItem => ({
  id: uid('poster'), image: '', title: '', subtitle: '', buttonText: '', buttonUrl: '', badge: '', countdownTo: '',
});

export interface PosterConfig extends Schedule {
  columns: number; // 2-4
  items: PosterItem[];
}

export const defaultPosterConfig = (): PosterConfig => ({ columns: 3, items: [makePosterItem(), makePosterItem(), makePosterItem()] });

export const parsePosterConfig = (config: any): PosterConfig => ({
  columns: Math.min(4, Math.max(2, Number(config?.columns) || 3)),
  items: Array.isArray(config?.items) && config.items.length
    ? config.items.map((it: any) => ({ ...makePosterItem(), ...it }))
    : defaultPosterConfig().items,
  publishAt: config?.publishAt || '', expireAt: config?.expireAt || '',
});

/* ---------------- Custom content blocks ---------------- */
export type CustomBlockType =
  | 'image_text' | 'text_only' | 'video' | 'benefits' | 'trust_icons'
  | 'button' | 'faq' | 'testimonials' | 'brand_story' | 'featured_brands' | 'custom';

export const CUSTOM_BLOCK_TYPES: { value: CustomBlockType; label: string }[] = [
  { value: 'image_text', label: 'Image + Text' },
  { value: 'text_only', label: 'Text Only' },
  { value: 'video', label: 'Video Section' },
  { value: 'benefits', label: 'Benefits Section' },
  { value: 'trust_icons', label: 'Trust Icon Section' },
  { value: 'button', label: 'Button Section' },
  { value: 'faq', label: 'FAQ Preview' },
  { value: 'testimonials', label: 'Testimonials' },
  { value: 'brand_story', label: 'Brand Story' },
  { value: 'featured_brands', label: 'Featured Brands' },
  { value: 'custom', label: 'Custom Marketing Block' },
];

// Generic repeatable item used by benefits / trust / faq / testimonials / brands.
export interface CustomItem {
  id: string;
  icon: string;   // lucide-ish key for benefits/trust
  title: string;  // benefit title / faq question / testimonial author / brand name
  text: string;   // description / faq answer / testimonial body
  image: string;  // brand logo / testimonial avatar
  url: string;
}

export const makeCustomItem = (): CustomItem => ({ id: uid('item'), icon: 'check', title: '', text: '', image: '', url: '' });

export interface CustomConfig extends Schedule {
  blockType: CustomBlockType;
  heading: string;
  subheading: string;
  body: string;
  image: string;     // image_text / brand_story
  mediaUrl: string;  // video embed url
  align: Align;
  bgTint: boolean;
  buttonText: string;
  buttonUrl: string;
  items: CustomItem[];
}

export const defaultCustomConfig = (blockType: CustomBlockType = 'image_text'): CustomConfig => ({
  blockType, heading: '', subheading: '', body: '', image: '', mediaUrl: '',
  align: 'left', bgTint: false, buttonText: '', buttonUrl: '',
  items: ['benefits', 'trust_icons', 'faq', 'testimonials', 'featured_brands'].includes(blockType)
    ? [makeCustomItem(), makeCustomItem(), makeCustomItem()]
    : [],
});

export const parseCustomConfig = (config: any): CustomConfig => ({
  ...defaultCustomConfig(config?.blockType || 'image_text'),
  ...config,
  items: Array.isArray(config?.items) ? config.items.map((it: any) => ({ ...makeCustomItem(), ...it })) : [],
  publishAt: config?.publishAt || '', expireAt: config?.expireAt || '',
});

export const TRUST_ICON_OPTIONS = ['truck', 'wallet', 'return', 'shield', 'check', 'star', 'heart', 'gift', 'clock', 'phone', 'tag', 'award'] as const;

/* ---------------- Section type registry ---------------- */
export const BLOCK_SECTION_TYPES = new Set(['banner', 'poster', 'custom_block']);
export const BLOCK_TYPE_LABEL: Record<string, string> = {
  banner: 'Banner',
  poster: 'Poster',
  custom_block: 'Custom Block',
};

export const alignItemsClass = (a: Align): string =>
  a === 'center' ? 'items-center text-center' : a === 'right' ? 'items-end text-right' : 'items-start text-left';