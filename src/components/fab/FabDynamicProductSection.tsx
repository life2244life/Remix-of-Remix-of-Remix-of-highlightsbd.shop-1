import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import { Product } from '@/data/products';
import FabProductCard from './FabProductCard';
import {
  ProductSectionConfig,
  resolveSectionProducts,
  isProductSectionActive,
} from '@/lib/productSections';

interface Props {
  config: ProductSectionConfig;
  allProducts: Product[];
  reviewStats?: Record<string, { avg: number; count: number }>;
  hoverImageMap?: Record<string, string>;
  soldOutMap?: Record<string, boolean>;
}

const pad = (n: number) => n.toString().padStart(2, '0');

const Countdown = ({ endDate }: { endDate: string }) => {
  const target = useMemo(() => {
    if (endDate) return new Date(endDate);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    return end;
  }, [endDate]);
  const [remaining, setRemaining] = useState(() => Math.max(0, target.getTime() - Date.now()));
  useEffect(() => {
    const id = setInterval(() => setRemaining(Math.max(0, target.getTime() - Date.now())), 1000);
    return () => clearInterval(id);
  }, [target]);
  const d = Math.floor(remaining / 86400000);
  const h = Math.floor((remaining / 3600000) % 24) + d * 24;
  const m = Math.floor((remaining / 60000) % 60);
  const s = Math.floor((remaining / 1000) % 60);
  return (
    <div className="flex items-center gap-1.5">
      {[{ v: h, l: 'Hrs' }, { v: m, l: 'Min' }, { v: s, l: 'Sec' }].map((u, i) => (
        <div key={u.l} className="flex items-center gap-1.5">
          <div className="flex flex-col items-center">
            <span className="grid h-11 w-11 place-items-center rounded-lg bg-fab-ink text-lg font-bold tabular-nums text-white">
              {pad(u.v)}
            </span>
            <span className="mt-1 text-[10px] uppercase tracking-wider text-fab-muted">{u.l}</span>
          </div>
          {i < 2 && <span className="pb-5 text-lg font-bold text-fab-muted">:</span>}
        </div>
      ))}
    </div>
  );
};

const FabDynamicProductSection = ({
  config, allProducts, reviewStats = {}, hoverImageMap = {}, soldOutMap = {},
}: Props) => {
  const products = useMemo(
    () => resolveSectionProducts(config, { allProducts, reviewStats }),
    [config, allProducts, reviewStats],
  );
  const sliderRef = useRef<HTMLDivElement>(null);

  // Conditional returns must come AFTER all hooks (Rules of Hooks).
  // Scheduling windows (flash sale) can flip between renders, so an early
  // return before the hooks would crash with "rendered fewer hooks".
  if (!isProductSectionActive(config)) return null;
  if (products.length === 0) return null;

  const isFlash = config.countdown;
  const useSlider = config.layout === 'slider';
  const mobileCols = config.mobilePerRow === 1 ? 'grid-cols-1' : 'grid-cols-2';

  const scrollBy = (dir: number) => {
    sliderRef.current?.scrollBy({ left: dir * (sliderRef.current.clientWidth * 0.8), behavior: 'smooth' });
  };

  const cards = products.map((p, i) => (
    <FabProductCard
      key={p.id}
      product={p}
      reviewStats={reviewStats}
      hoverImageUrl={hoverImageMap[p.id]}
      isSoldOut={soldOutMap[p.id]}
      priority={i < 4}
      card={config.card}
    />
  ));

  return (
    <section className="fab-container">
      {/* Header */}
      {isFlash ? (
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-card bg-fab-accent text-white">
              <Zap size={20} fill="currentColor" />
            </span>
            <div>
              <h2 className="text-[22px] font-extrabold tracking-tight text-fab-ink sm:text-[28px]">{config.title}</h2>
              {config.subtitle && <p className="text-sm text-fab-muted">{config.subtitle}</p>}
            </div>
          </div>
          <div className="flex items-center justify-between gap-4 sm:justify-end">
            <Countdown endDate={config.endDate} />
            {config.viewAllText && (
              <Link to={config.viewAllUrl || '/?category=All'}
                className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-fab-ink transition-colors hover:text-fab-accent sm:flex">
                {config.viewAllText} <ArrowRight size={15} />
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-[22px] font-extrabold tracking-tight text-fab-ink sm:text-[28px]">{config.title}</h2>
            {config.subtitle && <p className="mt-1 text-sm text-fab-muted">{config.subtitle}</p>}
            <div className="mt-2 h-1 w-14 rounded-full bg-fab-accent" />
          </div>
          {config.viewAllText && (
            <Link to={config.viewAllUrl || '/?category=All'}
              className="flex shrink-0 items-center gap-1 text-sm font-semibold text-fab-ink transition-colors hover:text-fab-accent">
              {config.viewAllText} <ArrowRight size={15} />
            </Link>
          )}
        </div>
      )}

      {/* Products */}
      {useSlider ? (
        <div className="relative">
          <div ref={sliderRef} className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 sm:gap-5">
            {products.map((p, i) => (
              <div key={p.id} className="w-[60%] shrink-0 snap-start sm:w-[40%] lg:w-[23%]">
                <FabProductCard product={p} reviewStats={reviewStats}
                  hoverImageUrl={hoverImageMap[p.id]} isSoldOut={soldOutMap[p.id]} priority={i < 4} card={config.card} />
              </div>
            ))}
          </div>
          <button onClick={() => scrollBy(-1)} aria-label="Scroll left" className="absolute -left-3 top-[35%] hidden h-10 w-10 place-items-center rounded-full bg-fab-card text-fab-ink shadow-lg hover:text-fab-accent lg:grid">
            <ChevronLeft size={18} />
          </button>
          <button onClick={() => scrollBy(1)} aria-label="Scroll right" className="absolute -right-3 top-[35%] hidden h-10 w-10 place-items-center rounded-full bg-fab-card text-fab-ink shadow-lg hover:text-fab-accent lg:grid">
            <ChevronRight size={18} />
          </button>
        </div>
      ) : config.mobileSlider ? (
        <div className="no-scrollbar flex snap-x gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:gap-5 sm:overflow-visible lg:grid-cols-4">
          {products.map((p, i) => (
            <div key={p.id} className="w-[55%] shrink-0 snap-start sm:w-auto">
              <FabProductCard product={p} reviewStats={reviewStats}
                hoverImageUrl={hoverImageMap[p.id]} isSoldOut={soldOutMap[p.id]} priority={i < 4} card={config.card} />
            </div>
          ))}
        </div>
      ) : (
        <div className={`grid ${mobileCols} gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4`}>
          {cards}
        </div>
      )}
    </section>
  );
};

export default FabDynamicProductSection;
