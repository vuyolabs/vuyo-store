import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText, ListRow, PressableScale } from '@/components/ui';
import { haptics } from '@/lib/haptics';
import { selectBagCount, useCartStore } from '@/store/cartStore';
import { useOrderStore } from '@/store/orderStore';
import { usePreferencesStore } from '@/store/preferencesStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { colors, fonts, gutter, radius, spacing } from '@/theme';

function Stat({ label, value, onPress }: { label: string; value: number; onPress: () => void }) {
  return (
    <PressableScale onPress={onPress} haptic="selection" style={styles.stat} accessibilityLabel={`${value} ${label}`}>
      <AppText variant="h2">{value}</AppText>
      <AppText variant="caption" color="inkMuted">
        {label}
      </AppText>
    </PressableScale>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const orders = useOrderStore((s) => s.orders);
  const wishCount = useWishlistStore((s) => s.ids.length);
  const bagCount = useCartStore(selectBagCount);
  const sizes = usePreferencesStore((s) => s.sizes);
  const addresses = usePreferencesStore((s) => s.addresses);
  const notifications = usePreferencesStore((s) => s.notifications);
  const activeOrders = orders.filter((o) => o.status !== 'delivered').length;
  const enabledNotifications = Object.values(notifications).filter(Boolean).length;

  return (
    <ScrollView style={styles.root} contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.lg }]} showsVerticalScrollIndicator={false}>
      <Animated.View entering={FadeInDown.duration(450)} style={styles.identity}>
        <View style={styles.avatar}>
          <AppText style={styles.initials} color="white">
            AA
          </AppText>
        </View>
        <View style={styles.flex}>
          <AppText variant="h1" accessibilityRole="header">
            Aasif Ali
          </AppText>
          <View style={styles.badgeRow}>
            <View style={styles.pill}>
              <AppText variant="overline" style={styles.pillText}>
                Demo Account
              </AppText>
            </View>
            <AppText variant="caption" color="inkMuted">
              Member since 2024
            </AppText>
          </View>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(80).duration(450)} style={styles.stats}>
        <Stat label="Orders" value={orders.length} onPress={() => router.push('/orders')} />
        <View style={styles.statDivider} />
        <Stat label="Wishlist" value={wishCount} onPress={() => router.navigate('/wishlist')} />
        <View style={styles.statDivider} />
        <Stat label="In Bag" value={bagCount} onPress={() => router.navigate('/bag')} />
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(140).duration(450)} style={styles.group}>
        <AppText variant="overline" color="inkMuted" style={styles.groupTitle}>
          Shopping
        </AppText>
        <ListRow icon="package" title="My Orders" subtitle={activeOrders ? `${activeOrders} on the way` : 'All orders delivered'} onPress={() => router.push('/orders')} />
        <ListRow icon="heart" title="Wishlist" subtitle={`${wishCount} saved ${wishCount === 1 ? 'piece' : 'pieces'}`} onPress={() => router.navigate('/wishlist')} />
        <ListRow icon="map-pin" title="Saved Addresses" subtitle={`${addresses.length} saved`} onPress={() => router.push('/account/addresses')} />
        <ListRow icon="maximize-2" title="Size Preferences" subtitle={`Clothing ${sizes.clothing ?? '—'} · Shoes UK ${sizes.shoes ?? '—'}`} onPress={() => router.push('/account/sizes')} last />
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(200).duration(450)} style={styles.group}>
        <AppText variant="overline" color="inkMuted" style={styles.groupTitle}>
          Settings
        </AppText>
        <ListRow icon="bell" title="Notifications" subtitle={`${enabledNotifications} of 4 enabled`} onPress={() => router.push('/account/notifications')} />
        <ListRow icon="help-circle" title="Help & Support" subtitle="Delivery, returns, sizing" onPress={() => router.push('/account/help')} />
        <ListRow icon="info" title="About Vuyo Store" subtitle="Our story and craft" onPress={() => router.push('/account/about')} last />
      </Animated.View>

      <View style={styles.footer}>
        <PressableScale
          onPress={() => {
            haptics.selection();
            usePreferencesStore.setState({ hasOnboarded: false });
          }}
          hitSlop={8}
          accessibilityLabel="Replay the welcome introduction">
          <AppText variant="smallMedium" style={styles.underline}>
            Replay introduction
          </AppText>
        </PressableScale>
        <AppText variant="caption" color="inkMuted" align="center">
          Vuyo Store 1.0 · Crafted by Vuyo Labs{'\n'}This is a demo — no real payments or accounts.
        </AppText>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: gutter, paddingBottom: spacing.huge, gap: spacing.xxl },
  flex: { flex: 1 },
  identity: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  avatar: { width: 68, height: 68, borderRadius: 34, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' },
  initials: { fontFamily: fonts.display, fontSize: 24, letterSpacing: 1 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.xs },
  pill: { backgroundColor: colors.accentSoft, borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 3 },
  pillText: { fontSize: 9.5, color: colors.accent },
  stats: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: radius.lg, paddingVertical: spacing.lg, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  stat: { flex: 1, alignItems: 'center', gap: 2 },
  statDivider: { width: StyleSheet.hairlineWidth, backgroundColor: colors.line },
  group: { backgroundColor: colors.surface, borderRadius: radius.lg, paddingHorizontal: spacing.lg, paddingTop: spacing.lg, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  groupTitle: { marginBottom: spacing.xs },
  footer: { alignItems: 'center', gap: spacing.lg, paddingTop: spacing.md },
  underline: { textDecorationLine: 'underline' },
});
