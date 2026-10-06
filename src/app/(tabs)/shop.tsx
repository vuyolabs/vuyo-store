import { useLocalSearchParams, useScrollToTop } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, TextInput, useWindowDimensions, View } from 'react-native';
import Animated, { FadeIn, LinearTransition } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FilterSheet, ProductCard, ProductGridSkeleton, SortSheet } from '@/components/product';
import { AppText, Button, Chip, EmptyState, Icon, PressableScale } from '@/components/ui';
import { categories } from '@/data/categories';
import { products } from '@/data/products';
import { sortOptions, type SortId } from '@/data/store-info';
import type { CategoryId } from '@/data/types';
import { activeFilterCount, defaultFilters, filterProducts, searchProducts, sortProducts, type CatalogFilters } from '@/lib/catalog';
import { useDebouncedValue, useSimulatedLoading } from '@/lib/hooks';
import { colors, fonts, gutter, radius, spacing } from '@/theme';

const GAP = spacing.md;

function isCategory(value: string | undefined): value is CategoryId | 'all' {
  return value === 'all' || categories.some((c) => c.id === value);
}

function isSort(value: string | undefined): value is SortId {
  return sortOptions.some((o) => o.id === value);
}

export default function ShopScreen() {
  const params = useLocalSearchParams<{ category?: string; sort?: string }>();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const cardWidth = (width - gutter * 2 - GAP) / 2;
  const loading = useSimulatedLoading('shop', 800);
  const listRef = useRef<FlatList>(null);
  useScrollToTop(listRef);

  const [filters, setFilters] = useState<CatalogFilters>(() => ({ ...defaultFilters, category: isCategory(params.category) ? params.category : 'all' }));
  const [sort, setSort] = useState<SortId>(() => (isSort(params.sort) ? params.sort : 'featured'));
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 180);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  // Follow deep links from Home (e.g. tapping a category tile) while the tab stays mounted.
  const [lastParams, setLastParams] = useState(params);
  if (params.category !== lastParams.category || params.sort !== lastParams.sort) {
    setLastParams(params);
    if (isCategory(params.category)) setFilters({ ...defaultFilters, category: params.category });
    if (isSort(params.sort)) setSort(params.sort);
  }

  const base = useMemo(() => (debouncedQuery.trim() ? searchProducts(debouncedQuery) : products), [debouncedQuery]);
  const results = useMemo(() => {
    const filtered = filterProducts(base, filters);
    return debouncedQuery.trim() && sort === 'featured' ? filtered : sortProducts(filtered, sort);
  }, [base, filters, sort, debouncedQuery]);

  const refinements = activeFilterCount(filters);
  const sortLabel = sortOptions.find((o) => o.id === sort)?.label ?? 'Featured';

  const selectCategory = (category: CategoryId | 'all') => {
    setFilters((f) => ({ ...f, category, sizes: [] }));
    listRef.current?.scrollToOffset({ offset: 0, animated: false });
  };

  const resetAll = () => {
    setFilters(defaultFilters);
    setQuery('');
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <AppText variant="h1" accessibilityRole="header">
            Shop
          </AppText>
          <AppText variant="small" color="inkMuted">
            {results.length} {results.length === 1 ? 'piece' : 'pieces'}
          </AppText>
        </View>

        <View style={styles.search}>
          <Icon name="search" size={17} color="inkMuted" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search the collection"
            placeholderTextColor={colors.inkMuted}
            style={styles.searchInput}
            returnKeyType="search"
            autoCorrect={false}
            selectionColor={colors.ink}
            accessibilityLabel="Search the collection"
          />
          {query ? (
            <PressableScale onPress={() => setQuery('')} hitSlop={10} accessibilityLabel="Clear search" style={styles.clear}>
              <Icon name="x" size={16} color="inkSecondary" />
            </PressableScale>
          ) : null}
        </View>
      </View>

      <View style={styles.chipBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          <Chip label="All" selected={filters.category === 'all'} onPress={() => selectCategory('all')} />
          {categories.map((c) => (
            <Chip key={c.id} label={c.name} selected={filters.category === c.id} onPress={() => selectCategory(c.id)} />
          ))}
        </ScrollView>
      </View>

      <View style={styles.toolbar}>
        <PressableScale onPress={() => setFilterOpen(true)} haptic="selection" style={styles.tool} accessibilityLabel={`Filter${refinements ? `, ${refinements} applied` : ''}`}>
          <Icon name="sliders" size={15} />
          <AppText variant="smallMedium">Filter</AppText>
          {refinements > 0 ? (
            <Animated.View entering={FadeIn} style={styles.toolBadge}>
              <AppText variant="caption" color="white" style={styles.toolBadgeText}>
                {refinements}
              </AppText>
            </Animated.View>
          ) : null}
        </PressableScale>
        <View style={styles.toolDivider} />
        <PressableScale onPress={() => setSortOpen(true)} haptic="selection" style={styles.tool} accessibilityLabel={`Sort by ${sortLabel}`}>
          <Icon name="bar-chart-2" size={15} />
          <AppText variant="smallMedium" numberOfLines={1}>
            {sortLabel}
          </AppText>
        </PressableScale>
      </View>

      {loading ? (
        <ScrollView contentContainerStyle={styles.gridPad} scrollEnabled={false}>
          <ProductGridSkeleton cardWidth={cardWidth} gap={GAP} />
        </ScrollView>
      ) : (
        <Animated.FlatList
          ref={listRef}
          key={`${filters.category}-${sort}`}
          data={results}
          keyExtractor={(p) => p.id}
          numColumns={2}
          columnWrapperStyle={{ gap: GAP }}
          contentContainerStyle={[styles.gridPad, results.length === 0 && styles.emptyPad]}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
          itemLayoutAnimation={LinearTransition.duration(260)}
          ItemSeparatorComponent={() => <View style={{ height: spacing.xxl }} />}
          renderItem={({ item, index }) => <ProductCard product={item} width={cardWidth} index={index} />}
          ListEmptyComponent={
            <EmptyState
              icon="search"
              title="Nothing matches — yet."
              body={debouncedQuery ? `We couldn't find anything for “${debouncedQuery}” with these filters.` : 'Try removing a filter or two to see more of the collection.'}
              ctaLabel="Clear all"
              onCta={resetAll}
            />
          }
          ListFooterComponent={
            results.length > 0 && refinements > 0 ? (
              <View style={styles.footer}>
                <Button label="Clear filters" variant="secondary" size="sm" onPress={() => setFilters((f) => ({ ...defaultFilters, category: f.category }))} />
              </View>
            ) : null
          }
        />
      )}

      <FilterSheet
        visible={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        onApply={setFilters}
        countFor={(draft) => filterProducts(base, draft).length}
      />
      <SortSheet visible={sortOpen} onClose={() => setSortOpen(false)} value={sort} onChange={setSort} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: gutter, paddingTop: spacing.md, gap: spacing.md },
  titleRow: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  search: {
    height: 46,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: spacing.lg,
    paddingRight: spacing.sm,
    gap: spacing.sm,
  },
  searchInput: { flex: 1, height: '100%', fontFamily: fonts.sans, fontSize: 15, color: colors.ink },
  clear: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  // Fixed height so the horizontal row can never collapse under the toolbar.
  chipBar: { height: 38 + spacing.md * 2, marginBottom: spacing.sm },
  chips: { paddingHorizontal: gutter, alignItems: 'center', gap: spacing.sm },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: gutter,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.lineStrong,
  },
  tool: { flex: 1, height: 46, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  toolDivider: { width: StyleSheet.hairlineWidth, height: 20, backgroundColor: colors.lineStrong },
  toolBadge: { minWidth: 18, height: 18, borderRadius: 9, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  toolBadgeText: { fontSize: 10.5, lineHeight: 13 },
  gridPad: { paddingHorizontal: gutter, paddingTop: spacing.xl, paddingBottom: spacing.huge },
  emptyPad: { flexGrow: 1 },
  footer: { alignItems: 'center', paddingTop: spacing.xxxl },
});
