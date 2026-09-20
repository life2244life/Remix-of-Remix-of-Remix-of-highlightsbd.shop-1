import { useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import {
  Plus, Pencil, Copy, Trash2, GripVertical, ChevronDown, ChevronUp,
  Search, X, ImagePlus, Power, Loader2,
} from 'lucide-react';
import { useProducts } from '@/hooks/useSupabase';
import { useCollections } from '@/hooks/useCollections';
import { uploadImage } from '@/lib/upload';
import LinkPicker from './LinkPicker';
import {
  BLOCK_META, BLOCK_ORDER, makeLandingBlock, lpUid,
  type LandingBlock, type LandingBlockType,
} from '@/lib/landingBlocks';

/* ---------- date helpers ---------- */
export const toLocalInput = (s: string | null) => {
  if (!s) return '';
  const d = new Date(s); const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 16);
};
export const fromLocalInput = (s: string) => (s ? new Date(s).toISOString() : null);

/* ---------- shared inputs ---------- */
export const Lbl = ({ children }: { children: React.ReactNode }) => (
  <label className="text-[10px] uppercase tracking-wider text-muted-foreground">{children}</label>
);
export const TextInput = (p: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...p} className={`w-full border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-foreground ${p.className || ''}`} />
);
export const Area = (p: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea {...p} className={`w-full border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-foreground ${p.className || ''}`} />
);
export const Sel = ({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) => (
  <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-foreground">
    {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
  </select>
);

export const ImageField = ({ value, onChange }: { value: string; onChange: (url: string) => void }) => {
  const [up, setUp] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  const pick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    if (!f.type.startsWith('image/')) { toast.error('Image only'); return; }
    setUp(true);
    try { onChange(await uploadImage(f, 'landing')); toast.success('Uploaded ✓'); }
    catch { toast.error('Upload failed'); }
    finally { setUp(false); if (ref.current) ref.current.value = ''; }
  };
  return (
    <div className="flex items-center gap-3">
      <div className="h-16 w-24 border border-border bg-secondary/30 overflow-hidden flex items-center justify-center shrink-0">
        {value ? <img src={value} alt="" className="h-full w-full object-cover" /> : <ImagePlus size={16} className="text-muted-foreground" />}
      </div>
      <div className="flex flex-col gap-1.5">
        <input ref={ref} type="file" accept="image/*" hidden onChange={pick} />
        <button type="button" onClick={() => ref.current?.click()} disabled={up} className="inline-flex items-center gap-1.5 border border-border px-3 py-1.5 text-xs hover:bg-secondary disabled:opacity-50">
          {up ? <Loader2 size={12} className="animate-spin" /> : <ImagePlus size={12} />} {value ? 'Replace' : 'Upload'}
        </button>
        {value && <button type="button" onClick={() => onChange('')} className="text-[11px] text-destructive">Remove</button>}
      </div>
    </div>
  );
};

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-1"><Lbl>{label}</Lbl>{children}</div>
);

const ProductPicker = ({ ids, onChange }: { ids: string[]; onChange: (ids: string[]) => void }) => {
  const { data: products = [] } = useProducts();
  const [q, setQ] = useState('');
  const byId = useMemo(() => new Map(products.map((p) => [p.id, p])), [products]);
  const results = useMemo(() => {
    const s = q.trim().toLowerCase(); if (!s) return [];
    return products.filter((p) => p.name.toLowerCase().includes(s) && !ids.includes(p.id)).slice(0, 8);
  }, [q, products, ids]);
  return (
    <div className="space-y-2">
      <div className="relative">
        <Search size={13} className="absolute left-2 top-2.5 text-muted-foreground" />
        <TextInput value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products…" className="pl-7" />
        {results.length > 0 && (
          <div className="absolute z-10 mt-1 w-full border border-border bg-background shadow-lg max-h-56 overflow-auto">
            {results.map((p) => (
              <button key={p.id} onClick={() => { onChange([...ids, p.id]); setQ(''); }} className="flex w-full items-center gap-2 px-2 py-1.5 text-left text-xs hover:bg-secondary">
                <img src={p.image_url} alt="" className="h-7 w-7 object-cover" /> {p.name}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="space-y-1">
        {ids.map((id) => {
          const p = byId.get(id);
          return (
            <div key={id} className="flex items-center gap-2 border border-border px-2 py-1 text-xs">
              {p?.image_url && <img src={p.image_url} alt="" className="h-6 w-6 object-cover" />}
              <span className="flex-1 truncate">{p?.name || id}</span>
              <button onClick={() => onChange(ids.filter((x) => x !== id))}><X size={13} className="text-muted-foreground hover:text-destructive" /></button>
            </div>
          );
        })}
        {ids.length === 0 && <p className="text-[11px] text-muted-foreground">No products selected.</p>}
      </div>
    </div>
  );
};

const CollectionPicker = ({ ids, onChange }: { ids: string[]; onChange: (ids: string[]) => void }) => {
  const { data: collections = [] } = useCollections(true);
  return (
    <div className="space-y-1 max-h-48 overflow-auto border border-border p-2">
      {collections.length === 0 && <p className="text-[11px] text-muted-foreground">No collections found.</p>}
      {collections.map((c) => (
        <label key={c.id} className="flex items-center gap-2 text-xs cursor-pointer py-0.5">
          <input type="checkbox" checked={ids.includes(c.id)} onChange={(e) => onChange(e.target.checked ? [...ids, c.id] : ids.filter((x) => x !== c.id))} />
          {c.title}
        </label>
      ))}
    </div>
  );
};

function ListEditor<T extends Record<string, any>>({ items, onChange, fields, make, addLabel }: {
  items: T[]; onChange: (v: T[]) => void; fields: { key: keyof T; label: string; type?: 'text' | 'area' | 'image' }[]; make: () => T; addLabel: string;
}) {
  return (
    <div className="space-y-2">
      {items.map((it, i) => (
        <div key={i} className="border border-border p-2 space-y-2 bg-background">
          <div className="flex justify-end">
            <button onClick={() => onChange(items.filter((_, j) => j !== i))} className="text-destructive"><Trash2 size={13} /></button>
          </div>
          {fields.map((f) => (
            <Row key={String(f.key)} label={f.label}>
              {f.type === 'image' ? (
                <ImageField value={it[f.key] as string} onChange={(url) => onChange(items.map((x, j) => (j === i ? { ...x, [f.key]: url } : x)))} />
              ) : f.type === 'area' ? (
                <Area rows={2} value={it[f.key] as string} onChange={(e) => onChange(items.map((x, j) => (j === i ? { ...x, [f.key]: e.target.value } : x)))} />
              ) : (
                <TextInput value={it[f.key] as string} onChange={(e) => onChange(items.map((x, j) => (j === i ? { ...x, [f.key]: e.target.value } : x)))} />
              )}
            </Row>
          ))}
        </div>
      ))}
      <button onClick={() => onChange([...items, make()])} className="inline-flex items-center gap-1.5 border border-border px-3 py-1.5 text-xs hover:bg-secondary"><Plus size={12} /> {addLabel}</button>
    </div>
  );
}

const alignOpts = [{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }, { value: 'right', label: 'Right' }];

export const BlockEditor = ({ block, onChange }: { block: LandingBlock; onChange: (data: Record<string, any>) => void }) => {
  const d = block.data || {};
  const upd = (patch: Record<string, any>) => onChange({ ...d, ...patch });

  switch (block.type) {
    case 'hero_banner':
      return (
        <div className="space-y-3">
          <Row label="Desktop Image"><ImageField value={d.image} onChange={(v) => upd({ image: v })} /></Row>
          <Row label="Mobile Image (optional)"><ImageField value={d.mobileImage} onChange={(v) => upd({ mobileImage: v })} /></Row>
          <Row label="Headline"><TextInput value={d.headline} onChange={(e) => upd({ headline: e.target.value })} /></Row>
          <Row label="Subheadline"><TextInput value={d.subheadline} onChange={(e) => upd({ subheadline: e.target.value })} /></Row>
          <Row label="Button Label"><TextInput value={d.buttonLabel} onChange={(e) => upd({ buttonLabel: e.target.value })} /></Row>
          <LinkPicker label="Button Link" value={d.buttonUrl} onChange={(v) => upd({ buttonUrl: v })} />
          <Row label="Text Align"><Sel value={d.align} onChange={(v) => upd({ align: v })} options={alignOpts} /></Row>
        </div>
      );
    case 'image_banner':
      return (
        <div className="space-y-3">
          <Row label="Image"><ImageField value={d.image} onChange={(v) => upd({ image: v })} /></Row>
          <LinkPicker label="Link" value={d.link} onChange={(v) => upd({ link: v })} />
          <Row label="Alt Text"><TextInput value={d.alt} onChange={(e) => upd({ alt: e.target.value })} /></Row>
        </div>
      );
    case 'rich_text':
      return (
        <div className="space-y-3">
          <Row label="Content"><Area rows={5} value={d.content} onChange={(e) => upd({ content: e.target.value })} /></Row>
          <Row label="Align"><Sel value={d.align} onChange={(v) => upd({ align: v })} options={alignOpts} /></Row>
        </div>
      );
    case 'button':
      return (
        <div className="space-y-3">
          <Row label="Button Text"><TextInput value={d.label} onChange={(e) => upd({ label: e.target.value })} /></Row>
          <LinkPicker label="Destination" value={d.url} onChange={(v) => upd({ url: v })} />
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <input type="checkbox" checked={!!d.newTab} onChange={(e) => upd({ newTab: e.target.checked })} /> Open in new tab
          </label>
          <div className="grid grid-cols-2 gap-2">
            <Row label="Align"><Sel value={d.align} onChange={(v) => upd({ align: v })} options={alignOpts} /></Row>
            <Row label="Style"><Sel value={d.variant} onChange={(v) => upd({ variant: v })} options={[{ value: 'primary', label: 'Filled' }, { value: 'outline', label: 'Outline' }]} /></Row>
          </div>
        </div>
      );
    case 'product_grid':
      return (
        <div className="space-y-3">
          <Row label="Section Title"><TextInput value={d.title} onChange={(e) => upd({ title: e.target.value })} /></Row>
          <Row label="Columns"><Sel value={String(d.columns)} onChange={(v) => upd({ columns: Number(v) })} options={[2, 3, 4, 5].map((n) => ({ value: String(n), label: `${n} columns` }))} /></Row>
          <Row label="Products"><ProductPicker ids={d.productIds || []} onChange={(ids) => upd({ productIds: ids })} /></Row>
        </div>
      );
    case 'collection_grid':
      return (
        <div className="space-y-3">
          <Row label="Section Title"><TextInput value={d.title} onChange={(e) => upd({ title: e.target.value })} /></Row>
          <Row label="Columns"><Sel value={String(d.columns)} onChange={(v) => upd({ columns: Number(v) })} options={[2, 3, 4].map((n) => ({ value: String(n), label: `${n} columns` }))} /></Row>
          <Row label="Collections"><CollectionPicker ids={d.collectionIds || []} onChange={(ids) => upd({ collectionIds: ids })} /></Row>
        </div>
      );
    case 'category_grid':
      return (
        <div className="space-y-3">
          <Row label="Section Title"><TextInput value={d.title} onChange={(e) => upd({ title: e.target.value })} /></Row>
          <Row label="Columns"><Sel value={String(d.columns)} onChange={(v) => upd({ columns: Number(v) })} options={[2, 3, 4, 5].map((n) => ({ value: String(n), label: `${n} columns` }))} /></Row>
          <Row label="Items">
            <ListEditor items={d.items || []} onChange={(items) => upd({ items })}
              fields={[{ key: 'image', label: 'Image', type: 'image' }, { key: 'label', label: 'Label' }, { key: 'link', label: 'Link URL' }]}
              make={() => ({ image: '', label: '', link: '' })} addLabel="Add Item" />
          </Row>
        </div>
      );
    case 'countdown':
      return (
        <div className="space-y-3">
          <Row label="Title"><TextInput value={d.title} onChange={(e) => upd({ title: e.target.value })} /></Row>
          <Row label="Subtitle"><TextInput value={d.subtitle} onChange={(e) => upd({ subtitle: e.target.value })} /></Row>
          <Row label="Ends At"><TextInput type="datetime-local" value={d.endsAt ? toLocalInput(d.endsAt) : ''} onChange={(e) => upd({ endsAt: fromLocalInput(e.target.value) })} /></Row>
        </div>
      );
    case 'video':
      return (
        <div className="space-y-3">
          <Row label="Title"><TextInput value={d.title} onChange={(e) => upd({ title: e.target.value })} /></Row>
          <Row label="Video URL (YouTube or MP4)"><TextInput value={d.url} onChange={(e) => upd({ url: e.target.value })} placeholder="https://youtube.com/watch?v=…" /></Row>
        </div>
      );
    case 'gallery':
      return (
        <div className="space-y-3">
          <Row label="Columns"><Sel value={String(d.columns)} onChange={(v) => upd({ columns: Number(v) })} options={[2, 3, 4].map((n) => ({ value: String(n), label: `${n} columns` }))} /></Row>
          <Row label="Images">
            <div className="space-y-2">
              {(d.images || []).map((src: string, i: number) => (
                <div key={i} className="flex items-center gap-2">
                  <ImageField value={src} onChange={(url) => upd({ images: (d.images || []).map((x: string, j: number) => (j === i ? url : x)) })} />
                  <button onClick={() => upd({ images: (d.images || []).filter((_: string, j: number) => j !== i) })}><Trash2 size={13} className="text-destructive" /></button>
                </div>
              ))}
              <button onClick={() => upd({ images: [...(d.images || []), ''] })} className="inline-flex items-center gap-1.5 border border-border px-3 py-1.5 text-xs hover:bg-secondary"><Plus size={12} /> Add Image</button>
            </div>
          </Row>
        </div>
      );
    case 'faq':
      return (
        <div className="space-y-3">
          <Row label="Title"><TextInput value={d.title} onChange={(e) => upd({ title: e.target.value })} /></Row>
          <Row label="Questions">
            <ListEditor items={d.items || []} onChange={(items) => upd({ items })}
              fields={[{ key: 'q', label: 'Question' }, { key: 'a', label: 'Answer', type: 'area' }]}
              make={() => ({ q: '', a: '' })} addLabel="Add Question" />
          </Row>
        </div>
      );
    case 'newsletter':
      return (
        <div className="space-y-3">
          <Row label="Title"><TextInput value={d.title} onChange={(e) => upd({ title: e.target.value })} /></Row>
          <Row label="Subtitle"><TextInput value={d.subtitle} onChange={(e) => upd({ subtitle: e.target.value })} /></Row>
          <Row label="Button Label"><TextInput value={d.buttonLabel} onChange={(e) => upd({ buttonLabel: e.target.value })} /></Row>
        </div>
      );
    case 'spacer':
      return <Row label="Height (px)"><TextInput type="number" value={d.height} onChange={(e) => upd({ height: Number(e.target.value) })} /></Row>;
    case 'testimonials':
      return (
        <div className="space-y-3">
          <Row label="Title"><TextInput value={d.title} onChange={(e) => upd({ title: e.target.value })} /></Row>
          <Row label="Testimonials">
            <ListEditor items={d.items || []} onChange={(items) => upd({ items })}
              fields={[{ key: 'image', label: 'Avatar (optional)', type: 'image' }, { key: 'name', label: 'Name' }, { key: 'role', label: 'Role / Location' }, { key: 'quote', label: 'Quote', type: 'area' }]}
              make={() => ({ image: '', name: '', role: '', quote: '' })} addLabel="Add Testimonial" />
          </Row>
        </div>
      );
    case 'brand_story':
      return (
        <div className="space-y-3">
          <Row label="Title"><TextInput value={d.title} onChange={(e) => upd({ title: e.target.value })} /></Row>
          <Row label="Story Text"><Area rows={5} value={d.text} onChange={(e) => upd({ text: e.target.value })} /></Row>
          <Row label="Image (optional)"><ImageField value={d.image} onChange={(v) => upd({ image: v })} /></Row>
          <Row label="Image Position"><Sel value={d.imageSide} onChange={(v) => upd({ imageSide: v })} options={[{ value: 'left', label: 'Left' }, { value: 'right', label: 'Right' }]} /></Row>
        </div>
      );
    default:
      return null;
  }
};

/* ===================== BLOCKS MANAGER (palette + sortable list) ===================== */
const BlocksManager = ({ blocks, onChange }: { blocks: LandingBlock[]; onChange: (b: LandingBlock[]) => void }) => {
  const [openBlock, setOpenBlock] = useState<string | null>(null);
  const [showPalette, setShowPalette] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);

  const addBlock = (type: LandingBlockType) => {
    const b = makeLandingBlock(type);
    onChange([...blocks, b]);
    setOpenBlock(b.id);
    setShowPalette(false);
  };
  const updateBlock = (id: string, data: Record<string, any>) =>
    onChange(blocks.map((b) => (b.id === id ? { ...b, data } : b)));
  const dupBlock = (id: string) => {
    const i = blocks.findIndex((b) => b.id === id);
    if (i < 0) return;
    const copy = { ...blocks[i], id: lpUid(), data: structuredClone(blocks[i].data) };
    const next = [...blocks]; next.splice(i + 1, 0, copy); onChange(next);
  };
  const delBlock = (id: string) => onChange(blocks.filter((b) => b.id !== id));
  const toggleBlock = (id: string) => onChange(blocks.map((b) => (b.id === id ? { ...b, enabled: !b.enabled } : b)));
  const move = (id: string, dir: -1 | 1) => {
    const i = blocks.findIndex((b) => b.id === id);
    const j = i + dir; if (j < 0 || j >= blocks.length) return;
    const next = [...blocks];[next[i], next[j]] = [next[j], next[i]]; onChange(next);
  };
  const onDrop = (overId: string) => {
    if (!dragId || dragId === overId) return;
    const from = blocks.findIndex((b) => b.id === dragId);
    const to = blocks.findIndex((b) => b.id === overId);
    if (from < 0 || to < 0) return;
    const next = [...blocks]; const [moved] = next.splice(from, 1); next.splice(to, 0, moved);
    onChange(next); setDragId(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold uppercase tracking-wide">Content Blocks ({blocks.length})</h4>
        <button onClick={() => setShowPalette((s) => !s)} className="inline-flex items-center gap-1.5 border border-border px-3 py-1.5 text-xs hover:bg-secondary"><Plus size={13} /> Add Block</button>
      </div>

      {showPalette && (
        <div className="border border-border p-3 grid grid-cols-2 sm:grid-cols-3 gap-2 bg-secondary/20">
          {BLOCK_ORDER.map((t) => {
            const M = BLOCK_META[t]; const Icon = M.icon;
            return (
              <button key={t} onClick={() => addBlock(t)} className="flex items-center gap-2 border border-border bg-background px-3 py-2 text-xs hover:border-foreground transition-colors">
                <Icon size={14} /> {M.label}
              </button>
            );
          })}
        </div>
      )}

      {blocks.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-dashed border-border bg-secondary/20 py-16 text-center">
          <p className="text-sm font-medium">No blocks yet</p>
          <p className="text-xs text-muted-foreground mt-1">Click “Add Block” to start building this page.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {blocks.map((b, idx) => {
            const M = BLOCK_META[b.type]; const Icon = M.icon; const open = openBlock === b.id;
            return (
              <div key={b.id} draggable onDragStart={() => setDragId(b.id)} onDragOver={(e) => e.preventDefault()} onDrop={() => onDrop(b.id)}
                className={`border border-border bg-card ${dragId === b.id ? 'opacity-50' : ''} ${!b.enabled ? 'opacity-60' : ''}`}>
                <div className="flex items-center gap-2 px-3 py-2">
                  <GripVertical size={15} className="cursor-grab text-muted-foreground shrink-0" />
                  <Icon size={15} className="shrink-0" />
                  <span className="text-sm font-medium flex-1 truncate">{M.label}</span>
                  <div className="flex items-center gap-0.5">
                    <button title="Move up" onClick={() => move(b.id, -1)} disabled={idx === 0} className="p-1.5 hover:bg-secondary disabled:opacity-30"><ChevronUp size={13} /></button>
                    <button title="Move down" onClick={() => move(b.id, 1)} disabled={idx === blocks.length - 1} className="p-1.5 hover:bg-secondary disabled:opacity-30"><ChevronDown size={13} /></button>
                    <button title={b.enabled ? 'Disable' : 'Enable'} onClick={() => toggleBlock(b.id)} className={`p-1.5 hover:bg-secondary ${b.enabled ? 'text-message' : 'text-muted-foreground'}`}><Power size={13} /></button>
                    <button title="Duplicate" onClick={() => dupBlock(b.id)} className="p-1.5 hover:bg-secondary"><Copy size={13} /></button>
                    <button title="Delete" onClick={() => delBlock(b.id)} className="p-1.5 hover:bg-secondary text-destructive"><Trash2 size={13} /></button>
                    <button title="Edit" onClick={() => setOpenBlock(open ? null : b.id)} className="p-1.5 hover:bg-secondary"><Pencil size={13} /></button>
                  </div>
                </div>
                {open && (
                  <div className="border-t border-border p-3 bg-secondary/10">
                    <BlockEditor block={b} onChange={(data) => updateBlock(b.id, data)} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BlocksManager;