import { cn } from '@/utils/cn';

/** HALCER "H" mark. Decorative: pair it with the visible wordmark or an aria-label. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('size-8 shrink-0', className)}
    >
      <path
        d="M79.1797 85.9258L59.8366 85.9258L59.8366 15.0012L71.7139 15.0012C75.8371 15.0012 79.1797 18.3438 79.1797 22.467L79.1797 85.9258Z"
        fill="currentColor"
      />
      <path
        d="M21 15H40.3431V85.9246H28.4658C24.3426 85.9246 21 82.582 21 78.4588V15Z"
        fill="currentColor"
      />
      <path
        d="M9.63357 60.7411C8.73137 57.3741 10.7295 53.9132 14.0966 53.011L82.6844 34.6329C86.0514 33.7307 89.5123 35.7289 90.4145 39.0959C91.3167 42.463 89.3186 45.9239 85.9515 46.8261L17.3637 65.2041C13.9967 66.1063 10.5358 64.1081 9.63357 60.7411Z"
        fill="currentColor"
      />
    </svg>
  );
}
