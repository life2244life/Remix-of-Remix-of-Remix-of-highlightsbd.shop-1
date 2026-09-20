import { Star } from "lucide-react";

interface StarsProps {
  value: number;
  size?: number;
  className?: string;
}

const Stars = ({ value, size = 16, className = "" }: StarsProps) => (
  <div className={`inline-flex items-center gap-0.5 ${className}`} aria-label={`${value} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((i) => (
      <Star
        key={i}
        style={{ width: size, height: size }}
        className={i <= Math.round(value) ? "fill-destructive text-destructive" : "fill-muted text-muted"}
      />
    ))}
  </div>
);

export default Stars;