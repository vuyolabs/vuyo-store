export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
  massive: 64,
} as const;

/** Horizontal page gutter used by every screen. */
export const gutter = spacing.xl;

/** Minimum touch target recommended by both platform guidelines. */
export const touchTarget = 44;
