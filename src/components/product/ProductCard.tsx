import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AppImage, AppText, PressableScale } from '@/components/ui';
import type { Product } from '@/data/types';
import { colors, radius, spacing } from '@/theme';

import { PriceTag } from './PriceTag';
import { WishlistButton } from './WishlistButton';

interface ProductCardProps {
  product: Product;
  width: number;
  /** Position in the grid, used to stagger the entrance. */
  index?: number;
}

/** Editorial 2-up grid card: image, name, price and a wishlist heart. Nothing more. */
export function ProductCard({ product, width, index = 0 }: ProductCardProps) {
  const tag = product.discount ? `−${product.discount}%` : product.newArrival ? 'New' : undefined;

  return (
    <Animated.View entering={FadeInDown.delay(Math.min(index, 8) * 45).duration(420)} style={{ width }}>
      <PressableScale
        scaleTo={0.98}
        onPress={() => router.push({ pathname: '/product/[id]', params: { id: product.id } })}
        accessibilityLabel={`${product.name}`}
        accessibilityHint="Opens product details">
        <View>
          <AppImage uri={product.images[0]} style={[styles.image, { width, height: width * 1.28 }]} />
          {tag ? (
            <View style={styles.tag}>
              <AppText variant="overline" color={product.discount ? 'sale' : 'ink'} style={styles.tagText}>
                {tag}
              </AppText>
            </View>
          ) : null}
          <View style={styles.heart}>
            <WishlistButton productId={product.id} productName={product.name} size={34} />
          </View>
        </View>
        <View style={styles.meta}>
          <AppText variant="smallMedium" numberOfLines={1}>
            {product.name}
          </AppText>
          <PriceTag price={product.price} originalPrice={product.originalPrice} />
        </View>
      </PressableScale>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  image: { borderRadius: radius.md },
  tag: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.xs,
    backgroundColor: colors.surface,
  },
  tagText: { fontSize: 9.5, letterSpacing: 1.2 },
  heart: { position: 'absolute', top: spacing.sm, right: spacing.sm },
  meta: { paddingTop: spacing.md, paddingHorizontal: 2, gap: 3 },
});
