import { StyleSheet, View } from 'react-native';

import { AppText, Icon, Sheet } from '@/components/ui';
import { sizeGuideFor } from '@/data/store-info';
import type { CategoryId } from '@/data/types';
import { colors, radius, spacing } from '@/theme';

interface SizeGuideSheetProps {
  visible: boolean;
  onClose: () => void;
  category: CategoryId;
  fit?: string;
  highlight?: string;
}

export function SizeGuideSheet({ visible, onClose, category, fit, highlight }: SizeGuideSheetProps) {
  const guide = sizeGuideFor(category);

  return (
    <Sheet visible={visible} onClose={onClose} title="Size guide">
      {fit ? (
        <View style={styles.fit}>
          <Icon name="info" size={16} color="accent" />
          <AppText variant="small" color="inkSecondary" style={styles.fitText}>
            {fit}
          </AppText>
        </View>
      ) : null}

      <View style={styles.table} accessibilityRole="list">
        <View style={[styles.row, styles.headRow]}>
          {guide.headers.map((h) => (
            <AppText key={h} variant="caption" color="inkSecondary" style={styles.cell}>
              {h}
            </AppText>
          ))}
        </View>
        {guide.rows.map((row) => {
          const active = row[0] === highlight;
          return (
            <View key={row[0]} style={[styles.row, active && styles.activeRow]} accessible accessibilityLabel={guide.headers.map((h, i) => `${h} ${row[i]}`).join(', ')}>
              {row.map((value, i) => (
                <AppText key={`${row[0]}-${i}`} variant={i === 0 ? 'smallMedium' : 'small'} style={styles.cell}>
                  {value}
                </AppText>
              ))}
            </View>
          );
        })}
      </View>

      <View style={styles.tip}>
        <AppText variant="overline" color="inkMuted">
          How to measure
        </AppText>
        <AppText variant="small" color="inkSecondary">
          {guide.tip}
        </AppText>
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  fit: { flexDirection: 'row', gap: spacing.sm, backgroundColor: colors.accentSoft, padding: spacing.md, borderRadius: radius.md, marginBottom: spacing.lg },
  fitText: { flex: 1 },
  table: { borderRadius: radius.md, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.lineStrong, overflow: 'hidden', backgroundColor: colors.surface },
  row: { flexDirection: 'row', paddingVertical: spacing.md, paddingHorizontal: spacing.md, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
  headRow: { backgroundColor: colors.surfaceMuted },
  activeRow: { backgroundColor: colors.accentSoft },
  cell: { flex: 1 },
  tip: { marginTop: spacing.xl, gap: spacing.xs },
});
