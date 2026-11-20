import type { ComponentPropsWithoutRef } from 'react';
import { Link } from 'react-router';

interface SmartLinkProps extends Omit<ComponentPropsWithoutRef<'a'>, 'href'> {
  href: string;
}

/**
 * Internal paths ("/", "/#section") use client-side routing (so anchor scrolling goes
 * through Lenis); external, mailto and placeholder ("#") hrefs render a plain anchor.
 */
export function SmartLink({ href, ...props }: SmartLinkProps) {
  if (href.startsWith('/')) {
    return <Link to={href} {...props} />;
  }
  return <a href={href} {...props} />;
}
