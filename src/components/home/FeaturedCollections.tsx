import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

import { AppImage, AppText, Icon, PressableScale, SectionHeader } from '@/components/ui';
import { featuredCollectionIds, getCollection } from '@/data/banners';
import { getProductsByCollection } from '@/data/products';
import type { Collection } from '@/data/types';
import { gutter, radius, spacing } from '@/theme';

function CollectionTile({ collection, width, height, large = false }: { collection: Collection; width: number; height: number; large?: boolean }) {
  const count = getProductsByCollection(collection.id).length;
  return (
    <PressableScale
      scaleTo={0.98}
      onPress={() => router.push({ pathname: '/collection/[id]', params: { id: collection.id } })}
      accessibilityRole="link"
      accessibilityLabel={`${collection.title} collection, ${count} pieces`}
      style={[styles.tile, { width, height }]}>
      <AppImage uri={collection.image} style={StyleSheet.absoluteFill} />
      <LinearGradient colors={['rgba(10,9,8,0.05)', 'rgba(10,9,8,0.6)']} locations={[0.35, 1]} style={StyleSheet.absoluteFill} />
      <View style={[styles.text, large && styles.textLarge]}>
        <AppText variant="overline" color="white">
          {collection.eyebrow}
        </AppText>
        <AppText variant={large ? 'h1' : 'h3'} color="white">
          {collection.title}
        </AppText>
        {large ? (
          <AppText variant="small" color="white" style={styles.subtitle} numberOfLines={2}>
            {collection.subtitle}
          </AppText>
        ) : null}
        <View style={styles.link}>
          <AppText variant="smallMedium" color="white">
            {count} pieces
          </AppText>
          <Icon name="arrow-right" size={14} color="white" />
        </View>
      </View>
    </PressableScale>
  );
}

/** Editorial collection blocks: one large feature above two portrait tiles. */
export function FeaturedCollections() {
  const { width } = useWindowDimensions();
  const fullWidth = width - gutter * 2;
  const half = (fullWidth - spacing.md) / 2;
  const [lead, ...rest] = featuredCollectionIds.map((id) => getCollection(id)).filter((c): c is Collection => !!c);

  if (!lead) return null;

  return (
    <View>
      <SectionHeader eyebrow="Curated" title="Featured Collection" />
      <View style={styles.stack}>
        <CollectionTile collection={lead} width={fullWidth} height={fullWidth * 1.1} large />
        <View style={styles.row}>
          {rest.map((c) => (
            <CollectionTile key={c.id} collection={c} width={half} height={half * 1.45} />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { paddingHorizontal: gutter, gap: spacing.md },
  row: { flexDirection: 'row', gap: spacing.md },
  tile: { borderRadius: radius.lg, overflow: 'hidden' },
  text: { position: 'absolute', left: spacing.lg, right: spacing.lg, bottom: spacing.lg, gap: spacing.xs },
  textLarge: { left: spacing.xl, right: spacing.xl, bottom: spacing.xl, gap: spacing.sm },
  subtitle: { opacity: 0.88, maxWidth: 300 },
  link: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.xs },
});
