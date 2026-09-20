import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Truck, Wallet, RotateCcw, ShieldCheck, Check, Star, Heart,
  Gift, Clock, Phone, Tag, Award, type LucideIcon,
} from 'lucide-react';
import type { HomepageSection } from '@/hooks/useSupabase';
import {
  parseBannerConfig, parsePosterConfig, parseCustomConfig,
  bannerLayoutMeta, isScheduleActive, alignItemsClass,
  type BannerItem, type PosterItem, type CustomItem, type Align,
} from '@/lib/homepageBlocks';

const ICONS: Record<string, LucideIcon> = {
  truck: Truck, wallet: Wallet, return: RotateCcw, shield: ShieldCheck, check: Check,
  star: Star, heart: Heart, gift: Gift, clock: Clock, phone: Phone, tag: Tag, award: Award,
};

const linkProps = (url: string) => /^https?:\/\//.test(url) ? { href: url } : null;
const Smart = ({ url, className, children }: { url: string; className?: string; children: React.ReactNode }) => {
  const ext = linkProps(url);
  if (ext) return <a href={url} className={className}>{children}</a>;
  return <Link to={url || '/'} className={className}>{children}</Link>;
};

/* ---------------- Countdown ---------------- */
const useCountdown = (target: string) => {
  const [left, setLeft] = useState(() => Math.max(0, new Date(target).getTime() - Date.now()));
  useEffect(() => {
    if (!target) return;
    const t = setInterval(() => setLeft(Math.max(0, new Date(target).getTime() - Date.now())), 1000);
    return () => clearInterval(t);
  }, [target]);
  const s = Math.floor(left / 1000);
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60, done: left <= 0 };
};

const Countdown = ({ target }: { target: string }) => {
  const c = useCountdown(target);
  if (c.done) return null;
  const cell = (n: number, l: string) => (
    <div className="flex flex-col items-center rounded bg-black/60 px-2 py-1 text-white">
      <span className="text-sm font-bold leading-none">{String(n).padStart(2, '0')}</span>
      <span className="text-[8px] uppercase opacity-80">{l}</span>
    </div>
  );
  return (
    <div className="mt-2 flex gap-1.5">
      {c.d > 0 && cell(c.d, 'd')}{cell(c.h, 'h')}{cell(c.m, 'm')}{cell(c.s, 's')}
    </div>
  );
};

/* ---------------- Banner ---------------- */
const BannerCard = ({ item, ratio }: { item: BannerItem; ratio: number }) => {
  if (!item.desktopImage && !item.mobileImage && !item.title) return null;
  return (
    <Smart url={item.buttonUrl} className="group relative block overflow-hidden rounded-card">
      <div style={{ aspectRatio: String(ratio) }} className="relative w-full">
        <picture>
          {item.mobileImage && <source media="(max-width: 640px)" srcSet={item.mobileImage} />}
          <img
            src={item.desktopImage || item.mobileImage}
            alt={item.title || 'Banner'}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </picture>
        <div className="absolute inset-0 bg-black" style={{ opacity: item.overlay / 100 }} />
        {(item.title || item.subtitle || item.description || item.buttonText) && (
          <div className={`absolute inset-0 flex flex-col justify-center gap-2 p-6 sm:p-8 ${alignItemsClass(item.align)}`} style={{ color: item.textColor }}>
            {item.subtitle && <span className="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-90">{item.subtitle}</span>}
            {item.title && <h3 className="max-w-[80%] text-xl font-extrabold leading-tight sm:text-3xl">{item.title}</h3>}
            {item.description && <p className="max-w-[70%] text-xs opacity-85 sm:text-sm">{item.description}</p>}
            {item.buttonText && (
              <span className="mt-2 inline-flex w-fit items-center gap-2 rounded-btn bg-white px-4 py-2 text-xs font-semibold text-fab-ink transition-transform group-hover:scale-105 sm:text-sm">
                {item.buttonText} <ArrowRight size={14} />
              </span>
            )}
          </div>
        )}
      </div>
    </Smart>
  );
};

const BannerBlock = ({ section }: { section: HomepageSection }) => {
  const cfg = parseBannerConfig(section.config);
  if (!isScheduleActive(cfg)) return null;
  const meta = bannerLayoutMeta(cfg.layout);
  const items = cfg.items.filter((i) => i.desktopImage || i.mobileImage || i.title);
  if (!items.length) return null;
  const colClass = meta.cols === 3 ? 'md:grid-cols-3' : meta.cols === 2 ? 'md:grid-cols-2' : 'grid-cols-1';
  return (
    <section className="fab-container">
      <div className={`grid grid-cols-1 gap-4 ${colClass}`}>
        {items.map((item) => <BannerCard key={item.id} item={item} ratio={meta.ratio} />)}
      </div>
    </section>
  );
};

/* ---------------- Poster ---------------- */
const PosterBlock = ({ section }: { section: HomepageSection }) => {
  const cfg = parsePosterConfig(section.config);
  if (!isScheduleActive(cfg)) return null;
  const items = cfg.items.filter((p: PosterItem) => p.image || p.title);
  if (!items.length) return null;
  const colClass = cfg.columns === 4 ? 'md:grid-cols-4' : cfg.columns === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3';
  return (
    <section className="fab-container">
      {section.title && <h2 className="mb-4 text-xl font-extrabold text-fab-ink sm:text-2xl">{section.title}</h2>}
      <div className={`grid grid-cols-2 gap-4 ${colClass}`}>
        {items.map((p) => (
          <Smart key={p.id} url={p.buttonUrl} className="group relative block overflow-hidden rounded-card">
            <div style={{ aspectRatio: '4 / 5' }} className="relative w-full bg-fab-soft">
              {p.image && <img src={p.image} alt={p.title || 'Poster'} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              {p.badge && <span className="absolute left-3 top-3 rounded-full bg-fab-accent px-2.5 py-1 text-[10px] font-bold uppercase text-white">{p.badge}</span>}
              <div className="absolute inset-x-0 bottom-0 flex flex-col p-4 text-white">
                {p.subtitle && <span className="text-[10px] uppercase tracking-wider opacity-90">{p.subtitle}</span>}
                {p.title && <h3 className="text-base font-bold leading-tight sm:text-lg">{p.title}</h3>}
                {p.countdownTo && <Countdown target={p.countdownTo} />}
                {p.buttonText && (
                  <span className="mt-2 inline-flex w-fit items-center gap-1 rounded-btn bg-white px-3 py-1.5 text-[11px] font-semibold text-fab-ink">
                    {p.buttonText} <ArrowRight size={12} />
                  </span>
                )}
              </div>
            </div>
          </Smart>
        ))}
      </div>
    </section>
  );
};

/* ---------------- Custom blocks ---------------- */
const CustomBlock = ({ section }: { section: HomepageSection }) => {
  const cfg = parseCustomConfig(section.config);
  if (!isScheduleActive(cfg)) return null;
  const heading = section.title || cfg.heading;

  const Header = () => (
    (heading || cfg.subheading) ? (
      <div className={`mb-6 flex flex-col ${alignItemsClass(cfg.align)}`}>
        {cfg.subheading && <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-fab-accent">{cfg.subheading}</span>}
        {heading && <h2 className="text-2xl font-extrabold text-fab-ink sm:text-3xl">{heading}</h2>}
      </div>
    ) : null
  );

  const Btn = () => cfg.buttonText ? (
    <Smart url={cfg.buttonUrl} className="mt-5 inline-flex w-fit items-center gap-2 rounded-btn bg-fab-ink px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-105">
      {cfg.buttonText} <ArrowRight size={15} />
    </Smart>
  ) : null;

  const wrap = (children: React.ReactNode) => (
    <section className="fab-container">
      <div className={cfg.bgTint ? 'rounded-card bg-fab-soft p-6 sm:p-10' : ''}>{children}</div>
    </section>
  );

  switch (cfg.blockType) {
    case 'text_only':
    case 'button':
      return wrap(
        <div className={`flex flex-col ${alignItemsClass(cfg.align)}`}>
          <Header />
          {cfg.body && <p className="max-w-2xl whitespace-pre-line text-sm text-fab-muted">{cfg.body}</p>}
          <Btn />
        </div>
      );

    case 'image_text':
    case 'brand_story':
      return wrap(
        <div className="grid items-center gap-6 md:grid-cols-2">
          {cfg.image && <img src={cfg.image} alt={heading} loading="lazy" className="w-full rounded-card object-cover" />}
          <div className={`flex flex-col ${alignItemsClass(cfg.align)} ${cfg.image ? '' : 'md:col-span-2'}`}>
            <Header />
            {cfg.body && <p className="whitespace-pre-line text-sm text-fab-muted">{cfg.body}</p>}
            <Btn />
          </div>
        </div>
      );

    case 'video':
      return wrap(
        <div className="flex flex-col items-center">
          <Header />
          {cfg.mediaUrl && (
            <div className="w-full max-w-4xl overflow-hidden rounded-card" style={{ aspectRatio: '16 / 9' }}>
              <iframe src={cfg.mediaUrl} title={heading || 'Video'} className="h-full w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            </div>
          )}
          <Btn />
        </div>
      );

    case 'benefits':
    case 'trust_icons':
      return wrap(
        <div>
          <Header />
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {cfg.items.map((it: CustomItem) => {
              const Icon = ICONS[it.icon] || Check;
              return (
                <div key={it.id} className="flex items-center gap-3 rounded-card border border-fab-line bg-fab-card p-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-fab-soft text-fab-accent"><Icon size={20} /></span>
                  <div className="min-w-0">
                    {it.title && <p className="truncate text-[13px] font-bold text-fab-ink">{it.title}</p>}
                    {it.text && <p className="truncate text-[11px] text-fab-muted">{it.text}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );

    case 'featured_brands':
      return wrap(
        <div>
          <Header />
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-6">
            {cfg.items.map((it: CustomItem) => (
              <Smart key={it.id} url={it.url} className="grid aspect-[3/2] place-items-center rounded-card border border-fab-line bg-fab-card p-3 transition-colors hover:border-fab-ink">
                {it.image ? <img src={it.image} alt={it.title} loading="lazy" className="max-h-12 max-w-full object-contain" /> : <span className="text-xs font-semibold text-fab-muted">{it.title}</span>}
              </Smart>
            ))}
          </div>
        </div>
      );

    case 'testimonials':
      return wrap(
        <div>
          <Header />
          <div className="grid gap-4 md:grid-cols-3">
            {cfg.items.map((it: CustomItem) => (
              <div key={it.id} className="rounded-card border border-fab-line bg-fab-card p-5">
                <div className="mb-2 flex gap-0.5 text-fab-accent">{[0, 1, 2, 3, 4].map((i) => <Star key={i} size={14} fill="currentColor" />)}</div>
                {it.text && <p className="text-sm text-fab-muted">"{it.text}"</p>}
                <div className="mt-3 flex items-center gap-2">
                  {it.image && <img src={it.image} alt={it.title} className="h-8 w-8 rounded-full object-cover" />}
                  {it.title && <span className="text-xs font-bold text-fab-ink">{it.title}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'faq':
      return wrap(
        <div>
          <Header />
          <div className="mx-auto max-w-3xl space-y-3">
            {cfg.items.map((it: CustomItem) => (
              <details key={it.id} className="rounded-card border border-fab-line bg-fab-card p-4">
                <summary className="cursor-pointer text-sm font-semibold text-fab-ink">{it.title}</summary>
                {it.text && <p className="mt-2 text-sm text-fab-muted">{it.text}</p>}
              </details>
            ))}
          </div>
        </div>
      );

    default: // custom
      return wrap(
        <div className={`flex flex-col ${alignItemsClass(cfg.align)}`}>
          <Header />
          {cfg.image && <img src={cfg.image} alt={heading} loading="lazy" className="mb-4 w-full rounded-card object-cover" />}
          {cfg.body && <p className="max-w-2xl whitespace-pre-line text-sm text-fab-muted">{cfg.body}</p>}
          <Btn />
        </div>
      );
  }
};

const FabDynamicBlock = ({ section }: { section: HomepageSection }) => {
  switch (section.type) {
    case 'banner': return <BannerBlock section={section} />;
    case 'poster': return <PosterBlock section={section} />;
    case 'custom_block': return <CustomBlock section={section} />;
    default: return null;
  }
};

export default FabDynamicBlock;