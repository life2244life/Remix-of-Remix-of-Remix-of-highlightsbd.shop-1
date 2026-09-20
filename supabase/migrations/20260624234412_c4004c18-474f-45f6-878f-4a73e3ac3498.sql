ALTER TABLE public.custom_pages
  ADD COLUMN IF NOT EXISTS meta_keywords text,
  ADD COLUMN IF NOT EXISTS canonical_url text;

ALTER TABLE public.landing_pages
  ADD COLUMN IF NOT EXISTS noindex boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS meta_keywords text,
  ADD COLUMN IF NOT EXISTS canonical_url text;