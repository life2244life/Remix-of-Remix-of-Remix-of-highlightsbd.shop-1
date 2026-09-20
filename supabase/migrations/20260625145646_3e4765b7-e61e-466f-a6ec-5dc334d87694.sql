-- Payment tables were created without Data API GRANTs.
-- RLS policies already exist; add the missing privileges so PostgREST can reach them.

GRANT SELECT, INSERT, UPDATE, DELETE ON public.payment_gateways TO authenticated;
GRANT ALL ON public.payment_gateways TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.payment_transactions TO authenticated;
GRANT ALL ON public.payment_transactions TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.payment_refunds TO authenticated;
GRANT ALL ON public.payment_refunds TO service_role;

GRANT SELECT ON public.cod_district_rules TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cod_district_rules TO authenticated;
GRANT ALL ON public.cod_district_rules TO service_role;