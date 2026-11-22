import { createResponsiveAnimation } from './responsive';
import { gsap, GSAP_EASE } from './setup';

/**
 * Cursor-following image preview for a list of rows (desktop, fine pointer only).
 *
 * - `list`: contains rows marked `data-preview-index="<n>"`.
 * - `preview`: a `position: fixed` element containing frames marked `data-preview-frame`,
 *   in the same order as the rows. It must not sit inside a transformed/filtered ancestor.
 *
 * The preview trails the pointer with a soft spring, tilts with horizontal velocity and
 * settles upright when the pointer rests. Moving between rows crossfades the frames;
 * leaving the list scales the preview away. Nothing runs on touch or with reduced motion.
 */
export function cursorPreview(list: HTMLElement, preview: HTMLElement) {
  return createResponsiveAnimation(({ reduceMotion, isFinePointer, isDesktop }) => {
    if (reduceMotion || !isFinePointer || !isDesktop) return undefined;

    const frames = gsap.utils.toArray<HTMLElement>('[data-preview-frame]', preview);
    gsap.set(preview, { xPercent: -50, yPercent: -50, autoAlpha: 0, scale: 0.6 });
    gsap.set(frames, { autoAlpha: 0, scale: 1.15 });

    const moveX = gsap.quickTo(preview, 'x', { duration: 0.75, ease: 'power3.out' });
    const moveY = gsap.quickTo(preview, 'y', { duration: 0.75, ease: 'power3.out' });
    const lean = gsap.quickTo(preview, 'rotation', { duration: 0.9, ease: 'power3.out' });
    const settle = gsap
      .delayedCall(0.12, () => {
        lean(0);
      })
      .pause();

    let activeIndex = -1;
    let visible = false;
    let lastX = 0;

    const showFrame = (index: number) => {
      if (index === activeIndex) return;
      activeIndex = index;
      frames.forEach((frame, frameIndex) => {
        const isActive = frameIndex === index;
        gsap.to(frame, {
          autoAlpha: isActive ? 1 : 0,
          scale: isActive ? 1 : 1.08,
          duration: isActive ? 0.6 : 0.45,
          ease: GSAP_EASE.out,
          overwrite: 'auto',
        });
      });
      if (!visible) {
        visible = true;
        gsap.to(preview, {
          autoAlpha: 1,
          scale: 1,
          duration: 0.6,
          ease: GSAP_EASE.out,
          overwrite: 'auto',
        });
      }
    };

    const hide = () => {
      activeIndex = -1;
      visible = false;
      gsap.to(preview, {
        autoAlpha: 0,
        scale: 0.6,
        duration: 0.45,
        ease: GSAP_EASE.in,
        overwrite: 'auto',
      });
    };

    const onPointerMove = (event: PointerEvent) => {
      const row =
        event.target instanceof Element
          ? event.target.closest<HTMLElement>('[data-preview-index]')
          : null;

      // Appear exactly under the pointer instead of flying in from the last position.
      if (!visible) gsap.set(preview, { x: event.clientX, y: event.clientY });
      moveX(event.clientX);
      moveY(event.clientY);
      lean(gsap.utils.clamp(-10, 10, (event.clientX - lastX) * 0.6));
      lastX = event.clientX;
      settle.restart(true);

      if (row) showFrame(Number(row.dataset.previewIndex));
    };

    list.addEventListener('pointermove', onPointerMove, { passive: true });
    list.addEventListener('pointerleave', hide);

    return () => {
      list.removeEventListener('pointermove', onPointerMove);
      list.removeEventListener('pointerleave', hide);
      settle.kill();
    };
  });
}
