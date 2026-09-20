import { useState, useEffect } from 'react';
import { useHomepageSections, useSaveHomepageSections, type HomepageSection } from '@/hooks/useSupabase';
import { GripVertical, Eye, EyeOff, Save, Loader2, Info } from 'lucide-react';
import { toast } from 'sonner';

const TYPE_LABEL: Record<string, string> = {
  hero: 'Hero',
  category_grid: 'Category Grid',
  flash_sale: 'Flash Sale',
  product_grid: 'Product Grid',
  product_slider: 'Product Slider',
  collection: 'Collection',
  newsletter: 'Newsletter',
  footer: 'Footer',
  banner: 'Banner',
  poster: 'Poster',
  custom_block: 'Custom Block',
};

const AdminHomepageSections = () => {
  const { data: sections = [], isLoading } = useHomepageSections(true);
  const save = useSaveHomepageSections();

  const [items, setItems] = useState<HomepageSection[]>([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dirty, setDirty] = useState(false);

  useEffect(() => { setItems(sections); setDirty(false); }, [JSON.stringify(sections)]);

  const move = (from: number, to: number) => {
    if (to < 0 || to >= items.length) return;
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setItems(next);
    setDirty(true);
  };

  const toggle = (id: string) => {
    setItems(items.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
    setDirty(true);
  };

  const handleSave = async () => {
    try {
      await save.mutateAsync(items.map((s, i) => ({ id: s.id, enabled: s.enabled, sort_order: i + 1 })));
      toast.success('Homepage order saved ✓');
      setDirty(false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to save');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Homepage Sections</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Drag to reorder, toggle to show/hide. The homepage instantly follows this order after saving.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={save.isPending || !dirty}
          className="luxury-button-primary text-xs py-2 px-4 inline-flex items-center gap-1.5 shrink-0 disabled:opacity-50"
        >
          {save.isPending ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
          {dirty ? 'Save Order' : 'Saved'}
        </button>
      </div>

      <div className="border border-border bg-secondary/20 p-3 flex items-start gap-2">
        <Info size={14} className="text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-[11px] text-muted-foreground">
          Drag any section — Hero, Banner, Flash Sale, Poster, Custom Block, Newsletter — anywhere.
          Edit each block's content from <strong>Homepage</strong>.
        </p>
      </div>

      <div className="space-y-2">
        {items.map((s, i) => (
          <div
            key={s.id}
            draggable
            onDragStart={() => setDragIndex(i)}
            onDragOver={(e) => { e.preventDefault(); }}
            onDrop={(e) => {
              e.preventDefault();
              if (dragIndex !== null && dragIndex !== i) move(dragIndex, i);
              setDragIndex(null);
            }}
            onDragEnd={() => setDragIndex(null)}
            className={`flex items-center gap-3 border border-border bg-background px-3 py-3 transition-colors ${
              dragIndex === i ? 'opacity-50' : ''
            } ${!s.enabled ? 'opacity-60' : ''}`}
          >
            <GripVertical size={16} className="text-muted-foreground cursor-grab active:cursor-grabbing shrink-0" />
            <span className="text-[11px] font-mono text-muted-foreground w-6 shrink-0">{i + 1}</span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{s.title}</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {TYPE_LABEL[s.type] || s.type}
              </p>
            </div>

            {/* up/down for touch / no-drag fallback */}
            <div className="flex flex-col">
              <button onClick={() => move(i, i - 1)} disabled={i === 0}
                className="text-muted-foreground hover:text-foreground disabled:opacity-30 leading-none text-xs px-1">▲</button>
              <button onClick={() => move(i, i + 1)} disabled={i === items.length - 1}
                className="text-muted-foreground hover:text-foreground disabled:opacity-30 leading-none text-xs px-1">▼</button>
            </div>

            <button
              onClick={() => toggle(s.id)}
              className={`inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1.5 border transition-colors shrink-0 ${
                s.enabled
                  ? 'border-border text-foreground hover:bg-muted'
                  : 'border-dashed border-border text-muted-foreground hover:bg-muted'
              }`}
            >
              {s.enabled ? <Eye size={13} /> : <EyeOff size={13} />}
              {s.enabled ? 'Visible' : 'Hidden'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminHomepageSections;