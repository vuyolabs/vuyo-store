import { StyleSheet, View } from 'react-native';

import { gutter, spacing } from '@/theme';

import { AppText } from './AppText';
import { PressableScale } from './PressableScale';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function SectionHeader({ eyebrow, title, actionLabel, onAction }: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <View style={styles.text}>
        {eyebrow ? (
          <AppText variant="overline" color="inkMuted">
            {eyebrow}
          </AppText>
        ) : null}
        <AppText variant="h2" accessibilityRole="header">
          {title}
        </AppText>
      </View>
      {actionLabel && onAction ? (
        <PressableScale onPress={onAction} haptic="selection" hitSlop={10} accessibilityLabel={`${actionLabel} ${title}`} style={styles.action}>
          <AppText variant="smallMedium" style={styles.underline}>
            {actionLabel}
          </AppText>
        </PressableScale>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', paddingHorizontal: gutter, marginBottom: spacing.lg, gap: spacing.lg },
  text: { flex: 1, gap: spacing.xs },
  action: { paddingVertical: spacing.xs, minHeight: 32, justifyContent: 'flex-end' },
  underline: { textDecorationLine: 'underline' },
});
