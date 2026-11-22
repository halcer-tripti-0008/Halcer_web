import { Reveal, RevealGroup, RevealItem } from '@/components/animations/Reveal';
import { Pill } from '@/components/ui/Pill';
import { Section } from '@/components/ui/Section';
import { differenceContent as content } from '@/content/home';
import { cn } from '@/utils/cn';

export function DifferenceSection() {
  const { collaboration } = content;

  return (
    <Section
      aria-labelledby="difference-title"
      className="border-b border-white/[0.08] bg-ink-950 py-16 sm:py-24"
    >
      <Reveal>
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-6 sm:mb-12">
          <Pill variant="subtle">{content.eyebrow}</Pill>
          <span className="text-xs text-mist">{content.aside}</span>
        </div>
        <div className="mb-12 grid grid-cols-1 gap-6 sm:mb-16 lg:grid-cols-12">
          <h2
            id="difference-title"
            data-reveal="lines"
            className="font-display text-2xl leading-tight font-medium tracking-tight text-white sm:text-4xl lg:col-span-7 lg:text-headline-xl lg:leading-(--text-headline-xl--line-height)"
          >
            {content.title}
          </h2>
          <p className="flex items-end text-sm leading-relaxed text-mist sm:text-body-md lg:col-span-5">
            {content.description}
          </p>
        </div>
      </Reveal>

      <RevealGroup className="mb-12 grid grid-cols-1 gap-6 sm:mb-16 md:grid-cols-2 lg:grid-cols-3">
        {content.pillars.map(({ icon: Icon, ...pillar }, index) => (
          <RevealItem
            key={pillar.title}
            className={cn(index === content.pillars.length - 1 && 'md:col-span-2 lg:col-span-1')}
          >
            <article
              data-tilt
              className="spotlight flex h-full flex-col justify-between rounded-lg border border-white/[0.08] bg-ink-700 p-6 transition-colors hover:border-white/20 sm:p-8"
            >
              <div>
                <div className="mb-6 flex items-center justify-between border-b border-white/[0.08] pb-4 sm:mb-8">
                  <span className="text-xs font-medium text-brand">{pillar.eyebrow}</span>
                  <Icon aria-hidden="true" className="size-[18px] text-mist" strokeWidth={1.75} />
                </div>
                <h3 className="mb-3 font-display text-xl font-semibold text-white sm:mb-4 sm:text-headline-md sm:font-medium">
                  {pillar.title}
                </h3>
                <p className="text-sm leading-relaxed text-mist sm:text-body-md">{pillar.body}</p>
              </div>
              <div className="mt-6 border-t border-white/[0.08] pt-4 text-xs text-mist sm:mt-8">
                {pillar.footnote}
              </div>
            </article>
          </RevealItem>
        ))}
      </RevealGroup>

      <Reveal className="w-full overflow-hidden rounded-lg border border-white/[0.08] bg-ink-700">
        <div className="grid grid-cols-1 items-stretch lg:grid-cols-12">
          <div
            data-reveal="media"
            className="relative min-h-[260px] overflow-hidden sm:min-h-[340px] lg:col-span-7 lg:min-h-[420px]"
          >
            <img
              data-parallax
              src={collaboration.image.src}
              alt={collaboration.image.alt}
              width={collaboration.image.width}
              height={collaboration.image.height}
              loading="lazy"
              decoding="async"
              className="absolute inset-x-0 -top-[10%] h-[120%] w-full object-cover brightness-[0.85] contrast-110 grayscale"
            />
            <div className="absolute inset-0 hidden bg-gradient-to-r from-transparent to-ink-700 opacity-60 lg:block" />
          </div>
          <div className="flex flex-col justify-between bg-ink-700 p-6 sm:p-8 lg:col-span-5 lg:p-12">
            <div>
              <span className="mb-3 block text-xs font-medium tracking-wider text-brand uppercase">
                {collaboration.eyebrow}
              </span>
              <h3 className="mb-4 font-display text-xl leading-tight font-medium text-white sm:text-2xl lg:text-headline-lg lg:leading-(--text-headline-lg--line-height)">
                {collaboration.title}
              </h3>
              <p className="mb-6 text-sm leading-relaxed text-mist sm:text-body-md">
                {collaboration.body}
              </p>
            </div>
            <dl className="space-y-3 border-t border-white/[0.08] pt-6 text-xs text-mist">
              {collaboration.facts.map((fact) => (
                <div key={fact.label} className="flex flex-wrap justify-between gap-1">
                  <dt>{fact.label}</dt>
                  <dd className={'positive' in fact ? 'text-emerald-400' : 'text-white'}>
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
