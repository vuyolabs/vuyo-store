import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeOut, LinearTransition } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PriceTag } from '@/components/product';
import { QuickAddSheet } from '@/components/product/QuickAddSheet';
import { AppImage, AppText, Button, EmptyState, Icon, PressableScale } from '@/components/ui';
import { getProduct } from '@/data/products';
import type { Product } from '@/data/types';
import { haptics } from '@/lib/haptics';
import { useUIStore } from '@/store/uiStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { colors, gutter, radius, spacing } from '@/theme';

const GAP = spacing.md;

export default function WishlistScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const cardWidth = (width - gutter * 2 - GAP) / 2;
  const ids = useWishlistStore((s) => s.ids);
  const remove = useWishlistStore((s) => s.remove);
  const showToast = useUIStore((s) => s.showToast);
  const [quickAdd, setQuickAdd] = useState<Product>();

  const items = useMemo(() => ids.map((id) => getProduct(id)).filter((p): p is Product => !!p), [ids]);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <AppText variant="h1" accessibilityRole="header">
          Wishlist
        </AppText>
        {items.length > 0 ? (
          <Animated.View key={items.length} entering={FadeIn.duration(250)}>
            <AppText variant="small" color="inkMuted">
              {items.length} saved
            </AppText>
          </Animated.View>
        ) : null}
      </View>

      {items.length === 0 ? (
        <EmptyState
          icon="heart"
          title="Your wishlist is waiting."
          body="Tap the heart on anything you love and it will be saved here for later."
          ctaLabel="Explore Collection"
          onCta={() => router.navigate('/shop')}
        />
      ) : (
        <Animated.FlatList
          data={items}
          keyExtractor={(p) => p.id}
          numColumns={2}
          columnWrapperStyle={{ gap: GAP }}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={{ height: spacing.xxl }} />}
          showsVerticalScrollIndicator={false}
          itemLayoutAnimation={LinearTransition.duration(280)}
          renderItem={({ item, index }) => (
            <Animated.View entering={FadeInDown.delay(Math.min(index, 6) * 50).duration(380)} exiting={FadeOut.duration(180)} style={{ width: cardWidth }}>
              <PressableScale scaleTo={0.98} onPress={() => router.push({ pathname: '/product/[id]', params: { id: item.id } })} accessibilityLabel={item.name} accessibilityHint="Opens product details">
                <AppImage uri={item.images[0]} style={[styles.image, { height: cardWidth * 1.28 }]} />
              </PressableScale>
              <PressableScale
                onPress={() => {
                  haptics.selection();
                  remove(item.id);
                }}
                scaleTo={0.85}
                style={styles.remove}
                accessibilityLabel={`Remove ${item.name} from wishlist`}>
                <Icon name="x" size={15} />
              </PressableScale>
              <View style={styles.meta}>
                <AppText variant="smallMedium" numberOfLines={1}>
                  {item.name}
                </AppText>
                <PriceTag price={item.price} originalPrice={item.originalPrice} />
              </View>
              <Button label="Add to Bag" variant="secondary" size="sm" fullWidth onPress={() => setQuickAdd(item)} accessibilityLabel={`Add ${item.name} to bag`} />
            </Animated.View>
          )}
        />
      )}

      <QuickAddSheet
        product={quickAdd}
        onClose={() => setQuickAdd(undefined)}
        onAdded={(p, color, size) =>
          showToast({ title: 'Added to Bag', message: `${p.name} · ${color}${size ? ` · ${size}` : ''}`, image: p.images[0], action: { label: 'View Bag', href: '/bag' } })
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', paddingHorizontal: gutter, paddingTop: spacing.md, paddingBottom: spacing.lg },
  list: { paddingHorizontal: gutter, paddingBottom: spacing.huge },
  image: { width: '100%', borderRadius: radius.md },
  remove: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  meta: { paddingVertical: spacing.md, gap: 3 },
});
