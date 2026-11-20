import { Link } from 'react-router';

import { Seo } from '@/components/common/Seo';
import { ROUTES } from '@/constants/routes';

export default function NotFoundPage() {
  return (
    <>
      <Seo
        title="Page not found"
        description="The page you are looking for does not exist."
        noIndex
      />
      <section className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6 text-center">
        <h1 className="text-2xl font-semibold">Page not found</h1>
        <Link to={ROUTES.home} className="underline">
          Go to homepage
        </Link>
      </section>
    </>
  );
}
