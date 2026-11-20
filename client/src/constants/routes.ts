/**
 * Single source of truth for route paths.
 * Used by the router, by navigation components, and at build time to generate sitemap.xml.
 * Keep this file free of imports so the Vite config can load it.
 */
export const ROUTES = {
  home: '/',
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];

/** Public routes that belong in sitemap.xml. Add each new indexable page here. */
export const INDEXABLE_ROUTES: readonly RoutePath[] = [ROUTES.home];
