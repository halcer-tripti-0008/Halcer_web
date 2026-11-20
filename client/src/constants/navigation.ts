import { ROUTES } from './routes';

/** In-page section anchors on the home page (ids rendered by the sections). */
export const SECTION_IDS = {
  about: 'about',
  capabilities: 'capabilities',
  industries: 'industries',
  insights: 'insights',
  contact: 'contact',
} as const;

export const homeAnchor = (id: string) => `${ROUTES.home}#${id}`;

/** Height of the fixed site header (Tailwind h-20). Used to offset anchor scrolling. */
export const HEADER_HEIGHT = 80;

export interface NavLink {
  label: string;
  href: string;
}

/*
 * Pages that are not designed yet (Careers, Projects, Blogs, legal pages…) point to "#".
 * Replace each with its ROUTES entry when the page is added.
 */
export const PRIMARY_NAV: readonly NavLink[] = [
  { label: 'Overview', href: ROUTES.home },
  { label: 'About', href: homeAnchor(SECTION_IDS.about) },
  { label: 'Services', href: homeAnchor(SECTION_IDS.capabilities) },
  { label: 'Insights', href: homeAnchor(SECTION_IDS.insights) },
  { label: 'Careers', href: '#' },
];

export const CONTACT_HREF = homeAnchor(SECTION_IDS.contact);

export const FOOTER_NAV: readonly { title: string; links: readonly NavLink[] }[] = [
  {
    title: 'Navigation',
    links: [
      { label: 'Homepage', href: ROUTES.home },
      { label: 'Overview', href: homeAnchor(SECTION_IDS.about) },
      { label: 'Expertise', href: homeAnchor(SECTION_IDS.capabilities) },
      { label: 'Projects', href: '#' },
      { label: 'Testimonials', href: '#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About us', href: homeAnchor(SECTION_IDS.about) },
      { label: 'Career', href: '#' },
      { label: 'Blogs', href: homeAnchor(SECTION_IDS.insights) },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms of service', href: '#' },
      { label: 'Privacy policy', href: '#' },
      { label: 'Cookies', href: '#' },
      { label: 'Changelog', href: '#' },
    ],
  },
];
