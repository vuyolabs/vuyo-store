import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { formatPrice } from '@/lib/utils';
import { fonts, spacing } from '@/theme';

interface PriceTagProps {
  price: number;
  originalPrice?: number;
  discount?: number;
  size?: 'sm' | 'lg';
  inverse?: boolean;
}

export function PriceTag({ price, originalPrice, discount, size = 'sm', inverse = false }: PriceTagProps) {
  const onSale = !!originalPrice && originalPrice > price;
  const label = onSale ? `${formatPrice(price)}, reduced from ${formatPrice(originalPrice)}` : formatPrice(price);
  return (
    <View style={styles.row} accessible accessibilityLabel={label}>
      <AppText variant={size === 'lg' ? 'h3' : 'price'} color={inverse ? 'white' : onSale ? 'sale' : 'ink'} style={size === 'lg' && styles.large}>
        {formatPrice(price)}
      </AppText>
      {onSale ? (
        <AppText variant={size === 'lg' ? 'body' : 'small'} color={inverse ? 'white' : 'inkMuted'} style={styles.strike}>
          {formatPrice(originalPrice)}
        </AppText>
      ) : null}
      {onSale && discount && size === 'lg' ? (
        <AppText variant="smallMedium" color="sale">
          {discount}% off
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm, flexWrap: 'wrap' },
  strike: { textDecorationLine: 'line-through' },
  large: { fontFamily: fonts.sansMedium, fontSize: 20, lineHeight: 26 },
});
