-- ============================================================
-- 1. Payment audit log table
-- ============================================================
CREATE TABLE public.payment_audit_log (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action       text NOT NULL,
  entity_type  text NOT NULL,
  entity_id    uuid,
  entity_label text,
  actor_id     uuid,
  actor_email  text,
  ip_address   text,
  user_agent   text,
  old_value    jsonb,
  new_value    jsonb,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_payment_audit_log_created_at ON public.payment_audit_log (created_at DESC);
CREATE INDEX idx_payment_audit_log_entity ON public.payment_audit_log (entity_type, entity_id);

GRANT SELECT, INSERT ON public.payment_audit_log TO authenticated;
GRANT ALL ON public.payment_audit_log TO service_role;

ALTER TABLE public.payment_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins may read the audit log.
CREATE POLICY "Admins can read payment audit log"
  ON public.payment_audit_log FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Inserts go through the security-definer function below; block direct client inserts
-- unless the caller is an admin (defense in depth).
CREATE POLICY "Admins can insert payment audit log"
  ON public.payment_audit_log FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- 2. Secure logging helper
-- ============================================================
CREATE OR REPLACE FUNCTION public.log_payment_audit(
  _action       text,
  _entity_type  text,
  _entity_id    uuid    DEFAULT NULL,
  _entity_label text    DEFAULT NULL,
  _old_value    jsonb   DEFAULT NULL,
  _new_value    jsonb   DEFAULT NULL,
  _ip_address   text    DEFAULT NULL,
  _user_agent   text    DEFAULT NULL
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_id uuid;
  v_email text;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can write to the payment audit log';
  END IF;

  SELECT email INTO v_email FROM auth.users WHERE id = auth.uid();

  INSERT INTO public.payment_audit_log (
    action, entity_type, entity_id, entity_label,
    actor_id, actor_email, ip_address, user_agent, old_value, new_value
  ) VALUES (
    _action, _entity_type, _entity_id, _entity_label,
    auth.uid(), v_email,
    LEFT(NULLIF(TRIM(COALESCE(_ip_address,'')),''), 64),
    LEFT(NULLIF(TRIM(COALESCE(_user_agent,'')),''), 512),
    _old_value, _new_value
  ) RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

-- ============================================================
-- 3. Gateway monitoring metadata columns (backward-compatible, nullable)
-- ============================================================
ALTER TABLE public.payment_gateways
  ADD COLUMN IF NOT EXISTS last_payment_at timestamptz,
  ADD COLUMN IF NOT EXISTS last_webhook_at timestamptz,
  ADD COLUMN IF NOT EXISTS last_test_at    timestamptz,
  ADD COLUMN IF NOT EXISTS last_test_ok    boolean;