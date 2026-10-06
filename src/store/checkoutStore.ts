import { create } from 'zustand';

import type { PaymentMethod } from '@/data/types';

/** In-progress checkout choices. Intentionally not persisted. */
interface CheckoutState {
  addressId?: string;
  paymentMethod: PaymentMethod;
  setAddress: (id: string) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  reset: () => void;
}

export const useCheckoutStore = create<CheckoutState>()((set) => ({
  addressId: undefined,
  paymentMethod: 'upi',
  setAddress: (addressId) => set({ addressId }),
  setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
  reset: () => set({ addressId: undefined, paymentMethod: 'upi' }),
}));
