import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, interpolateColor, useAnimatedStyle, useDerivedValue, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';

import { AppText, PressableScale } from '@/components/ui';
import { colors, fonts, radius, spacing } from '@/theme';

interface SizeSelectorProps {
  sizes: string[];
  selected?: string;
  onSelect: (size: string) => void;
  onOpenGuide: () => void;
  /** Increment to play a shake and show the error hint. */
  attention: number;
  preferredSize?: string;
}

function SizeBox({ size, selected, onPress }: { size: string; selected: boolean; onPress: () => void }) {
  const progress = useDerivedValue(() => withTiming(selected ? 1 : 0, { duration: 180 }));
  const boxStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.get(), [0, 1], [colors.surface, colors.ink]),
    borderColor: interpolateColor(progress.get(), [0, 1], [colors.line, colors.ink]),
  }));
  const textStyle = useAnimatedStyle(() => ({ color: interpolateColor(progress.get(), [0, 1], [colors.ink, colors.white]) }));

  return (
    <PressableScale onPress={onPress} haptic="selection" scaleTo={0.93} accessibilityRole="radio" accessibilityLabel={`Size ${size}`} accessibilityState={{ checked: selected }}>
      <Animated.View style={[styles.box, boxStyle]}>
        <Animated.Text style={[styles.boxText, textStyle]} maxFontSizeMultiplier={1.3}>
          {size}
        </Animated.Text>
      </Animated.View>
    </PressableScale>
  );
}

export function SizeSelector({ sizes, selected, onSelect, onOpenGuide, attention, preferredSize }: SizeSelectorProps) {
  const shake = useSharedValue(0);

  useEffect(() => {
    if (attention === 0) return;
    shake.set(withSequence(withTiming(-8, { duration: 50 }), withTiming(8, { duration: 60 }), withTiming(-5, { duration: 60 }), withTiming(5, { duration: 60 }), withTiming(0, { duration: 50 })));
  }, [attention, shake]);

  const shakeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shake.get() }] }));
  const showError = attention > 0 && !selected;

  return (
    <View style={styles.wrap}>
      <View style={styles.labelRow}>
        <View style={styles.label}>
          <AppText variant="smallMedium">Size</AppText>
          {selected ? (
            <AppText variant="small" color="inkSecondary">
              {selected}
            </AppText>
          ) : preferredSize && sizes.includes(preferredSize) ? (
            <AppText variant="small" color="inkMuted">
              Your usual: {preferredSize}
            </AppText>
          ) : null}
        </View>
        <PressableScale onPress={onOpenGuide} hitSlop={10} haptic="selection" accessibilityLabel="Open size guide" style={styles.guide}>
          <AppText variant="smallMedium" style={styles.underline}>
            Size guide
          </AppText>
        </PressableScale>
      </View>
      <Animated.View style={[styles.row, shakeStyle]} accessibilityRole="radiogroup" accessibilityLabel="Size">
        {sizes.map((s) => (
          <SizeBox key={s} size={s} selected={s === selected} onPress={() => onSelect(s)} />
        ))}
      </Animated.View>
      {showError ? (
        <Animated.View entering={FadeIn.duration(200)}>
          <AppText variant="caption" color="sale" accessibilityLiveRegion="assertive">
            Please select a size to continue.
          </AppText>
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.md },
  labelRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  label: { flexDirection: 'row', gap: spacing.sm, alignItems: 'baseline' },
  guide: { minHeight: 32, justifyContent: 'center' },
  underline: { textDecorationLine: 'underline' },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  box: {
    minWidth: 52,
    height: 46,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxText: { fontFamily: fonts.sansMedium, fontSize: 14 },
});
