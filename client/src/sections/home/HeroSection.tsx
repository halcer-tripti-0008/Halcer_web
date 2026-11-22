import { ArrowRight } from 'lucide-react';
import { useRef } from 'react';

import { createResponsiveAnimation, gsap, GSAP_EASE, SplitText, useGSAP } from '@/animations/gsap';
import { SmartLink } from '@/components/common/SmartLink';
import { ElectricLink } from '@/components/ui/ElectricLink';
import { CONTACT_HREF, homeAnchor, SECTION_IDS } from '@/constants/navigation';
import { heroContent } from '@/content/home';

import { HeroCards } from './hero/HeroCards';

/**
 * Landing hero: a full-screen stage with a centred headline and floating glass cards; the
 * server-rack panel unfolds beneath it as you scroll.
 *
 * All motion is GSAP (in the entry bundle and applied before first paint), not Motion,
 * whose lazily loaded features would keep the LCP headline hidden until that chunk arrives.
 *
 * - Entrance: masked line-by-line headline, de-blurring copy, staggered actions, cards
 *   rising in; then cards drift idly and the throughput figure counts up.
 * - Pointer (desktop): cards move at different depths, the headline gradient follows the
 *   cursor, and the field reacts to cursor and clicks.
 * - Scroll: content and cards lift away; the panel unfolds with a clip-path wipe while its
 *   photo drifts.
 */
export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const { cluster, image } = heroContent;

  useGSAP(
    () => {
      const section = sectionRef.current;
      const stage = stageRef.current;
      if (!section || !stage) return;

      createResponsiveAnimation(({ reduceMotion, isDesktop, isFinePointer }) => {
        if (reduceMotion) return undefined;

        // Headline: each line rises out of its own mask. autoSplit re-splits when fonts
        // finish loading or the width changes, keeping the animation in sync.
        const title = SplitText.create('[data-hero-title]', {
          type: 'lines',
          mask: 'lines',
          linesClass: 'split-line',
          autoSplit: true,
          // SplitText expects the animation back, so it can re-sync it after a re-split.
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onSplit: (split) =>
            gsap.from(split.lines, {
              yPercent: 135,
              duration: 1.3,
              stagger: 0.12,
              ease: GSAP_EASE.out,
              delay: 0.15,
              // Back to plain text once settled (no mask wrappers left to clip descenders).
              onComplete: () => {
                split.revert();
              },
            }),
        });
        gsap
          .timeline({ defaults: { ease: GSAP_EASE.out }, delay: 0.3 })
          .from('[data-hero-copy]', {
            autoAlpha: 0,
            y: 24,
            filter: isDesktop ? 'blur(12px)' : 'none',
            duration: 1.1,
            clearProps: 'filter',
          })
          .from(
            '[data-hero-actions] > *',
            { autoAlpha: 0, y: 20, duration: 0.9, stagger: 0.1 },
            '-=0.8',
          );

        // Floating cards: rise in, then drift; figures come alive.
        gsap.from('[data-hero-card]', {
          autoAlpha: 0,
          y: 50,
          scale: 0.88,
          duration: 1.3,
          stagger: 0.14,
          delay: 1,
          ease: GSAP_EASE.out,
        });
        gsap.utils.toArray<HTMLElement>('[data-float]', section).forEach((element, index) => {
          gsap.to(element, {
            y: index % 2 === 0 ? 10 : -10,
            duration: 3.2 + index * 0.5,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
            delay: 1.8,
          });
        });
        gsap.fromTo(
          '[data-spark]',
          { strokeDashoffset: 1 },
          { strokeDashoffset: 0, duration: 2, ease: 'power2.inOut', delay: 1.4 },
        );
        gsap.utils.toArray<HTMLElement>('[data-bar]', section).forEach((bar, index) => {
          gsap.fromTo(
            bar,
            { scaleY: gsap.utils.random(0.25, 0.6) },
            {
              scaleY: () => gsap.utils.random(0.5, 1),
              duration: gsap.utils.random(0.9, 1.6),
              ease: 'sine.inOut',
              yoyo: true,
              repeat: -1,
              repeatRefresh: true,
              delay: 1.6 + index * 0.08,
            },
          );
        });
        const counter = section.querySelector<HTMLElement>('[data-count]');
        if (counter) {
          const decimals = Number(counter.dataset.decimals ?? 0);
          const proxy = { value: 0 };
          counter.textContent = (0).toFixed(decimals);
          gsap.to(proxy, {
            value: Number(counter.dataset.to ?? 0),
            duration: 2.2,
            ease: 'power2.out',
            delay: 1.2,
            onUpdate: () => {
              counter.textContent = proxy.value.toFixed(decimals);
            },
          });
        }

        // Scroll: the stage lifts away as the panel arrives…
        const lift = { trigger: stage, start: 'top top', end: 'bottom top', scrub: true };
        gsap.to('[data-hero-content]', {
          y: -80,
          autoAlpha: 0.15,
          ease: 'none',
          scrollTrigger: lift,
        });
        gsap.to('[data-hero-cards]', { y: -140, ease: 'none', scrollTrigger: lift });
        // …the panel unfolds, its photo settles and then drifts inside the frame.
        const unfold = { trigger: '[data-hero-panel]', start: 'top 85%', once: true };
        gsap.fromTo(
          '[data-hero-panel]',
          { clipPath: 'inset(10% 4% 0% 4%)', autoAlpha: 0 },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            autoAlpha: 1,
            duration: 1.5,
            ease: GSAP_EASE.inOut,
            clearProps: 'clipPath',
            scrollTrigger: unfold,
          },
        );
        gsap.from('[data-hero-media]', {
          scale: 1.3,
          duration: 2.2,
          ease: GSAP_EASE.out,
          scrollTrigger: unfold,
        });
        gsap.from('[data-hero-overlay] > *', {
          autoAlpha: 0,
          y: 28,
          duration: 0.9,
          stagger: 0.12,
          delay: 0.9,
          ease: GSAP_EASE.out,
          scrollTrigger: unfold,
        });
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

        // Pointer depth (desktop mouse/trackpad only).
        const headline = section.querySelector<HTMLElement>('[data-hero-title]');
        if (!isFinePointer || !isDesktop || !headline) {
          return () => {
            title.revert();
          };
        }
        headline.style.setProperty('--hx', '50');
        const shiftGradient = gsap.quickTo(headline, '--hx', { duration: 1, ease: 'power3.out' });
        const layers = gsap.utils.toArray<HTMLElement>('[data-depth]', section).map((element) => ({
          depth: Number(element.dataset.depth ?? 1),
          x: gsap.quickTo(element, 'x', { duration: 1.1, ease: 'power3.out' }),
          y: gsap.quickTo(element, 'y', { duration: 1.1, ease: 'power3.out' }),
        }));

        const onPointerMove = (event: PointerEvent) => {
          const rect = stage.getBoundingClientRect();
          const nx = (event.clientX - rect.left) / rect.width - 0.5;
          const ny = (event.clientY - rect.top) / rect.height - 0.5;
          for (const layer of layers) {
            layer.x(-nx * 46 * layer.depth);
            layer.y(-ny * 34 * layer.depth);
          }
          shiftGradient(50 + nx * 70);
        };
        const onPointerLeave = () => {
          for (const layer of layers) {
            layer.x(0);
            layer.y(0);
          }
          shiftGradient(50);
        };
        stage.addEventListener('pointermove', onPointerMove, { passive: true });
        stage.addEventListener('pointerleave', onPointerLeave);

        return () => {
          title.revert();
          stage.removeEventListener('pointermove', onPointerMove);
          stage.removeEventListener('pointerleave', onPointerLeave);
          headline.style.removeProperty('--hx');
        };
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      aria-labelledby="hero-title"
      className="relative overflow-hidden border-b border-ink-line bg-ink-950"
    >
      {/* Stage: one full screen below the fixed header. */}
      <div
        ref={stageRef}
        className="relative flex min-h-[calc(100svh-5rem)] flex-col items-center justify-center px-4 py-16 sm:px-6 lg:px-12 xl:px-16"
      >
        {/* Atmosphere (static): dot grid, soft glows, a calm centre for legibility, bottom fade. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 [background-image:radial-gradient(rgba(104,213,255,0.13)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_center,black_15%,transparent_72%)] [background-size:30px_30px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-48 left-[8%] h-[32rem] w-[44rem] rounded-full bg-glow-600/15 blur-[120px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/3 -right-24 h-[30rem] w-[38rem] rounded-full bg-glow-400/10 blur-[130px] [animation-delay:-8s]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_62%_50%_at_50%_44%,rgba(7,11,20,0.55)_0%,rgba(7,11,20,0)_100%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-b from-transparent to-ink-950"
        />

        <HeroCards />

        <div
          data-hero-content
          className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center text-center"
        >
          <h1
            id="hero-title"
            data-hero-title
            className="font-display text-4xl leading-[1.05] font-semibold tracking-tight text-white sm:text-5xl sm:leading-[0.98] md:text-6xl lg:text-[4.5rem] xl:text-display-xl xl:leading-(--text-display-xl--line-height)"
          >
            Designing{' '}
            <span className="text-gradient-glow-live [text-shadow:0_0_40px_rgba(0,210,255,0.25)]">
              intelligent systems
            </span>{' '}
            that move the world forward.
          </h1>

          <p
            data-hero-copy
            className="mt-8 max-w-xl text-base leading-relaxed text-mist sm:text-body-lg"
          >
            {heroContent.description}
          </p>

          <div
            data-hero-actions
            className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
          >
            <ElectricLink href={CONTACT_HREF} size="large">
              {heroContent.primaryCta}
            </ElectricLink>
            <SmartLink
              href={homeAnchor(SECTION_IDS.capabilities)}
              data-magnetic="0.3"
              className="group inline-flex min-h-11 items-center gap-2 px-3 py-3 text-base font-medium text-white transition-colors hover:text-brand"
            >
              <span className="link-underline">{heroContent.secondaryCta}</span>
              <ArrowRight
                aria-hidden="true"
                className="size-4 transition-transform duration-500 group-hover:translate-x-1"
              />
            </SmartLink>
          </div>
        </div>
      </div>

      {/* Compute cluster panel */}
      <div className="px-4 pb-16 sm:px-6 sm:pb-24 lg:px-12 xl:px-16">
        <div className="mx-auto max-w-[1440px]">
          <div
            data-hero-panel
            className="relative w-full overflow-hidden rounded-xl border border-glow-500/25 bg-ink-700 shadow-[0_0_35px_-5px_rgba(0,210,255,0.2)]"
          >
            <div
              data-hero-frame
              className="relative h-[280px] w-full overflow-hidden sm:h-[400px] md:h-[480px] lg:h-[540px]"
            >
              <div data-hero-media className="absolute inset-0">
                <img
                  data-hero-parallax
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  fetchPriority="high"
                  className="size-full scale-[1.12] object-cover object-center brightness-95 contrast-110"
                />
              </div>
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,11,20,0.1)_0%,rgba(7,11,20,0.85)_100%)]" />
              <div
                data-hero-overlay
                className="pointer-events-none absolute right-4 bottom-4 left-4 flex flex-wrap items-end justify-between gap-4 sm:right-6 sm:bottom-6 sm:left-6"
              >
                <div className="max-w-md rounded-xl border border-glow-500/35 bg-ink-glass/85 p-4 shadow-[0_10px_30px_rgba(0,0,0,0.6),0_0_20px_rgba(0,210,255,0.15)] backdrop-blur-md sm:p-5">
                  <p className="mb-1 text-sm font-semibold text-white sm:text-base">
                    {cluster.telemetry.title}
                  </p>
                  <p className="text-xs text-mist sm:text-body-sm">{cluster.telemetry.body}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
