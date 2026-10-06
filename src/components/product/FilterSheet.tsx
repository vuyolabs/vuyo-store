import Ionicons from '@expo/vector-icons/Ionicons';
import { useState, type ReactNode } from 'react';
import { StyleSheet, Switch, View } from 'react-native';

import { AppText, Button, Chip, Sheet } from '@/components/ui';
import { categories } from '@/data/categories';
import { priceRanges, type PriceRangeId } from '@/data/store-info';
import type { CategoryId } from '@/data/types';
import { activeFilterCount, colorFamilies, defaultFilters, filterSizes, type CatalogFilters } from '@/lib/catalog';
import { colors, spacing } from '@/theme';

interface FilterSheetProps {
  visible: boolean;
  onClose: () => void;
  filters: CatalogFilters;
  onApply: (filters: CatalogFilters) => void;
  /** Live result count for the draft filters. */
  countFor: (filters: CatalogFilters) => number;
}

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <AppText variant="overline" color="inkMuted">
        {title}
      </AppText>
      {children}
    </View>
  );
}

export function FilterSheet({ visible, onClose, filters, onApply, countFor }: FilterSheetProps) {
  const [draft, setDraft] = useState(filters);
  const [wasVisible, setWasVisible] = useState(visible);

  // Start from the applied filters each time the sheet opens.
  if (visible !== wasVisible) {
    setWasVisible(visible);
    if (visible) setDraft(filters);
  }

  const count = countFor(draft);
  const sizeOptions = draft.category === 'shoes' ? filterSizes.shoes : draft.category === 'clothing' ? filterSizes.clothing : [...filterSizes.clothing, ...filterSizes.shoes];

  return (
    <Sheet
      visible={visible}
      onClose={onClose}
      title="Filter"
      headerAction={
        activeFilterCount(draft) > 0 || draft.category !== 'all' ? (
          <Button label="Reset" variant="ghost" size="sm" onPress={() => setDraft(defaultFilters)} />
        ) : null
      }
      footer={
        <Button
          label={count === 0 ? 'No matching pieces' : `Show ${count} ${count === 1 ? 'piece' : 'pieces'}`}
          fullWidth
          disabled={count === 0}
          onPress={() => {
            onApply(draft);
            onClose();
          }}
        />
      }>
      <Section title="Category">
        <View style={styles.wrap}>
          <Chip label="All" selected={draft.category === 'all'} onPress={() => setDraft({ ...draft, category: 'all', sizes: [] })} />
          {categories.map((c) => (
            <Chip key={c.id} label={c.name} selected={draft.category === c.id} onPress={() => setDraft({ ...draft, category: c.id as CategoryId, sizes: [] })} />
          ))}
        </View>
      </Section>

      <Section title="Price">
        <View style={styles.wrap}>
          {priceRanges.map((r) => (
            <Chip key={r.id} label={r.label} selected={draft.priceRanges.includes(r.id)} onPress={() => setDraft({ ...draft, priceRanges: toggle<PriceRangeId>(draft.priceRanges, r.id) })} />
          ))}
        </View>
      </Section>

      {draft.category === 'all' || draft.category === 'clothing' || draft.category === 'shoes' ? (
        <Section title="Size">
          <View style={styles.wrap}>
            {sizeOptions.map((s) => (
              <Chip key={s} label={s} selected={draft.sizes.includes(s)} onPress={() => setDraft({ ...draft, sizes: toggle(draft.sizes, s) })} accessibilityLabel={`Size ${s}`} />
            ))}
          </View>
        </Section>
      ) : null}

      <Section title="Colour">
        <View style={styles.wrap}>
          {colorFamilies.map((c) => (
            <Chip key={c.id} label={c.id} swatch={c.hex} selected={draft.colors.includes(c.id)} onPress={() => setDraft({ ...draft, colors: toggle(draft.colors, c.id) })} />
          ))}
        </View>
      </Section>

      <Section title="Rating">
        <View style={styles.wrap}>
          {[4.5, 4, 0].map((r) => (
            <Chip key={r} label={r === 0 ? 'Any' : `${r}★ & up`} selected={draft.minRating === r} onPress={() => setDraft({ ...draft, minRating: r })} accessibilityLabel={r === 0 ? 'Any rating' : `${r} stars and up`} />
          ))}
        </View>
      </Section>

      <View style={[styles.section, styles.switchRow]}>
        <View style={styles.switchText}>
          <Ionicons name="pricetag-outline" size={16} color={colors.ink} />
          <AppText variant="bodyMedium">On sale only</AppText>
        </View>
        <Switch
          value={draft.onSale}
          onValueChange={(v) => setDraft({ ...draft, onSale: v })}
          trackColor={{ true: colors.ink, false: colors.surfaceSunken }}
          thumbColor={colors.white}
          ios_backgroundColor={colors.surfaceSunken}
          accessibilityLabel="On sale only"
        />
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  section: { gap: spacing.md, paddingTop: spacing.xl },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  switchText: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
});
