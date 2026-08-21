/**
 * Production Axios Instance
 * - No mock fallback
 * - JWT Bearer token attachment
 * - Silent token refresh on 401
 * - Exponential backoff retry on network errors (not auth errors)
 * - 90s timeout (Render cold start tolerance)
 * - ApiError class for typed error handling
 */
import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { tokenUtils } from '@/utils/tokenUtils';

// --- ApiError class ---
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://vilp-backend.onrender.com/api';
const cleanBase = rawBaseUrl.replace(/\/+$/, '');
const BASE_URL = cleanBase.endsWith('/api') ? cleanBase : `${cleanBase}/api`;
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 500;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 90_000,
  headers: { 'Content-Type': 'application/json' },
});

// Track whether a token refresh is currently in progress to avoid concurrent refresh calls
let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const refreshToken = tokenUtils.getRefreshToken();
  if (!refreshToken) throw new Error('No refresh token available');

  // Use raw fetch to avoid interceptor loop
  const response = await fetch(`${BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) throw new Error('Refresh failed');

  const body = await response.json();
  const { accessToken, refreshToken: newRefreshToken } = body.data;
  tokenUtils.setTokens(accessToken, newRefreshToken);
  return accessToken;
}

// --- Request interceptor: attach Bearer token ---
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenUtils.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Response interceptor: 401 refresh + retry + error mapping ---
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retryCount?: number; _isRetry?: boolean };

    const isAuthEndpoint =
      originalRequest.url?.includes('/auth/login') ||
      originalRequest.url?.includes('/auth/register') ||
      originalRequest.url?.includes('/auth/firebase-login') ||
      originalRequest.url?.includes('/auth/refresh');

    // 401 Unauthorized on authenticated routes — attempt token refresh once
    if (error.response?.status === 401 && !originalRequest._isRetry && !isAuthEndpoint) {
      originalRequest._isRetry = true;
      const currentRefreshToken = tokenUtils.getRefreshToken();

      // Only attempt refresh and dispatch session-expired if user had an active session
      if (currentRefreshToken) {
        try {
          if (!refreshPromise) {
            refreshPromise = refreshAccessToken().finally(() => {
              refreshPromise = null;
            });
          }
          const newToken = await refreshPromise;
          if (originalRequest.headers) {
            (originalRequest.headers as Record<string, string>).Authorization = `Bearer ${newToken}`;
          }
          return axiosInstance(originalRequest);
        } catch {
          tokenUtils.clearTokens();
          window.dispatchEvent(new CustomEvent('vilp:session-expired'));
          return Promise.reject(
            new ApiError(401, 'SESSION_EXPIRED', 'Your session has expired. Please log in again.')
          );
        }
      }
    }

    // Network error / timeout — retry with exponential backoff (not for 4xx)
    if (!error.response && !originalRequest._isRetry) {
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
      if (originalRequest._retryCount <= MAX_RETRIES) {
        const delay = RETRY_DELAY_MS * Math.pow(2, originalRequest._retryCount - 1);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return axiosInstance(originalRequest);
      }
    }

    // Map Axios error to typed ApiError
    if (error.response) {
      const data = error.response.data as { message?: string; errorCode?: string; error?: string } | undefined;
      const status = error.response.status;
      const code = data?.errorCode || data?.error || `HTTP_${status}`;
      const message = data?.message || error.message || 'An unexpected error occurred';
      return Promise.reject(new ApiError(status, code, message));
    }

    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      return Promise.reject(new ApiError(0, 'REQUEST_TIMEOUT', 'The server is taking too long to respond. Please try again.'));
    }

    return Promise.reject(new ApiError(0, 'NETWORK_ERROR', 'Unable to connect to the server. Please check your internet connection.'));
  }
);

export default axiosInstance;
