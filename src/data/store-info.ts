import type { CategoryId, OrderStatus, PaymentMethod } from './types';

export const FREE_DELIVERY_THRESHOLD = 2999;
export const DELIVERY_FEE = 149;

export const promoCodes: Record<string, { label: string; percent: number }> = {
  WELCOME10: { label: '10% off your first order', percent: 10 },
  VUYO15: { label: '15% off for Vuyo members', percent: 15 },
};

export const shippingInfo = [
  'Complimentary delivery on orders over ₹2,999',
  'Standard delivery in 3–5 business days',
  'Express delivery available in Bengaluru, Mumbai and Delhi NCR',
  'Every order ships in our recyclable signature box',
];

export const returnsInfo = [
  'Free returns within 30 days of delivery',
  'Exchange for a different size at no extra cost',
  'Items must be unworn with original tags attached',
  'Refunds processed within 5–7 business days',
];

export const popularSearches = ['Oxford shirt', 'Sneakers', 'Leather', 'Hoodie', 'Watch', 'Backpack', 'Merino', 'Boots'];

export const sortOptions = [
  { id: 'featured', label: 'Featured' },
  { id: 'newest', label: 'Newest' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'rating', label: 'Top Rated' },
] as const;

export type SortId = (typeof sortOptions)[number]['id'];

export const priceRanges = [
  { id: 'under-2k', label: 'Under ₹2,000', min: 0, max: 1999 },
  { id: '2k-5k', label: '₹2,000 – ₹5,000', min: 2000, max: 4999 },
  { id: '5k-10k', label: '₹5,000 – ₹10,000', min: 5000, max: 9999 },
  { id: '10k-plus', label: '₹10,000 +', min: 10000, max: Number.POSITIVE_INFINITY },
] as const;

export type PriceRangeId = (typeof priceRanges)[number]['id'];

export const paymentMethods: { id: PaymentMethod; title: string; subtitle: string }[] = [
  { id: 'upi', title: 'UPI', subtitle: 'Google Pay, PhonePe, Paytm or any UPI app' },
  { id: 'card', title: 'Credit / Debit Card', subtitle: 'Visa, Mastercard, RuPay, Amex' },
  { id: 'cod', title: 'Cash on Delivery', subtitle: 'Pay when your order arrives' },
];

export const paymentLabels: Record<PaymentMethod, string> = {
  upi: 'UPI · aasif@okvuyo',
  card: 'Visa ending 4242',
  cod: 'Cash on Delivery',
};

export const orderStatuses: { id: OrderStatus; label: string; description: string }[] = [
  { id: 'confirmed', label: 'Confirmed', description: 'We have received your order.' },
  { id: 'packed', label: 'Packed', description: 'Your pieces are packed in our signature box.' },
  { id: 'shipped', label: 'Shipped', description: 'On its way with our delivery partner.' },
  { id: 'delivered', label: 'Delivered', description: 'Delivered. Enjoy wearing it.' },
];

export const clothingSizeGuide = {
  headers: ['Size', 'Chest (in)', 'Waist (in)', 'Length (in)'],
  rows: [
    ['XS', '34–36', '28–29', '26.5'],
    ['S', '36–38', '30–31', '27.5'],
    ['M', '38–40', '32–33', '28.5'],
    ['L', '40–42', '34–35', '29.5'],
    ['XL', '42–44', '36–37', '30.5'],
    ['XXL', '44–46', '38–40', '31.5'],
  ],
  tip: 'Measure around the fullest part of your chest, keeping the tape horizontal.',
};

export const shoeSizeGuide = {
  headers: ['UK / IND', 'EU', 'US', 'Foot (cm)'],
  rows: [
    ['6', '40', '7', '25.0'],
    ['7', '41', '8', '25.8'],
    ['8', '42', '9', '26.7'],
    ['9', '43', '10', '27.5'],
    ['10', '44', '11', '28.3'],
    ['11', '45', '12', '29.2'],
  ],
  tip: 'Measure your foot from heel to longest toe in the evening, when feet are largest.',
};

export const beltSizeGuide = {
  headers: ['Belt', 'Waist (in)', 'Total length (cm)', 'Fits trousers'],
  rows: [
    ['30', '28–30', '95', '28–30'],
    ['32', '30–32', '100', '30–32'],
    ['34', '32–34', '105', '32–34'],
    ['36', '34–36', '110', '34–36'],
    ['38', '36–38', '115', '36–38'],
  ],
  tip: 'Order the same size as your trouser waist. The middle hole is the true size.',
};

export function sizeGuideFor(category: CategoryId) {
  if (category === 'shoes') return shoeSizeGuide;
  if (category === 'accessories') return beltSizeGuide;
  return clothingSizeGuide;
}

export const helpTopics = [
  {
    id: 'delivery',
    title: 'Delivery',
    body: 'Orders are dispatched from our Bengaluru studio within 24 hours and delivered in 3–5 business days. Delivery is complimentary on orders over ₹2,999.',
  },
  {
    id: 'returns',
    title: 'Returns & exchanges',
    body: 'Changed your mind? Return any unworn item within 30 days for a full refund, or exchange it for a different size free of charge.',
  },
  {
    id: 'sizing',
    title: 'Sizing & fit',
    body: 'Every product page includes a size guide and fit notes. Save your sizes under Profile → Size Preferences and we will pre-select them for you.',
  },
  {
    id: 'care',
    title: 'Product care',
    body: 'Care instructions are listed on every product page and printed on the label. Our leather goods include a complimentary conditioning service for life.',
  },
  {
    id: 'payments',
    title: 'Payments',
    body: 'We accept UPI, all major credit and debit cards and Cash on Delivery. This demo app does not process real payments.',
  },
];
