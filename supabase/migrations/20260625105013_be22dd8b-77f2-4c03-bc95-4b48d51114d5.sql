-- Author profile fields on blog posts
ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS author_bio text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS author_avatar text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS author_social jsonb NOT NULL DEFAULT '{}'::jsonb;

-- Blog comments with admin moderation
CREATE TABLE IF NOT EXISTS public.blog_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  guest_name text NOT NULL,
  guest_email text NOT NULL,
  content text NOT NULL,
  is_approved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.blog_comments TO anon;
GRANT SELECT, INSERT ON public.blog_comments TO authenticated;
GRANT ALL ON public.blog_comments TO service_role;

ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view approved comments" ON public.blog_comments
  FOR SELECT USING (is_approved = true);

CREATE POLICY "Anyone can submit a comment" ON public.blog_comments
  FOR INSERT WITH CHECK (
    char_length(trim(guest_name)) BETWEEN 1 AND 80
    AND char_length(trim(guest_email)) BETWEEN 3 AND 160
    AND char_length(trim(content)) BETWEEN 1 AND 2000
    AND is_approved = false
  );

CREATE POLICY "Admins can view all comments" ON public.blog_comments
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update comments" ON public.blog_comments
  FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete comments" ON public.blog_comments
  FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_blog_comments_updated_at BEFORE UPDATE ON public.blog_comments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS blog_comments_post_idx ON public.blog_comments(post_id, is_approved, created_at DESC);