-- 1. Location enum
DO $$ BEGIN
  CREATE TYPE public.tracking_code_location AS ENUM ('head', 'body_top', 'body_bottom');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 2. Main table
CREATE TABLE IF NOT EXISTS public.tracking_codes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  label text NOT NULL,
  location public.tracking_code_location NOT NULL DEFAULT 'head',
  code text NOT NULL DEFAULT '',
  enabled boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.tracking_codes TO authenticated;
GRANT ALL ON public.tracking_codes TO service_role;

ALTER TABLE public.tracking_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage tracking codes"
ON public.tracking_codes FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 3. Audit history table
CREATE TABLE IF NOT EXISTS public.tracking_codes_audit (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code_id uuid,
  action text NOT NULL,
  label text,
  location public.tracking_code_location,
  changed_by uuid,
  snapshot jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.tracking_codes_audit TO authenticated;
GRANT ALL ON public.tracking_codes_audit TO service_role;

ALTER TABLE public.tracking_codes_audit ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read tracking codes audit"
ON public.tracking_codes_audit FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 4. updated_at + updated_by trigger
CREATE OR REPLACE FUNCTION public.tracking_codes_set_updated()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  NEW.updated_by = auth.uid();
  IF TG_OP = 'INSERT' AND NEW.created_by IS NULL THEN
    NEW.created_by = auth.uid();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_tracking_codes_set_updated
BEFORE INSERT OR UPDATE ON public.tracking_codes
FOR EACH ROW EXECUTE FUNCTION public.tracking_codes_set_updated();

-- 5. Audit trigger
CREATE OR REPLACE FUNCTION public.tracking_codes_audit_log()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO public.tracking_codes_audit (code_id, action, label, location, changed_by, snapshot)
    VALUES (OLD.id, 'deleted', OLD.label, OLD.location, auth.uid(), to_jsonb(OLD));
    RETURN OLD;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO public.tracking_codes_audit (code_id, action, label, location, changed_by, snapshot)
    VALUES (NEW.id, 'created', NEW.label, NEW.location, auth.uid(), to_jsonb(NEW));
    RETURN NEW;
  ELSE
    INSERT INTO public.tracking_codes_audit (code_id, action, label, location, changed_by, snapshot)
    VALUES (NEW.id, 'updated', NEW.label, NEW.location, auth.uid(), to_jsonb(NEW));
    RETURN NEW;
  END IF;
END;
$$;

CREATE TRIGGER trg_tracking_codes_audit
AFTER INSERT OR UPDATE OR DELETE ON public.tracking_codes
FOR EACH ROW EXECUTE FUNCTION public.tracking_codes_audit_log();

-- 6. Public read function (enabled snippets only)
CREATE OR REPLACE FUNCTION public.get_public_tracking_codes()
RETURNS TABLE(id uuid, label text, location public.tracking_code_location, code text, sort_order integer)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, label, location, code, sort_order
  FROM public.tracking_codes
  WHERE enabled = true
  ORDER BY location, sort_order, created_at;
$$;

GRANT EXECUTE ON FUNCTION public.get_public_tracking_codes() TO anon, authenticated;

-- 7. Migrate existing single-textarea snippets into the new table
INSERT INTO public.tracking_codes (label, location, code, enabled, sort_order)
SELECT 'Custom Head Code', 'head'::public.tracking_code_location, value, true, 0
FROM public.tracking_settings WHERE key = 'custom_head_scripts' AND COALESCE(value,'') <> ''
ON CONFLICT DO NOTHING;

INSERT INTO public.tracking_codes (label, location, code, enabled, sort_order)
SELECT 'Custom Body Code', 'body_top'::public.tracking_code_location, value, true, 0
FROM public.tracking_settings WHERE key = 'custom_body_scripts' AND COALESCE(value,'') <> ''
ON CONFLICT DO NOTHING;

INSERT INTO public.tracking_codes (label, location, code, enabled, sort_order)
SELECT 'Custom Footer Code', 'body_bottom'::public.tracking_code_location, value, true, 0
FROM public.tracking_settings WHERE key = 'custom_footer_scripts' AND COALESCE(value,'') <> ''
ON CONFLICT DO NOTHING;