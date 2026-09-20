import { DEFAULT_TEMPLATE_KEY, getTemplate, type Template } from '@/lib/templates';

// Map legacy "active_theme" preset keys to the new template keys so any value
// already saved in store_settings keeps working.
const LEGACY_THEME_MAP: Record<string, string> = {
  luxury: 'classic',
  modern: 'modern',
  'noir-gold': 'noir',
  'warm-sand': 'boutique',
};

/** Resolve the active template key from store_settings (new key first, legacy fallback). */
export const resolveTemplateKey = (settings?: Record<string, string> | null): string => {
  const direct = settings?.active_template;
  if (direct) return direct;
  const legacy = settings?.active_theme;
  if (legacy) return LEGACY_THEME_MAP[legacy] || legacy;
  return DEFAULT_TEMPLATE_KEY;
};

/** Resolve the full active template object from store_settings. */
export const resolveTemplate = (settings?: Record<string, string> | null): Template =>
  getTemplate(resolveTemplateKey(settings));