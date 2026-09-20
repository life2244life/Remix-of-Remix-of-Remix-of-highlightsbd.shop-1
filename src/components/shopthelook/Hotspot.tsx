import { motion } from "framer-motion";

interface HotspotProps {
  index: number;
  x: number;
  y: number;
  label: string;
  active: boolean;
  onClick: () => void;
}

const Hotspot = ({ index, x, y, label, active, onClick }: HotspotProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ left: `${x}%`, top: `${y}%` }}
      className="group absolute z-10 -translate-x-1/2 -translate-y-1/2"
      aria-label={`${label} hotspot`}
    >
      <span className="relative flex h-7 w-7 items-center justify-center">
        {/* pulse */}
        <span
          className={`absolute inline-flex h-full w-full rounded-full ${
            active ? "bg-destructive/40" : "bg-background/60"
          } animate-ping`}
        />
        <span
          className={`relative flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold shadow-md transition-colors ${
            active ? "bg-destructive text-destructive-foreground" : "bg-background text-foreground"
          }`}
        >
          {index + 1}
        </span>
      </span>

      {/* tooltip */}
      <motion.span
        initial={{ opacity: 0, y: 4 }}
        whileHover={{ opacity: 1 }}
        className="pointer-events-none absolute left-1/2 top-9 -translate-x-1/2 whitespace-nowrap rounded-[8px] bg-foreground px-2 py-1 text-[11px] font-medium text-background opacity-0 shadow-lg transition-opacity group-hover:opacity-100"
      >
        {label}
      </motion.span>
    </button>
  );
};

export default Hotspot;