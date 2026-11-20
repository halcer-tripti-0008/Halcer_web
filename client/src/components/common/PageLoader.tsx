/**
 * Suspense fallback for lazily loaded routes. Intentionally visually minimal:
 * route chunks are small, so this is usually shown for only a few frames.
 */
export function PageLoader() {
  return (
    <div role="status" aria-live="polite" className="min-h-dvh">
      <span className="sr-only">Loading…</span>
    </div>
  );
}
