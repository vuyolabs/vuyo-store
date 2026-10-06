import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';

import { haptics } from '@/lib/haptics';
import { useIsWishlisted, useWishlistStore } from '@/store/wishlistStore';
import { colors, radius } from '@/theme';

interface WishlistButtonProps {
  productId: string;
  productName: string;
  variant?: 'overlay' | 'outline';
  size?: number;
}

/** Heart toggle with a springy pop on save. */
export function WishlistButton({ productId, productName, variant = 'overlay', size = 36 }: WishlistButtonProps) {
  const saved = useIsWishlisted(productId);
  const toggle = useWishlistStore((s) => s.toggle);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));

  const onPress = () => {
    const nowSaved = toggle(productId);
    if (nowSaved) {
      haptics.light();
      scale.set(withSequence(withTiming(0.7, { duration: 90 }), withSpring(1.18, { damping: 6, stiffness: 300 }), withSpring(1, { damping: 12 })));
    } else {
      haptics.selection();
      scale.set(withSequence(withTiming(0.82, { duration: 90 }), withSpring(1, { damping: 12 })));
    }
  };

  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={saved ? `Remove ${productName} from wishlist` : `Save ${productName} to wishlist`}
      accessibilityState={{ selected: saved }}
      style={[
        styles.base,
        { width: size, height: size, borderRadius: size / 2 },
        variant === 'overlay' ? styles.overlay : styles.outline,
      ]}>
      <Animated.View style={animatedStyle}>
        <Ionicons name={saved ? 'heart' : 'heart-outline'} size={size * 0.5} color={saved ? colors.sale : colors.ink} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center' },
  overlay: { backgroundColor: 'rgba(255,255,255,0.9)' },
  outline: { borderWidth: 1, borderColor: colors.lineStrong, backgroundColor: colors.surface, borderRadius: radius.pill },
});
