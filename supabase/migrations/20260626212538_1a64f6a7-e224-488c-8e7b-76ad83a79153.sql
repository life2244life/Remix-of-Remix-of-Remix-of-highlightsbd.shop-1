CREATE TABLE public.blog_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.blog_categories TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.blog_categories TO authenticated;
GRANT ALL ON public.blog_categories TO service_role;

ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view blog categories"
  ON public.blog_categories FOR SELECT TO public USING (true);
CREATE POLICY "Admins can insert blog categories"
  ON public.blog_categories FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update blog categories"
  ON public.blog_categories FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete blog categories"
  ON public.blog_categories FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_blog_categories_updated_at
  BEFORE UPDATE ON public.blog_categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Migrate existing post categories into the relational list (no posts modified)
INSERT INTO public.blog_categories (name, slug, sort_order)
SELECT DISTINCT trim(category), public.slugify(category), 0
FROM public.blog_posts
WHERE category IS NOT NULL AND trim(category) <> ''
ON CONFLICT (slug) DO NOTHING;

-- Seed common starter categories
INSERT INTO public.blog_categories (name, slug, sort_order) VALUES
  ('Fashion','fashion',1),
  ('Lifestyle','lifestyle',2),
  ('News','news',3),
  ('Tutorial','tutorial',4),
  ('Offers','offers',5),
  ('Seasonal','seasonal',6),
  ('Brand Story','brand-story',7)
ON CONFLICT (slug) DO NOTHING;