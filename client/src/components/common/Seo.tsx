import { useLocation } from 'react-router';

import { env } from '@/config/env';

interface SeoProps {
  /** Page title without the site name; omit on the home page. */
  title?: string;
  description: string;
  /** Absolute URL or site-relative path of the social share image (1200×630 recommended). */
  image?: string;
  type?: 'website' | 'article';
  noIndex?: boolean;
}

/**
 * Per-page metadata. React 19 hoists <title>, <meta> and <link> into <head>,
 * so no helmet library is needed. Render exactly one <Seo /> per page.
 */
export function Seo({ title, description, image, type = 'website', noIndex = false }: SeoProps) {
  const { pathname } = useLocation();
  const fullTitle = title ? `${title} | ${env.siteName}` : env.siteName;
  const canonicalUrl = new URL(pathname, env.siteUrl).href;
  const imageUrl = image ? new URL(image, env.siteUrl).href : undefined;

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={env.siteName} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      {imageUrl && <meta property="og:image" content={imageUrl} />}

      <meta name="twitter:card" content={imageUrl ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {imageUrl && <meta name="twitter:image" content={imageUrl} />}
    </>
  );
}
