import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AppText, Chip, Icon, ScreenHeader } from '@/components/ui';
import { filterSizes } from '@/lib/catalog';
import { usePreferencesStore, type SizePreferences } from '@/store/preferencesStore';
import { colors, gutter, radius, spacing } from '@/theme';

const groups: { key: keyof SizePreferences; title: string; hint: string; sizes: string[] }[] = [
  { key: 'clothing', title: 'Clothing', hint: 'Tees, shirts, knitwear, outerwear and trousers', sizes: filterSizes.clothing },
  { key: 'shoes', title: 'Shoes (UK / IND)', hint: 'Sneakers, leather shoes and boots', sizes: filterSizes.shoes },
];

export default function SizesScreen() {
  const sizes = usePreferencesStore((s) => s.sizes);
  const setSize = usePreferencesStore((s) => s.setSize);

  return (
    <View style={styles.root}>
      <ScreenHeader title="Size Preferences" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(400)} style={styles.note}>
          <Icon name="info" size={16} color="accent" />
          <AppText variant="small" color="inkSecondary" style={styles.flex}>
            We’ll pre-select your sizes on product pages, so adding to your bag takes a single tap.
          </AppText>
        </Animated.View>

        {groups.map((g, i) => (
          <Animated.View key={g.key} entering={FadeInDown.delay(80 + i * 80).duration(400)} style={styles.group}>
            <View>
              <AppText variant="h3">{g.title}</AppText>
              <AppText variant="small" color="inkMuted">
                {g.hint}
              </AppText>
            </View>
            <View style={styles.chips} accessibilityRole="radiogroup" accessibilityLabel={`${g.title} size`}>
              {g.sizes.map((s) => (
                <Chip key={s} label={s} selected={sizes[g.key] === s} onPress={() => setSize(g.key, sizes[g.key] === s ? undefined : s)} accessibilityLabel={`${g.title} size ${s}`} />
              ))}
            </View>
          </Animated.View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  content: { padding: gutter, gap: spacing.xxl, paddingBottom: spacing.huge },
  note: { flexDirection: 'row', gap: spacing.sm, padding: spacing.lg, backgroundColor: colors.accentSoft, borderRadius: radius.md },
  group: { gap: spacing.lg, backgroundColor: colors.surface, padding: spacing.lg, borderRadius: radius.lg, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
});
