import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppImage, AppText, Button, Sheet } from '@/components/ui';
import { getProduct } from '@/data/products';
import type { Product } from '@/data/types';
import { haptics } from '@/lib/haptics';
import { useCartStore } from '@/store/cartStore';
import { usePreferencesStore } from '@/store/preferencesStore';
import { radius, spacing } from '@/theme';

import { ColorSelector } from './ColorSelector';
import { PriceTag } from './PriceTag';
import { SizeGuideSheet } from './SizeGuideSheet';
import { SizeSelector } from './SizeSelector';

interface QuickAddSheetProps {
  product?: Product;
  onClose: () => void;
  onAdded?: (product: Product, color: string, size?: string) => void;
}

/** Choose colour and size without leaving the current screen. */
export function QuickAddSheet({ product, onClose, onAdded }: QuickAddSheetProps) {
  const addItem = useCartStore((s) => s.addItem);
  const sizes = usePreferencesStore((s) => s.sizes);
  const [color, setColor] = useState('');
  const [size, setSize] = useState<string>();
  const [attention, setAttention] = useState(0);
  const [guideOpen, setGuideOpen] = useState(false);
  const [lastId, setLastId] = useState<string>();

  // Reset choices whenever a different product is opened.
  if (product && product.id !== lastId) {
    setLastId(product.id);
    setColor(product.colors[0]?.name ?? '');
    const preferred = product.category === 'clothing' ? sizes.clothing : product.category === 'shoes' ? sizes.shoes : undefined;
    setSize(preferred && product.sizes?.includes(preferred) ? preferred : undefined);
    setAttention(0);
  }

  // Keep showing the last product while the sheet animates closed.
  const shown = product ?? (lastId ? getProduct(lastId) : undefined);

  const add = () => {
    if (!product) return;
    if (product.sizes?.length && !size) {
      haptics.warning();
      setAttention((n) => n + 1);
      return;
    }
    addItem({ productId: product.id, color, size });
    haptics.success();
    onAdded?.(product, color, size);
    onClose();
  };

  return (
    <>
      <Sheet visible={!!product} onClose={onClose} title="Add to Bag" footer={<Button label="Add to Bag" icon="shopping-bag" fullWidth onPress={add} />}>
        {shown ? (
          <View style={styles.body}>
            <View style={styles.summary}>
              <AppImage uri={shown.images[0]} style={styles.image} />
              <View style={styles.text}>
                <AppText variant="title">{shown.name}</AppText>
                <PriceTag price={shown.price} originalPrice={shown.originalPrice} />
              </View>
            </View>
            <ColorSelector options={shown.colors} selected={color} onSelect={setColor} />
            {shown.sizes?.length ? (
              <SizeSelector sizes={shown.sizes} selected={size} onSelect={setSize} onOpenGuide={() => setGuideOpen(true)} attention={attention} />
            ) : null}
          </View>
        ) : null}
      </Sheet>
      {product?.sizes?.length ? (
        <SizeGuideSheet visible={guideOpen} onClose={() => setGuideOpen(false)} category={product.category} fit={product.fit} highlight={size} />
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  body: { gap: spacing.xxl, paddingTop: spacing.sm },
  summary: { flexDirection: 'row', gap: spacing.lg, alignItems: 'center' },
  image: { width: 72, height: 90, borderRadius: radius.sm },
  text: { flex: 1, gap: spacing.xs },
});
