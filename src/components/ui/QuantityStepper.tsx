import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp, FadeOutDown, FadeOutUp } from 'react-native-reanimated';

import { colors, fonts, radius } from '@/theme';

import { Icon } from './Icon';
import { PressableScale } from './PressableScale';

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  /** Shown when decrementing would remove the item. */
  removeAtMin?: boolean;
  itemName?: string;
}

/** Compact −/+ control; the number rolls up or down with each change. */
export function QuantityStepper({ value, onChange, min = 1, max = 10, removeAtMin = false, itemName = 'item' }: QuantityStepperProps) {
  const [previous, setPrevious] = useState(value);
  const [increasing, setIncreasing] = useState(true);
  if (previous !== value) {
    setIncreasing(value > previous);
    setPrevious(value);
  }

  const atMin = value <= min;
  const canDecrement = !atMin || removeAtMin;

  return (
    <View style={styles.wrap} accessibilityRole="adjustable" accessibilityLabel={`Quantity of ${itemName}`} accessibilityValue={{ now: value, min, max }}>
      <PressableScale
        haptic="selection"
        scaleTo={0.85}
        disabled={!canDecrement}
        onPress={() => onChange(value - 1)}
        style={styles.button}
        accessibilityLabel={atMin && removeAtMin ? `Remove ${itemName}` : `Decrease quantity of ${itemName}`}>
        <Icon name={atMin && removeAtMin ? 'trash-2' : 'minus'} size={14} />
      </PressableScale>

      <View style={styles.valueWrap}>
        <Animated.Text
          key={value}
          entering={(increasing ? FadeInUp : FadeInDown).duration(180)}
          exiting={(increasing ? FadeOutUp : FadeOutDown).duration(140)}
          style={styles.value}
          allowFontScaling={false}>
          {value}
        </Animated.Text>
      </View>

      <PressableScale
        haptic="selection"
        scaleTo={0.85}
        disabled={value >= max}
        onPress={() => onChange(value + 1)}
        style={styles.button}
        accessibilityLabel={`Increase quantity of ${itemName}`}>
        <Icon name="plus" size={14} />
      </PressableScale>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.pill,
    height: 36,
    backgroundColor: colors.surface,
  },
  button: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  valueWrap: { width: 24, height: 22, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  value: { position: 'absolute', fontFamily: fonts.sansSemiBold, fontSize: 14, color: colors.ink },
});
