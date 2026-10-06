import { StyleSheet, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';

import { AppText, Icon, PressableScale, Sheet } from '@/components/ui';
import { sortOptions, type SortId } from '@/data/store-info';
import { colors } from '@/theme';

interface SortSheetProps {
  visible: boolean;
  onClose: () => void;
  value: SortId;
  onChange: (value: SortId) => void;
}

export function SortSheet({ visible, onClose, value, onChange }: SortSheetProps) {
  return (
    <Sheet visible={visible} onClose={onClose} title="Sort by">
      <View accessibilityRole="radiogroup">
        {sortOptions.map((o) => {
          const selected = o.id === value;
          return (
            <PressableScale
              key={o.id}
              scaleTo={0.99}
              haptic="selection"
              onPress={() => {
                onChange(o.id);
                onClose();
              }}
              style={styles.row}
              accessibilityRole="radio"
              accessibilityLabel={o.label}
              accessibilityState={{ checked: selected }}>
              <AppText variant={selected ? 'bodyMedium' : 'body'} color={selected ? 'ink' : 'inkSecondary'}>
                {o.label}
              </AppText>
              {selected ? (
                <Animated.View entering={ZoomIn.springify().damping(14)}>
                  <Icon name="check" size={18} />
                </Animated.View>
              ) : null}
            </PressableScale>
          );
        })}
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
  },
});
