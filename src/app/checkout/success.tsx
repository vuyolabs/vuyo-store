import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { BackHandler, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { Easing, FadeIn, FadeInDown, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withSpring, withTiming, ZoomIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppImage, AppText, Button, Icon } from '@/components/ui';
import { paymentLabels } from '@/data/store-info';
import { haptics } from '@/lib/haptics';
import { addBusinessDays, formatPrice, formatShortDate } from '@/lib/utils';
import { useOrder } from '@/store/orderStore';
import { colors, gutter, radius, spacing } from '@/theme';

function goHome() {
  router.dismissAll();
  router.navigate('/');
}

function SuccessMark() {
  const ring = useSharedValue(0);

  useEffect(() => {
    ring.set(withDelay(250, withRepeat(withTiming(1, { duration: 1800, easing: Easing.out(Easing.quad) }), 2, false)));
  }, [ring]);

  const ringStyle = useAnimatedStyle(() => ({
    opacity: 0.35 * (1 - ring.get()),
    transform: [{ scale: 1 + ring.get() * 0.9 }],
  }));

  return (
    <View style={styles.markWrap}>
      <Animated.View style={[styles.ring, ringStyle]} />
      <Animated.View entering={ZoomIn.springify().damping(12).stiffness(160)} style={styles.mark}>
        <Animated.View entering={ZoomIn.delay(220).springify().damping(10)}>
          <Icon name="check" size={36} color="white" />
        </Animated.View>
      </Animated.View>
    </View>
  );
}

export default function OrderSuccessScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const order = useOrder(orderId);
  const insets = useSafeAreaInsets();
  const cardLift = useSharedValue(0);

  useEffect(() => {
    const t = setTimeout(() => haptics.success(), 200);
    cardLift.set(withDelay(500, withSequence(withTiming(-4, { duration: 200 }), withSpring(0, { damping: 10 }))));
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      goHome();
      return true;
    });
    return () => {
      clearTimeout(t);
      sub.remove();
    };
  }, [cardLift]);

  const cardStyle = useAnimatedStyle(() => ({ transform: [{ translateY: cardLift.get() }] }));

  const from = order ? formatShortDate(addBusinessDays(new Date(order.createdAt), 3).toISOString()) : '';
  const to = order ? formatShortDate(order.estimatedDelivery) : '';

  return (
    <ScrollView style={styles.root} contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.xxxl, paddingBottom: insets.bottom + spacing.lg }]} showsVerticalScrollIndicator={false} bounces={false}>
      <View style={styles.top}>
        <SuccessMark />
        <Animated.View entering={FadeInDown.delay(350).duration(500)} style={styles.titles}>
          <AppText variant="h1" align="center" accessibilityRole="header">
            Order confirmed
          </AppText>
          <AppText variant="body" color="inkSecondary" align="center">
            Thanks for shopping with Vuyo Store.{'\n'}We’ll let you know when it ships.
          </AppText>
        </Animated.View>

        {order ? (
          <Animated.View entering={FadeInDown.delay(500).duration(500)} style={[styles.card, cardStyle]}>
            <View style={styles.cardRow}>
              <View>
                <AppText variant="caption" color="inkMuted">
                  Order
                </AppText>
                <AppText variant="title" selectable>
                  #{order.id}
                </AppText>
              </View>
              <View style={styles.right}>
                <AppText variant="caption" color="inkMuted">
                  Total
                </AppText>
                <AppText variant="title">{formatPrice(order.total)}</AppText>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Icon name="truck" size={16} />
              <View style={styles.flex}>
                <AppText variant="smallMedium">Estimated delivery</AppText>
                <AppText variant="small" color="inkSecondary">
                  3–5 business days · {from} – {to}
                </AppText>
              </View>
            </View>
            <View style={styles.infoRow}>
              <Icon name="credit-card" size={16} />
              <AppText variant="small" color="inkSecondary" style={styles.flex}>
                {paymentLabels[order.paymentMethod]}
              </AppText>
            </View>

            <View style={styles.thumbs}>
              {order.items.slice(0, 4).map((i) => (
                <Animated.View key={`${i.productId}-${i.color}-${i.size}`} entering={FadeIn.delay(700).duration(400)}>
                  <AppImage uri={i.image} style={styles.thumb} accessibilityLabel={i.name} />
                </Animated.View>
              ))}
              {order.items.length > 4 ? (
                <View style={[styles.thumb, styles.more]}>
                  <AppText variant="smallMedium">+{order.items.length - 4}</AppText>
                </View>
              ) : null}
            </View>
          </Animated.View>
        ) : null}
      </View>

      <Animated.View entering={FadeInDown.delay(700).duration(500)} style={styles.actions}>
        <Button
          label="Track Order"
          icon="map-pin"
          fullWidth
          onPress={() => {
            if (!order) return;
            router.replace({ pathname: '/orders/[id]', params: { id: order.id } });
          }}
        />
        <Button label="Continue Shopping" variant="secondary" fullWidth onPress={goHome} />
      </Animated.View>
    </ScrollView>
  );
}

const MARK = 88;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { flexGrow: 1, paddingHorizontal: gutter, justifyContent: 'space-between', gap: spacing.xxxl },
  top: { alignItems: 'center', gap: spacing.xxl },
  flex: { flex: 1 },
  markWrap: { width: MARK * 2, height: MARK * 1.6, alignItems: 'center', justifyContent: 'center' },
  ring: { position: 'absolute', width: MARK, height: MARK, borderRadius: MARK / 2, backgroundColor: colors.success },
  mark: { width: MARK, height: MARK, borderRadius: MARK / 2, backgroundColor: colors.success, alignItems: 'center', justifyContent: 'center' },
  titles: { gap: spacing.sm },
  card: { alignSelf: 'stretch', backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.xl, gap: spacing.md, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between' },
  right: { alignItems: 'flex-end' },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.line },
  infoRow: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  thumbs: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xs },
  thumb: { width: 48, height: 60, borderRadius: radius.sm },
  more: { backgroundColor: colors.surfaceMuted, alignItems: 'center', justifyContent: 'center' },
  actions: { gap: spacing.md },
});
