import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * tailwind-merge must know the design system's custom tokens; otherwise it mistakes
 * e.g. `text-body-sm` (a font size) for a text colour and silently drops it when a
 * colour class like `text-haze` follows. Keep in sync with @theme in styles/index.css.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: [
        'display-xl',
        'display-lg',
        'headline-xl',
        'headline-lg',
        'headline-md',
        'body-lg',
        'body-md',
        'body-sm',
        'label-caps',
      ],
      radius: ['pill'],
    },
  },
});

/** Compose conditional class names and resolve conflicting Tailwind utilities (last wins). */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
