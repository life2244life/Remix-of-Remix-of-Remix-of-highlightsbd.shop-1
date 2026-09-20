import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { CustomerStory as Story } from "./mockData";

const CustomerStory = ({ story }: { story: Story }) => (
  <div className="grid items-stretch gap-0 overflow-hidden rounded-3xl border border-border bg-card shadow-sm lg:grid-cols-2">
    <motion.div
      initial={{ opacity: 0, scale: 1.05 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="relative min-h-[320px] overflow-hidden lg:min-h-[460px]"
    >
      <img src={story.image} alt={story.name} className="h-full w-full object-cover" loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent" />
    </motion.div>
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.15 }}
      className="flex flex-col justify-center p-8 sm:p-12"
    >
      <span className="inline-flex w-fit items-center rounded-full bg-destructive/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-destructive">
        Customer Story
      </span>
      <Quote className="mt-6 h-10 w-10 text-destructive/20" />
      <p className="mt-4 text-2xl font-light leading-snug text-foreground sm:text-3xl">
        "{story.quote}"
      </p>
      <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{story.story}</p>
      <div className="mt-8 border-t border-border pt-5">
        <p className="font-semibold text-foreground">{story.name}</p>
        <p className="text-sm text-muted-foreground">{story.location}</p>
        <p className="mt-2 text-sm text-foreground/70">
          Favourite product: <span className="font-medium text-destructive">{story.favoriteProduct}</span>
        </p>
      </div>
    </motion.div>
  </div>
);

export default CustomerStory;