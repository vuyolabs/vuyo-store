import { useEffect, useMemo, useState } from 'react';

import { useCartStore } from '@/store/cartStore';

import { summarizeBag } from './pricing';

/** Live bag contents joined with product data and totals. */
export function useBagSummary() {
  const items = useCartStore((s) => s.items);
  const promoCode = useCartStore((s) => s.promoCode);
  return useMemo(() => summarizeBag(items, promoCode), [items, promoCode]);
}

const visited = new Set<string>();

/**
 * Simulates network latency the first time a screen (or a given key) is shown,
 * so skeleton states are part of the experience. Subsequent visits are instant.
 */
export function useSimulatedLoading(key: string, duration = 750) {
  const [loading, setLoading] = useState(() => !visited.has(key));

  useEffect(() => {
    if (!loading) return;
    const timer = setTimeout(() => {
      visited.add(key);
      setLoading(false);
    }, duration);
    return () => clearTimeout(timer);
  }, [key, duration, loading]);

  return loading;
}

export function useDebouncedValue<T>(value: T, delay = 200) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}
