import { DELIVERY_FEE, FREE_DELIVERY_THRESHOLD, promoCodes } from '@/data/store-info';
import { getProduct } from '@/data/products';
import type { Product } from '@/data/types';
import type { CartItem } from '@/store/cartStore';

export interface BagLine extends CartItem {
  product: Product;
  lineTotal: number;
}

export interface BagSummary {
  lines: BagLine[];
  itemCount: number;
  subtotal: number;
  /** Savings from items already on sale. */
  savings: number;
  delivery: number;
  discount: number;
  promoLabel?: string;
  total: number;
  remainingForFreeDelivery: number;
}

export function summarizeBag(items: CartItem[], promoCode?: string): BagSummary {
  const lines: BagLine[] = [];
  for (const item of items) {
    const product = getProduct(item.productId);
    if (product) lines.push({ ...item, product, lineTotal: product.price * item.quantity });
  }

  const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0);
  const savings = lines.reduce((sum, l) => sum + ((l.product.originalPrice ?? l.product.price) - l.product.price) * l.quantity, 0);
  const itemCount = lines.reduce((sum, l) => sum + l.quantity, 0);
  const promo = promoCode ? promoCodes[promoCode] : undefined;
  const discount = promo ? Math.round((subtotal * promo.percent) / 100) : 0;
  const delivery = subtotal === 0 || subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;

  return {
    lines,
    itemCount,
    subtotal,
    savings,
    delivery,
    discount,
    promoLabel: promo?.label,
    total: subtotal - discount + delivery,
    remainingForFreeDelivery: Math.max(FREE_DELIVERY_THRESHOLD - subtotal, 0),
  };
}
