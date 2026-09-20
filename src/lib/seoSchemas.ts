import type { SEOSettings } from '@/hooks/useSEOSettings';

const isOn = (v: string | undefined) => v === undefined || v === 'true';

const baseUrl = (s: SEOSettings) =>
  (s.canonical_base_url || s.site_url || 'https://demo.eidlip.com').replace(/\/$/, '');

const abs = (s: SEOSettings, path: string) => {
  if (!path) return baseUrl(s) + '/';
  if (path.startsWith('http')) return path;
  return baseUrl(s) + (path.startsWith('/') ? path : `/${path}`);
};

const parseFaq = (raw: string): { q: string; a: string }[] => {
  try {
    const arr = JSON.parse(raw || '[]');
    return Array.isArray(arr) ? arr.filter((x) => x && x.q && x.a) : [];
  } catch {
    return [];
  }
};

const socials = (s: SEOSettings) =>
  [s.facebook_url, s.instagram_url].map((u) => (u || '').trim()).filter(Boolean);

export const organizationSchema = (s: SEOSettings) => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: s.site_name,
  alternateName: ['eidlip', s.site_name],
  url: baseUrl(s),
  logo: abs(s, s.default_og_image || '/logo.png'),
  description: s.brand_description || s.default_description,
  ...(socials(s).length ? { sameAs: socials(s) } : {}),
});

export const websiteSchema = (s: SEOSettings) => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: s.site_name,
  alternateName: 'eidlip',
  url: baseUrl(s),
  ...(isOn(s.sd_searchaction)
    ? {
        potentialAction: {
          '@type': 'SearchAction',
          target: `${baseUrl(s)}/?search={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      }
    : {}),
});

export const storeSchema = (s: SEOSettings) => ({
  '@context': 'https://schema.org',
  '@type': s.business_type || 'ClothingStore',
  name: s.site_name,
  alternateName: 'eidlip',
  description: s.brand_description || s.default_description,
  image: abs(s, s.default_og_image || '/logo.png'),
  logo: abs(s, s.default_og_image || '/logo.png'),
  url: baseUrl(s),
  address: { '@type': 'PostalAddress', addressCountry: 'BD' },
  areaServed: 'BD',
  paymentAccepted: 'Cash on Delivery, bKash, Nagad',
  ...(socials(s).length ? { sameAs: socials(s) } : {}),
});

export const faqSchema = (s: SEOSettings) => {
  const faqs = parseFaq(s.faq_knowledge);
  if (!faqs.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
};

export const breadcrumbSchema = (
  s: SEOSettings,
  items: { name: string; path: string }[],
) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: it.name,
    item: abs(s, it.path),
  })),
});

/** Site-wide schemas injected once, gated by structured-data toggles. */
export const buildGlobalSchemas = (s: SEOSettings) => {
  const out: Record<string, any>[] = [];
  if (isOn(s.sd_organization)) out.push(organizationSchema(s));
  if (isOn(s.sd_website)) out.push(websiteSchema(s));
  if (isOn(s.sd_store)) out.push(storeSchema(s));
  if (isOn(s.sd_faqpage)) {
    const faq = faqSchema(s);
    if (faq) out.push(faq);
  }
  return out;
};
