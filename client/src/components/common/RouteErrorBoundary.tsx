import { isRouteErrorResponse, Link, useRouteError } from 'react-router';

import { env } from '@/config/env';
import { ROUTES } from '@/constants/routes';

/**
 * Router-level error boundary: catches render errors, failed lazy chunk loads
 * (e.g. after a deploy) and thrown responses for every route.
 */
export function RouteErrorBoundary() {
  const error = useRouteError();
  const isResponse = isRouteErrorResponse(error);

  if (env.isDev) console.error(error);

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6 text-center">
      <title>{`Something went wrong | ${env.siteName}`}</title>
      <h1 className="text-2xl font-semibold">
        {isResponse ? `${error.status} — ${error.statusText}` : 'Something went wrong'}
      </h1>
      <p>Please refresh the page or return to the homepage.</p>
      <div className="flex gap-4">
        <button type="button" className="underline" onClick={() => window.location.reload()}>
          Refresh
        </button>
        <Link to={ROUTES.home} className="underline">
          Go to homepage
        </Link>
      </div>
    </main>
  );
}
