GRANT SELECT ON public.custom_pages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.custom_pages TO authenticated;
GRANT ALL ON public.custom_pages TO service_role;