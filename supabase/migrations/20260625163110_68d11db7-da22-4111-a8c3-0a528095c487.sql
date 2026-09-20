-- ============================================================
-- Phase 4: Analytics & Attribution — Database Layer
-- ============================================================

-- 1. analytics_events: client/server event store (written via edge function / service role)
CREATE TABLE public.analytics_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id text,
  event_name text NOT NULL,
  environment text NOT NULL DEFAULT 'production',
  session_id text,
  visitor_id text,
  user_id uuid,
  order_id uuid,
  value numeric,
  currency text DEFAULT 'BDT',
  params jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.analytics_events TO authenticated;
GRANT ALL ON public.analytics_events TO service_role;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read analytics_events" ON public.analytics_events
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE INDEX idx_analytics_events_name ON public.analytics_events (event_name);
CREATE INDEX idx_analytics_events_created ON public.analytics_events (created_at DESC);
CREATE INDEX idx_analytics_events_session ON public.analytics_events (session_id);

-- 2. attribution_sessions: UTM / click-id first & last touch attribution
CREATE TABLE public.attribution_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_id text NOT NULL,
  session_id text,
  first_touch jsonb NOT NULL DEFAULT '{}'::jsonb,
  last_touch jsonb NOT NULL DEFAULT '{}'::jsonb,
  landing_page text,
  referrer text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (visitor_id)
);
GRANT SELECT ON public.attribution_sessions TO authenticated;
GRANT ALL ON public.attribution_sessions TO service_role;
ALTER TABLE public.attribution_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read attribution_sessions" ON public.attribution_sessions
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE INDEX idx_attribution_visitor ON public.attribution_sessions (visitor_id);

-- 3. conversion_events: server-side dispatch log with idempotency + retry state
CREATE TABLE public.conversion_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id text NOT NULL,
  event_name text NOT NULL,
  provider text NOT NULL, -- ga4 | meta | tiktok
  environment text NOT NULL DEFAULT 'production',
  order_id uuid,
  value numeric,
  currency text DEFAULT 'BDT',
  status text NOT NULL DEFAULT 'queued', -- queued | sent | failed | dead
  attempts int NOT NULL DEFAULT 0,
  last_error text,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  sent_at timestamptz,
  UNIQUE (event_id, provider)
);
GRANT SELECT ON public.conversion_events TO authenticated;
GRANT ALL ON public.conversion_events TO service_role;
ALTER TABLE public.conversion_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read conversion_events" ON public.conversion_events
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE INDEX idx_conversion_status ON public.conversion_events (status);
CREATE INDEX idx_conversion_created ON public.conversion_events (created_at DESC);

CREATE TRIGGER update_attribution_sessions_updated_at
  BEFORE UPDATE ON public.attribution_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_conversion_events_updated_at
  BEFORE UPDATE ON public.conversion_events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4. Secure tracking_settings: stop exposing secret tokens to anon/public.
--    Replace the "read everything" policy with a whitelist RPC for public keys.
DROP POLICY IF EXISTS "Public can read tracking_settings" ON public.tracking_settings;
REVOKE SELECT ON public.tracking_settings FROM anon;

CREATE POLICY "Admins can read tracking_settings" ON public.tracking_settings
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Whitelisted, non-secret public tracking config for the storefront (no access tokens).
CREATE OR REPLACE FUNCTION public.get_public_tracking_settings()
RETURNS TABLE(key text, value text)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT key, value FROM public.tracking_settings
  WHERE key IN (
    'gtm_container_id',
    'gtm_enabled',
    'ga4_measurement_id',
    'meta_pixel_id',
    'tiktok_pixel_id',
    'environment',
    'consent_default_analytics',
    'consent_default_ad',
    'consent_default_ad_user_data',
    'consent_default_ad_personalization',
    'consent_region_defaults',
    'server_side_meta_enabled',
    'server_side_tiktok_enabled',
    'server_side_ga4_enabled'
  );
$$;
GRANT EXECUTE ON FUNCTION public.get_public_tracking_settings() TO anon, authenticated;