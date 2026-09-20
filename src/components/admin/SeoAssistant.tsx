import { useState } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, ChevronDown, Search } from 'lucide-react';
import type { SeoResult, SeoCheck } from '@/lib/seoAnalyzer';
import SerpSocialPreviews, { type PreviewData } from '@/components/admin/SerpSocialPreviews';
import { FieldCounter } from '@/components/admin/TextFieldWithGuidance';

const bandMeta = {
  good: { label: 'Good', text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500', ring: 'stroke-emerald-500' },
  improve: { label: 'Needs Improvement', text: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500', ring: 'stroke-amber-500' },
  poor: { label: 'Poor', text: 'text-destructive', bg: 'bg-destructive', ring: 'stroke-destructive' },
} as const;

const ScoreGauge = ({ result }: { result: SeoResult }) => {
  const meta = bandMeta[result.band];
  const r = 34;
  const c = 2 * Math.PI * r;
  const offset = c - (result.score / 100) * c;
  return (
    <div className="flex items-center gap-4">
      <div className="relative w-20 h-20 shrink-0">
        <svg viewBox="0 0 80 80" className="w-20 h-20 -rotate-90">
          <circle cx="40" cy="40" r={r} className="fill-none stroke-muted" strokeWidth="7" />
          <circle
            cx="40" cy="40" r={r}
            className={`fill-none ${meta.ring} transition-[stroke-dashoffset] duration-500`}
            strokeWidth="7" strokeLinecap="round"
            strokeDasharray={c} strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-semibold leading-none">{result.score}</span>
          <span className="text-[8px] text-muted-foreground">/ 100</span>
        </div>
      </div>
      <div>
        <p className={`text-sm font-medium ${meta.text}`}>{meta.label}</p>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          {result.passed.length} passed · {result.warnings.length} warnings · {result.failed.length} failed
        </p>
        <div className="mt-2 h-1.5 w-44 max-w-full rounded-full bg-muted overflow-hidden">
          <div className={`h-full ${meta.bg} transition-all duration-500`} style={{ width: `${result.score}%` }} />
        </div>
      </div>
    </div>
  );
};

const statusIcon = (s: SeoCheck['status']) =>
  s === 'pass' ? <CheckCircle2 size={15} className="text-emerald-500 shrink-0 mt-0.5" />
  : s === 'warn' ? <AlertTriangle size={15} className="text-amber-500 shrink-0 mt-0.5" />
  : <XCircle size={15} className="text-destructive shrink-0 mt-0.5" />;

const CheckRow = ({ c }: { c: SeoCheck }) => (
  <div className="flex items-start gap-2.5 py-2.5">
    {statusIcon(c.status)}
    <div className="min-w-0 flex-1">
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`text-xs ${c.status === 'pass' ? '' : 'font-medium'}`}>{c.label}</span>
        {c.detail && <span className="text-[10px] text-muted-foreground font-mono">{c.detail}</span>}
      </div>
      {c.status !== 'pass' && (
        <div className="mt-1 space-y-0.5">
          <p className="text-[11px] text-muted-foreground"><span className="font-medium text-foreground/70">Why:</span> {c.why}</p>
          <p className="text-[11px] text-muted-foreground"><span className="font-medium text-foreground/70">Fix:</span> {c.fix}</p>
        </div>
      )}
    </div>
  </div>
);

type Props = {
  result: SeoResult;
  focusKeyword: string;
  onFocusKeywordChange: (v: string) => void;
  keywordPlaceholder?: string;
  preview?: PreviewData;
};

const SeoAssistant = ({ result, focusKeyword, onFocusKeywordChange, keywordPlaceholder, preview }: Props) => {
  const [showPassed, setShowPassed] = useState(false);
  const actionable = result.checks.filter((c) => c.status !== 'pass');

  return (
    <div className="space-y-4">
    <div className="border border-border bg-card">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between gap-1.5 mb-3">
          <div className="flex items-center gap-1.5">
            <Search size={12} className="text-muted-foreground" />
            <label className="text-[10px] text-muted-foreground tracking-widest uppercase">Focus Keyword</label>
          </div>
          <FieldCounter value={focusKeyword} recommendedMin={1} recommendedMax={4} unit="words" />
        </div>
        <input
          value={focusKeyword}
          onChange={(e) => onFocusKeywordChange(e.target.value)}
          placeholder={`${keywordPlaceholder || "e.g. Men's Panjabi"} — Recommended: 1–4 words`}
          className="luxury-input"
        />
        <p className="text-[10px] text-muted-foreground mt-1.5">Used only for live analysis — not saved to the database.</p>
      </div>

      <div className="p-4 border-b border-border">
        <ScoreGauge result={result} />
      </div>

      <div className="px-4">
        {actionable.length === 0 ? (
          <p className="py-4 text-xs text-emerald-600 dark:text-emerald-400">All checks passed — great work!</p>
        ) : (
          <div className="divide-y divide-border">
            <p className="pt-3 pb-1 text-[10px] uppercase tracking-widest text-muted-foreground">Recommended actions ({actionable.length})</p>
            {actionable.map((c) => <CheckRow key={c.id} c={c} />)}
          </div>
        )}
      </div>

      {result.passed.length > 0 && (
        <div className="px-4 pb-3">
          <button
            type="button"
            onClick={() => setShowPassed((v) => !v)}
            className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground py-2 transition-colors"
          >
            <ChevronDown size={12} className={`transition-transform ${showPassed ? 'rotate-180' : ''}`} />
            {showPassed ? 'Hide' : 'Show'} passed checks ({result.passed.length})
          </button>
          {showPassed && (
            <div className="divide-y divide-border border-t border-border">
              {result.passed.map((c) => <CheckRow key={c.id} c={c} />)}
            </div>
          )}
        </div>
      )}
    </div>
    {preview && <SerpSocialPreviews data={preview} />}
    </div>
  );
};

export default SeoAssistant;
