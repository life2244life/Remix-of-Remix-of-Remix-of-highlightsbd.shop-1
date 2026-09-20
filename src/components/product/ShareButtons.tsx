import { useState } from 'react';
import { Facebook, MessageCircle, Send, Link2, Check, Share2 } from 'lucide-react';

interface ShareButtonsProps {
  url: string;
  title: string;
}

const ShareButtons = ({ url, title }: ShareButtonsProps) => {
  const [copied, setCopied] = useState(false);
  const enc = encodeURIComponent(url);
  const encText = encodeURIComponent(`${title} — ${url}`);

  const nativeShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title, url }); } catch { /* cancelled */ }
    } else {
      copyLink();
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* noop */ }
  };

  const links = [
    { icon: Facebook, label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${enc}` },
    { icon: MessageCircle, label: 'Messenger', href: `https://www.facebook.com/dialog/send?app_id=0&link=${enc}&redirect_uri=${enc}` },
    { icon: Send, label: 'WhatsApp', href: `https://wa.me/?text=${encText}` },
  ];

  return (
    <div className="mt-4 sm:mt-6 flex flex-wrap items-center gap-2">
      <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mr-1 inline-flex items-center gap-1">
        <Share2 size={12} /> Share
      </span>
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${l.label}`}
          className="p-2 border border-border rounded-sm hover:bg-foreground hover:text-background transition-colors"
        >
          <l.icon size={15} />
        </a>
      ))}
      <button
        type="button"
        onClick={copyLink}
        aria-label="Copy link"
        className="p-2 border border-border rounded-sm hover:bg-foreground hover:text-background transition-colors"
      >
        {copied ? <Check size={15} /> : <Link2 size={15} />}
      </button>
      <button
        type="button"
        onClick={nativeShare}
        aria-label="Share"
        className="sm:hidden p-2 border border-border rounded-sm hover:bg-foreground hover:text-background transition-colors"
      >
        <Share2 size={15} />
      </button>
    </div>
  );
};

export default ShareButtons;
