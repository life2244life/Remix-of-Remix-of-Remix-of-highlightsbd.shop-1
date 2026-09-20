import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BadgeCheck, ChevronLeft, ChevronRight } from "lucide-react";
import Stars from "./Stars";
import { Testimonial, formatDate } from "./mockData";
import { useIsMobile } from "@/hooks/use-mobile";

const Card = ({ t }: { t: Testimonial }) => (
  <motion.article
    whileHover={{ y: -6 }}
    transition={{ type: "spring", stiffness: 300, damping: 22 }}
    className="flex h-full flex-col rounded-3xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-xl"
  >
    <div className="flex items-center gap-3">
      <img
        src={t.avatar}
        alt={t.name}
        loading="lazy"
        className="h-12 w-12 rounded-full object-cover"
      />
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="truncate font-semibold text-foreground">{t.name}</span>
          {t.verified && <BadgeCheck className="h-4 w-4 shrink-0 text-destructive" />}
        </div>
        <p className="truncate text-xs text-muted-foreground">{t.location}</p>
      </div>
    </div>
    <div className="mt-4 flex items-center justify-between">
      <Stars value={t.rating} size={15} />
      <span className="text-xs text-muted-foreground">{formatDate(t.date)}</span>
    </div>
    <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">"{t.text}"</p>
    <div className="mt-5 flex items-center gap-3 rounded-2xl bg-muted/60 p-3">
      <img
        src={t.productImage}
        alt={t.product}
        loading="lazy"
        className="h-12 w-12 rounded-xl object-cover"
      />
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Purchased</p>
        <p className="truncate text-sm font-medium text-foreground">{t.product}</p>
      </div>
    </div>
  </motion.article>
);

const ReviewCarousel = ({ reviews }: { reviews: Testimonial[] }) => {
  const isMobile = useIsMobile();
  const [perView, setPerView] = useState(3);
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setPerView(w < 640 ? 1 : w < 1024 ? 2 : 3);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const pageCount = Math.max(1, Math.ceil(reviews.length / perView));

  useEffect(() => {
    setPage((p) => Math.min(p, pageCount - 1));
  }, [pageCount]);

  const next = useCallback(() => setPage((p) => (p + 1) % pageCount), [pageCount]);
  const prev = useCallback(() => setPage((p) => (p - 1 + pageCount) % pageCount), [pageCount]);

  const timer = useRef<ReturnType<typeof setInterval>>();
  useEffect(() => {
    if (paused || pageCount <= 1) return;
    timer.current = setInterval(next, 4000);
    return () => clearInterval(timer.current);
  }, [paused, next, pageCount]);

  const start = page * perView;
  const visible = reviews.slice(start, start + perView);
  // pad last page so the grid stays aligned
  while (visible.length < perView && reviews.length >= perView) {
    visible.push(reviews[visible.length % reviews.length]);
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="grid gap-5"
            style={{ gridTemplateColumns: `repeat(${perView}, minmax(0, 1fr))` }}
          >
            {visible.map((t, i) => (
              <Card key={`${t.id}-${i}`} t={t} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {pageCount > 1 && (
        <>
          {!isMobile && (
            <>
              <button
                type="button"
                onClick={prev}
                aria-label="Previous reviews"
                className="absolute -left-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background shadow-md transition-colors hover:bg-muted lg:flex"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next reviews"
                className="absolute -right-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background shadow-md transition-colors hover:bg-muted lg:flex"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
          <div className="mt-6 flex items-center justify-center gap-2">
            {Array.from({ length: pageCount }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPage(i)}
                aria-label={`Go to page ${i + 1}`}
                className={`h-2 rounded-full transition-all ${
                  i === page ? "w-6 bg-destructive" : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/60"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ReviewCarousel;