import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppImage, AppText, Icon, PressableScale } from '@/components/ui';
import type { Product } from '@/data/types';
import { radius, spacing } from '@/theme';

import { PriceTag } from './PriceTag';
import { WishlistButton } from './WishlistButton';

interface ProductFeatureCardProps {
  product: Product;
  width: number;
  height: number;
  rank?: number;
}

/** Large, image-led card used in “Trending Now”. Text sits on a soft bottom scrim. */
export function ProductFeatureCard({ product, width, height, rank }: ProductFeatureCardProps) {
  return (
    <PressableScale
      scaleTo={0.98}
      onPress={() => router.push({ pathname: '/product/[id]', params: { id: product.id } })}
      accessibilityLabel={`${rank ? `Number ${rank} trending, ` : ''}${product.name}`}
      accessibilityHint="Opens product details"
      style={[styles.card, { width, height }]}>
      <AppImage uri={product.images[0]} style={StyleSheet.absoluteFill} />
      <LinearGradient colors={['transparent', 'rgba(12,11,10,0.62)']} locations={[0.45, 1]} style={StyleSheet.absoluteFill} />
      <View style={styles.top}>
        {rank ? (
          <AppText variant="overline" color="white" style={styles.rank}>
            {rank.toString().padStart(2, '0')}
          </AppText>
        ) : (
          <View />
        )}
        <WishlistButton productId={product.id} productName={product.name} />
      </View>
      <View style={styles.bottom}>
        <View style={styles.text}>
          <AppText variant="h3" color="white" numberOfLines={2}>
            {product.name}
          </AppText>
          <PriceTag price={product.price} originalPrice={product.originalPrice} inverse />
        </View>
        <View style={styles.arrow}>
          <Icon name="arrow-up-right" size={18} color="ink" />
        </View>
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.lg, overflow: 'hidden' },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.md },
  rank: { fontSize: 12, paddingLeft: spacing.xs },
  bottom: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: spacing.lg, flexDirection: 'row', alignItems: 'flex-end', gap: spacing.md },
  text: { flex: 1, gap: spacing.xs },
  arrow: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.92)', alignItems: 'center', justifyContent: 'center' },
});
