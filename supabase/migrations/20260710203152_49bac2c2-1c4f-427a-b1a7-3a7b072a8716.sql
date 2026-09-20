-- Switch the public views to run with the querying user's own privileges
ALTER VIEW public.blog_comments_public SET (security_invoker = on);
ALTER VIEW public.reviews_public SET (security_invoker = on);

-- Re-add public row access on the base tables (row-level; column access is
-- restricted separately below). SELECT USING(true) is an intentional public-read pattern.
CREATE POLICY "Public can view approved comments"
  ON public.blog_comments FOR SELECT TO anon, authenticated
  USING (is_approved = true);

CREATE POLICY "Reviews are viewable by everyone"
  ON public.reviews FOR SELECT TO anon, authenticated
  USING (true);

-- Column-level masking: anonymous visitors cannot read email columns.
-- Signed-in users (incl. admins) keep full column access on the base table.
REVOKE SELECT ON public.reviews FROM anon;
GRANT SELECT (id, product_id, user_id, name, rating, comment, created_at,
              photo_url, title, verified, helpful_count, photo_urls)
  ON public.reviews TO anon;

REVOKE SELECT ON public.blog_comments FROM anon;
GRANT SELECT (id, post_id, guest_name, content, is_approved, created_at, updated_at)
  ON public.blog_comments TO anon;