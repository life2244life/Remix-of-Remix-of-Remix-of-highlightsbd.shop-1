import { motion } from "framer-motion";
import { BadgeCheck, Crown, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { SocialBadge } from "./mockData";

const iconMap = {
  verified: BadgeCheck,
  top: Crown,
  delivery: Truck,
  quality: Sparkles,
  return: ShieldCheck,
} as const;

const SocialBadges = ({ badges }: { badges: SocialBadge[] }) => (
  <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
    {badges.map((b, i) => {
      const Icon = iconMap[b.icon];
      return (
        <motion.div
          key={b.label}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: i * 0.08 }}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-sm"
        >
          <Icon className="h-4 w-4 text-destructive" />
          {b.label}
        </motion.div>
      );
    })}
  </div>
);

export default SocialBadges;