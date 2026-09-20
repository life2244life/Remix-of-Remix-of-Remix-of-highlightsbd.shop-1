-- ============================================================
-- 1. EMAIL TEMPLATES
-- ============================================================
CREATE TABLE public.email_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_key text NOT NULL UNIQUE,
  name text NOT NULL,
  subject text NOT NULL,
  html_body text NOT NULL DEFAULT '',
  text_body text,
  category text NOT NULL DEFAULT 'transactional',
  is_active boolean NOT NULL DEFAULT true,
  variables jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.email_templates TO authenticated;
GRANT ALL ON public.email_templates TO service_role;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage email templates" ON public.email_templates
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- 2. EMAIL LOGS
-- ============================================================
CREATE TABLE public.email_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient text NOT NULL,
  template_key text,
  subject text,
  status text NOT NULL DEFAULT 'queued',
  provider text NOT NULL DEFAULT 'lovable',
  provider_message_id text,
  error_message text,
  order_id uuid,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.email_logs TO authenticated;
GRANT ALL ON public.email_logs TO service_role;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins view email logs" ON public.email_logs
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- 3. ABANDONED CARTS
-- ============================================================
CREATE TABLE public.abandoned_carts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text,
  customer_name text,
  user_id uuid,
  session_id text,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  total integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'open',
  reminders_sent integer NOT NULL DEFAULT 0,
  last_reminder_at timestamptz,
  recovered_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.abandoned_carts TO authenticated;
GRANT ALL ON public.abandoned_carts TO service_role;
ALTER TABLE public.abandoned_carts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins view abandoned carts" ON public.abandoned_carts
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- 4. UNSUBSCRIBE TOKENS
-- ============================================================
CREATE TABLE public.unsubscribe_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  token text NOT NULL UNIQUE,
  scope text NOT NULL DEFAULT 'all',
  expires_at timestamptz,
  used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.unsubscribe_tokens TO authenticated;
GRANT ALL ON public.unsubscribe_tokens TO service_role;
ALTER TABLE public.unsubscribe_tokens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins view unsubscribe tokens" ON public.unsubscribe_tokens
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- 5. NEWSLETTER DOUBLE OPT-IN FIELDS
-- ============================================================
ALTER TABLE public.newsletter_subscribers
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS confirmation_token text,
  ADD COLUMN IF NOT EXISTS confirmed_at timestamptz,
  ADD COLUMN IF NOT EXISTS unsubscribed_at timestamptz;

-- ============================================================
-- 6. updated_at triggers
-- ============================================================
CREATE TRIGGER trg_email_templates_updated BEFORE UPDATE ON public.email_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_email_logs_updated BEFORE UPDATE ON public.email_logs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_abandoned_carts_updated BEFORE UPDATE ON public.abandoned_carts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 7. indexes
-- ============================================================
CREATE INDEX idx_email_logs_created ON public.email_logs(created_at DESC);
CREATE INDEX idx_email_logs_status ON public.email_logs(status);
CREATE INDEX idx_abandoned_carts_status ON public.abandoned_carts(status);
CREATE INDEX idx_unsubscribe_tokens_token ON public.unsubscribe_tokens(token);