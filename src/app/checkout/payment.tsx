import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, LinearTransition } from 'react-native-reanimated';

import { CheckoutFooter } from '@/components/checkout/CheckoutFooter';
import { CheckoutHeader } from '@/components/checkout/CheckoutHeader';
import { SelectableCard } from '@/components/checkout/SelectableCard';
import { AppText, Icon, type IconName } from '@/components/ui';
import { paymentMethods } from '@/data/store-info';
import type { PaymentMethod } from '@/data/types';
import { useBagSummary } from '@/lib/hooks';
import { useCheckoutStore } from '@/store/checkoutStore';
import { colors, fonts, gutter, radius, spacing } from '@/theme';

const icons: Record<PaymentMethod, IconName> = { upi: 'smartphone', card: 'credit-card', cod: 'dollar-sign' };

function UpiDetail() {
  return (
    <Animated.View entering={FadeIn.duration(250)} style={styles.detail}>
      <View style={styles.upiRow}>
        <AppText variant="small" color="inkSecondary">
          Pay to
        </AppText>
        <AppText variant="smallMedium">aasif@okvuyo</AppText>
      </View>
      <View style={styles.apps}>
        {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map((app) => (
          <View key={app} style={styles.appChip}>
            <AppText variant="caption">{app}</AppText>
          </View>
        ))}
      </View>
    </Animated.View>
  );
}

function CardDetail() {
  return (
    <Animated.View entering={FadeIn.duration(250)} style={styles.detail}>
      <LinearGradient colors={['#2A2724', '#141312']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.card} accessible accessibilityLabel="Demo Visa card ending 4242, expires 08 29">
        <View style={styles.cardTop}>
          <AppText variant="overline" color="white" style={styles.cardBrand}>
            Vuyo Demo
          </AppText>
          <AppText variant="smallMedium" color="white" style={styles.visa}>
            VISA
          </AppText>
        </View>
        <AppText color="white" style={styles.cardNumber}>
          •••• •••• •••• 4242
        </AppText>
        <View style={styles.cardBottom}>
          <AppText variant="caption" color="white">
            AASIF ALI
          </AppText>
          <AppText variant="caption" color="white">
            08/29
          </AppText>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

function CodDetail() {
  return (
    <Animated.View entering={FadeIn.duration(250)} style={[styles.detail, styles.codRow]}>
      <Icon name="info" size={14} color="inkMuted" />
      <AppText variant="caption" color="inkSecondary" style={styles.flex}>
        Pay by cash or UPI when your order arrives. No extra charge.
      </AppText>
    </Animated.View>
  );
}

export default function PaymentScreen() {
  const summary = useBagSummary();
  const method = useCheckoutStore((s) => s.paymentMethod);
  const setMethod = useCheckoutStore((s) => s.setPaymentMethod);

  return (
    <View style={styles.root}>
      <CheckoutHeader step={1} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(400)} style={styles.section}>
          <AppText variant="h2" accessibilityRole="header">
            How would you like to pay?
          </AppText>
          <View style={styles.list} accessibilityRole="radiogroup">
            {paymentMethods.map((m, i) => (
              <Animated.View key={m.id} entering={FadeInDown.delay(60 * i).duration(350)} layout={LinearTransition.duration(250)}>
                <SelectableCard selected={method === m.id} onPress={() => setMethod(m.id)} accessibilityLabel={`${m.title}. ${m.subtitle}`}>
                  <View style={styles.methodRow}>
                    <View style={styles.flex}>
                      <AppText variant="bodyMedium">{m.title}</AppText>
                      <AppText variant="caption" color="inkMuted">
                        {m.subtitle}
                      </AppText>
                    </View>
                    <Icon name={icons[m.id]} size={18} color="inkSecondary" />
                  </View>
                  {method === m.id ? m.id === 'upi' ? <UpiDetail /> : m.id === 'card' ? <CardDetail /> : <CodDetail /> : null}
                </SelectableCard>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        <View style={styles.secure}>
          <Icon name="lock" size={14} color="inkMuted" />
          <AppText variant="caption" color="inkMuted" style={styles.flex}>
            Demo checkout — no payment will be taken. In production, payments are encrypted and processed by a PCI-DSS compliant partner.
          </AppText>
        </View>
      </ScrollView>

      <CheckoutFooter total={summary.total} label="Review Order" onPress={() => router.push('/checkout/review')} disabled={summary.lines.length === 0} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  content: { padding: gutter, gap: spacing.xxl, paddingBottom: spacing.huge },
  section: { gap: spacing.lg },
  list: { gap: spacing.md },
  methodRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  detail: { marginTop: spacing.md },
  upiRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line },
  apps: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap', marginTop: spacing.xs },
  appChip: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs + 2, borderRadius: radius.pill, backgroundColor: colors.surfaceMuted },
  card: { borderRadius: radius.lg, padding: spacing.lg, height: 150, justifyContent: 'space-between' },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardBrand: { opacity: 0.7, fontSize: 10 },
  visa: { fontStyle: 'italic', letterSpacing: 1 },
  cardNumber: { fontFamily: fonts.sansMedium, fontSize: 18, letterSpacing: 2 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between' },
  codRow: { flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start' },
  secure: { flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start' },
});
