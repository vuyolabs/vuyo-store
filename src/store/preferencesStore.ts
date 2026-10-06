import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { demoAddresses } from '@/data/orders';
import type { Address } from '@/data/types';
import { persistStorage, STORAGE_KEYS } from '@/lib/storage';

const MAX_RECENT_SEARCHES = 6;

export interface NotificationPreferences {
  orderUpdates: boolean;
  newArrivals: boolean;
  offers: boolean;
  restocks: boolean;
}

export interface SizePreferences {
  clothing?: string;
  shoes?: string;
}

interface PreferencesState {
  hasOnboarded: boolean;
  recentSearches: string[];
  sizes: SizePreferences;
  notifications: NotificationPreferences;
  addresses: Address[];
  defaultAddressId: string;

  completeOnboarding: () => void;
  addRecentSearch: (query: string) => void;
  removeRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  setSize: (kind: keyof SizePreferences, size: string | undefined) => void;
  setNotification: (key: keyof NotificationPreferences, value: boolean) => void;
  addAddress: (address: Address) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      hasOnboarded: false,
      recentSearches: [],
      sizes: { clothing: 'M', shoes: '9' },
      notifications: { orderUpdates: true, newArrivals: true, offers: false, restocks: true },
      addresses: demoAddresses,
      defaultAddressId: demoAddresses[0].id,

      completeOnboarding: () => set({ hasOnboarded: true }),

      addRecentSearch: (query) =>
        set((state) => {
          const q = query.trim();
          if (!q) return state;
          const rest = state.recentSearches.filter((s) => s.toLowerCase() !== q.toLowerCase());
          return { recentSearches: [q, ...rest].slice(0, MAX_RECENT_SEARCHES) };
        }),
      removeRecentSearch: (query) => set((state) => ({ recentSearches: state.recentSearches.filter((s) => s !== query) })),
      clearRecentSearches: () => set({ recentSearches: [] }),

      setSize: (kind, size) => set((state) => ({ sizes: { ...state.sizes, [kind]: size } })),
      setNotification: (key, value) => set((state) => ({ notifications: { ...state.notifications, [key]: value } })),

      addAddress: (address) => set((state) => ({ addresses: [...state.addresses, address], defaultAddressId: address.id })),
      removeAddress: (id) =>
        set((state) => {
          const addresses = state.addresses.filter((a) => a.id !== id);
          const defaultAddressId = state.defaultAddressId === id ? (addresses[0]?.id ?? '') : state.defaultAddressId;
          return { addresses, defaultAddressId };
        }),
      setDefaultAddress: (id) => set({ defaultAddressId: id }),
    }),
    { name: STORAGE_KEYS.preferences, storage: persistStorage, version: 1 },
  ),
);
