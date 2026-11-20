import { AnimatePresence, m } from 'motion/react';
import { useEffect } from 'react';

import { transitions } from '@/animations/motion';
import { SmartLink } from '@/components/common/SmartLink';
import { ElectricLink } from '@/components/ui/ElectricLink';
import { CONTACT_HREF, PRIMARY_NAV } from '@/constants/navigation';
import { useIsActiveHref } from '@/hooks/useIsActiveHref';
import { cn } from '@/utils/cn';

interface MobileNavProps {
  id: string;
  open: boolean;
  onClose: () => void;
}

/** Drop-down navigation below the header on < lg screens. */
export function MobileNav({ id, open, onClose }: MobileNavProps) {
  const isActive = useIsActiveHref();

  // Close on Escape while open (subscribing to a global keyboard event).
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <m.div
          id={id}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={transitions.fast}
          className="border-b border-white/10 bg-ink-950/98 px-4 py-6 backdrop-blur-xl sm:px-6 lg:hidden"
        >
          <nav aria-label="Mobile" className="flex flex-col gap-4">
            {PRIMARY_NAV.map((link) => {
              const active = isActive(link.href);
              return (
                <SmartLink
                  key={link.label}
                  href={link.href}
                  onClick={onClose}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'flex min-h-11 items-center px-3 py-2 text-base',
                    active
                      ? 'rounded-r border-l-2 border-glow-500 bg-white/[0.04] font-display font-semibold text-white'
                      : 'text-haze transition-colors hover:text-white',
                  )}
                >
                  {link.label}
                </SmartLink>
              );
            })}
            <div className="mt-2 border-t border-white/10 pt-4">
              <ElectricLink
                href={CONTACT_HREF}
                size="compact"
                onClick={onClose}
                className="w-full py-3 text-xs tracking-wider"
              >
                Get in Touch
              </ElectricLink>
            </div>
          </nav>
        </m.div>
      )}
    </AnimatePresence>
  );
}
