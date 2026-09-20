import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { TrustMetric } from "./mockData";

const Counter = ({ metric }: { metric: TrustMetric }) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1600;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(metric.value * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, metric.value]);

  const display =
    metric.decimals && metric.decimals > 0
      ? val.toFixed(metric.decimals)
      : Math.round(val).toLocaleString();

  return (
    <p ref={ref} className="text-4xl font-light tracking-tight text-foreground sm:text-5xl">
      {metric.prefix}
      {display}
      <span className="text-destructive">{metric.suffix}</span>
    </p>
  );
};

const TrustMetrics = ({ metrics }: { metrics: TrustMetric[] }) => (
  <div className="grid grid-cols-2 gap-6 rounded-3xl border border-border bg-card p-8 shadow-sm lg:grid-cols-4">
    {metrics.map((m, i) => (
      <motion.div
        key={m.label}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: i * 0.1 }}
        className="text-center"
      >
        <Counter metric={m} />
        <p className="mt-2 text-sm text-muted-foreground">{m.label}</p>
      </motion.div>
    ))}
  </div>
);

export default TrustMetrics;