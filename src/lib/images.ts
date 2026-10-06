/**
 * Product photography is served from the Unsplash imgix CDN. Detail shots are
 * produced from the same photograph using focal-point zoom crops, so every
 * product gets a believable multi-image gallery.
 */
const CDN = 'https://images.unsplash.com/photo-';

interface ShotOptions {
  /** Focal point, 0–1 from the left edge. */
  x?: number;
  /** Focal point, 0–1 from the top edge. */
  y?: number;
  /** Zoom factor, 1 = full frame. */
  zoom?: number;
  width?: number;
  height?: number;
}

export function shot(photoId: string, options: ShotOptions = {}): string {
  const { x, y, zoom, width = 900, height = 1125 } = options;
  const params = [`w=${width}`, `h=${height}`, 'fit=crop', 'q=80', 'auto=format'];
  if (zoom && zoom > 1) {
    params.push('crop=focalpoint', `fp-x=${x ?? 0.5}`, `fp-y=${y ?? 0.5}`, `fp-z=${zoom}`);
  } else if (x !== undefined || y !== undefined) {
    params.push('crop=focalpoint', `fp-x=${x ?? 0.5}`, `fp-y=${y ?? 0.5}`);
  }
  return `${CDN}${photoId}?${params.join('&')}`;
}

/** Wide editorial crop for banners and hero imagery. */
export function editorial(photoId: string, options: Omit<ShotOptions, 'width' | 'height'> & { ratio?: 'portrait' | 'landscape' | 'tall' } = {}): string {
  const { ratio = 'portrait', ...rest } = options;
  const size =
    ratio === 'landscape' ? { width: 1200, height: 800 } : ratio === 'tall' ? { width: 1000, height: 1500 } : { width: 1000, height: 1250 };
  return shot(photoId, { ...rest, ...size });
}
