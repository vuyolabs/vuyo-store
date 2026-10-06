import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, { FadeInDown, interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProductCard } from '@/components/product';
import { AppImage, AppText, EmptyState, IconButton } from '@/components/ui';
import { getCollection } from '@/data/banners';
import { getProductsByCollection } from '@/data/products';
import { colors, gutter, spacing } from '@/theme';

const GAP = spacing.md;

export default function CollectionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const collection = getCollection(id);
  const items = getProductsByCollection(id);
  const { width, height: windowHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const cardWidth = (width - gutter * 2 - GAP) / 2;
  const heroHeight = Math.min(width * 1.15, windowHeight * 0.6);
  const scrollY = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.set(e.contentOffset.y);
  });
  const heroStyle = useAnimatedStyle(() => {
    const y = scrollY.get();
    return { transform: [{ translateY: y < 0 ? y : y * 0.45 }, { scale: y < 0 ? 1 + -y / heroHeight : 1 }] };
  });
  const headerStyle = useAnimatedStyle(() => ({ opacity: interpolate(scrollY.get(), [heroHeight - 140, heroHeight - 70], [0, 1], 'clamp') }));

  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/'));

  if (!collection) {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <IconButton icon="arrow-left" accessibilityLabel="Go back" onPress={goBack} />
        <EmptyState icon="compass" title="Collection not found." body="This edit may have ended." ctaLabel="Explore Collection" onCta={() => router.replace('/shop')} />
      </View>
    );
  }

  const rows: (typeof items)[] = [];
  for (let i = 0; i < items.length; i += 2) rows.push(items.slice(i, i + 2));

  return (
    <View style={styles.root}>
      <Animated.ScrollView onScroll={onScroll} scrollEventThrottle={16} showsVerticalScrollIndicator={false}>
        <Animated.View style={[{ height: heroHeight }, heroStyle]}>
          <AppImage uri={collection.image} style={StyleSheet.absoluteFill} priority="high" />
          <LinearGradient colors={['rgba(10,9,8,0.2)', 'rgba(10,9,8,0)', 'rgba(10,9,8,0.6)']} locations={[0, 0.3, 1]} style={StyleSheet.absoluteFill} />
          <View style={styles.heroText}>
            <Animated.View entering={FadeInDown.delay(100).duration(600)}>
              <AppText variant="overline" color="white">
                {collection.eyebrow}
              </AppText>
            </Animated.View>
            <Animated.View entering={FadeInDown.delay(200).duration(600)}>
              <AppText variant="hero" color="white" accessibilityRole="header">
                {collection.title}
              </AppText>
            </Animated.View>
          </View>
        </Animated.View>

        <View style={styles.body}>
          <Animated.View entering={FadeInDown.delay(250).duration(500)} style={styles.intro}>
            <AppText variant="body" color="inkSecondary">
              {collection.subtitle}
            </AppText>
            <AppText variant="caption" color="inkMuted">
              {items.length} pieces
            </AppText>
          </Animated.View>

          <View style={styles.grid}>
            {rows.map((row, r) => (
              <View key={row.map((p) => p.id).join()} style={styles.row}>
                {row.map((p, c) => (
                  <ProductCard key={p.id} product={p} width={cardWidth} index={r * 2 + c} />
                ))}
              </View>
            ))}
          </View>
        </View>
      </Animated.ScrollView>

      <View style={[styles.header, { paddingTop: insets.top }]} pointerEvents="box-none">
        <Animated.View style={[StyleSheet.absoluteFill, styles.headerBg, headerStyle]} />
        <View style={styles.headerRow}>
          <IconButton icon="arrow-left" accessibilityLabel="Go back" variant="translucent" onPress={goBack} />
          <Animated.View style={[styles.headerTitle, headerStyle]}>
            <AppText variant="title" numberOfLines={1}>
              {collection.title}
            </AppText>
          </Animated.View>
          <IconButton icon="search" accessibilityLabel="Search" variant="translucent" onPress={() => router.push('/search')} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  heroText: { position: 'absolute', left: gutter, right: gutter, bottom: spacing.xxxl, gap: spacing.sm },
  body: { backgroundColor: colors.background, paddingHorizontal: gutter, paddingTop: spacing.xxl, paddingBottom: spacing.huge },
  intro: { gap: spacing.sm, marginBottom: spacing.xxl },
  grid: { gap: spacing.xxl },
  row: { flexDirection: 'row', gap: GAP },
  header: { position: 'absolute', top: 0, left: 0, right: 0 },
  headerBg: { backgroundColor: colors.background, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
  headerRow: { height: 56, flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, gap: spacing.sm },
  headerTitle: { flex: 1, alignItems: 'center' },
});
