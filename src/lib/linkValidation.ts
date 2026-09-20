import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

/**
 * Universal CTA / internal-link route validation.
 *
 * Works hand-in-hand with the shared LinkPicker. A destination is one of:
 *  - external (http/https or mailto/tel/wa.me/m.me)  -> always allowed
 *  - empty                                           -> allowed (no CTA)
 *  - internal app route (/lp, /page, /products, ...) -> must resolve to an
 *    existing row, otherwise it is "invalid" and must not be saved.
 */

const sb = () => supabase as any;

export type LinkRefType = 'landing' | 'page' | 'product' | 'collection' | 'category' | 'blog';
export type LinkRef =
  | { type: LinkRefType; key: string; byId?: boolean; sub?: string }
  | null;

const INTERNAL_PREFIX = /^\/(lp|page|products|product|collections|blog)\//;

/** True when the url points to an internal app route we can validate. */
export const isInternalRef = (url: string): boolean => {
  if (!url) return false;
  if (/^(https?:|mailto:|tel:|sms:)/i.test(url)) return false;
  if (INTERNAL_PREFIX.test(url)) return true;
  return url.includes('category=');
};

const firstSegment = (s: string) => decodeURIComponent((s || '').split(/[?#]/)[0]);

/** Parse an internal url into a structured reference, or null if not internal. */
export const parseLinkRef = (url: string): LinkRef => {
  if (!isInternalRef(url)) return null;
  try {
    if (url.startsWith('/lp/')) return { type: 'landing', key: firstSegment(url.slice(4)) };
    if (url.startsWith('/page/')) return { type: 'page', key: firstSegment(url.slice(6)) };
    if (url.startsWith('/products/')) return { type: 'product', key: firstSegment(url.slice(10)) };
    if (url.startsWith('/product/')) return { type: 'product', key: firstSegment(url.slice(9)), byId: true };
    if (url.startsWith('/collections/')) return { type: 'collection', key: firstSegment(url.slice(13)) };
    if (url.startsWith('/blog/')) return { type: 'blog', key: firstSegment(url.slice(6)) };
    if (url.includes('category=')) {
      const qs = url.split('?')[1] || '';
      const params = new URLSearchParams(qs);
      const cat = params.get('category');
      if (!cat) return null;
      return { type: 'category', key: cat, sub: params.get('sub') || undefined };
    }
  } catch {
    return null;
  }
  return null;
};

/** Returns true if the destination exists (or is external / empty). */
export const checkLinkExists = async (url: string): Promise<boolean> => {
  const ref = parseLinkRef(url);
  if (!ref) return true; // external, empty or unrecognised -> allowed
  try {
    switch (ref.type) {
      case 'landing': {
        const { data } = await sb().from('landing_pages').select('id').eq('slug', ref.key).maybeSingle();
        return !!data;
      }
      case 'page': {
        const { data } = await sb().from('custom_pages').select('id').eq('slug', ref.key).maybeSingle();
        return !!data;
      }
      case 'product': {
        const col = ref.byId ? 'id' : 'slug';
        const { data } = await sb().from('products').select('id').eq(col, ref.key).maybeSingle();
        return !!data;
      }
      case 'collection': {
        const { data } = await sb().from('collections').select('id').eq('slug', ref.key).maybeSingle();
        return !!data;
      }
      case 'blog': {
        const { data } = await sb().from('blog_posts').select('id').eq('slug', ref.key).maybeSingle();
        return !!data;
      }
      case 'category': {
        const { data: cat } = await sb().from('header_categories').select('id').eq('slug', ref.key).maybeSingle();
        if (!cat) return false;
        if (ref.sub) {
          const { data: sub } = await sb().from('subcategories').select('id').eq('slug', ref.sub).maybeSingle();
          return !!sub;
        }
        return true;
      }
      default:
        return true;
    }
  } catch {
    // On a network/permission error, do not block saving — assume valid.
    return true;
  }
};

/** Recursively collect every internal url found in a value (string/array/object). */
export const collectInternalUrls = (value: any): string[] => {
  const out = new Set<string>();
  const walk = (v: any) => {
    if (!v) return;
    if (typeof v === 'string') {
      if (isInternalRef(v)) out.add(v);
      return;
    }
    if (Array.isArray(v)) { v.forEach(walk); return; }
    if (typeof v === 'object') { Object.values(v).forEach(walk); }
  };
  walk(value);
  return [...out];
};

/** Returns the subset of urls whose internal destination no longer exists. */
export const findInvalidUrls = async (urls: string[]): Promise<string[]> => {
  const unique = [...new Set(urls.filter(isInternalRef))];
  const results = await Promise.all(unique.map(async (u) => ({ u, ok: await checkLinkExists(u) })));
  return results.filter((r) => !r.ok).map((r) => r.u);
};

/**
 * Convenience guard for save handlers. Scans a payload for internal links and
 * resolves to true when everything is valid. Pass an onError to surface a
 * message (e.g. toast) listing the first broken destination.
 */
export const guardLinks = async (
  payload: any,
  onError?: (message: string, invalid: string[]) => void,
): Promise<boolean> => {
  const invalid = await findInvalidUrls(collectInternalUrls(payload));
  if (invalid.length) {
    onError?.(`Destination no longer exists: ${invalid[0]}${invalid.length > 1 ? ` (+${invalid.length - 1} more)` : ''}`, invalid);
    return false;
  }
  return true;
};

/** Live validity for a single url — used by LinkPicker to warn inline. */
export const useLinkValidity = (url: string) => {
  const enabled = isInternalRef(url);
  const { data, isLoading } = useQuery({
    queryKey: ['link-validity', url],
    enabled,
    staleTime: 1000 * 60,
    queryFn: () => checkLinkExists(url),
  });
  return {
    isInternal: enabled,
    isLoading: enabled && isLoading,
    // valid while loading / external / empty; only false once confirmed missing
    isValid: !enabled || data !== false,
    isMissing: enabled && data === false,
  };
};
