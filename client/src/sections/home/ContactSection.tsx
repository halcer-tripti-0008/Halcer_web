import { lazy, Suspense } from 'react';

import { Reveal } from '@/components/animations/Reveal';
import { Pill } from '@/components/ui/Pill';
import { StatusDot } from '@/components/ui/StatusDot';
import { COMPANY } from '@/constants/company';
import { SECTION_IDS } from '@/constants/navigation';
import { contactContent as content } from '@/content/home';

// The form pulls in React Hook Form + Zod; loading it separately keeps them out of
// the home page chunk the hero waits on.
const ContactForm = lazy(() =>
  import('./ContactForm').then((module) => ({ default: module.ContactForm })),
);

export function ContactSection() {
  const { address } = COMPANY;

  return (
    <section
      id={SECTION_IDS.contact}
      aria-labelledby="contact-title"
      className="screen-fit w-full border-b border-white/[0.08] bg-ink-800 p-6 text-white sm:p-10 md:p-12 lg:p-20"
    >
      <p className="mb-6 flex items-center gap-2 text-xs text-haze/70 sm:mb-8 sm:text-sm">
        <span aria-hidden="true">•</span>
        <span>{content.kicker}</span>
      </p>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-16">
        <Reveal className="flex flex-col justify-between space-y-6 sm:space-y-10 lg:col-span-8">
          <h2
            id="contact-title"
            className="max-w-2xl font-display text-2xl leading-[1.15] font-bold tracking-tight text-white sm:text-[36px] sm:leading-[1.12] md:text-[44px] lg:text-[50px]"
          >
            {content.titleLines.map((line, index) => (
              <span key={line}>
                {index > 0 && (
                  <>
                    <br className="hidden sm:inline" />{' '}
                  </>
                )}
                {line}
              </span>
            ))}
          </h2>
          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-haze/70 sm:gap-4">
            <Pill variant="subtle" className="py-1.5 text-haze/70">
              <StatusDot tone="glow" className="shadow-[0_0_8px_#00E5FF]" />
              <span>{content.responseTime}</span>
            </Pill>
            <ul className="flex flex-wrap items-center gap-2 text-haze/60">
              {content.assurances.map((assurance, index) => (
                <li key={assurance} className="flex items-center gap-2">
                  {index > 0 && <span aria-hidden="true">•</span>}
                  {assurance}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <div className="flex w-full flex-col space-y-6 pt-2 lg:col-span-4">
          {/* Fallback reserves the form's height so nothing shifts when it loads. */}
          <Suspense fallback={<div aria-hidden="true" className="h-[392px]" />}>
            <ContactForm />
          </Suspense>
          <dl className="grid grid-cols-1 gap-4 border-t border-white/[0.08] pt-4 text-xs sm:grid-cols-2">
            <div className="space-y-1">
              <dt className="block font-medium text-haze/60">Address</dt>
              <dd className="leading-tight text-haze/90">
                <address className="not-italic">
                  {address.street}
                  <br />
                  {address.city}, {address.postalCode} {address.country}
                </address>
              </dd>
            </div>
            <div className="space-y-1">
              <dt className="block font-medium text-haze/60">Direct Contact</dt>
              <dd>
                <a
                  href={`mailto:${COMPANY.email}`}
                  className="block leading-tight text-white hover:underline"
                >
                  {COMPANY.email}
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
