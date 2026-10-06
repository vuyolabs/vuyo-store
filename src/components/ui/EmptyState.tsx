import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { colors, spacing } from '@/theme';

import { AppText } from './AppText';
import { Button } from './Button';
import { Icon, type IconName } from './Icon';

interface EmptyStateProps {
  icon: IconName;
  title: string;
  body: string;
  ctaLabel?: string;
  onCta?: () => void;
}

export function EmptyState({ icon, title, body, ctaLabel, onCta }: EmptyStateProps) {
  return (
    <View style={styles.wrap}>
      <Animated.View entering={FadeInDown.duration(500).springify().damping(18)} style={styles.iconRing}>
        <Icon name={icon} size={26} />
      </Animated.View>
      <Animated.View entering={FadeInDown.delay(80).duration(500)} style={styles.text}>
        <AppText variant="h2" align="center" accessibilityRole="header">
          {title}
        </AppText>
        <AppText variant="body" color="inkSecondary" align="center">
          {body}
        </AppText>
      </Animated.View>
      {ctaLabel && onCta ? (
        <Animated.View entering={FadeInDown.delay(160).duration(500)}>
          <Button label={ctaLabel} onPress={onCta} icon="arrow-right" />
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xxxl, gap: spacing.xxl, paddingVertical: spacing.huge },
  iconRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  text: { gap: spacing.sm, maxWidth: 320 },
});
