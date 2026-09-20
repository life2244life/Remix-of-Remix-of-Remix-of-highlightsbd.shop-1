import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Persistent auto-draft for editor forms.
 *
 * - Auto-saves the current snapshot to localStorage (debounced) so unsaved work
 *   survives modal close, refresh, crash, shutdown or disconnect.
 * - On mount, detects an existing draft and exposes it for recovery.
 * - Auto-saving is paused while a recovery decision is pending, so the empty
 *   initial form never overwrites a real draft before the user chooses.
 */
export function useFormDraft<T>(
  key: string | null,
  current: T,
  opts?: { enabled?: boolean; delay?: number },
) {
  const enabled = (opts?.enabled ?? true) && !!key;
  const delay = opts?.delay ?? 700;

  const [recovered, setRecovered] = useState<T | null>(null);
  const [checked, setChecked] = useState(false);
  const currentRef = useRef(current);
  currentRef.current = current;

  // Detect an existing draft once on mount (per key).
  useEffect(() => {
    if (!enabled) { setChecked(true); return; }
    try {
      const raw = localStorage.getItem(key!);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') setRecovered(parsed as T);
      }
    } catch { /* ignore corrupt drafts */ }
    setChecked(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // Debounced auto-save (paused until recovery is resolved).
  useEffect(() => {
    if (!enabled || !checked || recovered) return;
    const t = setTimeout(() => {
      try { localStorage.setItem(key!, JSON.stringify(currentRef.current)); } catch { /* quota */ }
    }, delay);
    return () => clearTimeout(t);
  }, [enabled, checked, recovered, current, delay, key]);

  // Flush immediately on tab hide / unload so nothing is lost on crash/close.
  useEffect(() => {
    if (!enabled) return;
    const flush = () => {
      if (recovered) return;
      try { localStorage.setItem(key!, JSON.stringify(currentRef.current)); } catch { /* quota */ }
    };
    window.addEventListener('beforeunload', flush);
    document.addEventListener('visibilitychange', flush);
    return () => {
      window.removeEventListener('beforeunload', flush);
      document.removeEventListener('visibilitychange', flush);
    };
  }, [enabled, recovered, key]);

  const clearDraft = useCallback(() => {
    if (key) { try { localStorage.removeItem(key); } catch { /* ignore */ } }
    setRecovered(null);
  }, [key]);

  const dismissRecovery = useCallback(() => setRecovered(null), []);

  return {
    recovered,
    hasRecovery: !!recovered,
    checked,
    clearDraft,
    dismissRecovery,
  };
}
