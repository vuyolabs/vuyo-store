import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { colors, fonts, radius, spacing } from '@/theme';

import { PressableScale } from './PressableScale';

interface ChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  /** Optional colour dot rendered before the label. */
  swatch?: string;
  count?: number;
  accessibilityLabel?: string;
}

/** Pill used for categories and filters; colour cross-fades on selection. */
export function Chip({ label, selected, onPress, swatch, count, accessibilityLabel }: ChipProps) {
  const progress = useSharedValue(selected ? 1 : 0);

  useEffect(() => {
    progress.set(withTiming(selected ? 1 : 0, { duration: 200 }));
  }, [selected, progress]);

  const containerStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.get(), [0, 1], [colors.surface, colors.ink]),
    borderColor: interpolateColor(progress.get(), [0, 1], [colors.line, colors.ink]),
  }));
  const textStyle = useAnimatedStyle(() => ({
    color: interpolateColor(progress.get(), [0, 1], [colors.ink, colors.white]),
  }));

  return (
    <PressableScale
      onPress={onPress}
      haptic="selection"
      scaleTo={0.95}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ selected }}>
      <Animated.View style={[styles.chip, containerStyle]}>
        {swatch ? <View style={[styles.swatch, { backgroundColor: swatch }]} /> : null}
        <Animated.Text style={[styles.label, textStyle]} maxFontSizeMultiplier={1.4}>
          {label}
          {count !== undefined ? ` · ${count}` : ''}
        </Animated.Text>
      </Animated.View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  chip: {
    height: 38,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  swatch: { width: 14, height: 14, borderRadius: 7, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.lineStrong },
  label: { fontFamily: fonts.sansMedium, fontSize: 13.5 },
});
