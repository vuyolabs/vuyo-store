import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { OrderCard } from '@/components/orders/OrderCard';
import { Chip, EmptyState, ScreenHeader } from '@/components/ui';
import { useOrderStore } from '@/store/orderStore';
import { colors, gutter, spacing } from '@/theme';

type Filter = 'all' | 'active' | 'delivered';

const filters: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'In progress' },
  { id: 'delivered', label: 'Delivered' },
];

export default function OrdersScreen() {
  const orders = useOrderStore((s) => s.orders);
  const [filter, setFilter] = useState<Filter>('all');

  const visible = useMemo(
    () => orders.filter((o) => (filter === 'all' ? true : filter === 'delivered' ? o.status === 'delivered' : o.status !== 'delivered')),
    [orders, filter],
  );

  return (
    <View style={styles.root}>
      <ScreenHeader title="My Orders" />
      <View style={styles.chipBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {filters.map((f) => (
            <Chip
              key={f.id}
              label={f.label}
              count={f.id === 'all' ? orders.length : orders.filter((o) => (f.id === 'delivered' ? o.status === 'delivered' : o.status !== 'delivered')).length}
              selected={filter === f.id}
              onPress={() => setFilter(f.id)}
            />
          ))}
        </ScrollView>
      </View>
      <FlatList
        key={filter}
        data={visible}
        keyExtractor={(o) => o.id}
        contentContainerStyle={[styles.list, visible.length === 0 && styles.grow]}
        ItemSeparatorComponent={() => <View style={{ height: spacing.lg }} />}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay(index * 70).duration(400)}>
            <OrderCard order={item} />
          </Animated.View>
        )}
        ListEmptyComponent={
          <EmptyState
            icon="package"
            title={filter === 'all' ? 'No orders yet.' : filter === 'active' ? 'Nothing on the way.' : 'No deliveries yet.'}
            body="When you place an order, you can track every step of its journey here."
            ctaLabel="Explore Collection"
            onCta={() => router.dismissTo('/shop')}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  chipBar: { height: 38 + spacing.md * 2 },
  chips: { paddingHorizontal: gutter, alignItems: 'center', gap: spacing.sm },
  list: { paddingHorizontal: gutter, paddingTop: spacing.sm, paddingBottom: spacing.huge },
  grow: { flexGrow: 1 },
});
