import Feather from '@expo/vector-icons/Feather';
import type { ComponentProps } from 'react';

import { colors, type ColorName } from '@/theme';

export type IconName = ComponentProps<typeof Feather>['name'];

interface IconProps {
  name: IconName;
  size?: number;
  color?: ColorName;
}

export function Icon({ name, size = 20, color = 'ink' }: IconProps) {
  return <Feather name={name} size={size} color={colors[color]} accessibilityElementsHidden importantForAccessibility="no" />;
}
