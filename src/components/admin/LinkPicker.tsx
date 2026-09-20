import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Search, ExternalLink, Link2, ChevronDown, AlertTriangle } from 'lucide-react';
import { useLinkValidity } from '@/lib/linkValidation';

/**
 * Universal Internal Link Picker.
 *
 * Drop-in replacement for any plain URL text field. It stores the final
 * frontend URL as a string (value / onChange), so existing URL data keeps
 * working with zero migration and old external links remain valid.
 */

export type LinkType = 'external' | 'landing' | 'page' | 'product' | 'collection' | 'category' | 'blog';

const TYPE_OPTIONS: { value: LinkType; label: string }[] = [
  { value: 'external', label: 'External URL' },
  { value: 'landing', label: 'Landing Page' },
  { value: 'page', label: 'Static Page' },
  { value: 'product', label: 'Product' },
  { value: 'collection', label: 'Collection' },
  { value: 'category', label: 'Category' },
  { value: 'blog', label: 'Blog Post' },
];

type Item = { id: string; label: string; url: string; sub?: string };

const sb = () => supabase as any;

const useLinkData = (type: LinkType, enabled: boolean) =>
  useQuery({
    queryKey: ['linkpicker', type],
    enabled: enabled && type !== 'external',
    staleTime: 1000 * 60 * 5,
    queryFn: async (): Promise<Item[]> => {
      switch (type) {
        case 'landing': {
          const { data } = await sb().from('landing_pages').select('id,title,slug').order('updated_at', { ascending: false });
          return (data || []).map((p: any) => ({ id: p.id, label: p.title, sub: `/lp/${p.slug}`, url: `/lp/${p.slug}` }));
        }
        case 'page': {
          const { data } = await sb().from('custom_pages').select('id,title,slug').order('sort_order');
          return (data || []).map((p: any) => ({ id: p.id, label: p.title, sub: `/page/${p.slug}`, url: `/page/${p.slug}` }));
        }
        case 'product': {
          const { data } = await sb().from('products').select('id,name,slug').eq('is_active', true).order('created_at', { ascending: false }).limit(500);
          return (data || []).map((p: any) => {
            const u = p.slug ? `/products/${p.slug}` : `/product/${p.id}`;
            return { id: p.id, label: p.name, sub: u, url: u };
          });
        }
        case 'collection': {
          const { data } = await sb().from('collections').select('id,title,slug').order('sort_order');
          return (data || []).map((c: any) => ({ id: c.id, label: c.title, sub: `/collections/${c.slug}`, url: `/collections/${c.slug}` }));
        }
        case 'category': {
          const [{ data: cats }, { data: subs }] = await Promise.all([
            sb().from('header_categories').select('name,slug').order('sort_order'),
            sb().from('subcategories').select('name,slug,parent_category').order('sort_order'),
          ]);
          const out: Item[] = (cats || []).map((c: any) => ({ id: `c-${c.slug}`, label: c.name, sub: `/?category=${c.slug}`, url: `/?category=${encodeURIComponent(c.slug)}` }));
          (subs || []).forEach((s: any) => out.push({
            id: `s-${s.parent_category}-${s.slug}`, label: `${s.name}`, sub: `${s.parent_category} › ${s.slug}`,
            url: `/?category=${encodeURIComponent(s.parent_category)}&sub=${encodeURIComponent(s.slug)}`,
          }));
          return out;
        }
        case 'blog': {
          const { data } = await sb().from('blog_posts').select('id,title,slug').order('created_at', { ascending: false });
          return (data || []).map((b: any) => ({ id: b.id, label: b.title, sub: `/blog/${b.slug}`, url: `/blog/${b.slug}` }));
        }
        default:
          return [];
      }
    },
  });

const detectType = (url: string): LinkType => {
  if (!url) return 'external';
  if (url.startsWith('/lp/')) return 'landing';
  if (url.startsWith('/page/')) return 'page';
  if (url.startsWith('/products/') || url.startsWith('/product/')) return 'product';
  if (url.startsWith('/collections/')) return 'collection';
  if (url.startsWith('/?category=') || url.includes('category=')) return 'category';
  if (url.startsWith('/blog/')) return 'blog';
  return 'external';
};

const LinkPicker = ({ value, onChange, label = 'Destination', onValidChange }: { value: string; onChange: (url: string) => void; label?: string; onValidChange?: (valid: boolean) => void }) => {
  const [type, setType] = useState<LinkType>(() => detectType(value || ''));
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const { data: items = [], isLoading } = useLinkData(type, type !== 'external');
  const validity = useLinkValidity(value || '');

  useEffect(() => { onValidChange?.(validity.isValid); }, [validity.isValid]); // eslint-disable-line

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items.slice(0, 30);
    return items.filter((i) => i.label.toLowerCase().includes(s) || (i.sub || '').toLowerCase().includes(s)).slice(0, 30);
  }, [q, items]);

  const current = items.find((i) => i.url === value);

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Link Type</span>
          <select
            value={type}
            onChange={(e) => { setType(e.target.value as LinkType); setOpen(e.target.value !== 'external'); setQ(''); }}
            className="w-full border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-foreground"
          >
            {TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
          {type === 'external' ? (
            <input
              value={value} onChange={(e) => onChange(e.target.value)} placeholder="https://…"
              className="w-full border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-foreground"
            />
          ) : (
            <button type="button" onClick={() => setOpen((o) => !o)}
              className="flex w-full items-center justify-between gap-2 border border-border bg-background px-3 py-2 text-sm hover:border-foreground">
              <span className="truncate">{current ? current.label : (value ? value : 'Select a page…')}</span>
              <ChevronDown size={14} className="shrink-0 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {type !== 'external' && open && (
        <div className="border border-border bg-background">
          <div className="relative border-b border-border">
            <Search size={13} className="absolute left-2 top-2.5 text-muted-foreground" />
            <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…"
              className="w-full bg-transparent pl-7 pr-3 py-2 text-sm focus:outline-none" />
          </div>
          <div className="max-h-60 overflow-auto">
            {isLoading ? (
              <p className="px-3 py-3 text-xs text-muted-foreground">Loading…</p>
            ) : filtered.length === 0 ? (
              <p className="px-3 py-3 text-xs text-muted-foreground">No matches.</p>
            ) : filtered.map((i) => (
              <button key={i.id} type="button" onClick={() => { onChange(i.url); setOpen(false); }}
                className={`flex w-full flex-col items-start gap-0.5 px-3 py-2 text-left hover:bg-secondary ${value === i.url ? 'bg-secondary' : ''}`}>
                <span className="text-sm">{i.label}</span>
                {i.sub && <span className="text-[11px] text-muted-foreground">{i.sub}</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {value && (
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          {value.startsWith('http') ? <ExternalLink size={11} /> : <Link2 size={11} />}
          <span className="truncate">Preview: {value}</span>
        </div>
      )}

      {validity.isMissing && (
        <div className="flex items-center gap-1.5 text-[11px] text-destructive">
          <AlertTriangle size={11} />
          <span className="truncate">Destination no longer exists</span>
        </div>
      )}
    </div>
  );
};

export default LinkPicker;
