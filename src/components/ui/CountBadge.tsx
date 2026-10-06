import { useEffect, useRef } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming, ZoomIn, ZoomOut } from 'react-native-reanimated';

import { colors, fonts } from '@/theme';

interface CountBadgeProps {
  count: number;
  style?: StyleProp<ViewStyle>;
}

/** Small ink badge that pops whenever its count changes. */
export function CountBadge({ count, style }: CountBadgeProps) {
  const scale = useSharedValue(1);
  const previous = useRef(count);

  useEffect(() => {
    if (previous.current !== count && count > 0) {
      scale.set(withSequence(withTiming(1.35, { duration: 120 }), withSpring(1, { damping: 8, stiffness: 220 })));
    }
    previous.current = count;
  }, [count, scale]);

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));

  if (count <= 0) return null;

  return (
    // Layout animation lives on the wrapper; the count "pop" transform on the inner view.
    <Animated.View entering={ZoomIn.springify().damping(14)} exiting={ZoomOut.duration(150)} style={style} pointerEvents="none">
      <Animated.View style={[styles.badge, animatedStyle]}>
        <Animated.Text style={styles.text} allowFontScaling={false}>
          {count > 9 ? '9+' : count}
        </Animated.Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  badge: {
    minWidth: 17,
    height: 17,
    paddingHorizontal: 4,
    borderRadius: 9,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.background,
  },
  text: { color: colors.white, fontFamily: fonts.sansSemiBold, fontSize: 9.5, lineHeight: 12 },
});
