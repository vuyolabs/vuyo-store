import { router } from 'expo-router';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Wordmark } from '@/components/home/HomeHeader';
import { AppImage, AppText, Button, Divider, ScreenHeader } from '@/components/ui';
import { editorial } from '@/lib/images';
import { colors, gutter, radius, spacing } from '@/theme';

const pillars = [
  { title: 'Designed in-house', body: 'Every piece starts in our Bengaluru studio, drawn for everyday life rather than a single season.' },
  { title: 'Made with partners we know', body: 'Leather from Agra and Kanpur, knitwear from Ludhiana, cotton from Tiruppur — workshops we visit and trust.' },
  { title: 'Priced honestly', body: 'We sell only our own collection, directly to you, so quality goes into the product instead of the margin.' },
];

export default function AboutScreen() {
  const { width } = useWindowDimensions();

  return (
    <View style={styles.root}>
      <ScreenHeader title="About" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(500)}>
          <AppImage uri={editorial('1441986300917-64674bd600d8', { ratio: 'landscape' })} style={[styles.image, { height: (width - gutter * 2) * 0.66 }]} accessibilityLabel="The Vuyo Store flagship interior" />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(80).duration(500)} style={styles.intro}>
          <Wordmark size="lg" />
          <AppText variant="h2">Everyday essentials, elevated.</AppText>
          <AppText variant="body" color="inkSecondary">
            Vuyo Store is a modern fashion and lifestyle label creating clothing, shoes, bags and accessories for the way people
            actually live. No trends for the sake of trends — just considered pieces, made well, designed to be worn for years.
          </AppText>
        </Animated.View>

        <Divider />

        {pillars.map((p, i) => (
          <Animated.View key={p.title} entering={FadeInDown.delay(160 + i * 70).duration(500)} style={styles.pillar}>
            <AppText variant="overline" color="inkMuted">
              0{i + 1}
            </AppText>
            <AppText variant="h3">{p.title}</AppText>
            <AppText variant="body" color="inkSecondary">
              {p.body}
            </AppText>
          </Animated.View>
        ))}

        <Button label="Shop the Collection" icon="arrow-right" onPress={() => router.dismissTo('/shop')} fullWidth />

        <AppText variant="caption" color="inkMuted" align="center">
          Vuyo Store is a Vuyo Labs company.{'\n'}This app is a design and engineering showcase by Vuyo Labs.
        </AppText>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { padding: gutter, gap: spacing.xxl, paddingBottom: spacing.huge },
  image: { width: '100%', borderRadius: radius.lg },
  intro: { gap: spacing.md },
  pillar: { gap: spacing.xs },
});
