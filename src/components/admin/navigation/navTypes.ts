export type NavStatus = 'published' | 'draft' | 'hidden';
export type MenuType = 'dropdown' | 'mega';

export interface HeaderCat {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  is_active: boolean;
  parent_id?: string | null;
  menu_type?: MenuType | null;
  mega_columns?: number | null;
  banner_desktop?: string | null;
  banner_mobile?: string | null;
  cta_text?: string | null;
  cta_link?: string | null;
  icon_url?: string | null;
  thumbnail_url?: string | null;
  show_in_header?: boolean | null;
  show_in_mobile?: boolean | null;
  show_in_footer?: boolean | null;
  badge?: string | null;
  seo_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | null;
  og_image?: string | null;
  canonical_url?: string | null;
  short_description?: string | null;
  long_description?: string | null;
  is_featured?: boolean | null;
  show_on_homepage?: boolean | null;
  status?: NavStatus | null;
}

export interface Sub {
  id: string;
  parent_category: string;
  parent_id?: string | null;
  name: string;
  slug: string;
  sort_order: number;
  is_active: boolean;
  icon_url?: string | null;
  thumbnail_url?: string | null;
  badge?: string | null;
  seo_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | null;
  og_image?: string | null;
  canonical_url?: string | null;
  short_description?: string | null;
  long_description?: string | null;
  status?: NavStatus | null;
}

export const BADGES = ['', 'NEW', 'HOT', 'SALE', 'LIMITED', 'BEST SELLER'] as const;
export const STATUSES: NavStatus[] = ['published', 'draft', 'hidden'];
export const MENU_TYPES: MenuType[] = ['dropdown', 'mega'];

export const badgeClasses: Record<string, string> = {
  NEW: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30',
  HOT: 'bg-red-500/15 text-red-600 border-red-500/30',
  SALE: 'bg-orange-500/15 text-orange-600 border-orange-500/30',
  LIMITED: 'bg-purple-500/15 text-purple-600 border-purple-500/30',
  'BEST SELLER': 'bg-amber-500/15 text-amber-600 border-amber-500/30',
};

export const statusClasses: Record<NavStatus, string> = {
  published: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30',
  draft: 'bg-muted text-muted-foreground border-border',
  hidden: 'bg-red-500/10 text-red-500 border-red-500/20',
};

export const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-');

// Status drives the legacy is_active flag for backward compatibility.
export const statusToActive = (status: NavStatus) => status === 'published';