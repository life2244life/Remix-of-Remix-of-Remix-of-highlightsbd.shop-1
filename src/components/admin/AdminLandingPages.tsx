import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Plus, Pencil, Copy, Trash2, Eye, ExternalLink, ArrowLeft, Save, Loader2,
  Globe, EyeOff,
} from 'lucide-react';
import { guardLinks } from '@/lib/linkValidation';
import { parseBlocks, slugifyLanding, type LandingBlock, type LandingPage } from '@/lib/landingBlocks';
import BlocksManager, {
  Lbl, TextInput, Area, Sel, ImageField, toLocalInput, fromLocalInput,
} from './BlocksManager';
import { useUnsavedChanges } from '@/hooks/useUnsavedChanges';

const db = () => (supabase as any).from('landing_pages');

const fmtDate = (s: string | null) => (s ? new Date(s).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—');

const StatusBadge = ({ status }: { status: string }) => (
  <span className={`inline-block text-[10px] uppercase tracking-wider px-2 py-0.5 ${status === 'published' ? 'bg-message/15 text-message' : 'bg-secondary text-muted-foreground'}`}>{status}</span>
);

/* ===================== LIST ===================== */
const AdminLandingPages = ({ pageType = 'landing' }: { pageType?: 'landing' | 'campaign' }) => {
  const isCampaign = pageType === 'campaign';
  const noun = isCampaign ? 'Campaign Page' : 'Landing Page';
  const [pages, setPages] = useState<LandingPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<LandingPage | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await db().select('*').eq('page_type', pageType).order('sort_order').order('created_at', { ascending: false });
    if (error) toast.error(error.message);
    setPages(((data as any[]) || []).map((p) => ({ ...p, blocks: parseBlocks(p.blocks) })) as LandingPage[]);
    setLoading(false);
  };
  useEffect(() => { load(); }, [pageType]);

  const createNew = (): LandingPage => ({
    id: '', title: `Untitled ${noun}`, slug: '', blocks: [],
    seo_title: '', meta_description: '', og_image: '',
    meta_keywords: '', canonical_url: '', noindex: false,
    status: 'draft', publish_at: null, expire_at: null, sort_order: pages.length,
    created_at: '', updated_at: '',
  });

  const duplicate = async (p: LandingPage) => {
    let base = `${p.slug || slugifyLanding(p.title)}-copy`;
    const slugs = new Set(pages.map((x) => x.slug));
    let slug = base, i = 2; while (slugs.has(slug)) slug = `${base}-${i++}`;
    const { error } = await db().insert({
      title: `${p.title} (Copy)`, slug, blocks: p.blocks, seo_title: p.seo_title,
      meta_description: p.meta_description, og_image: p.og_image, status: 'draft',
      meta_keywords: p.meta_keywords, canonical_url: p.canonical_url, noindex: p.noindex,
      publish_at: p.publish_at, expire_at: p.expire_at, sort_order: pages.length, page_type: pageType,
    });
    if (error) return toast.error(error.message);
    toast.success('Duplicated'); load();
  };

  const togglePublish = async (p: LandingPage) => {
    const next = p.status === 'published' ? 'draft' : 'published';
    const { error } = await db().update({ status: next }).eq('id', p.id);
    if (error) return toast.error(error.message);
    toast.success(next === 'published' ? 'Published' : 'Unpublished'); load();
  };

  const remove = async (p: LandingPage) => {
    if (!confirm(`Delete "${p.title}"? This cannot be undone.`)) return;
    const { error } = await db().delete().eq('id', p.id);
    if (error) return toast.error(error.message);
    toast.success('Deleted'); load();
  };

  if (editing) {
    return <LandingPageBuilder page={editing} pageType={pageType} existingSlugs={pages.filter((x) => x.id !== editing.id).map((x) => x.slug)} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />;
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-sm font-semibold">{noun}s</h3>
          <p className="text-xs text-muted-foreground">{isCampaign ? 'Build promotional campaign pages (Eid Sale, Black Friday, Flash Sale…) with content blocks.' : 'Build reusable marketing landing pages with content blocks.'}</p>
        </div>
        <button onClick={() => setEditing(createNew())} className="inline-flex items-center gap-1.5 bg-foreground text-background px-4 py-2 text-xs">
          <Plus size={14} /> Create {noun}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
      ) : pages.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-dashed border-border bg-secondary/20 py-20 text-center">
          <h4 className="text-sm font-medium">No {noun.toLowerCase()}s yet</h4>
          <p className="text-xs text-muted-foreground mt-1">Create your first {noun.toLowerCase()} to get started.</p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="px-3 py-2 font-medium">Page Name</th>
                <th className="px-3 py-2 font-medium">Slug</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 font-medium">Publish</th>
                <th className="px-3 py-2 font-medium">Expiry</th>
                <th className="px-3 py-2 font-medium">Updated</th>
                <th className="px-3 py-2 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0 hover:bg-secondary/20">
                  <td className="px-3 py-2 font-medium">{p.title}</td>
                  <td className="px-3 py-2 text-muted-foreground">/lp/{p.slug}</td>
                  <td className="px-3 py-2"><StatusBadge status={p.status} /></td>
                  <td className="px-3 py-2 text-xs text-muted-foreground">{fmtDate(p.publish_at)}</td>
                  <td className="px-3 py-2 text-xs text-muted-foreground">{fmtDate(p.expire_at)}</td>
                  <td className="px-3 py-2 text-xs text-muted-foreground">{fmtDate(p.updated_at)}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center justify-end gap-1">
                      <button title="Edit" onClick={() => setEditing(p)} className="p-1.5 hover:bg-secondary"><Pencil size={14} /></button>
                      <a title="Preview" href={`/lp/${p.slug}`} target="_blank" rel="noreferrer" className="p-1.5 hover:bg-secondary"><Eye size={14} /></a>
                      <button title="Duplicate" onClick={() => duplicate(p)} className="p-1.5 hover:bg-secondary"><Copy size={14} /></button>
                      <button title={p.status === 'published' ? 'Unpublish' : 'Publish'} onClick={() => togglePublish(p)} className="p-1.5 hover:bg-secondary">
                        {p.status === 'published' ? <EyeOff size={14} /> : <Globe size={14} />}
                      </button>
                      <button title="Delete" onClick={() => remove(p)} className="p-1.5 hover:bg-secondary text-destructive"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

/* ===================== BUILDER ===================== */
const LandingPageBuilder = ({ page, pageType = 'landing', existingSlugs, onClose, onSaved }: {
  page: LandingPage; pageType?: 'landing' | 'campaign'; existingSlugs: string[]; onClose: () => void; onSaved: () => void;
}) => {
  const [draft, setDraft] = useState<LandingPage>(page);
  const [saving, setSaving] = useState(false);
  const isDirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(page), [draft, page]);
  const { confirmLeave } = useUnsavedChanges(isDirty);
  const safeClose = () => { if (confirmLeave()) onClose(); };

  const set = (patch: Partial<LandingPage>) => setDraft((d) => ({ ...d, ...patch }));
  const setBlocks = (blocks: LandingBlock[]) => setDraft((d) => ({ ...d, blocks }));

  const save = async () => {
    const title = draft.title.trim();
    if (!title) return toast.error('Page title is required');
    let slug = slugifyLanding(draft.slug || title);
    if (!slug) return toast.error('A valid slug is required');
    if (existingSlugs.includes(slug)) return toast.error('Slug already in use');
    if (!(await guardLinks(draft.blocks, (m) => toast.error(m)))) return;
    setSaving(true);
    const payload = {
      title, slug, blocks: draft.blocks, seo_title: draft.seo_title || null,
      meta_description: draft.meta_description || null, og_image: draft.og_image || null,
      meta_keywords: draft.meta_keywords || null, canonical_url: draft.canonical_url || null,
      noindex: draft.noindex,
      status: draft.status, publish_at: draft.publish_at, expire_at: draft.expire_at,
      sort_order: draft.sort_order, page_type: pageType,
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
          {draft.id && <a href={`/lp/${draft.slug}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 border border-border px-3 py-2 text-xs hover:bg-secondary"><ExternalLink size={13} /> Preview</a>}
          <button onClick={save} disabled={saving} className="inline-flex items-center gap-1.5 bg-foreground text-background px-4 py-2 text-xs disabled:opacity-50">
            {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />} Save
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="border border-border p-4 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wide">Page Settings</h4>
            <div className="space-y-1"><Lbl>Page Title</Lbl><TextInput value={draft.title} onChange={(e) => set({ title: e.target.value })} /></div>
            {!draft.title.trim() && <p className="text-[10px] text-destructive">Page title is required.</p>}
            <div className="space-y-1">
              <Lbl>URL Slug</Lbl>
              <TextInput value={draft.slug} placeholder={slugifyLanding(draft.title)} onChange={(e) => set({ slug: e.target.value })} />
              <p className="text-[10px] text-muted-foreground">/lp/{slugifyLanding(draft.slug || draft.title) || '…'}</p>
              {existingSlugs.includes(slugifyLanding(draft.slug || draft.title)) && <p className="text-[10px] text-destructive">This slug is already in use.</p>}
            </div>
            <div className="space-y-1"><Lbl>Status</Lbl>
              <Sel value={draft.status} onChange={(v) => set({ status: v as any })} options={[{ value: 'draft', label: 'Draft' }, { value: 'published', label: 'Published' }]} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1"><Lbl>Publish Date</Lbl><TextInput type="datetime-local" value={toLocalInput(draft.publish_at)} onChange={(e) => set({ publish_at: fromLocalInput(e.target.value) })} /></div>
              <div className="space-y-1"><Lbl>Expiry Date</Lbl><TextInput type="datetime-local" value={toLocalInput(draft.expire_at)} onChange={(e) => set({ expire_at: fromLocalInput(e.target.value) })} /></div>
            </div>
          </div>
          <div className="border border-border p-4 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wide">SEO</h4>
            <div className="space-y-1"><Lbl>SEO Title</Lbl><TextInput value={draft.seo_title || ''} onChange={(e) => set({ seo_title: e.target.value })} /></div>
            <div className="space-y-1"><Lbl>Meta Description</Lbl><Area rows={3} value={draft.meta_description || ''} onChange={(e) => set({ meta_description: e.target.value })} /></div>
            <div className="space-y-1"><Lbl>Meta Keywords</Lbl><TextInput value={draft.meta_keywords || ''} onChange={(e) => set({ meta_keywords: e.target.value })} placeholder="comma, separated, keywords" /></div>
            <div className="space-y-1"><Lbl>Canonical URL</Lbl><TextInput value={draft.canonical_url || ''} onChange={(e) => set({ canonical_url: e.target.value })} placeholder={`/lp/${slugifyLanding(draft.slug || draft.title) || 'slug'}`} /></div>
            <div className="space-y-1"><Lbl>Open Graph Image</Lbl><ImageField value={draft.og_image || ''} onChange={(url) => set({ og_image: url })} /></div>
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              <input type="checkbox" checked={draft.noindex} onChange={(e) => set({ noindex: e.target.checked })} /> No Index (hide from search engines)
            </label>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-3">
          <BlocksManager blocks={draft.blocks} onChange={setBlocks} />
        </div>
      </div>
    </div>
  );
};

export default AdminLandingPages;
