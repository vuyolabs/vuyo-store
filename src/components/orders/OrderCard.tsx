import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppImage, AppText, Icon, PressableScale } from '@/components/ui';
import type { Order } from '@/data/types';
import { formatDate, formatPrice, formatShortDate } from '@/lib/utils';
import { colors, radius, spacing } from '@/theme';

import { StatusPill } from './StatusPill';

export function OrderCard({ order }: { order: Order }) {
  const count = order.items.reduce((n, i) => n + i.quantity, 0);
  const statusLine =
    order.status === 'delivered'
      ? `Delivered ${order.statusDates.delivered ? formatShortDate(order.statusDates.delivered) : ''}`
      : `Arriving by ${formatShortDate(order.estimatedDelivery)}`;

  return (
    <PressableScale
      scaleTo={0.985}
      onPress={() => router.push({ pathname: '/orders/[id]', params: { id: order.id } })}
      style={styles.card}
      accessibilityLabel={`Order ${order.id}, placed ${formatDate(order.createdAt)}, ${count} items, ${formatPrice(order.total)}, ${order.status}`}
      accessibilityHint="Opens order details and tracking">
      <View style={styles.header}>
        <View style={styles.flex}>
          <AppText variant="title">#{order.id}</AppText>
          <AppText variant="caption" color="inkMuted">
            Placed {formatDate(order.createdAt)}
          </AppText>
        </View>
        <StatusPill status={order.status} />
      </View>

      <View style={styles.thumbs}>
        {order.items.slice(0, 4).map((item) => (
          <AppImage key={`${item.productId}-${item.color}-${item.size}`} uri={item.image} style={styles.thumb} />
        ))}
        {order.items.length > 4 ? (
          <View style={[styles.thumb, styles.more]}>
            <AppText variant="smallMedium">+{order.items.length - 4}</AppText>
          </View>
        ) : null}
      </View>

      <AppText variant="small" color="inkSecondary" numberOfLines={1}>
        {order.items.map((i) => i.name).join(', ')}
      </AppText>

      <View style={styles.footer}>
        <AppText variant="small" color="inkSecondary">
          {statusLine}
        </AppText>
        <View style={styles.total}>
          <AppText variant="smallMedium">
            {formatPrice(order.total)} · {count} {count === 1 ? 'item' : 'items'}
          </AppText>
          <Icon name="chevron-right" size={16} color="inkMuted" />
        </View>
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.md, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  flex: { flex: 1 },
  thumbs: { flexDirection: 'row', gap: spacing.sm },
  thumb: { width: 54, height: 68, borderRadius: radius.sm },
  more: { backgroundColor: colors.surfaceMuted, alignItems: 'center', justifyContent: 'center' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: spacing.md, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line },
  total: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
});
