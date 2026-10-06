import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, useDerivedValue, withSpring, withTiming } from 'react-native-reanimated';

import { PressableScale } from '@/components/ui';
import { colors, radius, spacing } from '@/theme';

interface SelectableCardProps {
  selected: boolean;
  onPress: () => void;
  children: ReactNode;
  accessibilityLabel: string;
}

/** Radio card used for addresses and payment methods. */
export function SelectableCard({ selected, onPress, children, accessibilityLabel }: SelectableCardProps) {
  const progress = useDerivedValue(() => withTiming(selected ? 1 : 0, { duration: 200 }));

  const cardStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(progress.get(), [0, 1], [colors.line, colors.ink]),
  }));
  const dotStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(selected ? 1 : 0, { damping: 14, stiffness: 260 }) }],
  }));

  return (
    <PressableScale onPress={onPress} haptic="selection" scaleTo={0.985} accessibilityRole="radio" accessibilityLabel={accessibilityLabel} accessibilityState={{ checked: selected }}>
      <Animated.View style={[styles.card, cardStyle]}>
        <View style={[styles.radio, selected && styles.radioOn]}>
          <Animated.View style={[styles.radioDot, dotStyle]} />
        </View>
        <View style={styles.content}>{children}</View>
      </Animated.View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', gap: spacing.lg, padding: spacing.lg, borderRadius: radius.lg, borderWidth: 1.5, backgroundColor: colors.surface },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, borderColor: colors.lineStrong, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  radioOn: { borderColor: colors.ink },
  radioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.ink },
  content: { flex: 1, gap: spacing.xs },
});
