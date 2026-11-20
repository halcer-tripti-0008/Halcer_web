export const COMPANY = {
  name: 'HALCER',
  studio: 'HALCER Applied Intelligence Studio',
  offices: ['Zurich', 'London', 'San Francisco'],
  email: 'hello@halcer.com',
  address: { street: 'Gotthardstrasse 26', city: 'Zurich', postalCode: '8002', country: 'CH' },
  summary:
    'Discover HALCER, a leading studio specializing in AI optimization and systems architecture. Enhance your computational infrastructure with our tailored strategies.',
} as const;

/** Social profile URLs. Replace "#" with the real profile links. */
export const SOCIAL_LINKS = [
  { id: 'discord', label: 'Discord', href: '#' },
  { id: 'instagram', label: 'Instagram', href: '#' },
  { id: 'facebook', label: 'Facebook', href: '#' },
  { id: 'x', label: 'X', href: '#' },
] as const;

export type SocialId = (typeof SOCIAL_LINKS)[number]['id'];
