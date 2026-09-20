// UTM / click-id attribution system.
// First-touch persists for the lifetime of the visitor (localStorage).
// Last-touch refreshes on each campaign-tagged visit (localStorage, overwritten).
// Both are attachable to orders for revenue attribution.

const FIRST_TOUCH_KEY = 'eidlip-attr-first';
const LAST_TOUCH_KEY = 'eidlip-attr-last';
const VISITOR_KEY = 'eidlip-visitor-id';
const SESSION_KEY = 'eidlip-session-id';

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const;
const CLICK_KEYS = ['gclid', 'fbclid', 'ttclid'] as const;

export type Attribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  fbclid?: string;
  ttclid?: string;
  referrer?: string;
  landing_page?: string;
  timestamp?: number;
};

function uuid(): string {
  try {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  } catch { /* noop */ }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

function read(key: string): Attribution | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function write(key: string, val: Attribution) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* noop */ }
}

export function getVisitorId(): string {
  if (typeof window === 'undefined') return '';
  let id = '';
  try { id = localStorage.getItem(VISITOR_KEY) || ''; } catch { /* noop */ }
  if (!id) { id = uuid(); try { localStorage.setItem(VISITOR_KEY, id); } catch { /* noop */ } }
  return id;
}

export function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  let id = '';
  try { id = sessionStorage.getItem(SESSION_KEY) || ''; } catch { /* noop */ }
  if (!id) { id = uuid(); try { sessionStorage.setItem(SESSION_KEY, id); } catch { /* noop */ } }
  return id;
}

function parseCurrent(): Attribution {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const attr: Attribution = {};
  UTM_KEYS.forEach(k => { const v = params.get(k); if (v) (attr as any)[k] = v; });
  CLICK_KEYS.forEach(k => { const v = params.get(k); if (v) (attr as any)[k] = v; });
  attr.referrer = document.referrer || undefined;
  attr.landing_page = window.location.pathname + window.location.search;
  attr.timestamp = Date.now();
  return attr;
}

function hasCampaign(attr: Attribution): boolean {
  return Boolean(
    attr.utm_source || attr.utm_medium || attr.utm_campaign ||
    attr.gclid || attr.fbclid || attr.ttclid,
  );
}

// Call once on app boot (and on route changes is fine — it only writes when relevant).
export function captureAttribution(): void {
  if (typeof window === 'undefined') return;
  getVisitorId();
  getSessionId();
  const current = parseCurrent();

  // First touch: only set once, ever.
  if (!read(FIRST_TOUCH_KEY)) {
    write(FIRST_TOUCH_KEY, current);
  }
  // Last touch: refresh only when this visit carries campaign data.
  if (hasCampaign(current)) {
    write(LAST_TOUCH_KEY, current);
  }
}

export function getFirstTouch(): Attribution { return read(FIRST_TOUCH_KEY) || {}; }
export function getLastTouch(): Attribution { return read(LAST_TOUCH_KEY) || read(FIRST_TOUCH_KEY) || {}; }

// Flat snapshot for attaching to an order / event.
export function getAttributionSnapshot() {
  const first = getFirstTouch();
  const last = getLastTouch();
  return {
    visitor_id: getVisitorId(),
    session_id: getSessionId(),
    first_touch: first,
    last_touch: last,
    landing_page: first.landing_page || last.landing_page || null,
    referrer: first.referrer || last.referrer || null,
  };
}

// Flat attribution payload for persisting onto an order (last-touch wins,
// first-touch as fallback). The server (create_order RPC) trims and caps these
// values before writing — the browser never inserts into orders directly.
export function getOrderAttribution() {
  const first = getFirstTouch();
  const last = getLastTouch();
  const pick = (k: keyof Attribution) =>
    ((last as any)[k] || (first as any)[k] || null) as string | null;
  return {
    utm_source: pick('utm_source'),
    utm_medium: pick('utm_medium'),
    utm_campaign: pick('utm_campaign'),
    utm_term: pick('utm_term'),
    utm_content: pick('utm_content'),
    gclid: pick('gclid'),
    fbclid: pick('fbclid'),
    ttclid: pick('ttclid'),
    landing_page: first.landing_page || last.landing_page || null,
    referrer_url: first.referrer || last.referrer || null,
  };
}
