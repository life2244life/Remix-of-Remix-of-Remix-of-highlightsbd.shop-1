// Shared data model for the per-product information sections that are
// managed from the Admin Panel and rendered on the Product Details Page.

export type SpecTableRow = Record<string, string>;
export type ProductSpecification = { enabled: boolean; columns: string[]; rows: SpecTableRow[] };
export type FaqItem = { question: string; answer: string };

export type DeliveryInfoData = {
  enabled: boolean;
  codAvailable: boolean;
  securePayment: boolean;
  dhakaTime: string;
  outsideTime: string;
  returnText: string;
  estMinDays: number;
  estMaxDays: number;
};

export type ProductInfoData = {
  description: { enabled: boolean };
  specification: ProductSpecification;
  features: { enabled: boolean; items: string[] };
  material: { enabled: boolean; items: string[] };
  usage: { enabled: boolean; items: string[] };
  shipping: { enabled: boolean; items: string[] };
  returnPolicy: { enabled: boolean; items: string[] };
  faq: { enabled: boolean; items: FaqItem[] };
  sizeChart: { enabled: boolean };
  delivery: DeliveryInfoData;
  trustBadges: { enabled: boolean; items: string[] };
};

export const DEFAULT_SPEC_COLUMNS = ['Size', 'Chest', 'Length'];

export const DEFAULT_TRUST_BADGES = [
  'Secure Checkout',
  'Fast Delivery',
  'Premium Quality',
  'Easy Exchange',
  'Cash on Delivery',
  '100% Authentic',
];

export const defaultDelivery = (): DeliveryInfoData => ({
  enabled: true,
  codAvailable: true,
  securePayment: true,
  dhakaTime: '1–2 days',
  outsideTime: '2–5 days',
  returnText: 'Easy 7-day return & exchange',
  estMinDays: 2,
  estMaxDays: 5,
});

const asArray = <T,>(v: any): T[] => (Array.isArray(v) ? v : []);
const cleanText = (v: any) => String(v ?? '').trim();
const unique = (items: string[]) => Array.from(new Set(items.map(cleanText).filter(Boolean)));

const normalizeSpecRows = (rows: any[], columns: string[]) =>
  rows
    .filter((r) => r && typeof r === 'object' && !Array.isArray(r))
    .map((r) => {
      const row: SpecTableRow = {};
      columns.forEach((c) => {
        row[c] = String(r[c] ?? '');
      });
      return row;
    });

export const syncSpecificationWithSizes = (
  specification: ProductSpecification,
  sizes: string[],
): ProductSpecification => {
  const columns = unique(['Size', ...(specification.columns?.length ? specification.columns : DEFAULT_SPEC_COLUMNS)]);
  const sizeColumn = columns[0] === 'Size' ? columns : ['Size', ...columns.filter((c) => c !== 'Size')];
  const existingBySize = new Map<string, SpecTableRow>();

  specification.rows.forEach((row) => {
    const size = cleanText(row.Size);
    if (size) existingBySize.set(size, row);
  });

  const rows = unique(sizes).map((size) => {
    const existing = existingBySize.get(size) || {};
    const row: SpecTableRow = { Size: size };
    sizeColumn.forEach((col) => {
      row[col] = col === 'Size' ? size : String(existing[col] ?? '');
    });
    return row;
  });

  return { ...specification, columns: sizeColumn, rows };
};

/**
 * Normalize a raw `product_info` JSON value (which may be null / partial) into
 * a complete, safe ProductInfoData object.
 *
 * - `description` defaults to ON (so existing products keep showing it) unless
 *   explicitly turned off.
 * - Every other section defaults to OFF so we never show empty cards.
 */
export const getProductInfo = (raw: any): ProductInfoData => {
  const pi = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
  const rawSpecRows = asArray<any>(pi.specification?.rows);
  const legacyLabelValue = rawSpecRows.some((r) => r && typeof r === 'object' && ('label' in r || 'value' in r));
  const columns = legacyLabelValue
    ? DEFAULT_SPEC_COLUMNS
    : unique(asArray<string>(pi.specification?.columns).map(String).concat(rawSpecRows[0] ? Object.keys(rawSpecRows[0]) : []));

  return {
    description: { enabled: pi.description?.enabled !== false },
    specification: {
      enabled: !!pi.specification?.enabled,
      columns: columns.length ? unique(['Size', ...columns]) : DEFAULT_SPEC_COLUMNS,
      rows: legacyLabelValue ? [] : normalizeSpecRows(rawSpecRows, columns.length ? unique(['Size', ...columns]) : DEFAULT_SPEC_COLUMNS),
    },
    features: {
      enabled: !!pi.features?.enabled,
      items: asArray<string>(pi.features?.items).map((s) => String(s ?? '')),
    },
    material: {
      enabled: !!pi.material?.enabled,
      items: asArray<string>(pi.material?.items).map((s) => String(s ?? '')),
    },
    usage: {
      enabled: !!pi.usage?.enabled,
      items: asArray<string>(pi.usage?.items).map((s) => String(s ?? '')),
    },
    shipping: {
      enabled: !!pi.shipping?.enabled,
      items: asArray<string>(pi.shipping?.items).map((s) => String(s ?? '')),
    },
    returnPolicy: {
      enabled: !!pi.returnPolicy?.enabled,
      items: asArray<string>(pi.returnPolicy?.items).map((s) => String(s ?? '')),
    },
    faq: {
      enabled: !!pi.faq?.enabled,
      items: asArray<FaqItem>(pi.faq?.items)
        .filter((r) => r && typeof r === 'object')
        .map((r) => ({ question: String(r.question ?? ''), answer: String(r.answer ?? '') })),
    },
    sizeChart: { enabled: !!pi.sizeChart?.enabled },
    delivery: {
      ...defaultDelivery(),
      ...(pi.delivery && typeof pi.delivery === 'object' && !Array.isArray(pi.delivery) ? pi.delivery : {}),
      enabled: pi.delivery?.enabled !== false,
    },
    trustBadges: {
      enabled: pi.trustBadges?.enabled !== false,
      items: (() => {
        const items = asArray<string>(pi.trustBadges?.items).map((s) => String(s ?? '')).filter(Boolean);
        return items.length ? items : [...DEFAULT_TRUST_BADGES];
      })(),
    },
  };
};

/** A blank, ready-to-edit ProductInfoData (used when adding a new product). */
export const emptyProductInfo = (): ProductInfoData => ({
  description: { enabled: true },
  specification: { enabled: false, columns: DEFAULT_SPEC_COLUMNS, rows: [] },
  features: { enabled: false, items: [] },
  material: { enabled: false, items: [] },
  usage: { enabled: false, items: [] },
  shipping: { enabled: false, items: [] },
  returnPolicy: { enabled: false, items: [] },
  faq: { enabled: false, items: [] },
  sizeChart: { enabled: false },
  delivery: defaultDelivery(),
  trustBadges: { enabled: true, items: [...DEFAULT_TRUST_BADGES] },
});
