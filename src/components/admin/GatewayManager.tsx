import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';
import { Plus, Pencil, Copy, Trash2, X, Save, Loader2, UploadCloud, Zap, Eye, EyeOff, Download, Upload, ShieldCheck, ShieldAlert, ShieldQuestion, AlertTriangle, Activity, CheckCircle2, XCircle, RefreshCw, Bug, Globe, Store, Lock } from 'lucide-react';
import {
  usePaymentGateways, useUpdatePaymentGateway, useCreatePaymentGateway,
  useDeletePaymentGateway, useGatewayTxnCounts, usePaymentTransactions, PaymentGatewayRow,
} from '@/hooks/usePayments';
import { supabase } from '@/integrations/supabase/client';
import { uploadImage } from '@/lib/upload';

// ------------------------------------------------------------------
// Types & helpers
// ------------------------------------------------------------------
type GatewayType = 'automated' | 'manual' | 'cod';

type CustomField = { key: string; label: string; type: 'text' | 'number' | 'textarea'; required?: boolean };

const TYPE_LABELS: Record<GatewayType, string> = {
  automated: 'Online (API)',
  manual: 'Manual',
  cod: 'Cash on Delivery',
};

const MANUAL_PRESETS = [
  { slug: 'bkash_manual', display_name: 'bKash Personal', icon: '💗' },
  { slug: 'nagad_manual', display_name: 'Nagad Personal', icon: '🟠' },
  { slug: 'rocket_manual', display_name: 'Rocket', icon: '🚀' },
  { slug: 'upay_manual', display_name: 'Upay', icon: '🔵' },
  { slug: 'bank_transfer', display_name: 'Bank Transfer', icon: '🏦' },
];

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');

// ------------------------------------------------------------------
// Green / Red toggle
// ------------------------------------------------------------------
const Toggle = ({ checked, onChange, disabled }: { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    disabled={disabled}
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-6 w-[58px] items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 disabled:opacity-50 ${
      checked ? 'bg-green-500/90' : 'bg-red-500/80'
    }`}
  >
    <span className={`absolute text-[9px] font-semibold tracking-wide text-white ${checked ? 'left-2' : 'right-1.5'}`}>
      {checked ? 'ON' : 'OFF'}
    </span>
    <span
      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
        checked ? 'translate-x-[35px]' : 'translate-x-0.5'
      }`}
    />
  </button>
);

// ------------------------------------------------------------------
// Field shells
// ------------------------------------------------------------------
const Lbl = ({ children }: { children: React.ReactNode }) => (
  <label className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">{children}</label>
);

// ------------------------------------------------------------------
// Editor modal
// ------------------------------------------------------------------
const emptyDraft = (): Partial<PaymentGatewayRow> => ({
  display_name: '',
  slug: '',
  gateway: '',
  gateway_type: 'manual',
  is_active: false,
  mode: 'sandbox',
  icon: '',
  instructions: '',
  credentials: {},
  config: {},
  manual_config: {},
  min_order_amount: 0,
  max_order_amount: null,
  extra_charge: 0,
  discount_type: null,
  discount_value: 0,
  sort_order: 0,
});

const GatewayEditor = ({ initial, onClose }: { initial: Partial<PaymentGatewayRow>; onClose: () => void }) => {
  const create = useCreatePaymentGateway();
  const update = useUpdatePaymentGateway();
  const { data: allTxns = [] } = usePaymentTransactions(300);
  const isEdit = !!initial.id;
  const builtin = !!initial.is_builtin;

  const [d, setD] = useState<Partial<PaymentGatewayRow>>({ ...emptyDraft(), ...initial });
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [uploading, setUploading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [pendingLive, setPendingLive] = useState(false);
  const [testResponse, setTestResponse] = useState<any>(null);
  const [forcingTest, setForcingTest] = useState(false);
  const [showDiag, setShowDiag] = useState(false);

  const set = (patch: Partial<PaymentGatewayRow>) => setD(prev => ({ ...prev, ...patch }));
  const setCfg = (patch: Record<string, any>) => set({ config: { ...(d.config || {}), ...patch } });
  const setManual = (patch: Record<string, any>) => set({ manual_config: { ...(d.manual_config || {}), ...patch } });
  const setCred = (mode: 'sandbox' | 'live', patch: Record<string, any>) =>
    set({ credentials: { ...(d.credentials || {}), [mode]: { ...((d.credentials || {})[mode] || {}), ...patch } } });

  // auto-slug from name for new gateways
  useEffect(() => {
    if (!slugTouched && d.display_name) {
      const s = slugify(d.display_name);
      set({ slug: s, gateway: s });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [d.display_name]);

  const type = (d.gateway_type as GatewayType) || 'manual';
  const isSsl = (d.gateway === 'sslcommerz' || d.slug === 'sslcommerz');
  const customFields: CustomField[] = (d.config?.custom_fields as CustomField[]) || [];

  const setCustomFields = (fields: CustomField[]) => setCfg({ custom_fields: fields });

  const mode = (d.mode as 'sandbox' | 'live') || 'sandbox';
  const sslCfg = d.config || {};
  const sslCred = (d.credentials || {})[mode] || {};

  // ---- Auto-generated readonly callback URLs (mirror the edge function) ----
  const fnBase = `${(import.meta as any).env?.VITE_SUPABASE_URL || ''}/functions/v1/sslcommerz-payment`;
  const autoUrls = {
    success_url: `${fnBase}?action=callback&result=success`,
    fail_url: `${fnBase}?action=callback&result=fail`,
    cancel_url: `${fnBase}?action=callback&result=cancel`,
    ipn_url: `${fnBase}?action=ipn`,
    validation_url: `${mode === 'live' ? 'https://securepay.sslcommerz.com' : 'https://sandbox.sslcommerz.com'}/validator/api/validationserverAPI.php`,
  };

  // ---- SSL Health computation ----
  const HOUR = 3600 * 1000;
  const now = Date.now();
  const ageMs = (ts?: string | null) => (ts ? now - new Date(ts).getTime() : Infinity);
  const lastWebhookAt = initial.last_webhook_at;
  const sslHealth: { color: 'green' | 'yellow' | 'red'; label: string } = (() => {
    if (mode === 'sandbox') return { color: 'yellow', label: 'Sandbox Active' };
    if (lastWebhookAt && ageMs(lastWebhookAt) > 24 * HOUR) return { color: 'red', label: 'Webhook Offline (>24h)' };
    if (initial.last_payment_at && ageMs(initial.last_payment_at) > 24 * HOUR) return { color: 'red', label: 'No payments in 24h' };
    if (initial.last_test_ok === false) return { color: 'red', label: 'Connection Failing' };
    return { color: 'green', label: 'Healthy' };
  })();
  const healthClasses: Record<string, string> = {
    green: 'bg-green-500/10 text-green-600 border-green-500/40',
    yellow: 'bg-amber-500/10 text-amber-600 border-amber-500/40',
    red: 'bg-red-500/10 text-red-600 border-red-500/40',
  };
  const canGoLive = initial.last_test_ok === true;

  // Derive last successful / failed transaction timestamps for this gateway.
  const gwKey = d.gateway || d.slug;
  const lastFailedAt = allTxns.find(t => t.gateway === gwKey && (t.status === 'failed' || t.status === 'cancelled'))?.created_at || null;
  const lastSuccessTxnAt = allTxns.find(t => t.gateway === gwKey && t.status === 'success')?.created_at || initial.last_payment_at || null;

  const handleIcon = async (file: File) => {
    try {
      setUploading(true);
      const url = await uploadImage(file, 'gateway-icons');
      set({ icon: url });
      toast.success('Icon uploaded');
    } catch (e: any) {
      toast.error(e.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const testConnection = async () => {
    if (!isEdit) { toast.error('Save the gateway first, then test.'); return; }
    try {
      setTesting(true);
      const { data, error } = await supabase.functions.invoke('sslcommerz-payment', { body: { action: 'test' } });
      if (error) throw error;
      const ok = !!data?.ok;
      setTestResponse(data ?? { error: 'no response' });
      setShowDiag(true);
      if (ok) toast.success(`Connection OK (${data.mode}) — ${data.message || 'credentials valid'}`);
      else toast.error(data?.error || 'Connection failed');
      // Persist last-test result for the health indicator (best-effort).
      if (initial.id) {
        try {
          await update.mutateAsync({ id: initial.id, last_test_at: new Date().toISOString(), last_test_ok: ok } as any);
        } catch { /* ignore */ }
      }
    } catch (e: any) {
      setTestResponse({ error: e?.message || 'Connection test failed' });
      setShowDiag(true);
      toast.error(e.message || 'Connection test failed');
    } finally {
      setTesting(false);
    }
  };

  // Force a sandbox/live session round-trip to verify end-to-end connectivity.
  const forceTestPayment = async () => {
    if (!isEdit) { toast.error('Save the gateway first, then run a test payment.'); return; }
    try {
      setForcingTest(true);
      const { data, error } = await supabase.functions.invoke('sslcommerz-payment', { body: { action: 'test', force: true } });
      if (error) throw error;
      setTestResponse(data ?? { error: 'no response' });
      setShowDiag(true);
      if (data?.ok) toast.success('Test payment session created successfully');
      else toast.error(data?.error || 'Test payment failed');
    } catch (e: any) {
      setTestResponse({ error: e?.message || 'Test payment failed' });
      setShowDiag(true);
      toast.error(e?.message || 'Test payment failed');
    } finally {
      setForcingTest(false);
    }
  };

  // Export current gateway settings (credentials excluded for safety).
  const exportSettings = () => {
    const { credentials, ...safe } = (d as any);
    const blob = new Blob([JSON.stringify({ ...safe, _exported_at: new Date().toISOString(), _note: 'credentials excluded' }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gateway-${d.slug || 'settings'}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Settings exported (without secrets)');
  };

  const importSettings = async (file: File) => {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      delete parsed.id; delete parsed.created_at; delete parsed.updated_at;
      delete parsed._exported_at; delete parsed._note; delete parsed.credentials;
      setD(prev => ({ ...prev, ...parsed }));
      toast.success('Settings imported into the form — review, then Save.');
    } catch (e: any) {
      toast.error('Invalid settings file');
    }
  };

  const save = async () => {
    if (!d.display_name?.trim()) { toast.error('Gateway name is required'); return; }
    const slug = slugify(d.slug || d.display_name || '');
    if (!slug) { toast.error('Valid slug is required'); return; }
    const payload: Partial<PaymentGatewayRow> = {
      display_name: d.display_name.trim(),
      slug,
      gateway: d.gateway || slug,
      gateway_type: type,
      is_active: !!d.is_active,
      mode,
      icon: d.icon || null,
      instructions: d.instructions || null,
      credentials: d.credentials || {},
      config: d.config || {},
      manual_config: d.manual_config || {},
      min_order_amount: Number(d.min_order_amount) || 0,
      max_order_amount: d.max_order_amount ? Number(d.max_order_amount) : null,
      extra_charge: Number(d.extra_charge) || 0,
      discount_type: d.discount_type || null,
      discount_value: Number(d.discount_value) || 0,
      sort_order: Number(d.sort_order) || 0,
    };
    try {
      if (isEdit) {
        await update.mutateAsync({ id: initial.id!, ...payload });
        toast.success('Gateway updated');
      } else {
        await create.mutateAsync(payload);
        toast.success('Gateway created');
      }
      onClose();
    } catch (e: any) {
      const msg = e?.message || 'Save failed';
      toast.error(/duplicate key|unique/i.test(msg) ? 'A gateway with this slug already exists.' : msg);
    }
  };

  const pending = create.isPending || update.isPending;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm">
      <div className="my-8 w-full max-w-2xl border border-border bg-background shadow-xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background px-5 py-3">
          <h3 className="text-sm font-medium" style={{ fontFamily: 'var(--font-display)' }}>
            {isEdit ? `Edit ${initial.display_name}` : 'New Payment Gateway'}
          </h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
        </div>

        <div className="space-y-5 p-5">
          {/* Basic */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Lbl>Gateway Name</Lbl>
              <input value={d.display_name || ''} onChange={e => set({ display_name: e.target.value })} className="luxury-input" placeholder="e.g. bKash Personal" />
            </div>
            <div>
              <Lbl>Slug (unique)</Lbl>
              <input value={d.slug || ''} disabled={builtin} onChange={e => { setSlugTouched(true); set({ slug: slugify(e.target.value), gateway: slugify(e.target.value) }); }} className="luxury-input disabled:opacity-60" placeholder="bkash_personal" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Lbl>Gateway Type</Lbl>
              <select value={type} disabled={builtin} onChange={e => set({ gateway_type: e.target.value as GatewayType })} className="luxury-input disabled:opacity-60">
                {(Object.keys(TYPE_LABELS) as GatewayType[]).map(t => <option key={t} value={t}>{TYPE_LABELS[t]}</option>)}
              </select>
            </div>
            <div>
              <Lbl>Sort Order</Lbl>
              <input type="number" value={d.sort_order ?? 0} onChange={e => set({ sort_order: parseInt(e.target.value) || 0 })} className="luxury-input" />
            </div>
          </div>

          {/* Icon */}
          <div>
            <Lbl>Icon</Lbl>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center border border-border bg-muted/30 text-xl overflow-hidden">
                {d.icon && /^https?:\/\//.test(d.icon) ? <img src={d.icon} alt="" className="h-full w-full object-contain" /> : <span>{d.icon || '🧾'}</span>}
              </div>
              <label className="luxury-button-secondary inline-flex cursor-pointer items-center gap-2 text-[11px]">
                {uploading ? <Loader2 size={14} className="animate-spin" /> : <UploadCloud size={14} />} Upload
                <input type="file" accept="image/*" hidden onChange={e => { const f = e.target.files?.[0]; if (f) handleIcon(f); }} />
              </label>
              <input value={d.icon && !/^https?:\/\//.test(d.icon) ? d.icon : ''} onChange={e => set({ icon: e.target.value })} className="luxury-input flex-1" placeholder="or emoji / paste URL" />
            </div>
          </div>

          {/* Customer instructions */}
          <div>
            <Lbl>Customer Instructions</Lbl>
            <textarea value={d.instructions || ''} onChange={e => set({ instructions: e.target.value })} className="luxury-input min-h-[70px]" placeholder="Shown to customers at checkout" />
          </div>

          {/* Manual config */}
          {type === 'manual' && (
            <div className="space-y-3 border border-border p-4 bg-muted/10">
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Manual Payment Details</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Lbl>Receiver Number / Account</Lbl>
                  <input value={d.manual_config?.receiver_number || ''} onChange={e => setManual({ receiver_number: e.target.value })} className="luxury-input" placeholder="01XXXXXXXXX / A/C no." />
                </div>
                <div>
                  <Lbl>Account Name (optional)</Lbl>
                  <input value={d.manual_config?.account_name || ''} onChange={e => setManual({ account_name: e.target.value })} className="luxury-input" placeholder="e.g. EIDLIP" />
                </div>
                <div>
                  <Lbl>Account Type (optional)</Lbl>
                  <input value={d.manual_config?.account_type || ''} onChange={e => setManual({ account_type: e.target.value })} className="luxury-input" placeholder="Personal / Agent / Bank" />
                </div>
                <div className="flex items-end gap-3">
                  <label className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <input type="checkbox" checked={!!d.manual_config?.require_txn_id} onChange={e => setManual({ require_txn_id: e.target.checked })} className="accent-foreground" /> Require Transaction ID
                  </label>
                  <label className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <input type="checkbox" checked={!!d.manual_config?.allow_screenshot} onChange={e => setManual({ allow_screenshot: e.target.checked })} className="accent-foreground" /> Allow Screenshot
                  </label>
                </div>
              </div>
              <div>
                <Lbl>Send-Money Instructions</Lbl>
                <textarea value={d.manual_config?.send_money_instructions || ''} onChange={e => setManual({ send_money_instructions: e.target.value })} className="luxury-input min-h-[60px]" placeholder="1. Open the app → Send Money → ..." />
              </div>
            </div>
          )}

          {/* SSLCommerz advanced */}
          {isSsl && (
            <div className="space-y-3 border border-border p-4 bg-muted/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">SSLCommerz Advanced</p>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded border uppercase font-semibold tracking-wide ${mode === 'live' ? 'bg-red-500/10 text-red-600 border-red-500/40' : 'bg-amber-500/10 text-amber-600 border-amber-500/30'}`}>{mode}</span>
                </div>
                <div className="flex gap-1.5">
                  {(['sandbox', 'live'] as const).map(m => (
                    <button key={m} type="button"
                      onClick={() => { if (m === 'live' && mode !== 'live') setPendingLive(true); else set({ mode: m }); }}
                      className={`text-[10px] px-2.5 py-1 border capitalize ${mode === m ? 'border-foreground bg-muted' : 'border-border text-muted-foreground'}`}>{m}</button>
                  ))}
                </div>
              </div>

              {/* ===== SSL Health Dashboard ===== */}
              <div className="space-y-2 border border-border bg-background p-3">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"><Activity size={12} /> SSL Health Dashboard</p>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full border uppercase font-semibold tracking-wide ${healthClasses[sslHealth.color]}`}>{sslHealth.label}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="border border-border px-2.5 py-2">
                    <p className="text-[9px] uppercase tracking-wider text-muted-foreground flex items-center gap-1"><CheckCircle2 size={11} className="text-green-600" /> Last Successful Payment</p>
                    <p className="text-[11px] mt-0.5">{lastSuccessTxnAt ? new Date(lastSuccessTxnAt).toLocaleString() : '—'}</p>
                  </div>
                  <div className="border border-border px-2.5 py-2">
                    <p className="text-[9px] uppercase tracking-wider text-muted-foreground flex items-center gap-1"><XCircle size={11} className="text-destructive" /> Last Failed Payment</p>
                    <p className="text-[11px] mt-0.5">{lastFailedAt ? new Date(lastFailedAt).toLocaleString() : '—'}</p>
                  </div>
                  <div className="border border-border px-2.5 py-2">
                    <p className="text-[9px] uppercase tracking-wider text-muted-foreground flex items-center gap-1"><RefreshCw size={11} /> Last Webhook Received</p>
                    <p className="text-[11px] mt-0.5">{lastWebhookAt ? new Date(lastWebhookAt).toLocaleString() : '—'}</p>
                  </div>
                </div>
              </div>

              {/* ===== SSL Monitoring ===== */}
              <div className="space-y-2 border border-border bg-background p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"><Globe size={12} /> SSL Monitoring</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <label className="flex items-center justify-between gap-2 border border-border px-2.5 py-2 text-[11px]">
                    <span className="flex items-center gap-1.5 text-muted-foreground"><Globe size={12} /> Domain Whitelisted</span>
                    <input type="checkbox" checked={!!sslCfg.domain_whitelisted} onChange={e => setCfg({ domain_whitelisted: e.target.checked })} className="accent-foreground" />
                  </label>
                  <label className="flex items-center justify-between gap-2 border border-border px-2.5 py-2 text-[11px]">
                    <span className="flex items-center gap-1.5 text-muted-foreground"><Store size={12} /> Merchant Account Active</span>
                    <input type="checkbox" checked={!!sslCfg.merchant_active} onChange={e => setCfg({ merchant_active: e.target.checked })} className="accent-foreground" />
                  </label>
                  <label className="flex items-center justify-between gap-2 border border-border px-2.5 py-2 text-[11px]">
                    <span className="flex items-center gap-1.5 text-muted-foreground"><Bug size={12} /> Debug Mode</span>
                    <input type="checkbox" checked={!!sslCfg.debug_mode} onChange={e => setCfg({ debug_mode: e.target.checked })} className="accent-foreground" />
                  </label>
                  <button type="button" onClick={forceTestPayment} disabled={forcingTest} className="flex items-center justify-center gap-2 border border-border px-2.5 py-2 text-[11px] hover:bg-muted/50 disabled:opacity-50">
                    {forcingTest ? <Loader2 size={13} className="animate-spin" /> : <Zap size={13} />} Force Test Payment
                  </button>
                </div>

                {/* Connection diagnostics + validation API response viewer */}
                <div className="border border-border">
                  <button type="button" onClick={() => setShowDiag(s => !s)} className="flex w-full items-center justify-between px-2.5 py-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                    <span className="flex items-center gap-1.5"><Activity size={11} /> Connection Diagnostics & API Response</span>
                    {showDiag ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                  {showDiag && (
                    <pre className="max-h-48 overflow-auto border-t border-border bg-muted/30 p-2.5 text-[10px] leading-relaxed">
                      {testResponse ? JSON.stringify(testResponse, null, 2) : 'No diagnostics yet. Run "Test Connection" or "Force Test Payment".'}
                    </pre>
                  )}
                </div>
              </div>

              {/* ===== Merchant Information ===== */}
              <div className="space-y-2 border border-border bg-background p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"><Store size={12} /> Merchant Information</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Lbl>Merchant Name</Lbl>
                    <input value={sslCfg.merchant_name || ''} onChange={e => setCfg({ merchant_name: e.target.value })} className="luxury-input" placeholder="Store / company name" />
                  </div>
                  <div>
                    <Lbl>Merchant Email</Lbl>
                    <input type="email" value={sslCfg.merchant_email || ''} onChange={e => setCfg({ merchant_email: e.target.value })} className="luxury-input" placeholder="billing@store.com" />
                  </div>
                  <div>
                    <Lbl>Merchant Phone</Lbl>
                    <input value={sslCfg.merchant_phone || ''} onChange={e => setCfg({ merchant_phone: e.target.value })} className="luxury-input" placeholder="01XXXXXXXXX" />
                  </div>
                  <div>
                    <Lbl>Store URL</Lbl>
                    <input value={sslCfg.store_url || ''} onChange={e => setCfg({ store_url: e.target.value })} className="luxury-input" placeholder="https://store.com" />
                  </div>
                  <div className="md:col-span-2">
                    <Lbl>Webhook Secret / Token (optional)</Lbl>
                    <div className="relative">
                      <input type={showSecret ? 'text' : 'password'} value={sslCfg.webhook_secret || ''} autoComplete="off" onChange={e => setCfg({ webhook_secret: e.target.value })} className="luxury-input pr-9" placeholder="Used to verify incoming IPN" />
                      <button type="button" onClick={() => setShowSecret(s => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showSecret ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Lbl>Store ID ({mode})</Lbl>
                  <input value={sslCred.store_id || ''} autoComplete="off" onChange={e => setCred(mode, { store_id: e.target.value })} className="luxury-input" />
                </div>
                <div>
                  <Lbl>Store Password ({mode})</Lbl>
                  <div className="relative">
                    <input type={showSecret ? 'text' : 'password'} value={sslCred.store_passwd || ''} autoComplete="off" onChange={e => setCred(mode, { store_passwd: e.target.value })} className="luxury-input pr-9" />
                    <button type="button" onClick={() => setShowSecret(s => !s)} title={showSecret ? 'Hide' : 'Reveal'} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showSecret ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
                <div>
                  <Lbl>Currency</Lbl>
                  <input value={sslCfg.currency || 'BDT'} onChange={e => setCfg({ currency: e.target.value })} className="luxury-input" />
                </div>
                <div>
                  <Lbl>Allowed Payment Methods</Lbl>
                  <input value={sslCfg.allowed_methods || ''} onChange={e => setCfg({ allowed_methods: e.target.value })} className="luxury-input" placeholder="card,mobilebank,internetbank" />
                </div>
              </div>

              {/* ===== Auto-generated readonly URLs ===== */}
              <div className="space-y-2 border border-border bg-background p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"><Lock size={12} /> Auto-generated Callback URLs (read-only)</p>
                {([
                  ['Success URL', autoUrls.success_url],
                  ['Fail URL', autoUrls.fail_url],
                  ['Cancel URL', autoUrls.cancel_url],
                  ['IPN URL', autoUrls.ipn_url],
                  ['Validation API URL', autoUrls.validation_url],
                ] as const).map(([label, value]) => (
                  <div key={label}>
                    <Lbl>{label}</Lbl>
                    <div className="flex items-center gap-1.5">
                      <input readOnly value={value} className="luxury-input flex-1 bg-muted/30 text-[10px]" onFocus={e => e.currentTarget.select()} />
                      <button type="button" onClick={() => { navigator.clipboard?.writeText(value); toast.success(`${label} copied`); }} className="p-1.5 text-muted-foreground hover:text-foreground"><Copy size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <input type="checkbox" checked={!!sslCfg.ipn_enabled} onChange={e => setCfg({ ipn_enabled: e.target.checked })} className="accent-foreground" /> Enable IPN
                </label>
                <label className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <input type="checkbox" checked={!!sslCfg.emi_enabled} onChange={e => setCfg({ emi_enabled: e.target.checked })} className="accent-foreground" /> Enable EMI
                </label>
                <button type="button" onClick={testConnection} disabled={testing} className="ml-auto luxury-button-secondary inline-flex items-center gap-2 text-[11px]">
                  {testing ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />} Test Connection
                </button>
              </div>

              {/* LIVE mode confirmation + protection */}
              {pendingLive && (
                <div className="border border-red-500/40 bg-red-500/5 p-3 space-y-2">
                  <p className="text-[11px] font-medium text-red-600 flex items-center gap-1.5"><AlertTriangle size={13} /> Switch to LIVE mode?</p>
                  <p className="text-[10px] text-muted-foreground">Real customers will be charged real money. Make sure live Store ID &amp; Password are correct and tested.</p>
                  {!canGoLive && (
                    <p className="text-[10px] text-red-600 flex items-center gap-1.5"><ShieldAlert size={12} /> A successful Test Connection is required before enabling LIVE mode.</p>
                  )}
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setPendingLive(false)} className="luxury-button-secondary text-[10px]">Cancel</button>
                    <button type="button" disabled={!canGoLive} onClick={() => { set({ mode: 'live' }); setPendingLive(false); }} className="inline-flex items-center gap-1.5 border border-red-500 bg-red-500/10 px-3 py-1.5 text-[10px] text-red-600 hover:bg-red-500/20 disabled:opacity-40 disabled:cursor-not-allowed">Yes, go LIVE</button>
                  </div>
                </div>
              )}

              {/* Export / Import settings */}
              <div className="flex items-center gap-2 border-t border-border pt-3">
                <button type="button" onClick={exportSettings} className="luxury-button-secondary inline-flex items-center gap-1.5 text-[10px]"><Download size={13} /> Export Settings</button>
                <label className="luxury-button-secondary inline-flex cursor-pointer items-center gap-1.5 text-[10px]">
                  <Upload size={13} /> Import Settings
                  <input type="file" accept="application/json" hidden onChange={e => { const f = e.target.files?.[0]; if (f) importSettings(f); e.target.value = ''; }} />
                </label>
                <span className="text-[9px] text-muted-foreground">Secrets are never exported.</span>
              </div>
            </div>
          )}

          {/* Custom fields builder */}
          <div className="space-y-3 border border-border p-4">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Custom Fields</p>
              <button type="button" onClick={() => setCustomFields([...customFields, { key: '', label: '', type: 'text' }])} className="luxury-button-secondary inline-flex items-center gap-1 text-[10px]"><Plus size={12} /> Add Field</button>
            </div>
            {customFields.length === 0 && <p className="text-[10px] text-muted-foreground">No extra fields. Add gateway-specific config keys here.</p>}
            {customFields.map((f, i) => (
              <div key={i} className="grid grid-cols-12 items-center gap-2">
                <input value={f.label} onChange={e => { const n = [...customFields]; n[i] = { ...f, label: e.target.value, key: f.key || slugify(e.target.value) }; setCustomFields(n); }} className="luxury-input col-span-4" placeholder="Label" />
                <input value={f.key} onChange={e => { const n = [...customFields]; n[i] = { ...f, key: slugify(e.target.value) }; setCustomFields(n); }} className="luxury-input col-span-4" placeholder="key" />
                <select value={f.type} onChange={e => { const n = [...customFields]; n[i] = { ...f, type: e.target.value as CustomField['type'] }; setCustomFields(n); }} className="luxury-input col-span-3">
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="textarea">Textarea</option>
                </select>
                <button type="button" onClick={() => setCustomFields(customFields.filter((_, x) => x !== i))} className="col-span-1 text-destructive hover:opacity-70"><Trash2 size={15} /></button>
              </div>
            ))}
          </div>

          {/* Business rules */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 border border-border p-4">
            <div>
              <Lbl>Min Order (৳)</Lbl>
              <input type="number" value={d.min_order_amount ?? 0} onChange={e => set({ min_order_amount: parseInt(e.target.value) || 0 })} className="luxury-input" />
            </div>
            <div>
              <Lbl>Max Order (৳)</Lbl>
              <input type="number" value={d.max_order_amount ?? ''} onChange={e => set({ max_order_amount: e.target.value ? parseInt(e.target.value) : null })} className="luxury-input" placeholder="none" />
            </div>
            <div>
              <Lbl>Extra Charge (৳)</Lbl>
              <input type="number" value={d.extra_charge ?? 0} onChange={e => set({ extra_charge: parseInt(e.target.value) || 0 })} className="luxury-input" />
            </div>
            <div>
              <Lbl>Discount</Lbl>
              <div className="flex gap-1">
                <select value={d.discount_type || ''} onChange={e => set({ discount_type: (e.target.value || null) as any })} className="luxury-input w-20">
                  <option value="">none</option>
                  <option value="percentage">%</option>
                  <option value="fixed">৳</option>
                </select>
                <input type="number" value={d.discount_value ?? 0} onChange={e => set({ discount_value: parseInt(e.target.value) || 0 })} className="luxury-input flex-1" />
              </div>
            </div>
          </div>

          {/* Enable toggle */}
          <div className="flex items-center justify-between border border-border p-4">
            <div>
              <p className="text-sm">Status</p>
              <p className="text-[10px] text-muted-foreground">{d.is_active ? 'Visible at checkout' : 'Hidden from customers'}</p>
            </div>
            <Toggle checked={!!d.is_active} onChange={v => set({ is_active: v })} />
          </div>
        </div>

        <div className="sticky bottom-0 flex items-center justify-end gap-2 border-t border-border bg-background px-5 py-3">
          <button onClick={onClose} className="luxury-button-secondary text-[11px]">Cancel</button>
          <button onClick={save} disabled={pending} className="luxury-button-primary inline-flex items-center gap-2 text-[11px]">
            {pending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} {isEdit ? 'Save Changes' : 'Create Gateway'}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

// ------------------------------------------------------------------
// Card
// ------------------------------------------------------------------
const GatewayCard = ({ gw, txnCount, onEdit, onDuplicate, onDelete }: {
  gw: PaymentGatewayRow; txnCount: number;
  onEdit: () => void; onDuplicate: () => void; onDelete: () => void;
}) => {
  const update = useUpdatePaymentGateway();
  const toggle = (v: boolean) => update.mutate({ id: gw.id, is_active: v });
  const hasTxns = txnCount > 0;

  return (
    <div className="border border-border p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-border bg-muted/30 text-lg overflow-hidden">
            {gw.icon && /^https?:\/\//.test(gw.icon) ? <img src={gw.icon} alt="" className="h-full w-full object-contain" /> : <span>{gw.icon || '🧾'}</span>}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{gw.display_name}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
              {TYPE_LABELS[(gw.gateway_type as GatewayType)] || gw.gateway_type} · {gw.slug}
              {gw.is_builtin && ' · built-in'}
            </p>
            {gw.gateway_type === 'automated' && (
              <div className="mt-1 flex flex-wrap items-center gap-1.5">
                <span className={`text-[8px] px-1.5 py-0.5 rounded border uppercase font-semibold tracking-wide ${gw.mode === 'live' ? 'bg-red-500/10 text-red-600 border-red-500/40' : 'bg-amber-500/10 text-amber-600 border-amber-500/30'}`}>{gw.mode}</span>
                <span className="inline-flex items-center gap-0.5 text-[9px] text-muted-foreground" title="SSL health (last test)">
                  {gw.last_test_ok == null ? <ShieldQuestion size={10} />
                    : gw.last_test_ok ? <ShieldCheck size={10} className="text-green-600" />
                    : <ShieldAlert size={10} className="text-destructive" />}
                  {gw.last_test_ok == null ? 'untested' : gw.last_test_ok ? 'healthy' : 'failing'}
                </span>
              </div>
            )}
          </div>
        </div>
        <Toggle checked={gw.is_active} onChange={toggle} disabled={update.isPending} />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground">
          {txnCount} transaction{txnCount === 1 ? '' : 's'}
          {gw.last_payment_at && ` · last paid ${new Date(gw.last_payment_at).toLocaleDateString()}`}
        </span>
        <div className="flex items-center gap-1">
          <button onClick={onEdit} title="Edit" className="p-1.5 text-muted-foreground hover:text-foreground"><Pencil size={15} /></button>
          <button onClick={onDuplicate} title="Duplicate" className="p-1.5 text-muted-foreground hover:text-foreground"><Copy size={15} /></button>
          <button
            onClick={onDelete}
            title={hasTxns ? 'Has transaction history — disable instead' : 'Delete'}
            className={`p-1.5 ${gw.is_builtin || hasTxns ? 'text-muted-foreground/40 cursor-not-allowed' : 'text-destructive hover:opacity-70'}`}
            disabled={gw.is_builtin}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ------------------------------------------------------------------
// Manager
// ------------------------------------------------------------------
const GatewayManager = () => {
  const { data: gateways = [], isLoading } = usePaymentGateways();
  const { data: txnCounts = {} } = useGatewayTxnCounts();
  const del = useDeletePaymentGateway();
  const [editing, setEditing] = useState<Partial<PaymentGatewayRow> | null>(null);
  const [confirmDel, setConfirmDel] = useState<PaymentGatewayRow | null>(null);

  const handleDuplicate = (gw: PaymentGatewayRow) => {
    const { id, created_at, updated_at, ...rest } = gw;
    setEditing({
      ...rest,
      display_name: `${gw.display_name} (Copy)`,
      slug: `${gw.slug}_copy`,
      gateway: `${gw.slug}_copy`,
      is_active: false,
      is_builtin: false,
    });
  };

  const handleDelete = (gw: PaymentGatewayRow) => {
    if (gw.is_builtin) { toast.error('Built-in gateways cannot be deleted. Disable it instead.'); return; }
    if ((txnCounts[gw.gateway] || 0) > 0) {
      toast.error('This gateway contains transaction history. Please disable it instead.');
      return;
    }
    setConfirmDel(gw);
  };

  const confirmDelete = async () => {
    if (!confirmDel) return;
    try {
      await del.mutateAsync(confirmDel);
      toast.success('Gateway deleted');
      setConfirmDel(null);
    } catch (e: any) {
      toast.error(e.message || 'Delete failed');
      setConfirmDel(null);
    }
  };

  if (isLoading) return <div className="flex items-center gap-2 text-xs text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">Payment Gateways</p>
          <p className="text-[11px] text-muted-foreground">Manage online, manual & COD methods. Green = Enabled, Red = Disabled.</p>
        </div>
        <div className="flex gap-2">
          <select
            onChange={e => {
              const preset = MANUAL_PRESETS.find(p => p.slug === e.target.value);
              if (preset) setEditing({ ...preset, gateway: preset.slug, gateway_type: 'manual', is_active: false });
              e.target.value = '';
            }}
            defaultValue=""
            className="luxury-input text-[11px] w-44"
          >
            <option value="">+ Quick Manual Preset</option>
            {MANUAL_PRESETS.map(p => <option key={p.slug} value={p.slug}>{p.display_name}</option>)}
          </select>
          <button onClick={() => setEditing({})} className="luxury-button-primary inline-flex items-center gap-2 text-[11px]"><Plus size={14} /> New Gateway</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {gateways.map(gw => (
          <GatewayCard
            key={gw.id}
            gw={gw}
            txnCount={txnCounts[gw.gateway] || 0}
            onEdit={() => setEditing(gw)}
            onDuplicate={() => handleDuplicate(gw)}
            onDelete={() => handleDelete(gw)}
          />
        ))}
      </div>

      {editing && <GatewayEditor initial={editing} onClose={() => setEditing(null)} />}

      {confirmDel && createPortal(
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm border border-border bg-background p-5 shadow-xl space-y-4">
            <p className="text-sm font-medium">Delete “{confirmDel.display_name}”?</p>
            <p className="text-xs text-muted-foreground">This permanently removes the gateway. This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setConfirmDel(null)} className="luxury-button-secondary text-[11px]">Cancel</button>
              <button onClick={confirmDelete} disabled={del.isPending} className="inline-flex items-center gap-2 border border-destructive bg-destructive/10 px-3 py-1.5 text-[11px] text-destructive hover:bg-destructive/20">
                {del.isPending ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />} Delete
              </button>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
};

export default GatewayManager;