import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radius, shadows, touchTarget, type ColorName } from '@/theme';

import { CountBadge } from './CountBadge';
import { Icon, type IconName } from './Icon';
import { PressableScale } from './PressableScale';

interface IconButtonProps {
  icon: IconName;
  onPress?: () => void;
  accessibilityLabel: string;
  variant?: 'plain' | 'surface' | 'translucent';
  size?: number;
  iconSize?: number;
  color?: ColorName;
  badge?: number;
  style?: StyleProp<ViewStyle>;
}

export function IconButton({ icon, onPress, accessibilityLabel, variant = 'plain', size = touchTarget, iconSize = 20, color = 'ink', badge, style }: IconButtonProps) {
  return (
    <PressableScale
      onPress={onPress}
      haptic="selection"
      scaleTo={0.9}
      hitSlop={4}
      accessibilityLabel={badge ? `${accessibilityLabel}, ${badge} items` : accessibilityLabel}
      style={[
        styles.base,
        { width: size, height: size },
        variant === 'surface' && styles.surface,
        variant === 'translucent' && styles.translucent,
        style,
      ]}>
      <Icon name={icon} size={iconSize} color={color} />
      {badge !== undefined ? <CountBadge count={badge} style={styles.badge} /> : null}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center', borderRadius: radius.pill },
  surface: { backgroundColor: colors.surface, ...shadows.soft },
  translucent: { backgroundColor: 'rgba(255,255,255,0.88)' },
  badge: { position: 'absolute', top: 4, right: 2 },
});
