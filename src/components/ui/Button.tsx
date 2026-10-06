import { ActivityIndicator, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radius, spacing, type ColorName } from '@/theme';

import { AppText } from './AppText';
import { Icon, type IconName } from './Icon';
import { PressableScale } from './PressableScale';

type Variant = 'primary' | 'secondary' | 'ghost' | 'light';
type Size = 'lg' | 'md' | 'sm';

export interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  icon?: IconName;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

const heights: Record<Size, number> = { lg: 56, md: 48, sm: 38 };

const palette: Record<Variant, { bg: string; border: string; text: ColorName }> = {
  primary: { bg: colors.ink, border: colors.ink, text: 'inkInverse' },
  secondary: { bg: colors.transparent, border: colors.ink, text: 'ink' },
  ghost: { bg: colors.transparent, border: colors.transparent, text: 'ink' },
  light: { bg: colors.white, border: colors.white, text: 'ink' },
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'lg',
  icon,
  iconPosition = 'right',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  accessibilityLabel,
  accessibilityHint,
}: ButtonProps) {
  const p = palette[variant];
  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled || loading}
      haptic="light"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      style={[
        styles.base,
        { height: heights[size], backgroundColor: p.bg, borderColor: p.border, paddingHorizontal: size === 'sm' ? spacing.lg : spacing.xxl },
        fullWidth && styles.fullWidth,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={colors[p.text]} />
      ) : (
        <View style={[styles.content, iconPosition === 'left' && styles.reverse]}>
          <AppText variant={size === 'sm' ? 'smallMedium' : 'button'} color={p.text} numberOfLines={1}>
            {label}
          </AppText>
          {icon ? <Icon name={icon} size={size === 'sm' ? 15 : 17} color={p.text} /> : null}
        </View>
      )}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth * 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: { alignSelf: 'stretch' },
  content: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  reverse: { flexDirection: 'row-reverse' },
});
