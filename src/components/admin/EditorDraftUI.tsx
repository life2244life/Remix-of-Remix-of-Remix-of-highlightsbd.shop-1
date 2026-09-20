import { AlertTriangle, RotateCcw } from 'lucide-react';

/** Notice shown when an unsaved draft from a previous session is detected. */
export const DraftRecoveryBanner = ({
  onContinue, onDiscard,
}: { onContinue: () => void; onDiscard: () => void }) => (
  <div className="flex flex-col sm:flex-row sm:items-center gap-3 border border-amber-500/40 bg-amber-500/5 px-4 py-3 mb-4">
    <RotateCcw size={16} className="text-amber-600 dark:text-amber-400 shrink-0" />
    <p className="text-xs text-foreground flex-1">Recovered unsaved draft from your previous session.</p>
    <div className="flex gap-2 shrink-0">
      <button
        type="button"
        onClick={onContinue}
        className="px-3 py-1.5 text-[10px] uppercase tracking-widest bg-foreground text-background hover:opacity-90 transition-opacity"
      >
        Continue Editing
      </button>
      <button
        type="button"
        onClick={onDiscard}
        className="px-3 py-1.5 text-[10px] uppercase tracking-widest border border-border hover:bg-muted transition-colors"
      >
        Discard Draft
      </button>
    </div>
  </div>
);

/** Destructive confirmation for the "Clear All" action. */
export const ClearAllDialog = ({
  open, onCancel, onConfirm, items,
}: { open: boolean; onCancel: () => void; onConfirm: () => void; items: string[] }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4" onClick={onCancel}>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in" />
      <div
        className="relative w-full max-w-md bg-background border border-border shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 text-destructive mb-3">
          <AlertTriangle size={18} />
          <h3 className="text-base font-medium tracking-wide">Clear all unsaved content?</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-2">This will permanently remove:</p>
        <ul className="text-xs text-foreground space-y-1 mb-3 list-disc pl-5">
          {items.map(i => <li key={i}>{i}</li>)}
        </ul>
        <p className="text-[11px] text-destructive mb-5">This action cannot be undone.</p>
        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 text-[10px] uppercase tracking-widest border border-border hover:bg-muted transition-colors"
          >
            Continue Editing
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2.5 text-[10px] uppercase tracking-widest bg-destructive text-destructive-foreground hover:opacity-90 transition-opacity"
          >
            Yes, Delete Everything
          </button>
        </div>
      </div>
    </div>
  );
};
