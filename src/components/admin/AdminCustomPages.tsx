import { useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { uploadImage } from '@/lib/upload';
import { toast } from 'sonner';
import {
  Plus, Pencil, Trash2, ExternalLink, Copy, Check, Search, Upload,
  ArrowLeft, Save, Loader2, Globe, EyeOff, Eye, FileText,
} from 'lucide-react';
import { useProducts } from '@/hooks/useSupabase';
import { guardLinks } from '@/lib/linkValidation';
import { parseBlocks, slugifyLanding, type LandingBlock } from '@/lib/landingBlocks';
import BlocksManager, { Lbl, TextInput, Area, ImageField } from './BlocksManager';
import { useUnsavedChanges } from '@/hooks/useUnsavedChanges';

type Page = {
  id: string;
  slug: string;
  title: string;
  banner_url: string;
  sort_order: number;
  is_active: boolean;
  product_ids: string[];
  blocks: LandingBlock[];
  seo_title: string | null;
  seo_description: string | null;
  og_image: string | null;
  meta_keywords: string | null;
  canonical_url: string | null;
  noindex: boolean;
};

const db = () => supabase.from('custom_pages') as any;

const normalize = (p: any): Page => ({
  id: p.id,
  slug: p.slug,
  title: p.title || '',
  banner_url: p.banner_url || '',
  sort_order: p.sort_order || 0,
  is_active: p.is_active !== false,
  product_ids: p.product_ids || [],
  blocks: parseBlocks(p.blocks),
  seo_title: p.seo_title || '',
  seo_description: p.seo_description || '',
  og_image: p.og_image || '',
  meta_keywords: p.meta_keywords || '',
  canonical_url: p.canonical_url || '',
  noindex: !!p.noindex,
});

/* ===================== LIST ===================== */
const AdminCustomPages = () => {
  const [items, setItems] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Page | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await db().select('*').order('sort_order');
    if (error) toast.error(error.message);
    setItems(((data as any[]) || []).map(normalize));
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const createNew = (): Page => ({
    id: '', slug: '', title: '', banner_url: '', sort_order: items.length,
    is_active: true, product_ids: [], blocks: [],
    seo_title: '', seo_description: '', og_image: '', meta_keywords: '', canonical_url: '', noindex: false,
  });

  const duplicate = async (p: Page) => {
    let base = `${p.slug || slugifyLanding(p.title)}-copy`;
    const slugs = new Set(items.map((x) => x.slug));
    let slug = base, i = 2; while (slugs.has(slug)) slug = `${base}-${i++}`;
    const { error } = await db().insert({
      title: `${p.title} (Copy)`, slug, banner_url: p.banner_url, sort_order: items.length,
      is_active: false, product_ids: p.product_ids, blocks: p.blocks,
      seo_title: p.seo_title, seo_description: p.seo_description, og_image: p.og_image,
      meta_keywords: p.meta_keywords, canonical_url: p.canonical_url, noindex: p.noindex,
    });
    if (error) return toast.error(error.message);
    toast.success('Duplicated'); load();
  };

  const togglePublish = async (p: Page) => {
    const { error } = await db().update({ is_active: !p.is_active }).eq('id', p.id);
    if (error) return toast.error(error.message);
    toast.success(p.is_active ? 'Unpublished' : 'Published'); load();
  };

  const remove = async (p: Page) => {
    if (!confirm(`Delete "${p.title || p.slug}"? This cannot be undone.`)) return;
    const { error } = await db().delete().eq('id', p.id);
    if (error) return toast.error(error.message);
    toast.success('Deleted'); load();
  };

  const copyLink = (slug: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/page/${slug}`);
    toast.success('Link copied');
  };

  if (editing) {
    return <PageBuilder page={editing} existingSlugs={items.filter((x) => x.id !== editing.id).map((x) => x.slug)} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />;
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-sm font-semibold flex items-center gap-2"><FileText size={16} /> Static Pages</h3>
          <p className="text-xs text-muted-foreground">Build content pages (About, Policies, FAQ…) with content blocks. URL: <code>/page/your-slug</code></p>
        </div>
        <button onClick={() => setEditing(createNew())} className="inline-flex items-center gap-1.5 bg-foreground text-background px-4 py-2 text-xs">
          <Plus size={14} /> Create Page
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-dashed border-border bg-secondary/20 py-20 text-center">
          <h4 className="text-sm font-medium">No static pages yet</h4>
          <p className="text-xs text-muted-foreground mt-1">Create your first page to get started.</p>
        </div>
      ) : (
        <div className="border border-border divide-y divide-border">
          {items.map((p) => (
            <div key={p.id} className="flex items-center gap-3 p-3">
              {p.banner_url
                ? <img src={p.banner_url} alt={p.slug} className="w-20 h-14 object-cover border border-border" />
                : <div className="w-20 h-14 border border-border bg-secondary/30 flex items-center justify-center"><FileText size={16} className="text-muted-foreground" /></div>}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{p.title || p.slug}</p>
                <p className="text-[11px] text-muted-foreground truncate">/page/{p.slug} · {p.is_active ? 'Published' : 'Draft'} · {p.blocks.length} blocks · {(p.product_ids || []).length} products</p>
              </div>
              <div className="flex gap-1">
                <button title="Copy link" onClick={() => copyLink(p.slug)} className="p-1.5 hover:bg-secondary"><Copy size={14} /></button>
                <a title="Preview" href={`/page/${p.slug}`} target="_blank" rel="noreferrer" className="p-1.5 hover:bg-secondary"><Eye size={14} /></a>
                <button title={p.is_active ? 'Unpublish' : 'Publish'} onClick={() => togglePublish(p)} className="p-1.5 hover:bg-secondary">
                  {p.is_active ? <EyeOff size={14} /> : <Globe size={14} />}
                </button>
                <button title="Duplicate" onClick={() => duplicate(p)} className="p-1.5 hover:bg-secondary"><Copy size={14} /></button>
                <button title="Edit" onClick={() => setEditing(p)} className="p-1.5 hover:bg-secondary"><Pencil size={14} /></button>
                <button title="Delete" onClick={() => remove(p)} className="p-1.5 hover:bg-secondary text-destructive"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ===================== BUILDER ===================== */
const PageBuilder = ({ page, existingSlugs, onClose, onSaved }: {
  page: Page; existingSlugs: string[]; onClose: () => void; onSaved: () => void;
}) => {
  const [draft, setDraft] = useState<Page>(page);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const { data: products = [] } = useProducts();
  const isDirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(page), [draft, page]);
  const { confirmLeave } = useUnsavedChanges(isDirty);
  const safeClose = () => { if (confirmLeave()) onClose(); };

  const set = (patch: Partial<Page>) => setDraft((d) => ({ ...d, ...patch }));

  const handleUpload = async (file: File) => {
    setUploading(true);
    try { set({ banner_url: await uploadImage(file, 'custom-pages') }); toast.success('Banner uploaded'); }
    catch (e: any) { toast.error(e.message || 'Upload failed'); }
    setUploading(false);
  };

  const toggleProduct = (id: string) =>
    set({ product_ids: draft.product_ids.includes(id) ? draft.product_ids.filter((x) => x !== id) : [...draft.product_ids, id] });

  const filteredProducts = productSearch
    ? products.filter((p: any) => p.name.toLowerCase().includes(productSearch.toLowerCase()))
    : products;

  const save = async () => {
    const title = draft.title.trim();
    if (!title) return toast.error('Page title is required');
    const slug = slugifyLanding(draft.slug || title);
    if (!slug) return toast.error('A valid slug is required');
    if (existingSlugs.includes(slug)) return toast.error('Slug already in use');
    if (!(await guardLinks(draft.blocks, (m) => toast.error(m)))) return;
    setSaving(true);
    const payload = {
      slug, title, banner_url: draft.banner_url, sort_order: draft.sort_order,
      is_active: draft.is_active, product_ids: draft.product_ids, blocks: draft.blocks,
      seo_title: draft.seo_title || null, seo_description: draft.seo_description || null,
      og_image: draft.og_image || null, meta_keywords: draft.meta_keywords || null,
      canonical_url: draft.canonical_url || null, noindex: draft.noindex,
    };
    const res = draft.id ? await db().update(payload).eq('id', draft.id) : await db().insert(payload);
    setSaving(false);
    if (res.error) return toast.error(res.error.message);
    toast.success('Saved ✓'); onSaved();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap border-b border-border pb-3">
        <button onClick={safeClose} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft size={16} /> Back to list
        </button>
        <div className="flex items-center gap-2">
          {isDirty && <span className="text-[11px] text-amber-600">● Unsaved changes</span>}
          {draft.id && <a href={`/page/${draft.slug}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 border border-border px-3 py-2 text-xs hover:bg-secondary"><ExternalLink size={13} /> Preview</a>}
          <button onClick={save} disabled={saving} className="inline-flex items-center gap-1.5 bg-foreground text-background px-4 py-2 text-xs disabled:opacity-50">
            {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />} Save
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="border border-border p-4 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wide">Page Settings</h4>
            <div className="space-y-1"><Lbl>Page Title</Lbl><TextInput value={draft.title} onChange={(e) => set({ title: e.target.value })} placeholder="e.g. About Us" /></div>
            {!draft.title.trim() && <p className="text-[10px] text-destructive">Page title is required.</p>}
            <div className="space-y-1">
              <Lbl>URL Slug</Lbl>
              <TextInput value={draft.slug} placeholder={slugifyLanding(draft.title)} onChange={(e) => set({ slug: e.target.value })} />
              <p className="text-[10px] text-muted-foreground">/page/{slugifyLanding(draft.slug || draft.title) || '…'}</p>
              {existingSlugs.includes(slugifyLanding(draft.slug || draft.title)) && <p className="text-[10px] text-destructive">This slug is already in use.</p>}
            </div>
            <div className="grid grid-cols-2 gap-2 items-end">
              <div className="space-y-1"><Lbl>Sort Order</Lbl><TextInput type="number" value={draft.sort_order} onChange={(e) => set({ sort_order: Number(e.target.value) || 0 })} /></div>
              <label className="flex items-center gap-2 text-xs pb-2">
                <input type="checkbox" checked={draft.is_active} onChange={(e) => set({ is_active: e.target.checked })} /> Published
              </label>
            </div>
            <div className="space-y-1">
              <Lbl>Banner (optional)</Lbl>
              {draft.banner_url && <div className="mb-2 border border-border p-2 inline-block"><img src={draft.banner_url} alt="banner" className="max-h-32 w-auto" /></div>}
              <input ref={fileRef} type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} className="hidden" />
              <div className="flex gap-2">
                <button onClick={() => fileRef.current?.click()} disabled={uploading} className="inline-flex items-center gap-1.5 border border-border px-3 py-1.5 text-xs hover:bg-secondary disabled:opacity-50">
                  <Upload size={12} /> {uploading ? 'Uploading…' : (draft.banner_url ? 'Replace' : 'Upload')}
                </button>
                {draft.banner_url && <button onClick={() => set({ banner_url: '' })} className="text-[11px] text-destructive">Remove</button>}
              </div>
            </div>
          </div>

          <div className="border border-border p-4 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wide">SEO</h4>
            <div className="space-y-1"><Lbl>SEO Title</Lbl><TextInput value={draft.seo_title || ''} onChange={(e) => set({ seo_title: e.target.value })} /></div>
            <div className="space-y-1"><Lbl>Meta Description</Lbl><Area rows={3} value={draft.seo_description || ''} onChange={(e) => set({ seo_description: e.target.value })} /></div>
            <div className="space-y-1"><Lbl>Meta Keywords</Lbl><TextInput value={draft.meta_keywords || ''} onChange={(e) => set({ meta_keywords: e.target.value })} placeholder="comma, separated, keywords" /></div>
            <div className="space-y-1"><Lbl>Canonical URL</Lbl><TextInput value={draft.canonical_url || ''} onChange={(e) => set({ canonical_url: e.target.value })} placeholder={`/page/${slugifyLanding(draft.slug || draft.title) || 'slug'}`} /></div>
            <div className="space-y-1"><Lbl>Open Graph Image</Lbl><ImageField value={draft.og_image || ''} onChange={(url) => set({ og_image: url })} /></div>
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              <input type="checkbox" checked={draft.noindex} onChange={(e) => set({ noindex: e.target.checked })} /> No Index (hide from search engines)
            </label>
          </div>

          <div className="border border-border p-4 space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wide">Products ({draft.product_ids.length})</h4>
            <p className="text-[10px] text-muted-foreground">Optional grid shown below the blocks.</p>
            <div className="relative">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <TextInput value={productSearch} onChange={(e) => setProductSearch(e.target.value)} placeholder="Search products…" className="pl-8 text-xs" />
            </div>
            <div className="border border-border max-h-56 overflow-auto">
              {filteredProducts.length === 0 && <p className="p-3 text-xs text-muted-foreground">No products</p>}
              {filteredProducts.map((p: any) => {
                const selected = draft.product_ids.includes(p.id);
                return (
                  <button key={p.id} type="button" onClick={() => toggleProduct(p.id)}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-left text-xs border-b border-border last:border-0 hover:bg-muted/30 ${selected ? 'bg-primary/5' : ''}`}>
                    <div className={`w-4 h-4 border flex items-center justify-center ${selected ? 'bg-primary border-primary' : 'border-border'}`}>
                      {selected && <Check size={10} className="text-primary-foreground" />}
                    </div>
                    {p.image_url && <img src={p.image_url} alt="" className="w-8 h-10 object-cover" />}
                    <span className="flex-1 truncate">{p.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-3">
          <BlocksManager blocks={draft.blocks} onChange={(blocks) => set({ blocks })} />
        </div>
      </div>
    </div>
  );
};

export default AdminCustomPages;
