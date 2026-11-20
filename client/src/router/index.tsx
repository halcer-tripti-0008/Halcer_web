import type { ComponentType } from 'react';
import { createBrowserRouter } from 'react-router';

import { PageLoader } from '@/components/common/PageLoader';
import { RouteErrorBoundary } from '@/components/common/RouteErrorBoundary';
import { ROUTES } from '@/constants/routes';
import { RootLayout } from '@/layouts/RootLayout';

/**
 * Route-level code splitting via React Router's `lazy`: each page is its own chunk,
 * fetched in parallel with navigation. The current page stays visible until the next
 * one is ready (no loader flash). Pages default-export their component.
 */
function lazyPage(load: () => Promise<{ default: ComponentType }>) {
  return async () => ({ Component: (await load()).default });
}

export const router = createBrowserRouter([
  {
    Component: RootLayout,
    ErrorBoundary: RouteErrorBoundary,
    // Shown only on the very first load while the initial page chunk downloads.
    HydrateFallback: PageLoader,
    children: [
      { path: ROUTES.home, lazy: lazyPage(() => import('@/pages/HomePage')) },
      { path: '*', lazy: lazyPage(() => import('@/pages/NotFoundPage')) },
    ],
  },
]);
