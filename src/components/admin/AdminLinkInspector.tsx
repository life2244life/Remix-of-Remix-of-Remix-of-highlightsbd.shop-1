import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Search, Link2, ExternalLink, ShoppingBag, FolderTree, Megaphone, FileText, BookOpen } from 'lucide-react';
import { isInternalRef, parseLinkRef } from '@/lib/linkValidation';

/* ----------------------------------------------------------------------------
 * Read-only Link Usage Inspector.
 * Scans every CTA / link location in the CMS and shows, per Product /
 * Collection / Landing Page / Static Page / Blog Post, exactly where it is
 * referenced. No mutations, no migrations — visibility only.
 * ------------------------------------------------------------------------- */

const sb = () => supabase as any;
type Usage = { url: string; location: string };

const PRODUCT_TYPES = new Set(['flash_sale', 'product_grid', 'product_slider', 'collection', 'product']);

const SETTING_LABELS: Record<string, string> = {
  topbar_track_link: 'Header — Track Order Link',
  topbar_contact_link: 'Header — Contact Link',
  product_message_link: 'Product Page — Message Now',
  footer_whatsapp: 'Footer — WhatsApp',
  footer_messenger: 'Footer — Messenger',
  contact_map_link: 'Contact — Google Map',
};

/* generic recursive extractor */
const extractLinks = (value: any, base: string): Usage[] => {
  const out: Usage[] = [];
  const walk = (v: any, label: string) => {
    if (!v) return;
    if (typeof v === 'string') { if (isInternalRef(v)) out.push({ url: v, location: label }); return; }
    if (Array.isArray(v)) { v.forEach((it, i) => walk(it, `${label} #${i + 1}`)); return; }
    if (typeof v === 'object') Object.values(v).forEach((x) => walk(x, label));
  };
  walk(value, base);
  return out;
};

const homepageLabel = (s: any): string => {
  const t = s.title || s.section_key || 'Section';
  if (s.section_key === 'hero') return 'Homepage Hero Slide';
  if (PRODUCT_TYPES.has(s.type)) return `Product Section: ${t}`;
  switch (s.type) {
    case 'banner': return `Homepage Banner: ${t}`;
    case 'poster': return `Homepage Poster: ${t}`;
    case 'custom_block': return `Homepage Block: ${t}`;
    default: return `Homepage: ${t}`;
  }
};

const useUsageIndex = () =>
  useQuery({
    queryKey: ['link-usage-index'],
    staleTime: 1000 * 60,
    queryFn: async () => {
      const [sections, settings, landing, products, collections, pages, blog] = await Promise.all([
        sb().from('homepage_sections').select('section_key,title,type,config'),
        sb().from('store_settings').select('key,value'),
        sb().from('landing_pages').select('id,title,slug,blocks'),
        sb().from('products').select('id,name,slug'),
        sb().from('collections').select('id,title,slug'),
        sb().from('custom_pages').select('id,title,slug'),
        sb().from('blog_posts').select('id,title,slug'),
      ]);

      /* 1. collect every internal usage with a friendly location label */
      const usages: Usage[] = [];
      (sections.data || []).forEach((s: any) => usages.push(...extractLinks(s.config, homepageLabel(s))));
      (landing.data || []).forEach((lp: any) => usages.push(...extractLinks(lp.blocks, `Landing Page: ${lp.title}`)));
      (settings.data || []).forEach((row: any) => {
        if (row.key === 'footer_menus') {
          try {
            const menus = JSON.parse(row.value || '[]');
            (menus || []).forEach((m: any) => (m.links || []).forEach((l: any) => {
              if (isInternalRef(l.url)) usages.push({ url: l.url, location: `Footer Menu: ${m.title || 'Menu'} — ${l.label || 'link'}` });
            }));
          } catch { /* ignore */ }
        } else if (isInternalRef(row.value)) {
          usages.push({ url: row.value, location: SETTING_LABELS[row.key] || `Setting: ${row.key}` });
        }
      });

      /* 2. lookup maps */
      const productsBySlug = new Map<string, any>(); const productsById = new Map<string, any>();
      (products.data || []).forEach((p: any) => { if (p.slug) productsBySlug.set(p.slug, p); productsById.set(p.id, p); });
      const collectionsBySlug = new Map((collections.data || []).map((c: any) => [c.slug, c]));
      const landingBySlug = new Map((landing.data || []).map((l: any) => [l.slug, l]));
      const pagesBySlug = new Map((pages.data || []).map((p: any) => [p.slug, p]));
      const blogBySlug = new Map((blog.data || []).map((b: any) => [b.slug, b]));

      /* 3. reverse index: entity -> usages */
      type Group = Map<string, { id: string; name: string; usages: Usage[] }>;
      const groups: Record<string, Group> = { product: new Map(), collection: new Map(), landing: new Map(), page: new Map(), blog: new Map() };

      const add = (type: string, ent: any, nameKey: string, u: Usage) => {
        if (!ent) return;
        const g = groups[type];
        if (!g.has(ent.id)) g.set(ent.id, { id: ent.id, name: ent[nameKey], usages: [] });
        g.get(ent.id)!.usages.push(u);
      };

      usages.forEach((u) => {
        const ref = parseLinkRef(u.url);
        if (!ref) return;
        switch (ref.type) {
          case 'product': add('product', ref.byId ? productsById.get(ref.key) : productsBySlug.get(ref.key), 'name', u); break;
          case 'collection': add('collection', collectionsBySlug.get(ref.key), 'title', u); break;
          case 'landing': add('landing', landingBySlug.get(ref.key), 'title', u); break;
          case 'page': add('page', pagesBySlug.get(ref.key), 'title', u); break;
          case 'blog': add('blog', blogBySlug.get(ref.key), 'title', u); break;
          default: break; // categories / external are out of scope
        }
      });

      const toArr = (g: Map<string, any>) => [...g.values()].sort((a, b) => b.usages.length - a.usages.length);
      return {
        product: toArr(groups.product),
        collection: toArr(groups.collection),
        landing: toArr(groups.landing),
        page: toArr(groups.page),
        blog: toArr(groups.blog),
        totalUsages: usages.length,
      };
    },
  });

const SECTIONS: { key: 'landing' | 'page' | 'product' | 'collection' | 'blog'; label: string; icon: any }[] = [
  { key: 'landing', label: 'Landing Pages', icon: Megaphone },
  { key: 'page', label: 'Static Pages', icon: FileText },
  { key: 'product', label: 'Products', icon: ShoppingBag },
  { key: 'collection', label: 'Collections', icon: FolderTree },
  { key: 'blog', label: 'Blog Posts', icon: BookOpen },
];

const AdminLinkInspector = () => {
  const { data, isLoading } = useUsageIndex();
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    if (!data) return null;
    const s = q.trim().toLowerCase();
    const f = (rows: any[]) => (s ? rows.filter((r) => (r.name || '').toLowerCase().includes(s)) : rows);
    return { landing: f(data.landing), page: f(data.page), product: f(data.product), collection: f(data.collection), blog: f(data.blog) };
  }, [data, q]);

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  if (!data || !filtered) return null;

  return (
    <div className="space-y-6">
      <div className="border border-border bg-secondary/20 p-3 flex items-start gap-2">
        <Link2 size={15} className="mt-0.5 text-muted-foreground shrink-0" />
        <div className="text-xs text-muted-foreground">
          <p className="font-medium text-foreground">Link Usage Inspector</p>
          <p>Read-only view of where each item is linked across the storefront. {data.totalUsages} internal link(s) scanned. Only items currently referenced are listed.</p>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-2.5 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name…"
          className="w-full border border-border bg-background pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-foreground" />
      </div>

      {SECTIONS.map(({ key, label, icon: Icon }) => {
        const rows = filtered[key];
        return (
          <div key={key} className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Icon size={15} className="text-muted-foreground" />
              {label}
              <span className="text-xs text-muted-foreground">({rows.length} used)</span>
            </div>
            {rows.length === 0 ? (
              <p className="text-xs text-muted-foreground pl-6">Nothing in use{q ? ' matches your search' : ''}.</p>
            ) : (
              <div className="grid gap-2">
                {rows.map((r: any) => (
                  <div key={r.id} className="border border-border p-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium truncate">{r.name || 'Untitled'}</span>
                      <span className="text-[11px] text-muted-foreground shrink-0">{r.usages.length} usage(s)</span>
                    </div>
                    <ul className="mt-2 space-y-1">
                      {r.usages.map((u: Usage, i: number) => (
                        <li key={i} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                          <ExternalLink size={10} className="shrink-0" />
                          <span className="truncate">{u.location}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AdminLinkInspector;
