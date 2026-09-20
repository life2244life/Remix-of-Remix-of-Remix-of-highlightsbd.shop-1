import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Trash2, Mail, Download, Users, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

interface Subscriber { id: string; email: string; created_at: string; source: string | null }

const SOURCE_LABELS: Record<string, string> = {
  homepage: 'Homepage', blog: 'Blog', footer: 'Footer', checkout: 'Checkout', general: 'General',
};

const AdminNewsletter = () => {
  const queryClient = useQueryClient();

  const { data: subscribers, isLoading } = useQuery({
    queryKey: ['admin-newsletter'],
    queryFn: async () => {
      const { data, error } = await supabase.from('newsletter_subscribers').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as Subscriber[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('newsletter_subscribers').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-newsletter'] }); toast.success('Subscriber removed'); },
    onError: (err: any) => toast.error(err.message),
  });

  const analytics = useMemo(() => {
    const list = subscribers || [];
    const bySource: Record<string, number> = {};
    list.forEach((s) => { const key = s.source || 'general'; bySource[key] = (bySource[key] || 0) + 1; });

    // Last 6 months growth
    const months: { label: string; key: string; count: number }[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({ label: d.toLocaleDateString('en-US', { month: 'short' }), key: `${d.getFullYear()}-${d.getMonth()}`, count: 0 });
    }
    list.forEach((s) => {
      const d = new Date(s.created_at);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const m = months.find((x) => x.key === key);
      if (m) m.count += 1;
    });
    const maxMonth = Math.max(1, ...months.map((m) => m.count));
    return { total: list.length, bySource, months, maxMonth };
  }, [subscribers]);

  const handleExport = () => {
    if (!subscribers?.length) return;
    const csv = 'Email,Source,Subscribed At\n' + subscribers.map((s) => `${s.email},${s.source || 'general'},${new Date(s.created_at).toISOString()}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'newsletter-subscribers.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-light tracking-wide" style={{ fontFamily: 'var(--font-display)' }}>Newsletter Subscribers</h2>
          <p className="text-xs text-muted-foreground mt-1">মোট {analytics.total} জন subscribe করেছে</p>
        </div>
        {analytics.total > 0 && (
          <button onClick={handleExport} className="luxury-button-outline inline-flex items-center gap-2 text-[10px]"><Download size={14} /> Export CSV</button>
        )}
      </div>

      {/* Analytics */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="border border-border p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground tracking-wider uppercase"><Users size={14} /> Total</div>
          <p className="text-3xl font-light mt-2">{analytics.total}</p>
        </div>
        <div className="border border-border p-4 md:col-span-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground tracking-wider uppercase mb-3">By Source</div>
          <div className="flex flex-wrap gap-2">
            {Object.keys(analytics.bySource).length === 0 && <span className="text-xs text-muted-foreground">No data</span>}
            {Object.entries(analytics.bySource).sort((a, b) => b[1] - a[1]).map(([src, n]) => (
              <span key={src} className="inline-flex items-center gap-1.5 border border-border px-2.5 py-1 text-xs">
                {SOURCE_LABELS[src] || src} <strong className="font-medium">{n}</strong>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly growth */}
      <div className="border border-border p-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground tracking-wider uppercase mb-4"><TrendingUp size={14} /> Monthly Growth (last 6 months)</div>
        <div className="flex items-end gap-3 h-32">
          {analytics.months.map((m) => (
            <div key={m.key} className="flex-1 flex flex-col items-center gap-1.5">
              <span className="text-[10px] text-muted-foreground">{m.count}</span>
              <div className="w-full bg-foreground/80 transition-all" style={{ height: `${(m.count / analytics.maxMonth) * 100}%`, minHeight: m.count > 0 ? '4px' : '0' }} />
              <span className="text-[10px] text-muted-foreground">{m.label}</span>
            </div>
          ))}
        </div>
      </div>

      {!subscribers?.length ? (
        <div className="text-center py-12"><Mail size={32} className="mx-auto text-muted-foreground/30 mb-3" /><p className="text-sm text-muted-foreground">No subscribers yet</p></div>
      ) : (
        <div className="border border-border">
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-3 p-3 border-b border-border bg-secondary/30 text-xs text-muted-foreground tracking-wider uppercase"><span>Email</span><span>Source</span><span>Date</span><span></span></div>
          {subscribers.map((sub) => (
            <div key={sub.id} className="grid grid-cols-[1fr_auto_auto_auto] gap-3 p-3 border-b border-border last:border-0 items-center">
              <span className="text-sm truncate">{sub.email}</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{SOURCE_LABELS[sub.source || 'general'] || sub.source}</span>
              <span className="text-xs text-muted-foreground">{new Date(sub.created_at).toLocaleDateString()}</span>
              <button onClick={() => deleteMutation.mutate(sub.id)} disabled={deleteMutation.isPending} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminNewsletter;
