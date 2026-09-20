ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS product_info jsonb NOT NULL DEFAULT '{}'::jsonb;