import { useRef } from 'react';

import { createResponsiveAnimation, gsap, useGSAP } from '@/animations/gsap';

/** Interactive elements the cursor ring reacts to. */
const INTERACTIVE = 'a, button, [role="button"], [data-magnetic]';
const TEXT_INPUT = 'input, textarea, select';

const MAGNET_DEFAULT_STRENGTH = 0.3;
const TILT_MAX_DEGREES = 6;

/**
 * Page-wide pointer effects, mounted once. A single passive `pointermove` listener drives:
 *
 * - **Cursor ring**: a blend-mode ring trailing the pointer; it swells over interactive
 *   elements, and hides over text fields and `[data-cursor="hide"]` areas (which run their
 *   own cursor visuals). The native cursor is kept for accessibility.
 * - **Magnetic pull**: `[data-magnetic]` elements (optional strength, e.g. `data-magnetic="0.4"`)
 *   lean towards the pointer and spring back on leave.
 * - **3D tilt + spotlight**: `[data-tilt]` cards rotate subtly towards the pointer and expose
 *   `--spot-x`/`--spot-y`/`--spot-opacity` for the `.spotlight` glow (see styles/index.css).
 *
 * Everything is GSAP `quickTo`/`to` on transforms (no React state, no re-renders) and runs
 * only on fine pointers without reduced motion. Elements using these attributes must not
 * use CSS `transition-all`/`transition-transform`, or the CSS transition fights GSAP.
 */
export function PointerEffects() {
  const ringRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const ring = ringRef.current;
    if (!ring) return;

    createResponsiveAnimation(({ reduceMotion, isFinePointer }) => {
      if (reduceMotion || !isFinePointer) return undefined;

      gsap.set(ring, { xPercent: -50, yPercent: -50, autoAlpha: 0, scale: 1 });
      const ringX = gsap.quickTo(ring, 'x', { duration: 0.2, ease: 'power3.out' });
      const ringY = gsap.quickTo(ring, 'y', { duration: 0.2, ease: 'power3.out' });

      let ringVisible = false;
      let ringMode: 'default' | 'active' | 'hidden' = 'default';
      let magnet: HTMLElement | null = null;
      let tilt: HTMLElement | null = null;

      const setRingMode = (mode: typeof ringMode) => {
        if (mode === ringMode) return;
        ringMode = mode;
        gsap.to(ring, {
          scale: mode === 'active' ? 1.9 : 1,
          autoAlpha: mode === 'hidden' ? 0 : 1,
          backgroundColor: mode === 'active' ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0)',
          duration: 0.35,
          ease: 'power3.out',
          overwrite: 'auto',
        });
      };

      const releaseMagnet = (element: HTMLElement) => {
        gsap.to(element, {
          x: 0,
          y: 0,
          duration: 0.7,
          ease: 'elastic.out(1, 0.45)',
          overwrite: 'auto',
        });
      };

      const releaseTilt = (element: HTMLElement) => {
        gsap.to(element, {
          rotationX: 0,
          rotationY: 0,
          duration: 0.8,
          ease: 'power3.out',
          overwrite: 'auto',
        });
        element.style.setProperty('--spot-opacity', '0');
      };

      const onPointerMove = (event: PointerEvent) => {
        const { clientX, clientY } = event;
        const target = event.target instanceof Element ? event.target : null;

        // Cursor ring
        ringX(clientX);
        ringY(clientY);
        if (!ringVisible) {
          ringVisible = true;
          gsap.set(ring, { x: clientX, y: clientY });
          gsap.to(ring, { autoAlpha: 1, duration: 0.3 });
        }
        if (target?.closest(`${TEXT_INPUT}, [data-cursor="hide"]`)) setRingMode('hidden');
        else if (target?.closest(INTERACTIVE)) setRingMode('active');
        else setRingMode('default');

        // Magnetic pull, measured from the element's resting centre (current offset removed).
        const nextMagnet = target?.closest<HTMLElement>('[data-magnetic]') ?? null;
        if (nextMagnet !== magnet) {
          if (magnet) releaseMagnet(magnet);
          magnet = nextMagnet;
        }
        if (magnet) {
          const rect = magnet.getBoundingClientRect();
          const offsetX = Number(gsap.getProperty(magnet, 'x'));
          const offsetY = Number(gsap.getProperty(magnet, 'y'));
          const strength = Number(magnet.dataset.magnetic) || MAGNET_DEFAULT_STRENGTH;
          gsap.to(magnet, {
            x: (clientX - (rect.left - offsetX + rect.width / 2)) * strength,
            y: (clientY - (rect.top - offsetY + rect.height / 2)) * strength,
            duration: 0.45,
            ease: 'power3.out',
            overwrite: 'auto',
          });
        }

        // 3D tilt + spotlight
        const nextTilt = target?.closest<HTMLElement>('[data-tilt]') ?? null;
        if (nextTilt !== tilt) {
          if (tilt) releaseTilt(tilt);
          tilt = nextTilt;
        }
        if (tilt) {
          const rect = tilt.getBoundingClientRect();
          const px = gsap.utils.clamp(0, 1, (clientX - rect.left) / rect.width);
          const py = gsap.utils.clamp(0, 1, (clientY - rect.top) / rect.height);
          gsap.to(tilt, {
            rotationY: (px - 0.5) * TILT_MAX_DEGREES,
            rotationX: (0.5 - py) * TILT_MAX_DEGREES,
            transformPerspective: 1000,
            duration: 0.6,
            ease: 'power3.out',
            overwrite: 'auto',
          });
          tilt.style.setProperty('--spot-x', `${(px * 100).toFixed(1)}%`);
          tilt.style.setProperty('--spot-y', `${(py * 100).toFixed(1)}%`);
          tilt.style.setProperty('--spot-opacity', '1');
        }
      };

      const onPointerLeaveWindow = () => {
        ringVisible = false;
        gsap.to(ring, { autoAlpha: 0, duration: 0.3 });
        if (magnet) releaseMagnet(magnet);
        if (tilt) releaseTilt(tilt);
        magnet = null;
        tilt = null;
      };

      window.addEventListener('pointermove', onPointerMove, { passive: true });
      document.documentElement.addEventListener('pointerleave', onPointerLeaveWindow);

      return () => {
        window.removeEventListener('pointermove', onPointerMove);
        document.documentElement.removeEventListener('pointerleave', onPointerLeaveWindow);
        if (magnet) gsap.set(magnet, { x: 0, y: 0 });
        if (tilt) {
          gsap.set(tilt, { rotationX: 0, rotationY: 0 });
          tilt.style.setProperty('--spot-opacity', '0');
        }
      };
    });
  });

  return (
    <div
      ref={ringRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[100] hidden size-8 rounded-full border border-white/80 opacity-0 mix-blend-difference [@media(hover:hover)_and_(pointer:fine)]:block"
    />
  );
}
