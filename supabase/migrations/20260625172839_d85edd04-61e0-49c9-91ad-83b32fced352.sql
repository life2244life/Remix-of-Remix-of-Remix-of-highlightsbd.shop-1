CREATE OR REPLACE FUNCTION public.get_public_tracking_settings()
 RETURNS TABLE(key text, value text)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
    'server_side_ga4_enabled',
    -- Site verification meta tags (non-sensitive)
    'fb_domain_verification',
    'google_site_verification',
    'bing_verification',
    'pinterest_verification',
    'yandex_verification',
    -- Custom code injection (admin-managed)
    'custom_head_scripts',
    'custom_head_enabled',
    'custom_body_scripts',
    'custom_body_enabled',
    'custom_footer_scripts',
    'custom_footer_enabled'
  );
$function$;