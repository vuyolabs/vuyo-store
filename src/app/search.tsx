import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Keyboard, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeOut, LinearTransition } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PriceTag } from '@/components/product';
import { AppImage, AppText, Icon, IconButton, PressableScale } from '@/components/ui';
import { categories, getCategoryName } from '@/data/categories';
import { popularSearches } from '@/data/store-info';
import type { Product } from '@/data/types';
import { searchProducts } from '@/lib/catalog';
import { useDebouncedValue } from '@/lib/hooks';
import { usePreferencesStore } from '@/store/preferencesStore';
import { colors, fonts, gutter, radius, spacing } from '@/theme';

function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim().toLowerCase();
  const i = q ? text.toLowerCase().indexOf(q) : -1;
  if (i < 0) return <AppText variant="smallMedium">{text}</AppText>;
  return (
    <AppText variant="small">
      {text.slice(0, i)}
      <AppText variant="smallMedium">{text.slice(i, i + q.length)}</AppText>
      {text.slice(i + q.length)}
    </AppText>
  );
}

function ResultRow({ product, query, onPress }: { product: Product; query: string; onPress: () => void }) {
  return (
    <PressableScale onPress={onPress} scaleTo={0.985} style={styles.result} accessibilityLabel={`${product.name}, ${getCategoryName(product.category)}`}>
      <AppImage uri={product.images[0]} style={styles.thumb} />
      <View style={styles.resultText}>
        <Highlight text={product.name} query={query} />
        <AppText variant="caption" color="inkMuted">
          {getCategoryName(product.category)}
        </AppText>
        <PriceTag price={product.price} originalPrice={product.originalPrice} />
      </View>
      <Icon name="arrow-up-right" size={16} color="inkMuted" />
    </PressableScale>
  );
}

function Pill({ label, onPress, onRemove, icon }: { label: string; onPress: () => void; onRemove?: () => void; icon?: 'clock' | 'trending-up' }) {
  return (
    <Animated.View entering={FadeIn} exiting={FadeOut.duration(150)} layout={LinearTransition}>
      <PressableScale onPress={onPress} haptic="selection" scaleTo={0.95} style={styles.pill} accessibilityLabel={`Search for ${label}`}>
        {icon ? <Icon name={icon} size={13} color="inkMuted" /> : null}
        <AppText variant="smallMedium">{label}</AppText>
        {onRemove ? (
          <PressableScale onPress={onRemove} hitSlop={10} accessibilityLabel={`Remove ${label} from recent searches`}>
            <Icon name="x" size={13} color="inkMuted" />
          </PressableScale>
        ) : null}
      </PressableScale>
    </Animated.View>
  );
}

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const debounced = useDebouncedValue(query, 150);
  const recent = usePreferencesStore((s) => s.recentSearches);
  const addRecent = usePreferencesStore((s) => s.addRecentSearch);
  const removeRecent = usePreferencesStore((s) => s.removeRecentSearch);
  const clearRecent = usePreferencesStore((s) => s.clearRecentSearches);

  const results = useMemo(() => searchProducts(debounced), [debounced]);
  const hasQuery = debounced.trim().length > 0;

  const openProduct = (p: Product) => {
    if (query.trim()) addRecent(query.trim());
    Keyboard.dismiss();
    router.push({ pathname: '/product/[id]', params: { id: p.id } });
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.bar}>
        <IconButton icon="arrow-left" accessibilityLabel="Close search" onPress={() => router.back()} />
        <View style={styles.field}>
          <Icon name="search" size={17} color="inkMuted" />
          <TextInput
            autoFocus
            value={query}
            onChangeText={setQuery}
            placeholder="Search products, categories…"
            placeholderTextColor={colors.inkMuted}
            returnKeyType="search"
            onSubmitEditing={() => query.trim() && addRecent(query.trim())}
            autoCorrect={false}
            style={styles.input}
            selectionColor={colors.ink}
            accessibilityLabel="Search Vuyo Store"
          />
          {query ? (
            <PressableScale onPress={() => setQuery('')} hitSlop={10} accessibilityLabel="Clear search" style={styles.clear}>
              <Icon name="x" size={16} color="inkSecondary" />
            </PressableScale>
          ) : null}
        </View>
      </View>

      {!hasQuery ? (
        <ScrollView contentContainerStyle={styles.idle} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
          {recent.length > 0 ? (
            <Animated.View entering={FadeInDown.duration(300)} layout={LinearTransition} style={styles.block}>
              <View style={styles.blockHeader}>
                <AppText variant="overline" color="inkMuted">
                  Recent searches
                </AppText>
                <PressableScale onPress={clearRecent} hitSlop={10} accessibilityLabel="Clear recent searches">
                  <AppText variant="caption" color="inkSecondary" style={styles.underline}>
                    Clear
                  </AppText>
                </PressableScale>
              </View>
              <View style={styles.pills}>
                {recent.map((r) => (
                  <Pill key={r} label={r} icon="clock" onPress={() => setQuery(r)} onRemove={() => removeRecent(r)} />
                ))}
              </View>
            </Animated.View>
          ) : null}

          <Animated.View entering={FadeInDown.delay(60).duration(300)} layout={LinearTransition} style={styles.block}>
            <AppText variant="overline" color="inkMuted">
              Popular right now
            </AppText>
            <View style={styles.pills}>
              {popularSearches.map((p) => (
                <Pill key={p} label={p} icon="trending-up" onPress={() => setQuery(p)} />
              ))}
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(120).duration(300)} layout={LinearTransition} style={styles.block}>
            <AppText variant="overline" color="inkMuted">
              Browse categories
            </AppText>
            {categories.map((c) => (
              <PressableScale
                key={c.id}
                onPress={() => {
                  router.back();
                  router.navigate({ pathname: '/shop', params: { category: c.id } });
                }}
                scaleTo={0.985}
                style={styles.category}
                accessibilityLabel={`Browse ${c.name}`}>
                <AppImage uri={c.image} style={styles.categoryThumb} />
                <View style={styles.resultText}>
                  <AppText variant="bodyMedium">{c.name}</AppText>
                  <AppText variant="caption" color="inkMuted">
                    {c.blurb}
                  </AppText>
                </View>
                <Icon name="chevron-right" size={18} color="inkMuted" />
              </PressableScale>
            ))}
          </Animated.View>
        </ScrollView>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(p) => p.id}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={styles.results}
          ListHeaderComponent={
            results.length > 0 ? (
              <AppText variant="caption" color="inkMuted" style={styles.count} accessibilityLiveRegion="polite">
                {results.length} {results.length === 1 ? 'result' : 'results'} for “{debounced.trim()}”
              </AppText>
            ) : null
          }
          renderItem={({ item, index }) => (
            <Animated.View entering={FadeInDown.delay(Math.min(index, 8) * 30).duration(260)}>
              <ResultRow product={item} query={debounced} onPress={() => openProduct(item)} />
            </Animated.View>
          )}
          ListEmptyComponent={
            <Animated.View entering={FadeIn.duration(300)} style={styles.noResults}>
              <AppText variant="h2" align="center">
                No results for “{debounced.trim()}”
              </AppText>
              <AppText variant="body" color="inkSecondary" align="center">
                Check the spelling or try something broader. These are popular right now:
              </AppText>
              <View style={[styles.pills, styles.centerPills]}>
                {popularSearches.slice(0, 5).map((p) => (
                  <Pill key={p} label={p} onPress={() => setQuery(p)} />
                ))}
              </View>
            </Animated.View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  bar: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingLeft: spacing.sm, paddingRight: gutter, paddingVertical: spacing.sm },
  field: {
    flex: 1,
    height: 46,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.ink,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: spacing.lg,
    paddingRight: spacing.sm,
    gap: spacing.sm,
  },
  input: { flex: 1, height: '100%', fontFamily: fonts.sans, fontSize: 15, color: colors.ink },
  clear: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  idle: { paddingHorizontal: gutter, paddingTop: spacing.lg, paddingBottom: spacing.huge, gap: spacing.xxxl },
  block: { gap: spacing.md },
  blockHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  centerPills: { justifyContent: 'center' },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    height: 38,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  underline: { textDecorationLine: 'underline' },
  category: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg, paddingVertical: spacing.xs },
  categoryThumb: { width: 52, height: 52, borderRadius: radius.sm },
  results: { paddingHorizontal: gutter, paddingBottom: spacing.huge, flexGrow: 1 },
  count: { paddingVertical: spacing.md },
  result: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg, paddingVertical: spacing.md, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
  thumb: { width: 60, height: 76, borderRadius: radius.sm },
  resultText: { flex: 1, gap: 3 },
  noResults: { paddingTop: spacing.huge, gap: spacing.lg, alignItems: 'center' },
});
