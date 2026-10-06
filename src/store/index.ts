import { useEffect, useState } from 'react';

import { useCartStore } from './cartStore';
import { useOrderStore } from './orderStore';
import { usePreferencesStore } from './preferencesStore';
import { useWishlistStore } from './wishlistStore';

export { useCartStore, selectBagCount, MAX_QUANTITY } from './cartStore';
export type { CartItem } from './cartStore';
export { useWishlistStore, useIsWishlisted } from './wishlistStore';
export { useOrderStore, useOrder } from './orderStore';
export { usePreferencesStore } from './preferencesStore';
export { useCheckoutStore } from './checkoutStore';
export { useUIStore } from './uiStore';

const persisted = [useCartStore, useWishlistStore, useOrderStore, usePreferencesStore];

function allHydrated() {
  return persisted.every((store) => store.persist.hasHydrated());
}

/** True once every AsyncStorage-backed store has rehydrated. */
export function useStoresHydrated() {
  const [hydrated, setHydrated] = useState(allHydrated);

  useEffect(() => {
    if (hydrated) return;
    const update = () => {
      if (allHydrated()) setHydrated(true);
    };
    const unsubscribers = persisted.map((store) => store.persist.onFinishHydration(update));
    update();
    return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
  }, [hydrated]);

  return hydrated;
}
