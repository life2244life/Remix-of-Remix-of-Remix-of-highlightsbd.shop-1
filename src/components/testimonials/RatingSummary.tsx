import { motion } from "framer-motion";
import Stars from "./Stars";
import { RatingBreakdown } from "./mockData";

const RatingSummary = ({ summary }: { summary: RatingBreakdown }) => {
  const rows: (5 | 4 | 3 | 2 | 1)[] = [5, 4, 3, 2, 1];
  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-stretch sm:gap-12">
        <div className="flex min-w-[150px] flex-col items-center justify-center text-center">
          <p className="text-6xl font-light tracking-tight text-foreground">
            {summary.average.toFixed(1)}
            <span className="text-2xl text-muted-foreground"> / 5</span>
          </p>
          <Stars value={summary.average} size={22} className="mt-3" />
          <p className="mt-3 text-sm text-muted-foreground">
            {summary.total.toLocaleString()} Reviews
          </p>
        </div>
        <div className="hidden w-px bg-border sm:block" />
        <div className="flex-1 space-y-3">
          {rows.map((star, idx) => {
            const pct = summary.breakdown[star] ?? 0;
            return (
              <div key={star} className="flex items-center gap-3">
                <span className="w-14 shrink-0 text-sm text-muted-foreground">{star} Star</span>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className="h-full rounded-full bg-destructive"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, ease: "easeOut", delay: idx * 0.08 }}
                  />
                </div>
                <span className="w-10 shrink-0 text-right text-sm font-medium text-foreground">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RatingSummary;