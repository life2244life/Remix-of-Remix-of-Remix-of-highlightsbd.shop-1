ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS coupon_code text;

CREATE OR REPLACE FUNCTION public.create_order(_order jsonb)
 RETURNS orders
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  inserted public.orders;
BEGIN
  INSERT INTO public.orders (
    customer_name,
    customer_phone,
    customer_address,
    customer_city,
    customer_email,
    customer_note,
    items,
    total,
    delivery_method,
    payment_method,
    payment_sender_number,
    transaction_id,
    discount,
    delivery_charge,
    user_id,
    source,
    coupon_code
  )
  VALUES (
    _order->>'customer_name',
    _order->>'customer_phone',
    _order->>'customer_address',
    _order->>'customer_city',
    NULLIF(_order->>'customer_email', ''),
    NULLIF(_order->>'customer_note', ''),
    COALESCE(_order->'items', '[]'::jsonb),
    COALESCE((_order->>'total')::int, 0),
    COALESCE(_order->>'delivery_method', 'standard'),
    COALESCE(_order->>'payment_method', 'cod'),
    NULLIF(_order->>'payment_sender_number', ''),
    NULLIF(_order->>'transaction_id', ''),
    COALESCE((_order->>'discount')::int, 0),
    COALESCE((_order->>'delivery_charge')::int, 0),
    NULLIF(_order->>'user_id','')::uuid,
    COALESCE(_order->>'source', 'website'),
    NULLIF(_order->>'coupon_code', '')
  )
  RETURNING * INTO inserted;

  RETURN inserted;
END;
$function$;