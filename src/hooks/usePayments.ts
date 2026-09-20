import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// ============================================================
// Types
// ============================================================
export type GatewayKey = 'cod' | 'sslcommerz' | 'bkash' | 'nagad';

export type PaymentGatewayRow = {
  id: string;
  gateway: GatewayKey | string;
  slug: string;
  display_name: string;
  is_active: boolean;
  mode: 'sandbox' | 'live';
  credentials: Record<string, any>;
  config: Record<string, any>;
  instructions: string | null;
  sort_order: number;
  icon: string | null;
  gateway_type: 'automated' | 'manual' | 'cod' | string;
  is_builtin: boolean;
  manual_config: Record<string, any>;
  min_order_amount: number;
  max_order_amount: number | null;
  extra_charge: number;
  discount_type: 'percentage' | 'fixed' | null;
  discount_value: number;
  created_at: string;
  updated_at: string;
  last_payment_at?: string | null;
  last_webhook_at?: string | null;
  last_test_at?: string | null;
  last_test_ok?: boolean | null;
};

export type ActivePaymentMethod = {
  gateway: string;
  slug: string;
  display_name: string;
  gateway_type: string;
  icon: string | null;
  mode: string;
  instructions: string | null;
  sort_order: number;
  manual_config: Record<string, any> | null;
  min_order_amount: number;
  max_order_amount: number | null;
  extra_charge: number;
  discount_type: string | null;
  discount_value: number;
  config: Record<string, any> | null;
};

export type PaymentTransactionRow = {
  id: string;
  order_id: string | null;
  gateway: string;
  amount: number;
  currency: string;
  status: string;
  is_advance: boolean;
  gateway_txn_id: string | null;
  val_id: string | null;
  sender_number: string | null;
  customer_phone: string | null;
  error_message: string | null;
  raw_response: Record<string, any>;
  verified_by: string | null;
  verified_at: string | null;
  proof_url: string | null;
  admin_note: string | null;
  created_at: string;
  updated_at: string;
};

export type PaymentRefundRow = {
  id: string;
  order_id: string | null;
  transaction_id: string | null;
  gateway: string;
  amount: number;
  reason: string | null;
  status: string;
  gateway_refund_id: string | null;
  notes: string | null;
  processed_by: string | null;
  processed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type CodDistrictRuleRow = {
  id: string;
  district: string;
  cod_allowed: boolean;
  advance_required: boolean;
  advance_amount: number;
  note: string | null;
  created_at: string;
  updated_at: string;
};

const db = supabase as any;

// ============================================================
// Audit logging
// ============================================================
export type PaymentAuditRow = {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  entity_label: string | null;
  actor_id: string | null;
  actor_email: string | null;
  ip_address: string | null;
  user_agent: string | null;
  old_value: any;
  new_value: any;
  created_at: string;
};

const SENSITIVE_KEYS = ['passwd', 'password', 'secret', 'api_key', 'app_key', 'private', 'token', 'store_pass'];

// Redact sensitive credential values before they ever leave the client for the audit log.
const redactSecrets = (obj: any): any => {
  if (!obj || typeof obj !== 'object') return obj;
  const out: any = Array.isArray(obj) ? [] : {};
  for (const k of Object.keys(obj)) {
    const v = obj[k];
    if (v && SENSITIVE_KEYS.some(s => k.toLowerCase().includes(s))) out[k] = '••••••';
    else if (v && typeof v === 'object') out[k] = redactSecrets(v);
    else out[k] = v;
  }
  return out;
};

let _cachedIp: string | null | undefined;
const getClientIp = async (): Promise<string | null> => {
  if (_cachedIp !== undefined) return _cachedIp ?? null;
  try {
    const r = await fetch('https://api.ipify.org?format=json');
    const j = await r.json();
    _cachedIp = (j?.ip as string) || null;
  } catch {
    _cachedIp = null;
  }
  return _cachedIp ?? null;
};

// Fire-and-forget audit write. Must NEVER throw into the primary action.
export const logPaymentAudit = async (p: {
  action: string;
  entityType: string;
  entityId?: string | null;
  entityLabel?: string | null;
  oldValue?: any;
  newValue?: any;
}): Promise<void> => {
  try {
    const ip = await getClientIp();
    await db.rpc('log_payment_audit', {
      _action: p.action,
      _entity_type: p.entityType,
      _entity_id: p.entityId ?? null,
      _entity_label: p.entityLabel ?? null,
      _old_value: p.oldValue !== undefined ? redactSecrets(p.oldValue) : null,
      _new_value: p.newValue !== undefined ? redactSecrets(p.newValue) : null,
      _ip_address: ip,
      _user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
    });
  } catch (e) {
    // Never break the underlying operation because audit logging failed.
    console.warn('[audit] log failed', e);
  }
};

export const usePaymentAuditLog = (limit = 300) => {
  return useQuery({
    queryKey: ['payment-audit-log', limit],
    queryFn: async (): Promise<PaymentAuditRow[]> => {
      const { data, error } = await db
        .from('payment_audit_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      if (error) throw error;
      return (data || []) as PaymentAuditRow[];
    },
  });
};

// ============================================================
// Admin: gateways
// ============================================================
export const usePaymentGateways = () => {
  return useQuery({
    queryKey: ['payment-gateways'],
    queryFn: async (): Promise<PaymentGatewayRow[]> => {
      const { data, error } = await db.from('payment_gateways').select('*').order('sort_order');
      if (error) throw error;
      return (data || []) as PaymentGatewayRow[];
    },
  });
};

export const useUpdatePaymentGateway = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<PaymentGatewayRow> & { id: string }) => {
      const { data: oldRow } = await db.from('payment_gateways').select('*').eq('id', id).maybeSingle();
      const { error } = await db.from('payment_gateways').update(updates).eq('id', id);
      if (error) throw error;

      // Determine the most specific audit action for this change.
      let action = 'gateway.update';
      if ('is_active' in updates && oldRow && oldRow.is_active !== updates.is_active) {
        action = updates.is_active ? 'gateway.enable' : 'gateway.disable';
      } else if ('mode' in updates && oldRow && oldRow.mode !== updates.mode) {
        action = updates.mode === 'live' ? 'gateway.mode_live' : 'gateway.mode_sandbox';
      } else if ('credentials' in updates || 'config' in updates) {
        action = (oldRow?.gateway === 'sslcommerz' || oldRow?.slug === 'sslcommerz')
          ? 'ssl.settings_change' : 'gateway.update';
      }
      await logPaymentAudit({
        action, entityType: 'gateway', entityId: id,
        entityLabel: oldRow?.display_name, oldValue: oldRow, newValue: updates,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['payment-gateways'] });
      qc.invalidateQueries({ queryKey: ['active-payment-methods'] });
    },
  });
};

export const useCreatePaymentGateway = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (gw: Partial<PaymentGatewayRow>): Promise<PaymentGatewayRow> => {
      const { data, error } = await db.from('payment_gateways').insert(gw).select().single();
      if (error) throw error;
      await logPaymentAudit({
        action: 'gateway.create', entityType: 'gateway', entityId: (data as any)?.id,
        entityLabel: (data as any)?.display_name, newValue: gw,
      });
      return data as PaymentGatewayRow;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['payment-gateways'] });
      qc.invalidateQueries({ queryKey: ['active-payment-methods'] });
    },
  });
};

// Permanently delete a gateway. Blocked (DB-checked) if it has transaction history.
export const useDeletePaymentGateway = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (gw: PaymentGatewayRow) => {
      const { count, error: countErr } = await db
        .from('payment_transactions')
        .select('id', { count: 'exact', head: true })
        .eq('gateway', gw.gateway);
      if (countErr) throw countErr;
      if ((count ?? 0) > 0) {
        throw new Error('This gateway contains transaction history. Please disable it instead.');
      }
      const { error } = await db.from('payment_gateways').delete().eq('id', gw.id);
      if (error) throw error;
      await logPaymentAudit({
        action: 'gateway.delete', entityType: 'gateway', entityId: gw.id,
        entityLabel: gw.display_name, oldValue: gw,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['payment-gateways'] });
      qc.invalidateQueries({ queryKey: ['active-payment-methods'] });
    },
  });
};

// Map of gateway-key -> transaction count, for UI affordances (block delete, badges).
export const useGatewayTxnCounts = () => {
  return useQuery({
    queryKey: ['gateway-txn-counts'],
    queryFn: async (): Promise<Record<string, number>> => {
      const { data, error } = await db.from('payment_transactions').select('gateway').limit(10000);
      if (error) throw error;
      const counts: Record<string, number> = {};
      for (const row of (data || []) as { gateway: string }[]) {
        counts[row.gateway] = (counts[row.gateway] || 0) + 1;
      }
      return counts;
    },
  });
};

// ============================================================
// Public: active payment methods (no credentials exposed)
// ============================================================
export const useActivePaymentMethods = () => {
  return useQuery({
    queryKey: ['active-payment-methods'],
    queryFn: async (): Promise<ActivePaymentMethod[]> => {
      const { data, error } = await db.rpc('get_active_payment_methods');
      if (error) throw error;
      return (data || []) as ActivePaymentMethod[];
    },
  });
};

// ============================================================
// Transactions
// ============================================================
export const usePaymentTransactions = (limit = 200) => {
  return useQuery({
    queryKey: ['payment-transactions', limit],
    queryFn: async (): Promise<PaymentTransactionRow[]> => {
      const { data, error } = await db
        .from('payment_transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      if (error) throw error;
      return (data || []) as PaymentTransactionRow[];
    },
  });
};

export const useVerifyTransaction = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data: userData } = await supabase.auth.getUser();
      const { error } = await db
        .from('payment_transactions')
        .update({ status, verified_by: userData?.user?.id ?? null, verified_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['payment-transactions'] }),
  });
};

// Transactions for a single order (timeline / verification context).
export const useOrderTransactions = (orderId: string | null | undefined) => {
  return useQuery({
    queryKey: ['order-transactions', orderId],
    enabled: !!orderId,
    queryFn: async (): Promise<PaymentTransactionRow[]> => {
      const { data, error } = await db
        .from('payment_transactions')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return (data || []) as PaymentTransactionRow[];
    },
  });
};

// ============================================================
// Payment status history (immutable log per order)
// ============================================================
export type PaymentStatusHistoryRow = {
  id: string;
  order_id: string;
  transaction_id: string | null;
  old_status: string | null;
  new_status: string;
  reason: string | null;
  changed_by: string | null;
  changed_by_email: string | null;
  created_at: string;
};

export const usePaymentStatusHistory = (orderId: string | null | undefined) => {
  return useQuery({
    queryKey: ['payment-status-history', orderId],
    enabled: !!orderId,
    queryFn: async (): Promise<PaymentStatusHistoryRow[]> => {
      const { data, error } = await db
        .from('payment_status_history')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return (data || []) as PaymentStatusHistoryRow[];
    },
  });
};

// Reversible admin payment status change: verify / reject / pending / cancel.
// Recomputes the order totals server-side and appends an immutable history row.
export const useSetTransactionStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, reason }: { id: string; status: string; reason?: string }) => {
      const { data, error } = await db.rpc('set_payment_transaction_status', {
        _txn_id: id, _new_status: status, _reason: reason ?? null,
      });
      if (error) throw error;
      await logPaymentAudit({
        action: `payment.status_${status}`,
        entityType: 'transaction',
        entityId: id,
        oldValue: { status: (data as any)?.old ?? null },
        newValue: { status, reason: reason ?? null, order_id: (data as any)?.order_id ?? null },
      });
      return data;
    },
    onSuccess: (_d, vars) => {
      invalidatePayments(qc);
      qc.invalidateQueries({ queryKey: ['payment-status-history'] });
      qc.invalidateQueries({ queryKey: ['payment-audit-log'] });
    },
  });
};

const invalidatePayments = (qc: ReturnType<typeof useQueryClient>) => {
  qc.invalidateQueries({ queryKey: ['payment-transactions'] });
  qc.invalidateQueries({ queryKey: ['order-transactions'] });
  qc.invalidateQueries({ queryKey: ['orders'] });
};

// Approve a payment: atomically finalize (increments paid_amount, updates order),
// then record who verified it and any admin note.
export const useFinalizeTransaction = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, note, gatewayRef }: { id: string; note?: string; gatewayRef?: string }) => {
      const { error: rpcErr } = await db.rpc('finalize_payment', { _txn_id: id, _gateway_ref: gatewayRef ?? null });
      if (rpcErr) throw rpcErr;
      const { data: userData } = await supabase.auth.getUser();
      const { error } = await db
        .from('payment_transactions')
        .update({ verified_by: userData?.user?.id ?? null, verified_at: new Date().toISOString(), admin_note: note ?? null })
        .eq('id', id);
      if (error) throw error;
      await logPaymentAudit({
        action: 'payment.approve', entityType: 'transaction', entityId: id,
        newValue: { note: note ?? null, gateway_ref: gatewayRef ?? null },
      });
    },
    onSuccess: () => invalidatePayments(qc),
  });
};

// Reject a submitted payment, or request a resubmission (resets order to unpaid).
export const useRejectTransaction = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, orderId, note, resubmit }: { id: string; orderId: string | null; note?: string; resubmit?: boolean }) => {
      const { data: userData } = await supabase.auth.getUser();
      const { error } = await db
        .from('payment_transactions')
        .update({
          status: resubmit ? 'cancelled' : 'failed',
          error_message: resubmit ? 'resubmission requested' : 'rejected by admin',
          admin_note: note ?? null,
          verified_by: userData?.user?.id ?? null,
          verified_at: new Date().toISOString(),
        })
        .eq('id', id);
      if (error) throw error;
      if (orderId) {
        const { error: oErr } = await db
          .from('orders')
          .update({ payment_status: resubmit ? 'pending' : 'unpaid' })
          .eq('id', orderId);
        if (oErr) throw oErr;
      }
      await logPaymentAudit({
        action: resubmit ? 'payment.resubmit' : 'payment.reject',
        entityType: 'transaction', entityId: id,
        newValue: { order_id: orderId, note: note ?? null },
      });
    },
    onSuccess: () => invalidatePayments(qc),
  });
};

// ============================================================
// Refunds
// ============================================================
export const usePaymentRefunds = () => {
  return useQuery({
    queryKey: ['payment-refunds'],
    queryFn: async (): Promise<PaymentRefundRow[]> => {
      const { data, error } = await db.from('payment_refunds').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as PaymentRefundRow[];
    },
  });
};

export const useCreateRefund = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (refund: Partial<PaymentRefundRow>) => {
      const { error } = await db.from('payment_refunds').insert(refund);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['payment-refunds'] }),
  });
};

export const useUpdateRefund = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<PaymentRefundRow> & { id: string }) => {
      if (updates.status && ['completed', 'rejected', 'approved', 'processing'].includes(updates.status)) {
        const { data: userData } = await supabase.auth.getUser();
        updates.processed_by = userData?.user?.id ?? null;
        updates.processed_at = new Date().toISOString();
      }
      const { error } = await db.from('payment_refunds').update(updates).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['payment-refunds'] }),
  });
};

// ============================================================
// COD district rules
// ============================================================
export const useCodDistrictRules = () => {
  return useQuery({
    queryKey: ['cod-district-rules'],
    queryFn: async (): Promise<CodDistrictRuleRow[]> => {
      const { data, error } = await db.from('cod_district_rules').select('*').order('district');
      if (error) throw error;
      return (data || []) as CodDistrictRuleRow[];
    },
  });
};

export const useUpsertCodRule = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (rule: Partial<CodDistrictRuleRow>) => {
      const { error } = await db.from('cod_district_rules').upsert(rule, { onConflict: 'district' });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cod-district-rules'] }),
  });
};

export const useDeleteCodRule = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await db.from('cod_district_rules').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cod-district-rules'] }),
  });
};

// ============================================================
// Helpers: derive a COD rule for a given city/district string
// ============================================================
export const matchCodRule = (rules: CodDistrictRuleRow[], city: string): CodDistrictRuleRow | null => {
  if (!city) return null;
  const c = city.trim().toLowerCase();
  return (
    rules.find(r => r.district.trim().toLowerCase() === c) ||
    rules.find(r => c.includes(r.district.trim().toLowerCase()) || r.district.trim().toLowerCase().includes(c)) ||
    null
  );
};
