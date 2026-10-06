import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, Easing } from 'react-native-reanimated';

import { AppText, Icon } from '@/components/ui';
import { FREE_DELIVERY_THRESHOLD } from '@/data/store-info';
import { formatPrice } from '@/lib/utils';
import { colors, spacing } from '@/theme';

export function FreeDeliveryMeter({ subtotal }: { subtotal: number }) {
  const progress = useSharedValue(0);
  const ratio = Math.min(subtotal / FREE_DELIVERY_THRESHOLD, 1);
  const remaining = Math.max(FREE_DELIVERY_THRESHOLD - subtotal, 0);

  useEffect(() => {
    progress.set(withTiming(ratio, { duration: 600, easing: Easing.out(Easing.cubic) }));
  }, [ratio, progress]);

  const barStyle = useAnimatedStyle(() => ({ width: `${progress.get() * 100}%` }));

  return (
    <View style={styles.wrap} accessible accessibilityLabel={remaining > 0 ? `Add ${formatPrice(remaining)} more for free delivery` : 'You have unlocked free delivery'}>
      <View style={styles.row}>
        <Icon name={remaining > 0 ? 'truck' : 'check-circle'} size={16} color={remaining > 0 ? 'ink' : 'success'} />
        <AppText variant="small">
          {remaining > 0 ? (
            <>
              Add <AppText variant="smallMedium">{formatPrice(remaining)}</AppText> more for free delivery
            </>
          ) : (
            <AppText variant="smallMedium" color="success">
              You’ve unlocked free delivery
            </AppText>
          )}
        </AppText>
      </View>
      <View style={styles.track}>
        <Animated.View style={[styles.bar, { backgroundColor: remaining > 0 ? colors.ink : colors.success }, barStyle]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  track: { height: 3, borderRadius: 2, backgroundColor: colors.surfaceSunken, overflow: 'hidden' },
  bar: { height: 3, borderRadius: 2 },
});
