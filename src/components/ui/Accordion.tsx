import { useEffect, useState, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { colors, spacing } from '@/theme';

import { AppText } from './AppText';
import { Icon } from './Icon';
import { PressableScale } from './PressableScale';

interface AccordionProps {
  title: string;
  children: ReactNode;
  initiallyOpen?: boolean;
}

export function Accordion({ title, children, initiallyOpen = false }: AccordionProps) {
  const [open, setOpen] = useState(initiallyOpen);
  const rotation = useSharedValue(initiallyOpen ? 1 : 0);

  useEffect(() => {
    rotation.set(withTiming(open ? 1 : 0, { duration: 220 }));
  }, [open, rotation]);

  const chevronStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${rotation.get() * 180}deg` }] }));

  return (
    <View style={styles.wrap}>
      <PressableScale
        scaleTo={0.99}
        haptic="selection"
        onPress={() => setOpen((v) => !v)}
        style={styles.header}
        accessibilityLabel={title}
        accessibilityState={{ expanded: open }}>
        <AppText variant="title">{title}</AppText>
        <Animated.View style={chevronStyle}>
          <Icon name="chevron-down" size={18} />
        </Animated.View>
      </PressableScale>
      {open ? (
        <Animated.View entering={FadeIn.duration(220)} style={styles.body}>
          {children}
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.lineStrong },
  header: { minHeight: 58, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  body: { paddingBottom: spacing.xl, gap: spacing.sm },
});
