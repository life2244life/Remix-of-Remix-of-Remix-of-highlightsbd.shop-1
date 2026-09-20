import { useMemo, useState } from 'react';
import {
  useEmailTemplates,
  useUpdateEmailTemplate,
  useEmailLogs,
  useAbandonedCarts,
  useSendTestEmail,
  type EmailTemplateRow,
} from '@/hooks/useEmail';
import { Loader2, Mail, Send, FileText, Activity, ShoppingCart, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

const CATEGORY_LABELS: Record<string, string> = {
  transactional: 'Transactional',
  marketing: 'Marketing',
  notification: 'Notification',
  auth: 'Authentication',
};

function statusBadge(status: string) {
  const s = (status || '').toLowerCase();
  if (s === 'sent' || s === 'delivered' || s === 'success') {
    return <Badge variant="secondary" className="gap-1 text-green-700 bg-green-100"><CheckCircle2 className="h-3 w-3" />{status}</Badge>;
  }
  if (s === 'failed' || s === 'error' || s === 'bounced') {
    return <Badge variant="secondary" className="gap-1 text-red-700 bg-red-100"><XCircle className="h-3 w-3" />{status}</Badge>;
  }
  return <Badge variant="secondary" className="gap-1 text-amber-700 bg-amber-100"><Clock className="h-3 w-3" />{status || 'pending'}</Badge>;
}

// ---------------- Template Editor ----------------
const TemplateEditor = ({ template }: { template: EmailTemplateRow }) => {
  const update = useUpdateEmailTemplate();
  const sendTest = useSendTestEmail();
  const [subject, setSubject] = useState(template.subject);
  const [htmlBody, setHtmlBody] = useState(template.html_body);
  const [textBody, setTextBody] = useState(template.text_body || '');
  const [isActive, setIsActive] = useState(template.is_active);
  const [testEmail, setTestEmail] = useState('');

  const dirty =
    subject !== template.subject ||
    htmlBody !== template.html_body ||
    (textBody || '') !== (template.text_body || '') ||
    isActive !== template.is_active;

  const save = async () => {
    try {
      await update.mutateAsync({ id: template.id, subject, html_body: htmlBody, text_body: textBody || null, is_active: isActive });
      toast.success('Template saved');
    } catch (e: any) {
      toast.error(e.message || 'Failed to save');
    }
  };

  const send = async () => {
    if (!testEmail.trim()) { toast.error('Enter a test recipient'); return; }
    try {
      await sendTest.mutateAsync({ to: testEmail.trim(), template_key: template.template_key });
      toast.success('Test email queued (sandbox until a sender domain is verified)');
    } catch (e: any) {
      toast.error(e.message || 'Failed to send test email');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded">{template.template_key}</span>
          <Badge variant="outline">{CATEGORY_LABELS[template.category] || template.category}</Badge>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <Switch checked={isActive} onCheckedChange={setIsActive} />
          {isActive ? 'Active' : 'Inactive'}
        </label>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Subject</label>
        <Input value={subject} onChange={(e) => setSubject(e.target.value)} />
      </div>

      {template.variables?.length > 0 && (
        <div className="text-xs text-muted-foreground">
          Variables:{' '}
          {template.variables.map((v) => (
            <code key={v} className="bg-muted px-1.5 py-0.5 rounded mr-1">{`{{${v}}}`}</code>
          ))}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">HTML Body</label>
          <Textarea value={htmlBody} onChange={(e) => setHtmlBody(e.target.value)} className="font-mono text-xs min-h-[280px]" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Live Preview</label>
          <div className="border border-border rounded-md bg-white min-h-[280px] overflow-auto p-3">
            <div dangerouslySetInnerHTML={{ __html: htmlBody }} />
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Plain-text fallback</label>
        <Textarea value={textBody} onChange={(e) => setTextBody(e.target.value)} className="font-mono text-xs min-h-[100px]" />
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-border">
        <Button onClick={save} disabled={!dirty || update.isPending}>
          {update.isPending && <Loader2 className="h-4 w-4 animate-spin mr-1" />} Save Changes
        </Button>
        <div className="flex items-center gap-2 ml-auto">
          <Input placeholder="test@email.com" value={testEmail} onChange={(e) => setTestEmail(e.target.value)} className="w-52" />
          <Button variant="outline" onClick={send} disabled={sendTest.isPending}>
            {sendTest.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Send className="h-4 w-4 mr-1" />} Send Test
          </Button>
        </div>
      </div>
    </div>
  );
};

// ---------------- Templates Tab ----------------
const TemplatesTab = () => {
  const { data: templates, isLoading } = useEmailTemplates();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  const list = templates || [];
  const selected = list.find((t) => t.id === selectedId) || list[0];

  if (list.length === 0) return <p className="text-sm text-muted-foreground py-8">No email templates found.</p>;

  return (
    <div className="grid lg:grid-cols-[260px_1fr] gap-4">
      <div className="space-y-1">
        {list.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelectedId(t.id)}
            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
              selected?.id === t.id ? 'bg-muted font-medium' : 'hover:bg-muted/60'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="truncate">{t.name}</span>
              <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${t.is_active ? 'bg-green-500' : 'bg-muted-foreground/40'}`} />
            </div>
            <span className="text-[11px] text-muted-foreground">{CATEGORY_LABELS[t.category] || t.category}</span>
          </button>
        ))}
      </div>
      <Card className="p-4">{selected && <TemplateEditor key={selected.id} template={selected} />}</Card>
    </div>
  );
};

// ---------------- Logs Tab ----------------
const LogsTab = () => {
  const { data: logs, isLoading } = useEmailLogs(300);
  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  const list = logs || [];
  if (list.length === 0) return <p className="text-sm text-muted-foreground py-8">No emails have been sent yet.</p>;

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs text-muted-foreground">
            <tr>
              <th className="text-left px-3 py-2 font-medium">Recipient</th>
              <th className="text-left px-3 py-2 font-medium">Template</th>
              <th className="text-left px-3 py-2 font-medium">Subject</th>
              <th className="text-left px-3 py-2 font-medium">Status</th>
              <th className="text-left px-3 py-2 font-medium">When</th>
            </tr>
          </thead>
          <tbody>
            {list.map((l) => (
              <tr key={l.id} className="border-t border-border">
                <td className="px-3 py-2">{l.recipient}</td>
                <td className="px-3 py-2"><span className="font-mono text-xs">{l.template_key || '—'}</span></td>
                <td className="px-3 py-2 max-w-[260px] truncate">{l.subject || '—'}</td>
                <td className="px-3 py-2">{statusBadge(l.status)}</td>
                <td className="px-3 py-2 text-xs text-muted-foreground">{new Date(l.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

// ---------------- Analytics Tab ----------------
const AnalyticsTab = () => {
  const { data: logs, isLoading } = useEmailLogs(1000);
  const stats = useMemo(() => {
    const list = logs || [];
    const total = list.length;
    const ok = (s: string) => ['sent', 'delivered', 'success'].includes((s || '').toLowerCase());
    const fail = (s: string) => ['failed', 'error', 'bounced'].includes((s || '').toLowerCase());
    const sent = list.filter((l) => ok(l.status)).length;
    const failed = list.filter((l) => fail(l.status)).length;
    const pending = total - sent - failed;
    const byTemplate: Record<string, number> = {};
    list.forEach((l) => { const k = l.template_key || 'unknown'; byTemplate[k] = (byTemplate[k] || 0) + 1; });
    return { total, sent, failed, pending, byTemplate, rate: total ? Math.round((sent / total) * 100) : 0 };
  }, [logs]);

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  const cards = [
    { label: 'Total Sent', value: stats.total, icon: Mail },
    { label: 'Delivered', value: stats.sent, icon: CheckCircle2 },
    { label: 'Failed', value: stats.failed, icon: XCircle },
    { label: 'Delivery Rate', value: `${stats.rate}%`, icon: Activity },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map((c) => (
          <Card key={c.label} className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{c.label}</span>
              <c.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-semibold mt-2">{c.value}</p>
          </Card>
        ))}
      </div>
      <Card className="p-4">
        <h3 className="text-sm font-medium mb-3">By Template</h3>
        {Object.keys(stats.byTemplate).length === 0 ? (
          <p className="text-sm text-muted-foreground">No data yet.</p>
        ) : (
          <div className="space-y-2">
            {Object.entries(stats.byTemplate).sort((a, b) => b[1] - a[1]).map(([k, v]) => (
              <div key={k} className="flex items-center justify-between text-sm">
                <span className="font-mono text-xs">{k}</span>
                <span className="text-muted-foreground">{v}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

// ---------------- Abandoned Carts Tab ----------------
const AbandonedTab = () => {
  const { data: carts, isLoading } = useAbandonedCarts();
  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  const list = carts || [];
  if (list.length === 0) return <p className="text-sm text-muted-foreground py-8">No abandoned carts tracked yet.</p>;

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs text-muted-foreground">
            <tr>
              <th className="text-left px-3 py-2 font-medium">Customer</th>
              <th className="text-left px-3 py-2 font-medium">Email</th>
              <th className="text-left px-3 py-2 font-medium">Items</th>
              <th className="text-left px-3 py-2 font-medium">Total</th>
              <th className="text-left px-3 py-2 font-medium">Reminders</th>
              <th className="text-left px-3 py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {list.map((c) => (
              <tr key={c.id} className="border-t border-border">
                <td className="px-3 py-2">{c.customer_name || '—'}</td>
                <td className="px-3 py-2">{c.email || '—'}</td>
                <td className="px-3 py-2">{Array.isArray(c.items) ? c.items.length : 0}</td>
                <td className="px-3 py-2">৳{c.total}</td>
                <td className="px-3 py-2">{c.reminders_sent}</td>
                <td className="px-3 py-2">{statusBadge(c.recovered_at ? 'recovered' : c.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

// ---------------- Main ----------------
const AdminEmails = () => {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Email Center</h2>
        <p className="text-sm text-muted-foreground">
          Manage templates, monitor delivery, and review campaigns. Live delivery activates once a sender domain is verified.
        </p>
      </div>
      <Tabs defaultValue="templates">
        <TabsList>
          <TabsTrigger value="templates"><FileText className="h-4 w-4 mr-1" /> Templates</TabsTrigger>
          <TabsTrigger value="logs"><Mail className="h-4 w-4 mr-1" /> Logs</TabsTrigger>
          <TabsTrigger value="analytics"><Activity className="h-4 w-4 mr-1" /> Analytics</TabsTrigger>
          <TabsTrigger value="abandoned"><ShoppingCart className="h-4 w-4 mr-1" /> Abandoned Carts</TabsTrigger>
        </TabsList>
        <TabsContent value="templates" className="mt-4"><TemplatesTab /></TabsContent>
        <TabsContent value="logs" className="mt-4"><LogsTab /></TabsContent>
        <TabsContent value="analytics" className="mt-4"><AnalyticsTab /></TabsContent>
        <TabsContent value="abandoned" className="mt-4"><AbandonedTab /></TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminEmails;