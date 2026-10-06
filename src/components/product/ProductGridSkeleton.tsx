import { StyleSheet, View } from 'react-native';

import { Skeleton, SkeletonGroup } from '@/components/ui';
import { radius, spacing } from '@/theme';

export function ProductCardSkeleton({ width }: { width: number }) {
  return (
    <View style={{ width, gap: spacing.sm }}>
      <Skeleton width={width} height={width * 1.28} borderRadius={radius.md} />
      <Skeleton width="75%" height={12} style={styles.first} />
      <Skeleton width="40%" height={12} />
    </View>
  );
}

export function ProductGridSkeleton({ cardWidth, count = 6, gap }: { cardWidth: number; count?: number; gap: number }) {
  return (
    <SkeletonGroup style={[styles.grid, { gap, rowGap: spacing.xxl }]}>
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} width={cardWidth} />
      ))}
    </SkeletonGroup>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  first: { marginTop: spacing.xs },
});
