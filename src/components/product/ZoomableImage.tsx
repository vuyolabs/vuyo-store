import { StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { AppImage } from '@/components/ui';

interface ZoomableImageProps {
  uri: string;
  width: number;
  height: number;
  onZoomChange?: (zoomed: boolean) => void;
  accessibilityLabel?: string;
}

const MAX_SCALE = 4;
const DOUBLE_TAP_SCALE = 2.5;
const SPRING = { damping: 20, stiffness: 220 };

/** Pinch, pan and double-tap to zoom. Panning only engages while zoomed so the pager can still swipe. */
export function ZoomableImage({ uri, width, height, onZoomChange, accessibilityLabel }: ZoomableImageProps) {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const savedTx = useSharedValue(0);
  const savedTy = useSharedValue(0);

  const notify = (zoomed: boolean) => onZoomChange?.(zoomed);

  const clampTranslate = (value: number, s: number, size: number) => {
    'worklet';
    const max = ((s - 1) * size) / 2;
    return Math.min(Math.max(value, -max), max);
  };

  const reset = () => {
    'worklet';
    scale.set(withSpring(1, SPRING));
    tx.set(withSpring(0, SPRING));
    ty.set(withSpring(0, SPRING));
    savedScale.set(1);
    savedTx.set(0);
    savedTy.set(0);
    scheduleOnRN(notify, false);
  };

  const pinch = Gesture.Pinch()
    .onUpdate((e) => {
      scale.set(Math.min(Math.max(savedScale.get() * e.scale, 0.85), MAX_SCALE));
    })
    .onEnd(() => {
      if (scale.get() <= 1.05) {
        reset();
      } else {
        savedScale.set(scale.get());
        tx.set(withTiming(clampTranslate(tx.get(), scale.get(), width)));
        ty.set(withTiming(clampTranslate(ty.get(), scale.get(), height)));
        savedTx.set(clampTranslate(tx.get(), scale.get(), width));
        savedTy.set(clampTranslate(ty.get(), scale.get(), height));
        scheduleOnRN(notify, true);
      }
    });

  const pan = Gesture.Pan()
    .manualActivation(true)
    .onTouchesMove((_e, state) => {
      if (savedScale.get() > 1) state.activate();
      else state.fail();
    })
    .onUpdate((e) => {
      tx.set(clampTranslate(savedTx.get() + e.translationX, scale.get(), width));
      ty.set(clampTranslate(savedTy.get() + e.translationY, scale.get(), height));
    })
    .onEnd(() => {
      savedTx.set(tx.get());
      savedTy.set(ty.get());
    });

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd((e) => {
      if (savedScale.get() > 1) {
        reset();
      } else {
        const targetX = clampTranslate((width / 2 - e.x) * (DOUBLE_TAP_SCALE - 1), DOUBLE_TAP_SCALE, width);
        const targetY = clampTranslate((height / 2 - e.y) * (DOUBLE_TAP_SCALE - 1), DOUBLE_TAP_SCALE, height);
        scale.set(withSpring(DOUBLE_TAP_SCALE, SPRING));
        tx.set(withSpring(targetX, SPRING));
        ty.set(withSpring(targetY, SPRING));
        savedScale.set(DOUBLE_TAP_SCALE);
        savedTx.set(targetX);
        savedTy.set(targetY);
        scheduleOnRN(notify, true);
      }
    });

  const gesture = Gesture.Race(doubleTap, Gesture.Simultaneous(pinch, pan));

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: tx.get() }, { translateY: ty.get() }, { scale: scale.get() }],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[{ width, height }, styles.wrap]} accessible accessibilityLabel={accessibilityLabel} accessibilityHint="Pinch or double tap to zoom">
        <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
          <AppImage uri={uri} style={StyleSheet.absoluteFill} contentFit="contain" transition={0} />
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  wrap: { overflow: 'hidden' },
});
