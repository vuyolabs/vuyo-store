import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, LinearTransition } from 'react-native-reanimated';

import { AppText, Divider } from '@/components/ui';
import { formatPrice } from '@/lib/utils';
import { colors, radius, spacing } from '@/theme';

interface OrderSummaryProps {
  subtotal: number;
  delivery: number;
  discount: number;
  total: number;
  itemCount?: number;
  savings?: number;
  promoLabel?: string;
}

function Line({ label, value, emphasis = false, tone }: { label: string; value: string; emphasis?: boolean; tone?: 'success' }) {
  return (
    <Animated.View layout={LinearTransition.duration(220)} entering={FadeIn} style={styles.line} accessible accessibilityLabel={`${label}, ${value}`}>
      <AppText variant={emphasis ? 'title' : 'small'} color={emphasis ? 'ink' : 'inkSecondary'}>
        {label}
      </AppText>
      <AppText variant={emphasis ? 'title' : 'smallMedium'} color={tone ?? 'ink'}>
        {value}
      </AppText>
    </Animated.View>
  );
}

export function OrderSummary({ subtotal, delivery, discount, total, itemCount, savings = 0, promoLabel }: OrderSummaryProps) {
  return (
    <View style={styles.card}>
      <Line label={itemCount !== undefined ? `Subtotal (${itemCount} ${itemCount === 1 ? 'item' : 'items'})` : 'Subtotal'} value={formatPrice(subtotal)} />
      <Line label="Delivery" value={delivery === 0 ? 'Free' : formatPrice(delivery)} tone={delivery === 0 ? 'success' : undefined} />
      {discount > 0 ? <Line label={promoLabel ? `Discount · ${promoLabel}` : 'Discount'} value={`−${formatPrice(discount)}`} tone="success" /> : null}
      <Divider style={styles.divider} />
      <Line label="Total" value={formatPrice(total)} emphasis />
      <AppText variant="caption" color="inkMuted">
        Inclusive of GST
        {savings + discount > 0 ? ` · You save ${formatPrice(savings + discount)}` : ''}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.xl, gap: spacing.md, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  line: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.md },
  divider: { marginVertical: spacing.xs },
});
