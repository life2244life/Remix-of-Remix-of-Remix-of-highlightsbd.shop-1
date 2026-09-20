-- 1) Partial unique index: only one final (non-advance) successful payment per order.
--    Refunds (separate table) and advance payments are unaffected.
CREATE UNIQUE INDEX IF NOT EXISTS uniq_order_success_payment
  ON public.payment_transactions(order_id)
  WHERE status = 'success' AND is_advance = false;

-- 2) Atomic, idempotent finalize function with row-level locking.
CREATE OR REPLACE FUNCTION public.finalize_payment(_txn_id uuid, _gateway_ref text DEFAULT NULL)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_txn      public.payment_transactions;
  v_order    public.orders;
  v_existing uuid;
  v_paid     integer;
  v_status   text;
BEGIN
  -- Lock this transaction row to serialize concurrent callbacks/refreshes/tabs.
  SELECT * INTO v_txn FROM public.payment_transactions WHERE id = _txn_id FOR UPDATE;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'error', 'transaction not found');
  END IF;

  -- Already finalized -> idempotent no-op (handles duplicate IPN/webhook/double click).
  IF v_txn.status = 'success' THEN
    RETURN jsonb_build_object('ok', true, 'already', true, 'order_id', v_txn.order_id);
  END IF;

  -- Lock the order row to prevent concurrent paid_amount updates.
  IF v_txn.order_id IS NOT NULL THEN
    SELECT * INTO v_order FROM public.orders WHERE id = v_txn.order_id FOR UPDATE;
  END IF;

  -- For final (non-advance) payments, ensure no other success row already exists.
  IF v_txn.is_advance = false THEN
    SELECT id INTO v_existing
    FROM public.payment_transactions
    WHERE order_id = v_txn.order_id
      AND status = 'success'
      AND is_advance = false
      AND id <> _txn_id
    LIMIT 1;

    IF v_existing IS NOT NULL THEN
      -- Order is already paid; mark this duplicate and DO NOT increment paid_amount again.
      UPDATE public.payment_transactions
        SET status = 'cancelled',
            error_message = 'duplicate: order already paid',
            gateway_txn_id = COALESCE(_gateway_ref, gateway_txn_id)
      WHERE id = _txn_id;
      RETURN jsonb_build_object('ok', true, 'already', true, 'order_id', v_txn.order_id);
    END IF;
  END IF;

  -- Mark this transaction successful (guarded by uniq_order_success_payment index).
  UPDATE public.payment_transactions
    SET status = 'success',
        gateway_txn_id = COALESCE(_gateway_ref, gateway_txn_id)
  WHERE id = _txn_id;

  -- Increment paid_amount exactly once.
  IF v_order.id IS NOT NULL THEN
    v_paid := COALESCE(v_order.paid_amount, 0) + COALESCE(v_txn.amount, 0);
    v_status := CASE WHEN v_paid >= v_order.total THEN 'paid' ELSE 'partial' END;
    UPDATE public.orders
      SET paid_amount = v_paid,
          payment_status = v_status,
          payment_gateway = v_txn.gateway,
          gateway_txn_id = COALESCE(_gateway_ref, gateway_txn_id)
    WHERE id = v_order.id;
  END IF;

  RETURN jsonb_build_object('ok', true, 'already', false, 'order_id', v_txn.order_id,
                            'paid_amount', v_paid, 'payment_status', v_status);

EXCEPTION
  WHEN unique_violation THEN
    -- Lost the race for the success slot: treat as already paid, no double counting.
    UPDATE public.payment_transactions
      SET status = 'cancelled', error_message = 'duplicate: concurrent success'
    WHERE id = _txn_id AND status <> 'success';
    RETURN jsonb_build_object('ok', true, 'already', true, 'order_id', v_txn.order_id);
END;
$$;

GRANT EXECUTE ON FUNCTION public.finalize_payment(uuid, text) TO service_role;