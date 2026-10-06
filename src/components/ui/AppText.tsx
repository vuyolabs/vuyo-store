import { Text, type TextProps, type TextStyle } from 'react-native';

import { colors, typography, type ColorName, type TypographyVariant } from '@/theme';

export interface AppTextProps extends TextProps {
  variant?: TypographyVariant;
  color?: ColorName;
  align?: TextStyle['textAlign'];
}

export function AppText({ variant = 'body', color = 'ink', align, style, ...rest }: AppTextProps) {
  return <Text maxFontSizeMultiplier={1.6} {...rest} style={[typography[variant], { color: colors[color] }, align ? { textAlign: align } : null, style]} />;
}
