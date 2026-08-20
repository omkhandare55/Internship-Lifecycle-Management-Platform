import { useState, useEffect, useRef } from 'react';

/**
 * Debounce hook — delays updating value until specified delay has passed without new inputs
 * Ideal for search bars, live keyword filtering, and ATS resume input.
 */
export function useDebounce<T>(value: T, delayMs: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delayMs]);

  return debouncedValue;
}

/**
 * Throttle hook — ensures a value / callback only updates at most once per interval
 * Ideal for window resize, scroll listeners, and rapid button clicks.
 */
export function useThrottle<T>(value: T, intervalMs: number = 300): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastExecuted = useRef<number>(Date.now());

  useEffect(() => {
    if (Date.now() >= lastExecuted.current + intervalMs) {
      lastExecuted.current = Date.now();
      setThrottledValue(value);
    } else {
      const timerId = setTimeout(() => {
        lastExecuted.current = Date.now();
        setThrottledValue(value);
      }, intervalMs);

      return () => clearTimeout(timerId);
    }
  }, [value, intervalMs]);

  return throttledValue;
}
