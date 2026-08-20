import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useQueryClient } from '@tanstack/react-query';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { tokenUtils } from '@/utils/tokenUtils';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Hook that establishes an SSE connection to receive real-time notifications.
 * Automatically reconnects on disconnect. Invalidates notification queries
 * when a new event arrives so the UI updates.
 *
 * Uses @microsoft/fetch-event-source to support custom Authorization headers
 * (standard EventSource API does not support custom headers).
 */
export function useNotificationStream() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const queryClient = useQueryClient();
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const accessToken = tokenUtils.getAccessToken();
    if (!isAuthenticated || !accessToken) return;

    const abortController = new AbortController();
    controllerRef.current = abortController;

    const connectSSE = async () => {
      try {
        await fetchEventSource(`${API_BASE_URL}/notifications/stream`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          signal: abortController.signal,
          openWhenHidden: true, // Keep connection alive when tab is hidden

          onopen: async (response) => {
            if (response.ok) {
              console.debug('[SSE] Connected to notification stream');
            } else if (response.status === 401) {
              // Token expired — stop reconnecting
              throw new Error('Unauthorized');
            }
          },

          onmessage: (event) => {
            if (event.event === 'notification') {
              // Invalidate notification queries so UI refreshes
              queryClient.invalidateQueries({ queryKey: ['notifications'] });
              queryClient.invalidateQueries({ queryKey: ['unreadNotificationCount'] });
            }
            // 'connected' events are just heartbeats — ignore
          },

          onerror: (err) => {
            console.debug('[SSE] Connection error, will retry:', err);
            // Returning nothing causes automatic retry with backoff
            // Throwing would stop retrying
            if (err instanceof Error && err.message === 'Unauthorized') {
              throw err; // Stop retrying on auth failure
            }
          },
        });
      } catch {
        // Connection closed or auth failure — do nothing
      }
    };

    connectSSE();

    return () => {
      abortController.abort();
      controllerRef.current = null;
    };
  }, [isAuthenticated, queryClient]);
}
