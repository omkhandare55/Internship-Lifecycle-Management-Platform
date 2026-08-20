import { QueryClient } from '@tanstack/react-query';

/**
 * Enterprise Query Client Configuration
 * - Stale Time: 5 Minutes (Zero redundant network requests within window)
 * - GC Time: 10 Minutes (Garbage collection cache retention)
 * - Exponential backoff retry logic (up to 2 retries for transient network drops)
 * - Refetch on window focus enabled only for critical states
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes fresh data
      gcTime: 1000 * 60 * 10,   // 10 minutes cache retention
      retry: (failureCount, error: any) => {
        // Do not retry on 401 Unauthorized or 404 Not Found
        const status = error?.response?.status;
        if (status === 401 || status === 403 || status === 404) {
          return false;
        }
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 0,
    },
  },
});
