import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type SEOSettings = {
  // Global SEO
  site_name: string;
  site_url: string;
  default_title: string;
  title_template: string;
  default_description: string;
  keywords: string;
  canonical_base_url: string;
  default_og_image: string;
  twitter_handle: string;
  facebook_url: string;
  facebook_app_id: string;
  instagram_url: string;
  gsc_verification: string;
  // Per-type fallbacks
  fallback_home_title: string;
  fallback_home_description: string;
  fallback_products_title: string;
  fallback_products_description: string;
  fallback_collections_title: string;
  fallback_collections_description: string;
  fallback_categories_title: string;
  fallback_categories_description: string;
  fallback_blog_title: string;
  fallback_blog_description: string;
  fallback_pages_title: string;
  fallback_pages_description: string;
  // AI Search
  ai_summary: string;
  brand_description: string;
  business_type: string;
  target_audience: string;
  brand_values: string;
  founder_story: string;
  product_categories: string;
  faq_knowledge: string; // JSON: [{q,a}]
  // Structured data toggles ('true' | 'false')
  sd_organization: string;
  sd_website: string;
  sd_breadcrumb: string;
  sd_product: string;
  sd_collection: string;
  sd_blogposting: string;
  sd_faqpage: string;
  sd_store: string;
  sd_searchaction: string;
  // Robots & indexing
  robots_allow_indexing: string;
  robots_disallow_admin: string;
  robots_disallow_drafts: string;
  robots_custom_rules: string;
  ai_allow_gptbot: string;
  ai_allow_google_extended: string;
  ai_allow_ccbot: string;
  ai_allow_claudebot: string;
  ai_allow_perplexitybot: string;
  ai_allow_bingbot: string;
  [key: string]: string;
};

const DEFAULTS: SEOSettings = {
  site_name: 'EIDLIP',
  site_url: 'https://demo.eidlip.com',
  default_title: 'EIDLIP — Bangladeshi Unisex Clothing Brand',
  title_template: '%s | EIDLIP',
  default_description: 'EIDLIP (eidlip) — premium unisex clothing. Cash on delivery across Bangladesh.',
  keywords: 'EIDLIP, eidlip, bangladeshi clothing brand, unisex clothing, shirts, t-shirts, pants, bd fashion',
  canonical_base_url: 'https://demo.eidlip.com',
  default_og_image: '/logo.png',
  twitter_handle: '@eidlip',
  facebook_url: 'https://facebook.com/eidlip',
  facebook_app_id: '',
  instagram_url: '',
  gsc_verification: '',
  fallback_home_title: 'EIDLIP — Bangladeshi Unisex Clothing Brand',
  fallback_home_description: 'Shop premium unisex shirts, t-shirts, pants & everyday wear. Cash on delivery across Bangladesh.',
  fallback_products_title: 'Shop Products',
  fallback_products_description: 'Browse premium EIDLIP clothing — shirts, t-shirts, pants and everyday wear.',
  fallback_collections_title: 'Collections',
  fallback_collections_description: 'Explore curated EIDLIP collections of unisex clothing.',
  fallback_categories_title: 'Categories',
  fallback_categories_description: 'Shop EIDLIP clothing by category.',
  fallback_blog_title: 'EIDLIP Blog',
  fallback_blog_description: 'Style guides, fashion tips and updates from EIDLIP.',
  fallback_pages_title: 'EIDLIP',
  fallback_pages_description: 'EIDLIP — Bangladeshi unisex clothing brand.',
  ai_summary: 'EIDLIP is a Bangladeshi unisex clothing brand offering premium shirts, t-shirts, pants and everyday wear with cash on delivery across Bangladesh.',
  brand_description: 'EIDLIP designs affordable, premium-quality unisex clothing for everyday wear in Bangladesh.',
  business_type: 'ClothingStore',
  target_audience: 'Fashion-conscious men and women in Bangladesh aged 18-40.',
  brand_values: 'Quality, affordability, comfort, and reliable cash-on-delivery service.',
  founder_story: '',
  product_categories: 'Shirts, T-Shirts, Pants, Everyday Wear',
  faq_knowledge: '[]',
  sd_organization: 'true',
  sd_website: 'true',
  sd_breadcrumb: 'true',
  sd_product: 'true',
  sd_collection: 'true',
  sd_blogposting: 'true',
  sd_faqpage: 'true',
  sd_store: 'true',
  sd_searchaction: 'true',
  robots_allow_indexing: 'true',
  robots_disallow_admin: 'true',
  robots_disallow_drafts: 'true',
  robots_custom_rules: '',
  ai_allow_gptbot: 'true',
  ai_allow_google_extended: 'true',
  ai_allow_ccbot: 'true',
  ai_allow_claudebot: 'true',
  ai_allow_perplexitybot: 'true',
  ai_allow_bingbot: 'true',
};

export const SEO_DEFAULTS = DEFAULTS;

export const useSEOSettings = () => {
  return useQuery({
    queryKey: ['seo_settings'],
    queryFn: async (): Promise<SEOSettings> => {
      const { data } = await supabase.from('seo_settings').select('key, value');
      const map: any = { ...DEFAULTS };
      (data || []).forEach((row: any) => {
        if (row.value !== null && row.value !== undefined) map[row.key] = row.value;
      });
      return map as SEOSettings;
    },
    staleTime: 1000 * 60 * 10,
  });
};

export const useUpdateSEOSetting = () => {
  return async (key: string, value: string) => {
    const { error } = await supabase
      .from('seo_settings')
      .upsert({ key, value }, { onConflict: 'key' });
    if (error) throw error;
  };
};
