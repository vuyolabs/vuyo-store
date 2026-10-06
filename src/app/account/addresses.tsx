import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeOut, LinearTransition } from 'react-native-reanimated';

import { AddressBlock } from '@/components/checkout/AddressBlock';
import { AddressForm } from '@/components/checkout/AddressForm';
import { AppText, Button, EmptyState, Icon, PressableScale, ScreenHeader } from '@/components/ui';
import { haptics } from '@/lib/haptics';
import { usePreferencesStore } from '@/store/preferencesStore';
import { colors, gutter, radius, spacing } from '@/theme';

export default function AddressesScreen() {
  const addresses = usePreferencesStore((s) => s.addresses);
  const defaultId = usePreferencesStore((s) => s.defaultAddressId);
  const addAddress = usePreferencesStore((s) => s.addAddress);
  const removeAddress = usePreferencesStore((s) => s.removeAddress);
  const setDefault = usePreferencesStore((s) => s.setDefaultAddress);
  const [adding, setAdding] = useState(false);

  return (
    <View style={styles.root}>
      <ScreenHeader title="Saved Addresses" />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {addresses.length === 0 && !adding ? (
            <EmptyState icon="map-pin" title="No saved addresses." body="Add an address to make checkout faster." ctaLabel="Add address" onCta={() => setAdding(true)} />
          ) : null}

          {addresses.map((a, i) => {
            const isDefault = a.id === defaultId;
            return (
              <Animated.View key={a.id} entering={FadeInDown.delay(i * 60).duration(350)} exiting={FadeOut.duration(180)} layout={LinearTransition} style={styles.card}>
                <AddressBlock address={a} />
                <View style={styles.actions}>
                  {isDefault ? (
                    <View style={styles.defaultTag}>
                      <Icon name="check" size={12} color="success" />
                      <AppText variant="caption" color="success">
                        Default
                      </AppText>
                    </View>
                  ) : (
                    <PressableScale
                      onPress={() => {
                        haptics.selection();
                        setDefault(a.id);
                      }}
                      hitSlop={8}
                      accessibilityLabel={`Set ${a.label} as default address`}>
                      <AppText variant="smallMedium" style={styles.underline}>
                        Set as default
                      </AppText>
                    </PressableScale>
                  )}
                  <PressableScale
                    onPress={() => {
                      haptics.medium();
                      removeAddress(a.id);
                    }}
                    hitSlop={8}
                    accessibilityLabel={`Remove ${a.label} address`}>
                    <AppText variant="smallMedium" color="sale">
                      Remove
                    </AppText>
                  </PressableScale>
                </View>
              </Animated.View>
            );
          })}

          {adding ? (
            <Animated.View entering={FadeIn.duration(250)} layout={LinearTransition} style={styles.card}>
              <AppText variant="title">New address</AppText>
              <AddressForm
                onSave={(addr) => {
                  addAddress(addr);
                  haptics.success();
                  setAdding(false);
                }}
                onCancel={() => setAdding(false)}
              />
            </Animated.View>
          ) : addresses.length > 0 ? (
            <Animated.View layout={LinearTransition}>
              <Button label="Add a new address" variant="secondary" icon="plus" iconPosition="left" onPress={() => setAdding(true)} fullWidth />
            </Animated.View>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  content: { padding: gutter, gap: spacing.lg, paddingBottom: spacing.huge, flexGrow: 1 },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.lg, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  actions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: spacing.md, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line },
  defaultTag: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  underline: { textDecorationLine: 'underline' },
});
