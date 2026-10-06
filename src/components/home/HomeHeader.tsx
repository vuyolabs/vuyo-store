import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, type SharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconButton } from '@/components/ui';
import { selectBagCount, useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { colors, fonts, gutter } from '@/theme';

export function Wordmark({ inverse = false, size = 'md' }: { inverse?: boolean; size?: 'md' | 'lg' }) {
  const fontSize = size === 'lg' ? 34 : 19;
  const color = inverse ? colors.white : colors.ink;
  return (
    <View accessible accessibilityRole="header" accessibilityLabel="Vuyo Store">
      <Animated.Text style={[styles.wordmark, { fontSize, lineHeight: fontSize * 1.02, color }]} allowFontScaling={false}>
        VUYO
      </Animated.Text>
      <Animated.Text style={[styles.wordmarkSub, { fontSize: fontSize * 0.46, color, letterSpacing: fontSize * 0.36 }]} allowFontScaling={false}>
        STORE
      </Animated.Text>
    </View>
  );
}

export function HomeHeader({ scrollY }: { scrollY: SharedValue<number> }) {
  const insets = useSafeAreaInsets();
  const bagCount = useCartStore(selectBagCount);
  const wishCount = useWishlistStore((s) => s.ids.length);

  const borderStyle = useAnimatedStyle(() => ({ opacity: interpolate(scrollY.get(), [0, 40], [0, 1], 'clamp') }));

  return (
    <View style={[styles.wrap, { paddingTop: insets.top }]}>
      <View style={styles.row}>
        <Wordmark />
        <View style={styles.actions}>
          <IconButton icon="search" accessibilityLabel="Search" onPress={() => router.push('/search')} />
          <IconButton icon="heart" accessibilityLabel="Wishlist" badge={wishCount} onPress={() => router.navigate('/wishlist')} />
          <IconButton icon="shopping-bag" accessibilityLabel="Bag" badge={bagCount} onPress={() => router.navigate('/bag')} />
        </View>
      </View>
      <Animated.View style={[styles.border, borderStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { backgroundColor: colors.background, zIndex: 10 },
  row: { height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingLeft: gutter, paddingRight: gutter - 10 },
  actions: { flexDirection: 'row', alignItems: 'center' },
  wordmark: { fontFamily: fonts.displayMedium, letterSpacing: 4.5 },
  wordmarkSub: { fontFamily: fonts.sansSemiBold, marginTop: 1 },
  border: { height: StyleSheet.hairlineWidth, backgroundColor: colors.lineStrong },
});
