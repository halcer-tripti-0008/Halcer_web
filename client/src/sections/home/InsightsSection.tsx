import { ArrowRight, ArrowUpRight, BadgeCheck, ShieldCheck } from 'lucide-react';

import { Reveal, RevealGroup, RevealItem } from '@/components/animations/Reveal';
import { SmartLink } from '@/components/common/SmartLink';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { Pill } from '@/components/ui/Pill';
import { Section } from '@/components/ui/Section';
import { StatusDot } from '@/components/ui/StatusDot';
import { CONTACT_HREF, SECTION_IDS } from '@/constants/navigation';
import { insightsContent as content } from '@/content/home';

const card =
  'spotlight [--spot-color:rgba(2,132,199,0.07)] rounded-4xl border border-slate-200/80 bg-paper shadow-sm transition-[box-shadow] duration-300 hover:shadow-md';

export function InsightsSection() {
  const { archive, cohort, sla, flagship } = content;

  return (
    <Section
      id={SECTION_IDS.insights}
      aria-labelledby="insights-title"
      className="relative border-y border-slate-200 bg-white py-16 text-slate-900 sm:py-28"
    >
      <Reveal className="mb-8 flex flex-col justify-between border-b border-slate-200 pb-6 sm:mb-12 md:flex-row md:items-end">
        <div>
          <Pill variant="lightAccent" className="mb-2">
            {content.eyebrow}
          </Pill>
          <h2
            id="insights-title"
            data-reveal="lines"
            className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-headline-xl lg:font-medium"
          >
            {content.titleStart}{' '}
            <span className="text-gradient-accent">{content.titleHighlight}</span>.
          </h2>
        </div>
        {/* TODO: point to the publications page once it is designed. */}
        <SmartLink
          href="#"
          className="mt-4 flex min-h-11 items-center gap-1.5 text-sm font-semibold text-accent transition-colors md:mt-0"
        >
          <span>{content.allPublicationsCta}</span>
          <ArrowRight aria-hidden="true" className="size-4" />
        </SmartLink>
      </Reveal>

      <RevealGroup className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
        {/* Archive card */}
        <RevealItem className="lg:col-span-5">
          <article data-tilt className={`${card} flex h-full flex-col justify-between p-6 sm:p-10`}>
            <div className="mb-6 flex w-full items-center justify-center overflow-hidden rounded-2xl border border-slate-200/60 bg-white/70 p-3 sm:mb-8 sm:p-4">
              <div
                data-reveal="media"
                className="relative h-44 w-full overflow-hidden rounded-xl sm:h-56"
              >
                {/* Design photo unavailable from the Stitch export — replace with the real asset. */}
                <ImagePlaceholder
                  label="Precision engineering cleanroom lab"
                  className="size-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <span className="absolute bottom-3 left-3 rounded-pill bg-white/90 px-3 py-1 font-mono text-xs font-medium text-slate-800 backdrop-blur-md">
                  {archive.badge}
                </span>
              </div>
            </div>
            <div>
              <h3 className="mb-6 font-display text-xl leading-snug font-bold tracking-tight text-slate-900 sm:mb-8 sm:text-2xl lg:text-3xl">
                {archive.title}
              </h3>
              <div className="pt-2">
                <SmartLink
                  href={CONTACT_HREF}
                  data-magnetic="0.3"
                  className="group shine inline-flex min-h-11 items-center gap-3 rounded-pill bg-black px-6 py-3.5 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-slate-800"
                >
                  <span>{archive.cta}</span>
                  <span className="flex size-6 items-center justify-center rounded-pill bg-white/20 transition-transform group-hover:translate-x-0.5">
                    <ArrowRight aria-hidden="true" className="size-3.5 text-white" />
                  </span>
                </SmartLink>
              </div>
            </div>
          </article>
        </RevealItem>

        <div className="flex flex-col gap-6 lg:col-span-7">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-12">
            {/* Cohort card */}
            <RevealItem className="sm:col-span-7">
              <article className={`${card} flex h-full flex-col justify-between p-6 sm:p-8`}>
                <div className="mb-6 flex items-center gap-4">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-slate-200/80 bg-white shadow-sm">
                    <ShieldCheck
                      aria-hidden="true"
                      className="size-6 text-accent"
                      strokeWidth={1.75}
                    />
                  </span>
                  <Pill variant="white" className="gap-1.5 text-slate-700">
                    <StatusDot tone="emerald" size="size-1.5" />
                    <span>{cohort.badge}</span>
                  </Pill>
                </div>
                <div>
                  <h3 className="mb-2 text-lg leading-snug font-bold tracking-tight text-slate-900 sm:text-xl">
                    {cohort.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-slate-500 sm:text-sm">{cohort.body}</p>
                </div>
              </article>
            </RevealItem>

            {/* SLA card */}
            <RevealItem className="sm:col-span-5">
              <article className={`${card} flex h-full flex-col justify-between p-6 sm:p-8`}>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-mono text-xs font-semibold tracking-wider text-slate-500 uppercase">
                    {sla.label}
                  </h3>
                  <BadgeCheck
                    aria-hidden="true"
                    className="size-[18px] text-slate-400"
                    strokeWidth={1.75}
                  />
                </div>
                <div>
                  <p className="mb-3 font-display text-3xl leading-none font-black tracking-tighter text-slate-900 sm:text-4xl md:text-5xl">
                    {sla.value}
                  </p>
                  <p className="text-xs leading-relaxed font-medium text-slate-500">{sla.body}</p>
                </div>
              </article>
            </RevealItem>
          </div>

          {/* Flagship note */}
          <RevealItem className="flex flex-1">
            <article className={`${card} flex flex-1 flex-col justify-between p-6 sm:p-8 lg:p-10`}>
              <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-12 md:gap-8">
                <div className="md:col-span-7">
                  <h3 className="mb-3 text-lg leading-snug font-bold tracking-tight text-slate-900 sm:text-xl lg:text-2xl">
                    {flagship.title}
                  </h3>
                  <p className="mb-6 text-xs leading-relaxed text-slate-600 sm:text-sm">
                    {flagship.body}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500 sm:gap-4">
                    <span className="font-mono">{flagship.readTime}</span>
                    <span aria-hidden="true">•</span>
                    <span>{flagship.type}</span>
                    <span aria-hidden="true" className="text-slate-300">
                      |
                    </span>
                    <SmartLink
                      href={CONTACT_HREF}
                      className="inline-flex items-center gap-1 py-1 font-semibold text-accent hover:underline"
                    >
                      <span>{flagship.cta}</span>
                      <ArrowUpRight aria-hidden="true" className="size-3.5" />
                    </SmartLink>
                  </div>
                </div>
                <div className="md:col-span-5">
                  <div
                    data-reveal="media"
                    className="relative h-40 w-full overflow-hidden rounded-2xl border border-slate-200/80 shadow-sm sm:h-48 md:h-52"
                  >
                    {/* Design photo unavailable from the Stitch export — replace with the real asset. */}
                    <ImagePlaceholder
                      label="HALCER architecture squad collaborating"
                      className="size-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
                  </div>
                </div>
              </div>
            </article>
          </RevealItem>
        </div>
      </RevealGroup>
    </Section>
  );
}
