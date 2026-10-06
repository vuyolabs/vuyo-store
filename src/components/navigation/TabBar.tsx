import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

import { AppText, CountBadge, Icon, type IconName } from '@/components/ui';
import { haptics } from '@/lib/haptics';
import { selectBagCount, useCartStore } from '@/store/cartStore';
import { colors, spacing } from '@/theme';

const TABS: Record<string, { label: string; icon: IconName }> = {
  index: { label: 'Home', icon: 'home' },
  shop: { label: 'Shop', icon: 'grid' },
  bag: { label: 'Bag', icon: 'shopping-bag' },
  wishlist: { label: 'Wishlist', icon: 'heart' },
  profile: { label: 'Profile', icon: 'user' },
};

interface TabItemProps {
  label: string;
  icon: IconName;
  focused: boolean;
  badge?: number;
  onPress: () => void;
  onLongPress: () => void;
}

function TabItem({ label, icon, focused, badge, onPress, onLongPress }: TabItemProps) {
  const progress = useSharedValue(focused ? 1 : 0);

  useEffect(() => {
    progress.set(withSpring(focused ? 1 : 0, { damping: 16, stiffness: 220 }));
  }, [focused, progress]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -2 * progress.get() }, { scale: 1 + 0.06 * progress.get() }],
  }));
  const dotStyle = useAnimatedStyle(() => ({
    opacity: progress.get(),
    transform: [{ scaleX: 0.3 + 0.7 * progress.get() }],
  }));
  const labelStyle = useAnimatedStyle(() => ({ opacity: withTiming(focused ? 1 : 0.62, { duration: 180 }) }));

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.item}
      accessibilityRole="tab"
      accessibilityLabel={badge ? `${label}, ${badge} items` : label}
      accessibilityState={{ selected: focused }}>
      <Animated.View style={iconStyle}>
        <Icon name={icon} size={21} color={focused ? 'ink' : 'inkMuted'} />
        {badge !== undefined ? <CountBadge count={badge} style={styles.badge} /> : null}
      </Animated.View>
      <Animated.View style={labelStyle}>
        <AppText variant="caption" color={focused ? 'ink' : 'inkMuted'} style={styles.label} maxFontSizeMultiplier={1.2}>
          {label}
        </AppText>
      </Animated.View>
      <Animated.View style={[styles.dot, dotStyle]} />
    </Pressable>
  );
}

/** Minimal brand tab bar: thin icons, a short active underline and a live bag count. */
export function TabBar({ state, navigation, insets }: BottomTabBarProps) {
  const bagCount = useCartStore(selectBagCount);

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, spacing.md) }]} accessibilityRole="tablist">
      {state.routes.map((route, index) => {
        const config = TABS[route.name];
        if (!config) return null;
        const focused = state.index === index;

        return (
          <TabItem
            key={route.key}
            label={config.label}
            icon={config.icon}
            focused={focused}
            badge={route.name === 'bag' ? bagCount : undefined}
            onPress={() => {
              const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
              if (!focused) haptics.selection();
              if (!focused && !event.defaultPrevented) navigation.navigate(route.name, route.params);
            }}
            onLongPress={() => navigation.emit({ type: 'tabLongPress', target: route.key })}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.lineStrong,
    paddingTop: spacing.sm,
  },
  item: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3, minHeight: 48 },
  label: { fontSize: 11, letterSpacing: 0.2 },
  dot: { width: 16, height: 2, borderRadius: 1, backgroundColor: colors.ink, marginTop: 2 },
  badge: { position: 'absolute', top: -6, right: -10 },
});
