-- Custom Pages: structured block content for the new JSON Block Builder
ALTER TABLE public.custom_pages
  ADD COLUMN IF NOT EXISTS blocks jsonb NOT NULL DEFAULT '[]'::jsonb;

-- Landing Pages: discriminator so Campaign Pages reuse the same table/builder
ALTER TABLE public.landing_pages
  ADD COLUMN IF NOT EXISTS page_type text NOT NULL DEFAULT 'landing';