// Auto SKU generation for EIDLIP products.
// Format: EID-{CATEGORY_CODE}-{NUMBER}  e.g. EID-TS-006, EID-WO-021, EID-MN-103
//
// Codes follow the existing catalog convention: the first two letters of the
// category name, uppercased (Women -> WO, Kids -> KI, Sports -> SP, T-Shirt -> TS).
// A small override map covers cases where that abbreviation reads poorly.

const CATEGORY_CODE_OVERRIDES: Record<string, string> = {
  men: 'MN',
  'new dropped': 'ND',
  'new drop': 'ND',
  accessories: 'AC',
};

/** Derive a short 2-letter category code, matching the existing catalog scheme. */
export const categoryCode = (category: string): string => {
  const key = (category || '').trim().toLowerCase();
  if (CATEGORY_CODE_OVERRIDES[key]) return CATEGORY_CODE_OVERRIDES[key];
  const letters = key.replace(/[^a-z]/g, '');
  if (letters.length >= 2) return letters.slice(0, 2).toUpperCase();
  if (letters.length === 1) return (letters + 'X').toUpperCase();
  return 'XX';
};

/**
 * Generate the next available SKU for a category.
 * Scans existing SKUs sharing the same EID-{CODE}- prefix and increments the max.
 */
export const generateSku = (category: string, existingSkus: string[] = []): string => {
  const code = categoryCode(category);
  const prefix = `EID-${code}-`;
  let max = 0;
  for (const raw of existingSkus) {
    const s = (raw || '').toUpperCase();
    if (s.startsWith(prefix)) {
      const n = parseInt(s.slice(prefix.length).replace(/[^0-9]/g, ''), 10);
      if (!Number.isNaN(n) && n > max) max = n;
    }
  }
  return `${prefix}${String(max + 1).padStart(3, '0')}`;
};
