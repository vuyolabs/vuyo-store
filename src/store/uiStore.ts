import type { Href } from 'expo-router';
import { create } from 'zustand';

export interface Toast {
  id: number;
  title: string;
  message?: string;
  image?: string;
  action?: { label: string; href: Href };
}

interface UIState {
  toast?: Toast;
  showToast: (toast: Omit<Toast, 'id'>) => void;
  hideToast: (id: number) => void;
}

let counter = 0;

export const useUIStore = create<UIState>()((set, get) => ({
  toast: undefined,
  showToast: (toast) => {
    counter += 1;
    set({ toast: { ...toast, id: counter } });
  },
  hideToast: (id) => {
    if (get().toast?.id === id) set({ toast: undefined });
  },
}));
