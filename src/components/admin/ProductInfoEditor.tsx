import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { syncSpecificationWithSizes } from '@/data/productInfo';
import type { ProductInfoData, FaqItem } from '@/data/productInfo';
import { FieldCounter } from '@/components/admin/TextFieldWithGuidance';

type Props = {
  value: ProductInfoData;
  sizes: string[];
  onSizesChange: (sizes: string[]) => void;
  onChange: (v: ProductInfoData) => void;
};

const SectionShell = ({
  title,
  subtitle,
  enabled,
  onToggle,
  children,
}: {
  title: string;
  subtitle?: string;
  enabled: boolean;
  onToggle: (v: boolean) => void;
  children: React.ReactNode;
}) => (
  <div className="border border-border">
    <div className="flex items-center justify-between gap-3 bg-muted/20 px-3 py-2.5">
      <div>
        <p className="text-[11px] uppercase tracking-widest font-medium">{title}</p>
        {subtitle && <p className="text-[10px] text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-[9px] uppercase tracking-widest ${enabled ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}`}>
          {enabled ? 'On' : 'Off'}
        </span>
        <Switch checked={enabled} onCheckedChange={onToggle} />
      </div>
    </div>
    {enabled && <div className="border-t border-border p-3 space-y-2">{children}</div>}
  </div>
);

const move = <T,>(arr: T[], from: number, to: number): T[] => {
  if (to < 0 || to >= arr.length) return arr;
  const next = [...arr];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
};

// --- Simple list of single-line strings (Features / Material / Usage) ---
const StringListEditor = ({
  items,
  placeholder,
  addLabel,
  reorder = false,
  recommendedMin,
  recommendedMax,
  onChange,
}: {
  items: string[];
  placeholder: string;
  addLabel: string;
  reorder?: boolean;
  recommendedMin?: number;
  recommendedMax?: number;
  onChange: (items: string[]) => void;
}) => (
  <>
    {items.map((item, i) => (
      <div key={i} className="flex items-center gap-1.5">
        {reorder && (
          <div className="flex flex-col">
            <button type="button" onClick={() => onChange(move(items, i, i - 1))} className="text-muted-foreground hover:text-foreground disabled:opacity-30" disabled={i === 0}><ChevronUp size={12} /></button>
            <button type="button" onClick={() => onChange(move(items, i, i + 1))} className="text-muted-foreground hover:text-foreground disabled:opacity-30" disabled={i === items.length - 1}><ChevronDown size={12} /></button>
          </div>
        )}
        <input
          value={item}
          onChange={(e) => onChange(items.map((it, idx) => (idx === i ? e.target.value : it)))}
          placeholder={placeholder}
          className="luxury-input text-xs flex-1"
        />
        <FieldCounter value={item} recommendedMin={recommendedMin} recommendedMax={recommendedMax} />
        <button type="button" onClick={() => onChange(items.filter((_, idx) => idx !== i))} className="p-1.5 text-destructive hover:bg-destructive/10"><Trash2 size={13} /></button>
      </div>
    ))}
    <button type="button" onClick={() => onChange([...items, ''])} className="luxury-button-outline text-[10px] py-1.5 px-3 inline-flex items-center gap-1">
      <Plus size={12} /> {addLabel}
    </button>
  </>
);

const ProductInfoEditor = ({ value, sizes, onSizesChange, onChange }: Props) => {
  const set = (patch: Partial<ProductInfoData>) => onChange({ ...value, ...patch });
  const specification = syncSpecificationWithSizes(value.specification, sizes);

  const setSpecification = (specificationPatch: Partial<typeof specification>) => {
    set({ specification: { ...specification, ...specificationPatch } });
  };

  const updateSpecCell = (rowIndex: number, column: string, cellValue: string) => {
    if (column === 'Size') {
      onSizesChange(sizes.map((size, idx) => (idx === rowIndex ? cellValue : size)));
      return;
    }
    const rows = specification.rows.map((row, idx) => (
      idx === rowIndex ? { ...row, [column]: cellValue } : row
    ));
    setSpecification({ rows });
  };

  const renameSpecColumn = (oldColumn: string, nextColumn: string) => {
    const clean = nextColumn.trim();
    if (!clean || oldColumn === 'Size') return;
    const columns = specification.columns.map((col) => (col === oldColumn ? clean : col));
    const rows = specification.rows.map((row) => {
      const { [oldColumn]: oldValue, ...rest } = row;
      return { ...rest, [clean]: oldValue ?? '' };
    });
    setSpecification({ columns, rows });
  };

  const addSpecColumn = () => {
    const base = 'Measurement';
    let next = base;
    let i = 2;
    while (specification.columns.includes(next)) next = `${base} ${i++}`;
    setSpecification({
      columns: [...specification.columns, next],
      rows: specification.rows.map((row) => ({ ...row, [next]: '' })),
    });
  };

  const removeSpecColumn = (column: string) => {
    if (column === 'Size') return;
    const columns = specification.columns.filter((col) => col !== column);
    const rows = specification.rows.map((row) => {
      const { [column]: _, ...rest } = row;
      return rest;
    });
    setSpecification({ columns, rows });
  };

  const addSpecRow = () => {
    let next = 'New Size';
    let i = 2;
    while (sizes.includes(next)) next = `New Size ${i++}`;
    onSizesChange([...sizes, next]);
  };

  const removeSpecRow = (size: string) => onSizesChange(sizes.filter((s) => s !== size));

  return (
    <div className="space-y-3">
      {/* Product Specification (size-synced table) */}
      <SectionShell
        title="Product Specification"
        subtitle="Rows follow selected sizes automatically"
        enabled={specification.enabled}
        onToggle={(v) => setSpecification({ enabled: v })}
      >
        <div className="overflow-x-auto border border-border">
          <table className="w-full min-w-[520px] text-xs">
            <thead>
              <tr className="bg-muted/30">
                {specification.columns.map((column) => (
                  <th key={column} className="px-2 py-2 text-left border-b border-border align-top">
                    <div className="flex items-center gap-1.5">
                      <input
                        value={column}
                        disabled={column === 'Size'}
                        onChange={(e) => renameSpecColumn(column, e.target.value)}
                        className="w-full bg-transparent text-[10px] uppercase tracking-wider text-muted-foreground outline-none disabled:cursor-not-allowed"
                      />
                      {column !== 'Size' && (
                        <button type="button" onClick={() => removeSpecColumn(column)} className="shrink-0 text-destructive hover:bg-destructive/10 p-1">
                          <Trash2 size={11} />
                        </button>
                      )}
                    </div>
                  </th>
                ))}
                <th className="w-9 border-b border-border" />
              </tr>
            </thead>
            <tbody>
              {specification.rows.map((row, rowIndex) => (
                <tr key={`${row.Size}-${rowIndex}`} className="border-b border-border last:border-0">
                  {specification.columns.map((column) => (
                    <td key={column} className="px-1 py-1">
                      <input
                        value={row[column] || ''}
                        onChange={(e) => updateSpecCell(rowIndex, column, e.target.value)}
                        className="w-full bg-transparent border border-transparent px-2 py-1.5 text-xs outline-none hover:border-border focus:border-foreground/30"
                      />
                    </td>
                  ))}
                  <td className="px-1 py-1 text-right">
                    <button type="button" onClick={() => removeSpecRow(row.Size)} className="p-1.5 text-destructive hover:bg-destructive/10"><Trash2 size={13} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={addSpecColumn} className="luxury-button-outline text-[10px] py-1.5 px-3 inline-flex items-center gap-1">
            <Plus size={12} /> Add Column
          </button>
          <button type="button" onClick={addSpecRow} className="luxury-button-outline text-[10px] py-1.5 px-3 inline-flex items-center gap-1">
            <Plus size={12} /> Add Row
          </button>
        </div>
        {specification.rows.length === 0 && (
          <p className="text-[11px] text-muted-foreground">Select sizes above to create specification rows.</p>
        )}
      </SectionShell>

      {/* Key Performance Features */}
      <SectionShell
        title="Key Performance Features"
        subtitle="Bullet list shown on the product page"
        enabled={value.features.enabled}
        onToggle={(v) => set({ features: { ...value.features, enabled: v } })}
      >
        <StringListEditor
          items={value.features.items}
          placeholder="e.g. Breathable & lightweight"
          addLabel="Add Feature"
          reorder
          recommendedMin={10}
          recommendedMax={80}
          onChange={(items) => set({ features: { ...value.features, items } })}
        />
      </SectionShell>

      {/* Material Composition */}
      <SectionShell
        title="Material Composition"
        subtitle="e.g. 100% Cotton"
        enabled={value.material.enabled}
        onToggle={(v) => set({ material: { ...value.material, enabled: v } })}
      >
        <StringListEditor
          items={value.material.items}
          placeholder="e.g. 100% Premium Cotton"
          addLabel="Add Item"
          onChange={(items) => set({ material: { ...value.material, items } })}
        />
      </SectionShell>

      {/* Usage Instructions */}
      <SectionShell
        title="Usage Instructions"
        subtitle="Care / usage steps"
        enabled={value.usage.enabled}
        onToggle={(v) => set({ usage: { ...value.usage, enabled: v } })}
      >
        <StringListEditor
          items={value.usage.items}
          placeholder="e.g. Machine wash cold"
          addLabel="Add Instruction"
          onChange={(items) => set({ usage: { ...value.usage, items } })}
        />
      </SectionShell>

      {/* Shipping */}
      <SectionShell
        title="Shipping"
        subtitle="Shipping details shown as a product tab"
        enabled={value.shipping.enabled}
        onToggle={(v) => set({ shipping: { ...value.shipping, enabled: v } })}
      >
        <StringListEditor
          items={value.shipping.items}
          placeholder="e.g. Ships within 24 hours"
          addLabel="Add Shipping Line"
          onChange={(items) => set({ shipping: { ...value.shipping, items } })}
        />
      </SectionShell>

      {/* Return Policy */}
      <SectionShell
        title="Return Policy"
        subtitle="Return & exchange terms shown as a product tab"
        enabled={value.returnPolicy.enabled}
        onToggle={(v) => set({ returnPolicy: { ...value.returnPolicy, enabled: v } })}
      >
        <StringListEditor
          items={value.returnPolicy.items}
          placeholder="e.g. 7-day easy return"
          addLabel="Add Return Line"
          onChange={(items) => set({ returnPolicy: { ...value.returnPolicy, items } })}
        />
      </SectionShell>

      {/* Delivery Information (the highlighted box under the price) */}
      <SectionShell
        title="Delivery Information"
        subtitle="The box shown under the price (COD, delivery times, estimated date)"
        enabled={value.delivery.enabled}
        onToggle={(v) => set({ delivery: { ...value.delivery, enabled: v } })}
      >
        <div className="grid grid-cols-2 gap-2">
          <label className="text-[11px] text-muted-foreground space-y-1">
            <span>Dhaka delivery time</span>
            <input value={value.delivery.dhakaTime} onChange={(e) => set({ delivery: { ...value.delivery, dhakaTime: e.target.value } })} placeholder="1–2 days" className="luxury-input text-xs" />
          </label>
          <label className="text-[11px] text-muted-foreground space-y-1">
            <span>Outside Dhaka time</span>
            <input value={value.delivery.outsideTime} onChange={(e) => set({ delivery: { ...value.delivery, outsideTime: e.target.value } })} placeholder="2–5 days" className="luxury-input text-xs" />
          </label>
          <label className="text-[11px] text-muted-foreground space-y-1 col-span-2">
            <span>Return / exchange line</span>
            <input value={value.delivery.returnText} onChange={(e) => set({ delivery: { ...value.delivery, returnText: e.target.value } })} placeholder="Easy 7-day return & exchange" className="luxury-input text-xs" />
          </label>
          <label className="text-[11px] text-muted-foreground space-y-1">
            <span>Est. delivery min (days)</span>
            <input type="number" min={0} value={value.delivery.estMinDays} onChange={(e) => set({ delivery: { ...value.delivery, estMinDays: Math.max(0, Number(e.target.value) || 0) } })} className="luxury-input text-xs" />
          </label>
          <label className="text-[11px] text-muted-foreground space-y-1">
            <span>Est. delivery max (days)</span>
            <input type="number" min={0} value={value.delivery.estMaxDays} onChange={(e) => set({ delivery: { ...value.delivery, estMaxDays: Math.max(0, Number(e.target.value) || 0) } })} className="luxury-input text-xs" />
          </label>
        </div>
        <div className="flex flex-wrap gap-4 pt-1">
          <label className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <Switch checked={value.delivery.codAvailable} onCheckedChange={(v) => set({ delivery: { ...value.delivery, codAvailable: v } })} />
            Cash on Delivery
          </label>
          <label className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <Switch checked={value.delivery.securePayment} onCheckedChange={(v) => set({ delivery: { ...value.delivery, securePayment: v } })} />
            Secure payment line
          </label>
        </div>
      </SectionShell>

      {/* FAQ */}
      <SectionShell
        title="FAQ"
        subtitle="Questions & answers"
        enabled={value.faq.enabled}
        onToggle={(v) => set({ faq: { ...value.faq, enabled: v } })}
      >
        {value.faq.items.map((item: FaqItem, i) => (
          <div key={i} className="border border-border p-2 space-y-1.5">
            <div className="flex items-center gap-1.5">
              <div className="flex flex-col">
                <button type="button" onClick={() => set({ faq: { ...value.faq, items: move(value.faq.items, i, i - 1) } })} className="text-muted-foreground hover:text-foreground disabled:opacity-30" disabled={i === 0}><ChevronUp size={12} /></button>
                <button type="button" onClick={() => set({ faq: { ...value.faq, items: move(value.faq.items, i, i + 1) } })} className="text-muted-foreground hover:text-foreground disabled:opacity-30" disabled={i === value.faq.items.length - 1}><ChevronDown size={12} /></button>
              </div>
              <input
                value={item.question}
                onChange={(e) => set({ faq: { ...value.faq, items: value.faq.items.map((it, idx) => idx === i ? { ...it, question: e.target.value } : it) } })}
                placeholder="Question"
                className="luxury-input text-xs flex-1"
              />
              <FieldCounter value={item.question} recommendedMin={10} recommendedMax={100} />
              <button type="button" onClick={() => set({ faq: { ...value.faq, items: value.faq.items.filter((_, idx) => idx !== i) } })} className="p-1.5 text-destructive hover:bg-destructive/10"><Trash2 size={13} /></button>
            </div>
            <div className="flex justify-end -mt-1"><FieldCounter value={item.answer} recommendedMin={50} recommendedMax={300} /></div>
            <textarea
              value={item.answer}
              onChange={(e) => set({ faq: { ...value.faq, items: value.faq.items.map((it, idx) => idx === i ? { ...it, answer: e.target.value } : it) } })}
              placeholder="Answer"
              className="luxury-input text-xs min-h-[60px]"
            />
          </div>
        ))}
        <button type="button" onClick={() => set({ faq: { ...value.faq, items: [...value.faq.items, { question: '', answer: '' }] } })} className="luxury-button-outline text-[10px] py-1.5 px-3 inline-flex items-center gap-1">
          <Plus size={12} /> Add FAQ
        </button>
      </SectionShell>

      {/* Size Chart visibility (rows are edited in the Size Chart section above) */}
      <SectionShell
        title="Size Chart"
        subtitle="Show/hide the size chart table (edit rows in the Size Chart section above)"
        enabled={value.sizeChart.enabled}
        onToggle={(v) => set({ sizeChart: { enabled: v } })}
      >
        <p className="text-[11px] text-muted-foreground">
          Edit the measurement rows in the “Size Chart” section above. This toggle controls whether the table appears on the product page.
        </p>
      </SectionShell>
    </div>
  );
};

export default ProductInfoEditor;
