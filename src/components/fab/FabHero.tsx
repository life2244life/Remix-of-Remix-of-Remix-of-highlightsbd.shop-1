import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useHomepageSections } from '@/hooks/useSupabase';
import { getActiveHeroSlides, parseHeroSlides, type HeroSlide } from '@/lib/heroSlides';

const alignClass = (a: HeroSlide['align']) =>
  a === 'center' ? 'mx-auto items-center text-center'
  : a === 'right' ? 'ml-auto items-end text-right'
  : 'items-start text-left';

const btnClasses = (style: HeroSlide['buttonStyle']) => {
  if (style === 'outline') {
    return {
      primary: 'rounded-btn border border-current px-7 py-3.5 text-sm font-semibold transition-transform hover:scale-105',
      secondary: 'rounded-btn border border-current/70 px-7 py-3.5 text-sm font-semibold opacity-90 transition-opacity hover:opacity-100',
    };
  }
  if (style === 'soft') {
    return {
      primary: 'rounded-btn bg-white/20 backdrop-blur px-7 py-3.5 text-sm font-semibold transition-transform hover:scale-105',
      secondary: 'rounded-btn bg-white/10 px-7 py-3.5 text-sm font-semibold transition-colors hover:bg-white/20',
    };
  }
  return {
    primary: 'rounded-btn bg-white px-7 py-3.5 text-sm font-semibold text-fab-ink transition-transform hover:scale-105',
    secondary: 'rounded-btn border border-white/70 px-7 py-3.5 text-sm font-semibold transition-colors hover:bg-white hover:text-fab-ink',
  };
};

const FabHero = () => {
  const { data: sections = [] } = useHomepageSections(false);
  const heroConfig = sections.find((s) => s.section_key === 'hero')?.config;
  const slides = getActiveHeroSlides(parseHeroSlides(heroConfig));

  const [index, setIndex] = useState(0);
  const count = slides.length;
  const go = useCallback((i: number) => { if (count) setIndex((i + count) % count); }, [count]);

  useEffect(() => { setIndex(0); }, [count]);
  useEffect(() => {
    if (count < 2) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % count), 5500);
    return () => clearInterval(t);
  }, [count]);

  if (!count) return null;

  const slide = slides[Math.min(index, count - 1)];
  const btn = btnClasses(slide.buttonStyle);

  return (
    <section className="relative h-[420px] w-full overflow-hidden bg-fab-soft sm:h-[520px] lg:h-[700px]">
      <AnimatePresence mode="popLayout">
        <motion.picture
          key={slide.id}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="absolute inset-0 block h-full w-full"
        >
          {slide.mobileImage && <source media="(max-width: 640px)" srcSet={slide.mobileImage} />}
          <img
            src={slide.desktopImage || slide.mobileImage}
            alt={slide.heading || 'Hero slide'}
            loading={index === 0 ? 'eager' : 'lazy'}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </motion.picture>
      </AnimatePresence>
      <div className="absolute inset-0 bg-black" style={{ opacity: slide.overlay / 100 }} />

      <div className="fab-container relative flex h-full items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id + slide.heading}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className={`flex max-w-xl flex-col ${alignClass(slide.align)}`}
            style={{ color: slide.textColor }}
          >
            {slide.badge && (
              <span className="mb-4 inline-block rounded-full bg-fab-accent px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
                {slide.badge}
              </span>
            )}
            {slide.heading && <h1 className="text-[34px] font-extrabold leading-[1.05] sm:text-5xl lg:text-[64px]">{slide.heading}</h1>}
            {slide.subheading && <p className="mt-4 max-w-md text-sm opacity-85 sm:text-base">{slide.subheading}</p>}
            {(slide.btn1Text || slide.btn2Text) && (
              <div className="mt-7 flex flex-wrap gap-3">
                {slide.btn1Text && (
                  <Link to={slide.btn1Url || '/'} className={`flex items-center gap-2 ${btn.primary}`}>
                    {slide.btn1Text} <ArrowRight size={16} />
                  </Link>
                )}
                {slide.btn2Text && (
                  <Link to={slide.btn2Url || '/'} className={btn.secondary}>{slide.btn2Text}</Link>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {count > 1 && (
        <>
          <button onClick={() => go(index - 1)} aria-label="Previous" className="absolute left-4 top-1/2 hidden -translate-y-1/2 grid h-11 w-11 place-items-center rounded-full bg-white/90 text-fab-ink shadow-md transition-transform hover:scale-110 md:grid">
            <ChevronLeft size={20} />
          </button>
          <button onClick={() => go(index + 1)} aria-label="Next" className="absolute right-4 top-1/2 hidden -translate-y-1/2 grid h-11 w-11 place-items-center rounded-full bg-white/90 text-fab-ink shadow-md transition-transform hover:scale-110 md:grid">
            <ChevronRight size={20} />
          </button>
          <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
            {slides.map((s, i) => (
              <button key={s.id} onClick={() => go(i)} aria-label={`Slide ${i + 1}`}
                className={`h-2 rounded-full transition-all ${i === index ? 'w-8 bg-white' : 'w-2 bg-white/50'}`} />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default FabHero;
