import { useState } from 'react';
import { Loader2, CheckCircle2, XCircle, Clock, Banknote, Image as ImageIcon, History as HistoryIcon } from 'lucide-react';
import { toast } from 'sonner';
import {
  useOrderTransactions, useSetTransactionStatus, usePaymentStatusHistory,
  PaymentTransactionRow,
} from '@/hooks/usePayments';
import { getProofSignedUrl } from '@/lib/payments';
import { getPaymentStatusStyle } from '@/lib/paymentMethods';

const dotColor: Record<string, string> = {
  success: 'bg-green-500',
  paid: 'bg-green-500',
  submitted: 'bg-blue-500',
  pending: 'bg-amber-500',
  failed: 'bg-destructive',
  cancelled: 'bg-muted-foreground',
  refunded: 'bg-purple-500',
};

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    success: 'text-green-600 border-green-500/40 bg-green-500/10',
    submitted: 'text-blue-600 border-blue-500/40 bg-blue-500/10',
    pending: 'text-amber-600 border-amber-500/40 bg-amber-500/10',
    failed: 'text-destructive border-destructive/40 bg-destructive/10',
    cancelled: 'text-muted-foreground border-border bg-muted',
    refunded: 'text-purple-600 border-purple-500/40 bg-purple-500/10',
  };
  return <span className={`text-[9px] uppercase tracking-wide px-1.5 py-0.5 border rounded ${map[status] || 'text-muted-foreground border-border'}`}>{status}</span>;
};

const ProofViewer = ({ path }: { path: string }) => {
  const [loading, setLoading] = useState(false);
  const open = async () => {
    setLoading(true);
    try {
      const url = await getProofSignedUrl(path);
      if (url) window.open(url, '_blank', 'noopener');
      else toast.error('Could not load screenshot');
    } finally { setLoading(false); }
  };
  return (
    <button onClick={open} disabled={loading} className="inline-flex items-center gap-1 text-[10px] px-2 py-1 border border-border hover:bg-accent transition-colors">
      {loading ? <Loader2 size={11} className="animate-spin" /> : <ImageIcon size={11} />} View Screenshot
    </button>
  );
};

const OrderPaymentTimeline = ({ orderId }: { orderId: string }) => {
  const { data: txns = [], isLoading } = useOrderTransactions(orderId);
  const { data: history = [] } = usePaymentStatusHistory(orderId);
  const setStatus = useSetTransactionStatus();
  const [noteFor, setNoteFor] = useState<string | null>(null);
  const [note, setNote] = useState('');

  // Change a transaction's status. If the payment was already verified/paid,
  // require an explicit confirmation before overriding it.
  const change = async (t: PaymentTransactionRow, status: string, reason?: string, ok?: string) => {
    const wasVerified = t.status === 'success';
    if (wasVerified && !window.confirm('You are changing a previously verified payment. Continue?')) return;
    try {
      await setStatus.mutateAsync({ id: t.id, status, reason });
      toast.success(ok || 'Payment status updated');
      setNoteFor(null); setNote('');
    } catch (e: any) {
      toast.error(e.message || 'Action failed');
    }
  };

  return (
    <div className="border border-border rounded-lg p-3 mt-3 space-y-3">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Banknote size={12} /> Payment Timeline</div>
      {isLoading ? (
        <div className="flex items-center gap-2 text-xs text-muted-foreground"><Loader2 size={12} className="animate-spin" /> Loading…</div>
      ) : txns.length === 0 ? (
        <p className="text-[11px] text-muted-foreground">No payment transactions recorded for this order.</p>
      ) : (
        <ol className="relative border-l border-border ml-1.5 space-y-3">
          {txns.map((t: PaymentTransactionRow) => (
            <li key={t.id} className="ml-4">
              <span className={`absolute -left-[5px] w-2.5 h-2.5 rounded-full ${dotColor[t.status] || 'bg-muted-foreground'}`} />
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium uppercase">{t.gateway}{t.is_advance ? ' (adv)' : ''}</span>
                <span className="text-xs">৳{t.amount.toLocaleString()}</span>
                <StatusBadge status={t.status} />
                <span className="text-[10px] text-muted-foreground ml-auto">{new Date(t.created_at).toLocaleString()}</span>
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5 space-y-0.5">
                {t.gateway_txn_id && <p>Txn: <span className="font-mono">{t.gateway_txn_id}</span></p>}
                {t.sender_number && <p>Sender: {t.sender_number}</p>}
                {t.error_message && <p className="text-destructive">{t.error_message}</p>}
                {t.admin_note && <p className="italic">Note: {t.admin_note}</p>}
              </div>

              {/* Reversible status controls — always available, any transition allowed. */}
              <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                {t.proof_url && <ProofViewer path={t.proof_url} />}
                <button
                  disabled={setStatus.isPending || t.status === 'success'}
                  onClick={() => change(t, 'success', undefined, 'Payment verified')}
                  className="inline-flex items-center gap-1 text-[10px] px-2 py-1 border border-green-500/40 text-green-600 hover:bg-green-500/10 disabled:opacity-40">
                  <CheckCircle2 size={11} /> Verify
                </button>
                <button
                  disabled={setStatus.isPending}
                  onClick={() => { setNoteFor(t.id === noteFor ? null : t.id); setNote(''); }}
                  className="inline-flex items-center gap-1 text-[10px] px-2 py-1 border border-destructive/40 text-destructive hover:bg-destructive/10 disabled:opacity-40">
                  <XCircle size={11} /> Reject
                </button>
                <button
                  disabled={setStatus.isPending || t.status === 'submitted'}
                  onClick={() => change(t, 'submitted', undefined, 'Set to pending verification')}
                  className="inline-flex items-center gap-1 text-[10px] px-2 py-1 border border-amber-500/40 text-amber-600 hover:bg-amber-500/10 disabled:opacity-40">
                  <Clock size={11} /> Pending
                </button>
              </div>

              {noteFor === t.id && (
                <div className="flex items-center gap-1.5 mt-1.5">
                  <input value={note} onChange={e => setNote(e.target.value)} placeholder="Rejection reason (optional)" className="luxury-input flex-1 text-[11px] py-1" />
                  <button
                    onClick={() => change(t, 'failed', note || 'Rejected by admin', 'Payment rejected')}
                    className="text-[10px] px-2 py-1 border border-destructive/40 text-destructive hover:bg-destructive/10">Confirm</button>
                </div>
              )}
            </li>
          ))}
        </ol>
      )}

      {/* Immutable payment status history */}
      {history.length > 0 && (
        <div className="pt-2 border-t border-border">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2"><HistoryIcon size={12} /> Payment History</div>
          <ol className="relative border-l border-border ml-1.5 space-y-2.5">
            {history.map((h) => {
              const st = getPaymentStatusStyle(h.new_status);
              return (
                <li key={h.id} className="ml-4">
                  <span className="absolute -left-[5px] w-2.5 h-2.5 rounded-full" style={{ background: st.dot }} />
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[9px] uppercase tracking-wide px-1.5 py-0.5 rounded ${st.badge}`}>{st.label}</span>
                    {h.old_status && <span className="text-[10px] text-muted-foreground">from {h.old_status}</span>}
                    <span className="text-[10px] text-muted-foreground ml-auto">{new Date(h.created_at).toLocaleString()}</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">
                    {h.changed_by_email && <span>By: {h.changed_by_email}</span>}
                    {h.reason && <span className="italic block">Reason: {h.reason}</span>}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </div>
  );
};

export default OrderPaymentTimeline;
