import { QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

import { SmoothScrollProvider } from '@/animations/lenis';
import { MotionProvider } from '@/animations/motion/MotionProvider';
import { queryClient } from '@/lib/queryClient';

/** Composes every app-wide provider in one place. Order: data → motion → scroll. */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <MotionProvider>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </MotionProvider>
    </QueryClientProvider>
  );
}
