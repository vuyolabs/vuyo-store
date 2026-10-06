import { FlatList, StyleSheet, useWindowDimensions, View } from 'react-native';

import { ProductFeatureCard, ProductRailCard } from '@/components/product';
import { SectionHeader } from '@/components/ui';
import type { Product } from '@/data/types';
import { gutter, spacing } from '@/theme';

interface ProductRailProps {
  eyebrow?: string;
  title: string;
  products: Product[];
  actionLabel?: string;
  onAction?: () => void;
  variant?: 'compact' | 'feature';
}

/** Horizontal, snapping rail of products. `feature` uses large image-led cards. */
export function ProductRail({ eyebrow, title, products, actionLabel, onAction, variant = 'compact' }: ProductRailProps) {
  const { width } = useWindowDimensions();
  const cardWidth = variant === 'feature' ? Math.min(width * 0.74, 340) : Math.min(width * 0.42, 190);
  const gap = variant === 'feature' ? spacing.md : spacing.lg;

  return (
    <View>
      <SectionHeader eyebrow={eyebrow} title={title} actionLabel={actionLabel} onAction={onAction} />
      <FlatList
        horizontal
        data={products}
        keyExtractor={(p) => p.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}
        ItemSeparatorComponent={() => <View style={{ width: gap }} />}
        snapToInterval={cardWidth + gap}
        decelerationRate="fast"
        renderItem={({ item, index }) =>
          variant === 'feature' ? (
            <ProductFeatureCard product={item} width={cardWidth} height={cardWidth * 1.3} rank={index + 1} />
          ) : (
            <ProductRailCard product={item} width={cardWidth} />
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: gutter },
});
