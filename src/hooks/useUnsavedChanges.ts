import { useEffect, useRef } from 'react';

/**
 * Tracks unsaved edits and warns the user before they lose them.
 * - Blocks browser tab close / refresh via the native beforeunload prompt.
 * - Exposes confirmLeave() for in-app navigation (e.g. "Back to list").
 */
export function useUnsavedChanges(isDirty: boolean) {
  const dirtyRef = useRef(isDirty);
  dirtyRef.current = isDirty;

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (!dirtyRef.current) return;
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, []);

  const confirmLeave = () =>
    !dirtyRef.current ||
    window.confirm('You have unsaved changes. Leave without saving?');

  return { confirmLeave };
}
