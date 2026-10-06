import type { Address, Order } from './types';
import { getProduct } from './products';

export const demoAddresses: Address[] = [
  {
    id: 'addr_home',
    label: 'Home',
    fullName: 'Aasif Ali',
    phone: '+91 98450 21734',
    line1: 'Flat 4B, Sobha Clovelly',
    line2: '12th Cross, Indiranagar 2nd Stage',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038',
  },
  {
    id: 'addr_work',
    label: 'Studio',
    fullName: 'Aasif Ali',
    phone: '+91 98450 21734',
    line1: 'Vuyo Labs, 3rd Floor, Prestige Atrium',
    line2: 'Central Street, Shivajinagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560001',
  },
];

function item(productId: string, color: string, quantity: number, size?: string) {
  const p = getProduct(productId);
  if (!p) throw new Error(`Unknown product ${productId}`);
  return { productId, name: p.name, image: p.images[0], color, size, quantity, unitPrice: p.price };
}

function totals(items: ReturnType<typeof item>[], discount = 0) {
  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const delivery = subtotal >= 2999 ? 0 : 149;
  return { subtotal, delivery, discount, total: subtotal + delivery - discount };
}

const shippedItems = [item('relaxed-oxford-shirt', 'Sky Blue', 1, 'M'), item('minimal-leather-belt', 'Tan', 1, '32')];
const deliveredItems = [
  item('heritage-lace-up-boots', 'Espresso', 1, '9'),
  item('premium-cotton-hoodie', 'Heather Grey', 1, 'L'),
  item('cedar-amber-candle', 'Smoke Glass', 2),
];
const olderItems = [item('everyday-canvas-backpack', 'Navy', 1), item('essential-crew-tee', 'White', 3, 'M')];

/** Previous orders shown under Profile → My Orders for the demo account. */
export const demoOrders: Order[] = [
  {
    id: 'VY-2026-10461',
    createdAt: '2026-10-02T11:24:00.000Z',
    items: shippedItems,
    ...totals(shippedItems),
    status: 'shipped',
    statusDates: {
      confirmed: '2026-10-02T11:24:00.000Z',
      packed: '2026-10-02T17:05:00.000Z',
      shipped: '2026-10-03T09:40:00.000Z',
    },
    estimatedDelivery: '2026-10-07T12:00:00.000Z',
    address: demoAddresses[0],
    paymentMethod: 'upi',
  },
  {
    id: 'VY-2026-10318',
    createdAt: '2026-09-14T06:48:00.000Z',
    items: deliveredItems,
    ...totals(deliveredItems, 1500),
    status: 'delivered',
    statusDates: {
      confirmed: '2026-09-14T06:48:00.000Z',
      packed: '2026-09-14T13:12:00.000Z',
      shipped: '2026-09-15T08:30:00.000Z',
      delivered: '2026-09-17T10:15:00.000Z',
    },
    estimatedDelivery: '2026-09-18T12:00:00.000Z',
    address: demoAddresses[0],
    paymentMethod: 'card',
  },
  {
    id: 'VY-2026-10127',
    createdAt: '2026-08-21T14:02:00.000Z',
    items: olderItems,
    ...totals(olderItems),
    status: 'delivered',
    statusDates: {
      confirmed: '2026-08-21T14:02:00.000Z',
      packed: '2026-08-22T05:45:00.000Z',
      shipped: '2026-08-22T12:20:00.000Z',
      delivered: '2026-08-25T09:50:00.000Z',
    },
    estimatedDelivery: '2026-08-26T12:00:00.000Z',
    address: demoAddresses[1],
    paymentMethod: 'cod',
  },
];
