CREATE UNIQUE INDEX IF NOT EXISTS payment_success_unique
ON public.payment_transactions(order_id)
WHERE status = 'success' AND is_advance = false;