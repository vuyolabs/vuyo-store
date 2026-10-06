import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProductRail } from '@/components/home/ProductRail';
import { ColorSelector, ImageGallery, PriceTag, SizeGuideSheet, SizeSelector, WishlistButton } from '@/components/product';
import { Accordion, AppText, Button, Divider, EmptyState, Icon, IconButton, Rating, Skeleton, SkeletonGroup } from '@/components/ui';
import { getCategoryName } from '@/data/categories';
import { getProduct, getRelatedProducts } from '@/data/products';
import { returnsInfo, shippingInfo } from '@/data/store-info';
import type { Product } from '@/data/types';
import { haptics } from '@/lib/haptics';
import { useSimulatedLoading } from '@/lib/hooks';
import { addBusinessDays, formatShortDate } from '@/lib/utils';
import { selectBagCount, useCartStore } from '@/store/cartStore';
import { usePreferencesStore } from '@/store/preferencesStore';
import { useUIStore } from '@/store/uiStore';
import { colors, gutter, radius, shadows, spacing } from '@/theme';

function BulletList({ items }: { items: string[] }) {
  return (
    <View style={styles.bullets}>
      {items.map((item) => (
        <View key={item} style={styles.bulletRow}>
          <View style={styles.bullet} />
          <AppText variant="small" color="inkSecondary" style={styles.flex}>
            {item}
          </AppText>
        </View>
      ))}
    </View>
  );
}

function ProductSkeleton({ width }: { width: number }) {
  return (
    <SkeletonGroup>
      <Skeleton width={width} height={width * 1.25} borderRadius={0} />
      <View style={styles.skeletonBody}>
        <Skeleton width={90} height={10} />
        <Skeleton width="80%" height={28} />
        <Skeleton width="55%" height={14} />
        <Skeleton width={120} height={22} style={styles.skeletonGap} />
        <View style={styles.skeletonRow}>
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} width={36} height={36} borderRadius={18} />
          ))}
        </View>
        <View style={styles.skeletonRow}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} width={48} height={44} borderRadius={radius.sm} />
          ))}
        </View>
      </View>
    </SkeletonGroup>
  );
}

function preferredSizeFor(product: Product, prefs: { clothing?: string; shoes?: string }) {
  if (product.category === 'clothing') return prefs.clothing;
  if (product.category === 'shoes') return prefs.shoes;
  return undefined;
}

export default function ProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = getProduct(id);
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const loading = useSimulatedLoading(`product:${id}`, 650);

  const sizePrefs = usePreferencesStore((s) => s.sizes);
  const preferred = product ? preferredSizeFor(product, sizePrefs) : undefined;
  const addItem = useCartStore((s) => s.addItem);
  const bagCount = useCartStore(selectBagCount);
  const showToast = useUIStore((s) => s.showToast);

  const [color, setColor] = useState(product?.colors[0]?.name ?? '');
  const [size, setSize] = useState<string | undefined>(() => (product?.sizes && preferred && product.sizes.includes(preferred) ? preferred : undefined));
  const [attention, setAttention] = useState(0);
  const [guideOpen, setGuideOpen] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const galleryHeight = width * 1.25;
  const scrollY = useSharedValue(0);
  const ctaScale = useSharedValue(1);

  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.set(e.contentOffset.y);
  });

  const galleryStyle = useAnimatedStyle(() => {
    const y = scrollY.get();
    return { transform: [{ translateY: y < 0 ? y : y * 0.4 }, { scale: y < 0 ? 1 + -y / galleryHeight : 1 }] };
  });
  const headerBgStyle = useAnimatedStyle(() => ({ opacity: interpolate(scrollY.get(), [galleryHeight - 160, galleryHeight - 80], [0, 1], 'clamp') }));
  const ctaStyle = useAnimatedStyle(() => ({ transform: [{ scale: ctaScale.get() }] }));

  if (!product) {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <View style={styles.headerRow}>
          <IconButton icon="arrow-left" accessibilityLabel="Go back" onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))} />
        </View>
        <EmptyState icon="alert-circle" title="This piece has moved on." body="It may have sold out or been retired from the collection." ctaLabel="Explore Collection" onCta={() => router.replace('/shop')} />
      </View>
    );
  }

  const needsSize = !!product.sizes?.length;
  const related = getRelatedProducts(product.id);
  const deliveryDate = formatShortDate(addBusinessDays(new Date(), 3).toISOString());

  const tryAdd = (): boolean => {
    if (needsSize && !size) {
      haptics.warning();
      setAttention((n) => n + 1);
      return false;
    }
    addItem({ productId: product.id, color, size });
    return true;
  };

  const onAddToBag = () => {
    if (!tryAdd()) return;
    haptics.success();
    ctaScale.set(withSequence(withTiming(0.94, { duration: 90 }), withSpring(1, { damping: 10, stiffness: 260 })));
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
    showToast({
      title: 'Added to Bag',
      message: `${product.name} · ${color}${size ? ` · ${size}` : ''}`,
      image: product.images[0],
      action: { label: 'View Bag', href: '/bag' },
    });
  };

  const onBuyNow = () => {
    if (!tryAdd()) return;
    haptics.medium();
    router.push('/checkout/delivery');
  };

  return (
    <View style={styles.root}>
      {loading ? (
        <ProductSkeleton width={width} />
      ) : (
        <Animated.ScrollView onScroll={onScroll} scrollEventThrottle={16} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 + insets.bottom }} entering={FadeIn.duration(300)}>
          <Animated.View style={[{ height: galleryHeight }, galleryStyle]}>
            <ImageGallery images={product.images} width={width} height={galleryHeight} productName={product.name} />
          </Animated.View>

          <View style={styles.sheet}>
            <Animated.View entering={FadeInDown.delay(60).duration(450)} style={styles.titleBlock}>
              <View style={styles.eyebrowRow}>
                <AppText variant="overline" color="inkMuted">
                  {getCategoryName(product.category)}
                </AppText>
                {product.newArrival ? (
                  <AppText variant="overline" color="accent">
                    · New Season
                  </AppText>
                ) : null}
              </View>
              <AppText variant="h1" accessibilityRole="header">
                {product.name}
              </AppText>
              <AppText variant="body" color="inkSecondary">
                {product.tagline}
              </AppText>
              <Rating rating={product.rating} reviewCount={product.reviewCount} full />
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(120).duration(450)} style={styles.priceBlock}>
              <PriceTag price={product.price} originalPrice={product.originalPrice} discount={product.discount} size="lg" />
              <AppText variant="caption" color="inkMuted">
                Inclusive of all taxes
              </AppText>
            </Animated.View>

            <Divider />

            <Animated.View entering={FadeInDown.delay(180).duration(450)} style={styles.selectors}>
              <ColorSelector options={product.colors} selected={color} onSelect={setColor} />
              {needsSize && product.sizes ? (
                <SizeSelector sizes={product.sizes} selected={size} onSelect={setSize} onOpenGuide={() => setGuideOpen(true)} attention={attention} preferredSize={preferred} />
              ) : null}
            </Animated.View>

            <View style={styles.promise}>
              <View style={styles.promiseRow}>
                <Icon name="truck" size={17} />
                <AppText variant="small" style={styles.flex}>
                  Free delivery by <AppText variant="smallMedium">{deliveryDate}</AppText>
                </AppText>
              </View>
              <View style={styles.promiseRow}>
                <Icon name="refresh-ccw" size={17} />
                <AppText variant="small" style={styles.flex}>
                  Free returns & exchanges within 30 days
                </AppText>
              </View>
            </View>

            <AppText variant="body" color="inkSecondary" style={styles.description}>
              {product.description}
            </AppText>

            <View>
              <Accordion title="Product details" initiallyOpen>
                {product.fit ? (
                  <View style={styles.fitRow}>
                    <AppText variant="smallMedium">Fit</AppText>
                    <AppText variant="small" color="inkSecondary" style={styles.flex}>
                      {product.fit}
                    </AppText>
                  </View>
                ) : null}
                {product.specifications.map((s) => (
                  <View key={s.label} style={styles.specRow}>
                    <AppText variant="small" color="inkMuted" style={styles.specLabel}>
                      {s.label}
                    </AppText>
                    <AppText variant="small" style={styles.flex}>
                      {s.value}
                    </AppText>
                  </View>
                ))}
              </Accordion>
              <Accordion title="Material & care">
                <AppText variant="smallMedium">{product.material}</AppText>
                <BulletList items={product.careInstructions} />
              </Accordion>
              <Accordion title="Shipping">
                <BulletList items={shippingInfo} />
              </Accordion>
              <Accordion title="Returns">
                <BulletList items={returnsInfo} />
              </Accordion>
            </View>
          </View>

          {related.length > 0 ? (
            <View style={styles.related}>
              <ProductRail eyebrow="Complete the look" title="You may also like" products={related} />
            </View>
          ) : null}
        </Animated.ScrollView>
      )}

      {/* Floating header */}
      <View style={[styles.header, { paddingTop: insets.top }]} pointerEvents="box-none">
        <Animated.View style={[StyleSheet.absoluteFill, styles.headerBg, headerBgStyle]} />
        <View style={styles.headerRow}>
          <IconButton icon="arrow-left" accessibilityLabel="Go back" variant="translucent" onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))} />
          <Animated.View style={[styles.headerTitle, headerBgStyle]}>
            <AppText variant="title" numberOfLines={1}>
              {product.name}
            </AppText>
          </Animated.View>
          <View style={styles.headerActions}>
            <IconButton icon="search" accessibilityLabel="Search" variant="translucent" onPress={() => router.push('/search')} />
            <IconButton icon="shopping-bag" accessibilityLabel="Bag" variant="translucent" badge={bagCount} onPress={() => router.navigate('/bag')} />
          </View>
        </View>
      </View>

      {/* Sticky purchase bar */}
      {!loading ? (
        <Animated.View entering={FadeInDown.delay(200).duration(400)} style={[styles.ctaBar, { paddingBottom: insets.bottom + spacing.md }]}>
          <WishlistButton productId={product.id} productName={product.name} variant="outline" size={52} />
          <Button label="Buy Now" variant="secondary" onPress={onBuyNow} style={styles.buyNow} accessibilityHint="Adds to bag and goes to checkout" />
          <Animated.View style={[styles.flex, ctaStyle]}>
            <Button label={justAdded ? 'Added' : 'Add to Bag'} icon={justAdded ? 'check' : 'shopping-bag'} onPress={onAddToBag} fullWidth />
          </Animated.View>
        </Animated.View>
      ) : null}

      {needsSize ? (
        <SizeGuideSheet visible={guideOpen} onClose={() => setGuideOpen(false)} category={product.category} fit={product.fit} highlight={size} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  sheet: {
    marginTop: -radius.xl,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    backgroundColor: colors.background,
    paddingHorizontal: gutter,
    paddingTop: spacing.xxl,
    gap: spacing.xxl,
  },
  titleBlock: { gap: spacing.sm },
  eyebrowRow: { flexDirection: 'row', gap: spacing.xs },
  priceBlock: { gap: spacing.xs },
  selectors: { gap: spacing.xxl },
  promise: { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.lg, gap: spacing.md, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  promiseRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  description: { lineHeight: 24 },
  fitRow: { flexDirection: 'row', gap: spacing.md, paddingBottom: spacing.sm },
  specRow: { flexDirection: 'row', gap: spacing.md, paddingVertical: spacing.xs },
  specLabel: { width: 120 },
  bullets: { gap: spacing.sm },
  bulletRow: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  bullet: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.inkMuted, marginTop: 8 },
  related: { paddingTop: spacing.huge },
  header: { position: 'absolute', top: 0, left: 0, right: 0 },
  headerBg: { backgroundColor: colors.background, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
  headerRow: { height: 56, flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, gap: spacing.xs },
  headerTitle: { flex: 1, alignItems: 'center' },
  headerActions: { flexDirection: 'row', gap: spacing.xs },
  ctaBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: gutter,
    paddingTop: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.line,
    ...shadows.soft,
  },
  buyNow: { paddingHorizontal: spacing.lg },
  skeletonBody: { padding: gutter, gap: spacing.md },
  skeletonGap: { marginTop: spacing.md },
  skeletonRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
});
