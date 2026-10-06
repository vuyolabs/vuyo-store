import { StyleSheet, View } from 'react-native';

import { AppText, Divider, Icon, type IconName } from '@/components/ui';
import { colors, fonts, gutter, spacing } from '@/theme';

const promises: { icon: IconName; title: string; body: string }[] = [
  { icon: 'truck', title: 'Free delivery', body: 'On orders over ₹2,999' },
  { icon: 'refresh-ccw', title: '30-day returns', body: 'Free and easy, always' },
  { icon: 'feather', title: 'Made in India', body: 'With partners we know' },
];

export function BrandStatement() {
  return (
    <View style={styles.wrap}>
      <AppText variant="overline" color="inkMuted" align="center">
        Our Philosophy
      </AppText>
      <AppText variant="h1" align="center" style={styles.title} accessibilityRole="header">
        Designed for{'\n'}
        <AppText variant="h1" style={styles.italic}>
          everyday.
        </AppText>
      </AppText>
      <AppText variant="body" color="inkSecondary" align="center" style={styles.body}>
        We make fewer, better things — honest materials, careful construction and timeless shapes, sold directly to you without
        the middlemen. Pieces you will reach for again and again.
      </AppText>

      <Divider style={styles.divider} />

      <View style={styles.promises}>
        {promises.map((p) => (
          <View key={p.title} style={styles.promise} accessible accessibilityLabel={`${p.title}. ${p.body}`}>
            <Icon name={p.icon} size={18} />
            <AppText variant="smallMedium" align="center">
              {p.title}
            </AppText>
            <AppText variant="caption" color="inkMuted" align="center">
              {p.body}
            </AppText>
          </View>
        ))}
      </View>

      <AppText variant="caption" color="inkMuted" align="center" style={styles.footer}>
        Vuyo Store · A Vuyo Labs company · © 2026
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: gutter, paddingVertical: spacing.massive, backgroundColor: colors.surfaceMuted, gap: spacing.lg },
  title: { fontSize: 38, lineHeight: 44 },
  italic: { fontFamily: fonts.displayItalic, fontSize: 38, lineHeight: 44 },
  body: { maxWidth: 340, alignSelf: 'center' },
  divider: { marginVertical: spacing.lg },
  promises: { flexDirection: 'row', gap: spacing.md },
  promise: { flex: 1, alignItems: 'center', gap: spacing.xs },
  footer: { marginTop: spacing.xxxl },
});
