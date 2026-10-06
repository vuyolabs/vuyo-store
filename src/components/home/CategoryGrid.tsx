import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

import { AppImage, AppText, PressableScale, SectionHeader } from '@/components/ui';
import { homeCategories } from '@/data/categories';
import { gutter, radius, spacing } from '@/theme';

const GAP = spacing.md;

export function CategoryGrid() {
  const { width } = useWindowDimensions();
  const tileWidth = (width - gutter * 2 - GAP) / 2;

  return (
    <View>
      <SectionHeader eyebrow="Explore" title="Shop by Category" actionLabel="All" onAction={() => router.navigate({ pathname: '/shop', params: { category: 'all' } })} />
      <View style={styles.grid}>
        {homeCategories.map((c) => (
          <PressableScale
            key={c.id}
            scaleTo={0.97}
            onPress={() => router.navigate({ pathname: '/shop', params: { category: c.id } })}
            accessibilityRole="link"
            accessibilityLabel={`Shop ${c.name}`}
            style={[styles.tile, { width: tileWidth, height: tileWidth * 1.22 }]}>
            <AppImage uri={c.image} style={StyleSheet.absoluteFill} />
            <LinearGradient colors={['transparent', 'rgba(10,9,8,0.5)']} locations={[0.5, 1]} style={StyleSheet.absoluteFill} />
            <View style={styles.label}>
              <AppText variant="h3" color="white">
                {c.name}
              </AppText>
              <AppText variant="caption" color="white" style={styles.blurb}>
                {c.blurb}
              </AppText>
            </View>
          </PressableScale>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: GAP, paddingHorizontal: gutter },
  tile: { borderRadius: radius.md, overflow: 'hidden' },
  label: { position: 'absolute', left: spacing.md, right: spacing.md, bottom: spacing.md },
  blurb: { opacity: 0.85 },
});
