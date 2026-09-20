-- Phase C (1/2): manual payment proof + verification backend

-- 1. Extend payment_transactions with proof + admin note columns
ALTER TABLE public.payment_transactions
  ADD COLUMN IF NOT EXISTS proof_url text,
  ADD COLUMN IF NOT EXISTS admin_note text;

-- 2. Safe RPC for customers (incl. guests) to submit a manual payment for an order.
--    Creates/refreshes a 'submitted' transaction and moves the order to payment_status='submitted'.
--    No money moves here; admin verification finalizes via finalize_payment.
CREATE OR REPLACE FUNCTION public.submit_manual_payment(
  _order_id uuid,
  _gateway text,
  _sender_number text DEFAULT NULL,
  _transaction_id text DEFAULT NULL,
  _proof_url text DEFAULT NULL,
  _is_advance boolean DEFAULT false
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_order public.orders;
  v_gw    public.payment_gateways;
  v_cfg   jsonb;
  v_amount integer;
  v_txn_id uuid;
BEGIN
  SELECT * INTO v_order FROM public.orders WHERE id = _order_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order not found';
  END IF;

  SELECT * INTO v_gw FROM public.payment_gateways
   WHERE gateway = _gateway AND is_active = true AND gateway_type = 'manual';
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Selected payment method is not available';
  END IF;

  v_cfg := COALESCE(v_gw.manual_config, '{}'::jsonb);

  IF COALESCE((v_cfg->>'require_txn_id')::boolean, false)
     AND COALESCE(NULLIF(TRIM(_transaction_id), ''), '') = '' THEN
    RAISE EXCEPTION 'Transaction ID is required for this payment method';
  END IF;

  IF COALESCE((v_cfg->>'require_screenshot')::boolean, false)
     AND COALESCE(NULLIF(TRIM(_proof_url), ''), '') = '' THEN
    RAISE EXCEPTION 'Payment screenshot is required for this payment method';
  END IF;

  v_amount := CASE WHEN _is_advance THEN GREATEST(0, v_order.total - COALESCE(v_order.paid_amount, 0))
                   ELSE GREATEST(0, v_order.total - COALESCE(v_order.paid_amount, 0)) END;
  IF v_amount = 0 THEN v_amount := v_order.total; END IF;

  INSERT INTO public.payment_transactions (
    order_id, gateway, amount, currency, status, is_advance,
    sender_number, gateway_txn_id, customer_phone, proof_url
  ) VALUES (
    _order_id, _gateway, v_amount, 'BDT', 'submitted', _is_advance,
    LEFT(NULLIF(TRIM(COALESCE(_sender_number, '')), ''), 20),
    LEFT(NULLIF(TRIM(COALESCE(_transaction_id, '')), ''), 50),
    v_order.customer_phone,
    LEFT(NULLIF(TRIM(COALESCE(_proof_url, '')), ''), 1024)
  ) RETURNING id INTO v_txn_id;

  UPDATE public.orders
     SET payment_status = 'submitted',
         payment_gateway = _gateway,
         payment_method = _gateway,
         transaction_id = COALESCE(LEFT(NULLIF(TRIM(COALESCE(_transaction_id,'')),''),50), transaction_id),
         payment_sender_number = COALESCE(LEFT(NULLIF(TRIM(COALESCE(_sender_number,'')),''),20), payment_sender_number)
   WHERE id = _order_id;

  RETURN jsonb_build_object('ok', true, 'transaction_id', v_txn_id, 'order_id', _order_id);
END;
$$;

GRANT EXECUTE ON FUNCTION public.submit_manual_payment(uuid, text, text, text, text, boolean) TO anon, authenticated, service_role;

-- 3. Storage RLS for the private payment-proofs bucket.
--    Customers (incl. guests) may upload proof; only admins/service can read.
DROP POLICY IF EXISTS "Anyone can upload payment proofs" ON storage.objects;
CREATE POLICY "Anyone can upload payment proofs"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'payment-proofs');

DROP POLICY IF EXISTS "Admins can read payment proofs" ON storage.objects;
CREATE POLICY "Admins can read payment proofs"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'payment-proofs' AND public.has_role(auth.uid(), 'admin'));