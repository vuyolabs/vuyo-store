import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, type SharedValue } from 'react-native-reanimated';

import { AppImage } from '@/components/ui';
import { haptics } from '@/lib/haptics';
import { colors, spacing } from '@/theme';

import { ImageViewer } from './ImageViewer';

interface ImageGalleryProps {
  images: string[];
  width: number;
  height: number;
  productName: string;
}

function Dot({ index, progress }: { index: number; progress: SharedValue<number> }) {
  const style = useAnimatedStyle(() => ({
    width: interpolate(progress.get(), [index - 1, index, index + 1], [6, 22, 6], 'clamp'),
    opacity: interpolate(progress.get(), [index - 1, index, index + 1], [0.4, 1, 0.4], 'clamp'),
  }));
  return <Animated.View style={[styles.dot, style]} />;
}

/** Swipeable product gallery with fluid pagination; tap any image for a full-screen zoom view. */
export function ImageGallery({ images, width, height, productName }: ImageGalleryProps) {
  const progress = useSharedValue(0);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const [current, setCurrent] = useState(0);

  const onScroll = useAnimatedScrollHandler((e) => {
    progress.set(e.contentOffset.x / width);
  });

  return (
    <View style={{ width, height }}>
      <Animated.ScrollView
        horizontal
        pagingEnabled
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        onMomentumScrollEnd={(e) => {
          const next = Math.round(e.nativeEvent.contentOffset.x / width);
          if (next !== current) haptics.selection();
          setCurrent(next);
        }}
        accessibilityLabel={`${productName} image gallery, ${images.length} images`}>
        {images.map((uri, i) => (
          <Pressable
            key={uri}
            onPress={() => setViewerIndex(i)}
            accessibilityRole="imagebutton"
            accessibilityLabel={`${productName}, image ${i + 1} of ${images.length}`}
            accessibilityHint="Opens full-screen zoom">
            <AppImage uri={uri} style={{ width, height }} priority={i === 0 ? 'high' : 'normal'} />
          </Pressable>
        ))}
      </Animated.ScrollView>

      {images.length > 1 ? (
        <View style={styles.dots} pointerEvents="none">
          {images.map((uri, i) => (
            <Dot key={uri} index={i} progress={progress} />
          ))}
        </View>
      ) : null}

      <ImageViewer
        visible={viewerIndex !== null}
        images={images}
        initialIndex={viewerIndex ?? 0}
        productName={productName}
        onClose={() => setViewerIndex(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  dots: {
    position: 'absolute',
    bottom: spacing.xl,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.75)',
  },
  dot: { height: 6, borderRadius: 3, backgroundColor: colors.ink },
});
