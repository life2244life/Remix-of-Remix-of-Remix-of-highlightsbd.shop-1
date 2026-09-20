CREATE OR REPLACE FUNCTION public.finalize_cod_payment(_order_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_txn_id uuid;
BEGIN
  SELECT id INTO v_txn_id
  FROM public.payment_transactions
  WHERE order_id = _order_id
    AND gateway = 'cod'
    AND status = 'pending'
  ORDER BY created_at
  LIMIT 1;

  IF v_txn_id IS NULL THEN
    RETURN jsonb_build_object('ok', true, 'skipped', true);
  END IF;

  RETURN public.finalize_payment(v_txn_id, NULL);
END;
$function$;

REVOKE EXECUTE ON FUNCTION public.finalize_cod_payment(uuid) FROM anon;
GRANT EXECUTE ON FUNCTION public.finalize_cod_payment(uuid) TO authenticated, service_role;