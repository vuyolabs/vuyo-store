/**
 * Vuyo Store palette — warm neutrals with a single ink tone.
 * Colour is used sparingly so product photography carries the page.
 */
export const colors = {
  background: '#F6F4F0',
  surface: '#FFFFFF',
  surfaceMuted: '#EEEAE4',
  surfaceSunken: '#E7E2DA',

  ink: '#151413',
  inkSecondary: '#4F4C48',
  inkMuted: '#726E68',
  inkInverse: '#FFFFFF',

  line: '#E3DED7',
  lineStrong: '#CBC4BA',

  sale: '#9E3B27',
  success: '#2E6A4C',
  successSoft: '#E3EEE7',
  accent: '#7A5C43',
  accentSoft: '#EFE6DC',

  overlay: 'rgba(15, 14, 13, 0.45)',
  scrim: 'rgba(15, 14, 13, 0.32)',
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

export type ColorName = keyof typeof colors;
