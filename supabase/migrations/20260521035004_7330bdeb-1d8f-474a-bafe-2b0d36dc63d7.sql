-- Per-product SEO override fields
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS seo_title text,
  ADD COLUMN IF NOT EXISTS seo_description text,
  ADD COLUMN IF NOT EXISTS og_image text,
  ADD COLUMN IF NOT EXISTS noindex boolean NOT NULL DEFAULT false;

-- Per-blog SEO already has seo_title/seo_description; add noindex
ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS noindex boolean NOT NULL DEFAULT false;

-- Per-custom-page SEO
ALTER TABLE public.custom_pages
  ADD COLUMN IF NOT EXISTS seo_title text,
  ADD COLUMN IF NOT EXISTS seo_description text,
  ADD COLUMN IF NOT EXISTS og_image text,
  ADD COLUMN IF NOT EXISTS noindex boolean NOT NULL DEFAULT false;

-- Global SEO settings (key-value)
CREATE TABLE IF NOT EXISTS public.seo_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.seo_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "SEO settings viewable by everyone" ON public.seo_settings;
DROP POLICY IF EXISTS "Admins manage seo_settings" ON public.seo_settings;
CREATE POLICY "SEO settings viewable by everyone" ON public.seo_settings FOR SELECT USING (true);
CREATE POLICY "Admins manage seo_settings" ON public.seo_settings FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- SEO landing pages / collections (admin-controlled, /collections/:slug)
CREATE TABLE IF NOT EXISTS public.collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  heading text NOT NULL DEFAULT '',
  subheading text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  hero_image text NOT NULL DEFAULT '',
  seo_title text NOT NULL DEFAULT '',
  seo_description text NOT NULL DEFAULT '',
  og_image text NOT NULL DEFAULT '',
  -- Filter rules (any combo applies AND)
  filter_categories text[] NOT NULL DEFAULT '{}',
  filter_subcategories text[] NOT NULL DEFAULT '{}',
  filter_product_ids uuid[] NOT NULL DEFAULT '{}',
  filter_featured boolean,
  filter_new_drop boolean,
  -- Display
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  noindex boolean NOT NULL DEFAULT false,
  show_in_nav boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Collections viewable by everyone" ON public.collections;
DROP POLICY IF EXISTS "Admins manage collections" ON public.collections;
CREATE POLICY "Collections viewable by everyone" ON public.collections FOR SELECT USING (true);
CREATE POLICY "Admins manage collections" ON public.collections FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_collections_updated_at BEFORE UPDATE ON public.collections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_seo_settings_updated_at BEFORE UPDATE ON public.seo_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed default SEO settings
INSERT INTO public.seo_settings (key, value) VALUES
  ('site_name', 'EIDLIP'),
  ('site_url', 'https://demo.eidlip.com'),
  ('default_title', 'EIDLIP — Bangladeshi Unisex Clothing Brand'),
  ('default_description', 'EIDLIP (eidlip) — premium unisex clothing, shirts, t-shirts, pants. Cash on delivery across Bangladesh.'),
  ('default_og_image', '/logo.png'),
  ('twitter_handle', '@eidlip'),
  ('facebook_url', 'https://facebook.com/eidlip'),
  ('instagram_url', ''),
  ('robots_extra', ''),
  ('gsc_verification', '')
ON CONFLICT (key) DO NOTHING;

-- Seed sample collections
INSERT INTO public.collections (slug, title, heading, subheading, description, seo_title, seo_description, filter_categories, sort_order, show_in_nav) VALUES
  ('oversized-t-shirts', 'Oversized T-Shirts', 'Oversized T-Shirts', 'Drop-shoulder essentials', 'Premium oversized t-shirts for everyday street style.', 'Oversized T-Shirts | EIDLIP', 'Shop premium oversized t-shirts in Bangladesh. Drop-shoulder fit, soft cotton, cash on delivery.', ARRAY['T-Shirt'], 1, true),
  ('hoodies', 'Hoodies', 'Hoodies', 'Warm winter layers', 'Heavyweight hoodies built for Bangladeshi winters.', 'Hoodies | EIDLIP', 'Premium hoodies and sweatshirts in Bangladesh. Heavyweight cotton, cash on delivery.', ARRAY['Winter'], 2, true),
  ('streetwear', 'Streetwear', 'Streetwear', 'Curated street essentials', 'Curated streetwear collection — oversized fits and bold graphics.', 'Streetwear | EIDLIP', 'Bangladeshi streetwear brand. Oversized tees, hoodies, pants, and accessories.', '{}', 3, true)
ON CONFLICT (slug) DO NOTHING;