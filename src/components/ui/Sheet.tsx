import { useEffect, useState, type ReactNode } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { Easing, interpolate, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';

import { colors, gutter, radius, spacing } from '@/theme';

import { AppText } from './AppText';
import { IconButton } from './IconButton';

interface SheetProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  headerAction?: ReactNode;
  /** Max height as a fraction of the window. */
  maxHeight?: number;
}

const OPEN_SPRING = { damping: 26, stiffness: 260, mass: 0.9 };

/**
 * Bottom sheet with a dimmed backdrop. Drag the handle down (or tap outside)
 * to dismiss. Content scrolls when it exceeds the available height.
 */
export function Sheet({ visible, onClose, title, children, footer, headerAction, maxHeight = 0.86 }: SheetProps) {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [mounted, setMounted] = useState(visible);
  const translateY = useSharedValue(height);
  const dragStart = useSharedValue(0);

  // Mount immediately when asked to show; unmount after the exit animation.
  if (visible && !mounted) setMounted(true);

  useEffect(() => {
    if (!mounted) return;
    if (visible) {
      translateY.set(withSpring(0, OPEN_SPRING));
    } else {
      translateY.set(
        withTiming(height, { duration: 240, easing: Easing.in(Easing.cubic) }, (finished) => {
          if (finished) scheduleOnRN(setMounted, false);
        }),
      );
    }
  }, [visible, mounted, height, translateY]);

  const pan = Gesture.Pan()
    .onStart(() => {
      dragStart.set(translateY.get());
    })
    .onUpdate((e) => {
      const next = dragStart.get() + e.translationY;
      translateY.set(next < 0 ? next * 0.2 : next);
    })
    .onEnd((e) => {
      if (e.translationY > 110 || e.velocityY > 900) {
        scheduleOnRN(onClose);
      } else {
        translateY.set(withSpring(0, OPEN_SPRING));
      }
    });

  const sheetStyle = useAnimatedStyle(() => ({ transform: [{ translateY: translateY.get() }] }));
  const backdropStyle = useAnimatedStyle(() => ({ opacity: interpolate(translateY.get(), [0, height * 0.6], [1, 0], 'clamp') }));

  if (!mounted) return null;

  return (
    <Modal visible transparent animationType="none" statusBarTranslucent navigationBarTranslucent onRequestClose={onClose}>
      <GestureHandlerRootView style={styles.root}>
        <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, backdropStyle]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityRole="button" accessibilityLabel="Close sheet" />
        </Animated.View>

        <Animated.View style={[styles.sheet, { maxHeight: height * maxHeight, paddingBottom: footer ? 0 : insets.bottom + spacing.lg }, sheetStyle]} accessibilityViewIsModal>
          <GestureDetector gesture={pan}>
            <View style={styles.header}>
              <View style={styles.handle} />
              <View style={styles.titleRow}>
                <AppText variant="h3" accessibilityRole="header" style={styles.title}>
                  {title}
                </AppText>
                {headerAction}
                <IconButton icon="x" accessibilityLabel="Close" onPress={onClose} size={40} />
              </View>
            </View>
          </GestureDetector>

          <ScrollView bounces={false} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            {children}
          </ScrollView>

          {footer ? <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>{footer}</View> : null}
        </Animated.View>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { backgroundColor: colors.overlay },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    overflow: 'hidden',
  },
  header: { paddingTop: spacing.sm, paddingHorizontal: gutter },
  handle: { alignSelf: 'center', width: 38, height: 4, borderRadius: 2, backgroundColor: colors.lineStrong, marginBottom: spacing.sm },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingBottom: spacing.sm },
  title: { flex: 1 },
  content: { paddingHorizontal: gutter, paddingBottom: spacing.xl },
  footer: {
    paddingHorizontal: gutter,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.line,
    backgroundColor: colors.background,
  },
});
