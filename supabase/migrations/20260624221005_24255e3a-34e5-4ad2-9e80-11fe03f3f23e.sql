CREATE TABLE public.landing_pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  blocks JSONB NOT NULL DEFAULT '[]'::jsonb,
  seo_title TEXT,
  meta_description TEXT,
  og_image TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  publish_at TIMESTAMP WITH TIME ZONE,
  expire_at TIMESTAMP WITH TIME ZONE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT ON public.landing_pages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.landing_pages TO authenticated;
GRANT ALL ON public.landing_pages TO service_role;

ALTER TABLE public.landing_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published landing pages viewable by everyone"
  ON public.landing_pages FOR SELECT
  USING (status = 'published');

CREATE POLICY "Admins can view all landing pages"
  ON public.landing_pages FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert landing pages"
  ON public.landing_pages FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update landing pages"
  ON public.landing_pages FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete landing pages"
  ON public.landing_pages FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_landing_pages_updated_at
  BEFORE UPDATE ON public.landing_pages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();