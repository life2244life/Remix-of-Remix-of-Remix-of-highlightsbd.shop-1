import { supabase } from '@/integrations/supabase/client';

export type InitResult = { url?: string; transaction_id?: string; paymentID?: string; paymentRefId?: string; error?: string };

async function invoke(fn: string, body: any): Promise<any> {
  const { data, error } = await supabase.functions.invoke(fn, { body });
  if (error) {
    // Try to surface server error message
    try {
      const ctx = (error as any).context;
      if (ctx && typeof ctx.json === 'function') {
        const j = await ctx.json();
        return j;
      }
    } catch { /* ignore */ }
    throw new Error(error.message || `${fn} failed`);
  }
  return data;
}

export const initSslcommerz = (order_id: string, amount: number, is_advance = false): Promise<InitResult> =>
  invoke('sslcommerz-payment', { action: 'init', order_id, amount, is_advance, origin: window.location.origin });

export const createBkash = (order_id: string, amount: number, is_advance = false): Promise<InitResult> =>
  invoke('bkash-payment', { action: 'create', order_id, amount, is_advance, origin: window.location.origin });

export const executeBkash = (paymentID: string, transaction_id?: string): Promise<any> =>
  invoke('bkash-payment', { action: 'execute', paymentID, transaction_id });

export const initNagad = (order_id: string, amount: number, is_advance = false): Promise<InitResult> =>
  invoke('nagad-payment', { action: 'init', order_id, amount, is_advance, origin: window.location.origin });

export const verifyNagad = (paymentRefId: string, transaction_id?: string): Promise<any> =>
  invoke('nagad-payment', { action: 'verify', paymentRefId, transaction_id });

// gateways that redirect the customer offsite
export const REDIRECT_GATEWAYS = ['sslcommerz', 'bkash', 'nagad'] as const;

// ============================================================
// Manual payments (bKash/Nagad/Rocket/Upay/Bank Transfer, etc.)
// ============================================================

/**
 * Upload a customer payment screenshot to the private `payment-proofs` bucket.
 * Works for guests (anon) — the bucket has an INSERT-only policy for the public.
 * Returns the storage path (not a public URL, since the bucket is private).
 */
export const uploadPaymentProof = async (file: File, orderId: string): Promise<string> => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) throw new Error('Screenshot must be less than 10MB');
  if (!file.type.startsWith('image/')) throw new Error('Please upload an image file');

  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const path = `${orderId}/${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
  const { error } = await supabase.storage
    .from('payment-proofs')
    .upload(path, file, { upsert: false, contentType: file.type || 'image/jpeg' });
  if (error) throw new Error(error.message || 'Failed to upload screenshot');
  return path;
};

/**
 * Record a manual payment submission for an order. Creates a 'submitted'
 * transaction server-side and moves the order to payment_status='submitted'.
 * The DB enforces per-gateway txn-id / screenshot requirements.
 */
export const submitManualPayment = async (args: {
  order_id: string;
  gateway: string;
  sender_number?: string | null;
  transaction_id?: string | null;
  proof_url?: string | null;
  is_advance?: boolean;
}): Promise<{ ok: boolean; transaction_id?: string; order_id?: string }> => {
  const { data, error } = await supabase.rpc('submit_manual_payment' as any, {
    _order_id: args.order_id,
    _gateway: args.gateway,
    _sender_number: args.sender_number ?? null,
    _transaction_id: args.transaction_id ?? null,
    _proof_url: args.proof_url ?? null,
    _is_advance: args.is_advance ?? false,
  });
  if (error) throw new Error(error.message || 'Failed to submit payment');
  return data as { ok: boolean; transaction_id?: string; order_id?: string };
};

/** Read standardised receiver details from a manual gateway's manual_config. */
export const getManualReceiver = (cfg: Record<string, any> | null | undefined) => {
  const c = cfg || {};
  return {
    number: c.receiver_number || c.number || c.account_number || c.account || '',
    accountName: c.account_name || c.receiver_name || '',
    accountType: c.account_type || c.type || '',
    requireTxnId: !!c.require_txn_id,
    requireScreenshot: !!c.require_screenshot,
  };
};

/**
 * Admin-only: generate a short-lived signed URL to view a customer's payment
 * proof stored in the private `payment-proofs` bucket. Accepts either a raw
 * storage path or a full URL (returns the URL as-is in the latter case).
 */
export const getProofSignedUrl = async (proofPath: string, expiresIn = 300): Promise<string | null> => {
  if (!proofPath) return null;
  if (/^https?:\/\//i.test(proofPath)) return proofPath;
  const path = proofPath.replace(/^payment-proofs\//, '');
  const { data, error } = await supabase.storage.from('payment-proofs').createSignedUrl(path, expiresIn);
  if (error) return null;
  return data?.signedUrl ?? null;
};
