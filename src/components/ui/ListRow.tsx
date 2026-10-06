import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, spacing } from '@/theme';

import { AppText } from './AppText';
import { Icon, type IconName } from './Icon';
import { PressableScale } from './PressableScale';

interface ListRowProps {
  icon?: IconName;
  title: string;
  subtitle?: string;
  value?: string;
  onPress?: () => void;
  right?: ReactNode;
  last?: boolean;
}

export function ListRow({ icon, title, subtitle, value, onPress, right, last = false }: ListRowProps) {
  const content = (
    <View style={[styles.row, !last && styles.border]}>
      {icon ? (
        <View style={styles.icon}>
          <Icon name={icon} size={18} />
        </View>
      ) : null}
      <View style={styles.text}>
        <AppText variant="bodyMedium">{title}</AppText>
        {subtitle ? (
          <AppText variant="caption" color="inkMuted" numberOfLines={2}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {value ? (
        <AppText variant="small" color="inkSecondary">
          {value}
        </AppText>
      ) : null}
      {right ?? (onPress ? <Icon name="chevron-right" size={18} color="inkMuted" /> : null)}
    </View>
  );

  if (!onPress) return content;

  return (
    <PressableScale onPress={onPress} scaleTo={0.985} haptic="selection" accessibilityLabel={[title, subtitle, value].filter(Boolean).join(', ')}>
      {content}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  row: { minHeight: 64, flexDirection: 'row', alignItems: 'center', gap: spacing.lg, paddingVertical: spacing.md },
  border: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
  icon: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.surfaceMuted, alignItems: 'center', justifyContent: 'center' },
  text: { flex: 1, gap: 2 },
});
