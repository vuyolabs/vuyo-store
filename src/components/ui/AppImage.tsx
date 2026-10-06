import { Image, type ImageProps } from 'expo-image';
import { StyleSheet } from 'react-native';

import { colors } from '@/theme';

interface AppImageProps extends Omit<ImageProps, 'source'> {
  uri: string;
}

/** expo-image with brand defaults: warm placeholder tone, soft fade-in, disk caching. */
export function AppImage({ uri, style, contentFit = 'cover', transition = 280, ...rest }: AppImageProps) {
  return (
    <Image
      source={{ uri }}
      contentFit={contentFit}
      transition={transition}
      cachePolicy="memory-disk"
      recyclingKey={uri}
      style={[styles.image, style]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  image: { backgroundColor: colors.surfaceMuted },
});
