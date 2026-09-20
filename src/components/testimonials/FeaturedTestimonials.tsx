import { motion } from "framer-motion";
import { BadgeCheck, Quote } from "lucide-react";
import Stars from "./Stars";
import { Testimonial, formatDate } from "./mockData";

const FeaturedTestimonials = ({ items }: { items: Testimonial[] }) => (
  <div className="grid gap-6 md:grid-cols-3">
    {items.map((t, i) => (
      <motion.article
        key={t.id}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, delay: i * 0.1 }}
        whileHover={{ y: -6 }}
        className="relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card p-7 shadow-sm transition-shadow hover:shadow-xl"
      >
        <Quote className="absolute right-5 top-5 h-10 w-10 text-destructive/10" />
        <div className="flex items-center gap-3">
          <img src={t.avatar} alt={t.name} loading="lazy" className="h-14 w-14 rounded-full object-cover" />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-foreground">{t.name}</span>
              {t.verified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-medium text-destructive">
                  <BadgeCheck className="h-3 w-3" /> Verified
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{t.location}</p>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <Stars value={t.rating} size={16} />
          <span className="text-xs text-muted-foreground">{formatDate(t.date)}</span>
        </div>
        <p className="mt-4 flex-1 text-[15px] leading-relaxed text-foreground/80">"{t.text}"</p>
        <div className="mt-6 flex items-center gap-3 border-t border-border pt-4">
          <img src={t.productImage} alt={t.product} loading="lazy" className="h-14 w-14 rounded-xl object-cover" />
          <div>
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Purchased Product</p>
            <p className="text-sm font-medium text-foreground">{t.product}</p>
          </div>
        </div>
      </motion.article>
    ))}
  </div>
);

export default FeaturedTestimonials;