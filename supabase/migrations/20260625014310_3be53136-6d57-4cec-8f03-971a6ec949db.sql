-- ============================================================
-- Navigation Manager: backward-compatible foundation
-- Adds nesting, mega-menu, banner, thumbnail, visibility,
-- badge, SEO, description, featured & status fields.
-- All additive; existing data preserved.
-- ============================================================

-- ---------- header_categories ----------
ALTER TABLE public.header_categories
  ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES public.header_categories(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS menu_type text NOT NULL DEFAULT 'dropdown',
  ADD COLUMN IF NOT EXISTS mega_columns integer NOT NULL DEFAULT 3,
  ADD COLUMN IF NOT EXISTS banner_desktop text,
  ADD COLUMN IF NOT EXISTS banner_mobile text,
  ADD COLUMN IF NOT EXISTS cta_text text,
  ADD COLUMN IF NOT EXISTS cta_link text,
  ADD COLUMN IF NOT EXISTS icon_url text,
  ADD COLUMN IF NOT EXISTS thumbnail_url text,
  ADD COLUMN IF NOT EXISTS show_in_header boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS show_in_mobile boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS show_in_footer boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS badge text,
  ADD COLUMN IF NOT EXISTS seo_title text,
  ADD COLUMN IF NOT EXISTS meta_description text,
  ADD COLUMN IF NOT EXISTS meta_keywords text,
  ADD COLUMN IF NOT EXISTS og_image text,
  ADD COLUMN IF NOT EXISTS canonical_url text,
  ADD COLUMN IF NOT EXISTS short_description text,
  ADD COLUMN IF NOT EXISTS long_description text,
  ADD COLUMN IF NOT EXISTS is_featured boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS show_on_homepage boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'published';

-- ---------- subcategories ----------
ALTER TABLE public.subcategories
  ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES public.header_categories(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS icon_url text,
  ADD COLUMN IF NOT EXISTS thumbnail_url text,
  ADD COLUMN IF NOT EXISTS badge text,
  ADD COLUMN IF NOT EXISTS seo_title text,
  ADD COLUMN IF NOT EXISTS meta_description text,
  ADD COLUMN IF NOT EXISTS meta_keywords text,
  ADD COLUMN IF NOT EXISTS og_image text,
  ADD COLUMN IF NOT EXISTS canonical_url text,
  ADD COLUMN IF NOT EXISTS short_description text,
  ADD COLUMN IF NOT EXISTS long_description text,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'published';

-- ---------- backfill status from existing is_active ----------
UPDATE public.header_categories SET status = 'hidden' WHERE is_active = false AND status = 'published';
UPDATE public.subcategories   SET status = 'hidden' WHERE is_active = false AND status = 'published';

-- ---------- backfill parent_id for subcategories from slug link ----------
UPDATE public.subcategories s
   SET parent_id = h.id
  FROM public.header_categories h
 WHERE s.parent_category = h.slug AND s.parent_id IS NULL;

-- ---------- enforce unique slugs ----------
CREATE UNIQUE INDEX IF NOT EXISTS header_categories_slug_key ON public.header_categories(slug);
CREATE UNIQUE INDEX IF NOT EXISTS subcategories_slug_key ON public.subcategories(slug);

-- ---------- helpful lookup indexes ----------
CREATE INDEX IF NOT EXISTS header_categories_parent_id_idx ON public.header_categories(parent_id);
CREATE INDEX IF NOT EXISTS subcategories_parent_id_idx ON public.subcategories(parent_id);
CREATE INDEX IF NOT EXISTS subcategories_parent_category_idx ON public.subcategories(parent_category);