import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import type { Address } from '@/data/types';
import { spacing } from '@/theme';

/** Formatted postal address. */
export function AddressBlock({ address, showLabel = true }: { address: Address; showLabel?: boolean }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.titleRow}>
        <AppText variant="smallMedium">{address.fullName}</AppText>
        {showLabel ? (
          <AppText variant="overline" color="inkMuted" style={styles.label}>
            {address.label}
          </AppText>
        ) : null}
      </View>
      <AppText variant="small" color="inkSecondary">
        {[address.line1, address.line2].filter(Boolean).join(', ')}
        {'\n'}
        {address.city}, {address.state} {address.pincode}
      </AppText>
      <AppText variant="caption" color="inkMuted">
        {address.phone}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 3 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  label: { fontSize: 9.5 },
});
