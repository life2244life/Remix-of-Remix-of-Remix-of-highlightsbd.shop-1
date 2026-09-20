/**
 * On-Page SEO Assistant — pure client-side analysis (RankMath/Yoast style).
 *
 * No database, no network, no side effects. Used only by the admin Product
 * and Blog editors to score on-page SEO in real time. Does not touch the
 * storefront SEO logic (src/components/SEO.tsx) in any way.
 */

import { readingTime } from '@/hooks/useBlog';

export type CheckStatus = 'pass' | 'fail' | 'warn';

export type SeoCheck = {
  id: string;
  label: string;
  status: CheckStatus;
  weight: number;
  /** Why this factor matters for SEO. */
  why: string;
  /** Concrete recommendation to fix it (shown when not passing). */
  fix: string;
  /** Optional measured value shown as context, e.g. "42 chars". */
  detail?: string;
};

export type SeoBand = 'poor' | 'improve' | 'good';

export type SeoResult = {
  score: number; // 0-100
  band: SeoBand;
  checks: SeoCheck[];
  passed: SeoCheck[];
  warnings: SeoCheck[];
  failed: SeoCheck[];
};

export const seoBand = (score: number): SeoBand =>
  score >= 80 ? 'good' : score >= 50 ? 'improve' : 'poor';

const norm = (s?: string | null) => (s || '').toLowerCase().trim();

/** Case-insensitive substring match (works for Bangla & English alike). */
const contains = (haystack?: string | null, needle?: string | null) => {
  const h = norm(haystack);
  const n = norm(needle);
  return !!n && h.includes(n);
};

const countWords = (text: string) =>
  (text || '').trim().split(/\s+/).filter(Boolean).length;

/** Strip markdown/HTML to approximate readable text. */
const stripMarkdown = (md: string) =>
  (md || '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/@youtube\[[^\]]*\]/gi, ' ')
    .replace(/@product\[[^\]]*\]/gi, ' ')
    .replace(/@\/?faq/gi, ' ')
    .replace(/[#>*_~|-]/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const buildResult = (checks: SeoCheck[]): SeoResult => {
  const totalWeight = checks.reduce((s, c) => s + c.weight, 0) || 1;
  const earned = checks.reduce(
    (s, c) => s + (c.status === 'pass' ? c.weight : c.status === 'warn' ? c.weight / 2 : 0),
    0,
  );
  const score = Math.round((earned / totalWeight) * 100);
  return {
    score,
    band: seoBand(score),
    checks,
    passed: checks.filter((c) => c.status === 'pass'),
    warnings: checks.filter((c) => c.status === 'warn'),
    failed: checks.filter((c) => c.status === 'fail'),
  };
};

// ─────────────────────────── Product ───────────────────────────

export type ProductSeoInput = {
  focusKeyword: string;
  name: string;
  slug: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  altText: string;
  imageCount: number;
  /** Products always emit Product/Breadcrumb JSON-LD + canonical on the storefront. */
  structuredData?: boolean;
  canonical?: boolean;
};

export function analyzeProductSEO(input: ProductSeoInput): SeoResult {
  const kw = input.focusKeyword.trim();
  const hasKw = kw.length > 0;
  const effTitle = input.seoTitle || input.name;
  const titleLen = (input.name || '').length;
  const metaTitleLen = (effTitle || '').length;
  const metaDescLen = (input.seoDescription || '').length;
  const descLen = (input.description || '').length;
  const hasInternal = /\]\(\/[^)]*\)|href=["']\//i.test(input.description || '');

  const checks: SeoCheck[] = [
    {
      id: 'kw-exists', label: 'Focus keyword set', weight: 10,
      status: hasKw ? 'pass' : 'fail',
      why: 'A focus keyword anchors the whole on-page optimization and tells search engines the page topic.',
      fix: 'Enter the main phrase customers search for, e.g. "Men\'s Panjabi".',
      detail: hasKw ? `"${kw}"` : 'none',
    },
    {
      id: 'kw-title', label: 'Keyword in product title', weight: 8,
      status: !hasKw ? 'fail' : contains(input.name, kw) ? 'pass' : 'fail',
      why: 'The product title is the strongest on-page ranking signal.',
      fix: `Include "${kw || 'your keyword'}" naturally in the product name.`,
    },
    {
      id: 'kw-meta-title', label: 'Keyword in meta title', weight: 8,
      status: !hasKw ? 'fail' : contains(effTitle, kw) ? 'pass' : 'fail',
      why: 'The meta title is what shows as the clickable blue link on Google.',
      fix: `Add "${kw || 'your keyword'}" to the SEO Title field.`,
    },
    {
      id: 'kw-meta-desc', label: 'Keyword in meta description', weight: 8,
      status: !hasKw ? 'fail' : contains(input.seoDescription, kw) ? 'pass' : 'fail',
      why: 'Keywords in the description are bolded in search results and lift click-through rate.',
      fix: `Add "${kw || 'your keyword'}" naturally inside the meta description.`,
    },
    {
      id: 'kw-slug', label: 'Keyword in URL slug', weight: 8,
      status: !hasKw ? 'fail' : contains(input.slug, kw.replace(/\s+/g, '-')) || contains(input.slug, kw) ? 'pass' : 'fail',
      why: 'A keyword-rich URL is a clear relevance signal and reads better when shared.',
      fix: `Make the slug contain the keyword, e.g. /products/${(kw || 'your-keyword').toLowerCase().replace(/\s+/g, '-')}.`,
      detail: input.slug || 'auto',
    },
    {
      id: 'desc-length', label: 'Product description is detailed', weight: 8,
      status: descLen >= 300 ? 'pass' : descLen >= 120 ? 'warn' : 'fail',
      why: 'Thin descriptions rank poorly and convert worse; aim for 300+ characters.',
      fix: 'Expand the description with fabric, fit, care and styling details (300+ chars).',
      detail: `${descLen} chars`,
    },
    {
      id: 'has-image', label: 'At least one image', weight: 8,
      status: input.imageCount > 0 ? 'pass' : 'fail',
      why: 'Product images drive conversions and feed Google Images & shopping results.',
      fix: 'Upload at least one product image.',
      detail: `${input.imageCount} image(s)`,
    },
    {
      id: 'alt-text', label: 'Primary image has alt text', weight: 8,
      status: input.altText.trim() ? (hasKw && !contains(input.altText, kw) ? 'warn' : 'pass') : 'fail',
      why: 'Alt text powers accessibility and lets the image rank in Google Images.',
      fix: `Describe the image and include "${kw || 'the keyword'}" where natural.`,
    },
    {
      id: 'title-length', label: 'Product title length (30–60)', weight: 6,
      status: titleLen >= 30 && titleLen <= 60 ? 'pass' : titleLen > 0 ? 'warn' : 'fail',
      why: 'Titles in the 30–60 range are descriptive without being truncated.',
      fix: 'Adjust the product name to 30–60 characters.',
      detail: `${titleLen} chars`,
    },
    {
      id: 'meta-title-length', label: 'Meta title length (50–60)', weight: 6,
      status: metaTitleLen >= 50 && metaTitleLen <= 60 ? 'pass' : metaTitleLen > 0 ? 'warn' : 'fail',
      why: 'Google truncates titles beyond ~60 characters.',
      fix: 'Keep the SEO Title between 50 and 60 characters.',
      detail: `${metaTitleLen} chars`,
    },
    {
      id: 'meta-desc-length', label: 'Meta description length (140–160)', weight: 6,
      status: metaDescLen >= 140 && metaDescLen <= 160 ? 'pass' : metaDescLen > 0 ? 'warn' : 'fail',
      why: 'Descriptions of 140–160 characters use the full snippet without truncation.',
      fix: 'Write a meta description of 140–160 characters.',
      detail: `${metaDescLen} chars`,
    },
    {
      id: 'internal-links', label: 'Internal links (optional)', weight: 3,
      status: hasInternal ? 'pass' : 'warn',
      why: 'Linking to related products or collections spreads ranking authority.',
      fix: 'Optionally link to a related collection inside the description.',
    },
    {
      id: 'structured-data', label: 'Structured data enabled', weight: 5,
      status: input.structuredData === false ? 'fail' : 'pass',
      why: 'Product schema enables price & rating rich results on Google.',
      fix: 'Structured data is emitted automatically on the storefront product page.',
    },
    {
      id: 'canonical', label: 'Canonical URL exists', weight: 5,
      status: input.canonical === false ? 'fail' : 'pass',
      why: 'A self-referencing canonical prevents duplicate-content issues.',
      fix: 'Canonical is generated automatically from the product slug.',
    },
  ];

  return buildResult(checks);
}

// ─────────────────────────── Blog ───────────────────────────

export type BlogSeoInput = {
  focusKeyword: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  seoTitle: string;
  seoDescription: string;
  coverImage: string;
  coverAlt: string;
};

export function analyzeBlogSEO(input: BlogSeoInput): SeoResult {
  const kw = input.focusKeyword.trim();
  const hasKw = kw.length > 0;
  const content = input.content || '';
  const plain = stripMarkdown(content);
  const words = countWords(plain);
  const effTitle = input.seoTitle || input.title;
  const effDesc = input.seoDescription || input.excerpt;
  const metaTitleLen = (effTitle || '').length;
  const metaDescLen = (effDesc || '').length;

  // First paragraph = first non-empty, non-heading/directive block of content.
  const firstPara =
    content
      .split(/\n\s*\n/)
      .map((b) => b.trim())
      .find((b) => b && !/^(#{1,6}\s|@youtube|@product|@faq|@endfaq|\|)/i.test(b)) || '';

  // Keyword density.
  let density = 0;
  if (hasKw && words > 0) {
    const occ = (norm(plain).match(new RegExp(norm(kw).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
    density = (occ * countWords(kw) / words) * 100;
  }

  const hasH2 = /^##\s+\S/m.test(content);
  const hasInternal = /\]\(\/[^)]*\)|@product\[\s*\//i.test(content);
  const hasExternal = /\]\(https?:\/\//i.test(content) || /@product\[\s*https?:\/\//i.test(content);
  const hasFaq = /@faq\b/i.test(content);

  // Readability: average words per sentence (lower is easier). <=25 acceptable.
  const sentences = plain.split(/[.!?।]+/).map((s) => s.trim()).filter(Boolean);
  const avgWps = sentences.length ? words / sentences.length : words;
  const readabilityOk = words === 0 ? false : avgWps <= 25;

  // Estimated reading time (minutes) using the shared helper. Empty content = 0.
  const minutes = words === 0 ? 0 : readingTime(content);

  const checks: SeoCheck[] = [
    {
      id: 'kw-exists', label: 'Focus keyword set', weight: 10,
      status: hasKw ? 'pass' : 'fail',
      why: 'A focus keyword defines the topic the article should rank for.',
      fix: 'Enter the main phrase readers will search, e.g. "Eid fashion tips".',
      detail: hasKw ? `"${kw}"` : 'none',
    },
    {
      id: 'kw-title', label: 'Keyword in H1 title', weight: 8,
      status: !hasKw ? 'fail' : contains(input.title, kw) ? 'pass' : 'fail',
      why: 'The post title is rendered as the H1 and is the top relevance signal.',
      fix: `Include "${kw || 'your keyword'}" in the post title.`,
    },
    {
      id: 'kw-first-para', label: 'Keyword in first paragraph', weight: 8,
      status: !hasKw ? 'fail' : contains(firstPara, kw) ? 'pass' : 'fail',
      why: 'An early keyword mention confirms the topic to readers and crawlers.',
      fix: `Mention "${kw || 'your keyword'}" within the opening paragraph.`,
    },
    {
      id: 'kw-density', label: 'Keyword density 0.5–2%', weight: 8,
      status: !hasKw || words === 0 ? 'fail' : density >= 0.5 && density <= 2 ? 'pass' : 'warn',
      why: 'Density in the 0.5–2% range signals relevance without keyword stuffing.',
      fix: density > 2 ? 'Reduce keyword repetition to avoid over-optimization.' : `Use "${kw || 'your keyword'}" a few more times naturally.`,
      detail: `${density.toFixed(1)}%`,
    },
    {
      id: 'meta-title-length', label: 'Meta title length (50–60)', weight: 6,
      status: metaTitleLen >= 50 && metaTitleLen <= 60 ? 'pass' : metaTitleLen > 0 ? 'warn' : 'fail',
      why: 'Titles beyond ~60 characters get truncated in search results.',
      fix: 'Keep the SEO title (or title) between 50 and 60 characters.',
      detail: `${metaTitleLen} chars`,
    },
    {
      id: 'meta-desc-length', label: 'Meta description length (140–160)', weight: 6,
      status: metaDescLen >= 140 && metaDescLen <= 160 ? 'pass' : metaDescLen > 0 ? 'warn' : 'fail',
      why: 'A 140–160 character description fills the snippet for higher CTR.',
      fix: 'Write an SEO description (or excerpt) of 140–160 characters.',
      detail: `${metaDescLen} chars`,
    },
    {
      id: 'kw-slug', label: 'Keyword in URL slug', weight: 8,
      status: !hasKw ? 'fail' : contains(input.slug, kw.replace(/\s+/g, '-')) || contains(input.slug, kw) ? 'pass' : 'fail',
      why: 'A keyword in the slug improves relevance and shareability.',
      fix: `Make the slug include the keyword, e.g. /blog/${(kw || 'your-keyword').toLowerCase().replace(/\s+/g, '-')}.`,
      detail: input.slug || 'auto',
    },
    {
      id: 'has-image', label: 'At least one image', weight: 6,
      status: input.coverImage.trim() || /!\[[^\]]*\]\([^)]+\)/.test(content) ? 'pass' : 'fail',
      why: 'Articles with images earn more engagement and image-search traffic.',
      fix: 'Add a cover image or at least one inline image.',
    },
    {
      id: 'cover-alt', label: 'Featured image has alt text', weight: 6,
      status: input.coverImage.trim() ? (input.coverAlt.trim() ? 'pass' : 'fail') : 'warn',
      why: 'Alt text drives accessibility and Google Images ranking.',
      fix: 'Fill the Cover Image Alt Text field describing the image.',
    },
    {
      id: 'has-h2', label: 'At least one H2 heading', weight: 6,
      status: hasH2 ? 'pass' : 'fail',
      why: 'H2 subheadings structure content for readers and featured snippets.',
      fix: 'Add section subheadings using "## Heading" in the content.',
    },
    {
      id: 'internal-link', label: 'At least one internal link', weight: 5,
      status: hasInternal ? 'pass' : 'fail',
      why: 'Internal links keep readers on-site and pass ranking authority.',
      fix: 'Link to a product or another post, e.g. @product[/products/slug | Label].',
    },
    {
      id: 'external-link', label: 'At least one external link', weight: 4,
      status: hasExternal ? 'pass' : 'warn',
      why: 'Citing authoritative sources can build topical trust.',
      fix: 'Add a link to a relevant authoritative external source.',
    },
    {
      id: 'content-length', label: 'Content exceeds 800 words', weight: 8,
      status: words >= 800 ? 'pass' : words >= 400 ? 'warn' : 'fail',
      why: 'Long-form content (800+ words) tends to rank better for competitive terms.',
      fix: 'Expand the article to at least 800 words of useful content.',
      detail: `${words} words`,
    },
    {
      id: 'faq', label: 'FAQ section (recommended)', weight: 4,
      status: hasFaq ? 'pass' : 'warn',
      why: 'An @faq block emits FAQ schema and can win rich results.',
      fix: 'Add an @faq … @endfaq block with common questions.',
    },
    {
      id: 'readability', label: 'Readability acceptable', weight: 5,
      status: readabilityOk ? 'pass' : 'warn',
      why: 'Shorter sentences (≤25 words avg) keep content easy to read.',
      fix: 'Break long sentences up to improve readability.',
      detail: words ? `${avgWps.toFixed(0)} words/sentence` : 'no content',
    },
    {
      id: 'reading-time', label: 'Reading time (3–10 min)', weight: 5,
      status: minutes >= 3 && minutes <= 10 ? 'pass' : minutes >= 1 ? 'warn' : 'fail',
      why: 'Articles with a 3–10 minute read are substantial enough to rank yet stay digestible for readers.',
      fix: minutes === 0
        ? 'Add article content — there is nothing to read yet.'
        : minutes < 3
          ? 'Expand the article so it takes at least 3 minutes to read (~600+ words).'
          : 'Consider tightening or splitting very long content (keep under ~10 minutes).',
      detail: `${minutes} min`,
    },
  ];

  return buildResult(checks);
}
