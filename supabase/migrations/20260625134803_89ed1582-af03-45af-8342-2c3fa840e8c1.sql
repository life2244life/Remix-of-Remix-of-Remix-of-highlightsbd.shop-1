-- =========================================================
-- PHASE 2: PAYMENT INFRASTRUCTURE (additive, backward-compatible)
-- =========================================================

-- 1) Payment gateways (gateway credentials + mode + config)
CREATE TABLE public.payment_gateways (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gateway text NOT NULL UNIQUE,           -- 'cod' | 'sslcommerz' | 'bkash' | 'nagad'
  display_name text NOT NULL,
  is_active boolean NOT NULL DEFAULT false,
  mode text NOT NULL DEFAULT 'sandbox',   -- 'sandbox' | 'live'
  credentials jsonb NOT NULL DEFAULT '{}'::jsonb, -- { sandbox:{...}, live:{...} } (server-only)
  config jsonb NOT NULL DEFAULT '{}'::jsonb,
  instructions text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payment_gateways TO authenticated;
GRANT ALL ON public.payment_gateways TO service_role;
ALTER TABLE public.payment_gateways ENABLE ROW LEVEL SECURITY;
-- Only admins may read/manage gateways directly (credentials are sensitive)
CREATE POLICY "Admins manage payment gateways"
  ON public.payment_gateways FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_payment_gateways_updated
  BEFORE UPDATE ON public.payment_gateways
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Public-safe view of active payment methods (NO credentials exposed)
CREATE OR REPLACE FUNCTION public.get_active_payment_methods()
RETURNS TABLE(gateway text, display_name text, mode text, instructions text, sort_order integer, config jsonb)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT gateway, display_name, mode, instructions, sort_order,
         -- only expose non-sensitive config keys
         jsonb_build_object(
           'logo_color', config->'logo_color',
           'merchant_number', config->'merchant_number'
         ) AS config
  FROM public.payment_gateways
  WHERE is_active = true
  ORDER BY sort_order;
$$;
GRANT EXECUTE ON FUNCTION public.get_active_payment_methods() TO anon, authenticated;

-- 2) Payment transactions (immutable log of every payment attempt)
CREATE TABLE public.payment_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  gateway text NOT NULL,
  amount integer NOT NULL,
  currency text NOT NULL DEFAULT 'BDT',
  status text NOT NULL DEFAULT 'pending', -- pending|success|failed|cancelled|refunded|partial
  is_advance boolean NOT NULL DEFAULT false,
  gateway_txn_id text,
  val_id text,
  sender_number text,
  customer_phone text,
  error_message text,
  raw_response jsonb NOT NULL DEFAULT '{}'::jsonb,
  verified_by uuid,
  verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payment_transactions TO authenticated;
GRANT ALL ON public.payment_transactions TO service_role;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage payment transactions"
  ON public.payment_transactions FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE INDEX idx_payment_transactions_order ON public.payment_transactions(order_id);
CREATE INDEX idx_payment_transactions_status ON public.payment_transactions(status);
CREATE INDEX idx_payment_transactions_created ON public.payment_transactions(created_at DESC);
CREATE TRIGGER trg_payment_transactions_updated
  BEFORE UPDATE ON public.payment_transactions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3) Refunds workflow
CREATE TABLE public.payment_refunds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  transaction_id uuid REFERENCES public.payment_transactions(id) ON DELETE SET NULL,
  gateway text NOT NULL,
  amount integer NOT NULL,
  reason text,
  status text NOT NULL DEFAULT 'requested', -- requested|approved|processing|completed|rejected
  gateway_refund_id text,
  notes text,
  processed_by uuid,
  processed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payment_refunds TO authenticated;
GRANT ALL ON public.payment_refunds TO service_role;
ALTER TABLE public.payment_refunds ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage refunds"
  ON public.payment_refunds FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE INDEX idx_payment_refunds_order ON public.payment_refunds(order_id);
CREATE TRIGGER trg_payment_refunds_updated
  BEFORE UPDATE ON public.payment_refunds
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4) District-based COD rules
CREATE TABLE public.cod_district_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  district text NOT NULL UNIQUE,
  cod_allowed boolean NOT NULL DEFAULT true,
  advance_required boolean NOT NULL DEFAULT false,
  advance_amount integer NOT NULL DEFAULT 0,  -- flat advance (taka) when required
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cod_district_rules TO authenticated;
GRANT ALL ON public.cod_district_rules TO service_role;
GRANT SELECT ON public.cod_district_rules TO anon; -- non-sensitive; checkout needs to validate COD
ALTER TABLE public.cod_district_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view cod rules"
  ON public.cod_district_rules FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage cod rules"
  ON public.cod_district_rules FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_cod_district_rules_updated
  BEFORE UPDATE ON public.cod_district_rules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5) Orders: payment lifecycle columns (additive, defaults keep old flow working)
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'unpaid', -- unpaid|partial|paid|refunded|failed
  ADD COLUMN IF NOT EXISTS paid_amount integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS payment_gateway text,
  ADD COLUMN IF NOT EXISTS gateway_txn_id text;