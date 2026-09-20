import { motion } from "framer-motion";
import StarRating from "./StarRating";
import { RatingSummaryData } from "./mockReviews";

interface RatingSummaryProps {
  summary: RatingSummaryData;
}

const RatingSummary = ({ summary }: RatingSummaryProps) => {
  const rows: (5 | 4 | 3 | 2 | 1)[] = [5, 4, 3, 2, 1];

  return (
    <div className="rounded-[18px] border border-border bg-background p-6 shadow-sm sm:p-8">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-stretch sm:gap-10">
        {/* Score */}
        <div className="flex min-w-[140px] flex-col items-center justify-center text-center">
          <p className="text-5xl font-light text-foreground">
            {summary.average.toFixed(1)}
            <span className="text-xl text-muted-foreground"> / 5</span>
          </p>
          <StarRating value={summary.average} size={20} className="mt-2" />
          <p className="mt-2 text-sm text-muted-foreground">{summary.total.toLocaleString()} Reviews</p>
        </div>

        {/* Breakdown */}
        <div className="flex-1 space-y-2.5">
          {rows.map((star) => {
            const pct = summary.breakdown[star] ?? 0;
            return (
              <div key={star} className="flex items-center gap-3">
                <span className="w-12 shrink-0 text-sm text-muted-foreground">{star} Star</span>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className="h-full rounded-full bg-destructive"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
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