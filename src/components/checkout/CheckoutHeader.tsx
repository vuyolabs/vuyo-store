import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

import { AppText, Icon, ScreenHeader } from '@/components/ui';
import { colors, fonts, gutter, spacing } from '@/theme';

const STEPS = ['Delivery', 'Payment', 'Review'] as const;

/** Header + 3-step progress. The bar animates forward from the previous step on mount. */
export function CheckoutHeader({ step }: { step: 0 | 1 | 2 }) {
  const progress = useSharedValue(Math.max(step - 1, 0) / (STEPS.length - 1));

  useEffect(() => {
    progress.set(withDelay(150, withTiming(step / (STEPS.length - 1), { duration: 550, easing: Easing.out(Easing.cubic) })));
  }, [step, progress]);

  const fillStyle = useAnimatedStyle(() => ({ width: `${progress.get() * 100}%` }));

  return (
    <View style={styles.wrap}>
      <ScreenHeader title="Checkout" />
      <View style={styles.steps} accessible accessibilityLabel={`Step ${step + 1} of 3, ${STEPS[step]}`}>
        <View style={styles.track}>
          <Animated.View style={[styles.fill, fillStyle]} />
        </View>
        <View style={styles.labels}>
          {STEPS.map((label, i) => {
            const done = i < step;
            const active = i === step;
            return (
              <View key={label} style={[styles.step, i === 0 && styles.first, i === STEPS.length - 1 && styles.last]}>
                <View style={[styles.node, (done || active) && styles.nodeActive]}>
                  {done ? <Icon name="check" size={11} color="white" /> : <AppText variant="caption" color={active ? 'white' : 'inkMuted'} style={styles.nodeText}>{i + 1}</AppText>}
                </View>
                <AppText variant="caption" color={active || done ? 'ink' : 'inkMuted'} style={active && styles.activeLabel}>
                  {label}
                </AppText>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const NODE = 22;

const styles = StyleSheet.create({
  wrap: { backgroundColor: colors.background, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
  steps: { paddingHorizontal: gutter + spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.lg },
  track: { position: 'absolute', left: gutter + spacing.lg + NODE / 2, right: gutter + spacing.lg + NODE / 2, top: spacing.sm + NODE / 2 - 1, height: 2, backgroundColor: colors.line },
  fill: { height: 2, backgroundColor: colors.ink },
  labels: { flexDirection: 'row', justifyContent: 'space-between' },
  step: { alignItems: 'center', gap: spacing.xs, width: 70 },
  first: { alignItems: 'flex-start' },
  last: { alignItems: 'flex-end' },
  node: { width: NODE, height: NODE, borderRadius: NODE / 2, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.lineStrong, alignItems: 'center', justifyContent: 'center' },
  nodeActive: { backgroundColor: colors.ink, borderColor: colors.ink },
  nodeText: { fontSize: 11, lineHeight: 13 },
  activeLabel: { fontFamily: fonts.sansSemiBold },
});
