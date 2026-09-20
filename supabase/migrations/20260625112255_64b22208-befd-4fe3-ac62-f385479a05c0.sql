-- Blog workflow + analytics columns
ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'published',
  ADD COLUMN IF NOT EXISTS scheduled_at timestamptz,
  ADD COLUMN IF NOT EXISTS is_featured boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS views integer NOT NULL DEFAULT 0;

-- Backfill status from the existing is_published flag
UPDATE public.blog_posts SET status = CASE WHEN is_published THEN 'published' ELSE 'draft' END;

-- Newsletter source for conversion analytics
ALTER TABLE public.newsletter_subscribers
  ADD COLUMN IF NOT EXISTS source text DEFAULT 'general';

-- Per-visitor view log for unique-reader analytics
CREATE TABLE IF NOT EXISTS public.blog_post_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  visitor_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (post_id, visitor_id)
);

GRANT SELECT, INSERT ON public.blog_post_views TO anon, authenticated;
GRANT ALL ON public.blog_post_views TO service_role;

ALTER TABLE public.blog_post_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can log a blog view"
  ON public.blog_post_views FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Admins can read blog views"
  ON public.blog_post_views FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Atomic view tracker: bumps the total counter and records a unique visitor
CREATE OR REPLACE FUNCTION public.track_blog_view(_post_id uuid, _visitor_id text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.blog_posts SET views = COALESCE(views, 0) + 1 WHERE id = _post_id;
  INSERT INTO public.blog_post_views (post_id, visitor_id)
  VALUES (_post_id, _visitor_id)
  ON CONFLICT (post_id, visitor_id) DO NOTHING;
END;
$$;