import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { orderStatuses } from '@/data/store-info';
import type { OrderStatus } from '@/data/types';
import { colors, fonts, radius, spacing } from '@/theme';

const tones: Record<OrderStatus, { bg: string; dot: string }> = {
  confirmed: { bg: colors.accentSoft, dot: colors.accent },
  packed: { bg: colors.accentSoft, dot: colors.accent },
  shipped: { bg: '#E4E9F1', dot: '#3A5683' },
  delivered: { bg: colors.successSoft, dot: colors.success },
};

export function StatusPill({ status }: { status: OrderStatus }) {
  const label = orderStatuses.find((s) => s.id === status)?.label ?? status;
  const tone = tones[status];
  return (
    <View style={[styles.pill, { backgroundColor: tone.bg }]} accessible accessibilityLabel={`Status: ${label}`}>
      <View style={[styles.dot, { backgroundColor: tone.dot }]} />
      <AppText variant="caption" style={styles.text}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: spacing.sm + 2, paddingVertical: 4, borderRadius: radius.pill, alignSelf: 'flex-start' },
  dot: { width: 6, height: 6, borderRadius: 3 },
  text: { fontFamily: fonts.sansMedium },
});
