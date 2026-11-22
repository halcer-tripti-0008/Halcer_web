import { DISTANCE, DURATION, STAGGER } from '../tokens';
import { createResponsiveAnimation } from './responsive';
import { gsap, GSAP_EASE, ScrollTrigger, SplitText } from './setup';

export type RevealMode = 'block' | 'stagger';

/** Where a block starts revealing: when its top passes 85% of the viewport height. */
const START = 'top 85%';

/**
 * Scroll-triggered reveal for one block (used by <Reveal> and <RevealGroup>).
 *
 * - `block`:   direct children fade up out of a soft blur, in sequence.
 * - `stagger`: direct children (cards) rise and tip forward in 3D, in sequence.
 *
 * Descendants opt into richer effects with data attributes:
 * - `data-reveal="lines"` (headings): every line rises out of its own mask (SplitText).
 * - `data-reveal="media"` (image frames): a clip-path wipe opens upwards while the image
 *   inside settles from a zoom.
 *
 * Performance: one ScrollTrigger per block, fired once and then discarded. Lines are split
 * at reveal time (fonts are loaded by then) and the split is reverted afterwards, so text
 * returns to normal DOM and reflows freely on resize. Blur only runs on desktop.
 * Reduced motion: nothing is hidden or animated.
 */
export function revealBlock(root: HTMLElement, mode: RevealMode) {
  return createResponsiveAnimation(({ reduceMotion, isDesktop }) => {
    if (reduceMotion) return undefined;

    // Children that run their own reveal (masked lines / image wipe) are not faded as well.
    const items = (Array.from(root.children) as HTMLElement[]).filter(
      (child) => child.dataset.reveal === undefined,
    );
    const lines = gsap.utils.toArray<HTMLElement>('[data-reveal="lines"]', root);
    const media = gsap.utils.toArray<HTMLElement>('[data-reveal="media"]', root);
    const mediaContent = media
      .map((frame) => frame.querySelector<HTMLElement>('img, [role="img"]'))
      .filter((element): element is HTMLElement => element !== null);

    // Hidden start states are applied before first paint (useGSAP runs in a layout effect).
    if (items.length === 0) {
      // Nothing to fade: every child runs its own reveal.
    } else if (mode === 'stagger') {
      gsap.set(items, {
        autoAlpha: 0,
        y: DISTANCE.lg,
        rotationX: 7,
        transformPerspective: 1200,
        transformOrigin: '50% 100%',
      });
    } else {
      gsap.set(items, {
        autoAlpha: 0,
        y: DISTANCE.md,
        filter: isDesktop ? 'blur(10px)' : 'none',
      });
    }
    // GSAP warns when handed an empty target list, so only touch what exists.
    if (lines.length > 0) gsap.set(lines, { autoAlpha: 0 });
    if (media.length > 0) gsap.set(media, { clipPath: 'inset(100% 0% 0% 0%)' });
    if (mediaContent.length > 0) gsap.set(mediaContent, { scale: 1.25 });

    // Parallax: images drift inside their frame while it crosses the viewport (desktop).
    // The image is oversized in markup, so the frame never shows an edge.
    if (isDesktop) {
      for (const image of gsap.utils.toArray<HTMLElement>('[data-parallax]', root)) {
        gsap.fromTo(
          image,
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: 'none',
            scrollTrigger: {
              trigger: image.parentElement,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        );
      }
    }

    const splits: ReturnType<typeof SplitText.create>[] = [];

    const play = () => {
      const timeline = gsap.timeline({
        defaults: { ease: GSAP_EASE.out },
        onComplete: () => {
          // Back to plain DOM: no line wrappers, no lingering transforms/filters.
          for (const split of splits) split.revert();
          if (items.length > 0) gsap.set(items, { clearProps: 'transform,filter' });
          if (media.length > 0) gsap.set(media, { clearProps: 'clipPath' });
        },
      });

      if (items.length > 0) {
        timeline.to(
          items,
          {
            autoAlpha: 1,
            y: 0,
            rotationX: 0,
            filter: 'blur(0px)',
            duration: mode === 'stagger' ? DURATION.slower : DURATION.slow,
            stagger: mode === 'stagger' ? STAGGER.loose : STAGGER.base,
          },
          0,
        );
      }

      lines.forEach((heading, index) => {
        const split = SplitText.create(heading, {
          type: 'lines',
          mask: 'lines',
          linesClass: 'split-line',
        });
        splits.push(split);
        gsap.set(heading, { autoAlpha: 1 });
        timeline.from(
          split.lines,
          { yPercent: 135, duration: DURATION.slower, stagger: STAGGER.base },
          0.05 + index * 0.12,
        );
      });

      media.forEach((frame, index) => {
        timeline.to(
          frame,
          { clipPath: 'inset(0% 0% 0% 0%)', duration: DURATION.slower, ease: GSAP_EASE.inOut },
          0.1 + index * 0.12,
        );
      });
      if (mediaContent.length > 0) timeline.to(mediaContent, { scale: 1, duration: 1.6 }, 0.1);
    };

    ScrollTrigger.create({
      trigger: root,
      start: START,
      // Active from START to the end of the page, so blocks already scrolled past on load
      // (e.g. arriving via #contact) still reveal instead of staying hidden.
      endTrigger: document.documentElement,
      end: 'bottom bottom',
      once: true,
      onEnter: play,
    });

    return () => {
      for (const split of splits) split.revert();
    };
  });
}
