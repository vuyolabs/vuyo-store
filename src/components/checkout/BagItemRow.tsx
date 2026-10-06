import { router } from 'expo-router';
import { useRef } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import ReanimatedSwipeable, { type SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';
import Animated, { interpolate, useAnimatedStyle, type SharedValue } from 'react-native-reanimated';

import { PriceTag } from '@/components/product';
import { AppImage, AppText, Icon, PressableScale, QuantityStepper } from '@/components/ui';
import { haptics } from '@/lib/haptics';
import type { BagLine } from '@/lib/pricing';
import { MAX_QUANTITY, useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { colors, radius, spacing } from '@/theme';

const ACTION_WIDTH = 88;

function RemoveAction({ progress, onPress }: { progress: SharedValue<number>; onPress: () => void }) {
  const style = useAnimatedStyle(() => ({
    opacity: interpolate(progress.get(), [0, 0.6, 1], [0, 0.6, 1], 'clamp'),
    transform: [{ scale: interpolate(progress.get(), [0, 1], [0.7, 1], 'clamp') }],
  }));
  return (
    <Pressable onPress={onPress} style={styles.action} accessibilityRole="button" accessibilityLabel="Remove from bag">
      <Animated.View style={[styles.actionInner, style]}>
        <Icon name="trash-2" size={18} color="white" />
        <AppText variant="caption" color="white">
          Remove
        </AppText>
      </Animated.View>
    </Pressable>
  );
}

export function BagItemRow({ line }: { line: BagLine }) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const savedToWishlist = useWishlistStore((s) => s.ids.includes(line.productId));
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const swipeRef = useRef<SwipeableMethods>(null);
  const { product } = line;
  const variant = [line.color, line.size ? `Size ${line.size}` : null].filter(Boolean).join(' · ');

  const remove = () => {
    haptics.medium();
    removeItem(line.key);
  };

  const moveToWishlist = () => {
    if (!savedToWishlist) toggleWishlist(line.productId);
    haptics.light();
    removeItem(line.key);
  };

  return (
    <ReanimatedSwipeable
      ref={swipeRef}
      friction={1.6}
      rightThreshold={ACTION_WIDTH / 2}
      overshootRight={false}
      renderRightActions={(progress) => <RemoveAction progress={progress} onPress={remove} />}
      onSwipeableWillOpen={() => haptics.selection()}
      containerStyle={styles.swipeContainer}>
      <View style={styles.row} accessibilityActions={[{ name: 'delete', label: 'Remove from bag' }]} onAccessibilityAction={(e) => e.nativeEvent.actionName === 'delete' && remove()}>
        <PressableScale scaleTo={0.97} onPress={() => router.push({ pathname: '/product/[id]', params: { id: product.id } })} accessibilityLabel={`View ${product.name}`}>
          <AppImage uri={product.images[0]} style={styles.image} />
        </PressableScale>

        <View style={styles.info}>
          <View style={styles.titleRow}>
            <View style={styles.flex}>
              <AppText variant="smallMedium" numberOfLines={2}>
                {product.name}
              </AppText>
              <AppText variant="caption" color="inkMuted" style={styles.variant}>
                {variant}
              </AppText>
            </View>
            <PressableScale onPress={remove} hitSlop={8} scaleTo={0.85} style={styles.iconHit} accessibilityLabel={`Remove ${product.name} from bag`}>
              <Icon name="x" size={16} color="inkSecondary" />
            </PressableScale>
          </View>

          <PriceTag price={product.price} originalPrice={product.originalPrice} />

          <View style={styles.bottomRow}>
            <QuantityStepper value={line.quantity} max={MAX_QUANTITY} removeAtMin itemName={product.name} onChange={(q) => (q <= 0 ? remove() : updateQuantity(line.key, q))} />
            <PressableScale onPress={moveToWishlist} hitSlop={8} haptic={false} accessibilityLabel={`Move ${product.name} to wishlist`}>
              <AppText variant="caption" color="inkSecondary" style={styles.link}>
                Save for later
              </AppText>
            </PressableScale>
          </View>
        </View>
      </View>
    </ReanimatedSwipeable>
  );
}

const styles = StyleSheet.create({
  swipeContainer: { backgroundColor: colors.sale, borderRadius: radius.md },
  row: { flexDirection: 'row', gap: spacing.lg, backgroundColor: colors.background, paddingVertical: spacing.sm },
  image: { width: 92, height: 118, borderRadius: radius.sm },
  info: { flex: 1, gap: spacing.sm },
  titleRow: { flexDirection: 'row', gap: spacing.sm },
  flex: { flex: 1 },
  variant: { marginTop: 2 },
  iconHit: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center', marginTop: -4 },
  bottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' },
  link: { textDecorationLine: 'underline' },
  action: { width: ACTION_WIDTH, alignItems: 'center', justifyContent: 'center' },
  actionInner: { alignItems: 'center', gap: 4 },
});
