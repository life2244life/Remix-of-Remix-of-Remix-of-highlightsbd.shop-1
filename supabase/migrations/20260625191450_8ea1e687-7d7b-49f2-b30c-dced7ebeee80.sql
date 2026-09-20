-- Search performance: trigram indexes for case-insensitive substring (ILIKE) search
-- on the columns the storefront search queries. Supports name/brand/category/subcategory.
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS idx_products_name_trgm
  ON public.products USING gin (name gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_products_brand_trgm
  ON public.products USING gin (brand gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_products_category_trgm
  ON public.products USING gin (category gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_products_subcategory_trgm
  ON public.products USING gin (subcategory gin_trgm_ops);