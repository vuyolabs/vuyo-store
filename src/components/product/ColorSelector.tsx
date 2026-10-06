import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';

import { AppText, PressableScale } from '@/components/ui';
import type { ProductColor } from '@/data/types';
import { colors, spacing } from '@/theme';

interface ColorSelectorProps {
  options: ProductColor[];
  selected: string;
  onSelect: (name: string) => void;
}

function Swatch({ color, selected, onPress }: { color: ProductColor; selected: boolean; onPress: () => void }) {
  const ringStyle = useAnimatedStyle(() => ({
    opacity: withTiming(selected ? 1 : 0, { duration: 180 }),
    transform: [{ scale: withSpring(selected ? 1 : 0.8, { damping: 14, stiffness: 240 }) }],
  }));

  return (
    <PressableScale
      onPress={onPress}
      haptic="selection"
      scaleTo={0.9}
      style={styles.hit}
      accessibilityRole="radio"
      accessibilityLabel={color.name}
      accessibilityState={{ checked: selected }}>
      <Animated.View style={[styles.ring, ringStyle]} />
      <View style={[styles.swatch, { backgroundColor: color.hex }]} />
    </PressableScale>
  );
}

export function ColorSelector({ options, selected, onSelect }: ColorSelectorProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.labelRow}>
        <AppText variant="smallMedium">Colour</AppText>
        <AppText variant="small" color="inkSecondary">
          {selected}
        </AppText>
      </View>
      <View style={styles.row} accessibilityRole="radiogroup" accessibilityLabel="Colour">
        {options.map((c) => (
          <Swatch key={c.name} color={c} selected={c.name === selected} onPress={() => onSelect(c.name)} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.md },
  labelRow: { flexDirection: 'row', gap: spacing.sm, alignItems: 'baseline' },
  row: { flexDirection: 'row', gap: spacing.xs, flexWrap: 'wrap', marginLeft: -spacing.xs },
  hit: { width: 46, height: 46, alignItems: 'center', justifyContent: 'center' },
  ring: { position: 'absolute', width: 42, height: 42, borderRadius: 21, borderWidth: 1.5, borderColor: colors.ink },
  swatch: { width: 32, height: 32, borderRadius: 16, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.lineStrong },
});
