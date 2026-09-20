// Central helper to turn stored payment_method / payment_gateway codes into
// human-readable labels + badge colors. Never hardcode per-order — always
// resolve from the order data.

export interface PaymentMethodStyle {
  label: string;
  /** Tailwind classes for the colored badge. */
  badge: string;
  /** Solid hex-ish color (for print/invoice where classes aren't available). */
  dot: string;
}

/** Normalise any stored value into a canonical key. */
function normalizeKey(raw?: string | null): string {
  const v = (raw || '').toLowerCase().trim();
  if (!v) return '';
  // strip common suffixes like "_manual" / "_auto"
  const base = v.replace(/[\s-]+/g, '_');
  if (base.includes('cod') || base.includes('cash')) return 'cod';
  if (base.includes('bkash')) return 'bkash';
  if (base.includes('nagad')) return 'nagad';
  if (base.includes('rocket')) return 'rocket';
  if (base.includes('upay')) return 'upay';
  if (base.includes('sslcommerz') || base === 'ssl') return 'sslcommerz';
  if (base.includes('bank')) return 'bank';
  if (base.includes('card') || base.includes('visa') || base.includes('master') || base.includes('amex')) return 'card';
  return base;
}

const STYLES: Record<string, PaymentMethodStyle> = {
  cod:        { label: 'Cash on Delivery', badge: 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20', dot: '#059669' },
  bkash:      { label: 'bKash',            badge: 'bg-pink-500/10 text-pink-600 border border-pink-500/20',         dot: '#e2136e' },
  nagad:      { label: 'Nagad',            badge: 'bg-orange-500/10 text-orange-600 border border-orange-500/20',   dot: '#ec6a1f' },
  rocket:     { label: 'Rocket',           badge: 'bg-purple-500/10 text-purple-600 border border-purple-500/20',   dot: '#8c3494' },
  upay:       { label: 'Upay',             badge: 'bg-cyan-500/10 text-cyan-600 border border-cyan-500/20',         dot: '#0891b2' },
  sslcommerz: { label: 'SSLCommerz',       badge: 'bg-blue-500/10 text-blue-600 border border-blue-500/20',        dot: '#2563eb' },
  bank:       { label: 'Bank Transfer',    badge: 'bg-slate-500/10 text-slate-600 border border-slate-500/20',     dot: '#475569' },
  card:       { label: 'Card',             badge: 'bg-indigo-500/10 text-indigo-600 border border-indigo-500/20',   dot: '#4f46e5' },
};

/** Resolve display style for an order's payment method. */
export function getPaymentMethodStyle(raw?: string | null): PaymentMethodStyle | null {
  const key = normalizeKey(raw);
  if (!key) return null;
  if (STYLES[key]) return STYLES[key];
  // Unknown but present → "Other" style using the raw value prettified.
  const label = (raw || '').replace(/[_-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  return { label, badge: 'bg-muted text-muted-foreground border border-border', dot: '#64748b' };
}

/** Plain-text label ("—" when empty). */
export function paymentMethodLabel(raw?: string | null): string {
  return getPaymentMethodStyle(raw)?.label ?? '—';
}

/** All selectable filter options (canonical key + label). */
export const PAYMENT_METHOD_FILTERS: { key: string; label: string }[] = [
  { key: 'cod', label: 'Cash on Delivery' },
  { key: 'bkash', label: 'bKash' },
  { key: 'nagad', label: 'Nagad' },
  { key: 'rocket', label: 'Rocket' },
  { key: 'upay', label: 'Upay' },
  { key: 'sslcommerz', label: 'SSLCommerz' },
  { key: 'bank', label: 'Bank Transfer' },
  { key: 'card', label: 'Card' },
];

/** Canonical key for filtering/comparison. */
export function paymentMethodKey(raw?: string | null): string {
  return normalizeKey(raw);
}

// ============================================================
// Payment STATUS (verification state), separate from the method.
// ============================================================

export interface PaymentStatusStyle {
  label: string;
  badge: string;
  dot: string;
}

/**
 * Resolve the display label + badge for an order's payment status.
 * `method` is used to show "COD" for cash-on-delivery, and to pick the
 * right wording (gateway "Success/Failed" vs manual "Verified/Rejected").
 */
export function getPaymentStatusStyle(
  status?: string | null,
  method?: string | null,
): PaymentStatusStyle {
  const s = (status || '').toLowerCase().trim();
  const isCod = paymentMethodKey(method) === 'cod';
  const isGateway = ['sslcommerz', 'card'].includes(paymentMethodKey(method));

  // COD, still awaiting delivery/collection.
  if (isCod && (s === '' || s === 'pending' || s === 'cod' || s === 'unpaid')) {
    return { label: 'COD', badge: 'bg-slate-500/10 text-slate-600 border border-slate-500/20', dot: '#64748b' };
  }

  switch (s) {
    case 'paid':
    case 'success':
    case 'verified':
      return { label: isGateway ? 'Success' : 'Verified', badge: 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20', dot: '#059669' };
    case 'partial':
      return { label: 'Partial', badge: 'bg-teal-500/10 text-teal-600 border border-teal-500/20', dot: '#0d9488' };
    case 'submitted':
      return { label: isGateway ? 'Pending' : 'Pending Verification', badge: 'bg-orange-500/10 text-orange-600 border border-orange-500/20', dot: '#ea580c' };
    case 'pending':
      return { label: 'Pending', badge: 'bg-orange-500/10 text-orange-600 border border-orange-500/20', dot: '#ea580c' };
    case 'failed':
    case 'rejected':
      return { label: isGateway ? 'Failed' : 'Rejected', badge: 'bg-red-500/10 text-red-600 border border-red-500/20', dot: '#dc2626' };
    case 'cancelled':
      return { label: 'Cancelled', badge: 'bg-neutral-700/10 text-neutral-700 border border-neutral-700/20', dot: '#404040' };
    case 'refunded':
      return { label: 'Refunded', badge: 'bg-purple-500/10 text-purple-600 border border-purple-500/20', dot: '#9333ea' };
    case 'unpaid':
    case '':
      return { label: 'Unpaid', badge: 'bg-red-500/10 text-red-600 border border-red-500/20', dot: '#dc2626' };
    default:
      return { label: (status || '').replace(/\b\w/g, c => c.toUpperCase()), badge: 'bg-muted text-muted-foreground border border-border', dot: '#64748b' };
  }
}

/** Human label for a single transaction status (used in timeline/history). */
export function transactionStatusStyle(status?: string | null, gateway?: string | null): PaymentStatusStyle {
  return getPaymentStatusStyle(status, gateway);
}
