import { router, useLocalSearchParams } from 'expo-router';
import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AddressBlock } from '@/components/checkout/AddressBlock';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { OrderTimeline } from '@/components/orders/OrderTimeline';
import { StatusPill } from '@/components/orders/StatusPill';
import { AppImage, AppText, Button, EmptyState, ListRow, PressableScale, ScreenHeader } from '@/components/ui';
import { getProduct } from '@/data/products';
import { paymentLabels } from '@/data/store-info';
import type { OrderItem } from '@/data/types';
import { haptics } from '@/lib/haptics';
import { formatDate, formatPrice, formatShortDate } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import { useOrder } from '@/store/orderStore';
import { useUIStore } from '@/store/uiStore';
import { colors, gutter, radius, spacing } from '@/theme';

function Section({ title, children, delay }: { title: string; children: ReactNode; delay: number }) {
  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(400)} style={styles.section}>
      <AppText variant="overline" color="inkMuted">
        {title}
      </AppText>
      {children}
    </Animated.View>
  );
}

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const order = useOrder(id);
  const addItem = useCartStore((s) => s.addItem);
  const showToast = useUIStore((s) => s.showToast);

  if (!order) {
    return (
      <View style={styles.root}>
        <ScreenHeader title="Order" />
        <EmptyState icon="package" title="Order not found." body="We couldn't find that order on this device." ctaLabel="View all orders" onCta={() => router.replace('/orders')} />
      </View>
    );
  }

  const buyAgain = (item: OrderItem) => {
    if (!getProduct(item.productId)) return;
    addItem({ productId: item.productId, color: item.color, size: item.size });
    haptics.success();
    showToast({ title: 'Added to Bag', message: item.name, image: item.image, action: { label: 'View Bag', href: '/bag' } });
  };

  const headline =
    order.status === 'delivered'
      ? `Delivered ${order.statusDates.delivered ? formatShortDate(order.statusDates.delivered) : ''}`
      : `Arriving by ${formatShortDate(order.estimatedDelivery)}`;

  return (
    <View style={styles.root}>
      <ScreenHeader title={`#${order.id}`} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(400)} style={styles.hero}>
          <StatusPill status={order.status} />
          <AppText variant="h1" accessibilityRole="header">
            {headline}
          </AppText>
          <AppText variant="small" color="inkMuted">
            Placed {formatDate(order.createdAt)} · {formatPrice(order.total)}
          </AppText>
        </Animated.View>

        <Section title="Tracking" delay={80}>
          <View style={styles.card}>
            <OrderTimeline order={order} />
          </View>
        </Section>

        <Section title={`Items (${order.items.reduce((n, i) => n + i.quantity, 0)})`} delay={160}>
          <View style={styles.card}>
            {order.items.map((item, i) => (
              <View key={`${item.productId}-${item.color}-${item.size}`} style={[styles.item, i > 0 && styles.itemBorder]}>
                <PressableScale onPress={() => router.push({ pathname: '/product/[id]', params: { id: item.productId } })} accessibilityLabel={`View ${item.name}`}>
                  <AppImage uri={item.image} style={styles.thumb} />
                </PressableScale>
                <View style={styles.flex}>
                  <AppText variant="smallMedium">{item.name}</AppText>
                  <AppText variant="caption" color="inkMuted">
                    {[item.color, item.size ? `Size ${item.size}` : null, `Qty ${item.quantity}`].filter(Boolean).join(' · ')}
                  </AppText>
                  <AppText variant="smallMedium" style={styles.price}>
                    {formatPrice(item.unitPrice * item.quantity)}
                  </AppText>
                </View>
                <Button label="Buy again" size="sm" variant="secondary" onPress={() => buyAgain(item)} accessibilityLabel={`Buy ${item.name} again`} />
              </View>
            ))}
          </View>
        </Section>

        <Section title="Delivery address" delay={220}>
          <View style={styles.card}>
            <AddressBlock address={order.address} />
          </View>
        </Section>

        <Section title="Payment" delay={260}>
          <View style={styles.card}>
            <AppText variant="bodyMedium">{paymentLabels[order.paymentMethod]}</AppText>
          </View>
          <OrderSummary subtotal={order.subtotal} delivery={order.delivery} discount={order.discount} total={order.total} />
        </Section>

        <Section title="Need help?" delay={300}>
          <View style={[styles.card, styles.helpCard]}>
            <ListRow icon="refresh-ccw" title="Return or exchange" subtitle="Free within 30 days of delivery" onPress={() => router.push('/account/help')} />
            <ListRow icon="message-circle" title="Contact us" subtitle="care@vuyostore.in · 10am–8pm" onPress={() => router.push('/account/help')} last />
          </View>
        </Section>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  content: { paddingHorizontal: gutter, paddingTop: spacing.md, paddingBottom: spacing.huge, gap: spacing.xxl },
  hero: { gap: spacing.sm },
  section: { gap: spacing.md },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  helpCard: { paddingVertical: 0 },
  item: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md },
  itemBorder: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line },
  thumb: { width: 56, height: 70, borderRadius: radius.sm },
  price: { marginTop: spacing.xs },
});
