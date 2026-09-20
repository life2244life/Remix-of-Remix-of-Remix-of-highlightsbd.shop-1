-- Payment status history: an immutable log of every payment status change per order/transaction.
CREATE TABLE public.payment_status_history (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id uuid NOT NULL,
  transaction_id uuid,
  old_status text,
  new_status text NOT NULL,
  reason text,
  changed_by uuid,
  changed_by_email text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_payment_status_history_order ON public.payment_status_history(order_id, created_at);

GRANT SELECT, INSERT ON public.payment_status_history TO authenticated;
GRANT ALL ON public.payment_status_history TO service_role;

ALTER TABLE public.payment_status_history ENABLE ROW LEVEL SECURITY;

-- Admins can read the full history.
CREATE POLICY "Admins can view payment status history"
ON public.payment_status_history FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- History is append-only for admins (writes normally happen via the security-definer function).
CREATE POLICY "Admins can insert payment status history"
ON public.payment_status_history FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Reversible, admin-only payment status change.
-- Recomputes the order's paid_amount/payment_status from scratch (never double counts),
-- and appends an immutable history row. Supports any transition, including reverting.
CREATE OR REPLACE FUNCTION public.set_payment_transaction_status(
  _txn_id uuid, _new_status text, _reason text DEFAULT NULL
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_txn    public.payment_transactions;
  v_order  public.orders;
  v_old    text;
  v_paid   integer := 0;
  v_status text;
  v_latest text;
  v_email  text;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can change payment status';
  END IF;

  IF _new_status NOT IN ('success','failed','submitted','pending','cancelled') THEN
    RAISE EXCEPTION 'Invalid payment status: %', _new_status;
  END IF;

  SELECT * INTO v_txn FROM public.payment_transactions WHERE id = _txn_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Transaction not found'; END IF;
  v_old := v_txn.status;

  SELECT email INTO v_email FROM auth.users WHERE id = auth.uid();

  UPDATE public.payment_transactions
     SET status = _new_status,
         verified_by = auth.uid(),
         verified_at = now(),
         admin_note = COALESCE(_reason, admin_note),
         error_message = CASE WHEN _new_status = 'failed'
                              THEN COALESCE(_reason, 'rejected by admin')
                              ELSE error_message END
   WHERE id = _txn_id;

  INSERT INTO public.payment_status_history (
    order_id, transaction_id, old_status, new_status, reason, changed_by, changed_by_email
  ) VALUES (
    v_txn.order_id, _txn_id, v_old, _new_status, _reason, auth.uid(), v_email
  );

  IF v_txn.order_id IS NOT NULL THEN
    SELECT * INTO v_order FROM public.orders WHERE id = v_txn.order_id FOR UPDATE;

    SELECT COALESCE(SUM(amount), 0) INTO v_paid
      FROM public.payment_transactions
     WHERE order_id = v_txn.order_id AND status = 'success';

    SELECT status INTO v_latest
      FROM public.payment_transactions
     WHERE order_id = v_txn.order_id
     ORDER BY created_at DESC LIMIT 1;

    IF v_paid >= v_order.total AND v_order.total > 0 THEN v_status := 'paid';
    ELSIF v_paid > 0 THEN v_status := 'partial';
    ELSIF v_latest = 'submitted' THEN v_status := 'submitted';
    ELSIF v_latest = 'failed' THEN v_status := 'unpaid';
    ELSIF v_latest = 'cancelled' THEN v_status := 'cancelled';
    ELSE v_status := 'pending';
    END IF;

    UPDATE public.orders
       SET paid_amount = v_paid,
           payment_status = v_status,
           payment_gateway = COALESCE(v_txn.gateway, payment_gateway)
     WHERE id = v_order.id;
  END IF;

  RETURN jsonb_build_object('ok', true, 'order_id', v_txn.order_id,
                            'old', v_old, 'new', _new_status,
                            'paid_amount', v_paid, 'payment_status', v_status);
END;
$$;