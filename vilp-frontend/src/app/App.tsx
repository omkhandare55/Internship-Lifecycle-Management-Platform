import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/routes';
import { queryClient } from '@/services/queryClient';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { SupportModal } from '@/components/SupportModal';
import { CookieConsentBanner } from '@/components/CookieConsentBanner';

/**
 * App root — TanStack Query + React Router providers.
 * Protected with Global React ErrorBoundary, Caching Strategy & Support Helpdesk.
 */
export function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} future={{ v7_startTransition: true }} />
        <SupportModal />
        <CookieConsentBanner />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
