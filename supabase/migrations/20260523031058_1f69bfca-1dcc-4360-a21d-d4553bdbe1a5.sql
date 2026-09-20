
ALTER TABLE public.reviews
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS photo_url text;

INSERT INTO storage.buckets (id, name, public)
VALUES ('review-photos', 'review-photos', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Review photos are publicly viewable" ON storage.objects;
CREATE POLICY "Review photos are publicly viewable"
ON storage.objects FOR SELECT
USING (bucket_id = 'review-photos');

DROP POLICY IF EXISTS "Anyone can upload review photos" ON storage.objects;
CREATE POLICY "Anyone can upload review photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'review-photos');
