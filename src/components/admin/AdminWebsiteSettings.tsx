import { useEffect, useState } from 'react';
import { Save, Loader2, Plus, Trash2, ArrowUp, ArrowDown, Upload, GripVertical } from 'lucide-react';
import { toast } from 'sonner';
import { useStoreSettings, useUpdateStoreSetting } from '@/hooks/useSupabase';
import { uploadImage } from '@/lib/upload';
import LinkPicker from './LinkPicker';
import { guardLinks } from '@/lib/linkValidation';
import {
  DEFAULT_FOOTER_MENUS, DEFAULT_TRUST_FEATURES, DEFAULT_TRUST_BAR,
  DEFAULT_PAYMENT_METHODS, TRUST_ICONS, parseList,
  getQuickContactsRaw, QUICK_CONTACT_TYPES,
  SOCIAL_PLATFORM_DEFS, getSocialLinksRaw,
  type FooterMenu, type TrustFeature, type TrustBarItem, type PaymentMethod,
  type QuickContact, type QuickContactType, type SocialLink,
} from '@/lib/siteSettings';

type Draft = Record<string, string>;

const TABS = [
  { key: 'header', label: 'Header' },
  { key: 'footer', label: 'Footer' },
  { key: 'business', label: 'Business Information' },
  { key: 'contact', label: 'Contact Info' },
  { key: 'quicklinks', label: 'Quick Links' },
  { key: 'newsletter', label: 'Newsletter' },
  { key: 'social', label: 'Social Media' },
  { key: 'trust', label: 'Trust & Store' },
] as const;

const AdminWebsiteSettings = () => {
  const { data: settings, isLoading } = useStoreSettings();
  const update = useUpdateStoreSetting();
  const [tab, setTab] = useState<string>('header');
  const [d, setD] = useState<Draft>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setD((prev) => ({ ...settings, ...prev }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  const set = (key: string, value: string) => setD((p) => ({ ...p, [key]: value }));
  const get = (key: string, def = '') => (d[key] !== undefined ? d[key] : def);
  const bool = (key: string, def = true) => {
    const v = d[key];
    if (v === undefined || v === '') return def;
    return v === '1' || v === 'true';
  };
  const setBool = (key: string, v: boolean) => set(key, v ? '1' : '0');

  const saveKeys = async (keys: string[]) => {
    setSaving(true);
    try {
      if (!(await guardLinks(keys.map((k) => d[k]), (m) => toast.error(m)))) { setSaving(false); return; }
      for (const k of keys) {
        await update.mutateAsync({ key: k, value: d[k] ?? '' });
      }
      toast.success('Settings saved');
    } catch (e: any) {
      toast.error(e.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading website settings...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="text-2xl font-light tracking-wide" style={{ fontFamily: 'var(--font-display)' }}>Website Settings</h2>
        <p className="text-xs text-muted-foreground mt-1">Header, Footer, Contact, Social ও Store information — সব এখান থেকে control করুন।</p>
      </div>

      <div className="flex flex-wrap gap-1 border-b border-border">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-xs tracking-wide transition-colors border-b-2 -mb-px ${tab === t.key ? 'border-foreground text-foreground font-medium' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'header' && <HeaderTab d={d} get={get} set={set} bool={bool} setBool={setBool} saveKeys={saveKeys} saving={saving} />}
      {tab === 'footer' && <FooterTab d={d} get={get} set={set} bool={bool} setBool={setBool} saveKeys={saveKeys} saving={saving} />}
      {tab === 'business' && <BusinessTab get={get} set={set} saveKeys={saveKeys} saving={saving} />}
      {tab === 'contact' && <ContactTab get={get} set={set} saveKeys={saveKeys} saving={saving} />}
      {tab === 'quicklinks' && <QuickLinksTab d={d} set={set} bool={bool} setBool={setBool} saveKeys={saveKeys} saving={saving} />}
      {tab === 'newsletter' && <NewsletterTab get={get} set={set} bool={bool} setBool={setBool} saveKeys={saveKeys} saving={saving} />}
      {tab === 'social' && <SocialTab d={d} set={set} bool={bool} setBool={setBool} saveKeys={saveKeys} saving={saving} />}
      {tab === 'trust' && <TrustTab d={d} set={set} saveKeys={saveKeys} saving={saving} />}
    </div>
  );
};

/* ------------- shared UI bits ------------- */
const Field = ({ label, value, onChange, placeholder, hint }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; hint?: string }) => (
  <div>
    <label className="text-xs text-muted-foreground tracking-wider uppercase block mb-1">{label}</label>
    <input value={value} onChange={(e) => onChange(e.target.value)} className="luxury-input w-full" placeholder={placeholder} />
    {hint && <p className="text-[10px] text-muted-foreground mt-1">{hint}</p>}
  </div>
);

const Toggle = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) => (
  <label className="flex items-center justify-between gap-3 border border-border px-3 py-2.5 cursor-pointer">
    <span className="text-xs">{label}</span>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative h-5 w-9 rounded-full transition-colors shrink-0 ${checked ? 'bg-foreground' : 'bg-muted'}`}
    >
      <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-background transition-all ${checked ? 'left-[18px]' : 'left-0.5'}`} />
    </button>
  </label>
);

const SaveBar = ({ onSave, saving, label = 'Save Changes' }: { onSave: () => void; saving: boolean; label?: string }) => (
  <button onClick={onSave} disabled={saving} className="luxury-button-primary inline-flex items-center gap-2 text-[10px]">
    {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} {label}
  </button>
);

const Card = ({ title, desc, children, action }: { title: string; desc?: string; children: React.ReactNode; action?: React.ReactNode }) => (
  <div className="border border-border p-5 space-y-4">
    <div className="flex items-center justify-between gap-3">
      <div>
        <h3 className="text-sm font-medium">{title}</h3>
        {desc && <p className="text-[11px] text-muted-foreground mt-0.5">{desc}</p>}
      </div>
      {action}
    </div>
    {children}
  </div>
);

const LogoUpload = ({ label, value, onChange, hint }: { label: string; value: string; onChange: (url: string) => void; hint?: string }) => {
  const [uploading, setUploading] = useState(false);
  const handle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Max 5MB'); return; }
    setUploading(true);
    try {
      const url = await uploadImage(file, 'branding');
      onChange(url);
      toast.success('Logo uploaded');
    } catch (err: any) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };
  return (
    <div>
      <label className="text-xs text-muted-foreground tracking-wider uppercase block mb-1">{label}</label>
      <div className="flex items-center gap-4">
        <div className="h-20 w-40 border border-border bg-muted/30 flex items-center justify-center overflow-hidden shrink-0">
          {value ? <img src={value} alt="logo" className="max-h-16 max-w-[140px] object-contain" /> : <span className="text-[10px] text-muted-foreground">No logo</span>}
        </div>
        <div className="space-y-2">
          <label className="luxury-button-outline inline-flex items-center gap-2 text-[10px] cursor-pointer">
            {uploading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />} Upload
            <input type="file" accept="image/png,image/svg+xml,image/*" className="hidden" onChange={handle} />
          </label>
          {value && <button onClick={() => onChange('')} className="block text-[10px] text-destructive hover:underline">Remove</button>}
        </div>
      </div>
      <p className="text-[10px] text-muted-foreground mt-1">{hint || 'PNG/SVG, transparent background, ~80px height, max 5MB.'}</p>
    </div>
  );
};

/* ------------- HEADER ------------- */
const HeaderTab = ({ get, set, bool, setBool, saveKeys, saving }: any) => {
  const keys = [
    'topbar_enabled', 'topbar_announcement_enabled', 'topbar_announcement_text',
    'topbar_offer_enabled', 'topbar_offer_text', 'topbar_offer_badge_text',
    'topbar_track_enabled', 'topbar_track_text', 'topbar_track_link',
    'topbar_contact_enabled', 'topbar_contact_text', 'topbar_contact_link',
    'site_logo', 'header_icon_wishlist', 'header_icon_account', 'header_icon_cart', 'header_icon_search',
  ];
  return (
    <div className="space-y-5">
      <Card title="Top Bar" desc="Header এর উপরের পাতলা bar" action={<SaveBar onSave={() => saveKeys(keys)} saving={saving} />}>
        <Toggle label="Top Bar চালু রাখুন" checked={bool('topbar_enabled')} onChange={(v) => setBool('topbar_enabled', v)} />
        <div className="grid sm:grid-cols-2 gap-4 pt-1">
          <div className="space-y-2">
            <Toggle label="Announcement দেখান" checked={bool('topbar_announcement_enabled')} onChange={(v) => setBool('topbar_announcement_enabled', v)} />
            <Field label="Announcement Text" value={get('topbar_announcement_text', 'Free Delivery on orders over ৳2000')} onChange={(v) => set('topbar_announcement_text', v)} />
          </div>
          <div className="space-y-2">
            <Toggle label="Offer দেখান" checked={bool('topbar_offer_enabled')} onChange={(v) => setBool('topbar_offer_enabled', v)} />
            <Field label="Offer Text" value={get('topbar_offer_text', 'Winter Sale — up to 50% off')} onChange={(v) => set('topbar_offer_text', v)} />
            <Field label="Offer Badge Text" value={get('topbar_offer_badge_text', 'Offer')} onChange={(v) => set('topbar_offer_badge_text', v)} />
          </div>
          <div className="space-y-2">
            <Toggle label="Track Order দেখান" checked={bool('topbar_track_enabled')} onChange={(v) => setBool('topbar_track_enabled', v)} />
            <Field label="Track Order Label" value={get('topbar_track_text', 'Track Order')} onChange={(v) => set('topbar_track_text', v)} />
            <LinkPicker label="Track Order Link" value={get('topbar_track_link', '/profile')} onChange={(v) => set('topbar_track_link', v)} />
          </div>
          <div className="space-y-2">
            <Toggle label="Contact দেখান" checked={bool('topbar_contact_enabled')} onChange={(v) => setBool('topbar_contact_enabled', v)} />
            <Field label="Contact Label" value={get('topbar_contact_text', 'Contact Us')} onChange={(v) => set('topbar_contact_text', v)} />
            <LinkPicker label="Contact Link" value={get('topbar_contact_link', '/contact')} onChange={(v) => set('topbar_contact_link', v)} />
          </div>
        </div>
      </Card>

      <Card title="Header Logo" action={<SaveBar onSave={() => saveKeys(keys)} saving={saving} />}>
        <LogoUpload label="Site Logo" value={get('site_logo')} onChange={(v) => set('site_logo', v)} />
      </Card>

      <Card title="Header Action Icons" desc="কোন icon গুলো দেখাবে" action={<SaveBar onSave={() => saveKeys(keys)} saving={saving} />}>
        <div className="grid sm:grid-cols-2 gap-3">
          <Toggle label="Search" checked={bool('header_icon_search')} onChange={(v) => setBool('header_icon_search', v)} />
          <Toggle label="Wishlist" checked={bool('header_icon_wishlist')} onChange={(v) => setBool('header_icon_wishlist', v)} />
          <Toggle label="Account" checked={bool('header_icon_account')} onChange={(v) => setBool('header_icon_account', v)} />
          <Toggle label="Shopping Cart" checked={bool('header_icon_cart')} onChange={(v) => setBool('header_icon_cart', v)} />
        </div>
      </Card>
    </div>
  );
};

/* ------------- FOOTER ------------- */
const FooterTab = ({ d, get, set, bool, setBool, saveKeys, saving }: any) => {
  const menus: FooterMenu[] = parseList(d, 'footer_menus', DEFAULT_FOOTER_MENUS);
  const setMenus = (m: FooterMenu[]) => set('footer_menus', JSON.stringify(m));
  const payments: PaymentMethod[] = parseList(d, 'footer_payment_methods', DEFAULT_PAYMENT_METHODS);
  const setPayments = (p: PaymentMethod[]) => set('footer_payment_methods', JSON.stringify(p));

  const keys = [
    'footer_logo', 'footer_brand_name', 'footer_description', 'footer_address', 'footer_phone', 'footer_email', 'footer_copyright',
    'footer_menus', 'footer_payment_methods',
    'footer_whatsapp', 'footer_messenger', 'footer_whatsapp_number', 'product_message_link',
  ];

  return (
    <div className="space-y-5">
      <Card title="Footer Company Info" action={<SaveBar onSave={() => saveKeys(keys)} saving={saving} />}>
        <LogoUpload label="Footer Logo (optional)" value={get('footer_logo')} onChange={(v) => set('footer_logo', v)} />
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Store Name" value={get('footer_brand_name', 'EIDLIP')} onChange={(v) => set('footer_brand_name', v)} />
          <Field label="Phone" value={get('footer_phone', '+880 1234 567890')} onChange={(v) => set('footer_phone', v)} />
          <Field label="Email" value={get('footer_email', 'INFO@EIDLIP.COM')} onChange={(v) => set('footer_email', v)} />
          <Field label="Address" value={get('footer_address', '')} onChange={(v) => set('footer_address', v)} />
        </div>
        <div>
          <label className="text-xs text-muted-foreground tracking-wider uppercase block mb-1">Short Description</label>
          <textarea value={get('footer_description', '')} onChange={(e) => set('footer_description', e.target.value)} className="luxury-input w-full min-h-[70px]" placeholder="Short brand description" />
        </div>
        <Field label="Copyright Text" value={get('footer_copyright', '')} onChange={(v) => set('footer_copyright', v)} placeholder="© 2026 EIDLIP. All rights reserved." />
      </Card>

      <Card title="Quick Message Links" desc="Used by the floating buttons, mobile bottom nav & product page “Message Now”." action={<SaveBar onSave={() => saveKeys(keys)} saving={saving} />}>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="WhatsApp Link" value={get('footer_whatsapp')} onChange={(v) => set('footer_whatsapp', v)} placeholder="https://wa.me/8801XXXXXXXXX" />
          <Field label="WhatsApp Number" value={get('footer_whatsapp_number')} onChange={(v) => set('footer_whatsapp_number', v)} placeholder="8801XXXXXXXXX" />
          <Field label="Messenger Link" value={get('footer_messenger')} onChange={(v) => set('footer_messenger', v)} placeholder="https://m.me/yourpage" />
          <Field label="Product Page “Message Now” Link" value={get('product_message_link')} onChange={(v) => set('product_message_link', v)} placeholder="https://m.me/yourpage" />
        </div>
      </Card>

      <Card
        title="Footer Menus"
        desc="Dynamic footer menu columns"
        action={
          <div className="flex items-center gap-2">
            <button onClick={() => setMenus([...menus, { title: 'New Menu', links: [] }])} className="luxury-button-outline inline-flex items-center gap-1 text-[10px]"><Plus size={12} /> Menu</button>
            <SaveBar onSave={() => saveKeys(keys)} saving={saving} />
          </div>
        }
      >
        <div className="grid md:grid-cols-2 gap-4">
          {menus.map((menu, mi) => (
            <div key={mi} className="border border-border p-3 space-y-2">
              <div className="flex items-center gap-2">
                <input value={menu.title} onChange={(e) => { const n = [...menus]; n[mi] = { ...menu, title: e.target.value }; setMenus(n); }} className="luxury-input flex-1 font-medium" placeholder="Menu title" />
                <button onClick={() => setMenus(menus.filter((_, i) => i !== mi))} className="text-destructive p-1"><Trash2 size={14} /></button>
              </div>
              {menu.links.map((link, li) => (
                <div key={li} className="border border-border/60 p-2 space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <input value={link.label} onChange={(e) => { const n = [...menus]; n[mi].links[li] = { ...link, label: e.target.value }; setMenus(n); }} className="luxury-input flex-1 text-xs" placeholder="Label" />
                    <button onClick={() => { const n = [...menus]; n[mi].links = menu.links.filter((_, i) => i !== li); setMenus(n); }} className="text-destructive p-1"><Trash2 size={12} /></button>
                  </div>
                  <LinkPicker label="Link" value={link.url} onChange={(v) => { const n = [...menus]; n[mi].links[li] = { ...link, url: v }; setMenus(n); }} />
                </div>
              ))}
              <button onClick={() => { const n = [...menus]; n[mi].links = [...menu.links, { label: '', url: '' }]; setMenus(n); }} className="text-[10px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1"><Plus size={11} /> Add link</button>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Payment Methods" desc="Footer এ কোন payment icon দেখাবে" action={<SaveBar onSave={() => saveKeys(keys)} saving={saving} />}>
        <div className="grid sm:grid-cols-2 gap-3">
          {payments.map((pm, i) => (
            <Toggle key={pm.key} label={pm.label} checked={pm.enabled} onChange={(v) => { const n = [...payments]; n[i] = { ...pm, enabled: v }; setPayments(n); }} />
          ))}
        </div>
      </Card>
    </div>
  );
};

/* ------------- CONTACT ------------- */
const ContactTab = ({ get, set, saveKeys, saving }: any) => {
  const keys = ['contact_store_name', 'contact_phone1', 'contact_phone2', 'contact_whatsapp', 'contact_email', 'contact_address', 'contact_map_link', 'contact_business_hours', 'contact_emergency'];
  return (
    <Card title="Contact Information" desc="Store এর সব যোগাযোগের তথ্য" action={<SaveBar onSave={() => saveKeys(keys)} saving={saving} />}>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Store Name" value={get('contact_store_name')} onChange={(v) => set('contact_store_name', v)} />
        <Field label="Phone Number 1" value={get('contact_phone1')} onChange={(v) => set('contact_phone1', v)} />
        <Field label="Phone Number 2" value={get('contact_phone2')} onChange={(v) => set('contact_phone2', v)} />
        <Field label="WhatsApp Number" value={get('contact_whatsapp')} onChange={(v) => set('contact_whatsapp', v)} />
        <Field label="Email" value={get('contact_email')} onChange={(v) => set('contact_email', v)} />
        <Field label="Google Map Link" value={get('contact_map_link')} onChange={(v) => set('contact_map_link', v)} />
        <Field label="Business Hours" value={get('contact_business_hours')} onChange={(v) => set('contact_business_hours', v)} placeholder="Sat-Thu 10am - 8pm" />
        <Field label="Emergency Contact" value={get('contact_emergency')} onChange={(v) => set('contact_emergency', v)} />
      </div>
      <div>
        <label className="text-xs text-muted-foreground tracking-wider uppercase block mb-1">Address</label>
        <textarea value={get('contact_address')} onChange={(e) => set('contact_address', e.target.value)} className="luxury-input w-full min-h-[70px]" />
      </div>
    </Card>
  );
};

/* ------------- BUSINESS INFORMATION ------------- */
const BusinessTab = ({ get, set, saveKeys, saving }: any) => {
  const keys = [
    'business_name', 'business_tagline', 'business_email', 'business_phone',
    'business_whatsapp', 'business_messenger', 'business_telegram', 'business_address',
    'business_map_url', 'business_hours', 'business_copyright',
  ];
  return (
    <Card title="Business Information" desc="Global store identity — used by Footer, Contact page ও SEO schema." action={<SaveBar onSave={() => saveKeys(keys)} saving={saving} />}>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Store Name" value={get('business_name', 'EIDLIP')} onChange={(v) => set('business_name', v)} />
        <Field label="Tagline" value={get('business_tagline')} onChange={(v) => set('business_tagline', v)} placeholder="Premium fashion, delivered." />
        <Field label="Email" value={get('business_email')} onChange={(v) => set('business_email', v)} placeholder="info@eidlip.com" />
        <Field label="Phone" value={get('business_phone')} onChange={(v) => set('business_phone', v)} placeholder="+8801XXXXXXXXX" />
        <Field label="WhatsApp" value={get('business_whatsapp')} onChange={(v) => set('business_whatsapp', v)} placeholder="8801XXXXXXXXX" />
        <Field label="Messenger URL" value={get('business_messenger')} onChange={(v) => set('business_messenger', v)} placeholder="https://m.me/yourpage" />
        <Field label="Telegram URL" value={get('business_telegram')} onChange={(v) => set('business_telegram', v)} placeholder="https://t.me/yourchannel" />
        <Field label="Google Maps URL" value={get('business_map_url')} onChange={(v) => set('business_map_url', v)} placeholder="https://maps.google.com/..." />
        <Field label="Working Hours" value={get('business_hours')} onChange={(v) => set('business_hours', v)} placeholder="Sat–Thu: 10AM – 8PM" />
      </div>
      <div>
        <label className="text-xs text-muted-foreground tracking-wider uppercase block mb-1">Address</label>
        <textarea value={get('business_address')} onChange={(e: any) => set('business_address', e.target.value)} className="luxury-input w-full min-h-[70px]" placeholder="Store address" />
      </div>
      <Field label="Copyright Text" value={get('business_copyright')} onChange={(v) => set('business_copyright', v)} placeholder="© 2026 EIDLIP. All rights reserved." />
    </Card>
  );
};

/* ------------- QUICK LINKS (floating message buttons) ------------- */
const QuickLinksTab = ({ d, set, bool, setBool, saveKeys, saving }: any) => {
  const items: QuickContact[] = getQuickContactsRaw(d);
  const setItems = (list: QuickContact[]) => set('quick_contacts', JSON.stringify(list));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const n = [...items];
    [n[i], n[j]] = [n[j], n[i]];
    setItems(n);
  };
  const keys = ['quick_contacts_enabled', 'quick_contacts'];
  const placeholder = (t: QuickContactType) =>
    t === 'whatsapp' ? '8801XXXXXXXXX or https://wa.me/...'
      : t === 'phone' ? '+8801XXXXXXXXX'
      : t === 'email' ? 'info@eidlip.com'
      : 'https://...';
  return (
    <Card
      title="Quick Message Links"
      desc="Floating contact buttons shown on the storefront. Drag order, toggle per-device visibility — all DB-driven."
      action={
        <div className="flex items-center gap-2">
          <button
            onClick={() => setItems([...items, { key: `c${Date.now()}`, type: 'whatsapp', label: 'WhatsApp', value: '', enabled: true, device: 'all', newTab: true }])}
            className="luxury-button-outline inline-flex items-center gap-1 text-[10px]"
          ><Plus size={12} /> Link</button>
          <SaveBar onSave={() => saveKeys(keys)} saving={saving} />
        </div>
      }
    >
      <Toggle label="Floating quick links চালু রাখুন" checked={bool('quick_contacts_enabled')} onChange={(v) => setBool('quick_contacts_enabled', v)} />
      <div className="space-y-3 pt-1">
        {items.map((c, i) => (
          <div key={c.key} className="border border-border p-3 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <GripVertical size={14} className="text-muted-foreground shrink-0" />
              <select
                value={c.type}
                onChange={(e) => { const n = [...items]; n[i] = { ...c, type: e.target.value as QuickContactType }; setItems(n); }}
                className="luxury-input text-xs w-28"
              >
                {QUICK_CONTACT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
              <input value={c.label} onChange={(e) => { const n = [...items]; n[i] = { ...c, label: e.target.value }; setItems(n); }} className="luxury-input text-xs w-32" placeholder="Label" />
              <input value={c.value} onChange={(e) => { const n = [...items]; n[i] = { ...c, value: e.target.value }; setItems(n); }} className="luxury-input text-xs flex-1 min-w-[160px]" placeholder={placeholder(c.type)} />
              <button onClick={() => move(i, -1)} className="p-1 text-muted-foreground"><ArrowUp size={13} /></button>
              <button onClick={() => move(i, 1)} className="p-1 text-muted-foreground"><ArrowDown size={13} /></button>
              <button onClick={() => setItems(items.filter((_, x) => x !== i))} className="text-destructive p-1"><Trash2 size={13} /></button>
            </div>
            <div className="flex flex-wrap items-center gap-2 pl-6">
              <select
                value={c.device}
                onChange={(e) => { const n = [...items]; n[i] = { ...c, device: e.target.value as QuickContact['device'] }; setItems(n); }}
                className="luxury-input text-xs w-32"
              >
                <option value="all">All devices</option>
                <option value="mobile">Mobile only</option>
                <option value="desktop">Desktop only</option>
              </select>
              <button onClick={() => { const n = [...items]; n[i] = { ...c, newTab: !c.newTab }; setItems(n); }} className={`text-[10px] px-2 py-1 border border-border ${c.newTab ? 'text-foreground' : 'text-muted-foreground'}`}>New tab: {c.newTab ? 'ON' : 'OFF'}</button>
              <button onClick={() => { const n = [...items]; n[i] = { ...c, enabled: !c.enabled }; setItems(n); }} className={`text-[10px] px-2 py-1 border border-border ${c.enabled ? 'text-foreground' : 'text-muted-foreground'}`}>{c.enabled ? 'ENABLED' : 'DISABLED'}</button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-[11px] text-muted-foreground">No quick links yet. Add one above.</p>}
      </div>
    </Card>
  );
};

/* ------------- NEWSLETTER ------------- */
const NewsletterTab = ({ get, set, bool, setBool, saveKeys, saving }: any) => {
  const keys = [
    'newsletter_enabled', 'newsletter_title', 'newsletter_subtitle', 'newsletter_placeholder',
    'newsletter_button_text', 'newsletter_success_message', 'newsletter_error_message',
    'newsletter_double_optin', 'newsletter_allow_duplicate',
    'newsletter_show_homepage', 'newsletter_show_blog', 'newsletter_show_footer', 'newsletter_show_checkout',
    'newsletter_thankyou_title', 'newsletter_thankyou_message',
  ];
  return (
    <div className="space-y-5">
      <Card title="Newsletter — General" desc="সব newsletter form এই settings থেকে control হয়" action={<SaveBar onSave={() => saveKeys(keys)} saving={saving} />}>
        <Toggle label="Newsletter চালু রাখুন (global)" checked={bool('newsletter_enabled')} onChange={(v) => setBool('newsletter_enabled', v)} />
        <div className="grid sm:grid-cols-2 gap-4 pt-1">
          <Field label="Title" value={get('newsletter_title', 'Join our newsletter')} onChange={(v) => set('newsletter_title', v)} />
          <Field label="CTA Button Text" value={get('newsletter_button_text', 'Subscribe')} onChange={(v) => set('newsletter_button_text', v)} />
          <Field label="Placeholder" value={get('newsletter_placeholder', 'Enter your email')} onChange={(v) => set('newsletter_placeholder', v)} />
          <Field label="Subtitle / Description" value={get('newsletter_subtitle', 'Subscribe to get updates on new arrivals & exclusive offers.')} onChange={(v) => set('newsletter_subtitle', v)} />
          <Field label="Success Message" value={get('newsletter_success_message', 'Subscribed successfully!')} onChange={(v) => set('newsletter_success_message', v)} />
          <Field label="Error Message" value={get('newsletter_error_message', 'Failed to subscribe. Please try again.')} onChange={(v) => set('newsletter_error_message', v)} />
        </div>
        <div className="grid sm:grid-cols-2 gap-3 pt-1">
          <Toggle label="Double opt-in চালু" checked={bool('newsletter_double_optin', false)} onChange={(v) => setBool('newsletter_double_optin', v)} />
          <Toggle label="Duplicate email allow করুন" checked={bool('newsletter_allow_duplicate', false)} onChange={(v) => setBool('newsletter_allow_duplicate', v)} />
        </div>
      </Card>

      <Card title="Visibility" desc="কোন কোন জায়গায় newsletter form দেখাবে" action={<SaveBar onSave={() => saveKeys(keys)} saving={saving} />}>
        <div className="grid sm:grid-cols-2 gap-3">
          <Toggle label="Homepage section" checked={bool('newsletter_show_homepage', true)} onChange={(v) => setBool('newsletter_show_homepage', v)} />
          <Toggle label="Blog section" checked={bool('newsletter_show_blog', true)} onChange={(v) => setBool('newsletter_show_blog', v)} />
          <Toggle label="Footer section" checked={bool('newsletter_show_footer', true)} onChange={(v) => setBool('newsletter_show_footer', v)} />
          <Toggle label="Checkout opt-in" checked={bool('newsletter_show_checkout', false)} onChange={(v) => setBool('newsletter_show_checkout', v)} />
        </div>
      </Card>

      <Card title="Thank-you Message" desc="Subscribe করার পর যা দেখাবে" action={<SaveBar onSave={() => saveKeys(keys)} saving={saving} />}>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Thank-you Title" value={get('newsletter_thankyou_title', 'Thank you for subscribing.')} onChange={(v) => set('newsletter_thankyou_title', v)} />
          <Field label="Thank-you Message" value={get('newsletter_thankyou_message', "You're on the list — watch your inbox for new drops & offers.")} onChange={(v) => set('newsletter_thankyou_message', v)} />
        </div>
      </Card>
    </div>
  );
};

/* ------------- SOCIAL MEDIA (structured, DB-driven) ------------- */
const isValidSocialUrl = (u: string) => {
  const v = (u || '').trim();
  if (!v) return true; // empty allowed (just hidden)
  try { const p = new URL(v); return p.protocol === 'http:' || p.protocol === 'https:'; } catch { return false; }
};

const SocialTab = ({ d, set, bool, setBool, saveKeys, saving }: any) => {
  const items: SocialLink[] = getSocialLinksRaw(d);
  const setItems = (list: SocialLink[]) => set('social_links', JSON.stringify(list));
  const update = (i: number, patch: Partial<SocialLink>) => {
    const n = [...items];
    n[i] = { ...n[i], ...patch };
    setItems(n);
  };
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const n = [...items];
    [n[i], n[j]] = [n[j], n[i]];
    setItems(n);
  };
  const addPlatform = () => {
    const used = new Set(items.map((i) => i.key));
    const next = SOCIAL_PLATFORM_DEFS.find((p) => !used.has(p.key)) || SOCIAL_PLATFORM_DEFS[0];
    setItems([...items, { key: next.key, label: next.label, url: '', enabled: true, newTab: true, showHeader: true, showFooter: true, showMobile: true }]);
  };
  const keys = ['social_enabled', 'social_links'];
  const onSave = () => {
    const bad = items.find((c) => c.enabled && !isValidSocialUrl(c.url));
    if (bad) { toast.error(`Invalid URL for ${bad.label} — must start with http(s)://`); return; }
    saveKeys(keys);
  };

  return (
    <Card
      title="Social Media"
      desc="Reorder, toggle visibility per surface, validate URLs — fully DB-driven. Empty URLs auto-hide."
      action={
        <div className="flex items-center gap-2">
          <button onClick={addPlatform} className="luxury-button-outline inline-flex items-center gap-1 text-[10px]"><Plus size={12} /> Platform</button>
          <SaveBar onSave={onSave} saving={saving} />
        </div>
      }
    >
      <Toggle label="Social links চালু রাখুন (global)" checked={bool('social_enabled')} onChange={(v) => setBool('social_enabled', v)} />
      <div className="space-y-3 pt-1">
        {items.map((c, i) => {
          const invalid = c.enabled && !isValidSocialUrl(c.url);
          return (
            <div key={`${c.key}-${i}`} className="border border-border p-3 space-y-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <GripVertical size={14} className="text-muted-foreground shrink-0" />
                <select
                  value={c.key}
                  onChange={(e) => { const def = SOCIAL_PLATFORM_DEFS.find((p) => p.key === e.target.value); update(i, { key: e.target.value, label: def?.label || e.target.value }); }}
                  className="luxury-input text-xs w-32"
                >
                  {SOCIAL_PLATFORM_DEFS.map((p) => <option key={p.key} value={p.key}>{p.label}</option>)}
                  {!SOCIAL_PLATFORM_DEFS.some((p) => p.key === c.key) && <option value={c.key}>{c.label}</option>}
                </select>
                <input
                  value={c.url}
                  onChange={(e) => update(i, { url: e.target.value })}
                  className={`luxury-input text-xs flex-1 min-w-[180px] ${invalid ? 'border-destructive' : ''}`}
                  placeholder="https://..."
                />
                {c.url.trim() && isValidSocialUrl(c.url) && (
                  <a href={c.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-muted-foreground hover:text-foreground underline">Preview</a>
                )}
                <button onClick={() => move(i, -1)} className="p-1 text-muted-foreground"><ArrowUp size={13} /></button>
                <button onClick={() => move(i, 1)} className="p-1 text-muted-foreground"><ArrowDown size={13} /></button>
                <button onClick={() => update(i, { enabled: !c.enabled })} className={`text-[10px] px-2 py-1 ${c.enabled ? 'text-foreground' : 'text-muted-foreground'}`}>{c.enabled ? 'ON' : 'OFF'}</button>
                <button onClick={() => setItems(items.filter((_, x) => x !== i))} className="text-destructive p-1"><Trash2 size={13} /></button>
              </div>
              {invalid && <p className="text-[10px] text-destructive">URL must start with http:// or https://</p>}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-muted-foreground">
                <label className="inline-flex items-center gap-1.5 cursor-pointer"><input type="checkbox" checked={c.newTab} onChange={(e) => update(i, { newTab: e.target.checked })} /> New tab</label>
                <label className="inline-flex items-center gap-1.5 cursor-pointer"><input type="checkbox" checked={c.showHeader} onChange={(e) => update(i, { showHeader: e.target.checked })} /> Header</label>
                <label className="inline-flex items-center gap-1.5 cursor-pointer"><input type="checkbox" checked={c.showFooter} onChange={(e) => update(i, { showFooter: e.target.checked })} /> Footer</label>
                <label className="inline-flex items-center gap-1.5 cursor-pointer"><input type="checkbox" checked={c.showMobile} onChange={(e) => update(i, { showMobile: e.target.checked })} /> Mobile menu</label>
              </div>
            </div>
          );
        })}
        {items.length === 0 && <p className="text-xs text-muted-foreground">No social platforms yet. Click “Platform” to add one.</p>}
      </div>
    </Card>
  );
};

/* ------------- TRUST & STORE ------------- */
const TrustTab = ({ d, set, saveKeys, saving }: any) => {
  const features: TrustFeature[] = parseList(d, 'footer_trust_features', DEFAULT_TRUST_FEATURES);
  const setFeatures = (f: TrustFeature[]) => set('footer_trust_features', JSON.stringify(f));
  const bar: TrustBarItem[] = parseList(d, 'trust_bar_items', DEFAULT_TRUST_BAR);
  const setBar = (b: TrustBarItem[]) => set('trust_bar_items', JSON.stringify(b));
  const move = <T,>(arr: T[], i: number, dir: -1 | 1): T[] => {
    const j = i + dir;
    if (j < 0 || j >= arr.length) return arr;
    const n = [...arr];
    [n[i], n[j]] = [n[j], n[i]];
    return n;
  };
  const keys = ['footer_trust_features', 'trust_bar_items'];
  return (
    <div className="space-y-5">
      <Card
        title="Trust Bar (Homepage icon row)"
        desc="Homepage এর উপরের 4টি feature box"
        action={<SaveBar onSave={() => saveKeys(keys)} saving={saving} />}
      >
        <div className="space-y-2">
          {bar.map((item, i) => (
            <div key={i} className="flex flex-wrap items-center gap-2 border border-border p-2">
              <GripVertical size={14} className="text-muted-foreground shrink-0" />
              <select value={item.icon} onChange={(e) => { const n = [...bar]; n[i] = { ...item, icon: e.target.value }; setBar(n); }} className="luxury-input text-xs w-24">
                {TRUST_ICONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
              </select>
              <input value={item.title} onChange={(e) => { const n = [...bar]; n[i] = { ...item, title: e.target.value }; setBar(n); }} className="luxury-input text-xs flex-1 min-w-[120px]" placeholder="Title" />
              <input value={item.desc} onChange={(e) => { const n = [...bar]; n[i] = { ...item, desc: e.target.value }; setBar(n); }} className="luxury-input text-xs flex-1 min-w-[120px]" placeholder="Description" />
              <button onClick={() => setBar(move(bar, i, -1))} className="p-1 text-muted-foreground"><ArrowUp size={13} /></button>
              <button onClick={() => setBar(move(bar, i, 1))} className="p-1 text-muted-foreground"><ArrowDown size={13} /></button>
              <button onClick={() => { const n = [...bar]; n[i] = { ...item, enabled: !item.enabled }; setBar(n); }} className={`text-[10px] px-2 py-1 ${item.enabled ? 'text-foreground' : 'text-muted-foreground'}`}>{item.enabled ? 'ON' : 'OFF'}</button>
              <button onClick={() => setBar(bar.filter((_, x) => x !== i))} className="text-destructive p-1"><Trash2 size={13} /></button>
            </div>
          ))}
        </div>
        <button onClick={() => setBar([...bar, { icon: 'truck', title: '', desc: '', enabled: true }])} className="text-[10px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1"><Plus size={11} /> Add item</button>
      </Card>

      <Card
        title="Why shop with us (Footer list)"
        desc="Footer এর feature list"
        action={<SaveBar onSave={() => saveKeys(keys)} saving={saving} />}
      >
        <div className="space-y-2">
          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-2 border border-border p-2">
              <input value={f.text} onChange={(e) => { const n = [...features]; n[i] = { ...f, text: e.target.value }; setFeatures(n); }} className="luxury-input text-xs flex-1" placeholder="Feature text" />
              <button onClick={() => setFeatures(move(features, i, -1))} className="p-1 text-muted-foreground"><ArrowUp size={13} /></button>
              <button onClick={() => setFeatures(move(features, i, 1))} className="p-1 text-muted-foreground"><ArrowDown size={13} /></button>
              <button onClick={() => { const n = [...features]; n[i] = { ...f, enabled: !f.enabled }; setFeatures(n); }} className={`text-[10px] px-2 py-1 ${f.enabled ? 'text-foreground' : 'text-muted-foreground'}`}>{f.enabled ? 'ON' : 'OFF'}</button>
              <button onClick={() => setFeatures(features.filter((_, x) => x !== i))} className="text-destructive p-1"><Trash2 size={13} /></button>
            </div>
          ))}
        </div>
        <button onClick={() => setFeatures([...features, { text: '', enabled: true }])} className="text-[10px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1"><Plus size={11} /> Add feature</button>
      </Card>
    </div>
  );
};

export default AdminWebsiteSettings;