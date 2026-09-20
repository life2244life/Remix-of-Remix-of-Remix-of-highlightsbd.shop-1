// Centralised helpers + defaults for all editable Header / Footer / Store settings.
// Everything is stored in the `store_settings` key-value table (value is text/JSON).

export type Settings = Record<string, string>;

/** Boolean stored as '1' | '0'. Defaults to true unless explicitly '0'. */
export const flag = (s: Settings | undefined, key: string, def = true): boolean => {
  const v = s?.[key];
  if (v === undefined || v === '') return def;
  return v === '1' || v === 'true';
};

export const text = (s: Settings | undefined, key: string, def = ''): string => {
  const v = s?.[key];
  return v === undefined || v === '' ? def : v;
};

export function parseList<T>(s: Settings | undefined, key: string, def: T[]): T[] {
  const raw = s?.[key];
  if (!raw) return def;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : def;
  } catch {
    return def;
  }
}

/* ---------------- Social links ---------------- */
export interface SocialDef { key: string; label: string; settingKey: string; }
export const SOCIAL_PLATFORMS: SocialDef[] = [
  { key: 'facebook', label: 'Facebook', settingKey: 'social_facebook' },
  { key: 'instagram', label: 'Instagram', settingKey: 'social_instagram' },
  { key: 'youtube', label: 'YouTube', settingKey: 'social_youtube' },
  { key: 'tiktok', label: 'TikTok', settingKey: 'social_tiktok' },
  { key: 'linkedin', label: 'LinkedIn', settingKey: 'social_linkedin' },
  { key: 'pinterest', label: 'Pinterest', settingKey: 'social_pinterest' },
  { key: 'twitter', label: 'X (Twitter)', settingKey: 'social_twitter' },
  { key: 'whatsapp', label: 'WhatsApp', settingKey: 'social_whatsapp' },
  { key: 'telegram', label: 'Telegram', settingKey: 'social_telegram' },
  { key: 'messenger', label: 'Messenger', settingKey: 'social_messenger' },
];

/* ---------------- Footer menus ---------------- */
export interface FooterLink { label: string; url: string; }
export interface FooterMenu { title: string; links: FooterLink[]; }
export const DEFAULT_FOOTER_MENUS: FooterMenu[] = [
  {
    title: 'Information',
    links: [
      { label: 'Home', url: '/' },
      { label: 'About Us', url: '/about' },
      { label: 'Contact', url: '/contact' },
      { label: 'Shop', url: '/shop' },
      { label: 'Blog', url: '/blog' },
    ],
  },
  {
    title: 'Policies',
    links: [
      { label: 'Privacy Policy', url: '/privacy-policy' },
      { label: 'Terms & Conditions', url: '/terms' },
      { label: 'Refund Policy', url: '/refund-policy' },
      { label: 'Shipping Policy', url: '/shipping-policy' },
    ],
  },
];

/* ---------------- Trust / store features ---------------- */
export interface TrustFeature { text: string; enabled: boolean; }
export const DEFAULT_TRUST_FEATURES: TrustFeature[] = [
  { text: '100% authentic products', enabled: true },
  { text: 'Cash on delivery', enabled: true },
  { text: 'Fast nationwide shipping', enabled: true },
  { text: 'Easy returns & exchange', enabled: true },
];

/* ---------------- Trust bar (icon row) ---------------- */
export interface TrustBarItem { icon: string; title: string; desc: string; enabled: boolean; }
export const DEFAULT_TRUST_BAR: TrustBarItem[] = [
  { icon: 'truck', title: 'Free Delivery', desc: 'On orders over ৳2000', enabled: true },
  { icon: 'wallet', title: 'Cash On Delivery', desc: 'Pay when you receive', enabled: true },
  { icon: 'return', title: 'Easy Return', desc: '7-day return policy', enabled: true },
  { icon: 'shield', title: 'Secure Payment', desc: '100% protected', enabled: true },
];
export const TRUST_ICONS = ['truck', 'wallet', 'return', 'shield'] as const;

/* ---------------- Payment methods ---------------- */
export interface PaymentMethod { key: string; label: string; enabled: boolean; }
export const DEFAULT_PAYMENT_METHODS: PaymentMethod[] = [
  { key: 'bkash', label: 'bKash', enabled: true },
  { key: 'nagad', label: 'Nagad', enabled: true },
  { key: 'rocket', label: 'Rocket', enabled: true },
  { key: 'visa', label: 'Visa', enabled: true },
  { key: 'mastercard', label: 'MasterCard', enabled: true },
  { key: 'amex', label: 'Amex', enabled: false },
  { key: 'cod', label: 'Cash On Delivery', enabled: true },
];

/* ---------------- Social links (structured, DB-driven) ---------------- */
export type SocialSurface = 'header' | 'footer' | 'mobile';

export interface SocialLink {
  key: string; // platform/icon key
  label: string;
  url: string;
  enabled: boolean;
  newTab: boolean;
  showHeader: boolean;
  showFooter: boolean;
  showMobile: boolean;
}

/** The officially supported platforms (display order). */
export const SOCIAL_PLATFORM_DEFS: { key: string; label: string }[] = [
  { key: 'facebook', label: 'Facebook' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'youtube', label: 'YouTube' },
  { key: 'tiktok', label: 'TikTok' },
  { key: 'linkedin', label: 'LinkedIn' },
  { key: 'twitter', label: 'X (Twitter)' },
  { key: 'pinterest', label: 'Pinterest' },
  { key: 'threads', label: 'Threads' },
];

const normalizeSocial = (c: Partial<SocialLink> & { key: string }): SocialLink => ({
  key: c.key,
  label: c.label || c.key,
  url: c.url || '',
  enabled: c.enabled ?? false,
  newTab: c.newTab ?? true,
  showHeader: c.showHeader ?? true,
  showFooter: c.showFooter ?? true,
  showMobile: c.showMobile ?? true,
});

/** Backward-compatible defaults derived from legacy `social_<key>` keys. */
function legacySocialLinks(s: Settings | undefined): SocialLink[] {
  const legacyEnabled = flag(s, 'social_enabled', true);
  const base = SOCIAL_PLATFORM_DEFS.map((def) => {
    const url = text(s, `social_${def.key}`, '');
    return normalizeSocial({ key: def.key, label: def.label, url, enabled: legacyEnabled && !!url.trim() });
  });
  // Preserve any legacy chat platforms that had URLs (so footer icons don't disappear).
  const extras = (['whatsapp', 'telegram', 'messenger'] as const)
    .map((k) => {
      const url = text(s, `social_${k}`, '');
      return url.trim()
        ? normalizeSocial({ key: k, label: k.charAt(0).toUpperCase() + k.slice(1), url, enabled: legacyEnabled })
        : null;
    })
    .filter((x): x is SocialLink => !!x);
  return [...base, ...extras];
}

/** Demo social links shown when the store hasn't configured any yet. */
const DEMO_SOCIALS: SocialLink[] = [
  { key: 'facebook', label: 'Facebook', url: 'https://facebook.com' },
  { key: 'instagram', label: 'Instagram', url: 'https://instagram.com' },
  { key: 'youtube', label: 'YouTube', url: 'https://youtube.com' },
  { key: 'tiktok', label: 'TikTok', url: 'https://tiktok.com' },
  { key: 'linkedin', label: 'LinkedIn', url: 'https://linkedin.com' },
  { key: 'whatsapp', label: 'WhatsApp', url: 'https://wa.me/8801234567890' },
].map((c) => normalizeSocial({ ...c, enabled: true }));

/** Full editable list (used by Admin), falling back to legacy keys. */
export function getSocialLinksRaw(s: Settings | undefined): SocialLink[] {
  const list = parseList<SocialLink>(s, 'social_links', []);
  if (list.length) return list.filter((c) => c && c.key).map(normalizeSocial);
  const legacy = legacySocialLinks(s);
  return legacy.some((c) => c.enabled && c.url.trim() !== '') ? legacy : DEMO_SOCIALS;
}

/** Enabled links visible on a given surface (hides empty/disabled). */
export function getVisibleSocials(s: Settings | undefined, surface: SocialSurface): SocialLink[] {
  return getSocialLinksRaw(s).filter(
    (c) =>
      c.enabled &&
      c.url.trim() !== '' &&
      (surface === 'header' ? c.showHeader : surface === 'footer' ? c.showFooter : c.showMobile),
  );
}

/** All enabled social links (used for SEO sameAs schema). */
export function getActiveSocials(s: Settings | undefined): { key: string; label: string; url: string }[] {
  return getSocialLinksRaw(s)
    .filter((c) => c.enabled && c.url.trim() !== '')
    .map((c) => ({ key: c.key, label: c.label, url: c.url.trim() }));
}

/* ---------------- Business information ---------------- */
export interface BusinessInfo {
  storeName: string;
  tagline: string;
  email: string;
  phone: string;
  whatsapp: string;
  messenger: string;
  telegram: string;
  address: string;
  mapUrl: string;
  workingHours: string;
  copyright: string;
}

/** DB-driven business info with backward-compatible fallback to legacy footer/contact keys. */
export function getBusinessInfo(s: Settings | undefined): BusinessInfo {
  const storeName = text(s, 'business_name', text(s, 'footer_brand_name', 'EIDLIP'));
  return {
    storeName,
    tagline: text(s, 'business_tagline', text(s, 'footer_description', '')),
    email: text(s, 'business_email', text(s, 'footer_email', text(s, 'contact_email', 'INFO@HIGHLIGHTS.COM'))),
    phone: text(s, 'business_phone', text(s, 'footer_phone', text(s, 'contact_phone1', '+880 1234 567890'))),
    whatsapp: text(s, 'business_whatsapp', text(s, 'footer_whatsapp_number', text(s, 'contact_whatsapp', ''))),
    messenger: text(s, 'business_messenger', text(s, 'footer_messenger', '')),
    telegram: text(s, 'business_telegram', text(s, 'social_telegram', '')),
    address: text(s, 'business_address', text(s, 'footer_address', text(s, 'contact_address', 'HOUSE 12, ROAD 5, SECTOR 3, UTTARA, DHAKA'))),
    mapUrl: text(s, 'business_map_url', text(s, 'contact_map_link', '')),
    workingHours: text(s, 'business_hours', text(s, 'contact_business_hours', '')),
    copyright: text(s, 'business_copyright', text(s, 'footer_copyright', `© ${new Date().getFullYear()} ${storeName}. All rights reserved.`)),
  };
}

/* ---------------- Quick contact / floating message links ---------------- */
export type QuickContactType = 'whatsapp' | 'messenger' | 'telegram' | 'phone' | 'email';
export type QuickContactDevice = 'all' | 'mobile' | 'desktop';

export interface QuickContact {
  key: string;
  type: QuickContactType;
  label: string;
  /** Raw value: a URL, phone number or email depending on type. */
  value: string;
  enabled: boolean;
  device: QuickContactDevice;
  newTab: boolean;
}

export const QUICK_CONTACT_TYPES: { value: QuickContactType; label: string }[] = [
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'messenger', label: 'Messenger' },
  { value: 'telegram', label: 'Telegram' },
  { value: 'phone', label: 'Phone' },
  { value: 'email', label: 'Email' },
];

/** Resolve a quick contact's value into a usable href. */
export function quickContactHref(c: QuickContact): string {
  const v = (c.value || '').trim();
  if (!v) return '';
  switch (c.type) {
    case 'whatsapp': {
      if (/^https?:\/\//i.test(v)) return v;
      const digits = v.replace(/[^0-9]/g, '');
      return digits ? `https://wa.me/${digits}` : '';
    }
    case 'phone':
      return `tel:${v.replace(/[^0-9+]/g, '')}`;
    case 'email':
      return `mailto:${v}`;
    case 'messenger':
    case 'telegram':
    default:
      return /^https?:\/\//i.test(v) ? v : `https://${v}`;
  }
}

/** Build sensible defaults from legacy contact settings (backward compatible). */
function legacyQuickContacts(s: Settings | undefined): QuickContact[] {
  const wa = text(s, 'footer_whatsapp_number', '') || text(s, 'footer_whatsapp', '');
  const messenger = text(s, 'footer_messenger', '');
  const phone = text(s, 'footer_phone', '');
  const email = text(s, 'footer_email', '');
  return [
    { key: 'whatsapp', type: 'whatsapp', label: 'WhatsApp', value: wa, enabled: !!wa, device: 'all', newTab: true },
    { key: 'messenger', type: 'messenger', label: 'Messenger', value: messenger, enabled: !!messenger, device: 'all', newTab: true },
    { key: 'telegram', type: 'telegram', label: 'Telegram', value: '', enabled: false, device: 'all', newTab: true },
    { key: 'phone', type: 'phone', label: 'Call us', value: phone, enabled: false, device: 'all', newTab: false },
    { key: 'email', type: 'email', label: 'Email', value: email, enabled: false, device: 'all', newTab: false },
  ];
}

/** Demo quick contacts shown when the store hasn't configured any yet. */
const DEMO_QUICK_CONTACTS: QuickContact[] = [
  { key: 'whatsapp', type: 'whatsapp', label: 'WhatsApp', value: '8801234567890', enabled: true, device: 'all', newTab: true },
  { key: 'messenger', type: 'messenger', label: 'Messenger', value: 'https://m.me/yourpage', enabled: true, device: 'all', newTab: true },
];

/** Active floating quick-contact buttons in display order (hides empty/disabled). */
export function getQuickContacts(s: Settings | undefined): QuickContact[] {
  if (!flag(s, 'quick_contacts_enabled', true)) return [];
  const legacy = legacyQuickContacts(s);
  const hasLegacy = legacy.some((c) => c.enabled && quickContactHref(c) !== '');
  const list = parseList<QuickContact>(s, 'quick_contacts', hasLegacy ? legacy : DEMO_QUICK_CONTACTS);
  return list
    .filter((c) => c && c.enabled && quickContactHref(c) !== '')
    .map((c) => ({ ...c, device: c.device || 'all', newTab: c.newTab ?? true }));
}

/** Full editable list (used by Admin), falling back to legacy defaults. */
export function getQuickContactsRaw(s: Settings | undefined): QuickContact[] {
  return parseList<QuickContact>(s, 'quick_contacts', legacyQuickContacts(s));
}