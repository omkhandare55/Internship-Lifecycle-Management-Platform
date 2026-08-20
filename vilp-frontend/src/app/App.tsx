import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/routes';
import { queryClient } from '@/services/queryClient';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { SupportModal } from '@/components/SupportModal';
import { CookieConsentBanner } from '@/components/CookieConsentBanner';
import { SessionExpiredModal } from '@/components/SessionExpiredModal';

/**
 * App root — TanStack Query + React Router providers.
 * Protected with Global React ErrorBoundary, Caching Strategy & Support Helpdesk.
 * SessionExpiredModal handles JWT expiry → forced re-auth flow globally.
 */
export function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} future={{ v7_startTransition: true }} />
        <SessionExpiredModal />
        <SupportModal />
        <CookieConsentBanner />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

