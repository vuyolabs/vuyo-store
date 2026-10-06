export type CategoryId = 'clothing' | 'shoes' | 'accessories' | 'bags' | 'watches' | 'lifestyle';

export interface ProductColor {
  name: string;
  hex: string;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  /** One-line editorial hook shown under the name. */
  tagline: string;
  description: string;
  price: number;
  originalPrice?: number;
  /** Discount percentage, present only when `originalPrice` is set. */
  discount?: number;
  category: CategoryId;
  /** Which edit / capsule the product belongs to (see data/banners.ts). */
  collections: string[];
  images: string[];
  rating: number;
  reviewCount: number;
  colors: ProductColor[];
  sizes?: string[];
  fit?: string;
  material: string;
  careInstructions: string[];
  specifications: ProductSpec[];
  featured: boolean;
  newArrival: boolean;
  trending: boolean;
}

export interface Category {
  id: CategoryId;
  name: string;
  blurb: string;
  image: string;
}

export interface Collection {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
  /** Darken the image enough to keep overlaid text legible. */
  tone: 'light' | 'dark';
}

export type OrderStatus = 'confirmed' | 'packed' | 'shipped' | 'delivered';

export type PaymentMethod = 'upi' | 'card' | 'cod';

export interface Address {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  color: string;
  size?: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  createdAt: string;
  items: OrderItem[];
  subtotal: number;
  delivery: number;
  discount: number;
  total: number;
  status: OrderStatus;
  /** ISO timestamps for each status the order has reached. */
  statusDates: Partial<Record<OrderStatus, string>>;
  estimatedDelivery: string;
  address: Address;
  paymentMethod: PaymentMethod;
}
