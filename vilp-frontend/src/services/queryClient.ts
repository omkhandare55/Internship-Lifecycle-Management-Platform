import { QueryClient } from '@tanstack/react-query';
import { ApiError } from '@/services/axiosInstance';

/**
 * Production Query Client Configuration
 * - Stale Time: 5 minutes — zero redundant network requests within window
 * - GC Time: 10 minutes — cache retention
 * - Smart retry: skips retry for 4xx client errors, only retries on server/network errors
 * - ApiError-aware retry logic (works with new typed error system)
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: (failureCount, error: unknown) => {
        // Never retry on auth, forbidden, or not-found errors
        if (error instanceof ApiError) {
          if (error.status === 401 || error.status === 403 || error.status === 404) {
            return false;
          }
          // Don't retry any other client errors (4xx)
          if (error.status >= 400 && error.status < 500) {
            return false;
          }
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
