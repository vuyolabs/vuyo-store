import { router } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AddressBlock } from '@/components/checkout/AddressBlock';
import { CheckoutFooter } from '@/components/checkout/CheckoutFooter';
import { CheckoutHeader } from '@/components/checkout/CheckoutHeader';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { AppImage, AppText, EmptyState, PressableScale } from '@/components/ui';
import { paymentLabels } from '@/data/store-info';
import { haptics } from '@/lib/haptics';
import { useBagSummary } from '@/lib/hooks';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import { useCheckoutStore } from '@/store/checkoutStore';
import { useOrderStore } from '@/store/orderStore';
import { usePreferencesStore } from '@/store/preferencesStore';
import { colors, gutter, radius, spacing } from '@/theme';

function Block({ title, actionLabel, onAction, children, delay }: { title: string; actionLabel?: string; onAction?: () => void; children: ReactNode; delay: number }) {
  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(400)} style={styles.block}>
      <View style={styles.blockHeader}>
        <AppText variant="overline" color="inkMuted">
          {title}
        </AppText>
        {actionLabel && onAction ? (
          <PressableScale onPress={onAction} hitSlop={10} accessibilityLabel={`${actionLabel} ${title}`}>
            <AppText variant="smallMedium" style={styles.underline}>
              {actionLabel}
            </AppText>
          </PressableScale>
        ) : null}
      </View>
      {children}
    </Animated.View>
  );
}

export default function ReviewScreen() {
  const summary = useBagSummary();
  const promoCode = useCartStore((s) => s.promoCode);
  const clearBag = useCartStore((s) => s.clear);
  const addresses = usePreferencesStore((s) => s.addresses);
  const defaultAddressId = usePreferencesStore((s) => s.defaultAddressId);
  const addressId = useCheckoutStore((s) => s.addressId) ?? defaultAddressId;
  const paymentMethod = useCheckoutStore((s) => s.paymentMethod);
  const resetCheckout = useCheckoutStore((s) => s.reset);
  const placeOrder = useOrderStore((s) => s.placeOrder);
  const [placing, setPlacing] = useState(false);

  const address = addresses.find((a) => a.id === addressId);

  if (summary.lines.length === 0 && !placing) {
    return (
      <View style={styles.root}>
        <CheckoutHeader step={2} />
        <EmptyState icon="shopping-bag" title="Your bag is empty." body="Add something you love before checking out." ctaLabel="Explore Collection" onCta={() => router.dismissTo('/shop')} />
      </View>
    );
  }

  const submit = () => {
    if (!address || placing) return;
    setPlacing(true);
    haptics.medium();
    // Simulate a short authorisation round-trip for a believable checkout.
    setTimeout(() => {
      const order = placeOrder({
        items: summary.lines.map((l) => ({
          productId: l.productId,
          name: l.product.name,
          image: l.product.images[0],
          color: l.color,
          size: l.size,
          quantity: l.quantity,
          unitPrice: l.product.price,
        })),
        subtotal: summary.subtotal,
        delivery: summary.delivery,
        discount: summary.discount,
        total: summary.total,
        address,
        paymentMethod,
      });
      router.dismissAll();
      router.push({ pathname: '/checkout/success', params: { orderId: order.id } });
      clearBag();
      resetCheckout();
    }, 1400);
  };

  return (
    <View style={styles.root}>
      <CheckoutHeader step={2} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(400)}>
          <AppText variant="h2" accessibilityRole="header">
            Review your order
          </AppText>
        </Animated.View>

        <Block title={`Items (${summary.itemCount})`} actionLabel="Edit" onAction={() => router.dismissTo('/bag')} delay={60}>
          {summary.lines.map((l) => (
            <View key={l.key} style={styles.item}>
              <AppImage uri={l.product.images[0]} style={styles.thumb} />
              <View style={styles.flex}>
                <AppText variant="smallMedium" numberOfLines={1}>
                  {l.product.name}
                </AppText>
                <AppText variant="caption" color="inkMuted">
                  {[l.color, l.size ? `Size ${l.size}` : null, `Qty ${l.quantity}`].filter(Boolean).join(' · ')}
                </AppText>
              </View>
              <AppText variant="smallMedium">{formatPrice(l.lineTotal)}</AppText>
            </View>
          ))}
        </Block>

        <Block title="Delivering to" actionLabel="Change" onAction={() => router.dismissTo('/checkout/delivery')} delay={120}>
          {address ? <AddressBlock address={address} /> : <AppText variant="small" color="sale">Please choose a delivery address.</AppText>}
        </Block>

        <Block title="Payment" actionLabel="Change" onAction={() => router.back()} delay={180}>
          <AppText variant="bodyMedium">{paymentLabels[paymentMethod]}</AppText>
        </Block>

        <Animated.View entering={FadeInDown.delay(240).duration(400)}>
          <OrderSummary subtotal={summary.subtotal} delivery={summary.delivery} discount={summary.discount} total={summary.total} itemCount={summary.itemCount} savings={summary.savings} promoLabel={promoCode} />
        </Animated.View>

        <AppText variant="caption" color="inkMuted" align="center">
          By placing this order you agree to Vuyo Store’s terms of sale. This is a demo — no payment will be taken.
        </AppText>
      </ScrollView>

      <CheckoutFooter total={summary.total} label={placing ? 'Placing order…' : 'Place Order'} loading={placing} disabled={!address} onPress={submit} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  content: { padding: gutter, gap: spacing.xl, paddingBottom: spacing.huge },
  block: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.md, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  blockHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  underline: { textDecorationLine: 'underline' },
  item: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  thumb: { width: 48, height: 60, borderRadius: radius.sm },
});
