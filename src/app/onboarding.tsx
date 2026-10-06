import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, interpolate, useAnimatedRef, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, type SharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Wordmark } from '@/components/home/HomeHeader';
import { AppImage, AppText, Button, PressableScale } from '@/components/ui';
import { onboardingSlides } from '@/data/banners';
import { haptics } from '@/lib/haptics';
import { usePreferencesStore } from '@/store/preferencesStore';
import { colors, gutter, spacing } from '@/theme';

type Slide = (typeof onboardingSlides)[number];

function SlideView({ slide, index, width, progress }: { slide: Slide; index: number; width: number; progress: SharedValue<number> }) {
  const imageStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(progress.get(), [index - 1, index, index + 1], [-width * 0.25, 0, width * 0.25]) }, { scale: 1.12 }],
  }));
  const textStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.get(), [index - 0.6, index, index + 0.6], [0, 1, 0], 'clamp'),
    transform: [{ translateY: interpolate(progress.get(), [index - 1, index, index + 1], [24, 0, 24], 'clamp') }],
  }));

  return (
    <View style={[styles.slide, { width }]}>
      <Animated.View style={[StyleSheet.absoluteFill, imageStyle]}>
        <AppImage uri={slide.image} style={StyleSheet.absoluteFill} priority="high" />
      </Animated.View>
      <LinearGradient colors={['rgba(10,9,8,0.25)', 'rgba(10,9,8,0)', 'rgba(10,9,8,0.7)']} locations={[0, 0.35, 0.85]} style={StyleSheet.absoluteFill} />
      <Animated.View style={[styles.copy, textStyle]}>
        <AppText variant="overline" color="white">
          {slide.eyebrow}
        </AppText>
        <AppText variant="hero" color="white">
          {slide.title}
        </AppText>
        <AppText variant="body" color="white" style={styles.body}>
          {slide.body}
        </AppText>
      </Animated.View>
    </View>
  );
}

function PagerDot({ index, progress }: { index: number; progress: SharedValue<number> }) {
  const style = useAnimatedStyle(() => ({
    width: interpolate(progress.get(), [index - 1, index, index + 1], [8, 28, 8], 'clamp'),
    opacity: interpolate(progress.get(), [index - 1, index, index + 1], [0.45, 1, 0.45], 'clamp'),
  }));
  return <Animated.View style={[styles.dot, style]} />;
}

export default function OnboardingScreen() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const completeOnboarding = usePreferencesStore((s) => s.completeOnboarding);
  const progress = useSharedValue(0);
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const [page, setPage] = useState(0);
  const isLast = page === onboardingSlides.length - 1;

  const onScroll = useAnimatedScrollHandler((e) => {
    progress.set(e.contentOffset.x / width);
  });

  const finish = () => {
    haptics.success();
    completeOnboarding();
  };

  const next = () => {
    if (isLast) return finish();
    haptics.selection();
    scrollRef.current?.scrollTo({ x: width * (page + 1), animated: true });
  };

  return (
    <View style={styles.root}>
      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(e) => setPage(Math.round(e.nativeEvent.contentOffset.x / width))}>
        {onboardingSlides.map((s, i) => (
          <SlideView key={s.id} slide={s} index={i} width={width} progress={progress} />
        ))}
      </Animated.ScrollView>

      <Animated.View entering={FadeIn.duration(600)} style={[styles.top, { paddingTop: insets.top + spacing.md }]}>
        <Wordmark inverse />
        {!isLast ? (
          <PressableScale onPress={finish} hitSlop={12} style={styles.skip} accessibilityLabel="Skip" accessibilityHint="Skips the introduction">
            <AppText variant="smallMedium" color="white">
              Skip
            </AppText>
          </PressableScale>
        ) : null}
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(200).duration(600)} style={[styles.bottom, { paddingBottom: insets.bottom + spacing.xl }]}>
        <View style={styles.dots}>
          {onboardingSlides.map((s, i) => (
            <PagerDot key={s.id} index={i} progress={progress} />
          ))}
        </View>
        <Button label={isLast ? 'Start Shopping' : 'Continue'} variant="light" icon="arrow-right" onPress={next} fullWidth />
      </Animated.View>
    </View>
  );
}


const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.ink },
  slide: { flex: 1, overflow: 'hidden' },
  copy: { position: 'absolute', left: gutter, right: gutter, bottom: 190, gap: spacing.md },
  body: { opacity: 0.88, maxWidth: 340 },
  top: { position: 'absolute', left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: gutter },
  skip: { minHeight: 44, minWidth: 44, alignItems: 'flex-end', justifyContent: 'center' },
  bottom: { position: 'absolute', left: gutter, right: gutter, bottom: 0, gap: spacing.xl },
  dots: { flexDirection: 'row', gap: 6 },
  dot: { height: 3, borderRadius: 2, backgroundColor: colors.white },
});
