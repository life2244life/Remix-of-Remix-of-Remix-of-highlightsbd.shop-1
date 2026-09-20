import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Save, Plus, Trash2, CheckCircle2, XCircle, RefreshCw, CreditCard, MapPin, ReceiptText, Undo2, BarChart3, SlidersHorizontal, Loader2, Image as ImageIcon, ScrollText } from 'lucide-react';
import {
  usePaymentTransactions,
  useFinalizeTransaction, useRejectTransaction,
  usePaymentRefunds, useCreateRefund, useUpdateRefund,
  useCodDistrictRules, useUpsertCodRule, useDeleteCodRule, CodDistrictRuleRow,
  usePaymentAuditLog, PaymentAuditRow,
} from '@/hooks/usePayments';
import { getProofSignedUrl } from '@/lib/payments';
import { useStoreSettings, useUpdateStoreSetting } from '@/hooks/useSupabase';
import GatewayManager from './GatewayManager';

const StatusPill = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    success: 'bg-green-500/10 text-green-600 border-green-500/30',
    paid: 'bg-green-500/10 text-green-600 border-green-500/30',
    completed: 'bg-green-500/10 text-green-600 border-green-500/30',
    pending: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
    partial: 'bg-blue-500/10 text-blue-600 border-blue-500/30',
    requested: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
    processing: 'bg-blue-500/10 text-blue-600 border-blue-500/30',
    approved: 'bg-blue-500/10 text-blue-600 border-blue-500/30',
    failed: 'bg-destructive/10 text-destructive border-destructive/30',
    cancelled: 'bg-muted text-muted-foreground border-border',
    rejected: 'bg-destructive/10 text-destructive border-destructive/30',
    refunded: 'bg-purple-500/10 text-purple-600 border-purple-500/30',
  };
  return <span className={`inline-block text-[10px] px-2 py-0.5 rounded border uppercase tracking-wide ${map[status] || 'bg-muted text-muted-foreground border-border'}`}>{status}</span>;
};

type Sub = 'gateways' | 'rules' | 'cod' | 'transactions' | 'refunds' | 'analytics' | 'audit';

const SUBS: { key: Sub; label: string; icon: any }[] = [
  { key: 'gateways', label: 'Gateways', icon: CreditCard },
  { key: 'rules', label: 'Business Rules', icon: SlidersHorizontal },
  { key: 'cod', label: 'COD Districts', icon: MapPin },
  { key: 'transactions', label: 'Transactions', icon: ReceiptText },
  { key: 'refunds', label: 'Refunds', icon: Undo2 },
  { key: 'analytics', label: 'Analytics', icon: BarChart3 },
  { key: 'audit', label: 'Audit Log', icon: ScrollText },
];

// ---------------- Business Rules ----------------
const RulesTab = () => {
  const { data: settings = {} } = useStoreSettings();
  const update = useUpdateStoreSetting();
  const [minOrder, setMinOrder] = useState(settings.payment_min_order_amount ?? '0');
  const [freeShip, setFreeShip] = useState(settings.payment_free_shipping_threshold ?? '0');
  const [advEnabled, setAdvEnabled] = useState((settings.payment_advance_enabled ?? 'false') === 'true');
  const [advPercent, setAdvPercent] = useState(settings.payment_advance_percent ?? '0');
  const [codEnabled, setCodEnabled] = useState((settings.payment_cod_enabled ?? 'true') === 'true');

  const save = async () => {
    try {
      await Promise.all([
        update.mutateAsync({ key: 'payment_min_order_amount', value: String(parseInt(minOrder) || 0) }),
        update.mutateAsync({ key: 'payment_free_shipping_threshold', value: String(parseInt(freeShip) || 0) }),
        update.mutateAsync({ key: 'payment_advance_enabled', value: String(advEnabled) }),
        update.mutateAsync({ key: 'payment_advance_percent', value: String(Math.min(100, Math.max(0, parseInt(advPercent) || 0))) }),
        update.mutateAsync({ key: 'payment_cod_enabled', value: String(codEnabled) }),
      ]);
      toast.success('Business rules saved');
    } catch (e: any) { toast.error(e.message || 'Save failed'); }
  };

  return (
    <div className="max-w-2xl space-y-5 border border-border p-6">
      <Field label="Minimum Order Amount (৳)" hint="0 = no minimum. Orders below this are blocked at checkout.">
        <input type="number" value={minOrder} onChange={e => setMinOrder(e.target.value)} className="luxury-input" />
      </Field>
      <Field label="Free Shipping Threshold (৳)" hint="0 = disabled. Orders at/above this get free delivery.">
        <input type="number" value={freeShip} onChange={e => setFreeShip(e.target.value)} className="luxury-input" />
      </Field>
      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input type="checkbox" checked={codEnabled} onChange={e => setCodEnabled(e.target.checked)} className="accent-foreground" />
        Cash on Delivery globally enabled
      </label>
      <hr className="border-border" />
      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input type="checkbox" checked={advEnabled} onChange={e => setAdvEnabled(e.target.checked)} className="accent-foreground" />
        Enable advance / partial payment
      </label>
      {advEnabled && (
        <Field label="Advance Payment (% of total)" hint="Customer pays this % online now; remainder on delivery.">
          <input type="number" min={0} max={100} value={advPercent} onChange={e => setAdvPercent(e.target.value)} className="luxury-input" />
        </Field>
      )}
      <button onClick={save} disabled={update.isPending} className="luxury-button-primary inline-flex items-center gap-2 text-[11px]">
        <Save size={14} /> Save Rules
      </button>
    </div>
  );
};

// ---------------- COD Districts ----------------
const CodTab = () => {
  const { data: rules = [], isLoading } = useCodDistrictRules();
  const upsert = useUpsertCodRule();
  const del = useDeleteCodRule();
  const [draft, setDraft] = useState({ district: '', cod_allowed: true, advance_required: false, advance_amount: 0, note: '' });

  const add = async () => {
    if (!draft.district.trim()) { toast.error('Enter a district name'); return; }
    try {
      await upsert.mutateAsync({ ...draft, district: draft.district.trim() });
      toast.success('District rule saved');
      setDraft({ district: '', cod_allowed: true, advance_required: false, advance_amount: 0, note: '' });
    } catch (e: any) { toast.error(e.message || 'Failed'); }
  };

  const toggle = async (r: CodDistrictRuleRow, patch: Partial<CodDistrictRuleRow>) => {
    try { await upsert.mutateAsync({ ...r, ...patch }); } catch (e: any) { toast.error(e.message); }
  };

  if (isLoading) return <Loading />;
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="border border-border p-5 space-y-3">
        <p className="text-sm font-medium">Add / Update District Rule</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input value={draft.district} onChange={e => setDraft({ ...draft, district: e.target.value })} placeholder="District / City (e.g. Bandarban)" className="luxury-input" />
          <input type="number" value={draft.advance_amount} onChange={e => setDraft({ ...draft, advance_amount: parseInt(e.target.value) || 0 })} placeholder="Advance amount (৳)" className="luxury-input" />
        </div>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={draft.cod_allowed} onChange={e => setDraft({ ...draft, cod_allowed: e.target.checked })} className="accent-foreground" /> COD allowed</label>
          <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={draft.advance_required} onChange={e => setDraft({ ...draft, advance_required: e.target.checked })} className="accent-foreground" /> Advance required</label>
        </div>
        <input value={draft.note} onChange={e => setDraft({ ...draft, note: e.target.value })} placeholder="Note (optional)" className="luxury-input" />
        <button onClick={add} disabled={upsert.isPending} className="luxury-button-primary inline-flex items-center gap-2 text-[11px]"><Plus size={14} /> Save District</button>
      </div>

      <div className="border border-border divide-y divide-border">
        {rules.length === 0 && <p className="p-4 text-xs text-muted-foreground">No district rules yet. By default COD is allowed everywhere.</p>}
        {rules.map(r => (
          <div key={r.id} className="p-4 flex flex-wrap items-center gap-3">
            <div className="min-w-[140px]">
              <p className="text-sm font-medium">{r.district}</p>
              {r.note && <p className="text-[11px] text-muted-foreground">{r.note}</p>}
            </div>
            <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={r.cod_allowed} onChange={e => toggle(r, { cod_allowed: e.target.checked })} className="accent-foreground" /> COD</label>
            <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={r.advance_required} onChange={e => toggle(r, { advance_required: e.target.checked })} className="accent-foreground" /> Advance req.</label>
            <span className="text-xs text-muted-foreground">৳{r.advance_amount}</span>
            <button onClick={() => del.mutate(r.id)} className="ml-auto text-destructive hover:opacity-70"><Trash2 size={15} /></button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ---------------- Transactions ----------------
const TransactionsTab = () => {
  const { data: txns = [], isLoading } = usePaymentTransactions();
  const finalize = useFinalizeTransaction();
  const reject = useRejectTransaction();
  const [proofLoading, setProofLoading] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  const filtered = useMemo(() => filter === 'all' ? txns : txns.filter(t => t.status === filter), [txns, filter]);

  const act = async (fn: () => Promise<any>, ok: string) => {
    try { await fn(); toast.success(ok); } catch (e: any) { toast.error(e.message || 'Action failed'); }
  };

  const viewProof = async (path: string) => {
    setProofLoading(path);
    try {
      const url = await getProofSignedUrl(path);
      if (url) window.open(url, '_blank', 'noopener'); else toast.error('Could not load screenshot');
    } finally { setProofLoading(null); }
  };

  if (isLoading) return <Loading />;
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {['all', 'submitted', 'pending', 'success', 'failed', 'cancelled', 'refunded'].map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`text-[11px] px-3 py-1.5 border capitalize ${filter === s ? 'border-foreground bg-muted' : 'border-border text-muted-foreground hover:border-muted-foreground'}`}>{s}</button>
        ))}
      </div>
      <div className="border border-border overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-muted/40 text-left">
            <tr>
              <th className="p-2.5 font-medium">Date</th>
              <th className="p-2.5 font-medium">Gateway</th>
              <th className="p-2.5 font-medium">Amount</th>
              <th className="p-2.5 font-medium">Txn Ref</th>
              <th className="p-2.5 font-medium">Phone</th>
              <th className="p-2.5 font-medium">Proof</th>
              <th className="p-2.5 font-medium">Status</th>
              <th className="p-2.5 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 && <tr><td colSpan={8} className="p-4 text-muted-foreground text-center">No transactions.</td></tr>}
            {filtered.map(t => (
              <tr key={t.id}>
                <td className="p-2.5 whitespace-nowrap">{new Date(t.created_at).toLocaleString()}</td>
                <td className="p-2.5 uppercase">{t.gateway}{t.is_advance ? ' (adv)' : ''}</td>
                <td className="p-2.5">৳{t.amount}</td>
                <td className="p-2.5 font-mono">{t.gateway_txn_id || '—'}</td>
                <td className="p-2.5">{t.customer_phone || t.sender_number || '—'}</td>
                <td className="p-2.5">
                  {t.proof_url ? (
                    <button onClick={() => viewProof(t.proof_url!)} disabled={proofLoading === t.proof_url} title="View screenshot" className="inline-flex items-center gap-1 text-primary hover:opacity-70">
                      {proofLoading === t.proof_url ? <Loader2 size={14} className="animate-spin" /> : <ImageIcon size={14} />}
                    </button>
                  ) : '—'}
                </td>
                <td className="p-2.5"><StatusPill status={t.status} /></td>
                <td className="p-2.5">
                  {(t.status === 'submitted' || t.status === 'pending') && (
                    <div className="flex gap-1.5">
                      <button onClick={() => act(() => finalize.mutateAsync({ id: t.id }), 'Payment verified')} title="Verify & finalize" className="text-green-600 hover:opacity-70"><CheckCircle2 size={15} /></button>
                      <button onClick={() => act(() => reject.mutateAsync({ id: t.id, orderId: t.order_id, note: 'Rejected by admin' }), 'Payment rejected')} title="Reject" className="text-destructive hover:opacity-70"><XCircle size={15} /></button>
                      <button onClick={() => act(() => reject.mutateAsync({ id: t.id, orderId: t.order_id, resubmit: true, note: 'Please resubmit payment proof' }), 'Resubmission requested')} title="Request resubmission" className="text-amber-600 hover:opacity-70"><RefreshCw size={15} /></button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ---------------- Refunds ----------------
const RefundsTab = () => {
  const { data: refunds = [], isLoading } = usePaymentRefunds();
  const { data: txns = [] } = usePaymentTransactions();
  const create = useCreateRefund();
  const update = useUpdateRefund();
  const [draft, setDraft] = useState({ transaction_id: '', amount: 0, reason: '' });

  const submit = async () => {
    const txn = txns.find(t => t.id === draft.transaction_id);
    if (!txn) { toast.error('Select a transaction'); return; }
    try {
      await create.mutateAsync({ order_id: txn.order_id, transaction_id: txn.id, gateway: txn.gateway, amount: draft.amount || txn.amount, reason: draft.reason, status: 'requested' });
      toast.success('Refund requested');
      setDraft({ transaction_id: '', amount: 0, reason: '' });
    } catch (e: any) { toast.error(e.message || 'Failed'); }
  };

  if (isLoading) return <Loading />;
  const successful = txns.filter(t => t.status === 'success');
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="border border-border p-5 space-y-3">
        <p className="text-sm font-medium">Request Refund</p>
        <select value={draft.transaction_id} onChange={e => setDraft({ ...draft, transaction_id: e.target.value })} className="luxury-input">
          <option value="">Select successful transaction…</option>
          {successful.map(t => <option key={t.id} value={t.id}>{t.gateway.toUpperCase()} • ৳{t.amount} • {new Date(t.created_at).toLocaleDateString()} • {t.gateway_txn_id || t.id.slice(0, 8)}</option>)}
        </select>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input type="number" value={draft.amount || ''} onChange={e => setDraft({ ...draft, amount: parseInt(e.target.value) || 0 })} placeholder="Refund amount (blank = full)" className="luxury-input" />
          <input value={draft.reason} onChange={e => setDraft({ ...draft, reason: e.target.value })} placeholder="Reason" className="luxury-input" />
        </div>
        <button onClick={submit} disabled={create.isPending} className="luxury-button-primary inline-flex items-center gap-2 text-[11px]"><Undo2 size={14} /> Request Refund</button>
      </div>

      <div className="border border-border divide-y divide-border">
        {refunds.length === 0 && <p className="p-4 text-xs text-muted-foreground">No refunds yet.</p>}
        {refunds.map(r => (
          <div key={r.id} className="p-4 flex flex-wrap items-center gap-3">
            <div className="min-w-[120px]">
              <p className="text-sm">৳{r.amount} <span className="uppercase text-[10px] text-muted-foreground">{r.gateway}</span></p>
              {r.reason && <p className="text-[11px] text-muted-foreground">{r.reason}</p>}
            </div>
            <StatusPill status={r.status} />
            <span className="text-[10px] text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</span>
            <div className="ml-auto flex gap-1">
              {['requested', 'approved', 'processing'].includes(r.status) && (
                <>
                  <button onClick={() => update.mutate({ id: r.id, status: 'completed' })} className="text-[10px] px-2 py-1 border border-green-500/40 text-green-600 hover:bg-green-500/10">Complete</button>
                  <button onClick={() => update.mutate({ id: r.id, status: 'rejected' })} className="text-[10px] px-2 py-1 border border-destructive/40 text-destructive hover:bg-destructive/10">Reject</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ---------------- Analytics ----------------
const AnalyticsTab = () => {
  const { data: txns = [], isLoading } = usePaymentTransactions(1000);
  const stats = useMemo(() => {
    const success = txns.filter(t => t.status === 'success');
    const revenue = success.reduce((s, t) => s + t.amount, 0);
    const byGateway: Record<string, { count: number; revenue: number }> = {};
    for (const t of success) {
      byGateway[t.gateway] = byGateway[t.gateway] || { count: 0, revenue: 0 };
      byGateway[t.gateway].count++; byGateway[t.gateway].revenue += t.amount;
    }
    const attempts = txns.length;
    const rate = attempts ? Math.round((success.length / attempts) * 100) : 0;
    return { revenue, count: success.length, attempts, rate, byGateway };
  }, [txns]);

  if (isLoading) return <Loading />;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Online Revenue" value={`৳${stats.revenue.toLocaleString()}`} />
        <Stat label="Successful Payments" value={String(stats.count)} />
        <Stat label="Total Attempts" value={String(stats.attempts)} />
        <Stat label="Success Rate" value={`${stats.rate}%`} />
      </div>
      <div className="border border-border p-5">
        <p className="text-sm font-medium mb-4">Revenue by Gateway</p>
        <div className="space-y-3">
          {Object.keys(stats.byGateway).length === 0 && <p className="text-xs text-muted-foreground">No successful payments yet.</p>}
          {Object.entries(stats.byGateway).map(([g, v]) => (
            <div key={g} className="flex items-center gap-3">
              <span className="text-xs uppercase w-24">{g}</span>
              <div className="flex-1 h-2 bg-muted rounded overflow-hidden">
                <div className="h-full bg-foreground" style={{ width: `${stats.revenue ? (v.revenue / stats.revenue) * 100 : 0}%` }} />
              </div>
              <span className="text-xs w-28 text-right">৳{v.revenue.toLocaleString()} ({v.count})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ---------------- Audit Log ----------------
const ACTION_LABELS: Record<string, { label: string; cls: string }> = {
  'gateway.create': { label: 'Gateway Created', cls: 'bg-green-500/10 text-green-600 border-green-500/30' },
  'gateway.update': { label: 'Gateway Edited', cls: 'bg-blue-500/10 text-blue-600 border-blue-500/30' },
  'gateway.delete': { label: 'Gateway Deleted', cls: 'bg-destructive/10 text-destructive border-destructive/30' },
  'gateway.enable': { label: 'Gateway Enabled', cls: 'bg-green-500/10 text-green-600 border-green-500/30' },
  'gateway.disable': { label: 'Gateway Disabled', cls: 'bg-amber-500/10 text-amber-600 border-amber-500/30' },
  'gateway.mode_live': { label: 'Switched to LIVE', cls: 'bg-red-500/10 text-red-600 border-red-500/40 font-medium' },
  'gateway.mode_sandbox': { label: 'Switched to Sandbox', cls: 'bg-amber-500/10 text-amber-600 border-amber-500/30' },
  'ssl.settings_change': { label: 'SSL Settings Changed', cls: 'bg-purple-500/10 text-purple-600 border-purple-500/30' },
  'payment.approve': { label: 'Payment Approved', cls: 'bg-green-500/10 text-green-600 border-green-500/30' },
  'payment.reject': { label: 'Payment Rejected', cls: 'bg-destructive/10 text-destructive border-destructive/30' },
  'payment.resubmit': { label: 'Resubmission Requested', cls: 'bg-amber-500/10 text-amber-600 border-amber-500/30' },
};

const AuditRow = ({ a }: { a: PaymentAuditRow }) => {
  const [open, setOpen] = useState(false);
  const meta = ACTION_LABELS[a.action] || { label: a.action, cls: 'bg-muted text-muted-foreground border-border' };
  const hasDetail = a.old_value || a.new_value;
  return (
    <>
      <tr className={hasDetail ? 'cursor-pointer hover:bg-muted/20' : ''} onClick={() => hasDetail && setOpen(o => !o)}>
        <td className="p-2.5 whitespace-nowrap">{new Date(a.created_at).toLocaleString()}</td>
        <td className="p-2.5"><span className={`inline-block text-[10px] px-2 py-0.5 rounded border uppercase tracking-wide ${meta.cls}`}>{meta.label}</span></td>
        <td className="p-2.5">{a.entity_label || a.entity_type}</td>
        <td className="p-2.5">{a.actor_email || (a.actor_id ? a.actor_id.slice(0, 8) : '—')}</td>
        <td className="p-2.5 font-mono text-[10px]">{a.ip_address || '—'}</td>
      </tr>
      {open && hasDetail && (
        <tr className="bg-muted/10">
          <td colSpan={5} className="p-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Old Value</p>
                <pre className="text-[10px] bg-background border border-border p-2 overflow-x-auto max-h-48">{a.old_value ? JSON.stringify(a.old_value, null, 2) : '—'}</pre>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">New Value</p>
                <pre className="text-[10px] bg-background border border-border p-2 overflow-x-auto max-h-48">{a.new_value ? JSON.stringify(a.new_value, null, 2) : '—'}</pre>
              </div>
            </div>
            {a.user_agent && <p className="text-[10px] text-muted-foreground mt-2 truncate">UA: {a.user_agent}</p>}
          </td>
        </tr>
      )}
    </>
  );
};

const AuditLogTab = () => {
  const { data: log = [], isLoading } = usePaymentAuditLog();
  const [filter, setFilter] = useState('all');
  const filtered = useMemo(() => filter === 'all' ? log : log.filter(a => a.action.startsWith(filter)), [log, filter]);
  if (isLoading) return <Loading />;
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {[['all', 'All'], ['gateway', 'Gateways'], ['ssl', 'SSL'], ['payment', 'Payments']].map(([k, lbl]) => (
          <button key={k} onClick={() => setFilter(k)} className={`text-[11px] px-3 py-1.5 border ${filter === k ? 'border-foreground bg-muted' : 'border-border text-muted-foreground hover:border-muted-foreground'}`}>{lbl}</button>
        ))}
      </div>
      <p className="text-[11px] text-muted-foreground">Records who changed gateways/SSL settings and who approved or rejected payments — with timestamp, IP, and before/after values. Click a row to expand.</p>
      <div className="border border-border overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-muted/40 text-left">
            <tr>
              <th className="p-2.5 font-medium">Time</th>
              <th className="p-2.5 font-medium">Action</th>
              <th className="p-2.5 font-medium">Target</th>
              <th className="p-2.5 font-medium">User</th>
              <th className="p-2.5 font-medium">IP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 && <tr><td colSpan={5} className="p-4 text-muted-foreground text-center">No audit entries yet.</td></tr>}
            {filtered.map(a => <AuditRow key={a.id} a={a} />)}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ---------------- Shared ----------------
const Loading = () => <div className="flex items-center gap-2 text-xs text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</div>;
const Field = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
  <div>
    <label className="text-[11px] text-muted-foreground uppercase tracking-wider block mb-1">{label}</label>
    {children}
    {hint && <p className="text-[10px] text-muted-foreground mt-1">{hint}</p>}
  </div>
);
const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="border border-border p-4">
    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
    <p className="text-xl font-light mt-1" style={{ fontFamily: 'var(--font-display)' }}>{value}</p>
  </div>
);

const AdminPayments = () => {
  const [sub, setSub] = useState<Sub>('gateways');
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-1 border-b border-border">
        {SUBS.map(s => (
          <button key={s.key} onClick={() => setSub(s.key)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 text-[12px] border-b-2 -mb-px transition-colors ${sub === s.key ? 'border-foreground text-foreground font-medium' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
            <s.icon size={14} /> {s.label}
          </button>
        ))}
      </div>
      {sub === 'gateways' && <GatewayManager />}
      {sub === 'rules' && <RulesTab />}
      {sub === 'cod' && <CodTab />}
      {sub === 'transactions' && <TransactionsTab />}
      {sub === 'refunds' && <RefundsTab />}
      {sub === 'analytics' && <AnalyticsTab />}
      {sub === 'audit' && <AuditLogTab />}
    </div>
  );
};

export default AdminPayments;
