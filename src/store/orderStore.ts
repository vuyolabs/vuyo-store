import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { demoOrders } from '@/data/orders';
import type { Address, Order, OrderItem, PaymentMethod } from '@/data/types';
import { persistStorage, STORAGE_KEYS } from '@/lib/storage';
import { addBusinessDays } from '@/lib/utils';

const FIRST_SEQUENCE = 10482;

interface PlaceOrderInput {
  items: OrderItem[];
  subtotal: number;
  delivery: number;
  discount: number;
  total: number;
  address: Address;
  paymentMethod: PaymentMethod;
}

interface OrderState {
  orders: Order[];
  nextSequence: number;
  placeOrder: (input: PlaceOrderInput) => Order;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: demoOrders,
      nextSequence: FIRST_SEQUENCE,

      placeOrder: (input) => {
        const now = new Date();
        const sequence = get().nextSequence;
        const order: Order = {
          ...input,
          id: `VY-${now.getFullYear()}-${sequence}`,
          createdAt: now.toISOString(),
          status: 'confirmed',
          statusDates: { confirmed: now.toISOString() },
          estimatedDelivery: addBusinessDays(now, 5).toISOString(),
        };
        set((state) => ({ orders: [order, ...state.orders], nextSequence: state.nextSequence + 1 }));
        return order;
      },
    }),
    { name: STORAGE_KEYS.orders, storage: persistStorage, version: 1 },
  ),
);

export function useOrder(orderId: string | undefined) {
  return useOrderStore((s) => s.orders.find((o) => o.id === orderId));
}
