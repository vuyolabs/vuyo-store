import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { View, type DimensionValue, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { cancelAnimation, Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming, type SharedValue } from 'react-native-reanimated';

import { colors, radius } from '@/theme';

const PulseContext = createContext<SharedValue<number> | null>(null);

/** Wrap a skeleton layout so every block pulses in unison. */
export function SkeletonGroup({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const pulse = useSharedValue(0);

  useEffect(() => {
    pulse.set(withRepeat(withTiming(1, { duration: 900, easing: Easing.inOut(Easing.quad) }), -1, true));
    return () => cancelAnimation(pulse);
  }, [pulse]);

  return (
    <PulseContext.Provider value={pulse}>
      <View style={style} accessibilityLabel="Loading" accessibilityRole="progressbar">
        {children}
      </View>
    </PulseContext.Provider>
  );
}

interface SkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}

export function Skeleton({ width = '100%', height = 14, borderRadius = radius.xs, style }: SkeletonProps) {
  const pulse = useContext(PulseContext);
  const animatedStyle = useAnimatedStyle(() => ({ opacity: pulse ? 0.55 + pulse.get() * 0.45 : 1 }));

  return <Animated.View style={[{ width, height, borderRadius, backgroundColor: colors.surfaceSunken }, animatedStyle, style]} />;
}
