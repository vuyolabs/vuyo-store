import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, gutter, spacing } from '@/theme';

import { AppText } from './AppText';
import { IconButton } from './IconButton';

interface ScreenHeaderProps {
  title?: string;
  /** Hide the back button (e.g. on tab roots). */
  showBack?: boolean;
  onBack?: () => void;
  right?: ReactNode;
  bordered?: boolean;
  transparent?: boolean;
}

/** Compact stack header with a centred title, used by every pushed screen. */
export function ScreenHeader({ title, showBack = true, onBack, right, bordered = false, transparent = false }: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    if (onBack) onBack();
    else if (router.canGoBack()) router.back();
    else router.replace('/');
  };

  return (
    <View style={[styles.wrap, { paddingTop: insets.top }, !transparent && styles.solid, bordered && styles.bordered]}>
      <View style={styles.row}>
        <View style={styles.side}>{showBack ? <IconButton icon="arrow-left" accessibilityLabel="Go back" onPress={handleBack} /> : null}</View>
        <AppText variant="title" numberOfLines={1} style={styles.title} accessibilityRole="header">
          {title}
        </AppText>
        <View style={[styles.side, styles.right]}>{right}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { zIndex: 10 },
  solid: { backgroundColor: colors.background },
  bordered: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
  row: { height: 52, flexDirection: 'row', alignItems: 'center', paddingHorizontal: gutter - spacing.md },
  side: { minWidth: 88, flexDirection: 'row', alignItems: 'center' },
  right: { justifyContent: 'flex-end' },
  title: { flex: 1, textAlign: 'center' },
});
