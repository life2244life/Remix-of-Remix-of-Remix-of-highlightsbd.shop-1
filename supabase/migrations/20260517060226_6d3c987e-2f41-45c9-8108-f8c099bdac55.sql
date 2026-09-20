-- 1) Replace create_order with a fully validating, server-trusted version
CREATE OR REPLACE FUNCTION public.create_order(_order jsonb)
 RETURNS orders
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  inserted public.orders;
  v_item jsonb;
  v_items_in jsonb;
  v_items_out jsonb := '[]'::jsonb;
  v_product RECORD;
  v_qty int;
  v_subtotal int := 0;
  v_line_total int;
  v_delivery_method text;
  v_delivery_charge int := 0;
  v_zone RECORD;
  v_coupon_code text;
  v_coupon RECORD;
  v_discount int := 0;
  v_is_free_shipping boolean := false;
  v_total int;
BEGIN
  -- Validate items array
  v_items_in := COALESCE(_order->'items', '[]'::jsonb);
  IF jsonb_typeof(v_items_in) <> 'array' OR jsonb_array_length(v_items_in) = 0 THEN
    RAISE EXCEPTION 'Order must contain at least one item';
  END IF;

  -- Recompute subtotal from products table (ignore client-sent prices)
  FOR v_item IN SELECT * FROM jsonb_array_elements(v_items_in)
  LOOP
    v_qty := COALESCE((v_item->>'quantity')::int, 0);
    IF v_qty <= 0 OR v_qty > 100 THEN
      RAISE EXCEPTION 'Invalid item quantity';
    END IF;

    SELECT id, name, price, is_active
      INTO v_product
      FROM public.products
     WHERE id = NULLIF(v_item->>'product_id','')::uuid;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Product not found: %', v_item->>'product_id';
    END IF;

    IF v_product.is_active = false THEN
      RAISE EXCEPTION 'Product is not available: %', v_product.name;
    END IF;

    v_line_total := v_product.price * v_qty;
    v_subtotal := v_subtotal + v_line_total;

    -- Rebuild item with server-trusted price/name; keep client-supplied size/color
    v_items_out := v_items_out || jsonb_build_array(jsonb_build_object(
      'product_id', v_product.id,
      'name',       v_product.name,
      'quantity',   v_qty,
      'price',      v_product.price,
      'size',       COALESCE(v_item->>'size',''),
      'color',      COALESCE(v_item->>'color','')
    ));
  END LOOP;

  -- Validate coupon server-side
  v_coupon_code := UPPER(TRIM(COALESCE(_order->>'coupon_code','')));
  IF v_coupon_code <> '' THEN
    SELECT * INTO v_coupon
      FROM public.coupons
     WHERE code = v_coupon_code AND is_active = true;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Invalid or inactive coupon';
    END IF;

    IF v_coupon.max_uses IS NOT NULL AND v_coupon.used_count >= v_coupon.max_uses THEN
      RAISE EXCEPTION 'Coupon usage limit reached';
    END IF;

    IF v_subtotal < COALESCE(v_coupon.min_order_amount, 0) THEN
      RAISE EXCEPTION 'Minimum order ৳% required for this coupon', v_coupon.min_order_amount;
    END IF;

    IF v_coupon.discount_type = 'percentage' THEN
      v_discount := LEAST(v_subtotal, ROUND(v_subtotal * v_coupon.discount_value / 100.0)::int);
    ELSIF v_coupon.discount_type = 'fixed' THEN
      v_discount := LEAST(v_subtotal, GREATEST(0, v_coupon.discount_value));
    ELSIF v_coupon.discount_type = 'free_shipping' THEN
      v_is_free_shipping := true;
      v_discount := 0;
    ELSE
      v_discount := 0;
    END IF;
  END IF;

  -- Validate delivery charge against zones / fallback
  v_delivery_method := COALESCE(_order->>'delivery_method', '');
  IF v_delivery_method = '' THEN
    RAISE EXCEPTION 'Delivery method is required';
  END IF;

  SELECT fee INTO v_zone
    FROM public.delivery_zones
   WHERE name = v_delivery_method AND is_active = true
   LIMIT 1;

  IF FOUND THEN
    v_delivery_charge := v_zone.fee;
  ELSE
    -- Hardcoded fallback (matches FALLBACK_DELIVERY_OPTIONS in checkout)
    v_delivery_charge := CASE v_delivery_method
      WHEN 'Inside Dhaka'        THEN 70
      WHEN 'Sub - Urban Dhaka'   THEN 90
      WHEN 'Outside Dhaka'       THEN 130
      WHEN 'standard'            THEN 70
      WHEN 'express'             THEN 130
      ELSE -1
    END;
    IF v_delivery_charge < 0 THEN
      RAISE EXCEPTION 'Unknown delivery method: %', v_delivery_method;
    END IF;
  END IF;

  IF v_is_free_shipping THEN
    v_delivery_charge := 0;
  END IF;

  -- Final total recomputed server-side
  v_total := GREATEST(0, v_subtotal + v_delivery_charge - v_discount);

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
    v_items_out,
    v_total,
    v_delivery_method,
    COALESCE(_order->>'payment_method', 'cod'),
    NULLIF(_order->>'payment_sender_number', ''),
    NULLIF(_order->>'transaction_id', ''),
    v_discount,
    v_delivery_charge,
    NULLIF(_order->>'user_id','')::uuid,
    'website',
    NULLIF(v_coupon_code, '')
  )
  RETURNING * INTO inserted;

  -- Atomically bump coupon usage
  IF v_coupon.id IS NOT NULL THEN
    UPDATE public.coupons
       SET used_count = COALESCE(used_count, 0) + 1
     WHERE id = v_coupon.id;
  END IF;

  RETURN inserted;
END;
$function$;

-- 2) Lock down direct INSERT on orders: only admins (manual Facebook/Offline orders).
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;

CREATE POLICY "Admins can insert orders"
ON public.orders
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- 3) Make sure anon & authenticated can call create_order (they already can, but be explicit)
GRANT EXECUTE ON FUNCTION public.create_order(jsonb) TO anon, authenticated;