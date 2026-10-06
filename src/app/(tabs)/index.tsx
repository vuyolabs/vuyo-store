import { router, useScrollToTop } from 'expo-router';
import { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';

import { BrandStatement } from '@/components/home/BrandStatement';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { FeaturedCollections } from '@/components/home/FeaturedCollections';
import { Hero } from '@/components/home/Hero';
import { HomeHeader } from '@/components/home/HomeHeader';
import { HomeSkeleton } from '@/components/home/HomeSkeleton';
import { ProductRail } from '@/components/home/ProductRail';
import { newArrivals, trendingProducts } from '@/data/products';
import { useSimulatedLoading } from '@/lib/hooks';
import { colors, spacing } from '@/theme';

export default function HomeScreen() {
  const loading = useSimulatedLoading('home', 900);
  const scrollY = useSharedValue(0);
  const scrollRef = useRef<Animated.ScrollView>(null);
  useScrollToTop(scrollRef);

  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.set(e.contentOffset.y);
  });

  return (
    <View style={styles.root}>
      <HomeHeader scrollY={scrollY} />
      {loading ? (
        <HomeSkeleton />
      ) : (
        <Animated.ScrollView ref={scrollRef} onScroll={onScroll} scrollEventThrottle={16} showsVerticalScrollIndicator={false} entering={FadeIn.duration(350)}>
          <Hero scrollY={scrollY} />
          <View style={styles.sections}>
            <CategoryGrid />
            <ProductRail
              eyebrow="Just In"
              title="New Arrivals"
              products={newArrivals}
              actionLabel="View all"
              onAction={() => router.navigate({ pathname: '/shop', params: { category: 'all', sort: 'newest' } })}
            />
            <ProductRail eyebrow="Most Loved" title="Trending Now" products={trendingProducts} variant="feature" />
            <FeaturedCollections />
          </View>
          <BrandStatement />
        </Animated.ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  sections: { paddingVertical: spacing.huge, gap: spacing.massive },
});
