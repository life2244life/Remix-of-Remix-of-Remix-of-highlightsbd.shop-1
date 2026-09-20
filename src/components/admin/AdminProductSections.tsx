import { useEffect, useMemo, useState } from 'react';
import {
  useHomepageSections, useUpdateHomepageSectionConfig, useSaveHomepageSections,
  useCreateHomepageSection, useDeleteHomepageSection, useProducts, type HomepageSection,
} from '@/hooks/useSupabase';
import {
  ProductSectionConfig, parseProductSectionConfig, defaultProductSectionConfig,
  AUTO_MODE_LABELS, AutoMode, PRODUCT_COUNTS, CardSettings,
} from '@/lib/productSections';
import { Product } from '@/data/products';
import { slugify } from '@/data/products';
import {
  Save, Loader2, Eye, EyeOff, ChevronDown, ChevronUp, Plus, Trash2,
  Search, X, ArrowUp, ArrowDown, Info,
} from 'lucide-react';
import { toast } from 'sonner';
import LinkPicker from './LinkPicker';
import { guardLinks } from '@/lib/linkValidation';

const PRODUCT_TYPES = new Set(['flash_sale', 'product_grid', 'product_slider', 'collection', 'product']);

const CARD_FIELDS: { key: keyof CardSettings; label: string }[] = [
  { key: 'discountBadge', label: 'Discount Badge' },
  { key: 'newBadge', label: 'New Badge' },
  { key: 'rating', label: 'Rating' },
  { key: 'reviewCount', label: 'Review Count' },
  { key: 'quickView', label: 'Quick View' },
  { key: 'wishlist', label: 'Wishlist' },
  { key: 'addToCart', label: 'Add To Cart' },
  { key: 'stockStatus', label: 'Stock Status' },
];

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-1">
    <label className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</label>
    {children}
  </div>
);

const Toggle = ({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) => (
  <button type="button" onClick={onClick}
    className={`inline-flex items-center gap-1.5 border px-2.5 py-1.5 text-[11px] transition-colors ${
      on ? 'border-border text-foreground hover:bg-muted' : 'border-dashed border-border text-muted-foreground hover:bg-muted'
    }`}>
    {on ? <Eye size={12} /> : <EyeOff size={12} />}{label}
  </button>
);

const ManualPicker = ({ ids, products, onChange }: {
  ids: string[]; products: Product[]; onChange: (ids: string[]) => void;
}) => {
  const [q, setQ] = useState('');
  const byId = useMemo(() => new Map(products.map((p) => [p.id, p])), [products]);
  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    return products.filter((p) => p.name.toLowerCase().includes(s) && !ids.includes(p.id)).slice(0, 8);
  }, [q, products, ids]);

  const move = (from: number, to: number) => {
    if (to < 0 || to >= ids.length) return;
    const next = [...ids];
    const [m] = next.splice(from, 1);
    next.splice(to, 0, m);
    onChange(next);
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <Search size={13} className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products to add..."
          className="luxury-input text-xs pl-7" />
        {results.length > 0 && (
          <div className="absolute z-20 mt-1 w-full border border-border bg-background shadow-lg max-h-56 overflow-auto">
            {results.map((p) => (
              <button key={p.id} type="button"
                onClick={() => { onChange([...ids, p.id]); setQ(''); }}
                className="flex w-full items-center gap-2 px-2 py-1.5 text-left text-xs hover:bg-muted">
                <img src={p.image_url} alt="" className="h-7 w-7 object-cover border border-border" />
                <span className="truncate flex-1">{p.name}</span>
                <Plus size={12} className="text-muted-foreground" />
              </button>
            ))}
          </div>
        )}
      </div>
      {ids.length === 0 ? (
        <p className="text-[11px] text-muted-foreground">No products selected yet.</p>
      ) : (
        <div className="space-y-1">
          {ids.map((id, i) => {
            const p = byId.get(id);
            return (
              <div key={id} className="flex items-center gap-2 border border-border px-2 py-1.5 text-xs">
                <span className="font-mono text-[10px] text-muted-foreground w-5">{i + 1}</span>
                {p ? <img src={p.image_url} alt="" className="h-7 w-7 object-cover border border-border" /> : null}
                <span className="truncate flex-1">{p?.name || '(deleted product)'}</span>
                <button type="button" onClick={() => move(i, i - 1)} disabled={i === 0} className="disabled:opacity-30"><ArrowUp size={13} /></button>
                <button type="button" onClick={() => move(i, i + 1)} disabled={i === ids.length - 1} className="disabled:opacity-30"><ArrowDown size={13} /></button>
                <button type="button" onClick={() => onChange(ids.filter((x) => x !== id))} className="text-destructive"><X size={13} /></button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const SectionEditor = ({ section, products, categories, subcategories, brands }: {
  section: HomepageSection; products: Product[];
  categories: string[]; subcategories: string[]; brands: string[];
}) => {
  const updateConfig = useUpdateHomepageSectionConfig();
  const save = useSaveHomepageSections();
  const del = useDeleteHomepageSection();
  const [open, setOpen] = useState(false);
  const [cfg, setCfg] = useState<ProductSectionConfig>(() => parseProductSectionConfig(section.section_key, section.title, section.config));

  useEffect(() => {
    setCfg(parseProductSectionConfig(section.section_key, section.title, section.config));
  }, [JSON.stringify(section.config), section.section_key, section.title]);

  const set = <K extends keyof ProductSectionConfig>(k: K, v: ProductSectionConfig[K]) => setCfg((c) => ({ ...c, [k]: v }));
  const setCard = (k: keyof CardSettings) => setCfg((c) => ({ ...c, card: { ...c.card, [k]: !c.card[k] } }));

  const isCustom = section.section_key.startsWith('custom_');

  const handleSave = async () => {
    try {
      if (!(await guardLinks(cfg, (m) => toast.error(m)))) return;
      await updateConfig.mutateAsync({ section_key: section.section_key, config: cfg as any });
      toast.success(`${cfg.title || section.title} saved ✓`);
    } catch (e: any) { toast.error(e.message || 'Save failed'); }
  };

  const toggleEnabled = async () => {
    try {
      await save.mutateAsync([{ id: section.id, enabled: !section.enabled, sort_order: section.sort_order }]);
      toast.success(section.enabled ? 'Section hidden' : 'Section shown');
    } catch (e: any) { toast.error(e.message || 'Failed'); }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this custom section?')) return;
    try { await del.mutateAsync(section.id); toast.success('Section deleted'); }
    catch (e: any) { toast.error(e.message || 'Failed'); }
  };

  return (
    <div className="border border-border">
      <div className="flex items-center gap-3 px-4 py-3">
        <button onClick={() => setOpen(!open)} className="text-muted-foreground">
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        <div className="min-w-0 flex-1 cursor-pointer" onClick={() => setOpen(!open)}>
          <p className="text-sm font-medium truncate">{section.title}</p>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            {cfg.source === 'manual' ? 'Manual' : AUTO_MODE_LABELS[cfg.autoMode]} • {cfg.count} items
          </p>
        </div>
        <Toggle on={section.enabled} onClick={toggleEnabled} label={section.enabled ? 'Visible' : 'Hidden'} />
      </div>

      {open && (
        <div className="border-t border-border p-4 space-y-5 bg-secondary/10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Title"><input className="luxury-input text-xs" value={cfg.title} onChange={(e) => set('title', e.target.value)} /></Field>
            <Field label="Subtitle"><input className="luxury-input text-xs" value={cfg.subtitle} onChange={(e) => set('subtitle', e.target.value)} /></Field>
            <Field label="View All Button Text"><input className="luxury-input text-xs" value={cfg.viewAllText} onChange={(e) => set('viewAllText', e.target.value)} placeholder="Leave empty to hide" /></Field>
            <div className="sm:col-span-2"><LinkPicker label="View All URL" value={cfg.viewAllUrl} onChange={(v) => set('viewAllUrl', v)} /></div>
          </div>

          {/* Source */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Field label="Product Source">
              <select className="luxury-input text-xs" value={cfg.source} onChange={(e) => set('source', e.target.value as any)}>
                <option value="auto">Automatic</option>
                <option value="manual">Manual Selection</option>
              </select>
            </Field>
            {cfg.source === 'auto' && (
              <Field label="Automatic Mode">
                <select className="luxury-input text-xs" value={cfg.autoMode} onChange={(e) => set('autoMode', e.target.value as AutoMode)}>
                  {(Object.keys(AUTO_MODE_LABELS) as AutoMode[]).map((m) => (
                    <option key={m} value={m}>{AUTO_MODE_LABELS[m]}</option>
                  ))}
                </select>
              </Field>
            )}
            <Field label="Products Count">
              <select className="luxury-input text-xs" value={cfg.count} onChange={(e) => set('count', Number(e.target.value))}>
                {PRODUCT_COUNTS.map((n) => <option key={n} value={n}>{n} products</option>)}
              </select>
            </Field>
          </div>

          {cfg.source === 'auto' && cfg.autoMode === 'category' && (
            <Field label="Category">
              <input list={`cats-${section.id}`} className="luxury-input text-xs" value={cfg.category} onChange={(e) => set('category', e.target.value)} />
              <datalist id={`cats-${section.id}`}>{categories.map((c) => <option key={c} value={c} />)}</datalist>
            </Field>
          )}
          {cfg.source === 'auto' && cfg.autoMode === 'subcategory' && (
            <Field label="Subcategory">
              <input list={`subs-${section.id}`} className="luxury-input text-xs" value={cfg.subcategory} onChange={(e) => set('subcategory', e.target.value)} />
              <datalist id={`subs-${section.id}`}>{subcategories.map((c) => <option key={c} value={c} />)}</datalist>
            </Field>
          )}
          {cfg.source === 'auto' && cfg.autoMode === 'brand' && (
            <Field label="Brand">
              <input list={`brands-${section.id}`} className="luxury-input text-xs" value={cfg.brand} onChange={(e) => set('brand', e.target.value)} />
              <datalist id={`brands-${section.id}`}>{brands.map((c) => <option key={c} value={c} />)}</datalist>
            </Field>
          )}

          {cfg.source === 'manual' && (
            <Field label="Manual Products (search, select, reorder)">
              <ManualPicker ids={cfg.productIds} products={products} onChange={(ids) => set('productIds', ids)} />
            </Field>
          )}

          {/* Layout / mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Field label="Desktop Layout">
              <select className="luxury-input text-xs" value={cfg.layout} onChange={(e) => set('layout', e.target.value as any)}>
                <option value="grid">Grid</option>
                <option value="slider">Slider</option>
              </select>
            </Field>
            <Field label="Mobile Products Per Row">
              <select className="luxury-input text-xs" value={cfg.mobilePerRow} onChange={(e) => set('mobilePerRow', Number(e.target.value))} disabled={cfg.mobileSlider || cfg.layout === 'slider'}>
                <option value={1}>1 per row</option>
                <option value={2}>2 per row</option>
              </select>
            </Field>
            <div className="flex items-end gap-2">
              <Toggle on={cfg.mobileSlider} onClick={() => set('mobileSlider', !cfg.mobileSlider)} label="Mobile Slider" />
            </div>
          </div>

          {/* Flash sale / scheduling */}
          <div className="space-y-3 border border-dashed border-border p-3">
            <div className="flex items-center gap-3">
              <Toggle on={cfg.countdown} onClick={() => set('countdown', !cfg.countdown)} label="Countdown Timer" />
              <span className="text-[10px] text-muted-foreground">Enable to show Flash-Sale style countdown + scheduling</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Start Date (optional)">
                <input type="datetime-local" className="luxury-input text-xs" value={cfg.startDate} onChange={(e) => set('startDate', e.target.value)} />
              </Field>
              <Field label="End Date (optional)">
                <input type="datetime-local" className="luxury-input text-xs" value={cfg.endDate} onChange={(e) => set('endDate', e.target.value)} />
              </Field>
            </div>
          </div>

          {/* Card settings */}
          <Field label="Product Card Settings">
            <div className="flex flex-wrap gap-2">
              {CARD_FIELDS.map((f) => (
                <Toggle key={f.key} on={cfg.card[f.key]} onClick={() => setCard(f.key)} label={f.label} />
              ))}
            </div>
          </Field>

          <div className="flex items-center justify-between gap-3 pt-2">
            {isCustom ? (
              <button onClick={handleDelete} className="inline-flex items-center gap-1.5 text-xs text-destructive hover:bg-destructive/10 px-3 py-2 transition-colors">
                <Trash2 size={13} /> Delete Section
              </button>
            ) : <span />}
            <button onClick={handleSave} disabled={updateConfig.isPending}
              className="luxury-button-primary text-xs py-2 px-4 inline-flex items-center gap-1.5">
              {updateConfig.isPending ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />} Save Section
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const AdminProductSections = () => {
  const { data: sections = [], isLoading } = useHomepageSections(true);
  const { data: products = [] } = useProducts(undefined, undefined, undefined, true);
  const create = useCreateHomepageSection();

  const productSections = sections.filter((s) => PRODUCT_TYPES.has(s.type));

  const categories = useMemo(() => Array.from(new Set(products.map((p) => p.category).filter(Boolean))).sort(), [products]);
  const subcategories = useMemo(() => Array.from(new Set(products.map((p) => p.subcategory || '').filter(Boolean))).sort(), [products]);
  const brands = useMemo(() => Array.from(new Set(products.map((p) => p.brand).filter(Boolean))).sort(), [products]);

  const addCustom = async () => {
    const title = prompt('New product section title (e.g. Trending Products)');
    if (!title || !title.trim()) return;
    const key = `custom_${slugify(title).slice(0, 30) || 'section'}_${Date.now().toString(36)}`;
    const maxOrder = sections.reduce((m, s) => Math.max(m, s.sort_order), 0);
    try {
      await create.mutateAsync({
        section_key: key, title: title.trim(), type: 'product', sort_order: maxOrder + 1,
        config: defaultProductSectionConfig(key, title.trim()) as any,
      });
      toast.success('Custom section created ✓');
    } catch (e: any) { toast.error(e.message || 'Failed'); }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Product Sections</h2>
          <p className="text-xs text-muted-foreground mt-1">Manage every product-based homepage section. Reorder them from “Homepage Sections”.</p>
        </div>
        <button onClick={addCustom} disabled={create.isPending}
          className="luxury-button-primary text-xs py-2 px-4 inline-flex items-center gap-1.5 shrink-0">
          {create.isPending ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />} Add Custom Section
        </button>
      </div>

      <div className="border border-border bg-secondary/20 p-3 flex items-start gap-2">
        <Info size={14} className="text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-[11px] text-muted-foreground">
          Each section supports manual or automatic product sourcing, count, layout, mobile slider, card toggles and Flash-Sale countdown/scheduling. Changes go live after saving.
        </p>
      </div>

      <div className="space-y-3">
        {productSections.map((s) => (
          <SectionEditor key={s.id} section={s} products={products}
            categories={categories} subcategories={subcategories} brands={brands} />
        ))}
      </div>
    </div>
  );
};

export default AdminProductSections;
