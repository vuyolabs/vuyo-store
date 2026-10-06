import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText, Button } from '@/components/ui';
import { formatPrice } from '@/lib/utils';
import { colors, gutter, shadows, spacing } from '@/theme';

interface CheckoutFooterProps {
  total: number;
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export function CheckoutFooter({ total, label, onPress, disabled, loading }: CheckoutFooterProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { paddingBottom: insets.bottom + spacing.md }]}>
      <View>
        <AppText variant="caption" color="inkMuted">
          Total
        </AppText>
        <AppText variant="title">{formatPrice(total)}</AppText>
      </View>
      <Button label={label} icon="arrow-right" onPress={onPress} disabled={disabled} loading={loading} style={styles.flex} />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    paddingHorizontal: gutter,
    paddingTop: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.line,
    ...shadows.soft,
  },
  flex: { flex: 1 },
});
