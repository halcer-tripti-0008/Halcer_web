# Animation Architecture

How GSAP, Motion and Lenis coexist in this codebase, and the rules that keep them from conflicting.

## 1. Responsibilities

| Need                                                                                                        | Use                                        |
| ----------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| Smooth scrolling                                                                                            | Lenis (already running, never instantiate) |
| Anything tied to scroll position: reveal on enter, parallax, pinning, scrubbing, horizontal scroll sections | GSAP + ScrollTrigger                       |
| Multi-step choreographed timelines, SVG/path, text splitting                                                | GSAP                                       |
| Mount/unmount animations (`AnimatePresence`), page transitions                                              | Motion                                     |
| Hover / tap / focus micro-interactions                                                                      | Motion (`whileHover`, `whileTap`)          |
| Animations driven by React state (open/closed, active tab)                                                  | Motion                                     |
| Simple colour/opacity hover with no physics                                                                 | CSS transitions (cheapest)                 |

If both could work, prefer **Motion for state** and **GSAP for scroll and time**.

## 2. How the pieces are wired

```
                       ┌──────────────── gsap.ticker (one RAF loop) ───────────────┐
                       │                                                            │
 wheel/keys ──► Lenis.raf(time) ──► window.scrollTo ──► 'scroll' ──► ScrollTrigger.update()
                                         │
                                         └──► native scroll event ──► Motion useScroll / useInView
```

- `animations/gsap/setup.ts` registers `useGSAP`, `ScrollTrigger`, `CustomEase` **once** (ES module evaluation is idempotent, so Strict Mode can't double-register), creates the shared eases and sets defaults.
- `animations/lenis/smoothScroll.ts` holds a **module-level singleton**. `SmoothScrollProvider` (mounted once in `AppProviders`) calls `initSmoothScroll()` in an effect and returns its teardown. Under Strict Mode's mount → unmount → mount, the instance is destroyed and recreated, and there is never more than one.
- Lenis runs with `autoRaf: false` and is advanced from `gsap.ticker`. `lagSmoothing(0)` prevents GSAP from "catching up" time after a dropped frame, which would make Lenis jump.
- Lenis moves the **real window scroll position**, so ScrollTrigger uses its default scroller and Motion's scroll hooks work unchanged. Do not configure `scrollerProxy`.
- `RouteScrollManager` resets scroll (or scrolls to `#hash`) on navigation through Lenis. React Router's `<ScrollRestoration />` is intentionally not used, because it calls `window.scrollTo` behind Lenis's back.

## 3. Shared tokens

`animations/tokens.ts` is the single source of motion design: `DURATION`, `EASE` (cubic-bezier), `STAGGER`, `DISTANCE`.

- GSAP: `ease: GSAP_EASE.out` (registered as `halcer.out`). GSAP defaults are already `DURATION.base` + `halcer.out`.
- Motion: `transition={transitions.base}` or the variants in `animations/motion/variants.ts`.

When the Figma motion spec is defined, change the token values. Both libraries update together.

## 4. Writing GSAP animations

```tsx
import { useRef } from 'react';

import { createResponsiveAnimation, gsap, GSAP_EASE, useGSAP } from '@/animations/gsap';
import { DISTANCE, STAGGER } from '@/animations/tokens';

export function ServicesSection() {
  const container = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      createResponsiveAnimation(({ isDesktop, reduceMotion }) => {
        if (reduceMotion) return; // content is visible by default; just don't animate

        gsap.from('[data-animate="card"]', {
          y: isDesktop ? DISTANCE.lg : DISTANCE.sm,
          autoAlpha: 0,
          stagger: STAGGER.base,
          ease: GSAP_EASE.out,
          scrollTrigger: { trigger: container.current, start: 'top 75%', once: true },
        });
      });
    },
    { scope: container },
  );

  return <section ref={container}>…</section>;
}
```

Rules:

1. **Always import from `@/animations/gsap`**, never from `gsap` directly. That guarantees plugins and eases are registered.
2. **Always use `useGSAP`** (not `useEffect`). It wraps your code in `gsap.context()` and calls `context.revert()` on unmount, which kills tweens, ScrollTriggers and matchMedia instances and restores inline styles. This makes animations correct under Strict Mode's double mount.
3. **Always pass `scope`.** Selector strings are then scoped to the component, so `.card` won't match cards elsewhere on the page.
4. **Event handlers** that create tweens after mount must be wrapped with `contextSafe` (returned by `useGSAP`) so they're cleaned up too.
5. **One ScrollTrigger per behaviour, not per element.** Prefer one trigger driving a staggered tween or timeline over N triggers. Use `ScrollTrigger.batch()` for long lists. Use `once: true` for reveal-only animations so the trigger is removed after it fires.
6. **Responsive values** come from `createResponsiveAnimation` (built on `gsap.matchMedia()`, breakpoints mirror Tailwind's). Animations re-run and clean up automatically when the breakpoint or reduced-motion preference changes.
7. **Layout changes** after mount (images loading, fonts swapping, accordions) can shift trigger positions. Set explicit image dimensions, and call `ScrollTrigger.refresh()` after deliberate layout changes.
8. **Pinning:** pin wrappers, not elements Motion animates, and avoid pinning inside `transform`ed ancestors.
9. Animate **`transform` and `opacity` only** (`x`, `y`, `scale`, `rotate`, `autoAlpha`). Avoid animating `width`, `height`, `top` or `left`.
10. **No FOUC:** for `from()` entrance animations, content is visible without JS and GSAP sets the start state synchronously inside `useGSAP` (it runs in a layout effect), so there's no flash.

## 5. Writing Motion animations

```tsx
import { m } from 'motion/react';

import { interactions, slideUp, staggerContainer } from '@/animations/motion';

export function FeatureList({ items }: { items: Feature[] }) {
  return (
    <m.ul
      variants={staggerContainer()}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {items.map((item) => (
        <m.li key={item.id} variants={slideUp()} whileHover={interactions.hoverLift}>
          …
        </m.li>
      ))}
    </m.ul>
  );
}
```

Rules:

1. **Use `m.*`, not `motion.*`.** The app uses `LazyMotion strict`, so `motion.div` throws. This keeps ~20 kB gzip of animation runtime out of the entry bundle.
2. Use the shared `variants` / `transitions`. Add new presets to `animations/motion/` rather than inlining magic numbers.
3. `domAnimation` features are loaded. If you need **layout animations (`layout` prop) or drag**, switch `animations/motion/features.ts` to `domMax` (larger, so only do it when needed).
4. **Page transitions:** wrap the routed content in `AnimatePresence mode="wait"` keyed by `location.pathname`, using `pageTransition` (opacity only, so it never fights scroll reset or shifts layout). Remember that `RouteScrollManager` resets scroll on pathname change.
5. Reduced motion is handled globally (`MotionConfig reducedMotion="user"`): transforms are skipped and opacity still animates.

## 6. Working with Lenis

```ts
import { scrollToTarget, useLenis } from '@/animations/lenis';

scrollToTarget('#contact'); // smooth, through Lenis
scrollToTarget(0, { immediate: true }); // instant

const lenis = useLenis(); // null until initialised
lenis?.stop(); // lock scroll (open modal / menu)
lenis?.start(); // unlock
```

Rules:

1. **Never** `new Lenis()` anywhere else, and never mount `SmoothScrollProvider` twice.
2. **Never** call `window.scrollTo` / `element.scrollIntoView` for app navigation. Use `scrollToTarget()` so Lenis's internal position stays in sync.
3. **Scroll lock** for modals/menus: `lenis.stop()` / `lenis.start()`. Don't toggle `overflow: hidden` on `<html>` manually.
4. **Nested scroll areas** (modal bodies, dropdowns, code blocks) need the `data-lenis-prevent` attribute, or Lenis will hijack their wheel events.
5. Don't add `scroll-behavior: smooth` in CSS (the base layer forces `auto`).
6. Touch devices use native scrolling (`syncTouch: false`), which is deliberate for feel and battery.

## 7. The homepage motion system (data attributes)

The homepage is animated declaratively: components stay plain markup and opt into effects with
attributes. All of it is GSAP + CSS; Motion is used only for the mobile menu.

| Attribute / class                             | Where it works                                            | Effect                                                                                                 |
| --------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `<Reveal>` / `<RevealGroup>` + `<RevealItem>` | wrappers                                                  | Children fade up from a soft blur (block) or rise with a slight 3D tip (card groups), once, on scroll  |
| `data-reveal="lines"`                         | headings inside a Reveal                                  | Each line rises out of its own mask (SplitText), reverted afterwards so text reflows normally          |
| `data-reveal="media"`                         | image frames inside a Reveal                              | Clip-path wipe opens upwards while the image settles from a zoom                                       |
| `data-parallax`                               | an oversized `<img>` inside a `data-reveal="media"` frame | Scroll-scrubbed drift (desktop). Oversize it in markup (e.g. `-top-[8%] h-[116%]`) so edges never show |
| `data-tilt` (+ `spotlight` class)             | cards                                                     | 3D tilt toward the pointer and a cursor-following glow                                                 |
| `data-magnetic="0.3"`                         | buttons/links                                             | Leans toward the pointer (the value is the strength), springs back                                     |
| `data-preview-index` + `cursorPreview()`      | list rows                                                 | A preview image follows the cursor (Capabilities)                                                      |
| `link-underline`, `shine` classes             | links / solid buttons                                     | Wipe-in underline; light sweep on hover                                                                |

Implementation lives in `animations/gsap/reveal.ts`, `animations/gsap/cursorPreview.ts` and
`components/animations/PointerEffects.tsx` (one passive `pointermove` listener drives the cursor
ring, magnetic pull and tilt; there is no React state, so the pointer never re-renders anything).

**Rules that keep these effects from fighting each other**

- Elements with `data-tilt` or `data-magnetic` must not use `transition-all` / `transition-transform`
  or Tailwind `scale-*` / `translate-*` / `rotate-*` classes: a CSS transition on the same property
  lags behind GSAP, and GSAP absorbs individual transform properties into its own matrix. Put hover
  movement on a _child_ element instead.
- Pointer effects run only on fine pointers without reduced motion (`isFinePointer` /
  `reduceMotion` in `createResponsiveAnimation`). Touch devices and reduced-motion users get the
  finished layout with nothing hidden or moving.
- Every block creates one ScrollTrigger that fires once and is discarded. Blocks already scrolled past
  (e.g. arriving via `#contact`) still reveal.
- Never hand GSAP an empty target list (it logs a warning): guard with `.length`.

## 8. Conflict checklist (review every animation PR)

- [ ] GSAP imported from `@/animations/gsap` and code lives inside `useGSAP` with `scope`
- [ ] No element has the same property animated by both GSAP and Motion (e.g. GSAP owns `y` on the wrapper, Motion owns `scale` on the child)
- [ ] No `requestAnimationFrame` loops, no second Lenis, no `scroll-behavior: smooth`
- [ ] No `scrollerProxy`, and ScrollTriggers use the default (window) scroller
- [ ] Reduced motion: GSAP code checks `reduceMotion`, and content is visible and usable without animation
- [ ] Only `transform`/`opacity` animated, with no layout thrash
- [ ] ScrollTriggers minimal (`once`, `batch`, one timeline instead of many triggers)
- [ ] Works after navigating away and back (no leaked triggers: `ScrollTrigger.getAll().length` stays stable)
