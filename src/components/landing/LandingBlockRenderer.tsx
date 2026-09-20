import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useProducts } from '@/hooks/useSupabase';
import { useStoreSettings } from '@/hooks/useSupabase';
import { useCollections } from '@/hooks/useCollections';
import { getNewsletterSettings, subscribeToNewsletter } from '@/lib/newsletter';
import ProductCard from '@/components/ProductCard';
import {
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
} from '@/components/ui/accordion';
import type { LandingBlock } from '@/lib/landingBlocks';

const isExternal = (url: string) => /^https?:\/\//i.test(url || '');

const SmartLink = ({ to, newTab, className, children }: { to: string; newTab?: boolean; className?: string; children: React.ReactNode }) => {
  // Broken / empty CTA: render a non-interactive, visibly disabled element
  // so the frontend never crashes and never links to a dead destination.
  if (!to || !to.trim()) {
    return <span aria-disabled="true" className={`${className || ''} opacity-50 pointer-events-none cursor-not-allowed`}>{children}</span>;
  }
  if (isExternal(to) || newTab) {
    return <a href={to || '/'} target={newTab ? '_blank' : undefined} rel={newTab ? 'noopener noreferrer' : undefined} className={className}>{children}</a>;
  }
  return <Link to={to} className={className}>{children}</Link>;
};

const colClass = (n: number) =>
  ({ 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-2 lg:grid-cols-3', 4: 'sm:grid-cols-2 lg:grid-cols-4', 5: 'sm:grid-cols-3 lg:grid-cols-5' } as Record<number, string>)[n] || 'sm:grid-cols-2 lg:grid-cols-4';

const HeroBanner = ({ d }: { d: any }) => (
  <section className="relative w-full overflow-hidden">
    {d.image ? (
      <picture>
        {d.mobileImage && <source media="(max-width: 768px)" srcSet={d.mobileImage} />}
        <img src={d.image} alt={d.headline || 'Hero'} className="w-full object-cover" />
      </picture>
    ) : (
      <div className="aspect-[16/6] w-full bg-secondary" />
    )}
    {(d.headline || d.buttonLabel) && (
      <div className={`absolute inset-0 flex flex-col justify-center gap-4 p-6 md:p-16 text-${d.align || 'center'} ${d.align === 'center' ? 'items-center' : d.align === 'right' ? 'items-end' : 'items-start'}`}>
        {d.headline && <h2 className="text-2xl md:text-5xl font-semibold text-background drop-shadow">{d.headline}</h2>}
        {d.subheadline && <p className="text-sm md:text-lg text-background/90 drop-shadow">{d.subheadline}</p>}
        {d.buttonLabel && (
          <SmartLink to={d.buttonUrl} className="inline-block bg-foreground text-background px-8 py-3 text-xs uppercase tracking-widest">{d.buttonLabel}</SmartLink>
        )}
      </div>
    )}
  </section>
);

const Countdown = ({ d }: { d: any }) => {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  const target = d.endsAt ? new Date(d.endsAt).getTime() : 0;
  const diff = Math.max(0, target - now);
  const days = Math.floor(diff / 86400000);
  const hrs = Math.floor((diff % 86400000) / 3600000);
  const min = Math.floor((diff % 3600000) / 60000);
  const sec = Math.floor((diff % 60000) / 1000);
  const cell = (v: number, l: string) => (
    <div className="flex flex-col items-center min-w-[64px] bg-foreground text-background py-3 px-2">
      <span className="text-2xl font-bold tabular-nums">{String(v).padStart(2, '0')}</span>
      <span className="text-[10px] uppercase tracking-wider opacity-80">{l}</span>
    </div>
  );
  return (
    <section className="fab-container py-10 text-center space-y-4">
      {d.title && <h3 className="text-xl font-semibold">{d.title}</h3>}
      {d.subtitle && <p className="text-sm text-muted-foreground">{d.subtitle}</p>}
      <div className="flex justify-center gap-2">{cell(days, 'Days')}{cell(hrs, 'Hrs')}{cell(min, 'Min')}{cell(sec, 'Sec')}</div>
    </section>
  );
};

const ProductGrid = ({ d }: { d: any }) => {
  const { data: products = [] } = useProducts();
  const byId = useMemo(() => new Map(products.map((p) => [p.id, p])), [products]);
  const items = (d.productIds || []).map((id: string) => byId.get(id)).filter(Boolean);
  if (!items.length) return null;
  return (
    <section className="fab-container py-10 space-y-6">
      {d.title && <h3 className="text-xl md:text-2xl font-semibold text-center">{d.title}</h3>}
      <div className={`grid grid-cols-2 ${colClass(d.columns || 4)} gap-3 md:gap-5`}>
        {items.map((p: any) => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  );
};

const CollectionGrid = ({ d }: { d: any }) => {
  const { data: collections = [] } = useCollections();
  const byId = useMemo(() => new Map(collections.map((c) => [c.id, c])), [collections]);
  const items = (d.collectionIds || []).map((id: string) => byId.get(id)).filter(Boolean);
  if (!items.length) return null;
  return (
    <section className="fab-container py-10 space-y-6">
      {d.title && <h3 className="text-xl md:text-2xl font-semibold text-center">{d.title}</h3>}
      <div className={`grid grid-cols-2 ${colClass(d.columns || 3)} gap-3 md:gap-5`}>
        {items.map((c: any) => (
          <Link key={c.id} to={`/collections/${c.slug}`} className="group block">
            <div className="aspect-[4/5] overflow-hidden bg-secondary">
              {c.hero_image && <img src={c.hero_image} alt={c.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />}
            </div>
            <p className="mt-2 text-center text-sm font-medium">{c.title}</p>
          </Link>
        ))}
      </div>
    </section>
  );
};

const CategoryGrid = ({ d }: { d: any }) => {
  const items = d.items || [];
  if (!items.length) return null;
  return (
    <section className="fab-container py-10 space-y-6">
      {d.title && <h3 className="text-xl md:text-2xl font-semibold text-center">{d.title}</h3>}
      <div className={`grid grid-cols-2 ${colClass(d.columns || 4)} gap-3 md:gap-5`}>
        {items.map((it: any, i: number) => (
          <SmartLink key={i} to={it.link} className="group block text-center">
            <div className="aspect-square overflow-hidden bg-secondary">
              {it.image && <img src={it.image} alt={it.label} className="h-full w-full object-cover transition-transform group-hover:scale-105" />}
            </div>
            <p className="mt-2 text-sm font-medium">{it.label}</p>
          </SmartLink>
        ))}
      </div>
    </section>
  );
};

const Gallery = ({ d }: { d: any }) => {
  const imgs = (d.images || []).filter(Boolean);
  if (!imgs.length) return null;
  return (
    <section className="fab-container py-10">
      <div className={`grid grid-cols-2 ${colClass(d.columns || 3)} gap-2 md:gap-3`}>
        {imgs.map((src: string, i: number) => <img key={i} src={src} alt={`Gallery ${i + 1}`} className="w-full object-cover aspect-square" />)}
      </div>
    </section>
  );
};

const VideoBlock = ({ d }: { d: any }) => {
  if (!d.url) return null;
  const yt = d.url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]+)/);
  return (
    <section className="fab-container py-10 space-y-4">
      {d.title && <h3 className="text-xl font-semibold text-center">{d.title}</h3>}
      <div className="aspect-video w-full overflow-hidden bg-foreground/5">
        {yt ? (
          <iframe className="h-full w-full" src={`https://www.youtube.com/embed/${yt[1]}`} title={d.title || 'Video'} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
        ) : (
          <video src={d.url} controls className="h-full w-full" />
        )}
      </div>
    </section>
  );
};

const Newsletter = ({ d }: { d: any }) => {
  const { data: s } = useStoreSettings();
  const cfg = getNewsletterSettings(s);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  if (!cfg.enabled || !cfg.showHomepage) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await subscribeToNewsletter(cfg, email, 'homepage');
    if (res.status === 'subscribed') { toast.success(res.message); setDone(true); setEmail(''); }
    else if (res.status === 'duplicate') { toast.info(res.message); setDone(true); setEmail(''); }
    else toast.error(res.message);
    setLoading(false);
  };

  return (
    <section className="fab-container py-12">
      <div className="mx-auto max-w-xl text-center space-y-4 bg-secondary/40 p-8">
        {d.title && <h3 className="text-xl font-semibold">{d.title}</h3>}
        {d.subtitle && <p className="text-sm text-muted-foreground">{d.subtitle}</p>}
        {done ? (
          <p className="text-sm text-foreground">{cfg.thankYouTitle}</p>
        ) : (
          <form className="flex gap-2" onSubmit={submit}>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder={cfg.placeholder} className="luxury-input flex-1" />
            <button type="submit" disabled={loading} className="bg-foreground text-background px-6 text-xs uppercase tracking-widest disabled:opacity-60">{loading ? '...' : (d.buttonLabel || cfg.ctaText)}</button>
          </form>
        )}
      </div>
    </section>
  );
};

const Testimonials = ({ d }: { d: any }) => {
  const items: any[] = d.items || [];
  if (items.length === 0) return null;
  return (
    <section className="fab-container py-12">
      {d.title && <h3 className="text-xl md:text-2xl font-semibold text-center mb-8">{d.title}</h3>}
      <div className="mx-auto max-w-5xl grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it, i) => (
          <figure key={i} className="border border-border bg-card p-6 flex flex-col gap-4">
            <blockquote className="text-sm leading-relaxed text-foreground/90 flex-1 whitespace-pre-wrap">“{it.quote}”</blockquote>
            <figcaption className="flex items-center gap-3">
              {it.image && <img src={it.image} alt={it.name || 'Customer'} className="h-10 w-10 rounded-full object-cover" />}
              <div>
                {it.name && <p className="text-sm font-medium">{it.name}</p>}
                {it.role && <p className="text-xs text-muted-foreground">{it.role}</p>}
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
};

const BrandStory = ({ d }: { d: any }) => (
  <section className="fab-container py-12">
    <div className={`mx-auto max-w-5xl grid gap-8 items-center ${d.image ? 'md:grid-cols-2' : ''}`}>
      {d.image && d.imageSide !== 'right' && (
        <img src={d.image} alt={d.title || 'Brand story'} className="w-full object-cover" />
      )}
      <div className="space-y-4">
        {d.title && <h3 className="text-2xl md:text-3xl font-semibold">{d.title}</h3>}
        {d.text && <p className="text-sm md:text-base leading-relaxed text-foreground/90 whitespace-pre-wrap">{d.text}</p>}
      </div>
      {d.image && d.imageSide === 'right' && (
        <img src={d.image} alt={d.title || 'Brand story'} className="w-full object-cover" />
      )}
    </div>
  </section>
);

const LandingBlockRenderer = ({ block }: { block: LandingBlock }) => {
  if (!block.enabled) return null;
  const d = block.data || {};
  switch (block.type) {
    case 'hero_banner': return <HeroBanner d={d} />;
    case 'image_banner':
      return d.image ? (
        <section className="w-full">
          {d.link ? <SmartLink to={d.link}><img src={d.image} alt={d.alt || 'Banner'} className="w-full object-cover" /></SmartLink> : <img src={d.image} alt={d.alt || 'Banner'} className="w-full object-cover" />}
        </section>
      ) : null;
    case 'rich_text':
      return (
        <section className="fab-container py-8">
          <div className={`mx-auto max-w-3xl whitespace-pre-wrap text-${d.align || 'left'} text-sm md:text-base leading-relaxed text-foreground/90`}>{d.content}</div>
        </section>
      );
    case 'button':
      return (
        <section className={`fab-container py-6 flex ${d.align === 'center' ? 'justify-center' : d.align === 'right' ? 'justify-end' : 'justify-start'}`}>
          <SmartLink to={d.url} newTab={d.newTab} className={`px-8 py-3 text-xs uppercase tracking-widest ${d.variant === 'outline' ? 'border border-foreground text-foreground' : 'bg-foreground text-background'}`}>{d.label || 'Button'}</SmartLink>
        </section>
      );
    case 'product_grid': return <ProductGrid d={d} />;
    case 'collection_grid': return <CollectionGrid d={d} />;
    case 'category_grid': return <CategoryGrid d={d} />;
    case 'countdown': return <Countdown d={d} />;
    case 'video': return <VideoBlock d={d} />;
    case 'gallery': return <Gallery d={d} />;
    case 'faq':
      return (
        <section className="fab-container py-10">
          <div className="mx-auto max-w-3xl space-y-4">
            {d.title && <h3 className="text-xl md:text-2xl font-semibold text-center mb-6">{d.title}</h3>}
            <Accordion type="single" collapsible>
              {(d.items || []).map((it: any, i: number) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger className="text-left text-sm">{it.q}</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground whitespace-pre-wrap">{it.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      );
    case 'newsletter': return <Newsletter d={d} />;
    case 'spacer': return <div style={{ height: `${d.height || 40}px` }} />;
    case 'testimonials': return <Testimonials d={d} />;
    case 'brand_story': return <BrandStory d={d} />;
    default: return null;
  }
};

export default LandingBlockRenderer;
