import { Outlet } from 'react-router';

import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { RouteScrollManager } from '@/router/RouteScrollManager';

/** Top-level layout shared by every route: fixed header, page content, footer. */
export function RootLayout() {
  return (
    <>
      <RouteScrollManager />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-ink-950"
      >
        Skip to content
      </a>
      <SiteHeader />
      {/* pt-20 clears the fixed 80px header. */}
      <main id="main-content" tabIndex={-1} className="w-full pt-20 outline-none">
        <Outlet />
      </main>
      <SiteFooter />
    </>
  );
}
