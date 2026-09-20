import { useState, useEffect } from 'react';
import {
  useHomepageSections, useCreateHomepageSection, useDeleteHomepageSection,
  useUpdateHomepageSectionConfig, useSaveHomepageSections, type HomepageSection,
} from '@/hooks/useSupabase';
import {
  Plus, Trash2, Copy, Save, Loader2, Eye, EyeOff, ChevronDown, ChevronUp, Info,
  Image as ImageIcon, LayoutGrid, FileText,
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import BlockImageUpload from './BlockImageUpload';
import LinkPicker from './LinkPicker';
import { guardLinks } from '@/lib/linkValidation';
import {
  BANNER_LAYOUTS, bannerLayoutMeta, makeBannerItem, parseBannerConfig,
  defaultBannerConfig, makePosterItem, parsePosterConfig, defaultPosterConfig,
  CUSTOM_BLOCK_TYPES, makeCustomItem, parseCustomConfig, defaultCustomConfig,
  TRUST_ICON_OPTIONS, uid,
  type BannerLayout, type CustomBlockType, type Align,
} from '@/lib/homepageBlocks';

/* ---------- small inputs ---------- */
const Txt = ({ label, value, onChange, placeholder, area }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; area?: boolean }) => (
  <div>
    <label className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">{label}</label>
    {area
      ? <textarea value={value} onChange={(e) => onChange(e.target.value)} className="luxury-input text-xs w-full min-h-[64px]" placeholder={placeholder} />
      : <input value={value} onChange={(e) => onChange(e.target.value)} className="luxury-input text-xs w-full" placeholder={placeholder} />}
  </div>
);

const AlignSelect = ({ value, onChange }: { value: Align; onChange: (v: Align) => void }) => (
  <div>
    <label className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">Text Alignment</label>
    <select value={value} onChange={(e) => onChange(e.target.value as Align)} className="luxury-input text-xs w-full">
      <option value="left">Left</option><option value="center">Center</option><option value="right">Right</option>
    </select>
  </div>
);

const Schedule = ({ cfg, set }: { cfg: any; set: (k: string, v: any) => void }) => (
  <div className="grid grid-cols-2 gap-3">
    <div>
      <label className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">Publish Date</label>
      <input type="datetime-local" value={cfg.publishAt || ''} onChange={(e) => set('publishAt', e.target.value)} className="luxury-input text-xs w-full" />
    </div>
    <div>
      <label className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">Expiry Date</label>
      <input type="datetime-local" value={cfg.expireAt || ''} onChange={(e) => set('expireAt', e.target.value)} className="luxury-input text-xs w-full" />
    </div>
  </div>
);

/* ---------- Banner editor ---------- */
const BannerEditor = ({ initial, onChange }: { initial: any; onChange: (c: any) => void }) => {
  const [cfg, setCfg] = useState(() => parseBannerConfig(initial));
  useEffect(() => { onChange(cfg); }, [cfg]); // eslint-disable-line
  const set = (k: string, v: any) => setCfg((p: any) => ({ ...p, [k]: v }));
  const setItem = (i: number, k: string, v: any) => setCfg((p: any) => ({ ...p, items: p.items.map((it: any, idx: number) => idx === i ? { ...it, [k]: v } : it) }));
  const meta = bannerLayoutMeta(cfg.layout);
  return (
    <div className="space-y-4">
      <div>
        <label className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">Banner Type</label>
        <select value={cfg.layout} onChange={(e) => setCfg(defaultBannerConfig(e.target.value as BannerLayout))} className="luxury-input text-xs w-full">
          {BANNER_LAYOUTS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
        </select>
        <p className="text-[10px] text-muted-foreground mt-1">Recommended: <strong>{meta.rec}</strong> • Max 10MB • {meta.cols} item(s) per row</p>
      </div>
      <Schedule cfg={cfg} set={set} />
      <div className="space-y-3">
        {cfg.items.map((item: any, i: number) => (
          <div key={item.id} className="border border-border p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Item {i + 1}</span>
              {cfg.items.length > 1 && <button onClick={() => set('items', cfg.items.filter((_: any, x: number) => x !== i))} className="text-destructive"><Trash2 size={13} /></button>}
            </div>
            <div className="flex flex-wrap gap-4">
              <BlockImageUpload label="Desktop Image" value={item.desktopImage} onChange={(u) => setItem(i, 'desktopImage', u)} aspectRatio={meta.ratio} width={200} folder="homepage/banner-desktop" />
              <BlockImageUpload label="Mobile Image" value={item.mobileImage} onChange={(u) => setItem(i, 'mobileImage', u)} aspectRatio={4 / 5} width={100} folder="homepage/banner-mobile" />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <Txt label="Title" value={item.title} onChange={(v) => setItem(i, 'title', v)} />
              <Txt label="Subtitle" value={item.subtitle} onChange={(v) => setItem(i, 'subtitle', v)} />
              <Txt label="Button Text" value={item.buttonText} onChange={(v) => setItem(i, 'buttonText', v)} />
              <div className="sm:col-span-2"><LinkPicker label="Button URL" value={item.buttonUrl} onChange={(v) => setItem(i, 'buttonUrl', v)} /></div>
            </div>
            <Txt label="Description" value={item.description} onChange={(v) => setItem(i, 'description', v)} area />
            <div className="grid grid-cols-3 gap-3 items-end">
              <AlignSelect value={item.align} onChange={(v) => setItem(i, 'align', v)} />
              <div>
                <label className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">Overlay {item.overlay}%</label>
                <input type="range" min={0} max={100} value={item.overlay} onChange={(e) => setItem(i, 'overlay', Number(e.target.value))} className="w-full" />
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">Text Color</label>
                <input type="color" value={item.textColor} onChange={(e) => setItem(i, 'textColor', e.target.value)} className="h-9 w-full" />
              </div>
            </div>
          </div>
        ))}
        <button onClick={() => set('items', [...cfg.items, makeBannerItem()])} className="text-[10px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1"><Plus size={11} /> Add item</button>
      </div>
    </div>
  );
};

/* ---------- Poster editor ---------- */
const PosterEditor = ({ initial, onChange }: { initial: any; onChange: (c: any) => void }) => {
  const [cfg, setCfg] = useState(() => parsePosterConfig(initial));
  useEffect(() => { onChange(cfg); }, [cfg]); // eslint-disable-line
  const set = (k: string, v: any) => setCfg((p: any) => ({ ...p, [k]: v }));
  const setItem = (i: number, k: string, v: any) => setCfg((p: any) => ({ ...p, items: p.items.map((it: any, idx: number) => idx === i ? { ...it, [k]: v } : it) }));
  const dup = (i: number) => setCfg((p: any) => ({ ...p, items: [...p.items.slice(0, i + 1), { ...p.items[i], id: uid('poster') }, ...p.items.slice(i + 1)] }));
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">Columns</label>
          <select value={cfg.columns} onChange={(e) => set('columns', Number(e.target.value))} className="luxury-input text-xs w-full">
            <option value={2}>2</option><option value={3}>3</option><option value={4}>4</option>
          </select>
        </div>
      </div>
      <p className="text-[10px] text-muted-foreground">Recommended poster: <strong>800×1000px (4:5)</strong> • Max 10MB</p>
      <Schedule cfg={cfg} set={set} />
      <div className="grid sm:grid-cols-2 gap-3">
        {cfg.items.map((item: any, i: number) => (
          <div key={item.id} className="border border-border p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Poster {i + 1}</span>
              <div className="flex gap-2">
                <button onClick={() => dup(i)} className="text-muted-foreground hover:text-foreground" title="Duplicate"><Copy size={13} /></button>
                <button onClick={() => set('items', cfg.items.filter((_: any, x: number) => x !== i))} className="text-destructive"><Trash2 size={13} /></button>
              </div>
            </div>
            <BlockImageUpload label="Image (4:5)" value={item.image} onChange={(u) => setItem(i, 'image', u)} aspectRatio={4 / 5} width={120} folder="homepage/poster" />
            <Txt label="Badge Text" value={item.badge} onChange={(v) => setItem(i, 'badge', v)} />
            <Txt label="Title" value={item.title} onChange={(v) => setItem(i, 'title', v)} />
            <Txt label="Subtitle" value={item.subtitle} onChange={(v) => setItem(i, 'subtitle', v)} />
            <div className="grid grid-cols-2 gap-2">
              <Txt label="Button Text" value={item.buttonText} onChange={(v) => setItem(i, 'buttonText', v)} />
              <div className="col-span-2"><LinkPicker label="Button URL" value={item.buttonUrl} onChange={(v) => setItem(i, 'buttonUrl', v)} /></div>
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">Countdown To (optional)</label>
              <input type="datetime-local" value={item.countdownTo || ''} onChange={(e) => setItem(i, 'countdownTo', e.target.value)} className="luxury-input text-xs w-full" />
            </div>
          </div>
        ))}
      </div>
      <button onClick={() => set('items', [...cfg.items, makePosterItem()])} className="text-[10px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1"><Plus size={11} /> Add poster</button>
    </div>
  );
};

/* ---------- Custom block editor ---------- */
const NEEDS_ITEMS: CustomBlockType[] = ['benefits', 'trust_icons', 'faq', 'testimonials', 'featured_brands'];
const CustomEditor = ({ initial, onChange }: { initial: any; onChange: (c: any) => void }) => {
  const [cfg, setCfg] = useState(() => parseCustomConfig(initial));
  useEffect(() => { onChange(cfg); }, [cfg]); // eslint-disable-line
  const set = (k: string, v: any) => setCfg((p: any) => ({ ...p, [k]: v }));
  const setItem = (i: number, k: string, v: any) => setCfg((p: any) => ({ ...p, items: p.items.map((it: any, idx: number) => idx === i ? { ...it, [k]: v } : it) }));
  const bt = cfg.blockType as CustomBlockType;
  const showItems = NEEDS_ITEMS.includes(bt);
  const showImage = ['image_text', 'brand_story', 'custom'].includes(bt);
  const showVideo = bt === 'video';
  const showBody = ['text_only', 'image_text', 'brand_story', 'button', 'custom'].includes(bt);
  const showIcon = bt === 'benefits' || bt === 'trust_icons';
  const showItemImage = bt === 'featured_brands' || bt === 'testimonials';
  return (
    <div className="space-y-4">
      <div>
        <label className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">Block Type</label>
        <select value={bt} onChange={(e) => setCfg(defaultCustomConfig(e.target.value as CustomBlockType))} className="luxury-input text-xs w-full">
          {CUSTOM_BLOCK_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </div>
      <Schedule cfg={cfg} set={set} />
      <div className="grid sm:grid-cols-2 gap-3">
        <Txt label="Heading" value={cfg.heading} onChange={(v) => set('heading', v)} />
        <Txt label="Subheading" value={cfg.subheading} onChange={(v) => set('subheading', v)} />
      </div>
      {showBody && <Txt label="Body Text" value={cfg.body} onChange={(v) => set('body', v)} area />}
      {showImage && <BlockImageUpload label="Image" value={cfg.image} onChange={(u) => set('image', u)} aspectRatio={4 / 3} width={220} folder="homepage/custom" />}
      {showVideo && <Txt label="Video Embed URL" value={cfg.mediaUrl} onChange={(v) => set('mediaUrl', v)} placeholder="https://www.youtube.com/embed/..." />}
      <div className="grid grid-cols-2 gap-3 items-end">
        <AlignSelect value={cfg.align} onChange={(v) => set('align', v)} />
        <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={cfg.bgTint} onChange={(e) => set('bgTint', e.target.checked)} /> Soft background</label>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Txt label="Button Text" value={cfg.buttonText} onChange={(v) => set('buttonText', v)} />
        <div className="col-span-2"><LinkPicker label="Button URL" value={cfg.buttonUrl} onChange={(v) => set('buttonUrl', v)} /></div>
      </div>
      {showItems && (
        <div className="space-y-2">
          <p className="text-[11px] font-medium text-muted-foreground">Items</p>
          {cfg.items.map((it: any, i: number) => (
            <div key={it.id} className="border border-border p-2 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">#{i + 1}</span>
                <button onClick={() => set('items', cfg.items.filter((_: any, x: number) => x !== i))} className="text-destructive"><Trash2 size={12} /></button>
              </div>
              <div className="flex flex-wrap gap-2 items-end">
                {showIcon && (
                  <div>
                    <label className="text-[10px] text-muted-foreground uppercase block mb-1">Icon</label>
                    <select value={it.icon} onChange={(e) => setItem(i, 'icon', e.target.value)} className="luxury-input text-xs w-24">
                      {TRUST_ICON_OPTIONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
                    </select>
                  </div>
                )}
                {showItemImage && <BlockImageUpload label={bt === 'featured_brands' ? 'Logo' : 'Avatar'} value={it.image} onChange={(u) => setItem(i, 'image', u)} aspectRatio={bt === 'featured_brands' ? 3 / 2 : 1} width={80} folder="homepage/custom-item" maxMB={5} />}
                <div className="flex-1 min-w-[140px] space-y-2">
                  <Txt label={bt === 'faq' ? 'Question' : bt === 'testimonials' ? 'Author' : 'Title'} value={it.title} onChange={(v) => setItem(i, 'title', v)} />
                  {bt !== 'featured_brands' && <Txt label={bt === 'faq' ? 'Answer' : 'Text'} value={it.text} onChange={(v) => setItem(i, 'text', v)} area />}
                  {bt === 'featured_brands' && <LinkPicker label="URL" value={it.url} onChange={(v) => setItem(i, 'url', v)} />}
                </div>
              </div>
            </div>
          ))}
          <button onClick={() => set('items', [...cfg.items, makeCustomItem()])} className="text-[10px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1"><Plus size={11} /> Add item</button>
        </div>
      )}
    </div>
  );
};

/* ---------- main ---------- */
export interface BuilderFilter {
  banner?: boolean;
  poster?: boolean;
  customTypes?: CustomBlockType[]; // which custom_block subtypes to show / allow adding
}

const CUSTOM_LABEL = (t: CustomBlockType): string =>
  CUSTOM_BLOCK_TYPES.find((c) => c.value === t)?.label || 'Custom Block';

const AdminHomepageBuilder = ({ filter, hideInfo }: { filter?: BuilderFilter; hideInfo?: boolean } = {}) => {
  const { data: sections = [], isLoading } = useHomepageSections(true);
  const create = useCreateHomepageSection();
  const del = useDeleteHomepageSection();
  const updateConfig = useUpdateHomepageSectionConfig();
  const save = useSaveHomepageSections();

  const [expanded, setExpanded] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, any>>({});
  const [titles, setTitles] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  const blocks = sections.filter((s) => {
    if (!['banner', 'poster', 'custom_block'].includes(s.type)) return false;
    if (!filter) return true;
    if (s.type === 'banner') return !!filter.banner;
    if (s.type === 'poster') return !!filter.poster;
    const bt = ((s.config as any)?.blockType || 'image_text') as CustomBlockType;
    return !!filter.customTypes?.includes(bt);
  });

  const maxOrder = sections.reduce((m, s) => Math.max(m, s.sort_order), 0);

  const addBlock = async (type: 'banner' | 'poster' | 'custom_block', title: string, config: any) => {
    const section_key = `${type}-${uid()}`;
    try {
      await create.mutateAsync({ section_key, title, type, config, sort_order: maxOrder + 1 });
      toast.success(`${title} added ✓`);
    } catch (e: any) { toast.error(e.message || 'Failed to add'); }
  };

  const saveBlock = async (s: HomepageSection) => {
    setSavingId(s.id);
    try {
      const title = titles[s.id] ?? s.title;
      const config = drafts[s.id] ?? s.config;
      if (!(await guardLinks(config, (m) => toast.error(m)))) { setSavingId(null); return; }
      const { error } = await (supabase.from('homepage_sections') as any)
        .update({ title, config, updated_at: new Date().toISOString() })
        .eq('id', s.id);
      if (error) throw error;
      await updateConfig.mutateAsync({ section_key: s.section_key, config });
      toast.success('Saved ✓');
    } catch (e: any) { toast.error(e.message || 'Failed to save'); }
    finally { setSavingId(null); }
  };

  const toggle = async (s: HomepageSection) => {
    try {
      await save.mutateAsync([{ id: s.id, enabled: !s.enabled, sort_order: s.sort_order }]);
    } catch (e: any) { toast.error(e.message); }
  };

  const duplicate = async (s: HomepageSection) => {
    await addBlock(s.type as any, `${s.title} (copy)`, s.config);
  };

  const remove = async (s: HomepageSection) => {
    if (!confirm(`Delete "${s.title}"?`)) return;
    try { await del.mutateAsync(s.id); toast.success('Deleted'); } catch (e: any) { toast.error(e.message); }
  };

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-6">
      {!hideInfo && (
      <div className="border border-border bg-secondary/20 p-3 flex items-start gap-2">
        <Info size={14} className="text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-[11px] text-muted-foreground">
          Create unlimited banners, posters and custom content blocks. Each appears in <strong>Homepage Sections</strong> where you can drag it anywhere, enable/disable and reorder. Use scheduling to auto show/hide.
        </p>
      </div>
      )}

      <div className="flex flex-wrap gap-2">
        {(!filter || filter.banner) && (
          <button onClick={() => addBlock('banner', 'New Banner', defaultBannerConfig('full_width'))} className="luxury-button-outline text-[10px] inline-flex items-center gap-1.5"><ImageIcon size={12} /> Add Banner</button>
        )}
        {(!filter || filter.poster) && (
          <button onClick={() => addBlock('poster', 'New Posters', defaultPosterConfig())} className="luxury-button-outline text-[10px] inline-flex items-center gap-1.5"><LayoutGrid size={12} /> Add Poster Block</button>
        )}
        {!filter && (
          <button onClick={() => addBlock('custom_block', 'New Content Block', defaultCustomConfig('image_text'))} className="luxury-button-outline text-[10px] inline-flex items-center gap-1.5"><FileText size={12} /> Add Custom Block</button>
        )}
        {filter?.customTypes?.map((t) => (
          <button key={t} onClick={() => addBlock('custom_block', `New ${CUSTOM_LABEL(t)}`, defaultCustomConfig(t))} className="luxury-button-outline text-[10px] inline-flex items-center gap-1.5"><FileText size={12} /> Add {CUSTOM_LABEL(t)}</button>
        ))}
      </div>

      {blocks.length === 0 && <p className="text-xs text-muted-foreground py-6 text-center">No banners or content blocks yet. Add one above.</p>}

      <div className="space-y-3">
        {blocks.map((s) => (
          <div key={s.id} className={`border border-border ${!s.enabled ? 'opacity-60' : ''}`}>
            <div className="flex items-center gap-3 px-3 py-2.5">
              <span className="text-[9px] uppercase tracking-wider bg-muted px-2 py-0.5 rounded shrink-0">{s.type === 'custom_block' ? 'Custom' : s.type}</span>
              <input
                value={titles[s.id] ?? s.title}
                onChange={(e) => setTitles((t) => ({ ...t, [s.id]: e.target.value }))}
                className="luxury-input text-xs flex-1 min-w-0"
              />
              <button onClick={() => toggle(s)} title={s.enabled ? 'Visible' : 'Hidden'} className="text-muted-foreground hover:text-foreground">{s.enabled ? <Eye size={15} /> : <EyeOff size={15} />}</button>
              <button onClick={() => duplicate(s)} title="Duplicate" className="text-muted-foreground hover:text-foreground"><Copy size={14} /></button>
              <button onClick={() => remove(s)} title="Delete" className="text-destructive"><Trash2 size={14} /></button>
              <button onClick={() => setExpanded(expanded === s.id ? null : s.id)} className="text-muted-foreground hover:text-foreground">{expanded === s.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</button>
            </div>
            {expanded === s.id && (
              <div className="border-t border-border p-4 space-y-4">
                {s.type === 'banner' && <BannerEditor initial={s.config} onChange={(c) => setDrafts((d) => ({ ...d, [s.id]: c }))} />}
                {s.type === 'poster' && <PosterEditor initial={s.config} onChange={(c) => setDrafts((d) => ({ ...d, [s.id]: c }))} />}
                {s.type === 'custom_block' && <CustomEditor initial={s.config} onChange={(c) => setDrafts((d) => ({ ...d, [s.id]: c }))} />}
                <button onClick={() => saveBlock(s)} disabled={savingId === s.id} className="luxury-button-primary text-[10px] inline-flex items-center gap-1.5">
                  {savingId === s.id ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />} Save Block
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminHomepageBuilder;