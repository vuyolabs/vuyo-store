import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { promoCodes } from '@/data/store-info';
import { persistStorage, STORAGE_KEYS } from '@/lib/storage';

export const MAX_QUANTITY = 10;

export interface CartItem {
  /** Unique per product + variant combination. */
  key: string;
  productId: string;
  color: string;
  size?: string;
  quantity: number;
  addedAt: number;
}

interface AddItemInput {
  productId: string;
  color: string;
  size?: string;
  quantity?: number;
}

interface CartState {
  items: CartItem[];
  promoCode?: string;
  addItem: (input: AddItemInput) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  applyPromo: (code: string) => boolean;
  clearPromo: () => void;
  clear: () => void;
}

export function variantKey(productId: string, color: string, size?: string) {
  return [productId, color, size ?? '—'].join('::');
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      promoCode: undefined,

      addItem: ({ productId, color, size, quantity = 1 }) =>
        set((state) => {
          const key = variantKey(productId, color, size);
          const existing = state.items.find((i) => i.key === key);
          if (existing) {
            return {
              items: state.items.map((i) => (i.key === key ? { ...i, quantity: Math.min(i.quantity + quantity, MAX_QUANTITY) } : i)),
            };
          }
          return { items: [{ key, productId, color, size, quantity, addedAt: Date.now() }, ...state.items] };
        }),

      removeItem: (key) => set((state) => ({ items: state.items.filter((i) => i.key !== key) })),

      updateQuantity: (key, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.key !== key)
              : state.items.map((i) => (i.key === key ? { ...i, quantity: Math.min(quantity, MAX_QUANTITY) } : i)),
        })),

      applyPromo: (code) => {
        const normalized = code.trim().toUpperCase();
        if (!promoCodes[normalized]) return false;
        set({ promoCode: normalized });
        return true;
      },

      clearPromo: () => set({ promoCode: undefined }),

      clear: () => set({ items: [], promoCode: undefined }),
    }),
    { name: STORAGE_KEYS.cart, storage: persistStorage, version: 1 },
  ),
);

export const selectBagCount = (state: CartState) => state.items.reduce((sum, i) => sum + i.quantity, 0);
