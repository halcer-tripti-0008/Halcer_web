import { ArrowRight } from 'lucide-react';

import { Reveal, RevealGroup, RevealItem } from '@/components/animations/Reveal';
import { Section } from '@/components/ui/Section';
import { SECTION_IDS } from '@/constants/navigation';
import { industriesContent as content } from '@/content/home';

export function IndustriesSection() {
  return (
    <Section
      id={SECTION_IDS.industries}
      aria-labelledby="industries-title"
      className="relative overflow-hidden border-b border-white/[0.08] bg-ink-900 bg-[radial-gradient(circle_at_15%_40%,rgba(0,210,255,0.05)_0%,transparent_60%),radial-gradient(circle_at_85%_60%,rgba(0,163,255,0.04)_0%,transparent_50%)] py-16 sm:py-24"
      innerClassName="relative z-10"
    >
      <Reveal className="mb-10 flex flex-col justify-between border-b border-white/[0.08] pb-8 sm:mb-16 md:flex-row md:items-end">
        <div>
          <h2
            id="industries-title"
            data-reveal="lines"
            className="max-w-3xl font-display text-2xl leading-tight font-medium tracking-tight text-white sm:text-4xl lg:text-headline-xl lg:leading-(--text-headline-xl--line-height)"
          >
            {content.titleStart}{' '}
            <span className="text-gradient-glow">{content.titleHighlight}</span> {content.titleEnd}
          </h2>
        </div>
        <p className="mt-6 max-w-sm text-sm leading-relaxed text-mist sm:text-body-md md:mt-0">
          {content.description}
        </p>
      </Reveal>

      <RevealGroup className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {content.industries.map(({ icon: Icon, ...industry }) => (
          <RevealItem key={industry.title}>
            <article
              data-tilt
              className="group spotlight flex h-full flex-col justify-between rounded-2xl border border-white/[0.08] bg-[rgba(18,22,32,0.7)] p-6 backdrop-blur-[12px] transition-[border-color,box-shadow] duration-300 hover:border-white/20 hover:shadow-xl sm:p-8 lg:p-10"
            >
              <div className="space-y-6">
                <div>
                  <div className="mb-6 flex items-center justify-between">
                    <span className="rounded-pill border border-white/[0.08] bg-white/5 px-3 py-1 text-xs font-medium text-haze/80">
                      {industry.sector}
                    </span>
                    <Icon
                      aria-hidden="true"
                      className="size-5 text-white/40 transition-colors group-hover:text-white"
                      strokeWidth={1.75}
                    />
                  </div>
                  <h3 className="font-display text-xl leading-snug font-semibold tracking-tight text-white transition-colors group-hover:text-brand sm:text-2xl">
                    {industry.title}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-mist sm:text-body-md">{industry.body}</p>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.08] pt-6 sm:mt-10">
                <dl className="flex items-center gap-4 text-xs sm:gap-6">
                  {industry.metrics.map((metric, index) => (
                    <div key={metric.label} className="flex items-center gap-4 sm:gap-6">
                      {index > 0 && <div aria-hidden="true" className="h-6 w-px bg-white/[0.08]" />}
                      <div className="space-y-1">
                        <dt className="block text-haze/60">{metric.label}</dt>
                        <dd className="font-medium text-white">{metric.value}</dd>
                      </div>
                    </div>
                  ))}
                </dl>
                <span
                  aria-hidden="true"
                  className="flex size-10 shrink-0 items-center justify-center rounded-pill border border-white/10 text-white/60 transition-all group-hover:border-white/40 group-hover:text-white"
                >
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </article>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
