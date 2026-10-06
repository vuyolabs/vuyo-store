import { editorial } from '@/lib/images';

import type { Collection } from './types';

export const heroBanner = {
  collectionId: 'new-season',
  eyebrow: 'New Season',
  title: 'Everyday essentials, elevated.',
  cta: 'Shop Collection',
  image: editorial('1488161628813-04466f872be2', { ratio: 'tall', y: 0.55 }),
};

export const collections: Collection[] = [
  {
    id: 'new-season',
    eyebrow: 'Autumn / Winter 2026',
    title: 'New Season',
    subtitle: 'Considered layers, warm neutrals and pieces made to be worn for years.',
    image: editorial('1488161628813-04466f872be2', { ratio: 'tall', y: 0.55 }),
    tone: 'dark',
  },
  {
    id: 'tailoring',
    eyebrow: 'The Edit',
    title: 'Soft Tailoring',
    subtitle: 'Unstructured blazers, crisp oxfords and leather that means business.',
    image: editorial('1617127365659-c47fa864d8bc', { y: 0.35 }),
    tone: 'dark',
  },
  {
    id: 'leather',
    eyebrow: 'Craft',
    title: 'Made in Leather',
    subtitle: 'Hand-finished in Agra, Kanpur and Chennai by partners we have worked with for years.',
    image: editorial('1479064555552-3ef4979f8908', { y: 0.45 }),
    tone: 'light',
  },
  {
    id: 'weekend',
    eyebrow: 'Off Duty',
    title: 'The Weekend Edit',
    subtitle: 'Denim, sneakers and a bag big enough for wherever the day goes.',
    image: editorial('1556905055-8f358a7a47b2'),
    tone: 'light',
  },
  {
    id: 'essentials',
    eyebrow: 'Foundations',
    title: 'Everyday Essentials',
    subtitle: 'The pieces you will reach for every single day.',
    image: editorial('1523381210434-271e8be1f52b', { y: 0.4 }),
    tone: 'dark',
  },
  {
    id: 'layers',
    eyebrow: 'Cold Weather',
    title: 'Layer Up',
    subtitle: 'Merino, wool and heavyweight cotton for the cooler months.',
    image: editorial('1485968579580-b6d095142e6e', { y: 0.35 }),
    tone: 'dark',
  },
];

/** Collections highlighted in the home “Featured Collection” section. */
export const featuredCollectionIds = ['tailoring', 'leather', 'weekend'] as const;

export function getCollection(id: string): Collection | undefined {
  return collections.find((c) => c.id === id);
}

export const onboardingSlides = [
  {
    id: 'store',
    eyebrow: 'Welcome to Vuyo',
    title: 'A wardrobe built to last.',
    body: 'Clothing, shoes and accessories designed in-house and made with partners we know by name.',
    image: editorial('1441986300917-64674bd600d8', { ratio: 'tall' }),
  },
  {
    id: 'craft',
    eyebrow: 'Considered craft',
    title: 'Fewer, better things.',
    body: 'Honest materials, careful construction and prices without the middlemen.',
    image: editorial('1552374196-1ab2a1c593e8', { ratio: 'tall', y: 0.4 }),
  },
  {
    id: 'service',
    eyebrow: 'Shop with ease',
    title: 'Free returns. Always.',
    body: 'Complimentary delivery over ₹2,999 and 30 days to change your mind.',
    image: editorial('1485968579580-b6d095142e6e', { ratio: 'tall', y: 0.4 }),
  },
] as const;
