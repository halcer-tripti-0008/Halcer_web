import { useLocation } from 'react-router';

/**
 * Returns a predicate telling whether a nav href ("/", "/#about") matches the current
 * location, including the hash, so in-page section links can show an active state.
 */
export function useIsActiveHref(): (href: string) => boolean {
  const { pathname, hash } = useLocation();
  const current = `${pathname}${hash}`;
  return (href) => href === current;
}
