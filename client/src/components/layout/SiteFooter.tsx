import { SmartLink } from '@/components/common/SmartLink';
import { SocialIcon } from '@/components/ui/SocialIcon';
import { COMPANY, SOCIAL_LINKS } from '@/constants/company';
import { FOOTER_NAV } from '@/constants/navigation';
import { useIsActiveHref } from '@/hooks/useIsActiveHref';
import { cn } from '@/utils/cn';

export function SiteFooter() {
  const isActive = useIsActiveHref();

  return (
    <footer className="bg-ink-800 p-6 text-white sm:p-10 md:p-12 lg:p-20">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="flex flex-col justify-between space-y-6 sm:space-y-10 lg:col-span-5 lg:pr-12">
          <p className="max-w-sm text-xs leading-relaxed text-haze/70 sm:text-[13px]">
            {COMPANY.summary}
          </p>
          <div className="space-y-3">
            <span className="block text-xs text-haze/60">Visit us on:</span>
            <ul className="flex items-center gap-3">
              {SOCIAL_LINKS.map((social) => (
                <li key={social.id}>
                  <a
                    href={social.href}
                    aria-label={social.label}
                    data-magnetic="0.4"
                    className="flex size-10 items-center justify-center rounded-pill border border-white/20 text-white/80 transition-colors hover:border-white hover:text-white"
                  >
                    <SocialIcon id={social.id} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <nav
          aria-label="Footer"
          className="grid grid-cols-2 gap-6 sm:grid-cols-3 sm:gap-8 lg:col-span-7"
        >
          {FOOTER_NAV.map((group, index) => (
            <div
              key={group.title}
              className={cn(
                'space-y-4',
                index === FOOTER_NAV.length - 1 && 'col-span-2 sm:col-span-1',
              )}
            >
              <h2 className="text-[13px] font-medium text-haze/60">{group.title}</h2>
              <ul className="space-y-3 text-[13px] text-white/90">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <SmartLink
                      href={link.href}
                      className={cn(
                        'link-underline inline-block py-1 transition-colors hover:text-white',
                        isActive(link.href) && 'underline decoration-white/60 underline-offset-4',
                      )}
                    >
                      {link.label}
                    </SmartLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <p className="mt-6 pt-12 text-center text-xs text-haze/60 sm:pt-16">
        Copyright © {new Date().getFullYear()} {COMPANY.name}. All Rights Reserved.
      </p>
    </footer>
  );
}
