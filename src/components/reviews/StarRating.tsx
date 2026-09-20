import { Star } from "lucide-react";

interface StarRatingProps {
  value: number;
  size?: number;
  className?: string;
}

const StarRating = ({ value, size = 16, className = "" }: StarRatingProps) => {
  return (
    <div className={`inline-flex items-center gap-0.5 ${className}`} aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = i <= Math.round(value);
        return (
          <Star
            key={i}
            style={{ width: size, height: size }}
            className={filled ? "fill-destructive text-destructive" : "fill-muted text-muted"}
          />
        );
      })}
    </div>
  );
};

export default StarRating;