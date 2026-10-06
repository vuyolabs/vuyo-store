import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, FadeInDown, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withTiming, ZoomIn } from 'react-native-reanimated';

import { AppText, Icon } from '@/components/ui';
import { orderStatuses } from '@/data/store-info';
import type { Order } from '@/data/types';
import { formatShortDate, formatTime } from '@/lib/utils';
import { colors, spacing } from '@/theme';

const NODE = 24;
const STEP_DELAY = 260;

function Connector({ filled, index }: { filled: boolean; index: number }) {
  const progress = useSharedValue(0);
  useEffect(() => {
    if (filled) progress.set(withDelay(index * STEP_DELAY + 150, withTiming(1, { duration: 320, easing: Easing.out(Easing.cubic) })));
  }, [filled, index, progress]);
  const style = useAnimatedStyle(() => ({ height: `${progress.get() * 100}%` }));
  return (
    <View style={styles.connector}>
      <Animated.View style={[styles.connectorFill, style]} />
    </View>
  );
}

function CurrentPulse() {
  const pulse = useSharedValue(0);
  useEffect(() => {
    pulse.set(withRepeat(withTiming(1, { duration: 1600, easing: Easing.out(Easing.quad) }), -1, false));
  }, [pulse]);
  const style = useAnimatedStyle(() => ({ opacity: 0.4 * (1 - pulse.get()), transform: [{ scale: 1 + pulse.get() * 0.9 }] }));
  return <Animated.View style={[styles.pulse, style]} />;
}

/** Vertical order journey. Reached steps fill in sequence; the current step gently pulses. */
export function OrderTimeline({ order }: { order: Order }) {
  const currentIndex = orderStatuses.findIndex((s) => s.id === order.status);

  return (
    <View accessibilityRole="list">
      {orderStatuses.map((step, i) => {
        const reached = i <= currentIndex;
        const current = i === currentIndex;
        const date = order.statusDates[step.id];
        const isLast = i === orderStatuses.length - 1;
        const caption = date
          ? `${formatShortDate(date)} · ${formatTime(date)}`
          : step.id === 'delivered'
            ? `Expected by ${formatShortDate(order.estimatedDelivery)}`
            : 'Pending';

        return (
          <Animated.View
            key={step.id}
            entering={FadeInDown.delay(i * STEP_DELAY).duration(380)}
            style={styles.row}
            accessible
            accessibilityLabel={`${step.label}${reached ? ', completed' : ', upcoming'}. ${caption}`}>
            <View style={styles.rail}>
              <View style={styles.nodeWrap}>
                {current && order.status !== 'delivered' ? <CurrentPulse /> : null}
                {reached ? (
                  <Animated.View entering={ZoomIn.delay(i * STEP_DELAY + 80).springify().damping(13)} style={[styles.node, styles.nodeDone]}>
                    <Icon name="check" size={13} color="white" />
                  </Animated.View>
                ) : (
                  <View style={[styles.node, styles.nodePending]} />
                )}
              </View>
              {!isLast ? <Connector filled={i < currentIndex} index={i} /> : null}
            </View>
            <View style={[styles.text, !isLast && styles.textSpacing]}>
              <AppText variant={current ? 'bodyMedium' : 'body'} color={reached ? 'ink' : 'inkMuted'}>
                {step.label}
              </AppText>
              <AppText variant="small" color={reached ? 'inkSecondary' : 'inkMuted'}>
                {reached ? step.description : 'We will update you at this step.'}
              </AppText>
              <AppText variant="caption" color="inkMuted">
                {caption}
              </AppText>
            </View>
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.lg },
  rail: { width: NODE, alignItems: 'center' },
  nodeWrap: { width: NODE, height: NODE, alignItems: 'center', justifyContent: 'center' },
  node: { width: NODE, height: NODE, borderRadius: NODE / 2, alignItems: 'center', justifyContent: 'center' },
  nodeDone: { backgroundColor: colors.ink },
  nodePending: { backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.lineStrong },
  pulse: { position: 'absolute', width: NODE, height: NODE, borderRadius: NODE / 2, backgroundColor: colors.ink },
  connector: { flex: 1, width: 2, backgroundColor: colors.line, marginVertical: 4, borderRadius: 1, overflow: 'hidden' },
  connectorFill: { width: 2, backgroundColor: colors.ink },
  text: { flex: 1, gap: 2, paddingTop: 1 },
  textSpacing: { paddingBottom: spacing.xxl },
});
