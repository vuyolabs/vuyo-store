import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';

import { colors, spacing } from '@/theme';

import { AppText } from './AppText';

interface RatingProps {
  rating: number;
  reviewCount?: number;
  /** Show five stars rather than a single compact star. */
  full?: boolean;
}

export function Rating({ rating, reviewCount, full = false }: RatingProps) {
  const label = `Rated ${rating.toFixed(1)} out of 5${reviewCount ? `, ${reviewCount} reviews` : ''}`;
  return (
    <View style={styles.row} accessible accessibilityLabel={label}>
      {full ? (
        <View style={styles.stars}>
          {[1, 2, 3, 4, 5].map((i) => {
            const name = rating >= i ? 'star' : rating >= i - 0.5 ? 'star-half' : 'star-outline';
            return <Ionicons key={i} name={name} size={13} color={colors.ink} />;
          })}
        </View>
      ) : (
        <Ionicons name="star" size={12} color={colors.ink} />
      )}
      <AppText variant="smallMedium">{rating.toFixed(1)}</AppText>
      {reviewCount !== undefined ? (
        <AppText variant="small" color="inkMuted">
          ({reviewCount.toLocaleString('en-IN')})
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  stars: { flexDirection: 'row', gap: 1, marginRight: 2 },
});
