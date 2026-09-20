ALTER TABLE public.reviews
  ADD COLUMN IF NOT EXISTS title text,
  ADD COLUMN IF NOT EXISTS verified boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS helpful_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS photo_urls text[] NOT NULL DEFAULT '{}';

CREATE OR REPLACE FUNCTION public.increment_review_helpful(_review_id uuid)
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE new_count integer;
BEGIN
  UPDATE public.reviews SET helpful_count = helpful_count + 1
  WHERE id = _review_id RETURNING helpful_count INTO new_count;
  RETURN COALESCE(new_count, 0);
END; $$;

GRANT EXECUTE ON FUNCTION public.increment_review_helpful(uuid) TO anon, authenticated;