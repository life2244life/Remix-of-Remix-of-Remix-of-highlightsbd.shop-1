import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useStoreSettings } from '@/hooks/useSupabase';
import { applyTemplateTokens, resetTemplateTokens, DEFAULT_TEMPLATE_KEY } from '@/lib/templates';
import { resolveTemplateKey } from '@/lib/activeTemplate';

// Applies the active customer-facing template (CSS variable preset) selected in the admin panel.
// The admin panel itself always keeps the default look so it stays readable.
const ThemeApplier = () => {
  const { data: settings } = useStoreSettings();
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');
  const activeTemplate = resolveTemplateKey(settings) || DEFAULT_TEMPLATE_KEY;

  useEffect(() => {
    if (isAdmin) {
      resetTemplateTokens();
    } else {
      applyTemplateTokens(activeTemplate);
    }
  }, [activeTemplate, isAdmin]);

  return null;
};

export default ThemeApplier;
