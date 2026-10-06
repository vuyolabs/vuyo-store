import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { persistStorage, STORAGE_KEYS } from '@/lib/storage';

interface WishlistState {
  ids: string[];
  toggle: (productId: string) => boolean;
  remove: (productId: string) => void;
  clear: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      /** Returns `true` when the product is now saved. */
      toggle: (productId) => {
        const saved = get().ids.includes(productId);
        set({ ids: saved ? get().ids.filter((id) => id !== productId) : [productId, ...get().ids] });
        return !saved;
      },
      remove: (productId) => set((state) => ({ ids: state.ids.filter((id) => id !== productId) })),
      clear: () => set({ ids: [] }),
    }),
    { name: STORAGE_KEYS.wishlist, storage: persistStorage, version: 1 },
  ),
);

export function useIsWishlisted(productId: string) {
  return useWishlistStore((s) => s.ids.includes(productId));
}
