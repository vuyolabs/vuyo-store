import { categories } from '@/data/categories';
import { products } from '@/data/products';
import { priceRanges, type PriceRangeId, type SortId } from '@/data/store-info';
import type { CategoryId, Product } from '@/data/types';

import { normalize } from './utils';

export interface CatalogFilters {
  category: CategoryId | 'all';
  priceRanges: PriceRangeId[];
  sizes: string[];
  colors: string[];
  minRating: number;
  onSale: boolean;
}

export const defaultFilters: CatalogFilters = {
  category: 'all',
  priceRanges: [],
  sizes: [],
  colors: [],
  minRating: 0,
  onSale: false,
};

/** Number of refinements applied beyond the category chip. */
export function activeFilterCount(f: CatalogFilters) {
  return f.priceRanges.length + f.sizes.length + f.colors.length + (f.minRating > 0 ? 1 : 0) + (f.onSale ? 1 : 0);
}

/** Colour families used for filtering, so “Navy” and “Midnight Navy” group together. */
export const colorFamilies = [
  { id: 'Black', hex: '#1B1B1B', match: ['black', 'midnight', 'graphite', 'charcoal'] },
  { id: 'White', hex: '#F4F2EE', match: ['white', 'off-white', 'chalk', 'ivory'] },
  { id: 'Grey', hex: '#9C9A96', match: ['grey', 'gray', 'silver', 'stone', 'smoke'] },
  { id: 'Navy', hex: '#1F2A44', match: ['navy', 'indigo', 'rinse'] },
  { id: 'Brown', hex: '#6E4128', match: ['brown', 'cognac', 'espresso', 'chocolate', 'chestnut', 'tan', 'mocha', 'rosewood', 'camel'] },
  { id: 'Beige', hex: '#D6C6A8', match: ['beige', 'sand', 'oat', 'natural', 'khaki', 'ivory'] },
  { id: 'Green', hex: '#55634A', match: ['green', 'olive', 'moss', 'forest', 'sage', 'teal'] },
  { id: 'Red', hex: '#8E2C2C', match: ['red', 'burgundy', 'rust', 'vermilion', 'oxblood', 'blush', 'marigold'] },
  { id: 'Blue', hex: '#A9C2DE', match: ['blue', 'sky', 'chambray'] },
] as const;

function matchesColorFamily(product: Product, familyIds: string[]) {
  if (familyIds.length === 0) return true;
  return familyIds.some((fid) => {
    const family = colorFamilies.find((f) => f.id === fid);
    if (!family) return false;
    return product.colors.some((c) => family.match.some((m) => c.name.toLowerCase().includes(m)));
  });
}

export const filterSizes = {
  clothing: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  shoes: ['6', '7', '8', '9', '10', '11'],
};

export function filterProducts(list: Product[], f: CatalogFilters): Product[] {
  return list.filter((p) => {
    if (f.category !== 'all' && p.category !== f.category) return false;
    if (f.onSale && !p.originalPrice) return false;
    if (f.minRating > 0 && p.rating < f.minRating) return false;
    if (f.priceRanges.length > 0) {
      const inRange = f.priceRanges.some((id) => {
        const r = priceRanges.find((x) => x.id === id);
        return r ? p.price >= r.min && p.price <= r.max : false;
      });
      if (!inRange) return false;
    }
    if (f.sizes.length > 0 && !(p.sizes ?? []).some((s) => f.sizes.includes(s))) return false;
    return matchesColorFamily(p, f.colors);
  });
}

export function sortProducts(list: Product[], sort: SortId): Product[] {
  const copy = [...list];
  switch (sort) {
    case 'price-asc':
      return copy.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return copy.sort((a, b) => b.price - a.price);
    case 'rating':
      return copy.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    case 'newest':
      return copy.sort((a, b) => Number(b.newArrival) - Number(a.newArrival));
    case 'featured':
    default:
      return copy.sort((a, b) => Number(b.featured) + Number(b.trending) - (Number(a.featured) + Number(a.trending)));
  }
}

/**
 * Local search across name, category, tagline, description and colours.
 * Every word in the query must match somewhere; name matches rank highest.
 */
export function searchProducts(query: string): Product[] {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];

  const results: { product: Product; score: number }[] = [];
  for (const p of products) {
    const name = normalize(p.name);
    const category = normalize(categories.find((c) => c.id === p.category)?.name ?? p.category);
    const body = normalize(`${p.tagline} ${p.description} ${p.material} ${p.colors.map((c) => c.name).join(' ')}`);

    let score = 0;
    let allMatch = true;
    for (const term of terms) {
      const stem = term.length > 3 && term.endsWith('s') ? term.slice(0, -1) : term;
      if (name.includes(stem)) score += name.startsWith(stem) ? 6 : 4;
      else if (category.includes(stem)) score += 3;
      else if (body.includes(stem)) score += 1;
      else allMatch = false;
    }
    if (allMatch) results.push({ product: p, score });
  }
  return results.sort((a, b) => b.score - a.score || b.product.rating - a.product.rating).map((r) => r.product);
}
