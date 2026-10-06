import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppImage, AppText, PressableScale } from '@/components/ui';
import { getCategoryName } from '@/data/categories';
import type { Product } from '@/data/types';
import { radius, spacing } from '@/theme';

import { PriceTag } from './PriceTag';
import { WishlistButton } from './WishlistButton';

interface ProductRailCardProps {
  product: Product;
  width: number;
}

/** Compact card for horizontal rails (New Arrivals, Related). */
export function ProductRailCard({ product, width }: ProductRailCardProps) {
  return (
    <PressableScale
      scaleTo={0.97}
      onPress={() => router.push({ pathname: '/product/[id]', params: { id: product.id } })}
      accessibilityLabel={product.name}
      accessibilityHint="Opens product details"
      style={{ width }}>
      <View>
        <AppImage uri={product.images[0]} style={[styles.image, { width, height: width * 1.3 }]} />
        <View style={styles.heart}>
          <WishlistButton productId={product.id} productName={product.name} size={32} />
        </View>
      </View>
      <View style={styles.meta}>
        <AppText variant="overline" color="inkMuted" style={styles.category}>
          {getCategoryName(product.category)}
        </AppText>
        <AppText variant="smallMedium" numberOfLines={1}>
          {product.name}
        </AppText>
        <PriceTag price={product.price} originalPrice={product.originalPrice} />
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  image: { borderRadius: radius.md },
  heart: { position: 'absolute', top: spacing.sm, right: spacing.sm },
  meta: { paddingTop: spacing.md, gap: 3 },
  category: { fontSize: 9.5 },
});
