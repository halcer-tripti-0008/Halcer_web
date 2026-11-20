import { ArrowRight } from 'lucide-react';
import { useRef } from 'react';

import { createResponsiveAnimation, gsap, GSAP_EASE, useGSAP } from '@/animations/gsap';
import { DURATION, STAGGER } from '@/animations/tokens';
import { SmartLink } from '@/components/common/SmartLink';
import { ElectricLink } from '@/components/ui/ElectricLink';
import { Section } from '@/components/ui/Section';
import { StatusDot } from '@/components/ui/StatusDot';
import { CONTACT_HREF, homeAnchor, SECTION_IDS } from '@/constants/navigation';
import { heroContent } from '@/content/home';
import { cn } from '@/utils/cn';

/**
 * Above-the-fold hero. Its entrance is driven by GSAP (already in the entry bundle and
 * applied before first paint) rather than Motion, whose lazily-loaded features would
 * otherwise keep the LCP headline and image hidden until that chunk arrives.
 */
export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { cluster, image, stats } = heroContent;

  useGSAP(
    () => {
      createResponsiveAnimation(({ reduceMotion }) => {
        if (reduceMotion) return;

        gsap.from('[data-hero-intro]', {
          autoAlpha: 0,
          y: 24,
          duration: DURATION.slow,
          ease: GSAP_EASE.out,
          stagger: STAGGER.loose,
        });

        // Scroll-scrubbed parallax on the cluster photo.
        gsap.fromTo(
          '[data-hero-parallax]',
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: 'none',
            scrollTrigger: {
              trigger: '[data-hero-frame]',
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        );
      });
    },
    { scope: sectionRef },
  );

  return (
    <Section
      ref={sectionRef}
      aria-labelledby="hero-title"
      className="relative overflow-hidden border-b border-ink-line bg-ink-950 pt-12 pb-16 sm:pt-16 sm:pb-24 lg:pt-20"
      innerClassName="relative z-10"
    >
      {/* Headline + intro */}
      <div className="mb-12 grid grid-cols-1 items-end gap-8 lg:mb-16 lg:grid-cols-12 lg:gap-6">
        <h1
          id="hero-title"
          data-hero-intro
          className="col-span-12 max-w-4xl font-display text-3xl leading-[1.05] font-semibold tracking-tight text-white sm:text-5xl sm:leading-[0.98] md:text-6xl lg:col-span-8 lg:text-[4.5rem] xl:text-display-xl xl:leading-(--text-display-xl--line-height)"
        >
          Designing{' '}
          <span className="text-gradient-glow [text-shadow:0_0_40px_rgba(0,210,255,0.25)]">
            intelligent systems
          </span>{' '}
          that move the world forward.
        </h1>

        <div
          data-hero-intro
          className="col-span-12 flex flex-col justify-end space-y-6 pt-2 lg:col-span-4 lg:pt-0"
        >
          <p className="max-w-xl text-base leading-relaxed text-mist sm:text-body-lg">
            {heroContent.description}
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2 sm:gap-4">
            <ElectricLink href={CONTACT_HREF} size="large">
              {heroContent.primaryCta}
            </ElectricLink>
            <SmartLink
              href={homeAnchor(SECTION_IDS.capabilities)}
              className="group inline-flex min-h-11 items-center gap-2 px-3 py-3 text-base font-medium text-white transition-colors hover:text-brand"
            >
              <span>{heroContent.secondaryCta}</span>
              <ArrowRight
                aria-hidden="true"
                className="size-4 transition-transform group-hover:translate-x-0.5"
              />
            </SmartLink>
          </div>
        </div>
      </div>

      {/* Compute cluster panel */}
      <div
        data-hero-intro
        className="relative w-full overflow-hidden rounded-xl border border-glow-500/25 bg-ink-700 shadow-[0_0_35px_-5px_rgba(0,210,255,0.2)]"
      >
        <div className="flex w-full flex-wrap items-center justify-between gap-2 border-b border-glow-500/25 bg-ink-panel/95 px-4 py-3 text-xs sm:px-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <StatusDot tone="bright" size="size-2.5" pulse className="shadow-[0_0_10px_#00F0FF]" />
            <span className="font-semibold tracking-[0.05em] text-glow-300">{cluster.title}</span>
          </div>
          <div className="flex items-center gap-3 font-mono text-xs text-glow-400/85 sm:gap-4">
            <span>{cluster.meta[0]}</span>
            <span aria-hidden="true" className="text-white/20">
              |
            </span>
            <span>{cluster.meta[1]}</span>
          </div>
        </div>

        <div
          data-hero-frame
          className="relative h-[280px] w-full overflow-hidden sm:h-[400px] md:h-[480px] lg:h-[540px]"
        >
          <img
            data-hero-parallax
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            fetchPriority="high"
            className="size-full scale-[1.12] object-cover object-center brightness-95 contrast-110"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,11,20,0.1)_0%,rgba(7,11,20,0.85)_100%)]" />
          <div className="pointer-events-none absolute right-4 bottom-4 left-4 flex flex-wrap items-end justify-between gap-4 sm:right-6 sm:bottom-6 sm:left-6">
            <div className="max-w-md rounded-xl border border-glow-500/35 bg-ink-glass/85 p-4 shadow-[0_10px_30px_rgba(0,0,0,0.6),0_0_20px_rgba(0,210,255,0.15)] backdrop-blur-md sm:p-5">
              <div className="mb-2 flex items-center gap-2">
                <StatusDot tone="bright" />
                <span className="font-mono text-xs font-semibold tracking-wider text-glow-400">
                  {cluster.telemetry.label}
                </span>
              </div>
              <p className="mb-1 text-sm font-semibold text-white sm:text-base">
                {cluster.telemetry.title}
              </p>
              <p className="text-xs text-mist sm:text-body-sm">{cluster.telemetry.body}</p>
            </div>
            <div className="hidden items-center gap-2 rounded-pill border border-glow-400/30 bg-ink-glass/85 px-3 py-1.5 font-mono text-xs text-glow-300 backdrop-blur-md sm:flex">
              <StatusDot tone="signal" size="size-1.5" />
              <span>{cluster.status}</span>
            </div>
          </div>
        </div>

        <dl className="grid grid-cols-1 divide-y divide-glow-500/15 border-t border-glow-500/20 bg-ink-panel/95 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={cn(
                'flex flex-col p-5 sm:p-6',
                index < 2 && 'sm:border-b sm:border-glow-500/15 lg:border-b-0',
              )}
            >
              <dt className="mb-1 text-xs tracking-wider text-glow-300 uppercase">{stat.label}</dt>
              <dd
                className={cn(
                  'font-display text-3xl leading-none font-semibold tracking-tight sm:text-[2.5rem] lg:text-[2.75rem]',
                  'highlight' in stat ? 'text-gradient-electric' : 'text-white',
                )}
              >
                {stat.value}
              </dd>
              <dd className="mt-2 text-xs text-mist sm:text-body-sm">{stat.body}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}
