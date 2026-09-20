// Google Consent Mode v2 abstraction.
// Pushes default + update consent states to the dataLayer via gtag().
// Defaults are denied (privacy-safe) until the user / CMP grants consent.

type ConsentValue = 'granted' | 'denied';

export type ConsentState = {
  analytics_storage: ConsentValue;
  ad_storage: ConsentValue;
  ad_user_data: ConsentValue;
  ad_personalization: ConsentValue;
  functionality_storage?: ConsentValue;
  security_storage?: ConsentValue;
};

const CONSENT_KEY = 'eidlip-consent-v2';

function gtag(...args: any[]) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  // gtag pushes the raw arguments object onto the dataLayer.
  window.dataLayer.push(arguments);
}

export function getStoredConsent(): ConsentState | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

// Region-aware defaults. `regionDefaults` may map region codes to granted.
// Call BEFORE GTM/GA loads to avoid losing pings.
export function initConsentDefaults(opts?: {
  analytics?: ConsentValue;
  ad?: ConsentValue;
  ad_user_data?: ConsentValue;
  ad_personalization?: ConsentValue;
}) {
  if (typeof window === 'undefined') return;
  const stored = getStoredConsent();
  const base: ConsentState = stored || {
    analytics_storage: opts?.analytics || 'denied',
    ad_storage: opts?.ad || 'denied',
    ad_user_data: opts?.ad_user_data || 'denied',
    ad_personalization: opts?.ad_personalization || 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted',
  };
  gtag('consent', 'default', { ...base, wait_for_update: 500 });
}

export function updateConsent(state: Partial<ConsentState>) {
  if (typeof window === 'undefined') return;
  const current = getStoredConsent() || {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  } as ConsentState;
  const next = { ...current, ...state } as ConsentState;
  try { localStorage.setItem(CONSENT_KEY, JSON.stringify(next)); } catch { /* noop */ }
  gtag('consent', 'update', next);
  return next;
}

export function grantAll() {
  return updateConsent({
    analytics_storage: 'granted',
    ad_storage: 'granted',
    ad_user_data: 'granted',
    ad_personalization: 'granted',
  });
}

export function denyAll() {
  return updateConsent({
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
}
