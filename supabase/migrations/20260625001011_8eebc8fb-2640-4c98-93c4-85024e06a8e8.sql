UPDATE public.landing_pages
SET canonical_url = NULL
WHERE canonical_url IS NOT NULL
  AND canonical_url NOT LIKE '/lp/%';