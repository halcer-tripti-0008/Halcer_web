import { ArrowUpRight } from 'lucide-react';

import { Reveal, RevealGroup, RevealItem } from '@/components/animations/Reveal';
import { SmartLink } from '@/components/common/SmartLink';
import { Pill } from '@/components/ui/Pill';
import { Section } from '@/components/ui/Section';
import { StatusDot } from '@/components/ui/StatusDot';
import { CONTACT_HREF, SECTION_IDS } from '@/constants/navigation';
import { capabilitiesContent as content } from '@/content/home';

export function CapabilitiesSection() {
  return (
    <Section
      id={SECTION_IDS.capabilities}
      aria-labelledby="capabilities-title"
      className="relative border-b border-slate-300 bg-slate-50 py-16 text-slate-900 sm:py-24"
    >
      <Reveal className="mb-8 flex flex-col justify-between border-b border-slate-200 pb-8 sm:mb-12 md:flex-row md:items-end">
        <div>
          <Pill variant="lightAccent" className="mb-3">
            {content.eyebrow}
          </Pill>
          <h2
            id="capabilities-title"
            className="font-display text-3xl leading-[1.05] font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl lg:text-display-lg lg:leading-(--text-display-lg--line-height) lg:font-semibold"
          >
            {content.titleStart}{' '}
            <span className="text-gradient-accent">{content.titleHighlight}</span>{' '}
            {content.titleEnd}
          </h2>
        </div>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-600 sm:text-body-md md:mt-0">
          {content.description}
        </p>
      </Reveal>

      <RevealGroup className="grid grid-cols-1 gap-4">
        {content.practices.map((practice) => (
          <RevealItem key={practice.title}>
            <article className="group rounded-xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:shadow-lg sm:p-8">
              <div className="grid grid-cols-1 items-start gap-4 sm:gap-6 lg:grid-cols-12">
                <div className="hidden lg:col-span-1 lg:block">
                  <StatusDot
                    tone="accent"
                    size="size-3"
                    className="mt-2 shadow-[0_0_10px_rgba(2,132,199,0.4)]"
                  />
                </div>
                <div className="lg:col-span-4">
                  <div className="mb-1 flex items-center gap-2 lg:block">
                    <StatusDot tone="accent" size="size-2.5" className="shadow-sm lg:hidden" />
                    <h3 className="font-display text-xl font-semibold tracking-tight text-slate-900 sm:text-headline-md sm:font-medium">
                      {practice.title}
                    </h3>
                  </div>
                  <span className="mt-1 block text-xs font-medium text-slate-500">
                    {practice.subtitle}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-slate-700 sm:text-body-md lg:col-span-5">
                  <p>{practice.body}</p>
                  <ul className="flex flex-wrap gap-2 pt-2">
                    {practice.tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-pill border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex items-center justify-start pt-3 lg:col-span-2 lg:justify-end lg:pt-0">
                  <SmartLink
                    href={CONTACT_HREF}
                    className="inline-flex min-h-11 items-center gap-2 py-2 text-sm font-semibold text-accent transition-colors"
                  >
                    <span>
                      {content.cta}
                      <span className="sr-only">: {practice.title}</span>
                    </span>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-4 transition-transform group-hover:translate-x-1"
                    />
                  </SmartLink>
                </div>
              </div>
            </article>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
