import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BarChart3, Save, Loader2, Shield, Server, X } from 'lucide-react';
import { toast } from 'sonner';
import TrackingCodesManager from './TrackingCodesManager';

type Settings = Record<string, string>;

const FIELDS = [
  'gtm_container_id', 'gtm_enabled',
  'ga4_measurement_id', 'ga4_api_secret',
  'meta_pixel_id', 'meta_capi_access_token',
  'tiktok_pixel_id', 'tiktok_access_token',
  'server_side_meta_enabled', 'server_side_tiktok_enabled', 'server_side_ga4_enabled',
  'consent_default_analytics', 'consent_default_ad',
  'consent_default_ad_user_data', 'consent_default_ad_personalization',
  // Verification & custom code injection
  'fb_domain_verification', 'google_site_verification', 'bing_verification',
  'pinterest_verification', 'yandex_verification',
];

const Toggle = ({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) => (
  <button
    type="button"
    role="switch"
    aria-checked={on}
    aria-label={on ? 'On' : 'Off'}
    onClick={() => onChange(!on)}
    className={`relative inline-flex h-6 w-16 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${on ? 'bg-[#22c55e]' : 'bg-[#ef4444]'}`}
  >
    <span className={`absolute text-[9px] font-semibold uppercase tracking-wider text-white ${on ? 'left-2' : 'right-2'}`}>
      {on ? 'ON' : 'OFF'}
    </span>
    <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${on ? 'translate-x-[2.625rem]' : 'translate-x-0.5'}`} />
  </button>
);

const StatusBadge = ({ value, enabled }: { value?: string; enabled?: boolean }) => {
  const has = !!(value && value.trim());
  const state = !has ? 'EMPTY' : enabled === false ? 'DISABLED' : 'ACTIVE';
  const cls = state === 'ACTIVE'
    ? 'bg-foreground text-background'
    : state === 'DISABLED'
      ? 'bg-muted text-muted-foreground'
      : 'border border-dashed border-border text-muted-foreground';
  return <span className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 ${cls}`}>{state}</span>;
};

const Field = ({ label, value, onChange, placeholder, hint, badge, enabled, updatedAt }: any) => (
  <div className="space-y-1.5">
    <div className="flex items-center justify-between gap-2">
      <label className="text-xs text-muted-foreground tracking-wider uppercase">{label}</label>
      {badge && <StatusBadge value={value} enabled={enabled} />}
    </div>
    <div className="flex items-center gap-1.5">
      <input value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="luxury-input w-full" />
      {value && value.trim() ? (
        <button type="button" onClick={() => onChange('')} title="Clear" className="text-muted-foreground hover:text-destructive shrink-0 p-1">
          <X size={14} />
        </button>
      ) : null}
    </div>
    {updatedAt && <p className="text-[10px] text-muted-foreground">Last updated {new Date(updatedAt).toLocaleString()}</p>}
    {hint && <p className="text-[10px] text-muted-foreground">{hint}</p>}
  </div>
);

const ConsentSelect = ({ label, value, onChange }: any) => (
  <div className="space-y-1.5">
    <label className="text-xs text-muted-foreground tracking-wider uppercase">{label}</label>
    <select value={value || 'denied'} onChange={e => onChange(e.target.value)} className="luxury-input w-full">
      <option value="denied">Denied (default)</option>
      <option value="granted">Granted</option>
    </select>
  </div>
);

const Card = ({ icon: Icon, title, desc, children }: any) => (
  <div className="border border-border p-6 space-y-5">
    <div className="flex items-center gap-3">
      <Icon size={20} />
      <div>
        <h3 className="text-lg font-light tracking-wide" style={{ fontFamily: 'var(--font-display)' }}>{title}</h3>
        {desc && <p className="text-xs text-muted-foreground">{desc}</p>}
      </div>
    </div>
    {children}
  </div>
);

const AdminAnalytics = () => {
  const [s, setS] = useState<Settings>({});
  const [updatedAt, setUpdatedAt] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const set = (k: string, v: string) => setS(p => ({ ...p, [k]: v }));

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('tracking_settings' as any).select('key, value, updated_at');
      const map: Settings = {};
      const ts: Record<string, string> = {};
      (data as any[] | null)?.forEach((r: any) => { map[r.key] = r.value; if (r.updated_at) ts[r.key] = r.updated_at; });
      setS(map);
      setUpdatedAt(ts);
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      for (const key of FIELDS) {
        const value = s[key] ?? '';
        await (supabase.from('tracking_settings' as any) as any).upsert(
          { key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' },
        );
      }
      toast.success('Analytics settings saved');
      const now = new Date().toISOString();
      setUpdatedAt(prev => { const next = { ...prev }; FIELDS.forEach(k => { next[k] = now; }); return next; });
    } catch (err: any) {
      toast.error('Failed to save: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <Card icon={BarChart3} title="Google (GTM + GA4)" desc="Master tag layer and GA4 ecommerce">
        <div className="flex items-center justify-between">
          <span className="text-xs">Enable GTM</span>
          <Toggle on={s.gtm_enabled !== 'false'} onChange={v => set('gtm_enabled', v ? 'true' : 'false')} />
        </div>
        <Field badge enabled={s.gtm_enabled !== 'false'} updatedAt={updatedAt.gtm_container_id} label="GTM Container ID" value={s.gtm_container_id} onChange={(v: string) => set('gtm_container_id', v)} placeholder="GTM-XXXXXXX" />
        <Field badge updatedAt={updatedAt.ga4_measurement_id} label="GA4 Measurement ID" value={s.ga4_measurement_id} onChange={(v: string) => set('ga4_measurement_id', v)} placeholder="G-XXXXXXXXXX" />
        <Field label="GA4 Measurement Protocol API Secret" value={s.ga4_api_secret} onChange={(v: string) => set('ga4_api_secret', v)} placeholder="server-side secret" hint="Used for server-side GA4 events only. Never exposed to the browser." />
        <div className="flex items-center justify-between">
          <span className="text-xs">Server-side GA4 events</span>
          <Toggle on={s.server_side_ga4_enabled !== 'false'} onChange={v => set('server_side_ga4_enabled', v ? 'true' : 'false')} />
        </div>
      </Card>

      <Card icon={Server} title="Meta Pixel + Conversions API">
        <Field badge updatedAt={updatedAt.meta_pixel_id} label="Meta Pixel ID" value={s.meta_pixel_id} onChange={(v: string) => set('meta_pixel_id', v)} placeholder="1234567890" />
        <Field label="Meta CAPI Access Token" value={s.meta_capi_access_token} onChange={(v: string) => set('meta_capi_access_token', v)} placeholder="EAAB..." hint="Server-only. Stored securely, never sent to the browser." />
        <div className="flex items-center justify-between">
          <span className="text-xs">Server-side Meta events (CAPI)</span>
          <Toggle on={s.server_side_meta_enabled !== 'false'} onChange={v => set('server_side_meta_enabled', v ? 'true' : 'false')} />
        </div>
      </Card>

      <Card icon={Server} title="TikTok Pixel + Events API">
        <Field badge updatedAt={updatedAt.tiktok_pixel_id} label="TikTok Pixel ID" value={s.tiktok_pixel_id} onChange={(v: string) => set('tiktok_pixel_id', v)} placeholder="CXXXXXXXXXXXXXXXXX" />
        <Field label="TikTok Access Token" value={s.tiktok_access_token} onChange={(v: string) => set('tiktok_access_token', v)} placeholder="server-side token" hint="Server-only. Stored securely, never sent to the browser." />
        <div className="flex items-center justify-between">
          <span className="text-xs">Server-side TikTok events</span>
          <Toggle on={s.server_side_tiktok_enabled !== 'false'} onChange={v => set('server_side_tiktok_enabled', v ? 'true' : 'false')} />
        </div>
      </Card>

      <Card icon={Shield} title="Consent Mode v2" desc="Default consent states before user opts in">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ConsentSelect label="analytics_storage" value={s.consent_default_analytics} onChange={(v: string) => set('consent_default_analytics', v)} />
          <ConsentSelect label="ad_storage" value={s.consent_default_ad} onChange={(v: string) => set('consent_default_ad', v)} />
          <ConsentSelect label="ad_user_data" value={s.consent_default_ad_user_data} onChange={(v: string) => set('consent_default_ad_user_data', v)} />
          <ConsentSelect label="ad_personalization" value={s.consent_default_ad_personalization} onChange={(v: string) => set('consent_default_ad_personalization', v)} />
        </div>
      </Card>

      <Card icon={Shield} title="Verification & Tracking Codes" desc="Search engine & social site verification meta tags">
        <Field badge updatedAt={updatedAt.fb_domain_verification} label="Facebook Domain Verification" value={s.fb_domain_verification} onChange={(v: string) => set('fb_domain_verification', v)} placeholder="content value only" hint="Paste only the content value of the meta tag." />
        <Field badge updatedAt={updatedAt.google_site_verification} label="Google Site Verification" value={s.google_site_verification} onChange={(v: string) => set('google_site_verification', v)} placeholder="content value only" />
        <Field badge updatedAt={updatedAt.bing_verification} label="Bing Webmaster Verification" value={s.bing_verification} onChange={(v: string) => set('bing_verification', v)} placeholder="content value only" />
        <Field badge updatedAt={updatedAt.pinterest_verification} label="Pinterest Verification" value={s.pinterest_verification} onChange={(v: string) => set('pinterest_verification', v)} placeholder="content value only" />
        <Field badge updatedAt={updatedAt.yandex_verification} label="Yandex Verification" value={s.yandex_verification} onChange={(v: string) => set('yandex_verification', v)} placeholder="content value only" />
      </Card>

      <div className="flex">
        <button onClick={save} disabled={saving} className="luxury-button-primary text-[10px] py-2 px-4 inline-flex items-center gap-1.5">
          {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
          Save Analytics Settings
        </button>
      </div>

      <TrackingCodesManager />
    </div>
  );
};

export default AdminAnalytics;
