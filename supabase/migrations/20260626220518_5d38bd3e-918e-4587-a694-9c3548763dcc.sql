-- ============================================================
-- Phase A: Dynamic Payments foundation
-- ============================================================

-- 1. Extend payment_gateways with dynamic, manual & business-rule fields
ALTER TABLE public.payment_gateways
  ADD COLUMN IF NOT EXISTS slug text,
  ADD COLUMN IF NOT EXISTS icon text,
  ADD COLUMN IF NOT EXISTS gateway_type text NOT NULL DEFAULT 'automated',
  ADD COLUMN IF NOT EXISTS is_builtin boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS manual_config jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS min_order_amount integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS max_order_amount integer,
  ADD COLUMN IF NOT EXISTS extra_charge integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS discount_type text,
  ADD COLUMN IF NOT EXISTS discount_value integer NOT NULL DEFAULT 0;

-- 2. Backfill slug from existing gateway key, then enforce uniqueness
UPDATE public.payment_gateways SET slug = gateway WHERE slug IS NULL;

ALTER TABLE public.payment_gateways
  ALTER COLUMN slug SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS payment_gateways_slug_key ON public.payment_gateways (slug);

-- 3. Classify & protect existing built-in gateways (no data loss)
UPDATE public.payment_gateways SET is_builtin = true
 WHERE gateway IN ('cod', 'sslcommerz', 'bkash', 'nagad');

UPDATE public.payment_gateways SET gateway_type = 'cod'       WHERE gateway = 'cod' AND gateway_type = 'automated';
UPDATE public.payment_gateways SET gateway_type = 'automated' WHERE gateway IN ('sslcommerz', 'bkash', 'nagad');

-- 4. Expand the public RPC so checkout can render manual flows & business rules
--    (credentials are still never exposed)
DROP FUNCTION IF EXISTS public.get_active_payment_methods();

CREATE OR REPLACE FUNCTION public.get_active_payment_methods()
 RETURNS TABLE(
   gateway text,
   slug text,
   display_name text,
   gateway_type text,
   icon text,
   mode text,
   instructions text,
   sort_order integer,
   manual_config jsonb,
   min_order_amount integer,
   max_order_amount integer,
   extra_charge integer,
   discount_type text,
   discount_value integer,
   config jsonb
 )
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT
    gateway, slug, display_name, gateway_type, icon, mode, instructions, sort_order,
    -- manual_config holds the customer-facing send-money details (safe to expose)
    COALESCE(manual_config, '{}'::jsonb) AS manual_config,
    min_order_amount, max_order_amount, extra_charge, discount_type, discount_value,
    -- only expose non-sensitive automated-gateway config keys
    jsonb_build_object(
      'logo_color', config->'logo_color',
      'merchant_number', config->'merchant_number'
    ) AS config
  FROM public.payment_gateways
  WHERE is_active = true
  ORDER BY sort_order;
$function$;