-- ============================================================
-- SECURITY HARDENING MIGRATION
-- ============================================================

-- ------------------------------------------------------------
-- 1) Blog comments: stop exposing guest_email to the public
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view approved comments" ON public.blog_comments;

CREATE OR REPLACE VIEW public.blog_comments_public AS
  SELECT id, post_id, guest_name, content, is_approved, created_at, updated_at
  FROM public.blog_comments
  WHERE is_approved = true;

GRANT SELECT ON public.blog_comments_public TO anon, authenticated;

-- ------------------------------------------------------------
-- 2) Reviews: stop exposing the email column to the public
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON public.reviews;

-- Admins still need full read access (incl. email) on the base table
CREATE POLICY "Admins can view all reviews"
  ON public.reviews FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE VIEW public.reviews_public AS
  SELECT id, product_id, user_id, name, rating, comment, created_at,
         photo_url, title, verified, helpful_count, photo_urls
  FROM public.reviews;

GRANT SELECT ON public.reviews_public TO anon, authenticated;

-- Replace overly-permissive INSERT (WITH CHECK true) with validated insert
DROP POLICY IF EXISTS "Anyone can create reviews" ON public.reviews;
CREATE POLICY "Anyone can create reviews"
  ON public.reviews FOR INSERT TO anon, authenticated
  WITH CHECK (
    rating >= 1 AND rating <= 5
    AND char_length(btrim(name)) BETWEEN 1 AND 100
    AND char_length(btrim(comment)) BETWEEN 1 AND 5000
    AND (email IS NULL OR char_length(btrim(email)) <= 254)
    AND verified = false
  );

-- ------------------------------------------------------------
-- 3) Coupons: no full-list harvesting; validate a single code via RPC
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "Anon can validate coupon by code" ON public.coupons;
DROP POLICY IF EXISTS "Authenticated users can view active coupons" ON public.coupons;

-- Admins keep full read for management
CREATE POLICY "Admins can view all coupons"
  ON public.coupons FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.validate_coupon(_code text)
RETURNS TABLE (
  id uuid, code text, discount_type text, discount_value integer,
  min_order_amount integer, max_uses integer, used_count integer
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, code, discount_type, discount_value, min_order_amount, max_uses, used_count
  FROM public.coupons
  WHERE code = upper(btrim(_code)) AND is_active = true
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.validate_coupon(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.validate_coupon(text) TO anon, authenticated;

-- ------------------------------------------------------------
-- 4) Public-bucket listing: remove broad SELECT policies.
--    Public buckets still serve files via public object URLs.
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "Anyone can view product images" ON storage.objects;
DROP POLICY IF EXISTS "Review photos are publicly viewable" ON storage.objects;

-- ------------------------------------------------------------
-- 5) Storage uploads: tie uploads to a real order/product + image types
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.can_upload_payment_proof(_name text)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE f text;
BEGIN
  f := (storage.foldername(_name))[1];
  IF f IS NULL OR f !~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$' THEN
    RETURN false;
  END IF;
  IF lower(coalesce(storage.extension(_name),'')) NOT IN ('jpg','jpeg','png','webp','gif','pdf') THEN
    RETURN false;
  END IF;
  RETURN EXISTS (SELECT 1 FROM public.orders WHERE id = f::uuid);
END;
$$;

CREATE OR REPLACE FUNCTION public.can_upload_review_photo(_name text)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE f text;
BEGIN
  f := (storage.foldername(_name))[1];
  IF f IS NULL OR f !~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$' THEN
    RETURN false;
  END IF;
  IF lower(coalesce(storage.extension(_name),'')) NOT IN ('jpg','jpeg','png','webp','gif') THEN
    RETURN false;
  END IF;
  RETURN EXISTS (SELECT 1 FROM public.products WHERE id = f::uuid);
END;
$$;

REVOKE ALL ON FUNCTION public.can_upload_payment_proof(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.can_upload_review_photo(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.can_upload_payment_proof(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.can_upload_review_photo(text) TO anon, authenticated;

DROP POLICY IF EXISTS "Anyone can upload payment proofs" ON storage.objects;
CREATE POLICY "Customers can upload payment proofs for real orders"
  ON storage.objects FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'payment-proofs' AND public.can_upload_payment_proof(name));

DROP POLICY IF EXISTS "Anyone can upload review photos" ON storage.objects;
CREATE POLICY "Anyone can upload review photos for real products"
  ON storage.objects FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'review-photos' AND public.can_upload_review_photo(name));

-- ------------------------------------------------------------
-- 6) RLS "always true" INSERT policies -> validated / removed
-- ------------------------------------------------------------
-- Blog views are logged via SECURITY DEFINER RPC track_blog_view; the
-- direct anon INSERT policy is redundant and overly permissive.
DROP POLICY IF EXISTS "Anyone can log a blog view" ON public.blog_post_views;

-- Newsletter: validate the email instead of WITH CHECK (true)
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_subscribers;
CREATE POLICY "Anyone can subscribe to newsletter"
  ON public.newsletter_subscribers FOR INSERT TO anon, authenticated
  WITH CHECK (
    char_length(btrim(email)) BETWEEN 3 AND 254
    AND position('@' in email) > 1
  );

-- ------------------------------------------------------------
-- 7) Lock down SECURITY DEFINER functions that must never be
--    called directly by API roles (triggers + internal payment ops)
-- ------------------------------------------------------------
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.tracking_codes_audit_log() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.tracking_codes_set_updated() FROM PUBLIC, anon, authenticated;

REVOKE EXECUTE ON FUNCTION public.finalize_payment(uuid, text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.finalize_cod_payment(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.log_payment_audit(text, text, uuid, text, jsonb, jsonb, text, text) FROM PUBLIC, anon;