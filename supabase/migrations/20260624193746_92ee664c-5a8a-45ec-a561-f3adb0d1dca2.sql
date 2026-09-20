CREATE TABLE public.homepage_sections (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key text NOT NULL UNIQUE,
  title text NOT NULL,
  type text NOT NULL,
  enabled boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  config jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.homepage_sections TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.homepage_sections TO authenticated;
GRANT ALL ON public.homepage_sections TO service_role;

ALTER TABLE public.homepage_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view homepage sections"
  ON public.homepage_sections FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert homepage sections"
  ON public.homepage_sections FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update homepage sections"
  ON public.homepage_sections FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete homepage sections"
  ON public.homepage_sections FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_homepage_sections_updated_at
  BEFORE UPDATE ON public.homepage_sections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.homepage_sections (section_key, title, type, enabled, sort_order) VALUES
  ('hero',            'Hero Slider',        'hero',        true, 1),
  ('category_grid',   'Shop By Category',   'category_grid', true, 2),
  ('flash_sale',      'Flash Sale',         'flash_sale',  true, 3),
  ('top_selling',     'Top Selling',        'product_grid', true, 4),
  ('new_arrivals',    'New Arrivals',       'product_slider', true, 5),
  ('collection_men',  'Men''s Collection',  'collection',  true, 6),
  ('collection_women','Women''s Collection','collection',  true, 7),
  ('collection_kids', 'Kids Collection',    'collection',  true, 8),
  ('collection_teens','Teens Collection',   'collection',  true, 9),
  ('collection_sports','Sports Collection', 'collection',  true, 10),
  ('newsletter',      'Newsletter',         'newsletter',  true, 11),
  ('footer',          'Footer',             'footer',      true, 12);