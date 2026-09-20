import { useState } from "react";
import { BadgeCheck, ThumbsDown, ThumbsUp } from "lucide-react";
import { motion } from "framer-motion";
import StarRating from "./StarRating";
import { MockReview } from "./mockReviews";

interface ReviewCardProps {
  review: MockReview;
  onImageClick: (images: string[], index: number) => void;
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

type Vote = "up" | "down" | null;

const ReviewCard = ({ review, onImageClick }: ReviewCardProps) => {
  const [vote, setVote] = useState<Vote>(null);

  const helpful = review.helpful + (vote === "up" ? 1 : 0);
  const notHelpful = review.notHelpful + (vote === "down" ? 1 : 0);

  const initials = review.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -3 }}
      className="rounded-[18px] border border-border bg-background p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold text-foreground">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-foreground">{review.name}</span>
            {review.verified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-[11px] font-medium text-destructive">
                <BadgeCheck className="h-3.5 w-3.5" /> Verified Purchase
              </span>
            )}
          </div>
          <div className="mt-1 flex items-center gap-2">
            <StarRating value={review.rating} size={14} />
            <span className="text-xs text-muted-foreground">{formatDate(review.date)}</span>
          </div>
        </div>
      </div>

      <h4 className="mt-4 font-semibold text-foreground">{review.title}</h4>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{review.body}</p>

      {review.images.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {review.images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => onImageClick(review.images, i)}
              className="h-16 w-16 overflow-hidden rounded-[12px] border border-border transition-transform hover:scale-105"
            >
              <img src={src} alt={`${review.name} review ${i + 1}`} className="h-full w-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      )}

      <div className="mt-5 flex items-center gap-2">
        <span className="mr-1 text-xs text-muted-foreground">Was this helpful?</span>
        <button
          type="button"
          onClick={() => setVote((v) => (v === "up" ? null : "up"))}
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
            vote === "up" ? "border-foreground bg-foreground text-background" : "border-border text-foreground hover:bg-muted"
          }`}
        >
          <ThumbsUp className="h-3.5 w-3.5" /> {helpful}
        </button>
        <button
          type="button"
          onClick={() => setVote((v) => (v === "down" ? null : "down"))}
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
            vote === "down" ? "border-foreground bg-foreground text-background" : "border-border text-foreground hover:bg-muted"
          }`}
        >
          <ThumbsDown className="h-3.5 w-3.5" /> {notHelpful}
        </button>
      </div>
    </motion.article>
  );
};

export default ReviewCard;