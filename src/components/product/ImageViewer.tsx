import { useState } from 'react';
import { Modal, StyleSheet, useWindowDimensions, View } from 'react-native';
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText, IconButton } from '@/components/ui';
import { colors, gutter, spacing } from '@/theme';

import { ZoomableImage } from './ZoomableImage';

interface ImageViewerProps {
  visible: boolean;
  images: string[];
  initialIndex: number;
  productName: string;
  onClose: () => void;
}

/** Full-screen, zoomable product photography. */
export function ImageViewer({ visible, images, initialIndex, productName, onClose }: ImageViewerProps) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(initialIndex);
  const [zoomed, setZoomed] = useState(false);
  const [lastInitial, setLastInitial] = useState(initialIndex);

  if (lastInitial !== initialIndex) {
    setLastInitial(initialIndex);
    setIndex(initialIndex);
  }

  const imageHeight = height - insets.top - insets.bottom - 120;

  return (
    <Modal visible={visible} animationType="fade" statusBarTranslucent navigationBarTranslucent onRequestClose={onClose}>
      <GestureHandlerRootView style={styles.root}>
        <View style={[styles.topBar, { paddingTop: insets.top + spacing.sm }]}>
          <AppText variant="smallMedium" color="inkSecondary" accessibilityLiveRegion="polite">
            {index + 1} / {images.length}
          </AppText>
          <IconButton icon="x" accessibilityLabel="Close image viewer" onPress={onClose} variant="surface" />
        </View>

        <Animated.View entering={FadeIn.duration(250)} style={styles.pager}>
          <FlatList
            data={images}
            horizontal
            pagingEnabled
            scrollEnabled={!zoomed}
            initialScrollIndex={initialIndex}
            getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(uri) => uri}
            onMomentumScrollEnd={(e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
            renderItem={({ item, index: i }) => (
              <View style={{ width, height: imageHeight, justifyContent: 'center' }}>
                <ZoomableImage uri={item} width={width} height={imageHeight} onZoomChange={setZoomed} accessibilityLabel={`${productName}, image ${i + 1} of ${images.length}`} />
              </View>
            )}
          />
        </Animated.View>

        <View style={[styles.hint, { paddingBottom: insets.bottom + spacing.lg }]}>
          <AppText variant="caption" color="inkMuted">
            Pinch or double tap to zoom
          </AppText>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: gutter, paddingBottom: spacing.sm },
  pager: { flex: 1, justifyContent: 'center' },
  hint: { alignItems: 'center', paddingTop: spacing.md },
});
