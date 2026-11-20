import { Menu, User, X } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Link } from 'react-router';

import { LogoMark } from '@/components/common/Logo';
import { SmartLink } from '@/components/common/SmartLink';
import { ElectricLink } from '@/components/ui/ElectricLink';
import { COMPANY } from '@/constants/company';
import { CONTACT_HREF, PRIMARY_NAV } from '@/constants/navigation';
import { ROUTES } from '@/constants/routes';
import { useIsActiveHref } from '@/hooks/useIsActiveHref';
import { cn } from '@/utils/cn';

import { MobileNav } from './MobileNav';

const MOBILE_NAV_ID = 'mobile-nav';

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);
  const isActive = useIsActiveHref();

  return (
    <header className="fixed top-0 z-50 w-full border-b border-glow-500/18 bg-ink-950/85 shadow-[0_4px_30px_rgba(0,0,0,0.5)] backdrop-blur-[16px]">
      <div className="flex h-20 w-full items-center justify-between px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <Link
          to={ROUTES.home}
          onClick={closeMenu}
          className="flex items-center gap-4 text-white"
          aria-label={`${COMPANY.name} home`}
        >
          <LogoMark />
          <span className="font-display text-sm font-semibold tracking-wider text-fog">
            {COMPANY.name}
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-6 lg:flex xl:gap-8">
          {PRIMARY_NAV.map((link) => {
            const active = isActive(link.href);
            return (
              <SmartLink
                key={link.label}
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'border-b-2 py-2 transition-colors',
                  active
                    ? 'border-glow-500 font-display text-sm font-semibold text-white [text-shadow:0_0_12px_rgba(0,210,255,0.5)]'
                    : 'border-transparent text-body-sm text-haze hover:text-fog',
                )}
              >
                {link.label}
              </SmartLink>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <ElectricLink href={CONTACT_HREF} size="compact" className="hidden sm:inline-flex">
            Get in Touch
          </ElectricLink>
          <span
            aria-hidden="true"
            className="flex size-10 shrink-0 items-center justify-center rounded-pill border border-glow-400/50 bg-[linear-gradient(135deg,rgba(0,163,255,0.2),rgba(0,229,255,0.4))] shadow-[0_0_12px_rgba(0,229,255,0.25)]"
          >
            <User className="size-5 text-white" strokeWidth={1.75} />
          </span>
          <button
            type="button"
            aria-controls={MOBILE_NAV_ID}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
            onClick={() => {
              setMenuOpen((open) => !open);
            }}
            className="flex size-11 cursor-pointer items-center justify-center rounded-lg border border-white/10 text-white transition-colors hover:bg-white/5 lg:hidden"
          >
            {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      <MobileNav id={MOBILE_NAV_ID} open={menuOpen} onClose={closeMenu} />
    </header>
  );
}
