export { colors } from './colors';
export type { ColorName } from './colors';
export { fonts, typography } from './typography';
export type { TypographyVariant } from './typography';
export { spacing, gutter, touchTarget } from './spacing';
export { radius } from './radius';

export const shadows = {
  soft: {
    shadowColor: '#1A1612',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  raised: {
    shadowColor: '#1A1612',
    shadowOpacity: 0.12,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
} as const;
