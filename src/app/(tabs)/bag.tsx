import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeOut, LinearTransition } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BagItemRow } from '@/components/checkout/BagItemRow';
import { FreeDeliveryMeter } from '@/components/checkout/FreeDeliveryMeter';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { AppText, Button, EmptyState, Icon, PressableScale } from '@/components/ui';
import { haptics } from '@/lib/haptics';
import { useBagSummary } from '@/lib/hooks';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import { colors, fonts, gutter, radius, shadows, spacing } from '@/theme';

function PromoCode() {
  const promoCode = useCartStore((s) => s.promoCode);
  const applyPromo = useCartStore((s) => s.applyPromo);
  const clearPromo = useCartStore((s) => s.clearPromo);
  const [code, setCode] = useState('');
  const [error, setError] = useState<string>();

  if (promoCode) {
    return (
      <Animated.View entering={FadeIn} style={styles.promoApplied}>
        <Icon name="tag" size={16} color="success" />
        <AppText variant="smallMedium" style={styles.flex}>
          {promoCode} applied
        </AppText>
        <PressableScale onPress={clearPromo} hitSlop={10} accessibilityLabel={`Remove promo code ${promoCode}`}>
          <AppText variant="caption" color="inkSecondary" style={styles.underline}>
            Remove
          </AppText>
        </PressableScale>
      </Animated.View>
    );
  }

  const submit = () => {
    if (!code.trim()) return;
    if (applyPromo(code)) {
      haptics.success();
      setCode('');
      setError(undefined);
    } else {
      haptics.warning();
      setError('That code isn’t valid. Try WELCOME10.');
    }
  };

  return (
    <View style={styles.promoWrap}>
      <View style={[styles.promoField, error ? styles.promoError : null]}>
        <Icon name="tag" size={16} color="inkMuted" />
        <TextInput
          value={code}
          onChangeText={(t) => {
            setCode(t);
            if (error) setError(undefined);
          }}
          placeholder="Promo code"
          placeholderTextColor={colors.inkMuted}
          autoCapitalize="characters"
          autoCorrect={false}
          returnKeyType="done"
          onSubmitEditing={submit}
          style={styles.promoInput}
          selectionColor={colors.ink}
          accessibilityLabel="Promo code"
        />
        <PressableScale onPress={submit} disabled={!code.trim()} hitSlop={6} accessibilityLabel="Apply promo code" style={styles.apply}>
          <AppText variant="smallMedium">Apply</AppText>
        </PressableScale>
      </View>
      {error ? (
        <Animated.View entering={FadeInDown.duration(200)}>
          <AppText variant="caption" color="sale">
            {error}
          </AppText>
        </Animated.View>
      ) : null}
    </View>
  );
}

export default function BagScreen() {
  const insets = useSafeAreaInsets();
  const summary = useBagSummary();
  const empty = summary.lines.length === 0;
  const promoCode = useCartStore((s) => s.promoCode);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <AppText variant="h1" accessibilityRole="header">
          Bag
        </AppText>
        {!empty ? (
          <Animated.View key={summary.itemCount} entering={FadeIn.duration(250)}>
            <AppText variant="small" color="inkMuted">
              {summary.itemCount} {summary.itemCount === 1 ? 'item' : 'items'}
            </AppText>
          </Animated.View>
        ) : null}
      </View>

      {empty ? (
        <EmptyState
          icon="shopping-bag"
          title="Your bag is empty."
          body="Pieces you add will wait here for you. Start with something you will wear every day."
          ctaLabel="Explore Collection"
          onCta={() => router.navigate('/shop')}
        />
      ) : (
        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
            <FreeDeliveryMeter subtotal={summary.subtotal} />

            <View style={styles.items}>
              {summary.lines.map((line) => (
                <Animated.View key={line.key} layout={LinearTransition.duration(260)} entering={FadeInDown.duration(300)} exiting={FadeOut.duration(200)}>
                  <BagItemRow line={line} />
                </Animated.View>
              ))}
            </View>

            <AppText variant="caption" color="inkMuted" align="center">
              Swipe left on an item to remove it
            </AppText>

            <Animated.View layout={LinearTransition.duration(260)} style={styles.summaryBlock}>
              <PromoCode />
              <OrderSummary
                subtotal={summary.subtotal}
                delivery={summary.delivery}
                discount={summary.discount}
                total={summary.total}
                itemCount={summary.itemCount}
                savings={summary.savings}
                promoLabel={promoCode}
              />
            </Animated.View>
          </ScrollView>

          <View style={styles.checkoutBar}>
            <View>
              <AppText variant="caption" color="inkMuted">
                Total
              </AppText>
              <AppText variant="title">{formatPrice(summary.total)}</AppText>
            </View>
            <Button label="Continue to Checkout" icon="arrow-right" onPress={() => router.push('/checkout/delivery')} style={styles.flex} />
          </View>
        </KeyboardAvoidingView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', paddingHorizontal: gutter, paddingTop: spacing.md, paddingBottom: spacing.lg },
  content: { paddingHorizontal: gutter, paddingBottom: spacing.xxxl, gap: spacing.xl },
  items: { gap: spacing.lg },
  summaryBlock: { gap: spacing.lg },
  promoWrap: { gap: spacing.xs },
  promoField: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    paddingLeft: spacing.lg,
  },
  promoError: { borderColor: colors.sale },
  promoInput: { flex: 1, height: '100%', fontFamily: fonts.sansMedium, fontSize: 14, letterSpacing: 1, color: colors.ink },
  apply: { height: '100%', paddingHorizontal: spacing.lg, justifyContent: 'center' },
  promoApplied: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.successSoft,
  },
  underline: { textDecorationLine: 'underline' },
  checkoutBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    paddingHorizontal: gutter,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.line,
    ...shadows.soft,
  },
});
