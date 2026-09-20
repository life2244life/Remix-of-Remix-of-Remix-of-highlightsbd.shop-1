import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface CountdownTimerProps {
  target: Date;
}

const pad = (n: number) => n.toString().padStart(2, "0");

const getRemaining = (target: Date) => {
  const diff = Math.max(0, target.getTime() - Date.now());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
};

const Unit = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center">
    <div className="relative h-12 w-12 overflow-hidden rounded-[11px] bg-foreground sm:h-14 sm:w-14">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: "-100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="absolute inset-0 flex items-center justify-center text-xl font-semibold tabular-nums text-background sm:text-2xl"
        >
          {pad(value)}
        </motion.span>
      </AnimatePresence>
    </div>
    <span className="mt-1.5 text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{label}</span>
  </div>
);

const CountdownTimer = ({ target }: CountdownTimerProps) => {
  const [now, setNow] = useState(() => getRemaining(target));
  useEffect(() => {
    const id = setInterval(() => setNow(getRemaining(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const units = useMemo(
    () => [
      { value: now.days, label: "Days" },
      { value: now.hours, label: "Hours" },
      { value: now.minutes, label: "Mins" },
      { value: now.seconds, label: "Secs" },
    ],
    [now],
  );

  return (
    <div className="flex items-end gap-1.5 sm:gap-2">
      {units.map((u, i) => (
        <div key={u.label} className="flex items-end gap-1.5 sm:gap-2">
          <Unit value={u.value} label={u.label} />
          {i < units.length - 1 && <span className="pb-6 text-xl font-light text-muted-foreground">:</span>}
        </div>
      ))}
    </div>
  );
};

export default CountdownTimer;