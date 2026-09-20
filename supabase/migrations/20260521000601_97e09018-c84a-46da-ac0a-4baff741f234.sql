-- 1. Add slug + alt_text to products
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS slug text,
  ADD COLUMN IF NOT EXISTS alt_text text;

-- Slugify function (simple)
CREATE OR REPLACE FUNCTION public.slugify(_text text)
RETURNS text
LANGUAGE sql
IMMUTABLE
SET search_path = public
AS $$
  SELECT trim(both '-' from regexp_replace(
    regexp_replace(lower(coalesce(_text,'')), '[^a-z0-9]+', '-', 'g'),
    '-+', '-', 'g'
  ));
$$;

-- Backfill slugs from name; ensure uniqueness by appending short id suffix on collision
DO $$
DECLARE
  r RECORD;
  base_slug text;
  candidate text;
  n int;
BEGIN
  FOR r IN SELECT id, name FROM public.products WHERE slug IS NULL OR slug = '' LOOP
    base_slug := public.slugify(r.name);
    IF base_slug = '' THEN base_slug := 'product'; END IF;
    candidate := base_slug;
    n := 0;
    WHILE EXISTS (SELECT 1 FROM public.products WHERE slug = candidate AND id <> r.id) LOOP
      n := n + 1;
      candidate := base_slug || '-' || substring(r.id::text, 1, 6);
      IF n > 3 THEN
        candidate := base_slug || '-' || substring(r.id::text, 1, 8) || '-' || n;
      END IF;
    END LOOP;
    UPDATE public.products SET slug = candidate WHERE id = r.id;
  END LOOP;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS products_slug_unique_idx ON public.products(slug) WHERE slug IS NOT NULL;

-- 2. Add alt_text to product_images
ALTER TABLE public.product_images
  ADD COLUMN IF NOT EXISTS alt_text text;

-- 3. Blog posts table
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  excerpt text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  cover_image text NOT NULL DEFAULT '',
  cover_alt text NOT NULL DEFAULT '',
  seo_title text NOT NULL DEFAULT '',
  seo_description text NOT NULL DEFAULT '',
  is_published boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published blog posts"
  ON public.blog_posts FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can view all blog posts"
  ON public.blog_posts FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert blog posts"
  ON public.blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update blog posts"
  ON public.blog_posts FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete blog posts"
  ON public.blog_posts FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS blog_posts_published_idx ON public.blog_posts(is_published, sort_order DESC, created_at DESC);
