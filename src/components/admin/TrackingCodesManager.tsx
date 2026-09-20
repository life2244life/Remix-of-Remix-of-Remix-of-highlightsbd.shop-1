import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext, arrayMove, verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import Sortable from '@/components/admin/navigation/Sortable';
import {
  Plus, Trash2, Check, Copy, Loader2, Download, Upload, History, X, Code2,
  Files, ChevronDown, ChevronRight, Pencil, AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';

type Location = 'head' | 'body_top' | 'body_bottom';

interface TrackingCode {
  id: string;
  label: string;
  location: Location;
  code: string;
  enabled: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

interface AuditRow {
  id: string;
  action: string;
  label: string | null;
  location: Location | null;
  created_at: string;
}

const LOCATIONS: { key: Location; title: string; desc: string }[] = [
  { key: 'head', title: 'Head', desc: 'Injected into <head> — verification tags, analytics, pixels.' },
  { key: 'body_top', title: 'Body Top', desc: 'Injected right after the opening <body> tag.' },
  { key: 'body_bottom', title: 'Body Bottom', desc: 'Injected just before the closing </body> tag.' },
];

/** Future-integration presets: grouped, prefilled label + snippet + location. */
const PRESETS: { name: string; group: string; location: Location; code: string }[] = [
  // ---- Analytics ----
  { name: 'Google Tag Manager (GTM)', group: 'Analytics', location: 'head', code: '<!-- Google Tag Manager -->\n<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({"gtm.start":new Date().getTime(),event:"gtm.js"});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!="dataLayer"?"&l="+l:"";j.async=true;j.src="https://www.googletagmanager.com/gtm.js?id="+i+dl;f.parentNode.insertBefore(j,f);})(window,document,"script","dataLayer","GTM-XXXXXXX");</script>\n<!-- End Google Tag Manager -->' },
  { name: 'Google Analytics 4 (GA4)', group: 'Analytics', location: 'head', code: '<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>\n<script>\nwindow.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config","G-XXXXXXXXXX");\n</script>' },
  { name: 'Meta Pixel', group: 'Analytics', location: 'head', code: '<!-- Meta Pixel Code -->\n<script>\n!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version="2.0";n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,"script","https://connect.facebook.net/en_US/fbevents.js");\nfbq("init","PIXEL_ID");fbq("track","PageView");\n</script>\n<!-- End Meta Pixel Code -->' },
  { name: 'TikTok Pixel', group: 'Analytics', location: 'head', code: '<script>\n!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.load=function(e){var n="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{};ttq._i[e]=[];ttq._i[e]._u=n;ttq._t=ttq._t||{};ttq._t[e]=+new Date;var o=d.createElement("script");o.async=!0;o.src=n+"?sdkid="+e+"&lib="+t;var a=d.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};ttq.load("TIKTOK_PIXEL_ID");ttq.page()}(window,document,"ttq");\n</script>' },
  { name: 'Microsoft Clarity', group: 'Analytics', location: 'head', code: '<script type="text/javascript">\n(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","CLARITY_ID");\n</script>' },
  { name: 'Hotjar', group: 'Analytics', location: 'head', code: '<script>\n(function(h,o,t,j,a,r){h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};h._hjSettings={hjid:HOTJAR_ID,hjsv:6};a=o.getElementsByTagName("head")[0];r=o.createElement("script");r.async=1;r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;a.appendChild(r);})(window,document,"https://static.hotjar.com/c/hotjar-",".js?sv=");\n</script>' },
  { name: 'LinkedIn Insight Tag', group: 'Analytics', location: 'body_bottom', code: '<script type="text/javascript">\n_linkedin_partner_id = "PARTNER_ID";\nwindow._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];\nwindow._linkedin_data_partner_ids.push(_linkedin_partner_id);\n(function(l){if(!l){window.lintrk=function(a,b){window.lintrk.q.push([a,b])};window.lintrk.q=[]}var s=document.getElementsByTagName("script")[0];var b=document.createElement("script");b.type="text/javascript";b.async=true;b.src="https://snap.licdn.com/li.lms-analytics/insight.min.js";s.parentNode.insertBefore(b,s);})(window.lintrk);\n</script>' },
  { name: 'Reddit Pixel', group: 'Analytics', location: 'head', code: '<script>\n!function(w,d){if(!w.rdt){var p=w.rdt=function(){p.sendEvent?p.sendEvent.apply(p,arguments):p.callQueue.push(arguments)};p.callQueue=[];var t=d.createElement("script");t.src="https://www.redditstatic.com/ads/pixel.js";t.async=!0;var s=d.getElementsByTagName("script")[0];s.parentNode.insertBefore(t,s)}}(window,document);\nrdt("init","REDDIT_PIXEL_ID");\nrdt("track","PageVisit");\n</script>' },
  { name: 'Snapchat Pixel', group: 'Analytics', location: 'head', code: '<script type="text/javascript">\n(function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function(){a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};a.queue=[];var s="script";var r=t.createElement(s);r.async=!0;r.src=n;var u=t.getElementsByTagName(s)[0];u.parentNode.insertBefore(r,u)})(window,document,"https://sc-static.net/scevent.min.js");\nsnaptr("init","SNAP_PIXEL_ID");\nsnaptr("track","PAGE_VIEW");\n</script>' },
  { name: 'Google Ads Conversion Tag', group: 'Analytics', location: 'head', code: '<script async src="https://www.googletagmanager.com/gtag/js?id=AW-CONVERSION_ID"></script>\n<script>\nwindow.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config","AW-CONVERSION_ID");\n</script>' },
  { name: 'Tawk.to', group: 'Analytics', location: 'body_bottom', code: '<script type="text/javascript">\nvar Tawk_API=Tawk_API||{},Tawk_LoadStart=new Date();\n(function(){var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];s1.async=true;s1.src="https://embed.tawk.to/PROPERTY_ID/WIDGET_ID";s1.charset="UTF-8";s1.setAttribute("crossorigin","*");s0.parentNode.insertBefore(s1,s0);})();\n</script>' },
  // ---- Verification ----
  { name: 'Google Search Console Verification', group: 'Verification', location: 'head', code: '<meta name="google-site-verification" content="YOUR_CODE" />' },
  { name: 'Facebook Domain Verification', group: 'Verification', location: 'head', code: '<meta name="facebook-domain-verification" content="YOUR_CODE" />' },
  { name: 'Bing Webmaster Verification', group: 'Verification', location: 'head', code: '<meta name="msvalidate.01" content="YOUR_CODE" />' },
  { name: 'Pinterest Verification', group: 'Verification', location: 'head', code: '<meta name="p:domain_verify" content="YOUR_CODE" />' },
  { name: 'Yandex Verification', group: 'Verification', location: 'head', code: '<meta name="yandex-verification" content="YOUR_CODE" />' },
  // ---- Other ----
  { name: 'Custom / Other', group: 'Other', location: 'head', code: '<!-- Paste your custom snippet here -->' },
];

/** Validates a raw HTML/script snippet before save. Returns an error string or ''. */
const validateSnippet = (html: string): string => {
  if (!html.trim()) return '';
  const open = (html.match(/<script\b/gi) || []).length;
  const close = (html.match(/<\/script\s*>/gi) || []).length;
  if (open !== close) return 'Unbalanced <script> tags';
  if (/<\/?(html|head|body)\b/i.test(html)) return 'Remove <html>, <head> or <body> wrapper tags';
  return '';
};

const Toggle = ({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) => (
  <button
    type="button"
    role="switch"
    aria-checked={on}
    aria-label={on ? 'Enabled' : 'Disabled'}
    onClick={() => onChange(!on)}
    className={`relative inline-flex h-5 w-12 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 ${
      on ? 'bg-green-500' : 'bg-red-500'
    }`}
  >
    <span
      className={`absolute h-4 w-4 rounded-full bg-white shadow transition-transform ${
        on ? 'translate-x-7' : 'translate-x-0.5'
      }`}
    />
    <span
      className={`pointer-events-none absolute text-[8px] font-bold uppercase tracking-wide text-white ${
        on ? 'left-1.5' : 'right-1'
      }`}
    >
      {on ? 'ON' : 'OFF'}
    </span>
  </button>
);

const LOCATION_LABELS: Record<Location, string> = {
  head: 'HEAD',
  body_top: 'BODY TOP',
  body_bottom: 'BODY BOTTOM',
};

const fmtDate = (s?: string) => (s ? new Date(s).toLocaleString() : '—');

const CodeRow = ({ code, onChange, onDelete, onDuplicate, handle }: {
  code: TrackingCode;
  onChange: (patch: Partial<TrackingCode>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  handle: React.ReactNode;
}) => {
  const isNew = code.id.startsWith('new-');
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(isNew); // collapsed by default for existing
  const [editing, setEditing] = useState(isNew);
  const error = validateSnippet(code.code || '');
  const copy = async () => {
    await navigator.clipboard.writeText(code.code || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  const codeLines = (code.code || '').split('\n');
  const collapsedPreview = codeLines.slice(0, 2).join('\n') + (codeLines.length > 2 ? '\n…' : '');
  return (
    <div className="border border-border bg-background">
      {/* Header row */}
      <div className="flex items-center gap-2 p-3">
        {handle}
        <button type="button" onClick={() => setExpanded(e => !e)} className="text-muted-foreground hover:text-foreground" title={expanded ? 'Collapse' : 'Expand'}>
          {expanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium truncate">{code.label || 'Untitled'}</span>
            <span className="text-[9px] uppercase tracking-wider border border-border px-1.5 py-0.5 text-muted-foreground">{LOCATION_LABELS[code.location]}</span>
            <span className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 ${code.enabled ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground'}`}>
              {code.enabled ? 'Enabled' : 'Disabled'}
            </span>
            {isNew && <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 border border-dashed border-border text-muted-foreground">Unsaved</span>}
          </div>
          {!isNew && (
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Created {fmtDate(code.created_at)} · Updated {fmtDate(code.updated_at)}
            </p>
          )}
        </div>
        <button type="button" onClick={() => { setEditing(true); setExpanded(true); }} className="text-muted-foreground hover:text-foreground" title="Edit">
          <Pencil size={13} />
        </button>
        <button type="button" onClick={onDuplicate} className="text-muted-foreground hover:text-foreground" title="Duplicate">
          <Files size={13} />
        </button>
        <button type="button" onClick={copy} className="text-muted-foreground hover:text-foreground" title="Copy">
          {copied ? <Check size={13} /> : <Copy size={13} />}
        </button>
        <Toggle on={code.enabled} onChange={v => onChange({ enabled: v })} />
        <button type="button" onClick={onDelete} className="text-muted-foreground hover:text-destructive" title="Delete">
          <Trash2 size={13} />
        </button>
      </div>

      {/* Collapsed preview */}
      {!expanded && (
        <pre className="px-3 pb-3 text-[10px] text-muted-foreground whitespace-pre-wrap overflow-hidden">{collapsedPreview || '— empty —'}</pre>
      )}

      {/* Expanded body */}
      {expanded && (
        <div className="px-3 pb-3 space-y-2">
          {editing ? (
            <input
              value={code.label}
              onChange={e => onChange({ label: e.target.value })}
              placeholder="Label / Name (e.g. Microsoft Clarity)"
              className="luxury-input w-full text-xs"
            />
          ) : null}
          {editing ? (
            <textarea
              value={code.code}
              onChange={e => onChange({ code: e.target.value })}
              spellCheck={false}
              rows={5}
              className="luxury-input w-full font-mono text-[11px]"
            />
          ) : (
            <pre className="luxury-input w-full overflow-auto text-[11px] whitespace-pre-wrap min-h-[80px]">{code.code || '— empty —'}</pre>
          )}
          {error && <p className="text-[10px] text-destructive">{error}</p>}
          {!code.enabled && <p className="text-[10px] text-muted-foreground">Disabled — saved but not rendered on the storefront.</p>}
        </div>
      )}
    </div>
  );
};

const ConfirmDeleteModal = ({ label, onConfirm, onCancel }: { label: string; onConfirm: () => void; onCancel: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onCancel}>
    <div className="bg-background border border-border max-w-sm w-full p-6 space-y-4" onClick={e => e.stopPropagation()}>
      <div className="flex items-center gap-3">
        <AlertTriangle size={20} className="text-destructive" />
        <h4 className="text-base font-light tracking-wide" style={{ fontFamily: 'var(--font-display)' }}>Delete snippet?</h4>
      </div>
      <p className="text-xs text-muted-foreground">
        This will permanently remove <span className="text-foreground font-medium">{label || 'Untitled'}</span>. This action cannot be undone.
      </p>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="text-[10px] border border-border px-3 py-2 hover:bg-muted">Cancel</button>
        <button type="button" onClick={onConfirm} className="text-[10px] bg-destructive text-destructive-foreground px-3 py-2 inline-flex items-center gap-1.5">
          <Trash2 size={12} /> Delete
        </button>
      </div>
    </div>
  </div>
);

const TrackingCodesManager = () => {
  const [codes, setCodes] = useState<TrackingCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [audit, setAudit] = useState<AuditRow[] | null>(null);
  const [pendingDelete, setPendingDelete] = useState<TrackingCode | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('tracking_codes' as any)
      .select('*')
      .order('location', { ascending: true })
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true });
    setCodes((data as any as TrackingCode[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const grouped = useMemo(() => {
    const g: Record<Location, TrackingCode[]> = { head: [], body_top: [], body_bottom: [] };
    codes.forEach(c => g[c.location].push(c));
    return g;
  }, [codes]);

  const patch = (id: string, p: Partial<TrackingCode>) =>
    setCodes(prev => prev.map(c => (c.id === id ? { ...c, ...p } : c)));

  const addCode = (location: Location, preset?: typeof PRESETS[number]) => {
    const tmpId = `new-${crypto.randomUUID()}`;
    const maxOrder = Math.max(-1, ...grouped[location].map(c => c.sort_order));
    setCodes(prev => [...prev, {
      id: tmpId,
      label: preset?.name || 'New Code',
      location,
      code: preset?.code || '',
      enabled: true,
      sort_order: maxOrder + 1,
    }]);
  };

  const deleteCode = async (id: string) => {
    if (id.startsWith('new-')) {
      setCodes(prev => prev.filter(c => c.id !== id));
      return;
    }
    const { error } = await supabase.from('tracking_codes' as any).delete().eq('id', id);
    if (error) { toast.error('Delete failed: ' + error.message); return; }
    setCodes(prev => prev.filter(c => c.id !== id));
    toast.success('Code removed');
  };

  const duplicateCode = (src: TrackingCode) => {
    const tmpId = `new-${crypto.randomUUID()}`;
    const maxOrder = Math.max(-1, ...grouped[src.location].map(c => c.sort_order));
    setCodes(prev => [...prev, {
      id: tmpId,
      label: `${src.label} (copy)`,
      location: src.location,
      code: src.code,
      enabled: src.enabled,
      sort_order: maxOrder + 1,
    }]);
    toast.success('Duplicated — review and Save to apply');
  };

  const requestDelete = (code: TrackingCode) => {
    // Unsaved rows can be removed immediately, no confirmation needed.
    if (code.id.startsWith('new-')) { deleteCode(code.id); return; }
    setPendingDelete(code);
  };

  const onDragEnd = (location: Location) => (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const list = grouped[location];
    const oldIdx = list.findIndex(c => c.id === active.id);
    const newIdx = list.findIndex(c => c.id === over.id);
    const reordered = arrayMove(list, oldIdx, newIdx).map((c, i) => ({ ...c, sort_order: i }));
    setCodes(prev => [...prev.filter(c => c.location !== location), ...reordered]);
  };

  const save = async () => {
    for (const c of codes) {
      const err = validateSnippet(c.code || '');
      if (err) { toast.error(`"${c.label || 'Untitled'}": ${err}`); return; }
      if (!c.label.trim()) { toast.error('Every code needs a label/name'); return; }
    }
    setSaving(true);
    try {
      const rows = codes.map(c => ({
        ...(c.id.startsWith('new-') ? {} : { id: c.id }),
        label: c.label.trim(),
        location: c.location,
        code: c.code,
        enabled: c.enabled,
        sort_order: c.sort_order,
      }));
      const { error } = await supabase.from('tracking_codes' as any).upsert(rows as any);
      if (error) throw error;
      toast.success('Tracking codes saved');
      await load();
    } catch (err: any) {
      toast.error('Failed to save: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const exportJson = () => {
    const payload = codes.map(({ label, location, code, enabled, sort_order }) => ({ label, location, code, enabled, sort_order }));
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tracking-codes-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (!Array.isArray(parsed)) throw new Error('Expected an array');
        const valid: Location[] = ['head', 'body_top', 'body_bottom'];
        const imported: TrackingCode[] = parsed.map((p: any) => ({
          id: `new-${crypto.randomUUID()}`,
          label: String(p.label || 'Imported Code'),
          location: valid.includes(p.location) ? p.location : 'head',
          code: String(p.code || ''),
          enabled: p.enabled !== false,
          sort_order: Number(p.sort_order) || 0,
        }));
        setCodes(prev => [...prev, ...imported]);
        toast.success(`Imported ${imported.length} code(s) — review and Save to apply`);
      } catch (err: any) {
        toast.error('Invalid JSON: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  const loadAudit = async () => {
    const { data } = await supabase
      .from('tracking_codes_audit' as any)
      .select('id, action, label, location, created_at')
      .order('created_at', { ascending: false })
      .limit(50);
    setAudit((data as any as AuditRow[]) || []);
  };

  return (
    <div className="border border-border p-6 space-y-5">
      <div className="flex items-center gap-3 flex-wrap">
        <Code2 size={20} />
        <div className="flex-1">
          <h3 className="text-lg font-light tracking-wide" style={{ fontFamily: 'var(--font-display)' }}>Custom Code Snippets</h3>
          <p className="text-xs text-muted-foreground">Multiple labeled snippets per location with drag-to-order, audit history, and import/export.</p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={exportJson} className="text-[10px] inline-flex items-center gap-1 border border-border px-2 py-1 hover:bg-muted">
            <Download size={12} /> Export
          </button>
          <label className="text-[10px] inline-flex items-center gap-1 border border-border px-2 py-1 hover:bg-muted cursor-pointer">
            <Upload size={12} /> Import
            <input type="file" accept="application/json" onChange={importJson} className="hidden" />
          </label>
          <button type="button" onClick={() => (audit ? setAudit(null) : loadAudit())} className="text-[10px] inline-flex items-center gap-1 border border-border px-2 py-1 hover:bg-muted">
            <History size={12} /> {audit ? 'Hide' : 'History'}
          </button>
        </div>
      </div>

      {audit && (
        <div className="border border-border p-3 space-y-1 max-h-60 overflow-auto bg-muted/30">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Audit History (last 50)</span>
            <button type="button" onClick={() => setAudit(null)} className="text-muted-foreground hover:text-foreground"><X size={13} /></button>
          </div>
          {audit.length === 0 && <p className="text-[11px] text-muted-foreground">No history yet.</p>}
          {audit.map(a => (
            <div key={a.id} className="text-[11px] flex items-center justify-between gap-3 py-0.5">
              <span className="capitalize">{a.action}</span>
              <span className="flex-1 truncate text-muted-foreground">{a.label || '—'} · {a.location || '—'}</span>
              <span className="text-muted-foreground whitespace-nowrap">{new Date(a.created_at).toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-xs text-muted-foreground"><Loader2 size={14} className="animate-spin" /> Loading…</div>
      ) : (
        LOCATIONS.map(loc => (
          <div key={loc.key} className="space-y-3">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <h4 className="text-sm uppercase tracking-wider">{loc.title}</h4>
                <p className="text-[10px] text-muted-foreground">{loc.desc}</p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value=""
                  onChange={e => { const p = PRESETS.find(x => x.name === e.target.value); if (p) addCode(p.location, p); e.target.value = ''; }}
                  className="luxury-input text-[10px] py-1"
                >
                  <option value="">+ Add preset…</option>
                  {['Analytics', 'Verification', 'Other'].map(group => (
                    <optgroup key={group} label={group}>
                      {PRESETS.filter(p => p.group === group).map(p => (
                        <option key={p.name} value={p.name}>{p.name}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <button type="button" onClick={() => addCode(loc.key)} className="text-[10px] inline-flex items-center gap-1 border border-border px-2 py-1 hover:bg-muted">
                  <Plus size={12} /> Add
                </button>
              </div>
            </div>
            {grouped[loc.key].length === 0 ? (
              <p className="text-[11px] text-muted-foreground italic">No snippets in this location.</p>
            ) : (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd(loc.key)}>
                <SortableContext items={grouped[loc.key].map(c => c.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-2">
                    {grouped[loc.key].map(c => (
                      <Sortable key={c.id} id={c.id}>
                        {({ handle }) => (
                          <CodeRow code={c} handle={handle} onChange={p => patch(c.id, p)} onDelete={() => requestDelete(c)} onDuplicate={() => duplicateCode(c)} />
                        )}
                      </Sortable>
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>
        ))
      )}

      <div className="flex">
        <button onClick={save} disabled={saving} className="luxury-button-primary text-[10px] py-2 px-4 inline-flex items-center gap-1.5">
          {saving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
          Save Custom Code Snippets
        </button>
      </div>

      {pendingDelete && (
        <ConfirmDeleteModal
          label={pendingDelete.label}
          onCancel={() => setPendingDelete(null)}
          onConfirm={async () => { await deleteCode(pendingDelete.id); setPendingDelete(null); }}
        />
      )}
    </div>
  );
};

export default TrackingCodesManager;