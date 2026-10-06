import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, TextField } from '@/components/ui';
import type { Address } from '@/data/types';
import { createId } from '@/lib/utils';
import { spacing } from '@/theme';

type FormState = Omit<Address, 'id'>;
type Errors = Partial<Record<keyof FormState, string>>;

const empty: FormState = { label: 'Home', fullName: 'Aasif Ali', phone: '', line1: '', line2: '', city: '', state: '', pincode: '' };

function validate(f: FormState): Errors {
  const errors: Errors = {};
  if (!f.fullName.trim()) errors.fullName = 'Enter the recipient’s name';
  if (!/^\+?[\d\s]{10,15}$/.test(f.phone.trim())) errors.phone = 'Enter a valid 10-digit mobile number';
  if (!f.line1.trim()) errors.line1 = 'Enter a flat, house or building';
  if (!f.city.trim()) errors.city = 'Enter a city';
  if (!f.state.trim()) errors.state = 'Enter a state';
  if (!/^\d{6}$/.test(f.pincode.trim())) errors.pincode = 'PIN code must be 6 digits';
  return errors;
}

interface AddressFormProps {
  onSave: (address: Address) => void;
  onCancel?: () => void;
}

export function AddressForm({ onSave, onCancel }: AddressFormProps) {
  const [form, setForm] = useState<FormState>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  const set = (key: keyof FormState) => (value: string) => {
    const next = { ...form, [key]: value };
    setForm(next);
    if (submitted) setErrors(validate(next));
  };

  const save = () => {
    setSubmitted(true);
    const e = validate(form);
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    onSave({ ...form, id: createId('addr'), line2: form.line2?.trim() || undefined });
  };

  return (
    <View style={styles.form}>
      <TextField label="Full name" value={form.fullName} onChangeText={set('fullName')} error={errors.fullName} autoComplete="name" textContentType="name" />
      <TextField label="Mobile number" value={form.phone} onChangeText={set('phone')} error={errors.phone} keyboardType="phone-pad" autoComplete="tel" textContentType="telephoneNumber" placeholder="+91" />
      <TextField label="Flat, house, building" value={form.line1} onChangeText={set('line1')} error={errors.line1} autoComplete="address-line1" />
      <TextField label="Area, street (optional)" value={form.line2} onChangeText={set('line2')} autoComplete="address-line2" />
      <View style={styles.row}>
        <View style={styles.flex}>
          <TextField label="City" value={form.city} onChangeText={set('city')} error={errors.city} />
        </View>
        <View style={styles.flex}>
          <TextField label="PIN code" value={form.pincode} onChangeText={set('pincode')} error={errors.pincode} keyboardType="number-pad" maxLength={6} autoComplete="postal-code" />
        </View>
      </View>
      <TextField label="State" value={form.state} onChangeText={set('state')} error={errors.state} />
      <View style={styles.row}>
        {['Home', 'Work', 'Other'].map((l) => (
          <Button key={l} label={l} size="sm" variant={form.label === l ? 'primary' : 'secondary'} onPress={() => setForm({ ...form, label: l })} accessibilityLabel={`Label address as ${l}`} />
        ))}
      </View>
      <View style={styles.actions}>
        {onCancel ? <Button label="Cancel" variant="ghost" size="md" onPress={onCancel} /> : null}
        <Button label="Save address" size="md" onPress={save} style={styles.flex} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: spacing.lg },
  row: { flexDirection: 'row', gap: spacing.md },
  flex: { flex: 1 },
  actions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.sm },
});
