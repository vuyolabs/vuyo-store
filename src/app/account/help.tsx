import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Accordion, AppText, ListRow, ScreenHeader } from '@/components/ui';
import { helpTopics } from '@/data/store-info';
import { useUIStore } from '@/store/uiStore';
import { colors, gutter, radius, spacing } from '@/theme';

export default function HelpScreen() {
  const showToast = useUIStore((s) => s.showToast);
  const demoContact = (channel: string) => showToast({ title: `${channel} is a demo`, message: 'Support channels are not connected in this prototype.' });

  return (
    <View style={styles.root}>
      <ScreenHeader title="Help & Support" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(400)} style={styles.intro}>
          <AppText variant="h2">How can we help?</AppText>
          <AppText variant="body" color="inkSecondary">
            Our client care team is available every day, 10am – 8pm IST.
          </AppText>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(80).duration(400)} style={styles.card}>
          <ListRow icon="message-circle" title="Chat with us" subtitle="Typical reply in under 5 minutes" onPress={() => demoContact('Chat')} />
          <ListRow icon="mail" title="Email" subtitle="care@vuyostore.in" onPress={() => demoContact('Email')} />
          <ListRow icon="phone" title="Call" subtitle="1800 210 4040 · toll free" onPress={() => demoContact('Calling')} last />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(160).duration(400)} style={styles.section}>
          <AppText variant="overline" color="inkMuted">
            Frequently asked
          </AppText>
          <View>
            {helpTopics.map((t) => (
              <Accordion key={t.id} title={t.title}>
                <AppText variant="small" color="inkSecondary">
                  {t.body}
                </AppText>
              </Accordion>
            ))}
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { padding: gutter, gap: spacing.xxl, paddingBottom: spacing.huge },
  intro: { gap: spacing.sm },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, paddingHorizontal: spacing.lg, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  section: { gap: spacing.sm },
});
