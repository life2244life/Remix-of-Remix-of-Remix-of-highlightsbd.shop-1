import { useState } from 'react';
import { Search, Facebook, MessageCircle, Twitter, Monitor, Smartphone } from 'lucide-react';

/**
 * Live SERP + social share previews for the admin SEO Assistant.
 *
 * Pure presentation: renders Google, Facebook, WhatsApp and Twitter(X) cards
 * from the SEO fields already present in the editor. No network, no database,
 * no storefront impact. Mirrors the storefront constants in src/components/SEO.tsx.
 */

const SITE_ORIGIN = 'https://demo.eidlip.com';
const SITE_NAME = 'EIDLIP';
const TWITTER_SITE = '@eidlip';

const absUrl = (path: string) => {
  if (!path) return `${SITE_ORIGIN}/`;
  if (/^https?:\/\//i.test(path)) return path;
  return SITE_ORIGIN + (path.startsWith('/') ? path : `/${path}`);
};

const truncate = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);

export type PreviewData = {
  /** Effective meta/SEO title (falls back to name/post title upstream). */
  title: string;
  /** Effective meta description (falls back to excerpt upstream). */
  description: string;
  /** Route path, e.g. "/products/mens-panjabi". */
  path: string;
  /** Primary image URL (cover/gallery). Optional. */
  image?: string;
};

const CharCount = ({ value, min, max, label }: { value: number; min: number; max: number; label: string }) => {
  const ok = value >= min && value <= max;
  const cls = value === 0
    ? 'text-muted-foreground'
    : ok
      ? 'text-emerald-600 dark:text-emerald-400'
      : 'text-amber-600 dark:text-amber-400';
  return (
    <span className={`text-[10px] font-mono ${cls}`}>
      {label}: {value} ({min}–{max})
    </span>
  );
};

const breadcrumbUrl = (path: string) => {
  const clean = path.replace(/^\//, '');
  const parts = clean.split('/').filter(Boolean);
  return ['demo.eidlip.com', ...parts].join(' › ');
};

const GooglePreview = ({ d }: { d: PreviewData }) => {
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const title = d.title || 'Untitled page';
  const desc = d.description || 'No meta description set — Google will pick text from the page.';
  const titleCap = device === 'mobile' ? 55 : 60;
  const descCap = device === 'mobile' ? 120 : 160;
  return (
    <div className="rounded-md border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
          <Search size={13} /> Google Search Preview
        </div>
        <div className="flex gap-1">
          <button type="button" onClick={() => setDevice('desktop')}
            className={`flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] ${device === 'desktop' ? 'bg-muted text-foreground' : 'text-muted-foreground'}`}>
            <Monitor size={11} /> Desktop
          </button>
          <button type="button" onClick={() => setDevice('mobile')}
            className={`flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] ${device === 'mobile' ? 'bg-muted text-foreground' : 'text-muted-foreground'}`}>
            <Smartphone size={11} /> Mobile
          </button>
        </div>
      </div>
      <div className={`rounded-md bg-white p-3 ${device === 'mobile' ? 'max-w-[360px]' : ''}`}>
        <div className="truncate text-[12px] text-[#202124]">{breadcrumbUrl(d.path)}</div>
        <div className="mt-0.5 truncate text-[18px] leading-snug text-[#1a0dab]">{truncate(title, titleCap)}</div>
        <div className="mt-0.5 text-[13px] leading-snug text-[#4d5156] line-clamp-2">{truncate(desc, descCap)}</div>
      </div>
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
        <CharCount value={title.length} min={50} max={60} label="Title" />
        <CharCount value={desc.length} min={140} max={160} label="Description" />
      </div>
    </div>
  );
};

const FacebookPreview = ({ d }: { d: PreviewData }) => (
  <div className="rounded-md border border-border bg-card p-4">
    <div className="mb-3 flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
      <Facebook size={13} /> Facebook Share Preview
    </div>
    <div className="max-w-[420px] overflow-hidden rounded-md border border-[#dadde1] bg-white">
      <div className="aspect-[1.91/1] w-full bg-[#e4e6eb]">
        {d.image
          ? <img src={d.image} alt="" className="h-full w-full object-cover" />
          : <div className="flex h-full w-full items-center justify-center text-[11px] text-[#65676b]">No og:image set</div>}
      </div>
      <div className="border-t border-[#dadde1] px-3 py-2">
        <div className="text-[11px] uppercase tracking-wide text-[#606770]">demo.eidlip.com</div>
        <div className="mt-0.5 truncate text-[15px] font-semibold text-[#1d2129]">{truncate(d.title || SITE_NAME, 88)}</div>
        <div className="mt-0.5 truncate text-[13px] text-[#606770]">{truncate(d.description || '', 110)}</div>
      </div>
    </div>
    <p className="mt-2 text-[10px] text-muted-foreground font-mono">og:url {absUrl(d.path)} · og:site_name {SITE_NAME}</p>
  </div>
);

const WhatsAppPreview = ({ d }: { d: PreviewData }) => (
  <div className="rounded-md border border-border bg-card p-4">
    <div className="mb-3 flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
      <MessageCircle size={13} /> WhatsApp Share Preview
    </div>
    <div className="max-w-[340px] rounded-lg bg-[#dcf8c6] p-1.5">
      <div className="overflow-hidden rounded-md bg-white">
        <div className="aspect-[1.91/1] w-full bg-[#e4e6eb]">
          {d.image
            ? <img src={d.image} alt="" className="h-full w-full object-cover" />
            : <div className="flex h-full w-full items-center justify-center text-[11px] text-[#667781]">No image</div>}
        </div>
        <div className="px-2.5 py-1.5">
          <div className="truncate text-[13px] font-medium text-[#111b21]">{truncate(d.title || SITE_NAME, 65)}</div>
          <div className="mt-0.5 line-clamp-2 text-[12px] text-[#667781]">{truncate(d.description || '', 90)}</div>
          <div className="mt-0.5 truncate text-[11px] text-[#8696a0]">{absUrl(d.path)}</div>
        </div>
      </div>
    </div>
  </div>
);

const TwitterPreview = ({ d }: { d: PreviewData }) => (
  <div className="rounded-md border border-border bg-card p-4">
    <div className="mb-3 flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
      <Twitter size={13} /> X (Twitter) Card Preview
    </div>
    <div className="max-w-[420px] overflow-hidden rounded-2xl border border-[#cfd9de] bg-white">
      <div className="aspect-[1.91/1] w-full bg-[#e1e8ed]">
        {d.image
          ? <img src={d.image} alt="" className="h-full w-full object-cover" />
          : <div className="flex h-full w-full items-center justify-center text-[11px] text-[#536471]">summary_large_image</div>}
      </div>
      <div className="px-3 py-2">
        <div className="truncate text-[11px] text-[#536471]">demo.eidlip.com</div>
        <div className="mt-0.5 truncate text-[15px] font-semibold text-[#0f1419]">{truncate(d.title || SITE_NAME, 70)}</div>
        <div className="mt-0.5 line-clamp-2 text-[13px] text-[#536471]">{truncate(d.description || '', 120)}</div>
      </div>
    </div>
    <p className="mt-2 text-[10px] text-muted-foreground font-mono">twitter:card summary_large_image · twitter:site {TWITTER_SITE}</p>
  </div>
);

const tabs = [
  { id: 'google', label: 'Google', Icon: Search },
  { id: 'facebook', label: 'Facebook', Icon: Facebook },
  { id: 'whatsapp', label: 'WhatsApp', Icon: MessageCircle },
  { id: 'twitter', label: 'X', Icon: Twitter },
] as const;

const SerpSocialPreviews = ({ data }: { data: PreviewData }) => {
  const [tab, setTab] = useState<(typeof tabs)[number]['id']>('google');
  return (
    <div className="border border-border bg-card">
      <div className="flex flex-wrap gap-1 border-b border-border p-2">
        {tabs.map(({ id, label, Icon }) => (
          <button
            key={id} type="button" onClick={() => setTab(id)}
            className={`flex items-center gap-1.5 rounded px-2.5 py-1 text-[11px] transition-colors ${tab === id ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Icon size={12} /> {label}
          </button>
        ))}
      </div>
      <div className="p-3">
        {tab === 'google' && <GooglePreview d={data} />}
        {tab === 'facebook' && <FacebookPreview d={data} />}
        {tab === 'whatsapp' && <WhatsAppPreview d={data} />}
        {tab === 'twitter' && <TwitterPreview d={data} />}
      </div>
    </div>
  );
};

export default SerpSocialPreviews;