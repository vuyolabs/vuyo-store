import { router } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeOutUp, SlideInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useUIStore } from '@/store/uiStore';
import { colors, gutter, radius, shadows, spacing } from '@/theme';

import { AppImage } from './AppImage';
import { AppText } from './AppText';
import { Icon } from './Icon';

const DURATION = 2800;

/** App-wide confirmation toast (e.g. “Added to Bag”). Rendered once in the root layout. */
export function ToastHost() {
  const toast = useUIStore((s) => s.toast);
  const hideToast = useUIStore((s) => s.hideToast);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => hideToast(toast.id), DURATION);
    return () => clearTimeout(timer);
  }, [toast, hideToast]);

  if (!toast) return null;

  return (
    <View pointerEvents="box-none" style={[styles.host, { top: insets.top + spacing.sm }]}>
      <Animated.View
        key={toast.id}
        entering={SlideInUp.springify().damping(18).stiffness(180)}
        exiting={FadeOutUp.duration(220)}
        style={styles.toast}
        accessibilityLiveRegion="polite"
        accessibilityRole="alert">
        {toast.image ? <AppImage uri={toast.image} style={styles.thumb} transition={0} /> : <Icon name="check" size={18} color="white" />}
        <View style={styles.text}>
          <AppText variant="smallMedium" color="white">
            {toast.title}
          </AppText>
          {toast.message ? (
            <AppText variant="caption" color="white" numberOfLines={1} style={styles.message}>
              {toast.message}
            </AppText>
          ) : null}
        </View>
        {toast.action ? (
          <Pressable
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={toast.action.label}
            onPress={() => {
              hideToast(toast.id);
              if (toast.action) router.navigate(toast.action.href);
            }}
            style={styles.action}>
            <AppText variant="smallMedium" color="white" style={styles.actionText}>
              {toast.action.label}
            </AppText>
          </Pressable>
        ) : null}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  host: { position: 'absolute', left: gutter, right: gutter, zIndex: 100 },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.ink,
    borderRadius: radius.lg,
    padding: spacing.sm,
    paddingRight: spacing.lg,
    minHeight: 60,
    ...shadows.raised,
  },
  thumb: { width: 44, height: 44, borderRadius: radius.sm },
  text: { flex: 1 },
  message: { opacity: 0.72 },
  action: { paddingVertical: spacing.sm, paddingLeft: spacing.sm },
  actionText: { textDecorationLine: 'underline' },
});
