import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeOut, LinearTransition } from 'react-native-reanimated';

import { AddressBlock } from '@/components/checkout/AddressBlock';
import { AddressForm } from '@/components/checkout/AddressForm';
import { CheckoutFooter } from '@/components/checkout/CheckoutFooter';
import { CheckoutHeader } from '@/components/checkout/CheckoutHeader';
import { SelectableCard } from '@/components/checkout/SelectableCard';
import { AppText, EmptyState, Icon, PressableScale } from '@/components/ui';
import { useBagSummary } from '@/lib/hooks';
import { addBusinessDays, formatShortDate } from '@/lib/utils';
import { useCheckoutStore } from '@/store/checkoutStore';
import { usePreferencesStore } from '@/store/preferencesStore';
import { colors, gutter, radius, spacing } from '@/theme';

export default function DeliveryScreen() {
  const summary = useBagSummary();
  const addresses = usePreferencesStore((s) => s.addresses);
  const defaultAddressId = usePreferencesStore((s) => s.defaultAddressId);
  const addAddress = usePreferencesStore((s) => s.addAddress);
  const selectedId = useCheckoutStore((s) => s.addressId) ?? defaultAddressId;
  const setAddress = useCheckoutStore((s) => s.setAddress);
  const [adding, setAdding] = useState(addresses.length === 0);

  const arrival = `${formatShortDate(addBusinessDays(new Date(), 3).toISOString())} – ${formatShortDate(addBusinessDays(new Date(), 5).toISOString())}`;
  const hasSelection = addresses.some((a) => a.id === selectedId);

  if (summary.lines.length === 0) {
    return (
      <View style={styles.root}>
        <CheckoutHeader step={0} />
        <EmptyState icon="shopping-bag" title="Your bag is empty." body="Add something you love before checking out." ctaLabel="Explore Collection" onCta={() => router.dismissTo('/shop')} />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <CheckoutHeader step={0} />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.duration(400)} style={styles.section}>
            <AppText variant="h2" accessibilityRole="header">
              Where should we deliver?
            </AppText>
            <View style={styles.list} accessibilityRole="radiogroup">
              {addresses.map((a, i) => (
                <Animated.View key={a.id} entering={FadeInDown.delay(60 * i).duration(350)} layout={LinearTransition}>
                  <SelectableCard selected={a.id === selectedId} onPress={() => setAddress(a.id)} accessibilityLabel={`${a.label}: ${a.line1}, ${a.city}`}>
                    <AddressBlock address={a} />
                  </SelectableCard>
                </Animated.View>
              ))}
            </View>

            {adding ? (
              <Animated.View entering={FadeIn.duration(250)} exiting={FadeOut.duration(150)} layout={LinearTransition} style={styles.formCard}>
                <AppText variant="title">New address</AppText>
                <AddressForm
                  onSave={(addr) => {
                    addAddress(addr);
                    setAddress(addr.id);
                    setAdding(false);
                  }}
                  onCancel={addresses.length > 0 ? () => setAdding(false) : undefined}
                />
              </Animated.View>
            ) : (
              <Animated.View layout={LinearTransition}>
                <PressableScale onPress={() => setAdding(true)} haptic="selection" style={styles.addButton} accessibilityLabel="Add a new address">
                  <Icon name="plus" size={18} />
                  <AppText variant="bodyMedium">Add a new address</AppText>
                </PressableScale>
              </Animated.View>
            )}
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(120).duration(400)} layout={LinearTransition} style={styles.section}>
            <AppText variant="overline" color="inkMuted">
              Delivery method
            </AppText>
            <View style={styles.method}>
              <Icon name="truck" size={18} />
              <View style={styles.flex}>
                <AppText variant="bodyMedium">Standard delivery</AppText>
                <AppText variant="small" color="inkSecondary">
                  Arrives {arrival}
                </AppText>
              </View>
              <AppText variant="smallMedium" color={summary.delivery === 0 ? 'success' : 'ink'}>
                {summary.delivery === 0 ? 'Free' : `₹${summary.delivery}`}
              </AppText>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      <CheckoutFooter
        total={summary.total}
        label="Continue to Payment"
        disabled={!hasSelection || adding}
        onPress={() => {
          setAddress(selectedId);
          router.push('/checkout/payment');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  content: { padding: gutter, gap: spacing.xxxl, paddingBottom: spacing.huge },
  section: { gap: spacing.lg },
  list: { gap: spacing.md },
  formCard: { gap: spacing.lg, padding: spacing.lg, borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: 56,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.lineStrong,
  },
  method: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg, padding: spacing.lg, borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
});
