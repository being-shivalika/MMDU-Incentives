import { useEffect } from 'react';

export const CLAIMS_UPDATED_EVENT = 'claims-updated';

export const notifyClaimsUpdated = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(CLAIMS_UPDATED_EVENT));
  }
};

/**
 * Custom hook to sync submission claims in real-time.
 * - Refetches on component mount
 * - Listens for 'claims-updated' global event
 * - Listens for window focus event
 * - Polls in background every `intervalMs` (default: 4 seconds) when tab is visible
 */
export const useSubmissionSync = (fetchCallback, intervalMs = 4000) => {
  useEffect(() => {
    let timer = null;

    const runFetch = () => {
      if (typeof fetchCallback === 'function') {
        fetchCallback();
      }
    };

    // Run fetch on mount
    runFetch();

    // Listener for claims-updated event
    const handleClaimsUpdated = () => {
      runFetch();
    };

    // Listener when user returns to tab
    const handleFocus = () => {
      runFetch();
    };

    window.addEventListener(CLAIMS_UPDATED_EVENT, handleClaimsUpdated);
    window.addEventListener('focus', handleFocus);

    // Auto-polling interval
    if (intervalMs > 0) {
      timer = setInterval(() => {
        if (document.visibilityState === 'visible') {
          runFetch();
        }
      }, intervalMs);
    }

    return () => {
      window.removeEventListener(CLAIMS_UPDATED_EVENT, handleClaimsUpdated);
      window.removeEventListener('focus', handleFocus);
      if (timer) clearInterval(timer);
    };
  }, [fetchCallback, intervalMs]);
};

export default useSubmissionSync;
