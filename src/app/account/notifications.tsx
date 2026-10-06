import { ScrollView, StyleSheet, Switch, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ListRow, ScreenHeader, AppText } from '@/components/ui';
import { haptics } from '@/lib/haptics';
import { usePreferencesStore, type NotificationPreferences } from '@/store/preferencesStore';
import { colors, gutter, radius, spacing } from '@/theme';

const options: { key: keyof NotificationPreferences; title: string; subtitle: string }[] = [
  { key: 'orderUpdates', title: 'Order updates', subtitle: 'Dispatch, delivery and return status' },
  { key: 'newArrivals', title: 'New arrivals', subtitle: 'Be first to see each new drop' },
  { key: 'restocks', title: 'Back in stock', subtitle: 'When a wishlist piece returns in your size' },
  { key: 'offers', title: 'Offers & events', subtitle: 'Members’ previews and seasonal sales' },
];

export default function NotificationsScreen() {
  const notifications = usePreferencesStore((s) => s.notifications);
  const setNotification = usePreferencesStore((s) => s.setNotification);

  return (
    <View style={styles.root}>
      <ScreenHeader title="Notifications" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(400)} style={styles.card}>
          {options.map((o, i) => (
            <ListRow
              key={o.key}
              title={o.title}
              subtitle={o.subtitle}
              last={i === options.length - 1}
              right={
                <Switch
                  value={notifications[o.key]}
                  onValueChange={(v) => {
                    haptics.selection();
                    setNotification(o.key, v);
                  }}
                  trackColor={{ true: colors.ink, false: colors.surfaceSunken }}
                  thumbColor={colors.white}
                  ios_backgroundColor={colors.surfaceSunken}
                  accessibilityLabel={o.title}
                />
              }
            />
          ))}
        </Animated.View>
        <AppText variant="caption" color="inkMuted" align="center">
          Preferences are saved on this device. We never send more than one marketing message a week.
        </AppText>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { padding: gutter, gap: spacing.lg, paddingBottom: spacing.huge },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, paddingHorizontal: spacing.lg, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
});
