import { StyleSheet, useWindowDimensions, View } from 'react-native';

import { Skeleton, SkeletonGroup } from '@/components/ui';
import { gutter, radius, spacing } from '@/theme';

export function HomeSkeleton() {
  const { width, height: windowHeight } = useWindowDimensions();
  const heroHeight = Math.min(width * 1.32, windowHeight * 0.7);
  const tile = (width - gutter * 2 - spacing.md) / 2;
  const rail = Math.min(width * 0.42, 190);

  return (
    <SkeletonGroup>
      <Skeleton width={width} height={heroHeight} borderRadius={0} />
      <View style={styles.section}>
        <Skeleton width={80} height={10} />
        <Skeleton width={200} height={24} style={styles.title} />
        <View style={styles.grid}>
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} width={tile} height={tile * 1.22} borderRadius={radius.md} />
          ))}
        </View>
      </View>
      <View style={styles.section}>
        <Skeleton width={160} height={24} style={styles.title} />
        <View style={styles.row}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={{ gap: spacing.sm }}>
              <Skeleton width={rail} height={rail * 1.3} borderRadius={radius.md} />
              <Skeleton width={rail * 0.7} height={12} />
            </View>
          ))}
        </View>
      </View>
    </SkeletonGroup>
  );
}

const styles = StyleSheet.create({
  section: { paddingHorizontal: gutter, paddingTop: spacing.huge, gap: spacing.sm },
  title: { marginBottom: spacing.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  row: { flexDirection: 'row', gap: spacing.lg, overflow: 'hidden' },
});
