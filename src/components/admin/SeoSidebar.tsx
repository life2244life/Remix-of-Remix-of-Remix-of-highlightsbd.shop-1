import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import SeoAssistant from '@/components/admin/SeoAssistant';
import type { SeoResult } from '@/lib/seoAnalyzer';
import type { PreviewData } from '@/components/admin/SerpSocialPreviews';

type Props = {
  result: SeoResult;
  focusKeyword: string;
  onFocusKeywordChange: (v: string) => void;
  keywordPlaceholder?: string;
  preview?: PreviewData;
};

/**
 * Responsive SEO panel used inside the Product & Blog editor modals.
 * Desktop/tablet: sticky left column. Mobile: collapsible accordion (not sticky).
 * Wraps SeoAssistant without altering any scoring logic.
 */
const SeoSidebar = (props: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <aside className="order-first lg:order-none lg:w-[320px] xl:w-[360px] lg:shrink-0">
      {/* Mobile accordion header */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="lg:hidden w-full flex items-center justify-between border border-border bg-card px-4 py-3 mb-3"
        aria-expanded={open}
      >
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
          SEO Analysis · {props.result.score}/100
        </span>
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <div
        className={`${open ? 'block' : 'hidden'} lg:block lg:sticky lg:top-[84px] lg:max-h-[calc(90vh-9rem)] lg:overflow-y-auto lg:pr-1`}
      >
        <SeoAssistant {...props} />
      </div>
    </aside>
  );
};

export default SeoSidebar;
