import { shot } from '@/lib/images';

import type { Category, CategoryId } from './types';

export const categories: Category[] = [
  { id: 'clothing', name: 'Clothing', blurb: 'Everyday layers', image: shot('1490481651871-ab68de25d43d', { width: 700, height: 900 }) },
  { id: 'shoes', name: 'Shoes', blurb: 'Leather & sneakers', image: shot('1608256246200-53e635b5b65f', { width: 700, height: 900 }) },
  { id: 'accessories', name: 'Accessories', blurb: 'The finishing touch', image: shot('1479064555552-3ef4979f8908', { width: 700, height: 900 }) },
  { id: 'bags', name: 'Bags', blurb: 'Carry it well', image: shot('1547949003-9792a18a2601', { width: 700, height: 900 }) },
  { id: 'watches', name: 'Watches', blurb: 'Time, simplified', image: shot('1524592094714-0f0654e20314', { width: 700, height: 900 }) },
  { id: 'lifestyle', name: 'Lifestyle', blurb: 'For the home', image: shot('1602874801007-bd458bb1b8b6', { width: 700, height: 900 }) },
];

/** The four categories shown on the home storefront. */
export const homeCategories = categories.filter((c) => ['clothing', 'shoes', 'accessories', 'bags'].includes(c.id));

export function getCategoryName(id: CategoryId): string {
  return categories.find((c) => c.id === id)?.name ?? id;
}
