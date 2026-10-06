import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, { FadeInDown, useAnimatedStyle, type SharedValue } from 'react-native-reanimated';

import { AppImage, AppText, Button } from '@/components/ui';
import { heroBanner } from '@/data/banners';
import { gutter, spacing } from '@/theme';

/** Full-bleed campaign image with a gentle parallax as the page scrolls. */
export function Hero({ scrollY }: { scrollY: SharedValue<number> }) {
  const { width, height: windowHeight } = useWindowDimensions();
  const height = Math.min(width * 1.32, windowHeight * 0.7);

  const imageStyle = useAnimatedStyle(() => {
    const y = scrollY.get();
    return {
      transform: [{ translateY: y > 0 ? y * 0.35 : y * 0.5 }, { scale: y < 0 ? 1 + -y / height : 1.04 }],
    };
  });

  const openCollection = () => router.push({ pathname: '/collection/[id]', params: { id: heroBanner.collectionId } });

  return (
    <Pressable onPress={openCollection} accessibilityRole="link" accessibilityLabel={`${heroBanner.eyebrow}. ${heroBanner.title}`} style={[styles.wrap, { height }]}>
      <Animated.View style={[StyleSheet.absoluteFill, imageStyle]}>
        <AppImage uri={heroBanner.image} style={StyleSheet.absoluteFill} priority="high" />
      </Animated.View>
      <LinearGradient colors={['rgba(10,9,8,0)', 'rgba(10,9,8,0.55)']} locations={[0.4, 1]} style={StyleSheet.absoluteFill} />

      <View style={styles.content}>
        <Animated.View entering={FadeInDown.delay(150).duration(700)}>
          <AppText variant="overline" color="white">
            {heroBanner.eyebrow}
          </AppText>
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(260).duration(700)}>
          <AppText variant="hero" color="white" style={styles.title}>
            {heroBanner.title}
          </AppText>
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(380).duration(700)} style={styles.cta}>
          <Button label={heroBanner.cta} variant="light" size="md" icon="arrow-right" onPress={openCollection} />
        </Animated.View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { overflow: 'hidden' },
  content: { position: 'absolute', left: gutter, right: gutter, bottom: spacing.xxxl, gap: spacing.md },
  title: { maxWidth: 330 },
  cta: { alignSelf: 'flex-start', marginTop: spacing.sm },
});
