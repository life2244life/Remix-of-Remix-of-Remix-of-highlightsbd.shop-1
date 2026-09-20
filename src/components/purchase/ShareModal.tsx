import { useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { shareTargets } from "./mockData";

interface ShareModalProps {
  url: string;
  productName: string;
}

const ShareModal = ({ url, productName }: ShareModalProps) => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      /* clipboard may be blocked in sandbox — still show feedback */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.button
          type="button"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Share product"
          className="flex h-12 w-12 items-center justify-center rounded-[14px] border border-border bg-background text-foreground shadow-sm transition-colors hover:border-foreground"
        >
          <Share2 className="h-5 w-5" />
        </motion.button>
      </DialogTrigger>

      <DialogContent className="rounded-[14px] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg">Share this product</DialogTitle>
          <DialogDescription className="line-clamp-1">{productName}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-4 gap-3 py-2">
          {shareTargets.map((t) => (
            <a
              key={t.key}
              href={t.href(url)}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-2"
            >
              <span
                className={`flex h-14 w-14 items-center justify-center rounded-[14px] text-sm font-bold transition-transform group-hover:-translate-y-0.5 ${t.accent}`}
              >
                {t.label.charAt(0)}
              </span>
              <span className="text-[11px] text-muted-foreground">{t.label}</span>
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2 rounded-[14px] border border-border bg-muted/40 p-2 pl-4">
          <span className="flex-1 truncate text-sm text-muted-foreground">{url}</span>
          <motion.button
            type="button"
            onClick={copy}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-1.5 rounded-[11px] px-3 py-2 text-sm font-medium transition-colors ${
              copied ? "bg-foreground text-background" : "bg-foreground text-background hover:bg-foreground/90"
            }`}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy"}
          </motion.button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;