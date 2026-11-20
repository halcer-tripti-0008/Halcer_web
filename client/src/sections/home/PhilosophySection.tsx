import { Reveal } from '@/components/animations/Reveal';
import { Pill } from '@/components/ui/Pill';
import { Section } from '@/components/ui/Section';
import { StatusDot } from '@/components/ui/StatusDot';
import { COMPANY } from '@/constants/company';
import { SECTION_IDS } from '@/constants/navigation';
import { philosophyContent as content } from '@/content/home';

export function PhilosophySection() {
  return (
    <Section
      id={SECTION_IDS.about}
      aria-labelledby="philosophy-title"
      className="relative border-b border-slate-200 bg-white py-16 text-slate-900 sm:py-24"
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-6">
        <Reveal className="flex flex-col justify-between lg:col-span-5 lg:pr-8">
          <div>
            <Pill variant="light" className="mb-6 px-3.5 py-1.5">
              <StatusDot tone="accent" />
              <span>{content.eyebrow}</span>
            </Pill>
            <h2
              id="philosophy-title"
              className="mb-6 font-display text-2xl leading-tight font-medium tracking-tight text-slate-900 sm:mb-8 sm:text-4xl lg:text-headline-xl lg:leading-(--text-headline-xl--line-height)"
            >
              {content.title}
              <br className="hidden xl:inline" />{' '}
              <span className="text-slate-500">{content.titleMuted}</span>
            </h2>

            <figure className="relative mb-8 rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] sm:p-6">
              <div
                aria-hidden="true"
                className="absolute top-0 left-0 h-full w-1.5 rounded-l bg-[linear-gradient(180deg,#0284C7_0%,#00D2FF_100%)]"
              />
              <blockquote className="pl-3 text-sm leading-[1.6] text-slate-800 italic sm:text-body-md">
                <p>{content.quote}</p>
              </blockquote>
              <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-3 pl-3 text-xs text-slate-500">
                <span className="font-semibold text-slate-900">{content.quoteAuthor}</span>
                <span>{content.quoteRole}</span>
              </figcaption>
            </figure>
          </div>

          <div className="hidden space-y-1.5 border-t border-slate-200 pt-6 text-xs text-slate-500 lg:block">
            <div className="font-medium text-slate-900">{COMPANY.studio}</div>
            <div>{COMPANY.offices.join(' • ')}</div>
          </div>
        </Reveal>

        <Reveal className="space-y-8 sm:space-y-10 lg:col-span-7">
          <div className="space-y-4 text-sm leading-relaxed text-slate-700 sm:space-y-6 sm:text-base lg:text-body-lg">
            {content.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>

          <figure className="rounded-xl border border-slate-200 bg-slate-50 p-2 shadow-sm sm:p-3">
            <div className="relative h-[220px] w-full overflow-hidden rounded-lg sm:h-[320px] md:h-[380px]">
              <img
                src={content.image.src}
                alt={content.image.alt}
                width={content.image.width}
                height={content.image.height}
                loading="lazy"
                decoding="async"
                className="size-full object-cover brightness-95 contrast-105 transition-transform duration-500 hover:scale-[1.01]"
              />
              <figcaption className="absolute bottom-3 left-3 rounded-md border border-slate-200/80 bg-white/90 px-3.5 py-2 text-xs font-medium text-slate-900 shadow-md backdrop-blur-md">
                {content.imageCaption}
              </figcaption>
            </div>
            <ul className="flex flex-wrap items-center justify-between gap-2 px-2 py-3.5 text-xs text-slate-500 sm:px-4">
              {content.facilities.map((facility) => (
                <li key={facility}>{facility}</li>
              ))}
              <li className="font-semibold text-accent">{content.facilitiesHighlight}</li>
            </ul>
          </figure>
        </Reveal>
      </div>
    </Section>
  );
}
